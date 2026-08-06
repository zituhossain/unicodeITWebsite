"use client";

import { LiveProjectCard } from "./LiveProjectCard";
import { LiveTitle } from "./LiveShared";
import { ProjectHoverCursor, useProjectHoverCursor } from "./LiveSelectedWorks";

type WorkCard = {
  slug: string;
  title: string;
  image: string;
  tags: readonly string[];
};

export function LiveAllWorks({ workCards }: { workCards: WorkCard[] }) {
  const { hoverCursorRef, projectCursorHandlers } = useProjectHoverCursor();

  return (
    <section className="live-allWorks" data-section="all-works">
      <LiveTitle kicker="Works">All Works</LiveTitle>
      <div className="live-allWorksGrid">
        {workCards.map((work) => (
          <LiveProjectCard
            key={work.slug}
            slug={work.slug}
            title={work.title}
            image={work.image}
            tags={work.tags}
            hoverHandlers={projectCursorHandlers}
          />
        ))}
      </div>
      <ProjectHoverCursor cursorRef={hoverCursorRef} />
    </section>
  );
}
