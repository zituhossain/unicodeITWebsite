"use client";

/* eslint-disable @next/next/no-img-element */

import {
  type CSSProperties,
  type FormEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createContactMotion } from "@/components/motion/contact-motion";
import { contactServiceOptions } from "@/lib/contact-form-options";
import { CountryPhoneField } from "./CountryPhoneField";
import { RollingPrimaryButton } from "./RollingPrimaryButton";

type FormState = "idle" | "sending" | "success" | "error";
type RequiredFieldName = "email" | "service" | "budget" | "message";

const requiredFields: readonly RequiredFieldName[] = [
  "email",
  "service",
  "budget",
  "message",
];

function getNamedControl(form: HTMLFormElement, name: RequiredFieldName) {
  const control = form.elements.namedItem(name);
  return control instanceof HTMLInputElement ||
    control instanceof HTMLSelectElement ||
    control instanceof HTMLTextAreaElement
    ? control
    : null;
}

function collectInvalidFields(
  form: HTMLFormElement,
  touched: ReadonlySet<string>,
  submitAttempted: boolean,
) {
  const invalid = new Set<string>();
  for (const name of requiredFields) {
    const control = getNamedControl(form, name);
    if (!control) continue;
    if ((submitAttempted || touched.has(name)) && !control.checkValidity()) {
      invalid.add(name);
    }
  }
  return invalid;
}

