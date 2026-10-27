import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AppProviders, { createQueryClient, routerFuture } from '../../AppProviders';
import CreateNotificationPage from '../CreateNotificationPage';
import { notificationService } from '../../services/notificationService';
import { ApiError } from '../../api/httpClient';

jest.mock('../../services/notificationService');
const mockedService = jest.mocked(notificationService);

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/notifications/new']} future={routerFuture}>
      <AppProviders router={false} queryClient={createQueryClient()}>
        <Routes>
          <Route path="/notifications/new" element={<CreateNotificationPage />} />
          <Route path="/notifications" element={<div>List page</div>} />
        </Routes>
      </AppProviders>
    </MemoryRouter>
  );
}

test('shows validation errors for empty fields', async () => {
  const user = userEvent.setup();
  renderPage();
  await user.click(screen.getByRole('button', { name: /create/i }));
  expect(await screen.findByText('Title is required')).toBeInTheDocument();
  expect(screen.getByText('Message is required')).toBeInTheDocument();
  expect(mockedService.create).not.toHaveBeenCalled();
});

test('creates the notification and navigates to the list', async () => {
  mockedService.create.mockResolvedValue({
    id: 1,
    userId: 'user-1',
    title: 'Server maintenance',
    message: 'Tonight at 10pm',
    isRead: false,
    createdAt: '2026-01-01T00:00:00Z',
  });
  const user = userEvent.setup();
  renderPage();
  await user.type(screen.getByLabelText(/title/i), '  Server maintenance ');
  await user.type(screen.getByLabelText(/message/i), 'Tonight at 10pm');
  await user.click(screen.getByRole('button', { name: /create/i }));

  expect(await screen.findByText('List page')).toBeInTheDocument();
  expect(mockedService.create).toHaveBeenCalledWith({
    title: 'Server maintenance',
    message: 'Tonight at 10pm',
  });
});

test('maps server validation errors onto fields', async () => {
  mockedService.create.mockRejectedValue(
    new ApiError('Validation failed', 400, { Title: ['Title is invalid on server'] })
  );
  const user = userEvent.setup();
  renderPage();
  await user.type(screen.getByLabelText(/title/i), 'x');
  await user.type(screen.getByLabelText(/message/i), 'y');
  await user.click(screen.getByRole('button', { name: /create/i }));

  await waitFor(() =>
    expect(screen.getByText('Title is invalid on server')).toBeInTheDocument()
  );
});
