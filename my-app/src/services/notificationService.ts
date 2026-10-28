import { http } from '../api/httpClient';
import type { CreateNotificationDto, Notification } from '../types/notification';

const RESOURCE = '/api/notifications';

type QueryOptions = { signal?: AbortSignal };

export const notificationService = {
  getAll: (options?: QueryOptions) => http.get<Notification[]>(RESOURCE, options),

  getById: (id: number, options?: QueryOptions) =>
    http.get<Notification>(`${RESOURCE}/${encodeURIComponent(id)}`, options),

  create: (dto: CreateNotificationDto) => http.post<Notification>(RESOURCE, dto),

  // The API has no general update endpoint; marking as read is the only supported edit.
  markAsRead: (id: number) => http.put<void>(`${RESOURCE}/${encodeURIComponent(id)}/read`),

  remove: (id: number) => http.delete(`${RESOURCE}/${encodeURIComponent(id)}`),
};
