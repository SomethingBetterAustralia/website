// MOCK: one hand-typed respondent. Copy this file to add the next person:
//   1. Duplicate to mock-members-hardcoded-anon002.ts (or whatever id).
//   2. Find/replace ANON_001 -> ANON_002 and 'anon-001' -> 'anon-002' inside.
//   3. Edit name / role / background / answers.
//   4. In mock-members-hardcoded.ts, import the new const and add it to
//      HARDCODED_SUBMISSIONS.
//
// HOW TO FILL IN ANSWERS
// ----------------------
// The shape mirrors the survey flow: About you -> Movement-wide questions ->
// Portfolios -> Open response.
//
//   - Identity: id, name, role, background, isLeadership (free text; id
//     must be unique). When isLeadership is true the People page renders
//     a bio card, so also fill bioShort, bioLong, location, focusAreas,
//     joined, and photoUrl. For non-leadership respondents use empty
//     strings / empty array.
//   - expertiseAreas: portfolio ids the respondent ticked under "Which
//     policy portfolios do you feel strongest in?" — optional, empty array
//     if they ticked none.
//   - crossCutting: the six movement-wide questions (B1-B6).
//   - portfolios: one keyed block per portfolio they answered, with an
//     expertise level (1 none -> 5 expert) and a Likert response per item
//     code. Skip portfolios they didn't answer.
//   - openResponse: optional free-text at the end of the survey; omit if
//     empty.
//
// Likert scale: -2 strongly disagree, -1 disagree, 0 neutral, +1 agree,
// +2 strongly agree. Use `null` (or omit the key entirely) for "no answer" —
// the scorer skips unanswered items.
//
// METRIC TAGS shown at the start of each question comment:
//   [econ +]     contributes to the Economic axis with a positive sign
//   [econ -]     contributes to the Economic axis with a negative sign
//   [social +]   contributes to the Social axis with a positive sign
//   [social -]   contributes to the Social axis with a negative sign
//   [mixed]      does not feed either summary axis (still drives the
//                portfolio score)
//   [<name>]     cross-cutting indicator (movement-wide, no chart axis)
//
// Economic / social axis positions are derived automatically by
// toMemberProfile in mock-members-hardcoded.ts; you only ever type raw
// answers here. The question text is inlined as a comment above each value
// so the file is self-contained — no need to cross-reference
// survey-definition.ts while filling it in.

import type { HardcodedSubmission } from './mock-members-hardcoded.js';

