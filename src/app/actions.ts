"use server";

import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

import { z } from "zod";

const InquirySchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  company: z.string().optional(),
  budget: z.enum([
    "< $10k",
    "$10k - $25k",
    "$25k - $50k",
    "$50k+",
    "Undisclosed",
  ]),
  service: z.enum([
    "Strategy",
    "Design",
    "Development",
    "Full Product",
    "Other",
  ]),
  message: z.string().min(10, "Tell us a bit more about the project"),
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

export async function submitInquiry(prevState: FormState, formData: FormData) {
  // Simulate delay for effect
  await new Promise((resolve) => setTimeout(resolve, 1000));

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

  try {
    await resend.emails.send({
      from: "Forae Inquiries <onboarding@resend.dev>", // Default Resend test email
      to: "create@foraefactory.com", // Delivers to the Resend account owner
      subject: `New Inquiry: ${name} - ${service}`,
      html: `
        <h2>New Project Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company || "N/A"}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Budget:</strong> ${budget}</p>
        <br/>
        <h3>Message:</h3>
        <p>${message}</p>
      `,
    });
  } catch (error) {
    console.error("Failed to send email:", error);
    // Continue - don't block success message for user even if email fails in dev
  }

  return {
    success: true,
    message: "Inquiry received. We'll be in touch shortly.",
  };
}
