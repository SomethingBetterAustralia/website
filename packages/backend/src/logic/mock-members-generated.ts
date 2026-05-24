// MOCK: procedurally-generated member set. Hand-picked anchor positions feed a
// seeded PRNG that fills per-portfolio responses; economicAxis / socialAxis are
// derived via scoreSummaryAxis so the data is consistent with the scoring
// contract. Flip USE_HARDCODED_RESPONSES in mock-members.ts to swap in the
// hand-typed dataset.

import type {
  PortfolioResponses,
  LikertResponse,
} from '../types/survey.js';
import type { PortfolioScore, MemberProfile } from '../types/people.js';
import { SURVEY_DEFINITION } from './survey-definition.js';
import { scorePortfolio, scoreSummaryAxis } from './survey-scoring.js';

const SEED = 0xc0ffee;

// mulberry32 — a small, well-known 32-bit seeded PRNG. Returns a function
// that emits floats in [0, 1). Deterministic across calls / restarts.
function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Anchor = readonly [number, number];

const LEADERSHIP_ANCHORS: readonly Anchor[] = [
  [50, 65],
  [40, 55],
  [60, 45],
  [-50, 65],
  [-40, 55],
  [-60, 45],
  [-50, -65],
  [-40, -55],
  [-60, -45],
  [50, -65],
  [40, -55],
  [60, -45],
  [10, 25],
  [-15, -20],
  [30, -10],
];

interface Identity {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly background: string;
}

const IDENTITIES: readonly Identity[] = [
  { id: 'm-001', name: 'Eleni Marchetti', role: 'Founder', background: 'Former public-policy lead, Sydney' },
  { id: 'm-002', name: 'Daniel Karpinski', role: 'Co-chair', background: 'Climate scientist, Melbourne' },
  { id: 'm-003', name: 'Yvette Karangi', role: 'Policy lead (economy)', background: 'Macro-economist, ANU' },
  { id: 'm-004', name: 'Hamish Treadwell', role: 'Policy lead (climate)', background: 'Energy systems engineer' },
  { id: 'm-005', name: 'Priya Lakhani', role: 'Policy lead (social)', background: 'Public-health physician' },
  { id: 'm-006', name: 'Bruno Cardoso', role: 'Policy lead (defence)', background: 'Retired RAAF officer' },
  { id: 'm-007', name: 'Margot Linden', role: 'Treasurer', background: 'Chartered accountant, Brisbane' },
  { id: 'm-008', name: 'Liam Whitcombe', role: 'Secretary', background: 'Corporate-law associate' },
  { id: 'm-009', name: 'Anita Coatsworth', role: 'Membership director', background: 'Community organiser, regional VIC' },
  { id: 'm-010', name: 'Theo Vassilakis', role: 'Communications lead', background: 'Former ABC producer' },
  { id: 'm-011', name: 'Renee Holborow', role: 'Policy lead (health)', background: 'Aged-care consultant' },
  { id: 'm-012', name: 'Toby Quintrell', role: 'Policy lead (education)', background: 'Maths teacher and curriculum designer' },
  { id: 'm-043', name: 'Yusuf Belir', role: 'Policy lead (industry & trade)', background: 'Former Productivity Commission economist, Sydney' },
  { id: 'm-044', name: 'Tania Rourke', role: 'Policy lead (agriculture & regions)', background: 'Farm-business consultant, Wagga Wagga' },
  { id: 'm-045', name: 'Nina Whitlam', role: 'Policy lead (technology & digital)', background: 'Cybersecurity researcher, Canberra' },
  { id: 'm-013', name: 'Sarah Cavendish', role: 'Member', background: 'GP in regional NSW' },
  { id: 'm-014', name: 'Marcus Penberthy', role: 'Member', background: 'Software engineer, Adelaide' },
  { id: 'm-015', name: 'Aroha Sutherland', role: 'Member', background: 'Primary-school teacher' },
  { id: 'm-016', name: 'Jin Park', role: 'Member', background: 'Small-business owner (hospitality)' },
  { id: 'm-017', name: 'Catherine Rowe', role: 'Member', background: 'Retired army officer' },
  { id: 'm-018', name: 'Felix Donnellan', role: 'Member', background: 'Social worker, outer Melbourne' },
  { id: 'm-019', name: 'Imogen Boyce', role: 'Member', background: 'Agronomist, Riverina' },
  { id: 'm-020', name: 'Mateo Sanchez', role: 'Member', background: 'Accountant, North Sydney' },
  { id: 'm-021', name: 'Hannah Greengrass', role: 'Member', background: 'Critical-care nurse' },
  { id: 'm-022', name: 'Joel Patapere', role: 'Member', background: 'Carpenter and small builder' },
  { id: 'm-023', name: 'Olivia Trent', role: 'Member', background: 'Civil engineer (transport)' },
  { id: 'm-024', name: 'Sam Olusoga', role: 'Member', background: 'Freelance journalist' },
  { id: 'm-025', name: 'Penny Drewett', role: 'Member', background: 'Family lawyer' },
  { id: 'm-026', name: 'Rajiv Bhandari', role: 'Member', background: 'Town planner' },
  { id: 'm-027', name: 'Naomi Trevorrow', role: 'Member', background: 'University lecturer (history)' },
  { id: 'm-028', name: 'Ben Voss', role: 'Member', background: 'Marine biologist, Hobart' },
  { id: 'm-029', name: 'Lachlan Quirk', role: 'Member', background: 'Self-employed electrician' },
  { id: 'm-030', name: 'Anika Saxena', role: 'Member', background: 'Paramedic' },
  { id: 'm-031', name: 'Pia Costanzo', role: 'Member', background: 'Dentist, Perth' },
  { id: 'm-032', name: 'Ezra Brock', role: 'Member', background: 'Café owner, Geelong' },
  { id: 'm-033', name: 'Tessa Maguire', role: 'Member', background: 'Public librarian' },
  { id: 'm-034', name: 'Joon-ho Kang', role: 'Member', background: 'Council planner, Western Sydney' },
  { id: 'm-035', name: 'Owen Trist', role: 'Member', background: 'Mining engineer, WA' },
  { id: 'm-036', name: 'Sophie Whelan', role: 'Member', background: 'Primary teacher, Darwin' },
  { id: 'm-037', name: 'Amaru Cordova', role: 'Member', background: 'Refugee resettlement worker' },
  { id: 'm-038', name: 'Henrik Lassiter', role: 'Member', background: 'Freight forwarder, Port Botany' },
  { id: 'm-039', name: "Bridie O'Toole", role: 'Member', background: 'Midwife, regional QLD' },
  { id: 'm-040', name: 'Caleb Yarrow', role: 'Member', background: 'Independent podcast producer' },
  { id: 'm-041', name: 'Niamh Coughlan', role: 'Member', background: 'Plumber, Newcastle' },
  { id: 'm-042', name: 'Vivian Kerr', role: 'Member', background: 'Energy market analyst' },
];

