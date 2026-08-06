"use client";

import type { AnchorHTMLAttributes } from "react";
import Link from "next/link";

type ProjectCardProps = {
  slug: string;
  title: string;
  image: string;
  tags: readonly string[];
  hoverHandlers?: AnchorHTMLAttributes<HTMLAnchorElement>;
};

export function LiveProjectCard({ slug, title, image, tags, hoverHandlers }: ProjectCardProps) {
  return (
    <Link
      href={`/works/${slug}`}
      aria-label={`View ${title} project`}
      data-route-reveal
      {...hoverHandlers}
    >
      <img
        className="live-allWorksSurface"
        src="/assets/live/6Uts4kNiRmK7vPawupHp5UoAimg.png"
        alt=""
      />
      <span className="live-allWorksMedia">
        <img
          className="live-allWorksImage"
          data-project-media
          data-project-slug={slug}
          src={image}
          alt={`${title} project`}
        />
      </span>
      <div>
        <h2>{title}</h2>
        <div className="live-allWorksTags" aria-label="Project tags">
          {tags.map((tag) => (
            <span className="live-allWorksTag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
