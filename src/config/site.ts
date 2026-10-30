/**
 * Single source of truth for every value on the site that might change.
 * Nothing in src/pages or src/components may hard-code these: import from here.
 *
 * Any value starting with 'TODO:' is a placeholder. The compliance check
 * (Prompt 11) blocks production builds while any TODO remains.
 */

export type BookingProvider = 'VELLUTO_MSGP' | 'HALAXY' | 'HOTDOC' | 'HEALTHENGINE' | 'TODO';

/**
 * What each booking platform supports. 'embed' = its booking page may be shown
 * inside our page (iframe). Both are false until the vendor confirms in
 * writing that embedding works and is allowed [Requires verification].
 */
export const bookingProviders = {
  VELLUTO_MSGP: { name: 'MySpecialistGP (Velluto)', embed: false },
  HALAXY: { name: 'Halaxy', embed: false },
  HOTDOC: { name: 'HotDoc', embed: false },
  HEALTHENGINE: { name: 'HealthEngine', embed: false },
  TODO: { name: 'TODO: booking platform', embed: false },
} as const satisfies Record<BookingProvider, { name: string; embed: boolean }>;

/**
 * Fees in AUD, set by Sam on 31 Oct 2026. Change them here only:
 * prices and policy wording below are built from these.
 */
const FEES = { assessmentTotal: 745, payAtBooking: 425, payAppointment2: 320, review: 89 } as const;

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
  /** TODO: operating entity (not JIC Global). Sam, 31 Oct 2026: probably trading as Hyperfocus Health; not set up yet. */
  legalEntity: 'TODO: operating entity name',
  /** Sam, 31 Oct 2026: not needed on the site. Leave empty to hide it; the footer shows it only when set. */
  abn: '',

  /** Clinician */
  doctor: {
    name: 'Dr Sam Thomas',
    shortName: 'Dr Sam',
    title: 'Specialist GP (FRACGP)',
    /** Wording rule: 'special interest in adult ADHD', never 'ADHD specialist'. */
    focus: 'Special interest in adult ADHD',
    ahpra: 'MED0002290862',
    /** List only units actually completed, with year. */
    adhdTraining:
      "TODO: list only the units completed, with year, e.g. 'Unit 1: Adult ADHD: Diagnosis, Assessment and Physical Health Management (2026)'",
    /** One or two lines for the 'Outside work' section on /about. */
    /** Sam, 31 Oct 2026: leave out for now. Empty = only the 'Irish-born' line shows. */
    outsideWork: '',
    /** Third-person short bio for DoctorCard, schema and directory listings. */
    bioShort:
      'Dr Sam Thomas is a specialist GP (FRACGP) with a special interest in adult ADHD, and has ADHD himself. He graduated in medicine from the University of Limerick in 2011, worked in hospitals in Ireland and New Zealand, and trained as a GP in the UK. He has worked in Australian general practice since 2019, first on the Gold Coast and now in the Whitsundays, and sees adults across Queensland by video.',
    // Photos live in src/config/images.ts so the build can optimise them.
    /**
     * Optional 60-second intro video for /about. Leave src empty until it exists;
     * the video block stays hidden while empty. Put files in public/video/.
     */
    introVideo: {
      src: '',
      poster: '',
      captions: '',
    },
  },

  /** Physical clinic: the only one. Never imply a clinic anywhere else. */
  clinic: {
    name: 'Cannonvale Medical Centre',
    street: 'Unit 7/230 Shute Harbour Road',
    suburb: 'Cannonvale',
    state: 'QLD',
    postcode: '4802',
    region: 'Whitsundays',
    /** Verified on Healthdirect, 31 Oct 2026. */
    phone: '07 4948 0041',
    tel: 'tel:0749480041',
  },

  /** Contact */
  contact: {
    page: { label: 'Contact', href: '/contact' },
    phone: 'TODO: phone number',
    /** Public email for enquiries (not Sam's personal address). */
    email: 'TODO: public email',
    /** Business hours within which a human replies to messages. */
    /** Sam, 31 Oct 2026. */
    humanReplyWithin: '1 business day',
    /** Sam, 31 Oct 2026: aim for 1 business day. */
    complaintsReplyWithin: '1 business day',
  },

  /**
   * AI phone receptionist (Prompt 8). FAQ and message-taking only.
   * Agent instructions: docs/receptionist/. Vendor not chosen yet.
   */
  receptionist: {
    /**
     * Sam, 31 Oct 2026: must store data in Australia (ElevenLabs ruled out).
     * Shortlist in docs/receptionist/README.md.
     */
    vendor: 'TODO' as 'MAYAAI' | 'AIDIAL' | 'VORAL' | 'TODO',
    /** Shown next to the phone number on /contact. Must stay true: change it if the set-up changes. */
    label:
      "Our phone is answered by an AI assistant, 24/7. It can answer questions about the service, costs and booking. It can't give medical advice. A person replies to messages within 1 business day.",
    /**
     * Optional 'Talk to the assistant in your browser' button. Stays hidden
     * until both are set AND the vendor allows embedding. The script loads only
     * after the visitor clicks. Copy both values from the vendor's embed code.
     */
    webWidget: {
      scriptUrl: '',
      /** Custom element the vendor's script defines (from its embed code). */
      tag: '',
      agentId: '',
    },
  },

  /** Booking */
  booking: {
    /** ONE-LINE SWITCH: 'VELLUTO_MSGP' or 'HALAXY'. Then set url below. */
    provider: 'TODO' as BookingProvider,
    url: 'TODO: booking URL',
    /** In-person visits at Cannonvale: booked through the clinic, not the online platform. */
    inPerson: {
      hotdocUrl: 'https://www.hotdoc.com.au/medical-centres/cannonvale-QLD-4802/cannonvale-medical-centre/doctors/dr-sam-thomas-5',
      /** Patients must say this when booking, so the right appointment length is set aside. */
      sayWhenBooking: "say it's for an ADHD assessment",
      /** Sam, 31 Oct 2026: same fees in person; a Medicare rebate may apply (standard GP consult items). */
      feeNote: 'Same fees as video. You may be able to claim a Medicare rebate for each appointment.',
      /** Sam, 31 Oct 2026: care plan can be done in appointment 2 if in person and a regular patient there. */
      carePlanNote:
        "If you'll keep seeing Dr Sam at Cannonvale as your regular GP, you may be eligible for a GP chronic condition management plan. If so, he can do it during appointment 2 at no extra cost, and you may be able to claim a Medicare rebate for it. The plan can give you Medicare rebates for some visits to a psychologist, dietitian or other allied health worker.",
    },
    /** Minimum days between booking and video appointment 1 (allows intake + baseline checks). */
    minLeadDays: 10,
  },

  /** Prices in AUD. Keep as numbers; format in the UI. */
  prices: {
    /** Total to reach a diagnosis: intake + appointment 1 + appointment 2 + written plan. Same fee in person. Set by Sam 31 Oct 2026. */
    assessmentTotal: FEES.assessmentTotal,
    /** Sam, 31 Oct 2026: paid in two parts (must add up to assessmentTotal; a unit test checks). */
    payAtBooking: FEES.payAtBooking,
    payAppointment2: FEES.payAppointment2,
    /** Each review appointment while treatment is adjusted, until things are stable. Set by Sam 31 Oct 2026. */
    review: FEES.review,
    /** Ongoing review once stable (every 3-6 months). Sam, 31 Oct 2026: same as a review. */
    ongoingReview: FEES.review,
        /** Sam, 31 Oct 2026. */
    gstNote: 'There is no GST on these fees.',
    /** Wording for the blood test / ECG row on /pricing. */
    /** Sam, 31 Oct 2026: succinct, in line with how other services word it. */
    testsNote: 'Not included. Done at a local pathology centre or by your own GP, and often bulk-billed. Check any cost with them.',
    /**
     * ASSUMPTION used only for the 'typical first 3 months' example on /pricing:
     * number of review appointments in the first 3 months after diagnosis.
     */
    typicalReviewsFirst3Months: 3,
    currency: 'AUD',
  },

  /** Policies: wording shown to patients. */
  policies: {
    /** Sam, 31 Oct 2026: fee kept because the work is done. Wording (keeping appointment 1) needs Sam's OK. */
    refundIfUnsuitable:
      `If your intake shows this service clearly isn't right for you, Dr Sam emails you to explain why and where to go instead. The $${FEES.payAtBooking} isn't refunded, because he has already read your intake and prepared. You won't pay the $${FEES.payAppointment2}.`,
    /** Sam, 31 Oct 2026. */
    cancellation:
      "You can change or cancel for free up to 48 hours before your appointment. With less than 48 hours' notice, you pay 50% of that appointment's fee.",
    /** Sam, 31 Oct 2026. */
    noShow: "If you miss an appointment without telling us, you pay that appointment's full fee.",
    /** Sam, 31 Oct 2026. */
    notDiagnosed:
      `If it's clear at appointment 1 that ADHD isn't the answer, you won't need appointment 2 or pay for it. The $${FEES.payAtBooking} for appointment 1 isn't refunded: it covers reading your intake, preparing and the appointment. With your permission, Dr Sam writes to your GP.`,
  },

  /** Privacy wording used before the full privacy policy exists (Prompt 10). */
  privacy: {
    /** Sam, 31 Oct 2026: practice software is probably Halaxy. Confirm the data location once chosen. */
    storage: 'Your booking, intake and clinical records are kept in secure practice software, stored in Australia.',
  },

  /** Appointment lengths (minutes). */
  appointments: {
    assessment: 60,
    diagnosis: { min: 30, max: 45 },
    /** Every review, while adjusting and once stable. Sam, 31 Oct 2026. */
    reviewMinutes: 15,
    reviewIntervalWeeks: { min: 2, max: 4 },
    stableIntervalMonths: { min: 3, max: 6 },
    /** Sam, 31 Oct 2026: lengths are approximate. */
    lengthsNote: 'Appointment lengths are approximate. They depend on how complex your situation is.',
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
