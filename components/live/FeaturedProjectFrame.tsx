/* eslint-disable @next/next/no-img-element */

import type { ReactNode } from "react";

type FeaturedProjectFrameProps = {
  variant: "browser" | "works";
  className?: string;
  viewportClassName?: string;
  toolbar?: ReactNode;
  progress?: ReactNode;
  children: ReactNode;
};

const frameAssets = {
  browser: "/assets/live/269s6g8NfMPp0Qq9CNdgoaPUM.png",
  works: "/assets/live/brand-cyan/Ea995q8deCj9b3t43hhutnE8.png",
} as const;

export function FeaturedProjectFrame({
  variant,
  className = "",
  viewportClassName = "",
  toolbar,
  progress,
  children,
}: FeaturedProjectFrameProps) {
  return <div className={`featured-projectFrame featured-projectFrame--${variant} ${className}`.trim()}>
    <img
      className="featured-projectFrameShell"
      src={frameAssets[variant]}
      alt=""
      aria-hidden="true"
    />
    {toolbar}
    <div className={`featured-projectViewport ${viewportClassName}`.trim()}>
      {children}
    </div>
    {progress}
  </div>;
}
