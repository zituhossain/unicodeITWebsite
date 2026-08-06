import Matter from "matter-js";

export const CTA_PHYSICS_CONFIG = Object.freeze({
  density: 0.001,
  // The purchased CTA passes these values through a `friction` prop, while
  // its connected Physics module reads `frictionOptions`. Framer therefore
  // runs the module defaults below. Matching that effective runtime behavior
  // is what produces the reference tumbling, collisions, and slow settling.
  friction: 0.1,
  frictionAir: 0.01,
  gravityX: 0,
  gravityY: 0.75,
  mouseStiffness: 0.631,
  mouseAngularStiffness: 0.19,
  walls: Object.freeze({ top: true, right: true, bottom: true, left: true }),
});

type BodyRuntime = {
  body: Matter.Body;
  element: HTMLElement;
  field: 0 | 1;
};

type FieldRuntime = {
  bodies: BodyRuntime[];
  container: HTMLElement | null;
  engine: Matter.Engine;
  height: number;
  sleepingEnabled: boolean;
  width: number;
  x: number;
  y: number;
};

type DragRuntime = {
  constraint: Matter.Constraint;
  field: FieldRuntime;
  pointerId: number;
} | null;

export type CtaPhysicsInspection = {
  activeBodies: number;
  bodies: Array<{ angle: number; field: "left" | "right"; sleeping: boolean; x: number; y: number }>;
  deterministic: boolean;
  enabled: boolean;
  intersecting: boolean;
  reduced: boolean;
  running: boolean;
};

export type CtaPhysicsRuntime = {
  destroy: () => void;
  inspect: () => CtaPhysicsInspection;
  pause: () => void;
  play: () => void;
  refresh: () => void;
  setPhase: (progress: number) => void;
  settle: () => void;
};

type CreateCtaPhysicsOptions = {
  deterministic: boolean;
  reduced: boolean;
  root: HTMLElement;
};

const frameDelta = 1_000 / 60;
const phaseFrames = 360;

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function seededRandom(index: number) {
  const value = Math.sin((index + 1) * 12.9898) * 43_758.5453;
  return value - Math.floor(value);
}

function addWalls(field: FieldRuntime) {
  const options = { isStatic: true, friction: 2 };
  const { Bodies, World } = Matter;
  const walls = [
    Bodies.rectangle(field.width / 2, field.height + 50, field.width + 100, 100, options),
    Bodies.rectangle(field.width / 2, -50, field.width + 100, 100, options),
    Bodies.rectangle(field.width + 50, field.height / 2, 100, field.height, options),
    Bodies.rectangle(-50, field.height / 2, 100, field.height, options),
  ];
  World.add(field.engine.world, walls);
}