export const ANON_001: HardcodedSubmission = {
  id: 'anon-001',
  name: 'Anon 001',
  role: 'Portfolio lead (technology & cities)',
  background: 'Anonymous',
  isLeadership: true,
  bioShort:
    'Anon 001 works across technology policy and urban infrastructure, with a focus on platform regulation, AI governance, and high-density housing reform. Long-horizon, evidence-first.',
  bioLong:
    "Anon 001 has spent over a decade at the intersection of digital infrastructure and city-shaping policy, including time inside major platform companies and on advisory work for state planning bodies. Their interests sit where technology regulation meets the built environment: data centre siting, algorithmic transparency, density reform, and the public investment case for high-speed rail and mass transit. They lead SBA's technology and cities portfolio with a bias toward decisions whose payoff arrives in five to ten years, not the next news cycle.",
  location: 'Sydney NSW',
  focusAreas: ['Platform regulation', 'AI governance', 'Housing density', 'Public transport'],
  joined: '2026',
  photoUrl: 'https://randomuser.me/api/portraits/lego/2.jpg',
  // Portfolios this person feels strongest in (multi-select on the About-You
  // step). Pick any subset of the 15 portfolio ids below:
  //   'economy-tax'           — C1  Economy, tax & public finance
  //   'industry-trade'        — C2  Industry, trade & enterprise
  //   'industrial-relations'  — C3  Workplace, employment & industrial relations
  //   'climate-energy'        — C4  Climate, environment & energy
  //   'agriculture-regions'   — C5  Agriculture, regions & food systems
  //   'cities-infrastructure' — C6  Cities, housing, infrastructure & transport
  //   'healthcare-aged-care'  — C7  Healthcare, aged care & disability
  //   'education-research'    — C8  Education, research & innovation
  //   'technology-digital'    — C9  Technology, digital & communications
  //   'immigration-population'— C10 Immigration, population & multiculturalism
  //   'indigenous-affairs'    — C11 Indigenous affairs & reconciliation
  //   'defence-foreign'       — C12 Defence, foreign affairs & security
  //   'law-order'             — C13 Justice, law & civil liberties
  //   'social-cultural'       — C14 Society, culture & creative life
  //   'governance-federation' — C15 Governance, federation & democracy
  expertiseAreas: ['cities-infrastructure', 'technology-digital'],
  // B — Movement-wide questions (apply across the whole survey, no portfolio)
  crossCutting: {
    // [time-horizon] Major policy decisions should weight long-term outcomes (10+ years) more heavily than the electoral cycle, even when that hurts re-election prospects.
    'B1': 2,
    // [evidence-orientation] When the best available evidence and majority public opinion conflict, policy should generally follow the evidence.
    'B2': 2,
    // [reform-orientation] Government should be willing to spend political capital on unpopular reforms when the case for them is demonstrably strong.
    'B3': 2,
    // [pragmatism] Reaching compromise across ideological lines usually produces better outcomes than holding firm to principle.
    'B4': 2,
    // [communitarian] A strong sense of shared national identity is a prerequisite for a cohesive society.
    'B5': -1,
    // [equality] Inequality of outcome — not just inequality of opportunity — is a problem governments should actively address.
    'B6': 1,
  },
  portfolios: {
    // C1 — Economy, tax & public finance
    'economy-tax': {
      expertise: 3,
      responses: {
        // [econ -] Higher-income earners in Australia should pay a meaningfully larger share of income tax than they do today.
        'C1.1': -1,
        // [econ +] Total government spending as a share of GDP should be reduced over the next decade.
        'C1.2': 2,
        // [econ -] Negative gearing and the capital gains tax discount should be wound back, even if this slows property price growth.
        'C1.3': -2,
        // [econ -] Australia should introduce a broad-based inheritance or wealth transfer tax above a high threshold.
        'C1.4': -2,
        // [econ +] The GST base should be broadened (e.g., to fresh food, health, education) in exchange for compensation to lower-income households.
        'C1.5': -2,
      },
    },
    // C2 — Industry, trade & enterprise
    'industry-trade': {
      expertise: 2,
      responses: {
        // [econ -] Australian industry should receive significantly stronger protection from import competition through tariffs or local-content rules.
        'C2.1': -2,
        // [econ -] Regulation of major retail and consumer markets — including grocery duopolies — should be tightened.
        'C2.2': 1,
        // [econ +] Small and medium businesses should be supported through reduced regulatory burden, even where this lowers consumer protections.
        'C2.3': -1,
        // [econ -] Australia should pursue a sovereign manufacturing capacity for critical goods (defence, pharmaceuticals, energy infrastructure), funded by government if necessary.
        'C2.4': 2,
        // [econ -] Free trade agreements should be entered into more cautiously, weighted toward Australian workers and producers rather than headline GDP gains.
        'C2.5': -1,
      },
    },
    // C3 — Workplace, employment & industrial relations
    'industrial-relations': {
      expertise: 3,
      responses: {
        // [econ -] The minimum wage should rise faster than inflation to lift the living standards of low-wage workers.
        'C3.1': -1,
        // [econ -] Gig economy workers should have the same legal protections and entitlements as employees.
        'C3.2': -1,
        // [econ +] "Right to disconnect" laws are an unnecessary intrusion into the employer–employee relationship.
        'C3.3': -2,
        // [econ +] Enterprise bargaining at the workplace level produces better outcomes than industry-wide bargaining.
        'C3.4': -1,
        // [econ -] The role and influence of trade unions in Australian workplaces should be strengthened.
        'C3.5': -2,
      },
    },
    // C4 — Climate, environment & energy
    'climate-energy': {
      expertise: 4,
      responses: {
        // [econ -] Australia should accelerate the phase-out of thermal coal and gas exports, even at significant short-term economic cost.
        'C4.1': 2,
        // [econ +] Nuclear power should be part of Australia's future energy mix.
        'C4.2': -1,
        // [econ +] The pace of the renewable energy transition has been too fast given grid reliability and cost-of-living impacts.
        'C4.3': -2,
        // [econ +] Australia's domestic emissions are small enough globally that policy should prioritise competitiveness over further ambition.
        'C4.4': -1,
        // [econ -] The federal government should set firm, enforceable emissions caps on heavy industry rather than rely on offset markets.
        'C4.5': -1,
      },
    },
    // C5 — Agriculture, regions & food systems
    'agriculture-regions': {
      expertise: 2,
      responses: {
        // [econ -] Public investment in regional infrastructure, services, and economic development should be significantly increased relative to capital-city spending.
        'C5.1': 2,
        // [social -] Murray-Darling Basin water allocations should favour environmental flows over irrigated agriculture.
        'C5.2': 1,
        // [social -] Live animal export should be phased out over a defined timeline.
        'C5.3': -2,
        // [mixed] Australian agriculture should be supported by targeted subsidies and price-floor mechanisms to ensure domestic food security.
        'C5.4': -1,
        // [social +] The right of farmers to clear vegetation on freehold land should be expanded rather than restricted further.
        'C5.5': 1,
      },
    },
    // C6 — Cities, housing, infrastructure & transport
    'cities-infrastructure': {
      expertise: 5,
      responses: {
        // [econ +] State and local planning rules should be overridden by federal targets to allow significantly higher-density housing in established suburbs.
        'C6.1': -1,
        // [econ -] A large, sustained expansion of public and community housing is necessary to address affordability.
        'C6.2': -2,
        // [econ -] Negative-gearing and CGT-discount reform would do more for housing affordability than supply-side measures alone.
        'C6.3': -2,
        // [econ -] High-speed rail between Australia's east-coast capital cities is a justified national infrastructure investment.
        'C6.4': -2,
        // [social -] Public transport expansion should be prioritised over road infrastructure investment in major cities.
        'C6.5': -1,
      },
    },
    // C7 — Healthcare, aged care & disability
    'healthcare-aged-care': {
      expertise: 2,
      responses: {
        // [econ -] Medicare bulk-billing should be expanded to cover more services, funded by general taxation.
        'C7.1': 2,
        // [econ -] Federal subsidies for private health insurance should be redirected into the public hospital system.
        'C7.2': 2,
        // [econ +] A strong for-profit presence in aged care delivers better outcomes than a primarily public or not-for-profit system.
        'C7.3': -2,
        // [econ -] The NDIS should be expanded to cover more participants, even as overall costs rise.
        'C7.4': -2,
        // [social -] Voluntary assisted dying should be available, with consistent national standards, in all states and territories.
        'C7.5': 2,
      },
    },
    // C8 — Education, research & innovation
    'education-research': {
      expertise: 4,
      responses: {
        // [econ -] Public schools should receive a substantially larger share of federal education funding than they currently do.
        'C8.1': 2,
        // [econ -] University fees should be lower, even if it requires significantly higher Commonwealth subsidy.
        'C8.2': -1,
        // [social +] Religious and independent schools should retain the right to set their own enrolment and staffing criteria, including on faith grounds.
        'C8.3': -2,
        // [econ -] Federal investment in basic scientific research (CSIRO, ARC, university research) should be significantly increased.
        'C8.4': 2,
        // [econ -] Vocational education and training (TAFE) should be funded at parity with universities for comparable cohorts.
        'C8.5': -2,
      },
    },
    // C9 — Technology, digital & communications
    'technology-digital': {
      expertise: 5,
      responses: {
        // [econ -] Major technology platforms (search, social media, e-commerce) should face strong antitrust action and structural separation.
        'C9.1': -2,
        // [econ -] Australia should regulate AI development through mandatory safety testing and licensing for frontier AI systems.
        'C9.2': -2,
        // [social -] End-to-end encryption should not be weakened by law-enforcement access requirements.
        'C9.3': 2,
        // [econ -] Government should mandate algorithmic transparency for social media feed-ranking and content recommendation systems.
        'C9.4': 2,
        // [social +] Critical digital infrastructure (data centres, undersea cables, payment systems) should be subject to national-security ownership restrictions.
        'C9.5': 2,
      },
    },
    // C10 — Immigration, population & multiculturalism
    'immigration-population': {
      expertise: 2,
      responses: {
        // [social -] Australia's permanent migration intake should be increased to support skills shortages and economic growth.
        'C10.1': -1,
        // [social -] The proportion of humanitarian visas relative to skilled visas should be increased.
        'C10.2': -1,
        // [social +] Australia should retain offshore processing for people who arrive by boat seeking asylum.
        'C10.3': 2,
        // [social -] Multiculturalism has, on balance, been a success for Australia and should be actively reinforced.
        'C10.4': 2,
        // [social +] Temporary migration (international students, working visas) should be significantly tightened.
        'C10.5': -1,
      },
    },
    // C11 — Indigenous affairs & reconciliation
    'indigenous-affairs': {
      expertise: 3,
      responses: {
        // [social -] A federal Treaty process should be pursued, despite the failure of the Voice referendum.
        'C11.1': 0,
        // [social -] Indigenous-specific programs are generally more effective than universal programs at closing outcome gaps.
        'C11.2': 1,
        // [social +] Constitutional recognition without a Voice or Treaty would be a sufficient settlement.
        'C11.3': 1,
        // [social -] Truth-telling processes (such as Yoorrook in Victoria) should be expanded federally.
        'C11.4': -2,
        // [social -] Indigenous consultation and consent rights should be strengthened in resource and major infrastructure decisions.
        'C11.5': -2,
      },
    },
    // C12 — Defence, foreign affairs & security
    'defence-foreign': {
      expertise: 2,
      responses: {
        // [social +] AUKUS represents a sound long-term strategic investment for Australia.
        'C12.1': 1,
        // [social -] Australia should pursue a more independent foreign policy, less closely aligned with the United States.
        'C12.2': 1,
        // [social +] Defence spending should rise to at least 3% of GDP within the next decade.
        'C12.3': 1,
        // [social -] Australia's economic relationship with China should generally be prioritised over alignment with US strategic objectives.
        'C12.4': 1,
        // [social -] Australia should significantly increase its intake of people displaced by current conflicts (e.g., Gaza, Ukraine, Sudan).
        'C12.5': -1,
      },
    },
    // C13 — Justice, law & civil liberties
    'law-order': {
      expertise: 3,
      responses: {
        // [social +] Mandatory minimum sentences are an effective tool for reducing serious crime.
        'C13.1': 0,
        // [social -] The age of criminal responsibility should be raised to 14 nationally.
        'C13.2': 2,
        // [social -] Possession of small quantities of illicit drugs for personal use should be decriminalised.
        'C13.3': 2,
        // [social +] Police and intelligence agencies should have expanded surveillance powers to combat organised crime and terrorism.
        'C13.4': -1,
        // [social +] Bail laws should be tightened, particularly for repeat violent offenders.
        'C13.5': 2,
      },
    },
    // C14 — Society, culture & creative life
    'social-cultural': {
      expertise: 3,
      responses: {
        // [social +] Religious organisations should retain exemptions from anti-discrimination law in their hiring and admission practices.
        'C14.1': -2,
        // [social -] The legal recognition of trans and gender-diverse people — including in sport, healthcare, and identification — should be expanded.
        'C14.2': 1,
        // [social -] Australian-content quotas on streaming platforms and broadcasters should be strengthened.
        'C14.3': -2,
        // [social -] Public funding for the arts and for the ABC should be increased.
        'C14.4': 2,
        // [social -] Australia should become a republic, with an Australian head of state.
        'C14.5': -2,
      },
    },
    // C15 — Governance, federation & democracy
    'governance-federation': {
      expertise: 3,
      responses: {
        // [mixed] State governments should be abolished, with their functions redistributed between strengthened local councils and the federal government.
        'C15.1': 2,
        // [mixed] Compulsory voting should be retained.
        'C15.2': 2,
        // [social -] Federal political donation caps and transparency rules should be substantially strengthened.
        'C15.3': 2,
        // [social -] Citizens' assemblies (randomly selected deliberative panels) should be used more often for complex or contested policy questions.
        'C15.4': 2,
        // [mixed] Four-year fixed federal parliamentary terms should replace the current three-year system.
        'C15.5': 2,
      },
    },
  },
  // Optional free-text response from the end of the survey. Omit the field
  // entirely if the respondent left it blank.
  openResponse:
    'Mostly want to see long-horizon thinking and honest costing. Less interested in tribal politics, more interested in whether the policy actually works in five and ten years.',
};
