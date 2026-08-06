"use client";

import { useEffect, useState } from "react";
import type { RouteMotionState } from "@/components/motion/control";

export function LiveFaq({
  question,
  answer,
  index,
}: {
  question: string;
  answer: string;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const answerId = "faq-answer-" + index;
  const questionId = "faq-question-" + index;

  useEffect(() => {
    const listener = (event: Event) => {
      const state = (event as CustomEvent<{ state: RouteMotionState }>).detail
        ?.state;

      if (state === "expanded") setOpen(index === 0);
      else if (state === "initial" || state === "revealed") setOpen(false);
    };

    window.addEventListener("aexo:motion-state", listener);
    return () => window.removeEventListener("aexo:motion-state", listener);
  }, [index]);

  return (
    <article
      className={
        "live-faqCard faq-card" +
        (open ? " live-faqCardOpen faq-open" : "")
      }
      data-motion-faq={index}
      data-motion-state={open ? "expanded" : "collapsed"}
    >
      <button
        className="faq-question"
        id={questionId}
        type="button"
        aria-expanded={open}
        aria-controls={answerId}
        onClick={() => setOpen((current) => !current)}
      >
        <span>{question}</span>
        <i className="faq-plus" aria-hidden="true">
          <span />
          <span />
        </i>
      </button>
      <section
        className="faq-panel"
        id={answerId}
        aria-hidden={!open}
        aria-labelledby={questionId}
      >
        <div className="faq-panelInner">
          <span className="faq-divider" aria-hidden="true" />
          <div className="faq-answer">
            <p>{answer}</p>
          </div>
        </div>
      </section>
    </article>
  );
}
