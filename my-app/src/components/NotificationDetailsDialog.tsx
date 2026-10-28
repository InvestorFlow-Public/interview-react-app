import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { useNotification } from '../hooks/useNotifications';
import type { Notification } from '../types/notification';
import { formatDateTime } from '../utils/formatDate';

interface NotificationDetailsDialogProps {
  /** The notification to show; `null` closes the dialog. */
  notificationId: number | null;
  onClose: () => void;
  onMarkAsRead: (notification: Notification) => void;
  onDelete: (notification: Notification) => void;
  busy?: boolean;
}

export default function NotificationDetailsDialog({
  notificationId,
  onClose,
  onMarkAsRead,
  onDelete,
  busy = false,
}: Readonly<NotificationDetailsDialogProps>) {
  const open = notificationId != null;
  const { data, isLoading, error } = useNotification(notificationId, { enabled: open });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Notification details</DialogTitle>
      <DialogContent dividers>
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}
        {error && <Alert severity="error">{error.message}</Alert>}
        {data && (
          <Stack spacing={2}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Typography variant="h6" sx={{ flexGrow: 1, wordBreak: 'break-word' }}>
                {data.title}
              </Typography>
              {data.category && <Chip size="small" label={data.category} />}
              <Chip
                size="small"
                color={data.isRead ? 'default' : 'primary'}
                label={data.isRead ? 'Read' : 'Unread'}
              />
            </Stack>
            <Typography sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {data.message}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Created {formatDateTime(data.createdAt)} · ID {data.id}
            </Typography>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        {data && (
          <Button color="error" onClick={() => onDelete(data)} disabled={busy}>
            Delete
          </Button>
        )}
        {data && !data.isRead && (
          <Button onClick={() => onMarkAsRead(data)} disabled={busy}>
            Mark as read
          </Button>
        )}
        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
