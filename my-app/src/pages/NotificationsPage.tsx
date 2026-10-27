import { useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Alert, Button, Chip, Paper, Stack, Typography } from '@mui/material';
import { DataGrid, GridActionsCellItem, type GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ConfirmDialog from '../components/ConfirmDialog';
import NotificationDetailsDialog from '../components/NotificationDetailsDialog';
import {
  useDeleteNotification,
  useMarkNotificationAsRead,
  useNotifications,
} from '../hooks/useNotifications';
import type { Notification } from '../types/notification';
import { formatDateTime, parseApiDate } from '../utils/formatDate';

export default function NotificationsPage() {
  const { enqueueSnackbar } = useSnackbar();
  const { data = [], isLoading, isFetching, error, refetch } = useNotifications();
  const markAsRead = useMarkNotificationAsRead();
  const deleteNotification = useDeleteNotification();

  const [viewingId, setViewingId] = useState<number | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Notification | null>(null);

  const handleMarkAsRead = async (notification: Notification) => {
    try {
      await markAsRead.mutateAsync(notification.id);
      enqueueSnackbar('Marked as read', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar((err as Error).message, { variant: 'error' });
    }
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteNotification.mutateAsync(pendingDelete.id);
      enqueueSnackbar('Notification deleted', { variant: 'success' });
      if (viewingId === pendingDelete.id) setViewingId(null);
    } catch (err) {
      enqueueSnackbar((err as Error).message, { variant: 'error' });
    } finally {
      setPendingDelete(null);
    }
  };

  // Only show the Category column once the API starts returning it.
  const hasCategory = data.some((n) => n.category);

  const columns = useMemo<GridColDef<Notification>[]>(
    () => [
      { field: 'id', headerName: 'ID', width: 80 },
      { field: 'title', headerName: 'Title', flex: 1, minWidth: 180 },
      { field: 'message', headerName: 'Message', flex: 2, minWidth: 240 },
      ...(hasCategory ? [{ field: 'category', headerName: 'Category', width: 130 }] : []),
      {
        field: 'isRead',
        headerName: 'Status',
        width: 110,
        type: 'boolean',
        renderCell: ({ value }: { value?: boolean }) => (
          <Chip
            size="small"
            color={value ? 'default' : 'primary'}
            label={value ? 'Read' : 'Unread'}
          />
        ),
      },
      {
        field: 'createdAt',
        headerName: 'Created',
        width: 190,
        type: 'dateTime',
        valueGetter: (value: string) => parseApiDate(value),
        valueFormatter: (value: Date | null) => formatDateTime(value),
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        width: 130,
        getActions: ({ row }) => [
          <GridActionsCellItem
            key="view"
            icon={<VisibilityIcon />}
            label="View"
            onClick={() => setViewingId(row.id)}
          />,
          <GridActionsCellItem
            key="read"
            icon={<DoneIcon />}
            label="Mark as read"
            disabled={row.isRead || markAsRead.isPending}
            onClick={() => handleMarkAsRead(row)}
          />,
          <GridActionsCellItem
            key="delete"
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => setPendingDelete(row)}
          />,
        ],
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hasCategory, markAsRead.isPending]
  );

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <Typography variant="h5" component="h1" sx={{ flexGrow: 1 }}>
          Notifications
        </Typography>
        <Button startIcon={<RefreshIcon />} onClick={() => refetch()} disabled={isFetching}>
          Refresh
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={RouterLink}
          to="/notifications/new"
        >
          New notification
        </Button>
      </Stack>

      {error && <Alert severity="error">{error.message}</Alert>}

      <Paper variant="outlined">
        <DataGrid
          autoHeight
          rows={data}
          columns={columns}
          loading={isLoading}
          disableRowSelectionOnClick
          onRowDoubleClick={({ row }) => setViewingId(row.id)}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
            sorting: { sortModel: [{ field: 'createdAt', sort: 'desc' }] },
          }}
          localeText={{ noRowsLabel: 'No notifications yet' }}
          sx={{ border: 0 }}
        />
      </Paper>

      <NotificationDetailsDialog
        notificationId={viewingId}
        onClose={() => setViewingId(null)}
        onMarkAsRead={handleMarkAsRead}
        onDelete={setPendingDelete}
        busy={markAsRead.isPending || deleteNotification.isPending}
      />

      <ConfirmDialog
        open={pendingDelete != null}
        title="Delete notification?"
        message={`"${pendingDelete?.title ?? ''}" will be permanently deleted.`}
        confirmLabel="Delete"
        confirmColor="error"
        loading={deleteNotification.isPending}
        onConfirm={handleConfirmDelete}
        onClose={() => setPendingDelete(null)}
      />
    </Stack>
  );
}
