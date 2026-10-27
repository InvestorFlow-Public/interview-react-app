import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Paper, Typography } from '@mui/material';
import NotificationForm from '../components/NotificationForm';
import { useCreateNotification } from '../hooks/useNotifications';
import type { CreateNotificationDto } from '../types/notification';

export default function CreateNotificationPage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const createNotification = useCreateNotification();

  const handleSubmit = async (values: CreateNotificationDto) => {
    await createNotification.mutateAsync(values);
    enqueueSnackbar('Notification created', { variant: 'success' });
    navigate('/notifications');
  };

  return (
    <Paper variant="outlined" sx={{ p: 4, maxWidth: 720, mx: 'auto' }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Create notification
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        The notification will be added to the signed-in user&apos;s inbox.
      </Typography>
      <NotificationForm
        submitLabel="Create"
        onSubmit={handleSubmit}
        onCancel={() => navigate('/notifications')}
      />
    </Paper>
  );
}