const NULL_PROB_BY_EXPERTISE: Record<1 | 2 | 3 | 4 | 5, number> = {
  1: 0.6,
  2: 0.45,
  3: 0.2,
  4: 0.05,
  5: 0,
};

const LIKERT_VALUES: ReadonlyArray<-2 | -1 | 0 | 1 | 2> = [-2, -1, 0, 1, 2];

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function generateGeneralAnchors(
  prng: () => number,
  count: number,
  existing: readonly Anchor[],
): readonly Anchor[] {
  const placed: Anchor[] = existing.map((a) => [a[0], a[1]]);
  const out: Anchor[] = [];
  let safety = 0;
  while (out.length < count && safety < 5000) {
    safety += 1;
    const x = Math.round(prng() * 180 - 90);
    const y = Math.round(prng() * 180 - 90);
    const tooClose = placed.some(([px, py]) => Math.hypot(px - x, py - y) <= 9);
    if (tooClose) continue;
    out.push([x, y]);
    placed.push([x, y]);
  }
  if (out.length < count) {
    throw new Error('mock-members anchor placement failed');
  }
  return out;
}

function shuffleSeeded<T>(input: readonly T[], prng: () => number): T[] {
  const arr = input.slice();
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(prng() * (i + 1));
    const tmp = arr[i] as T;
    arr[i] = arr[j] as T;
    arr[j] = tmp;
  }
  return arr;
}

function sampleLikertBiased(target100: number, prng: () => number): -2 | -1 | 0 | 1 | 2 {
  const mean = target100 / 50;
  const noise = (prng() + prng() + prng() - 1.5) * 0.55;
  const rounded = Math.round(mean + noise);
  const clamped = clamp(rounded, -2, 2);
  return LIKERT_VALUES[clamped + 2] as -2 | -1 | 0 | 1 | 2;
}

function sampleLikertUniform(prng: () => number): -2 | -1 | 0 | 1 | 2 {
  return LIKERT_VALUES[Math.floor(prng() * LIKERT_VALUES.length)] as -2 | -1 | 0 | 1 | 2;
}

