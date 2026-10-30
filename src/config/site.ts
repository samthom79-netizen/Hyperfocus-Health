/**
 * Single source of truth for every value on the site that might change.
 * Nothing in src/pages or src/components may hard-code these: import from here.
 *
 * Any value starting with 'TODO:' is a placeholder. The compliance check
 * (Prompt 11) blocks production builds while any TODO remains.
 */

export type BookingProvider = 'VELLUTO_MSGP' | 'HALAXY' | 'TODO';

/**
 * What each booking platform supports. 'embed' = its booking page may be shown
 * inside our page (iframe). Both are false until the vendor confirms in
 * writing that embedding works and is allowed [Requires verification].
 */
export const bookingProviders = {
  VELLUTO_MSGP: { name: 'MySpecialistGP (Velluto)', embed: false },
  HALAXY: { name: 'Halaxy', embed: false },
  TODO: { name: 'TODO: booking platform', embed: false },
} as const satisfies Record<BookingProvider, { name: string; embed: boolean }>;

export const site = {
  /**
   * PRE-LAUNCH SWITCH. While false, every page is hidden from search engines
   * (noindex meta tag, X-Robots-Tag header, robots.txt disallow), because the
   * preview link is public. Set to true only at go-live (Prompt 12).
   */
  launched: false,

  /** Brand */
  name: 'Hyperfocus Health',
  tagline: 'Adult ADHD assessment by video, for Queenslanders',
  /** TODO: replace with the real domain once registered */
  url: 'https://hyperfocushealth.example',
  /** TODO: operating entity (not JIC Global) and its ABN */
  legalEntity: 'TODO: operating entity name',
  abn: 'TODO: ABN',

  /** Clinician */
  doctor: {
    name: 'Dr Sam Thomas',
    shortName: 'Dr Sam',
    title: 'Specialist GP (FRACGP)',
    /** Wording rule: 'special interest in adult ADHD', never 'ADHD specialist'. */
    focus: 'Special interest in adult ADHD',
    ahpra: 'MED0002290862',
    /** Third-person short bio for DoctorCard, schema and directory listings. */
    bioShort:
      'Dr Sam Thomas is a specialist GP (FRACGP) with a special interest in adult ADHD, and has ADHD himself. He graduated in medicine from the University of Limerick in 2011, worked in hospitals in Ireland and New Zealand, and trained as a GP in the UK. He has worked in Australian general practice since 2019, first on the Gold Coast and now in the Whitsundays, and sees adults across Queensland by video.',
    // Photos live in src/config/images.ts so the build can optimise them.
  },

  /** Physical clinic: the only one. Never imply a clinic anywhere else. */
  clinic: {
    name: 'Cannonvale Medical Centre',
    street: 'Unit 7/230 Shute Harbour Road',
    suburb: 'Cannonvale',
    state: 'QLD',
    postcode: '4802',
    region: 'Whitsundays',
  },

  /** Contact */
  contact: {
    phone: 'TODO: phone number',
    /** Public email for enquiries (not Sam's personal address). */
    email: 'TODO: public email',
    /** Business hours within which a human replies to messages. */
    humanReplyWithin: 'TODO: e.g. 1 business day',
    complaintsReplyWithin: 'TODO: e.g. 5 business days',
  },

  /** Booking */
  booking: {
    /** ONE-LINE SWITCH: 'VELLUTO_MSGP' or 'HALAXY'. Then set url below. */
    provider: 'TODO' as BookingProvider,
    url: 'TODO: booking URL',
    /** How people book an in-person visit at Cannonvale (link or phone). */
    inPerson: 'TODO: how to book in person at Cannonvale (clinic phone or online booking link)',
    /** Minimum days between booking and video appointment 1 (allows intake + baseline checks). */
    minLeadDays: 10,
  },

  /** Prices in AUD. Keep as numbers; format in the UI. */
  prices: {
    /** Total to reach a diagnosis: intake + appointment 1 + appointment 2 + written plan. */
    assessmentTotal: 'TODO: e.g. 695',
    /** Each review appointment while treatment is adjusted. */
    review: 'TODO',
    /** Optional bundle: diagnosis + 3 months of reviews. */
    bundle: 'TODO',
    /** Ongoing review once stable (every 3-6 months). */
    ongoingReview: 'TODO',
    /** In-person at Cannonvale: typical out-of-pocket after the Medicare rebate. */
    inPersonGap: 'TODO',
    reviewLengthMinutes: 'TODO: e.g. 20',
    gstNote: 'TODO: confirm GST treatment with accountant',
    currency: 'AUD',
  },

  /** Policies: wording shown to patients. */
  policies: {
    refundIfUnsuitable: 'TODO: refund rule if Dr Sam finds the service unsuitable after reviewing the intake',
    cancellation: 'TODO: how much notice is needed to change or cancel, and any fee',
    noShow: 'TODO: what happens, and any fee, if an appointment is missed without notice',
    notDiagnosed: 'TODO: what the patient receives, and the fee, if ADHD is not diagnosed',
  },

  /** Appointment lengths (minutes). */
  appointments: {
    assessment: 60,
    diagnosis: { min: 30, max: 45 },
    reviewIntervalWeeks: { min: 2, max: 4 },
    stableIntervalMonths: { min: 3, max: 6 },
  },

  /** Crisis numbers: shown in every footer and on the checker safety screen. */
  crisis: {
    emergency: { label: 'In an emergency call 000', number: '000', tel: 'tel:000' },
    lines: [
      { label: 'Lifeline', number: '13 11 14', tel: 'tel:131114' },
      { label: '1300 MH CALL', number: '1300 642 255', tel: 'tel:1300642255' },
      { label: 'Suicide Call Back Service', number: '1300 659 467', tel: 'tel:1300659467' },
      { label: '13YARN (Aboriginal and Torres Strait Islander people)', number: '13 92 76', tel: 'tel:139276' },
    ],
    /** Shown on the checker's support screen when the person said they are under 18. */
    youth: { label: 'Kids Helpline (ages 5 to 25)', number: '1800 55 1800', tel: 'tel:1800551800' },
  },

  /** External links */
  links: {
    qldGovAdhd: 'https://www.qld.gov.au/health/conditions/all/adhd',
    oaic: 'https://www.oaic.gov.au',
    oho: 'https://www.oho.qld.gov.au',
    ahpra: 'https://www.ahpra.gov.au',
  },

  /** Social: leave empty until accounts exist. */
  social: {
    facebook: '',
    instagram: '',
    linkedin: '',
  },

  /** Analytics: Plausible or Cloudflare Web Analytics only. Empty = none loaded. */
  analytics: {
    provider: '' as '' | 'plausible' | 'cloudflare',
    token: '',
  },

  /** Site-wide primary call to action. */
  cta: {
    label: 'Check if this is for you (60 sec)',
    /** The same label in two parts, so '(60 sec)' never breaks onto its own line. */
    text: 'Check if this is for you',
    time: '60 sec',
    /** Short label for the header button. */
    shortLabel: 'Check eligibility',
    href: '/check',
  },

  /** Main navigation: max 4 items. */
  nav: [
    { label: 'How it works', href: '/how-it-works' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'About Dr Sam', href: '/about' },
    { label: 'FAQ', href: '/faq' },
  ],

  /** Footer legal and policy links. */
  footerLinks: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Cancellations', href: '/cancellations' },
    { label: 'Complaints', href: '/complaints' },
    { label: 'Accessibility', href: '/accessibility' },
  ],

  /** Service limits, used in copy and in the eligibility checker. */
  eligibility: {
    minAge: 18,
    state: 'Queensland',
  },

  /**
   * 'Not suitable for' list, worded EXACTLY as in CLAUDE.md (the only place
   * medical categories may appear). Shown kindly, always with a next step.
   * Used by the homepage and the eligibility checker.
   */
  notSuitable: [
    'drug or alcohol dependence now or in the past',
    'bipolar disorder',
    'psychosis',
    'current significant suicidal thoughts',
    'an eating disorder',
    "severe depression or anxiety that isn't being treated",
    'heart disease, uncontrolled high blood pressure or unexplained fainting',
    'pregnancy or breastfeeding',
    'currently taking a prescribed controlled (Schedule 8) medicine for pain, sleep or anxiety',
    'autism or intellectual disability needing significant daily support',
  ],
} as const;

export type SiteConfig = typeof site;

/** True when a config value is still a placeholder. Used by tests and the compliance check. */
export function isTodo(value: unknown): boolean {
  return typeof value === 'string' && value.trim().toUpperCase().startsWith('TODO');
}

/** Formats a price value: '$695' for a number or numeric string, or the TODO text as-is. */
export function formatPrice(value: number | string): string {
  if (typeof value === 'number') return `$${value.toLocaleString('en-AU')}`;
  if (isTodo(value)) return value;
  const n = Number(value);
  return Number.isFinite(n) ? `$${n.toLocaleString('en-AU')}` : value;
}

/** Walks the config and returns every placeholder path, e.g. "contact.phone". */
export function listTodos(obj: unknown = site, prefix = ''): string[] {
  if (isTodo(obj)) return [prefix];
  if (obj && typeof obj === 'object') {
    return Object.entries(obj as Record<string, unknown>).flatMap(([key, value]) =>
      listTodos(value, prefix ? `${prefix}.${key}` : key),
    );
  }
  return [];
}

/** The active booking platform's settings. */
export function bookingProvider() {
  return bookingProviders[site.booking.provider];
}
