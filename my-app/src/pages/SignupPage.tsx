import { Navigate, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import AuthForm from '../components/AuthForm';
import { authService } from '../services/authService';

export default function SignupPage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  if (authService.isAuthenticated()) return <Navigate to="/" replace />;

  return (
    <AuthForm
      title="Sign up"
      submitLabel="Create account"
      altText="Already have an account?"
      altLabel="Log in"
      altTo="/login"
      onSubmit={async (values) => {
        await authService.signup(values);
        enqueueSnackbar('Account created. Please log in.', { variant: 'success' });
        navigate('/login', { replace: true });
      }}
    />
  );
}
