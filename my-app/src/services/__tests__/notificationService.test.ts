import { notificationService } from '../notificationService';
import { ApiError } from '../../api/httpClient';

const fetchMock = jest.fn();

function mockFetch(status: number, body?: unknown) {
  global.fetch = fetchMock.mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    text: () => Promise.resolve(body === undefined ? '' : JSON.stringify(body)),
  });
}

afterEach(() => {
  fetchMock.mockReset();
});

test('getAll fetches the notifications list', async () => {
  mockFetch(200, [{ id: 1, title: 'Hi' }]);
  await expect(notificationService.getAll()).resolves.toEqual([{ id: 1, title: 'Hi' }]);
  expect(fetchMock).toHaveBeenCalledWith(
    '/api/notifications',
    expect.objectContaining({ method: 'GET' })
  );
});

test('create posts JSON', async () => {
  mockFetch(201, { id: 7 });
  await notificationService.create({ title: 'T', message: 'M' });
  const [url, init] = fetchMock.mock.calls[0];
  expect(url).toBe('/api/notifications');
  expect(init.method).toBe('POST');
  expect(init.body).toBe(JSON.stringify({ title: 'T', message: 'M' }));
  expect(init.headers).toMatchObject({ 'Content-Type': 'application/json' });
});

test('markAsRead and remove hit the expected endpoints', async () => {
  mockFetch(204);
  await expect(notificationService.markAsRead(3)).resolves.toBeNull();
  await notificationService.remove(3);
  expect(fetchMock.mock.calls.map(([url, { method }]: [string, RequestInit]) => `${method} ${url}`)).toEqual([
    'PUT /api/notifications/3/read',
    'DELETE /api/notifications/3',
  ]);
});

test('errors are surfaced as ApiError with field errors', async () => {
  mockFetch(400, { title: 'One or more validation errors occurred.', errors: { Title: ['Too long'] } });
  const error = await notificationService.create({ title: 'x', message: 'y' }).catch((e) => e);
  expect(error).toBeInstanceOf(ApiError);
  expect(error.status).toBe(400);
  expect(error.fieldErrors).toEqual({ Title: ['Too long'] });
});

test('404 without a body produces a helpful message', async () => {
  mockFetch(404);
  await expect(notificationService.getById(1)).rejects.toThrow(/not found/i);
});
