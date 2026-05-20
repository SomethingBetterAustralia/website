import { ArrowUpRight, Headphones, Pause, Play, Star } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { useRef, useState } from 'react';
import posterUrl from '@/assets/triplej_hack_charlotte_mortlock.avif';
import { Button } from '@/components/ui/button';
import { revealUp, staggerContainer } from '@/lib/motion';

export interface FeaturedStoryProps {
  outlet: string;
  outletDate: string;
  headline: string;
  summary: string;
  url: string;
  audioUrl: string;
}

export function FeaturedStory({
  outlet,
  outletDate,
  headline,
  summary,
  url,
  audioUrl,
}: FeaturedStoryProps) {
  const reduce = useReducedMotion();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  function togglePlay() {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      void el.play();
    } else {
      el.pause();
    }
  }

  return (
    <motion.section
      initial={reduce ? false : 'hidden'}
      animate="visible"
      variants={staggerContainer}
      className="grid gap-6 min-[880px]:grid-cols-[1.1fr_1fr] min-[880px]:items-center min-[880px]:gap-10"
    >
      <motion.div
        variants={revealUp}
        className="group relative aspect-video overflow-hidden rounded-3xl bg-sb-navy text-sb-cream shadow-[0_18px_40px_rgba(8,31,52,0.18)] ring-1 ring-sb-navy"
      >
        <img
          src={posterUrl}
          alt=""
          aria-hidden
          className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-sb-navy/40 via-sb-navy/55 to-sb-navy/90"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-sb-accent/15 mix-blend-soft-light blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-16 size-64 rounded-full bg-sb-accent-hot/15 mix-blend-soft-light blur-3xl"
        />
        <div className="relative flex h-full flex-col justify-between p-6 min-[880px]:p-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-sb-cream/80">
            <Headphones aria-hidden className="size-4" />
            {outlet} · {outletDate}
          </div>
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause the interview' : 'Play the interview'}
              className="flex size-20 items-center justify-center rounded-full bg-sb-accent text-sb-navy shadow-[0_8px_24px_rgba(212,166,73,0.45)] transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sb-accent/40"
            >
              {isPlaying ? (
                <Pause aria-hidden className="size-8 fill-current" />
              ) : (
                <Play aria-hidden className="size-8 translate-x-0.5 fill-current" />
              )}
            </button>
          </div>
          <p className="font-display text-sm font-medium italic tracking-[-0.02em] text-sb-cream/90">
            {isPlaying ? 'Playing — 23-minute interview' : 'Press play — 23-minute interview'}
          </p>
        </div>
        <audio
          ref={audioRef}
          src={audioUrl}
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        />
      </motion.div>

      <motion.div variants={revealUp} className="flex flex-col gap-4">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-sb-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-sb-accent-hot">
          <Star aria-hidden className="size-3.5" />
          Featured story
        </span>
        <h2 className="font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-medium italic leading-[1.1] tracking-[-0.04em] text-sb-accent">
          {headline}
        </h2>
        <p className="text-[1.05rem] leading-[1.6] text-sb-text">{summary}</p>
        <Button
          asChild
          className="mt-2 self-start rounded-full bg-sb-accent text-sb-white hover:bg-sb-accent-hot focus-visible:ring-sb-accent"
        >
          <a href={url} target="_blank" rel="noopener noreferrer">
            <Headphones aria-hidden className="size-4" />
            Listen on ABC
            <ArrowUpRight aria-hidden className="size-4" />
          </a>
        </Button>
      </motion.div>
    </motion.section>
  );
}
