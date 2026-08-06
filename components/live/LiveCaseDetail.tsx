"use client";

import type { Project } from "@/data/projects";
import { LiveProjectCard } from "./LiveProjectCard";
import { ProjectHoverCursor, useProjectHoverCursor } from "./LiveSelectedWorks";

export function CaseRelatedProjects({ works }: { works: readonly Project[] }) {
  const { hoverCursorRef, projectCursorHandlers } = useProjectHoverCursor();

  return (
    <>
      <div className="live-allWorksGrid">
        {works.map((work) => (
          <LiveProjectCard
            key={work.slug}
            slug={work.slug}
            title={work.title}
            image={work.listing}
            tags={work.tags}
            hoverHandlers={projectCursorHandlers}
          />
        ))}
      </div>
      <ProjectHoverCursor cursorRef={hoverCursorRef} />
    </>
  );
}