function generateMember(
  idx: number,
  identity: Identity,
  anchor: Anchor,
  prng: () => number,
): MemberProfile {
  const expertCount = 2 + Math.floor(prng() * 2);
  const moderateCount = 3 + Math.floor(prng() * 2);

  const portfolioIds = SURVEY_DEFINITION.portfolios.map((d) => d.id);
  const shuffled = shuffleSeeded(portfolioIds, prng);

  const expertiseByPortfolio: Record<string, 1 | 2 | 3 | 4 | 5> = {};
  shuffled.forEach((id, i) => {
    if (i < expertCount) {
      expertiseByPortfolio[id] = (4 + Math.floor(prng() * 2)) as 4 | 5;
    } else if (i < expertCount + moderateCount) {
      expertiseByPortfolio[id] = 3;
    } else {
      expertiseByPortfolio[id] = (1 + Math.floor(prng() * 2)) as 1 | 2;
    }
  });

  const portfolios: Record<string, PortfolioResponses> = {};
  for (const portfolio of SURVEY_DEFINITION.portfolios) {
    const expertise = expertiseByPortfolio[portfolio.id] as 1 | 2 | 3 | 4 | 5;
    const nullProb = NULL_PROB_BY_EXPERTISE[expertise];
    const responses: Record<string, LikertResponse> = {};
    for (const item of portfolio.items) {
      if (prng() < nullProb) {
        responses[item.code] = null;
        continue;
      }
      if (item.direction === 'mixed' || item.summaryAxis === 'none') {
        responses[item.code] = sampleLikertUniform(prng);
        continue;
      }
      const axisVal = item.summaryAxis === 'economic' ? anchor[0] : anchor[1];
      const signedTarget = item.direction === 'negative' ? -axisVal : axisVal;
      responses[item.code] = sampleLikertBiased(signedTarget, prng);
    }
    portfolios[portfolio.id] = { expertise, responses };
  }

  const submission = { portfolios };

  const portfolioScores: PortfolioScore[] = [];
  for (const portfolio of SURVEY_DEFINITION.portfolios) {
    const submission = portfolios[portfolio.id];
    if (!submission) continue;
    const score = scorePortfolio(portfolio, submission);
    if (score !== null) portfolioScores.push(score);
  }

  const economicAxis = scoreSummaryAxis(SURVEY_DEFINITION, submission, 'economic');
  const socialAxis = scoreSummaryAxis(SURVEY_DEFINITION, submission, 'social');

  return {
    id: identity.id,
    name: identity.name,
    role: identity.role,
    background: identity.background,
    isLeadership: idx < 15,
    economicAxis,
    socialAxis,
    portfolioScores,
    _isMock: true,
  };
}

function generateAllMembers(): readonly MemberProfile[] {
  const prng = mulberry32(SEED);
  const generalAnchors = generateGeneralAnchors(
    prng,
    IDENTITIES.length - LEADERSHIP_ANCHORS.length,
    LEADERSHIP_ANCHORS,
  );
  const anchorByIdx: readonly Anchor[] = [...LEADERSHIP_ANCHORS, ...generalAnchors];

  const members: MemberProfile[] = IDENTITIES.map((identity, idx) =>
    generateMember(idx, identity, anchorByIdx[idx] as Anchor, prng),
  );

  // Derived (economicAxis, socialAxis) positions drift from the anchors due to
  // response noise and null draws, so we enforce the >5-unit minimum spacing
  // by re-rolling any member who lands too close to another. The identity
  // (id, name, role, background, isLeadership) and the anchor are preserved;
  // only the response set is redrawn. Deterministic: PRNG sequence continues.
  for (let iteration = 0; iteration < 50; iteration += 1) {
    let conflicts = 0;
    for (let i = 0; i < members.length; i += 1) {
      const a = members[i] as MemberProfile;
      for (let j = 0; j < members.length; j += 1) {
        if (i === j) continue;
        const b = members[j] as MemberProfile;
        const d = Math.hypot(a.economicAxis - b.economicAxis, a.socialAxis - b.socialAxis);
        if (d < 5) {
          members[i] = generateMember(
            i,
            IDENTITIES[i] as Identity,
            anchorByIdx[i] as Anchor,
            prng,
          );
          conflicts += 1;
          break;
        }
      }
    }
    if (conflicts === 0) break;
  }

  return members;
}

export const GENERATED_MEMBERS: readonly MemberProfile[] = generateAllMembers();