export function createCtaPhysics({ root, reduced, deterministic }: CreateCtaPhysicsOptions): CtaPhysicsRuntime | null {
  const elements = Array.from(root.querySelectorAll<HTMLElement>("[data-scale-tag]"));
  if (!elements.length) return null;

  let fields: [FieldRuntime, FieldRuntime] | null = null;
  let frame = 0;
  // Arm the field now, but do not let the badges fall and settle while the
  // visitor is still above the CTA. MotionProvider starts it on viewport entry.
  let running = false;
  let phone = false;
  let variant: "desktop" | "tablet" | "phone" = "desktop";
  let destroyed = false;
  let drag: DragRuntime = null;

  root.dataset.ctaPhysicsDensity = String(CTA_PHYSICS_CONFIG.density);
  root.dataset.ctaPhysicsFriction = String(CTA_PHYSICS_CONFIG.friction);
  root.dataset.ctaPhysicsAir = String(CTA_PHYSICS_CONFIG.frictionAir);
  root.dataset.ctaPhysicsGravity = `${CTA_PHYSICS_CONFIG.gravityX},${CTA_PHYSICS_CONFIG.gravityY}`;
  root.dataset.ctaPhysicsMouse = `${CTA_PHYSICS_CONFIG.mouseStiffness},${CTA_PHYSICS_CONFIG.mouseAngularStiffness}`;
  root.dataset.ctaPhysicsEngine = "matter-js";

  const allBodies = () => fields ? [...fields[0].bodies, ...fields[1].bodies] : [];

  const updateInspection = () => {
    const inspection = inspect();
    root.dataset.ctaPhysics = phone ? "hidden" : deterministic ? "deterministic" : reduced ? "reduced" : running ? "running" : "paused";
    root.dataset.ctaPhysicsActive = String(inspection.activeBodies);
    root.dataset.ctaPhysicsIntersecting = "true";
    root.dataset.ctaPhysicsSnapshot = inspection.bodies.map((body) => `${body.field}:${body.x},${body.y},${body.angle},${body.sleeping ? 1 : 0}`).join(";");
  };

  const paint = () => {
    if (!fields) return;
    allBodies().forEach(({ body, element, field }) => {
      const vertex = body.vertices[0];
      const fieldRuntime = fields?.[field];
      if (!fieldRuntime) return;
      const offsetX = fieldRuntime.container ? 0 : fieldRuntime.x;
      const offsetY = fieldRuntime.container ? 0 : fieldRuntime.y;
      element.style.visibility = "visible";
      element.style.left = `${(offsetX + vertex.x).toFixed(3)}px`;
      element.style.top = `${(offsetY + vertex.y).toFixed(3)}px`;
      element.style.transform = `translate(-50%, -50%) rotate(${body.angle}rad) translate(50%, 50%)`;
      element.dataset.physicsSide = field === 0 ? "left" : "right";
      element.dataset.physicsSleeping = String(body.isSleeping);
      element.dataset.physicsX = body.position.x.toFixed(3);
      element.dataset.physicsY = body.position.y.toFixed(3);
      element.dataset.physicsRotation = (body.angle * 180 / Math.PI).toFixed(3);
    });
    updateInspection();
  };

  const clearFields = () => {
    if (!fields) return;
    fields.forEach((field) => {
      Matter.World.clear(field.engine.world, false);
      Matter.Engine.clear(field.engine);
    });
    fields = null;
  };

  const createField = (index: 0 | 1, width: number, height: number, x: number, y: number, container: HTMLElement | null): FieldRuntime => {
    const sleepingEnabled = index === 0;
    const engine = Matter.Engine.create({
      enableSleeping: sleepingEnabled,
      gravity: { x: CTA_PHYSICS_CONFIG.gravityX, y: CTA_PHYSICS_CONFIG.gravityY },
    });
    const field: FieldRuntime = { bodies: [], container, engine, height, sleepingEnabled, width, x, y };
    addWalls(field);
    return field;
  };

  const rebuild = (seeded = deterministic || reduced) => {
    clearFields();
    const rootRect = root.getBoundingClientRect();
    phone = window.matchMedia("(max-width: 809.98px)").matches;
    variant = phone ? "phone" : rootRect.width < 1_200 ? "tablet" : "desktop";
    elements.forEach((element) => {
      element.style.removeProperty("left");
      element.style.removeProperty("top");
      element.style.removeProperty("transform");
      element.style.removeProperty("visibility");
      element.style.removeProperty("--tag-x");
      element.style.removeProperty("--tag-y");
      element.style.removeProperty("--tag-rotate");
      element.style.display = phone ? "none" : "";
    });
    if (phone) {
      updateInspection();
      return;
    }

    const containers = Array.from(root.querySelectorAll<HTMLElement>("[data-physics-field]"));
    const tablet = variant === "tablet";
    const fallback = [
      { width: tablet ? 314 : 496, height: tablet ? 631 : 630, x: 0, y: tablet ? rootRect.height - 630 : rootRect.height - 632 },
      { width: tablet ? 325 : 496, height: 630, x: rootRect.width - (tablet ? 325 : 496), y: rootRect.height - 632 },
    ] as const;
    fields = [0, 1].map((fieldIndex) => {
      const container = containers[fieldIndex] ?? null;
      if (!container) {
        const geometry = fallback[fieldIndex];
        return createField(fieldIndex as 0 | 1, geometry.width, geometry.height, geometry.x, geometry.y, null);
      }
      const rect = container.getBoundingClientRect();
      return createField(fieldIndex as 0 | 1, rect.width, rect.height, rect.left - rootRect.left, rect.top - rootRect.top, container);
    }) as [FieldRuntime, FieldRuntime];

    elements.forEach((element, index) => {
      const fieldIndex = index < 4 ? 0 : 1;
      const field = fields?.[fieldIndex];
      if (!field) return;
      const width = element.offsetWidth;
      const height = element.offsetHeight;
      const randomX = seeded ? seededRandom(index * 2) : Math.random();
      const randomY = seeded ? seededRandom(index * 2 + 1) : Math.random();
      const maxLeft = field.width - width;
      const maxTop = field.height - height;
      const left = Math.floor(randomX * maxLeft);
      const top = Math.floor(randomY * maxTop);
      const body = Matter.Bodies.rectangle(left, top, width, height, {
        density: CTA_PHYSICS_CONFIG.density,
        friction: CTA_PHYSICS_CONFIG.friction,
        frictionAir: CTA_PHYSICS_CONFIG.frictionAir,
        isStatic: false,
      });
      // Matter.Composites.stack translates every callback body by half its
      // bounds, making the random values above the body's top-left corner.
      Matter.Body.translate(body, { x: width / 2, y: height / 2 });
      const runtime: BodyRuntime = { body, element, field: fieldIndex };
      field.bodies.push(runtime);
      Matter.World.add(field.engine.world, body);
    });
    paint();
  };

  const advance = (count = 1) => {
    if (!fields || phone) return;
    for (let index = 0; index < count; index += 1) {
      Matter.Engine.update(fields[0].engine, frameDelta);
      Matter.Engine.update(fields[1].engine, frameDelta);
    }
  };

  const settle = () => {
    if (phone) return;
    advance(phaseFrames);
    paint();
  };

  const setPhase = (progress: number) => {
    if (phone) return;
    rebuild(true);
    advance(Math.round(clamp(progress, 0, 1) * phaseFrames));
    paint();
  };

  const inspect = (): CtaPhysicsInspection => ({
    activeBodies: allBodies().filter(({ body }) => !body.isSleeping).length,
    bodies: allBodies().map(({ body, field }) => ({
      angle: Number((body.angle * 180 / Math.PI).toFixed(3)),
      field: field === 0 ? "left" : "right",
      sleeping: body.isSleeping,
      x: Number(body.position.x.toFixed(3)),
      y: Number(body.position.y.toFixed(3)),
    })),
    deterministic,
    enabled: !phone,
    intersecting: true,
    reduced,
    running: running && document.visibilityState !== "hidden" && !phone,
  });

  const tick = () => {
    if (destroyed) return;
    if (running && document.visibilityState !== "hidden" && !phone) {
      // The purchased component paints first and then advances Matter by its
      // default fixed step on every animation frame.
      paint();
      advance();
    }
    frame = requestAnimationFrame(tick);
  };

  const pointFor = (event: PointerEvent, field: FieldRuntime) => {
    const rect = root.getBoundingClientRect();
    return { x: event.clientX - rect.left - field.x, y: event.clientY - rect.top - field.y };
  };

  const onPointerDown = (event: PointerEvent) => {
    if (!fields || phone || reduced || deterministic) return;
    const element = (event.target as Element | null)?.closest<HTMLElement>("[data-scale-tag]");
    const runtime = allBodies().find((candidate) => candidate.element === element);
    if (!runtime) return;
    const field = fields[runtime.field];
    const point = pointFor(event, field);
    const localPoint = Matter.Vector.rotate(Matter.Vector.sub(point, runtime.body.position), -runtime.body.angle);
    const constraint = Matter.Constraint.create({
      bodyB: runtime.body,
      pointA: point,
      pointB: localPoint,
      stiffness: CTA_PHYSICS_CONFIG.mouseStiffness,
    });
    (constraint as Matter.Constraint & { angularStiffness: number }).angularStiffness = CTA_PHYSICS_CONFIG.mouseAngularStiffness;
    Matter.Sleeping.set(runtime.body, false);
    Matter.World.add(field.engine.world, constraint);
    drag = { constraint, field, pointerId: event.pointerId };
    root.setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    drag.constraint.pointA = pointFor(event, drag.field);
  };

  const onPointerUp = (event: PointerEvent) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    Matter.World.remove(drag.field.engine.world, drag.constraint);
    drag = null;
    root.releasePointerCapture?.(event.pointerId);
  };

  const onResize = () => {
    const nextVariant = window.matchMedia("(max-width: 809.98px)").matches
      ? "phone"
      : root.getBoundingClientRect().width < 1_200 ? "tablet" : "desktop";
    if (nextVariant !== variant) {
      rebuild(deterministic || reduced);
      return;
    }
    if (!fields) return;
    const rootRect = root.getBoundingClientRect();
    fields.forEach((field) => {
      if (!field.container) return;
      const rect = field.container.getBoundingClientRect();
      field.x = rect.left - rootRect.left;
      field.y = rect.top - rootRect.top;
    });
    paint();
  };
  const onVisibility = () => updateInspection();

  rebuild();
  if (reduced) settle();
  else if (deterministic) setPhase(.5);
  root.addEventListener("pointerdown", onPointerDown);
  root.addEventListener("pointermove", onPointerMove);
  root.addEventListener("pointerup", onPointerUp);
  root.addEventListener("pointercancel", onPointerUp);
  window.addEventListener("resize", onResize);
  document.addEventListener("visibilitychange", onVisibility);
  frame = requestAnimationFrame(tick);

  return {
    destroy: () => {
      destroyed = true;
      cancelAnimationFrame(frame);
      if (drag) Matter.World.remove(drag.field.engine.world, drag.constraint);
      drag = null;
      root.removeEventListener("pointerdown", onPointerDown);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerup", onPointerUp);
      root.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      clearFields();
      elements.forEach((element) => {
        element.style.removeProperty("left");
        element.style.removeProperty("top");
        element.style.removeProperty("transform");
        element.style.removeProperty("visibility");
        element.style.removeProperty("display");
        delete element.dataset.physicsSide;
        delete element.dataset.physicsSleeping;
        delete element.dataset.physicsX;
        delete element.dataset.physicsY;
        delete element.dataset.physicsRotation;
      });
      delete root.dataset.ctaPhysics;
      delete root.dataset.ctaPhysicsActive;
      delete root.dataset.ctaPhysicsIntersecting;
      delete root.dataset.ctaPhysicsSnapshot;
      delete root.dataset.ctaPhysicsEngine;
    },
    inspect,
    pause: () => {
      running = false;
      updateInspection();
    },
    play: () => {
      if (!reduced && !deterministic) running = true;
      updateInspection();
    },
    refresh: () => rebuild(deterministic || reduced),
    setPhase,
    settle,
  };
}
