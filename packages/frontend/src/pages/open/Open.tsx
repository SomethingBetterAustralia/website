import { useReducedMotion } from 'motion/react';
import { OpenSky } from '@/components/open';
import { Caveat } from '@/components/prose';
import { OpenArtefacts } from './OpenArtefacts';
import { OpenAustralianWork } from './OpenAustralianWork';
import { OpenFinalCta } from './OpenFinalCta';
import { OpenHero } from './OpenHero';
import { OpenPremise } from './OpenPremise';
import { type ReduceMotion } from './OpenShared';

export function Open() {
  const reduce = useReducedMotion();
  return (
    <div className="flex flex-col gap-16 px-6 pb-24 pt-6 min-[880px]:gap-24 min-[880px]:px-12 min-[880px]:pt-10">
      <OpenHero reduce={reduce} />
      <OpenSkySection />
      <OpenPremise reduce={reduce} />
      <OpenArtefacts reduce={reduce} />
      <OpenOutsideAustralia reduce={reduce} />
      <OpenAustralianWork reduce={reduce} />
      <OpenFinalCta reduce={reduce} />
    </div>
  );
}

function OpenSkySection() {
  return (
    <section className="mx-auto w-full max-w-5xl">
      <div className="relative mx-auto w-full max-w-[820px] overflow-hidden rounded-3xl bg-sb-navy shadow-[0_18px_40px_rgba(8,31,52,0.18)] ring-1 ring-sb-navy">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-sb-accent/15 mix-blend-soft-light blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-16 size-64 rounded-full bg-sb-accent-hot/15 mix-blend-soft-light blur-3xl"
        />
        <OpenSky />
      </div>
      <p className="mx-auto mt-4 max-w-[58ch] text-center text-sm italic leading-[1.6] text-sb-text-muted">
        Working in the open, in case any of this turns out to be useful elsewhere.
      </p>
    </section>
  );
}

function OpenOutsideAustralia({ reduce }: { reduce: ReduceMotion }) {
  return (
    <Caveat reduce={reduce}>
      If you&rsquo;re reading from outside Australia and any of this resonates &mdash; as an
      organiser, a researcher, a journalist, or someone wondering what a movement like this
      could look like where you are &mdash; please get in touch. We are not running
      international chapters and we have no plans to. But we are happy to share what we&rsquo;re
      learning, send you the relevant repos, introduce you to people in our network where it
      makes sense, and learn from whatever you build. There is nothing to join from outside
      Australia yet. There is a conversation to have.
    </Caveat>
  );
}
