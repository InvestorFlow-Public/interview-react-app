import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import CreateNotificationPage from './pages/CreateNotificationPage';
import LoginPage from './pages/LoginPage';
import NotificationsPage from './pages/NotificationsPage';
import SignupPage from './pages/SignupPage';
import { authService } from './services/authService';

function RequireAuth() {
  return authService.isAuthenticated() ? <Layout /> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignupPage />} />
      <Route element={<RequireAuth />}>
        <Route index element={<Navigate to="/notifications" replace />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="notifications/new" element={<CreateNotificationPage />} />
        <Route path="*" element={<Navigate to="/notifications" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