export function LiveContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<FormState>("idle");
  const [isValid, setIsValid] = useState(false);
  const [touchedFields, setTouchedFields] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [invalidFields, setInvalidFields] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const [focusedField, setFocusedField] = useState<RequiredFieldName | null>(
    null,
  );

  const syncValidation = (
    nextTouched = touchedFields,
    nextSubmitAttempted = submitAttempted,
  ) => {
    const form = formRef.current;
    if (!form) return false;
    const nextValid = form.checkValidity();
    setIsValid(nextValid);
    setInvalidFields(
      collectInvalidFields(form, nextTouched, nextSubmitAttempted),
    );
    setState((current) => (current === "error" ? "idle" : current));
    return nextValid;
  };

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const sync = () => syncValidation();
    form.addEventListener("input", sync);
    form.addEventListener("change", sync);
    sync();
    return () => {
      form.removeEventListener("input", sync);
      form.removeEventListener("change", sync);
    };
  }, [submitAttempted, touchedFields]);

  useLayoutEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const params = new URLSearchParams(window.location.search);
    const deterministic =
      process.env.NODE_ENV !== "production" &&
      params.get("motion") === "paused";
    const runtime = createContactMotion({
      form,
      deterministic,
      reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    });
    return () => runtime.destroy();
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (state === "sending") return;

    if (!form.checkValidity()) {
      setSubmitAttempted(true);
      syncValidation(touchedFields, true);
      return;
    }

    setState("sending");
    const body = Object.fromEntries(new FormData(form));
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error();
      form.reset();
      setTouchedFields(new Set());
      setSubmitAttempted(false);
      setInvalidFields(new Set());
      setFocusedField(null);
      setIsValid(false);
      setState("success");
    } catch {
      setState("error");
    }
  }

  const touchField = (name: RequiredFieldName) => {
    const nextTouched = new Set(touchedFields);
    nextTouched.add(name);
    setTouchedFields(nextTouched);
    syncValidation(nextTouched, submitAttempted);
  };

  const updateField = () => {
    syncValidation();
  };

  const invalidAttr = (name: RequiredFieldName) =>
    invalidFields.has(name) ? "true" : undefined;

  const invalidStyle = (name: RequiredFieldName) =>
    invalidFields.has(name) && focusedField !== name
      ? ({
          outline: "1px solid #ff3b25",
          outlineOffset: "-1px",
          boxShadow: "0 0 0 3px rgba(255, 59, 37, .13)",
        } as CSSProperties)
      : undefined;

  const buttonLabel =
    state === "sending"
      ? "Sending..."
      : state === "success"
        ? "Message Sent"
        : state === "error"
          ? "Try Again"
          : "Submit Inquiry";

  return (
    <form
      ref={formRef}
      className="live-liveForm contact-live-form"
      data-contact-form
      data-form-state={state}
      data-form-valid={isValid || undefined}
      noValidate
      onInput={() => syncValidation()}
      onChange={() => syncValidation()}
      onSubmit={submit}
    >
      <img
        className="contact-corner-left"
        src="/assets/live/brand-cyan/al8BessOXQvdLkBex6RBcxQtJ9M.png"
        alt=""
      />
      <img
        className="contact-corner-right"
        src="/assets/live/brand-cyan/z6xuPZZvZXxALPYa8LR4mL7XLIA.png"
        alt=""
      />
      <label>
        <span>Full Name</span>
        <input
          name="name"
          autoComplete="name"
          placeholder="Your full name"
          maxLength={100}
          onInput={updateField}
        />
      </label>
      <label>
        <span>Company Name</span>
        <input
          name="company"
          autoComplete="organization"
          placeholder="Company name"
          maxLength={100}
          onInput={updateField}
        />
      </label>
      <label>
        <span>Email*</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Your email"
          required
          data-invalid={invalidAttr("email")}
          style={invalidStyle("email")}
          onInput={updateField}
          onFocus={() => setFocusedField("email")}
          onBlur={() => { setFocusedField(null); touchField("email"); }}
        />
      </label>
      <div className="contact-field">
        <span>WhatsApp Number</span>
        <CountryPhoneField onChange={() => syncValidation()} />
      </div>
      <label>
        <span>Service Required*</span>
        <select
          aria-label="Service Required"
          name="service"
          defaultValue=""
          required
          data-invalid={invalidAttr("service")}
          style={invalidStyle("service")}
          onInput={updateField}
          onChange={updateField}
          onFocus={() => setFocusedField("service")}
          onBlur={() => { setFocusedField(null); touchField("service"); }}
        >
          <option value="" disabled>
            Select your service
          </option>
          {contactServiceOptions.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>Service Budget*</span>
        <select
          aria-label="Service Budget"
          name="budget"
          defaultValue=""
          required
          data-invalid={invalidAttr("budget")}
          style={invalidStyle("budget")}
          onInput={updateField}
          onChange={updateField}
          onFocus={() => setFocusedField("budget")}
          onBlur={() => { setFocusedField(null); touchField("budget"); }}
        >
          <option value="" disabled>
            Select your range
          </option>
          <option>Under $2K</option>
          <option>$2K - $5K</option>
          <option>$5K - $10K</option>
          <option>$10K - $25K</option>
          <option>$25K+</option>
        </select>
      </label>
      <label className="contact-message-field">
        <span>Message*</span>
        <textarea
          name="message"
          placeholder="Briefly describe your project, goals, challenges, and expected timeline"
          required
          data-invalid={invalidAttr("message")}
          style={invalidStyle("message")}
          onInput={updateField}
          onFocus={() => setFocusedField("message")}
          onBlur={() => { setFocusedField(null); touchField("message"); }}
        />
      </label>
      <input
        className="live-honeypot"
        name="website"
        tabIndex={-1}
        autoComplete="off"
      />
      <RollingPrimaryButton
        className="contact-submit contact-submit-shared"
        variant="wide"
        tone="red"
        centered
        data-form-state={state}
        type="submit"
        disabled={!isValid || state === "sending"}
        aria-disabled={!isValid || state === "sending"}
        aria-busy={state === "sending"}
      >
        {buttonLabel}
      </RollingPrimaryButton>
      <p className="contact-privacy-note">
        We&apos;ll reply within 12 hours. Your info is kept private.
      </p>
      <p className="live-formStatus contact-status" aria-live="polite">
        {state === "success"
          ? "Thanks - your message has been sent."
          : state === "error"
            ? "Delivery failed. Please email hello@aexo.studio."
            : ""}
      </p>
    </form>
  );
}
