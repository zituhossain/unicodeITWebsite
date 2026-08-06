"use client";

import { FormEvent, useState } from "react";
import { ArrowIcon } from "./Header";

export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">("idle");
  
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); 
    setState("sending");
    const form = event.currentTarget;
    const body = Object.fromEntries(new FormData(form));
    try {
      const response = await fetch("/api/contact", { 
        method: "POST", 
        headers: { "content-type": "application/json" }, 
        body: JSON.stringify(body) 
      });
      if (!response.ok) throw new Error("delivery");
      form.reset(); 
      setState("success");
    } catch { 
      setState("error"); 
    }
  }

  return (
    <form className="flex flex-col" onSubmit={submit}>
      <label className="flex flex-col border-b border-[#aaa] py-[25px]">
        <span className="font-medium text-[10px] font-mono text-[#777] uppercase mb-[12px]">Your name</span>
        <input 
          name="name" 
          placeholder="Your name" 
          required 
          minLength={2} 
          className="border-0 outline-none bg-transparent text-[#111] text-[19px] resize-none placeholder:text-[#333]"
        />
      </label>
      <label className="flex flex-col border-b border-[#aaa] py-[25px]">
        <span className="font-medium text-[10px] font-mono text-[#777] uppercase mb-[12px]">Your email</span>
        <input 
          name="email" 
          type="email" 
          placeholder="Your email" 
          required 
          className="border-0 outline-none bg-transparent text-[#111] text-[19px] resize-none placeholder:text-[#333]"
        />
      </label>
      <label className="flex flex-col border-b border-[#aaa] py-[25px]">
        <span className="font-medium text-[10px] font-mono text-[#777] uppercase mb-[12px]">Your budget</span>
        <select 
          name="budget" 
          required 
          defaultValue=""
          className="border-0 outline-none bg-transparent text-[#111] text-[19px] resize-none placeholder:text-[#333]"
        >
          <option value="" disabled>Select your budget</option>
          <option>$1,000 - $3,000</option>
          <option>$3,000 - $5,000</option>
          <option>$5,000 or Above</option>
        </select>
      </label>
      <label className="flex flex-col border-b border-[#aaa] py-[25px]">
        <span className="font-medium text-[10px] font-mono text-[#777] uppercase mb-[12px]">Your message</span>
        <textarea 
          name="message" 
          placeholder="Your Message" 
          required 
          minLength={10} 
          rows={5} 
          className="border-0 outline-none bg-transparent text-[#111] text-[19px] resize-none placeholder:text-[#333]"
        />
      </label>
      <input 
        className="!absolute !left-[-10000px]" 
        name="website" 
        tabIndex={-1} 
        autoComplete="off" 
        aria-hidden="true" 
      />
      <button 
        className="inline-flex items-center justify-between gap-[22px] border border-[#111] rounded-[100px] pt-[5px] pr-[5px] pb-[5px] pl-[22px] font-medium text-[13px] leading-none font-mono tracking-[-0.25px] transition-[color,background-color,transform] duration-350 hover:bg-white hover:text-[#111] hover:-translate-y-[2px] [&>svg]:w-[39px] [&>svg]:h-[39px] [&>svg]:p-[9px] [&>svg]:rounded-full [&>svg]:bg-red [&>svg]:text-white [&>svg]:transition-transform [&>svg]:duration-350 hover:[&>svg]:rotate-[-35deg] self-start mt-[32px] bg-transparent disabled:opacity-50" 
        type="submit" 
        disabled={state === "sending"}
      >
        <span>{state === "sending" ? "SENDING" : "BOOK A CALL"}</span>
        <ArrowIcon />
      </button>
      <p className="min-h-[22px] text-[#666]" aria-live="polite">
        {state === "success" ? "Thanks — your message is on its way." : state === "error" ? "Something went wrong. Please email hello@aexo.design." : ""}
      </p>
    </form>
  );
}
