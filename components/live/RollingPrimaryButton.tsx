import type { ButtonHTMLAttributes, ReactNode } from "react";

type RollingPrimaryButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  children: ReactNode;
  variant?: "compact" | "wide" | "small";
  tone?: "white" | "red";
  centered?: boolean;
};

export function RollingPrimaryButton({
  children,
  variant = "wide",
  tone = "red",
  centered = false,
  className = "",
  type = "button",
  ...buttonProps
}: RollingPrimaryButtonProps) {
  const arrow =
    tone === "red"
      ? "/assets/live/brand-cyan/BQFGBP7rOiJsOjI0KKyLLQcyBLk.png"
      : "/assets/live/kM9jSUZLyWdbxIqG89MSUiTPTg.png";
  const dataVariant =
    tone === "red"
      ? centered
        ? "2"
        : "1"
      : centered || variant === "wide"
        ? "2"
        : "1";

  return (
    <button
      {...buttonProps}
      type={type}
      className={`rolling-primary ${variant === "compact" ? "rolling-compact" : variant === "small" ? "rolling-small" : "rolling-wide"} ${tone === "red" ? "rolling-red" : ""} ${centered ? "rolling-centered" : ""} ${className}`}
      data-rolling-button="primary"
      data-rolling-kind={tone === "red" ? "red" : "white"}
      data-rolling-variant={dataVariant}
    >
      <span className="rolling-well" aria-hidden="true">
        <span className="rolling-fill">
          <span className="rolling-arrow-rail">
            <img
              className="rolling-arrow rolling-arrow-outgoing"
              src={arrow}
              alt=""
            />
          </span>
          <span className="rolling-label rolling-label-incoming">
            {children}
          </span>
        </span>
      </span>
      <span className="rolling-label rolling-label-outgoing">{children}</span>
    </button>
  );
}
