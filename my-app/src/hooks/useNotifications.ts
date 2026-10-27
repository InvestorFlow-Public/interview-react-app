import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ApiError } from '../api/httpClient';
import { notificationService } from '../services/notificationService';
import type { Notification } from '../types/notification';

export const notificationKeys = {
  all: ['notifications'] as const,
  detail: (id: number | null) => ['notifications', id] as const,
};

export function useNotifications() {
  return useQuery<Notification[], ApiError>({
    queryKey: notificationKeys.all,
    queryFn: ({ signal }) => notificationService.getAll({ signal }),
  });
}

export function useNotification(id: number | null, { enabled = true } = {}) {
  return useQuery<Notification, ApiError>({
    queryKey: notificationKeys.detail(id),
    queryFn: ({ signal }) => notificationService.getById(id as number, { signal }),
    enabled: enabled && id != null,
  });
}

// Every mutation refreshes the list and any cached detail views.
function useNotificationMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>
) {
  const queryClient = useQueryClient();
  return useMutation<TData, ApiError, TVariables>({
    // Pass only the variables; React Query also supplies a context argument services shouldn't receive.
    mutationFn: (variables) => mutationFn(variables),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationKeys.all }),
  });
}

export const useCreateNotification = () => useNotificationMutation(notificationService.create);
export const useMarkNotificationAsRead = () => useNotificationMutation(notificationService.markAsRead);
export const useDeleteNotification = () => useNotificationMutation(notificationService.remove);
