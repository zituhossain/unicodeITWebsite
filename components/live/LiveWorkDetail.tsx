import Link from "next/link";
import type { Project } from "@/data/projects";
import { workListingProjects } from "@/data/projects";
import { CaseRelatedProjects } from "./LiveCaseDetail";
import { LiveTitle, ScaleCTA } from "./LiveShared";

function ProjectInfoItem({ label, values }: { label: string; values: readonly string[] }) {
  return <div className="live-workDetailInfoItem"><dt>{label}</dt><dd>{values.map((value) => <span key={value}>{value}</span>)}</dd></div>;
}

function ProjectDetailBlocks({ work }: { work: Project }) {
  return work.detailBlocks?.map((block, blockIndex) => {
    if (block.type === "image") {
      return <figure className="live-workDetailBodyMedia" style={{ aspectRatio: block.aspectRatio }} key={`${work.slug}-detail-${blockIndex}`}>
        <img data-route-media data-project-media data-project-slug={work.slug} src={block.image} alt={block.alt} loading="lazy" />
      </figure>;
    }

    return <section className="live-workDetailLongform" key={`${work.slug}-detail-${blockIndex}`}>
      <h2>{block.title}</h2>
      <div className="live-workDetailLongformContent">
        {block.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        {block.bullets && <ul>{block.bullets.map((item) => {
          if (typeof item === "string") return <li key={item}>{item}</li>;
          return <li key={item.lead}><strong>{item.lead}</strong>{item.body}</li>;
        })}</ul>}
        {block.groups?.map((group) => <div className="live-workDetailLongformGroup" key={group.title}>
          <h3>{group.title}</h3>
          <ul>{group.bullets.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>)}
        {block.closingParagraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>
    </section>;
  });
}

export function WorkDetailLive({ work }: { work: Project }) {
  const relatedProjects = workListingProjects.filter((project) => project.slug !== work.slug);

  return <main>
    <article className="live-workDetail" data-section="case-main" data-work={work.slug} data-detail-layout={work.detailLayout}>
      <header className="live-workDetailHeader">
        <Link className="live-caseBackLink" href="/works"><i aria-hidden="true"><span>←</span><span>←</span></i><b>Back to Projects</b></Link>
        <div className="live-workDetailIntro">
        <h1>{work.detailTitle ?? work.title}</h1>
        <dl className="live-workDetailInfo">
          <ProjectInfoItem label="Industry" values={work.industry} />
          <ProjectInfoItem label="Service Category" values={work.serviceCategory} />
          <ProjectInfoItem label="Service We Provided" values={work.servicesProvided} />
          <ProjectInfoItem label="Scope of Work" values={work.scopeOfWork} />
          {(work.links ?? (work.liveUrl ? [{ label: "Visit website", url: work.liveUrl }] : [])).map((link) => <div className="live-workDetailInfoItem" key={link.url}><dt>Links</dt><dd><a href={link.url} target="_blank" rel="noopener noreferrer"><span>{link.label}</span><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 11 11 5M6 5h5v5" /></svg></a></dd></div>)}
        </dl>
        <p className="live-workDetailSummary">{work.summary}</p>
        </div>
      </header>

      <div className="live-workDetailBody">
        <figure className="live-workDetailHeroMedia"><img data-route-media data-project-media data-project-slug={work.slug} src={work.heroImage} alt={`${work.title} project overview`} /></figure>
        {work.detailBlocks ? <ProjectDetailBlocks work={work} /> : <><section className="live-workDetailNarrative">
          <div><h2>Problems</h2><p>{work.problems}</p></div>
          <div><h2>Our Solutions</h2><ul>{work.solutions.map((solution) => <li key={solution}>{solution}</li>)}</ul></div>
        </section>

        {work.showcase.map((block, blockIndex) => <section className="live-workDetailShowcase" key={`${work.slug}-showcase-${blockIndex}`}>
          {(block.title || block.body) && <div className="live-workDetailShowcaseCopy">{block.title && <h2>{block.title}</h2>}{block.body && <p>{block.body}</p>}</div>}
          <div className={`live-workDetailImages live-workDetailImages--${block.layout ?? "full"}`}>
            {block.images.map((image, imageIndex) => <img data-route-media data-project-media data-project-slug={work.slug} src={image} alt={`${work.title} showcase ${imageIndex + 1}`} loading="lazy" key={image} />)}
          </div>
        </section>)}</>}
      </div>
    </article>

    <section className="live-otherProjects" data-section="other-projects">
      <LiveTitle kicker="Other Works" center>Explore Other<br />Projects</LiveTitle>
      <CaseRelatedProjects works={relatedProjects} />
    </section>
    <ScaleCTA />
  </main>;
}
