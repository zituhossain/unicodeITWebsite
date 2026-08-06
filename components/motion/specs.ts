export type MotionRoute = "home" | "works" | "work-detail" | "pricing" | "about" | "contact" | "404" | "policy";

export type RevealPolicy = {
  selector: string;
  start: string;
  reverse: boolean;
  fromX?: number;
  fromY?: number;
  duration: number;
  stagger?: number;
};

export type RouteMotionSpec = {
  route: MotionRoute;
  load: "home" | "contact" | "about" | "static";
  reveals: RevealPolicy[];
};

/** Values copied from the purchased project's `withMagnet` Framer override. */
export const magneticMotion = {
  mass: 1,
  stiffness: 400,
  damping: 40,
  distance: .1,
} as const;

const specs: Record<MotionRoute, RouteMotionSpec> = {
  home: {
    route: "home",
    load: "home",
    reveals: [{ selector: "[data-reveal]", start: "top 50%", reverse: false, fromY: 44, duration: 1 }],
  },
  works: {
    route: "works",
    load: "static",
    reveals: [{ selector: "[data-route-reveal]", start: "top 68%", reverse: true, fromY: 32, duration: .9, stagger: .06 }],
  },
  "work-detail": { route: "work-detail", load: "static", reveals: [] },
  pricing: {
    route: "pricing",
    load: "static",
    reveals: [{ selector: "[data-route-reveal]", start: "top 62%", reverse: true, fromY: 32, duration: .9, stagger: .06 }],
  },
  about: { route: "about", load: "about", reveals: [] },
  contact: {
    route: "contact",
    // The contact component owns its entrance, card reveals and logo rail.
    // Keeping generic reveals here installs a second ScrollTrigger/timeline
    // whose ordering changes between direct loads and App Router revisits.
    load: "static",
    reveals: [],
  },
  "404": { route: "404", load: "static", reveals: [] },
  policy: { route: "policy", load: "static", reveals: [] },
};

export function resolveRouteMotionSpec(pathname: string): RouteMotionSpec {
  if (pathname === "/") return specs.home;
  if (pathname === "/works") return specs.works;
  if (pathname.startsWith("/works/")) return specs["work-detail"];
  if (pathname === "/pricing") return specs.pricing;
  if (pathname === "/about") return specs.about;
  if (pathname === "/contact") return specs.contact;
  if (pathname === "/404") return specs["404"];
  return specs.policy;
}
