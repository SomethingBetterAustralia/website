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
  readonly bioShort: string;
  readonly bioLong: string;
  readonly location: string;
  readonly focusAreas: readonly string[];
  readonly joined: string;
  readonly photoUrl: string;
}

const IDENTITIES: readonly Identity[] = [
  {
    id: 'm-001',
    name: 'Elias Marchetti',
    role: 'Founder',
    background: 'Former public-policy lead, Sydney',
    location: 'Sydney NSW',
    joined: '2026',
    focusAreas: ['Public policy', 'Movement strategy', 'Coalition building'],
    bioShort:
      "Elias founded SBA after a decade in Commonwealth and NSW public-policy roles, including stints at Treasury and a cross-bench MP's office. He's convinced major-party tribalism is the binding constraint on Australia.",
    bioLong:
      'Elias founded Something Better Australia in early 2026 after twelve years across Commonwealth Treasury, a NSW state department, and a federal cross-bench office. He wrote his postgrad on deliberative democracy and spent the last three years inside the policy machine watching good ideas die for tribal reasons. SBA is his bet that the binding constraint on Australian governance is not talent or evidence, but the two-party dynamic itself.',
    photoUrl: 'https://randomuser.me/api/portraits/men/40.jpg',
  },
  {
    id: 'm-002',
    name: 'Daniel Karpinski',
    role: 'Co-chair',
    background: 'Climate scientist, Melbourne',
    location: 'Melbourne VIC',
    joined: '2026',
    focusAreas: ['Climate science', 'Energy policy', 'Public research'],
    bioShort:
      'Daniel is a climate scientist with a research career at CSIRO and the University of Melbourne, focused on continental-scale carbon flux. He joined SBA to bring evidence weight to energy debates.',
    bioLong:
      'Daniel spent fifteen years at CSIRO and the University of Melbourne working on Australian continental-scale carbon flux and bushfire-climate coupling. He has authored more than forty peer-reviewed papers and sat on two state-level advisory panels. He joined SBA as co-chair because he wants the energy and climate conversation to be governed by the published evidence, not by the news cycle.',
    photoUrl: 'https://randomuser.me/api/portraits/men/22.jpg',
  },
  {
    id: 'm-003',
    name: 'Yvette Karangi',
    role: 'Portfolio lead (economy)',
    background: 'Macro-economist, ANU',
    location: 'Canberra ACT',
    joined: '2026',
    focusAreas: ['Tax design', 'Fiscal policy', 'Housing economics'],
    bioShort:
      "Yvette is an ANU macro-economist with a focus on tax design and housing supply. She advised the Productivity Commission's last housing review.",
    bioLong:
      "Yvette is a senior lecturer at ANU in macroeconomics and a former senior advisor on the Productivity Commission's review of Australian housing supply. Her published work covers negative gearing, GST design, and the long-run drag of intergenerational housing wealth on labour mobility. She leads SBA's economy and tax portfolio with a brief to write policy that an honest economist can sign.",
    photoUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    id: 'm-004',
    name: 'Hamish Treadwell',
    role: 'Portfolio lead (climate)',
    background: 'Energy systems engineer',
    location: 'Brisbane QLD',
    joined: '2026',
    focusAreas: ['Grid engineering', 'Renewable transition', 'Storage'],
    bioShort:
      "Hamish is an energy-systems engineer who has spent the last decade modelling the grid for the National Electricity Market. He's spoken to every major-party energy spokesperson and walked away convinced none of them are doing the maths.",
    bioLong:
      "Hamish is a senior energy-systems engineer with a decade modelling the National Electricity Market's transition under different policy and technology mixes. He has built one of the most-cited NEM dispatch models in industry and consults to both generators and regulators. He leads SBA's climate and energy portfolio and is unusually willing to be specific about the cost of each option.",
    photoUrl: 'https://randomuser.me/api/portraits/men/45.jpg',
  },
  {
    id: 'm-005',
    name: 'Priya Lakhani',
    role: 'Portfolio lead (social)',
    background: 'Public-health physician',
    location: 'Sydney NSW',
    joined: '2026',
    focusAreas: ['Primary care', 'Aged care', 'Public-health equity'],
    bioShort:
      'Priya is a public-health physician with a clinical base in Western Sydney and policy time at the World Health Organisation. She thinks Australian social policy is far too siloed by department.',
    bioLong:
      "Priya practices as a public-health physician in Western Sydney and previously worked at the WHO on chronic-disease policy across the Indo-Pacific. She has authored the Greater Sydney Primary Health Network's last two strategic frameworks. At SBA she leads social policy with a particular focus on the gaps between mental health, primary care, and aged care funding.",
    photoUrl: 'https://randomuser.me/api/portraits/women/29.jpg',
  },
  {
    id: 'm-006',
    name: 'Bruno Cardoso',
    role: 'Portfolio lead (defence)',
    background: 'Retired RAAF officer',
    location: 'Canberra ACT',
    joined: '2026',
    focusAreas: ['Defence strategy', 'Indo-Pacific', 'Veterans'],
    bioShort:
      "Bruno is a retired RAAF Wing Commander with twenty-two years of service, including postings in Canberra and three operational deployments. He's a sceptic of both reflexive AUKUS support and reflexive AUKUS opposition.",
    bioLong:
      "Bruno retired as a RAAF Wing Commander after twenty-two years including operational deployments to the Middle East, postings to Defence headquarters in Canberra, and a secondment to the Department of Foreign Affairs and Trade. Since retiring he has consulted on Indo-Pacific posture for two parliamentary committees. He leads SBA's defence and foreign-affairs portfolio.",
    photoUrl: 'https://randomuser.me/api/portraits/men/55.jpg',
  },
  {
    id: 'm-007',
    name: 'Margot Linden',
    role: 'Treasurer',
    background: 'Chartered accountant, Brisbane',
    location: 'Brisbane QLD',
    joined: '2026',
    focusAreas: ['Audit', 'Charity finance', 'Compliance'],
    bioShort:
      'Margot is a Chartered Accountant with twenty years in not-for-profit and political-party finance. She runs the SBA books and the financial-disclosure regime.',
    bioLong:
      "Margot is a Brisbane-based Chartered Accountant who spent the first decade of her career at a Big Four firm and the second running finance for two federally-registered charities and one state political party. She is SBA's Treasurer and is the person who makes sure the financials on this website match the bank account exactly. She insisted on the public ledger before agreeing to take the role.",
    photoUrl: 'https://randomuser.me/api/portraits/women/52.jpg',
  },
  {
    id: 'm-008',
    name: 'Liam Whitcombe',
    role: 'Secretary',
    background: 'Corporate-law associate',
    location: 'Sydney NSW',
    joined: '2026',
    focusAreas: ['Constitutional law', 'Electoral law', 'Governance'],
    bioShort:
      'Liam is a corporate-law associate at a top-tier Australian firm with a side specialty in electoral and political-party law. He drafted the SBA constitution.',
    bioLong:
      "Liam is a senior associate at a Sydney top-tier firm whose pro bono work has covered electoral registration, donation-disclosure compliance, and two recent constitutional challenges. He drafted the SBA constitution and is the movement's Secretary. He keeps the AEC paperwork in order and the meeting minutes honest.",
    photoUrl: 'https://randomuser.me/api/portraits/men/12.jpg',
  },
  {
    id: 'm-009',
    name: 'Anita Coatsworth',
    role: 'Membership director',
    background: 'Community organiser, regional VIC',
    location: 'Bendigo VIC',
    joined: '2026',
    focusAreas: ['Regional organising', 'Volunteer programs', 'Events'],
    bioShort:
      'Anita is a community organiser who has worked across regional Victoria for fifteen years, previously running a state-wide rural mental-health network. She runs SBA membership and outreach.',
    bioLong:
      "Anita is a Bendigo-based community organiser with fifteen years across regional Victoria, including eight years as program director of a state-wide rural mental-health network. She has built and trained volunteer cohorts of several hundred people. She runs SBA membership and field outreach and is the person you'll most likely meet if you sign up to volunteer.",
    photoUrl: 'https://randomuser.me/api/portraits/women/76.jpg',
  },
  {
    id: 'm-010',
    name: 'Theo Vassilakis',
    role: 'Communications lead',
    background: 'Former ABC producer',
    location: 'Melbourne VIC',
    joined: '2026',
    focusAreas: ['Public broadcasting', 'Editorial', 'Plain language'],
    bioShort:
      "Theo is a former ABC producer with sixteen years at Radio National and 7.30. He leads SBA communications and writes most of the website copy you'll read.",
    bioLong:
      "Theo spent sixteen years inside the ABC, including ten years producing Radio National's flagship current-affairs program and four years on 7.30. He left in 2025 because he believes public-interest journalism in Australia has been hollowed out by both budget cuts and platform economics. He leads SBA communications, edits the site, and writes most of the public-facing copy.",
    photoUrl: 'https://randomuser.me/api/portraits/men/33.jpg',
  },
  {
    id: 'm-011',
    name: 'Renee Holborow',
    role: 'Portfolio lead (health)',
    background: 'Aged-care consultant',
    location: 'Adelaide SA',
    joined: '2026',
    focusAreas: ['Aged care', 'Royal Commission response', 'Funding'],
    bioShort:
      'Renee is an aged-care consultant who appeared before the Royal Commission and has spent the last five years inside the implementation of its recommendations.',
    bioLong:
      "Renee was a senior witness at the Royal Commission into Aged Care Quality and Safety and has spent the five years since working inside aged-care providers implementing recommendations on staffing ratios, clinical governance, and funding reform. She leads SBA's healthcare and aged-care policy work and is specifically loud on the gap between policy intent and implementation.",
    photoUrl: 'https://randomuser.me/api/portraits/women/15.jpg',
  },
  {
    id: 'm-012',
    name: 'Toby Quintrell',
    role: 'Portfolio lead (education)',
    background: 'Maths teacher and curriculum designer',
    location: 'Hobart TAS',
    joined: '2026',
    focusAreas: ['Curriculum design', 'Public schools', 'STEM'],
    bioShort:
      "Toby is a high-school maths teacher and curriculum designer who has spent his career in Tasmanian public schools. He wrote the state's current Years 7-10 maths sequence.",
    bioLong:
      "Toby is a Hobart-based high-school mathematics teacher and curriculum designer who has spent his entire career in Tasmanian public schools. He led the redesign of the state's Years 7-10 maths sequence in 2023 and consults to the Australian Curriculum and Assessment Authority. He leads SBA's education and research portfolio with a brief to take the politics out of school funding.",
    photoUrl: 'https://randomuser.me/api/portraits/men/61.jpg',
  },
  {
    id: 'm-043',
    name: 'Yusuf Belir',
    role: 'Portfolio lead (industry & trade)',
    background: 'Former Productivity Commission economist, Sydney',
    location: 'Sydney NSW',
    joined: '2026',
    focusAreas: ['Trade policy', 'Industry assistance', 'Productivity'],
    bioShort:
      "Yusuf is a former Productivity Commission economist with eight years on the trade and industry-assistance desk. He's published on FTA welfare effects and critical-minerals strategy.",
    bioLong:
      "Yusuf spent eight years at the Productivity Commission on the trade and industry-assistance desk, including lead-economist roles on two major reviews of Australian critical-minerals strategy and one review of FTA welfare outcomes. He left for the private sector in 2024 and now leads SBA's industry and trade portfolio.",
    photoUrl: 'https://randomuser.me/api/portraits/men/8.jpg',
  },
  {
    id: 'm-044',
    name: 'Tania Rourke',
    role: 'Portfolio lead (agriculture & regions)',
    background: 'Farm-business consultant, Wagga Wagga',
    location: 'Wagga Wagga NSW',
    joined: '2026',
    focusAreas: ['Farm business', 'Water policy', 'Regional dev'],
    bioShort:
      'Tania is a Wagga-based farm-business consultant and third-generation grazier. She advises the Riverina farm community on succession, water entitlements, and climate adaptation.',
    bioLong:
      "Tania is a farm-business consultant working across the Riverina and a third-generation grazier on the Murrumbidgee. She advises farm families on succession planning, water-entitlement strategy under the Murray-Darling Basin Plan, and climate-adaptation investment. She leads SBA's agriculture and regions portfolio and is loud about the city / country policy gap.",
    photoUrl: 'https://randomuser.me/api/portraits/women/85.jpg',
  },
  {
    id: 'm-045',
    name: 'Nina Whitlam',
    role: 'Portfolio lead (technology & digital)',
    background: 'Cybersecurity researcher, Canberra',
    location: 'Canberra ACT',
    joined: '2026',
    focusAreas: ['Cybersecurity', 'AI policy', 'Digital sovereignty'],
    bioShort:
      "Nina is a cybersecurity researcher at ANU with a background in critical-infrastructure protection and AI governance. She's advised both ASD and the Office of the eSafety Commissioner.",
    bioLong:
      "Nina is a senior researcher at ANU's cybersecurity centre with a background in critical-infrastructure protection and frontier AI safety governance. She has advised the Australian Signals Directorate, the Office of the eSafety Commissioner, and two parliamentary committees on AI legislation. She leads SBA's technology and digital portfolio.",
    photoUrl: 'https://randomuser.me/api/portraits/women/3.jpg',
  },
  { id: 'm-013', name: 'Sarah Cavendish', role: 'Member', background: 'GP in regional NSW', location: '', joined: '', focusAreas: [], bioShort: '', bioLong: '', photoUrl: '' },
  { id: 'm-014', name: 'Marcus Penberthy', role: 'Member', background: 'Software engineer, Adelaide', location: '', joined: '', focusAreas: [], bioShort: '', bioLong: '', photoUrl: '' },
  { id: 'm-015', name: 'Aroha Sutherland', role: 'Member', background: 'Primary-school teacher', location: '', joined: '', focusAreas: [], bioShort: '', bioLong: '', photoUrl: '' },
  { id: 'm-016', name: 'Jin Park', role: 'Member', background: 'Small-business owner (hospitality)', location: '', joined: '', focusAreas: [], bioShort: '', bioLong: '', photoUrl: '' },
  { id: 'm-017', name: 'Catherine Rowe', role: 'Member', background: 'Retired army officer', location: '', joined: '', focusAreas: [], bioShort: '', bioLong: '', photoUrl: '' },
  { id: 'm-018', name: 'Felix Donnellan', role: 'Member', background: 'Social worker, outer Melbourne', location: '', joined: '', focusAreas: [], bioShort: '', bioLong: '', photoUrl: '' },
  { id: 'm-019', name: 'Imogen Boyce', role: 'Member', background: 'Agronomist, Riverina', location: '', joined: '', focusAreas: [], bioShort: '', bioLong: '', photoUrl: '' },
  { id: 'm-020', name: 'Mateo Sanchez', role: 'Member', background: 'Accountant, North Sydney', location: '', joined: '', focusAreas: [], bioShort: '', bioLong: '', photoUrl: '' },
  { id: 'm-021', name: 'Hannah Greengrass', role: 'Member', background: 'Critical-care nurse', location: '', joined: '', focusAreas: [], bioShort: '', bioLong: '', photoUrl: '' },
  { id: 'm-022', name: 'Joel Patapere', role: 'Member', background: 'Carpenter and small builder', location: '', joined: '', focusAreas: [], bioShort: '', bioLong: '', photoUrl: '' },
  { id: 'm-023', name: 'Olivia Trent', role: 'Member', background: 'Civil engineer (transport)', location: '', joined: '', focusAreas: [], bioShort: '', bioLong: '', photoUrl: '' },
  { id: 'm-024', name: 'Sam Olusoga', role: 'Member', background: 'Freelance journalist', location: '', joined: '', focusAreas: [], bioShort: '', bioLong: '', photoUrl: '' },
  { id: 'm-025', name: 'Penny Drewett', role: 'Member', background: 'Family lawyer', location: '', joined: '', focusAreas: [], bioShort: '', bioLong: '', photoUrl: '' },
  { id: 'm-026', name: 'Rajiv Bhandari', role: 'Member', background: 'Town planner', location: '', joined: '', focusAreas: [], bioShort: '', bioLong: '', photoUrl: '' },
  { id: 'm-027', name: 'Naomi Trevorrow', role: 'Member', background: 'University lecturer (history)', location: '', joined: '', focusAreas: [], bioShort: '', bioLong: '', photoUrl: '' },
  { id: 'm-028', name: 'Ben Voss', role: 'Member', background: 'Marine biologist, Hobart', location: '', joined: '', focusAreas: [], bioShort: '', bioLong: '', photoUrl: '' },
  { id: 'm-029', name: 'Lachlan Quirk', role: 'Member', background: 'Self-employed electrician', location: '', joined: '', focusAreas: [], bioShort: '', bioLong: '', photoUrl: '' },
  { id: 'm-030', name: 'Anika Saxena', role: 'Member', background: 'Paramedic', location: '', joined: '', focusAreas: [], bioShort: '', bioLong: '', photoUrl: '' },
  { id: 'm-031', name: 'Pia Costanzo', role: 'Member', background: 'Dentist, Perth', location: '', joined: '', focusAreas: [], bioShort: '', bioLong: '', photoUrl: '' },
  { id: 'm-032', name: 'Ezra Brock', role: 'Member', background: 'Café owner, Geelong', location: '', joined: '', focusAreas: [], bioShort: '', bioLong: '', photoUrl: '' },
  { id: 'm-033', name: 'Tessa Maguire', role: 'Member', background: 'Public librarian', location: '', joined: '', focusAreas: [], bioShort: '', bioLong: '', photoUrl: '' },
  { id: 'm-034', name: 'Joon-ho Kang', role: 'Member', background: 'Council planner, Western Sydney', location: '', joined: '', focusAreas: [], bioShort: '', bioLong: '', photoUrl: '' },
  { id: 'm-035', name: 'Owen Trist', role: 'Member', background: 'Mining engineer, WA', location: '', joined: '', focusAreas: [], bioShort: '', bioLong: '', photoUrl: '' },
  { id: 'm-036', name: 'Sophie Whelan', role: 'Member', background: 'Primary teacher, Darwin', location: '', joined: '', focusAreas: [], bioShort: '', bioLong: '', photoUrl: '' },
  { id: 'm-037', name: 'Amaru Cordova', role: 'Member', background: 'Refugee resettlement worker', location: '', joined: '', focusAreas: [], bioShort: '', bioLong: '', photoUrl: '' },
  { id: 'm-038', name: 'Henrik Lassiter', role: 'Member', background: 'Freight forwarder, Port Botany', location: '', joined: '', focusAreas: [], bioShort: '', bioLong: '', photoUrl: '' },
  { id: 'm-039', name: "Bridie O'Toole", role: 'Member', background: 'Midwife, regional QLD', location: '', joined: '', focusAreas: [], bioShort: '', bioLong: '', photoUrl: '' },
  { id: 'm-040', name: 'Caleb Yarrow', role: 'Member', background: 'Independent podcast producer', location: '', joined: '', focusAreas: [], bioShort: '', bioLong: '', photoUrl: '' },
  { id: 'm-041', name: 'Niamh Coughlan', role: 'Member', background: 'Plumber, Newcastle', location: '', joined: '', focusAreas: [], bioShort: '', bioLong: '', photoUrl: '' },
  { id: 'm-042', name: 'Vivian Kerr', role: 'Member', background: 'Energy market analyst', location: '', joined: '', focusAreas: [], bioShort: '', bioLong: '', photoUrl: '' },
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
    bioShort: identity.bioShort,
    bioLong: identity.bioLong,
    location: identity.location,
    focusAreas: identity.focusAreas,
    joined: identity.joined,
    photoUrl: identity.photoUrl,
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
