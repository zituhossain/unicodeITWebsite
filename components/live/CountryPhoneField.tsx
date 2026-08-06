"use client";

import { type KeyboardEvent, useEffect, useId, useRef, useState } from "react";
import * as FlagIcons from "country-flag-icons/react/3x2";

type Country = { code: string; name: string; dial: string };

const countries: Country[] = [
  ["AF", "Afghanistan", "+93"],
  ["AX", "Åland Islands", "+358"],
  ["AL", "Albania", "+355"],
  ["DZ", "Algeria", "+213"],
  ["AS", "American Samoa", "+1"],
  ["US", "United States", "+1"],
  ["CA", "Canada", "+1"],
  ["GB", "United Kingdom", "+44"],
  ["AU", "Australia", "+61"],
  ["BD", "Bangladesh", "+880"],
  ["IN", "India", "+91"],
  ["PK", "Pakistan", "+92"],
  ["AE", "United Arab Emirates", "+971"],
  ["SA", "Saudi Arabia", "+966"],
  ["SG", "Singapore", "+65"],
  ["MY", "Malaysia", "+60"],
  ["ID", "Indonesia", "+62"],
  ["PH", "Philippines", "+63"],
  ["JP", "Japan", "+81"],
  ["KR", "South Korea", "+82"],
  ["CN", "China", "+86"],
  ["HK", "Hong Kong", "+852"],
  ["NZ", "New Zealand", "+64"],
  ["DE", "Germany", "+49"],
  ["FR", "France", "+33"],
  ["IT", "Italy", "+39"],
  ["ES", "Spain", "+34"],
  ["PT", "Portugal", "+351"],
  ["NL", "Netherlands", "+31"],
  ["BE", "Belgium", "+32"],
  ["CH", "Switzerland", "+41"],
  ["AT", "Austria", "+43"],
  ["SE", "Sweden", "+46"],
  ["NO", "Norway", "+47"],
  ["DK", "Denmark", "+45"],
  ["FI", "Finland", "+358"],
  ["IE", "Ireland", "+353"],
  ["PL", "Poland", "+48"],
  ["CZ", "Czechia", "+420"],
  ["GR", "Greece", "+30"],
  ["RO", "Romania", "+40"],
  ["UA", "Ukraine", "+380"],
  ["TR", "Turkey", "+90"],
  ["IL", "Israel", "+972"],
  ["ZA", "South Africa", "+27"],
  ["EG", "Egypt", "+20"],
  ["NG", "Nigeria", "+234"],
  ["KE", "Kenya", "+254"],
  ["GH", "Ghana", "+233"],
  ["BR", "Brazil", "+55"],
  ["MX", "Mexico", "+52"],
  ["AR", "Argentina", "+54"],
  ["CL", "Chile", "+56"],
  ["CO", "Colombia", "+57"],
  ["PE", "Peru", "+51"],
  ["UG", "Uganda", "+256"],
]
  .map(([code, name, dial]) => ({ code, name, dial }))
  .sort((a, b) => a.name.localeCompare(b.name));

function CountryFlag({ code }: { code: string }) {
  const Flag = FlagIcons[code as keyof typeof FlagIcons];
  return Flag ? (
    <Flag className="contact-country-flag" aria-hidden="true" />
  ) : null;
}

export function CountryPhoneField({ onChange }: { onChange: () => void }) {
  const listboxId = `contact-country-list-${useId().replace(/:/g, "")}`;
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [country, setCountry] = useState(
    () => countries.find(({ code }) => code === "US")!,
  );
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const filtered = countries.filter(({ name, dial }) =>
    `${name} ${dial}`.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const closeAndFocus = () => {
    setOpen(false);
    requestAnimationFrame(() =>
      rootRef.current
        ?.querySelector<HTMLButtonElement>(".contact-country-trigger")
        ?.focus(),
    );
  };

  const toggle = () => {
    setOpen((value) => !value);
    setQuery("");
    setActiveIndex(
      Math.max(
        0,
        countries.findIndex(({ code }) => code === country.code),
      ),
    );
  };

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    requestAnimationFrame(() => searchRef.current?.focus());
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const option = listboxRef.current?.querySelector<HTMLElement>(
      `[data-country-index="${activeIndex}"]`,
    );
    option?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  const choose = (next: Country) => {
    setCountry(next);
    setOpen(false);
    setQuery("");
    onChange();
    requestAnimationFrame(() =>
      rootRef.current
        ?.querySelector<HTMLButtonElement>(".contact-country-trigger")
        ?.focus(),
    );
  };

  const onSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeAndFocus();
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((index) =>
        Math.max(0, Math.min(filtered.length - 1, index + direction)),
      );
    }
    if (event.key === "Enter" && filtered[activeIndex]) {
      event.preventDefault();
      choose(filtered[activeIndex]);
    }
  };

  return (
    <div className={`contact-phone${open ? " is-open" : ""}`} ref={rootRef}>
      <input type="hidden" name="whatsappCountry" value={country.code} />
      <input type="hidden" name="whatsappDialCode" value={country.dial} />
      <button
        className="contact-country-trigger"
        type="button"
        aria-label={`Country code, ${country.name} ${country.dial}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={toggle}
        onKeyDown={(event) => {
          if (!open && event.key === "ArrowDown") {
            event.preventDefault();
            toggle();
          }
        }}
      >
        <CountryFlag code={country.code} />
        <i aria-hidden="true" />
        <span>{country.dial}</span>
      </button>
      <input
        className="contact-phone-input"
        name="whatsappNumber"
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        aria-label="WhatsApp Number"
        placeholder="123 456 789"
        onInput={onChange}
      />
      {open && (
        <div
          className="contact-country-menu"
          onWheel={(event) => event.stopPropagation()}
          onTouchMove={(event) => event.stopPropagation()}
        >
          <div className="contact-country-search">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="6" />
              <path d="m16 16 4 4" />
            </svg>
            <input
              ref={searchRef}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={onSearchKeyDown}
              aria-label="Search countries"
              placeholder="Search country"
              role="combobox"
              aria-controls={listboxId}
              aria-expanded="true"
              aria-activedescendant={
                filtered[activeIndex]
                  ? `${listboxId}-${filtered[activeIndex].code}`
                  : undefined
              }
            />
          </div>
          <div
            id={listboxId}
            ref={listboxRef}
            role="listbox"
            aria-label="Countries"
            onWheel={(event) => event.stopPropagation()}
            onTouchMove={(event) => event.stopPropagation()}
          >
            {filtered.map((item, index) => (
              <button
                id={`${listboxId}-${item.code}`}
                data-country-index={index}
                type="button"
                role="option"
                aria-selected={item.code === country.code}
                className={`${index === activeIndex ? "is-active " : ""}${item.code === country.code ? "is-selected" : ""}`}
                key={item.code}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => choose(item)}
              >
                <CountryFlag code={item.code} />
                <span>{item.name}</span>
                <b>{item.dial}</b>
                <i className="contact-country-check" aria-hidden="true">
                  ✓
                </i>
              </button>
            ))}
            {!filtered.length && <p>No countries found</p>}
          </div>
        </div>
      )}
    </div>
  );
}
