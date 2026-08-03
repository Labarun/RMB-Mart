import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key");

const FROM_EMAIL = "RMBmart <noreply@rmbmart.com>";

export async function sendOrderPlacedEmail(email: string, name: string, orderNumber: string, amountGhs: number) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[Email Mock] Order Placed email would be sent to ${email} for order ${orderNumber}`);
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Order Placed - ${orderNumber}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Hello ${name},</h2>
          <p>Your exchange order <strong>${orderNumber}</strong> has been successfully placed.</p>
          <p>Please complete your payment of <strong>GH₵ ${amountGhs.toLocaleString()}</strong> via Mobile Money using the instructions on the payment page.</p>
          <p>Once you have paid, please submit your Transaction ID or a screenshot of the payment receipt so we can process your order.</p>
          <br/>
          <p>Thank you,<br/>The RMBmart Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send Order Placed email:", error);
  }
}

export async function sendPaymentReceivedEmail(email: string, name: string, orderNumber: string) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[Email Mock] Payment Received email would be sent to ${email} for order ${orderNumber}`);
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Payment Proof Received - ${orderNumber}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Hello ${name},</h2>
          <p>We have received your payment proof for order <strong>${orderNumber}</strong>.</p>
          <p>Our team is currently verifying the payment. Once verified, we will process your RMB transfer immediately.</p>
          <br/>
          <p>Thank you,<br/>The RMBmart Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send Payment Received email:", error);
  }
}

export async function sendOrderCompletedEmail(email: string, name: string, orderNumber: string, amountRmb: number) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[Email Mock] Order Completed email would be sent to ${email} for order ${orderNumber}`);
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Order Completed! - ${orderNumber}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Hello ${name},</h2>
          <p>Great news! Your order <strong>${orderNumber}</strong> has been successfully completed.</p>
          <p>We have transferred <strong>¥ ${amountRmb.toLocaleString()}</strong> to your specified account.</p>
          <p>Thank you for choosing RMBmart for your exchanges.</p>
          <br/>
          <p>Best regards,<br/>The RMBmart Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send Order Completed email:", error);
  }
}

export async function sendChatMessageEmail(email: string, name: string, orderNumber: string, message: string) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[Email Mock] Chat Message email would be sent to ${email} for order ${orderNumber}`);
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `New Message regarding Order ${orderNumber}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Hello ${name},</h2>
          <p>The admin has left a new message regarding your order <strong>${orderNumber}</strong>:</p>
          <blockquote style="border-left: 4px solid #10b981; padding-left: 16px; color: #475569; font-style: italic;">
            ${message}
          </blockquote>
          <p>Please log in to your dashboard to view the full details and reply.</p>
          <br/>
          <p>Thank you,<br/>The RMBmart Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send Chat Message email:", error);
  }
}
