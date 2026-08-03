import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .optional()
      .or(z.literal("")),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const orderFormSchema = z.object({
  amountRmb: z.number().positive("Amount must be greater than 0"),
  payoutType: z.enum(["ALIPAY", "WECHAT"]),
  recipientName: z.string().min(2, "Recipient name is required"),
  recipientAccountId: z.string().min(1, "Account ID is required"),
  recipientQrUrl: z.string().url().optional().or(z.literal("")),
});

export const updateRateSchema = z.object({
  rateGhsToRmb: z.number().positive("Rate must be greater than 0"),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "PROCESSING", "COMPLETED", "REFUNDED", "CANCELLED"]),
  externalTxnId: z.string().optional(),
  adminNotes: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type OrderInput = z.infer<typeof orderFormSchema>;
export type UpdateRateInput = z.infer<typeof updateRateSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
