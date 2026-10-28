import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import CreateNotificationPage from './pages/CreateNotificationPage';
import NotificationsPage from './pages/NotificationsPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/notifications" replace />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="notifications/new" element={<CreateNotificationPage />} />
        <Route path="*" element={<Navigate to="/notifications" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
