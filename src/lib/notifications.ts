import { OrderStatus } from "@prisma/client";

export interface NotificationPayload {
  orderId: string;
  orderNumber: string;
  userEmail: string;
  userName: string;
  newStatus: OrderStatus;
  adminNotes?: string | null;
}

import { sendOrderCompletedEmail } from "./email";
import { prisma } from "./prisma";

/**
 * Sends notifications (email/console logger) on order lifecycle updates.
 */
export async function sendOrderNotification(payload: NotificationPayload) {
  const { orderId, orderNumber, userEmail, userName, newStatus, adminNotes } = payload;

  const timestamp = new Date().toISOString();
  
  // Structured log for audit and debugging
  console.log(`[NOTIFICATION SYSTEM] [${timestamp}] Order ${orderNumber} (${orderId}) status updated to ${newStatus} for ${userName} (${userEmail})`);

  if (adminNotes) {
    console.log(`[NOTIFICATION SYSTEM] Admin Note attached: "${adminNotes}"`);
  }

  if (newStatus === "COMPLETED") {
    // Need amountRmb for the email, fetch it
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (order) {
      await sendOrderCompletedEmail(userEmail, userName, orderNumber, order.amountRmb);
    }
  }
}
