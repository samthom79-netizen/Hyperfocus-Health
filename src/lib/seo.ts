/** Small helpers shared by the page shell, the OG image script and tests. */

/** Share-image file name for a path: '/' -> 'home', '/adhd-assessment/brisbane/' -> 'adhd-assessment-brisbane'. */
export function ogSlug(pathname: string): string {
  const s = pathname.replace(/^\/+|\/+$/g, '').replace(/\//g, '-');
  return s || 'home';
}

/** The public URL path for a built page: '/index.html' -> '/', '/pricing.html' or '/pricing/' -> '/pricing'. */
export function cleanPath(pathname: string): string {
  return pathname.replace(/(\/index)?\.html$/, '').replace(/\/+$/, '') || '/';
}
