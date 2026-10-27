// Mirrors NotificationItem in the API (ASP.NET serialises properties as camelCase).
export interface Notification {
  id: number;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  /** UTC timestamp; may be returned without a zone suffix. */
  createdAt: string;
  /** Not yet returned by the API; populated once categorisation is implemented. */
  category?: string | null;
}

// Mirrors CreateNotificationDto in the API.
export interface CreateNotificationDto {
  title: string;
  message: string;
}
