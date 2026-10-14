"use server";

import { Resend } from "resend";
import { z } from "zod";

// The sender domain must be verified in Resend, otherwise sends to anyone other
// than the account owner are rejected. Override via env in production.
const FROM_ADDRESS =
  process.env.RESEND_FROM ?? "Forae Inquiries <onboarding@resend.dev>";
const TO_ADDRESS = process.env.RESEND_TO ?? "create@foraefactory.com";

const InquirySchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email: z.string().trim().email("Invalid email address"),
  company: z.string().trim().optional(),
  budget: z.enum(
    ["< $10k", "$10k - $25k", "$25k - $50k", "$50k+", "Undisclosed"],
    { errorMap: () => ({ message: "Please choose a budget range" }) }
  ),
  service: z.enum(
    ["Strategy", "Design", "Development", "Full Product", "Other"],
    { errorMap: () => ({ message: "Please choose a service" }) }
  ),
  message: z.string().trim().min(10, "Tell us a bit more about the project"),
});

export type FormState = {
  errors?: {
    name?: string[];
    email?: string[];
    company?: string[];
    budget?: string[];
    service?: string[];
    message?: string[];
  };
  message?: string;
  success?: boolean;
};

const SEND_FAILED_MESSAGE =
  "Something went wrong sending your inquiry. Please try again, or email create@foraefactory.com directly.";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function submitInquiry(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // Honeypot: real visitors never see or fill this field. Pretend it worked so
  // bots get no signal, but don't send anything.
  if (formData.get("website")) {
    return {
      success: true,
      message: "Inquiry received. We'll be in touch shortly.",
    };
  }

  const validatedFields = InquirySchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company") || undefined,
    budget: formData.get("budget"),
    service: formData.get("service"),
    message: formData.get("message"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please verify the fields and try again.",
      success: false,
    };
  }

  const { name, email, budget, service, company, message } =
    validatedFields.data;

  if (!process.env.RESEND_API_KEY) {
    console.error("Failed to send email: RESEND_API_KEY is not set");
    return { success: false, message: SEND_FAILED_MESSAGE };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const text = [
    "New Project Inquiry",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Company: ${company || "N/A"}`,
    `Service: ${service}`,
    `Budget: ${budget}`,
    "",
    "Message:",
    message,
  ].join("\n");

  try {
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: TO_ADDRESS,
      replyTo: email,
      subject: `New Inquiry: ${name} - ${service}`,
      text,
      html: `
        <h2>New Project Inquiry</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Company:</strong> ${escapeHtml(company || "N/A")}</p>
        <p><strong>Service:</strong> ${escapeHtml(service)}</p>
        <p><strong>Budget:</strong> ${escapeHtml(budget)}</p>
        <br/>
        <h3>Message:</h3>
        <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
      `,
    });

    if (error) {
      console.error("Failed to send email:", error);
      return { success: false, message: SEND_FAILED_MESSAGE };
    }
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, message: SEND_FAILED_MESSAGE };
  }

  return {
    success: true,
    message: "Inquiry received. We'll be in touch shortly.",
  };
}
