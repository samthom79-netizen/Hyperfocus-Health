/**
 * Structured data (JSON-LD) for search engines and AI tools.
 *
 * Dr Sam is an IndividualPhysician (schema.org v24+: the type for one doctor;
 * plain Physician can also mean a practice) linked to the clinic with
 * practicesAt. honorificPrefix is a Person property that IndividualPhysician
 * doesn't have, so "Dr" is part of the name instead.
 */
import { isTodo, site } from '../config/site';

export function physicianSchema(opts: { pageUrl: string; imageUrl: string }) {
  const { doctor, clinic } = site;
  return {
    '@context': 'https://schema.org',
    '@type': 'IndividualPhysician',
    '@id': `${opts.pageUrl}#physician`,
    name: doctor.name,
    description: doctor.bioShort,
    url: opts.pageUrl,
    image: opts.imageUrl,
    medicalSpecialty: 'https://schema.org/PrimaryCare',
    practicesAt: {
      '@type': 'MedicalClinic',
      name: clinic.name,
      telephone: clinic.phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: clinic.street,
        addressLocality: clinic.suburb,
        addressRegion: clinic.state,
        postalCode: clinic.postcode,
        addressCountry: 'AU',
      },
    },
    areaServed: { '@type': 'State', name: 'Queensland' },
    sameAs: [] as string[],
  };
}

export interface Crumb {
  name: string;
  href: string;
}

/**
 * The service itself, on every page. Address = the business address (Sam,
 * 31 Oct 2026); location = Cannonvale Medical Centre, where patients are seen in person. Phone and email are added
 * once they're set in site.ts.
 */
export function businessSchema(base: URL) {
  const { clinic, contact, doctor, business } = site;
  const home = new URL('/', base).href;
  const out: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    '@id': `${home}#business`,
    name: site.name,
    description: `${site.tagline}. ${doctor.name}, ${doctor.title}.`,
    url: home,
    logo: new URL('/images/logo.png', base).href,
    image: new URL('/og/default.png', base).href,
    medicalSpecialty: 'https://schema.org/PrimaryCare',
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.street,
      addressLocality: business.suburb,
      addressRegion: business.state,
      postalCode: business.postcode,
      addressCountry: 'AU',
    },
    // Where patients are seen in person.
    location: {
      '@type': 'MedicalClinic',
      name: clinic.name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: clinic.street,
        addressLocality: clinic.suburb,
        addressRegion: clinic.state,
        postalCode: clinic.postcode,
        addressCountry: 'AU',
      },
    },
    areaServed: { '@type': 'State', name: 'Queensland' },
    knowsAbout: ['Adult ADHD assessment', 'Telehealth'],
    employee: { '@type': 'IndividualPhysician', '@id': `${new URL('/about', base).href}#physician`, name: doctor.name },
  };
  if (!isTodo(contact.phone)) out.telephone = contact.phone;
  if (!isTodo(contact.email)) out.email = contact.email;
  return out;
}

/** BreadcrumbList: Home first, then each level down to this page. */
export function breadcrumbSchema(trail: Crumb[], base: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: new URL(c.href, base).href,
    })),
  };
}
