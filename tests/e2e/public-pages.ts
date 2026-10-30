/** Every public page. Add new pages here: copy-rules, layout and SEO tests all use this list. */
export const LOCATIONS = ['brisbane', 'gold-coast', 'sunshine-coast', 'townsville', 'cairns', 'toowoomba', 'mackay', 'whitsundays'];
export const RESOURCES = [
  'can-a-gp-diagnose-adhd-in-queensland',
  'what-happens-in-an-adult-adhd-assessment',
  'adhd-and-sleep',
  'adhd-at-work',
  'telehealth-or-in-person-medicare',
];
export const PUBLIC_PAGES = [
  '/',
  '/other-options',
  '/check',
  '/book',
  '/cancellations',
  '/about',
  '/pricing',
  '/how-it-works',
  '/faq',
  '/contact',
  '/adhd-assessment',
  ...LOCATIONS.map((c) => `/adhd-assessment/${c}`),
  '/resources',
  ...RESOURCES.map((r) => `/resources/${r}`),
];
