import { Navigate, useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { authService } from '../services/authService';

export default function LoginPage() {
  const navigate = useNavigate();
  if (authService.isAuthenticated()) return <Navigate to="/" replace />;

  return (
    <AuthForm
      title="Log in"
      submitLabel="Log in"
      altText="No account?"
      altLabel="Sign up"
      altTo="/signup"
      onSubmit={async (values) => {
        await authService.login(values);
        navigate('/', { replace: true });
      }}
    />
  );
}
