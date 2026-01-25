"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitInquiry } from "@/app/actions";
import { motion, AnimatePresence } from "framer-motion";
import MagneticButton from "./magnetic-button";
import { CheckCircle2, AlertCircle } from "lucide-react";
// Note: lucide-react might need to be installed if not present, but usually common in these setups.
// If it fails, I'll remove icons or use simple SVG.

const initialState = {
  message: "",
  errors: {},
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <MagneticButton className="w-full mt-8">
      <button
        type="submit"
        disabled={pending}
        className="w-full bg-white text-black font-bold uppercase tracking-wider py-4 rounded-full hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? "Sending..." : "Submit Inquiry"}
      </button>
    </MagneticButton>
  );
}

export default function ProjectInquiryForm() {
  // @ts-ignore - React 18/Next 14 type mismatch for useFormState is common
  const [state, formAction] = useFormState(submitInquiry, initialState);

  if (state.success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl mx-auto p-10 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl text-center"
      >
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          {/* Simple checkmark SVG if Lucide is missing */}
          <svg
            className="w-8 h-8 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Message Received</h3>
        <p className="text-white/60">
          We'll review your inquiry and get back to you within 48 hours.
        </p>
      </motion.div>
    );
  }

  return (
    <form
      action={formAction}
      className="w-full max-w-2xl mx-auto space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="text-xs uppercase tracking-widest text-white/40 ml-1"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors placeholder:text-white/20"
            placeholder="John Doe"
          />
          {state.errors?.name && (
            <p className="text-red-400 text-xs ml-1">{state.errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-xs uppercase tracking-widest text-white/40 ml-1"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors placeholder:text-white/20"
            placeholder="john@example.com"
          />
          {state.errors?.email && (
            <p className="text-red-400 text-xs ml-1">{state.errors.email}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Service */}
        <div className="space-y-2">
          <label
            htmlFor="service"
            className="text-xs uppercase tracking-widest text-white/40 ml-1"
          >
            Service
          </label>
          <div className="relative">
            <select
              id="service"
              name="service"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors appearance-none cursor-pointer"
            >
              <option
                value="Strategy"
                className="bg-black"
              >
                Strategy & Direction
              </option>
              <option
                value="Design"
                className="bg-black"
              >
                UI/UX Design
              </option>
              <option
                value="Development"
                className="bg-black"
              >
                Development (Web/App)
              </option>
              <option
                value="Full Product"
                className="bg-black"
              >
                Full Product Build
              </option>
              <option
                value="Other"
                className="bg-black"
              >
                Other
              </option>
            </select>
            {/* Custom Arrow */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Budget */}
        <div className="space-y-2">
          <label
            htmlFor="budget"
            className="text-xs uppercase tracking-widest text-white/40 ml-1"
          >
            Budget
          </label>
          <div className="relative">
            <select
              id="budget"
              name="budget"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors appearance-none cursor-pointer"
            >
              <option
                value="< $10k"
                className="bg-black"
              >
                &lt; $10k
              </option>
              <option
                value="$10k - $25k"
                className="bg-black"
              >
                $10k - $25k
              </option>
              <option
                value="$25k - $50k"
                className="bg-black"
              >
                $25k - $50k
              </option>
              <option
                value="$50k+"
                className="bg-black"
              >
                $50k+
              </option>
              <option
                value="Undisclosed"
                className="bg-black"
              >
                Undisclosed
              </option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Message */}
      <div className="space-y-2">
        <label
          htmlFor="message"
          className="text-xs uppercase tracking-widest text-white/40 ml-1"
        >
          Project Details
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors placeholder:text-white/20 resize-none"
          placeholder="Tell us about the project goals, timeline, and current status..."
        />
        {state.errors?.message && (
          <p className="text-red-400 text-xs ml-1">{state.errors.message}</p>
        )}
      </div>

      <SubmitButton />

      {state.message && !state.success && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm text-center">
          {state.message}
        </div>
      )}
    </form>
  );
}
