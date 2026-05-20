// NOTE: item texts and per-item direction/summaryAxis assignments are
// designer-authored placeholders pending the real Leadership Leanings Survey
// design doc. The directional contract (positive = market/traditional/
// restrictive; negative = interventionist/progressive; mixed = no axis) is
// preserved so the scoring functions and downstream visualisations remain
// stable when the texts are re-authored.

import type { SurveyDefinition } from '../types/survey.js';

export const SURVEY_DEFINITION: SurveyDefinition = {
  domains: [
    {
      id: 'economy-tax',
      code: 'C1',
      name: 'Economy, tax & public finance',
      blurb: 'How Australia raises and spends its money.',
      items: [
        {
          code: 'C1.1',
          text: "Lower personal and corporate tax rates would strengthen Australia's long-term productivity.",
          direction: 'positive',
          summaryAxis: 'economic',
        },
        {
          code: 'C1.2',
          text: 'Government should run sustained budget deficits if needed to support employment and demand.',
          direction: 'negative',
          summaryAxis: 'economic',
        },
        {
          code: 'C1.3',
          text: 'Government should play a larger role in setting prices for essential goods like energy and groceries.',
          direction: 'negative',
          summaryAxis: 'economic',
        },
        {
          code: 'C1.4',
          text: 'Means-testing welfare more aggressively would improve fairness and incentives.',
          direction: 'positive',
          summaryAxis: 'economic',
        },
        {
          code: 'C1.5',
          text: 'A broader GST with offsetting income-tax cuts would be a healthier tax mix.',
          direction: 'positive',
          summaryAxis: 'economic',
        },
      ],
    },
    {
      id: 'climate-energy',
      code: 'C2',
      name: 'Climate, energy & environment',
      blurb: 'Decarbonising and protecting natural capital.',
      items: [
        {
          code: 'C2.1',
          text: 'Market-based carbon pricing should be the primary lever for emissions reduction.',
          direction: 'positive',
          summaryAxis: 'economic',
        },
        {
          code: 'C2.2',
          text: 'Government should subsidise renewable energy projects to accelerate the transition.',
          direction: 'negative',
          summaryAxis: 'economic',
        },
        {
          code: 'C2.3',
          text: 'Australia should not approve any new coal or gas projects from this point forward.',
          direction: 'negative',
          summaryAxis: 'economic',
        },
        {
          code: 'C2.4',
          text: "Nuclear power should be part of Australia's energy mix.",
          direction: 'positive',
          summaryAxis: 'economic',
        },
        {
          code: 'C2.5',
          text: 'Environmental review processes should be streamlined to speed up project approvals.',
          direction: 'mixed',
          summaryAxis: 'none',
        },
      ],
    },
    {
      id: 'immigration-population',
      code: 'C3',
      name: 'Immigration & population',
      blurb: 'Who comes, how many, and on what terms.',
      items: [
        {
          code: 'C3.1',
          text: "Australia's permanent migration intake should be reduced.",
          direction: 'positive',
          summaryAxis: 'social',
        },
        {
          code: 'C3.2',
          text: 'Skilled migration should be expanded to fill workforce gaps.',
          direction: 'negative',
          summaryAxis: 'social',
        },
        {
          code: 'C3.3',
          text: 'Multicultural identity is a strength Australia should actively celebrate.',
          direction: 'negative',
          summaryAxis: 'social',
        },
        {
          code: 'C3.4',
          text: 'Refugee intakes should be increased substantially.',
          direction: 'negative',
          summaryAxis: 'social',
        },
        {
          code: 'C3.5',
          text: 'Citizenship tests should require strong English-language proficiency.',
          direction: 'positive',
          summaryAxis: 'social',
        },
      ],
    },
    {
      id: 'healthcare-aged-care',
      code: 'C4',
      name: 'Healthcare & aged care',
      blurb: 'Funding and delivering care across the life course.',
      items: [
        {
          code: 'C4.1',
          text: 'Medicare should remain free at the point of access for all essential services.',
          direction: 'negative',
          summaryAxis: 'economic',
        },
        {
          code: 'C4.2',
          text: 'Private health insurance should play a larger role in funding healthcare.',
          direction: 'positive',
          summaryAxis: 'economic',
        },
        {
          code: 'C4.3',
          text: 'Aged-care providers should face stricter mandatory staffing ratios, even if it raises costs.',
          direction: 'negative',
          summaryAxis: 'economic',
        },
        {
          code: 'C4.4',
          text: 'Voluntary assisted dying should be available with appropriate safeguards across Australia.',
          direction: 'negative',
          summaryAxis: 'social',
        },
        {
          code: 'C4.5',
          text: 'Mental-health services should be expanded as a public priority.',
          direction: 'negative',
          summaryAxis: 'none',
        },
      ],
    },
    {
      id: 'education-skills',
      code: 'C5',
      name: 'Education & skills',
      blurb: 'Schools, vocational training, and universities.',
      items: [
        {
          code: 'C5.1',
          text: 'Public schools should receive a higher share of government funding than private schools.',
          direction: 'negative',
          summaryAxis: 'economic',
        },
        {
          code: 'C5.2',
          text: 'Universities should compete in a market where student demand drives funding.',
          direction: 'positive',
          summaryAxis: 'economic',
        },
        {
          code: 'C5.3',
          text: 'Vocational training and apprenticeships deserve as much public investment as university.',
          direction: 'negative',
          summaryAxis: 'economic',
        },
        {
          code: 'C5.4',
          text: 'School curricula should emphasise traditional Western intellectual heritage.',
          direction: 'positive',
          summaryAxis: 'social',
        },
        {
          code: 'C5.5',
          text: 'Free university for in-demand fields would strengthen national capability.',
          direction: 'negative',
          summaryAxis: 'economic',
        },
      ],
    },
    {
      id: 'housing-urban',
      code: 'C6',
      name: 'Housing & urban policy',
      blurb: 'Where and how Australians live.',
      items: [
        {
          code: 'C6.1',
          text: 'Negative gearing and the capital-gains discount should be wound back.',
          direction: 'negative',
          summaryAxis: 'economic',
        },
        {
          code: 'C6.2',
          text: 'Markets, not government, are best placed to deliver new housing supply.',
          direction: 'positive',
          summaryAxis: 'economic',
        },
        {
          code: 'C6.3',
          text: 'State and federal governments should expand public and community housing.',
          direction: 'negative',
          summaryAxis: 'economic',
        },
        {
          code: 'C6.4',
          text: 'Density and infill should be prioritised over greenfield expansion.',
          direction: 'mixed',
          summaryAxis: 'none',
        },
        {
          code: 'C6.5',
          text: 'Foreign investment in residential property should be tightly restricted.',
          direction: 'positive',
          summaryAxis: 'economic',
        },
      ],
    },
    {
      id: 'industrial-relations',
      code: 'C7',
      name: 'Industrial relations & workplace',
      blurb: 'Workers, employers, and the rules between them.',
      items: [
        {
          code: 'C7.1',
          text: 'Unions should have stronger legal rights to organise and bargain.',
          direction: 'negative',
          summaryAxis: 'economic',
        },
        {
          code: 'C7.2',
          text: 'Minimum-wage rises should track CPI tightly, not exceed it.',
          direction: 'positive',
          summaryAxis: 'economic',
        },
        {
          code: 'C7.3',
          text: 'Gig-economy workers should be classified as employees with full entitlements.',
          direction: 'negative',
          summaryAxis: 'economic',
        },
        {
          code: 'C7.4',
          text: 'Workplace flexibility should be expanded even where it shifts risk to workers.',
          direction: 'positive',
          summaryAxis: 'economic',
        },
        {
          code: 'C7.5',
          text: 'Right-to-disconnect laws should be strengthened.',
          direction: 'negative',
          summaryAxis: 'economic',
        },
      ],
    },
    {
      id: 'indigenous-affairs',
      code: 'C8',
      name: 'Indigenous affairs & reconciliation',
      blurb: "Australia's first peoples in policy and recognition.",
      items: [
        {
          code: 'C8.1',
          text: 'Australia should advance Treaty and constitutional recognition for First Nations peoples.',
          direction: 'negative',
          summaryAxis: 'social',
        },
        {
          code: 'C8.2',
          text: 'Native-title obligations create unreasonable barriers to economic development.',
          direction: 'positive',
          summaryAxis: 'social',
        },
        {
          code: 'C8.3',
          text: 'Indigenous-led decision-making should drive program design in Indigenous affairs.',
          direction: 'negative',
          summaryAxis: 'social',
        },
        {
          code: 'C8.4',
          text: 'Indigenous education and health funding should be substantially increased.',
          direction: 'negative',
          summaryAxis: 'social',
        },
        {
          code: 'C8.5',
          text: 'Australia should formally recognise Indigenous sovereignty alongside the Crown.',
          direction: 'negative',
          summaryAxis: 'social',
        },
      ],
    },
    {
      id: 'defence-foreign',
      code: 'C9',
      name: 'Defence & foreign affairs',
      blurb: "Australia's place in a contested region.",
      items: [
        {
          code: 'C9.1',
          text: 'Australia should significantly increase defence spending.',
          direction: 'positive',
          summaryAxis: 'social',
        },
        {
          code: 'C9.2',
          text: 'AUKUS and similar alliances should be a cornerstone of foreign policy.',
          direction: 'positive',
          summaryAxis: 'social',
        },
        {
          code: 'C9.3',
          text: 'Australia should prioritise independent foreign policy even when it strains key alliances.',
          direction: 'negative',
          summaryAxis: 'social',
        },
        {
          code: 'C9.4',
          text: 'Foreign aid spending should be substantially expanded.',
          direction: 'negative',
          summaryAxis: 'social',
        },
        {
          code: 'C9.5',
          text: 'Australia should maintain conscription-readiness frameworks.',
          direction: 'mixed',
          summaryAxis: 'none',
        },
      ],
    },
    {
      id: 'law-order',
      code: 'C10',
      name: 'Law, order & civil liberties',
      blurb: 'Crime, policing, and the rights of the individual.',
      items: [
        {
          code: 'C10.1',
          text: 'Tougher sentencing reduces serious crime.',
          direction: 'positive',
          summaryAxis: 'social',
        },
        {
          code: 'C10.2',
          text: 'Police forces should be expanded and better resourced.',
          direction: 'positive',
          summaryAxis: 'social',
        },
        {
          code: 'C10.3',
          text: 'Strong privacy protections should limit government surveillance, even at security costs.',
          direction: 'negative',
          summaryAxis: 'social',
        },
        {
          code: 'C10.4',
          text: 'Drug use should be treated primarily as a health issue, not a criminal one.',
          direction: 'negative',
          summaryAxis: 'social',
        },
        {
          code: 'C10.5',
          text: 'Restorative-justice programs should expand alongside conventional sentencing.',
          direction: 'mixed',
          summaryAxis: 'none',
        },
      ],
    },
    {
      id: 'social-cultural',
      code: 'C11',
      name: 'Social & cultural policy',
      blurb: 'Identity, family, and shared cultural life.',
      items: [
        {
          code: 'C11.1',
          text: 'Traditional family structures should be supported in policy.',
          direction: 'positive',
          summaryAxis: 'social',
        },
        {
          code: 'C11.2',
          text: 'Anti-discrimination protections should be strengthened, including gender identity.',
          direction: 'negative',
          summaryAxis: 'social',
        },
        {
          code: 'C11.3',
          text: 'Religious freedom protections should be expanded.',
          direction: 'positive',
          summaryAxis: 'social',
        },
        {
          code: 'C11.4',
          text: 'Reproductive rights, including abortion access, should be uniformly available across all states.',
          direction: 'negative',
          summaryAxis: 'social',
        },
        {
          code: 'C11.5',
          text: 'Public funding for arts and culture should be substantially increased.',
          direction: 'negative',
          summaryAxis: 'social',
        },
      ],
    },
    {
      id: 'governance-federation',
      code: 'C12',
      name: 'Governance, federation & democracy',
      blurb: 'How decisions get made — and by whom.',
      items: [
        {
          code: 'C12.1',
          text: 'Federal-state responsibilities should be clearly re-drawn to reduce duplication and waste.',
          direction: 'positive',
          summaryAxis: 'economic',
        },
        {
          code: 'C12.2',
          text: 'A federal anti-corruption commission with strong powers should be central to governance.',
          direction: 'negative',
          summaryAxis: 'social',
        },
        {
          code: 'C12.3',
          text: 'Compulsory voting and preferential systems are core strengths of our democracy.',
          direction: 'mixed',
          summaryAxis: 'none',
        },
        {
          code: 'C12.4',
          text: 'Australia should move toward becoming a republic.',
          direction: 'negative',
          summaryAxis: 'social',
        },
        {
          code: 'C12.5',
          text: 'Citizen assemblies should play a role in major reforms.',
          direction: 'negative',
          summaryAxis: 'social',
        },
      ],
    },
  ],
  crossCutting: [
    {
      code: 'B1',
      text: 'Policy success should be judged on 10-year outcomes, not the next election.',
      indicator: 'time-horizon',
    },
    {
      code: 'B2',
      text: 'Decisions should follow the best available evidence even when it crosses party lines.',
      indicator: 'evidence-orientation',
    },
    {
      code: 'B3',
      text: 'Australia needs significant structural reform, not just careful tinkering.',
      indicator: 'reform-orientation',
    },
    {
      code: 'B4',
      text: 'Good policy is more important than ideological consistency.',
      indicator: 'pragmatism',
    },
    {
      code: 'B5',
      text: 'We owe each other obligations of care and contribution that go beyond individual rights.',
      indicator: 'communitarian',
    },
    {
      code: 'B6',
      text: 'Reducing inequality of outcome is a legitimate goal of government.',
      indicator: 'equality',
    },
  ],
};
