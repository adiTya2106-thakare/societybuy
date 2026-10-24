/**
 * Notification Service
 * In development: logs to console.
 * In production: extend to send push/email via configured provider.
 */

import { prisma } from "@/lib/db";

type NotificationType = string;

interface NotificationPayload {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type: any;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

export const notificationService = {
  async send(userId: string, payload: NotificationPayload): Promise<void> {
    try {
      await prisma.notification.create({
        data: {
          userId,
          type: payload.type,
          title: payload.title,
          body: payload.body,
          data: payload.data ?? {},
        },
      });

      if (process.env.NODE_ENV === "development") {
        console.log(
          `[NOTIFICATION] → ${userId}: [${payload.type}] ${payload.title}`
        );
      }
    } catch (err) {
      console.error("[NOTIFICATION] Failed to send notification:", err);
    }
  },

  async sendToMany(
    userIds: string[],
    payload: NotificationPayload
  ): Promise<void> {
    await Promise.all(userIds.map((id) => this.send(id, payload)));
  },

  async markRead(notificationId: string, userId: string): Promise<void> {
    await prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true, readAt: new Date() },
    });
  },

  async markAllRead(userId: string): Promise<void> {
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
  },
};
