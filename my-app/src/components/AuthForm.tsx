import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { Alert, Box, Button, Link, Paper, Stack, TextField, Typography } from '@mui/material';
import type { Credentials } from '../types/auth';

interface AuthFormProps {
  title: string;
  submitLabel: string;
  /** Throw to show the error message above the form. */
  onSubmit: (values: Credentials) => Promise<void>;
  altText: string;
  altLabel: string;
  altTo: string;
}

export default function AuthForm({
  title,
  submitLabel,
  onSubmit,
  altText,
  altLabel,
  altTo,
}: Readonly<AuthFormProps>) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Credentials>({ defaultValues: { email: '', password: '' }, mode: 'onTouched' });

  const submit = async (values: Credentials) => {
    try {
      await onSubmit(values);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong.';
      setError('root.server', { type: 'server', message });
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', bgcolor: 'grey.50', p: 2 }}>
      <Paper sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <Box component="form" noValidate onSubmit={handleSubmit(submit)}>
          <Stack spacing={3}>
            <Typography variant="h5">{title}</Typography>
            {errors.root?.server && <Alert severity="error">{errors.root.server.message}</Alert>}

            <TextField
              label="Email"
              type="email"
              autoComplete="email"
              fullWidth
              required
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
              })}
            />

            <TextField
              label="Password"
              type="password"
              autoComplete={title === 'Log in' ? 'current-password' : 'new-password'}
              fullWidth
              required
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Password must be at least 8 characters' },
              })}
            />

            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {submitLabel}
            </Button>

            <Typography variant="body2">
              {altText}{' '}
              <Link component={RouterLink} to={altTo}>
                {altLabel}
              </Link>
            </Typography>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
