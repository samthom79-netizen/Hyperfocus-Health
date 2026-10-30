/**
 * Photos and brand images. Kept in src/assets so the build converts them to
 * AVIF/WebP at the sizes each page needs (the originals are 3.5-5.5 MB PNGs).
 *
 * Alt text lives with the image so it is never forgotten.
 */
import type { ImageMetadata } from 'astro';
import headshot from '../assets/photos/dr-sam-headshot.png';
import desk from '../assets/photos/dr-sam-desk.png';
import consult from '../assets/photos/dr-sam-consult.png';
import logoIcon from '../assets/brand/logo-icon.png';

export interface SiteImage {
  src: ImageMetadata;
  alt: string;
}

export const images = {
  /** PRIMARY photo of Sam. Closest likeness. Use on /about and in DoctorCard. */
  headshot: {
    src: headshot,
    alt: 'Dr Sam Thomas, specialist GP, in navy scrubs with a stethoscope',
  },
  /** Secondary: keep small (max 640px wide). */
  desk: {
    src: desk,
    alt: 'Dr Sam Thomas at his desk with a laptop, ready for a video appointment',
  },
  /** Secondary: keep small (max 640px wide). */
  consult: {
    src: consult,
    alt: 'Dr Sam Thomas listening during a video appointment, notepad beside his laptop',
  },
  logoIcon: {
    src: logoIcon,
    alt: '',
  },
} satisfies Record<string, SiteImage>;
