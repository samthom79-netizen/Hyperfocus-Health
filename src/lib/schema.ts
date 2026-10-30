/**
 * Structured data (JSON-LD) for search engines and AI tools.
 *
 * Dr Sam is an IndividualPhysician (schema.org v24+: the type for one doctor;
 * plain Physician can also mean a practice) linked to the clinic with
 * practicesAt. honorificPrefix is a Person property that IndividualPhysician
 * doesn't have, so "Dr" is part of the name instead.
 */
import { site } from '../config/site';

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
