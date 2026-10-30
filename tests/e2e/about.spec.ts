import { expect, test } from '@playwright/test';
import { site } from '../../src/config/site';

test.describe('/about', () => {
  test('sections in order, word for word headings', async ({ page }) => {
    await page.goto('/about');
    const headings = await page.locator('main h1, main h2').allInnerTexts();
    expect(headings).toEqual([
      'Dr Sam Thomas',
      'Short version',
      'Why I do this',
      "Where I've worked",
      'What that means for you',
      'How I work',
      'Qualifications',
      'Outside work',
    ]);
    await expect(page.getByRole('list', { name: 'At a glance' }).getByRole('listitem')).toHaveText([
      'Specialist GP (FRACGP)',
      'Special interest in adult ADHD',
      'Has ADHD himself',
    ]);
  });

  test('headshot is at most 320px wide and served as AVIF/WebP', async ({ page }) => {
    await page.goto('/about');
    const img = page.locator('main picture img').first();
    await expect(img).toHaveAttribute('alt', 'Dr Sam Thomas, specialist GP, in navy scrubs with a stethoscope');
    expect((await img.boundingBox())!.width).toBeLessThanOrEqual(320);
    const types = await page.locator('main picture').first().locator('source').evaluateAll((s) => s.map((e) => e.getAttribute('type')));
    expect(types).toEqual(['image/avif', 'image/webp']);
  });

  test('timeline has 5 entries, from 2011 to now', async ({ page }) => {
    await page.goto('/about');
    const items = page.locator('section[aria-labelledby="timeline-heading"] ol > li');
    await expect(items).toHaveCount(5);
    await expect(items.first()).toContainText('2011');
    await expect(items.first()).toContainText('University of Limerick');
    await expect(items.last()).toContainText('Now');
  });

  test('qualifications include AHPRA number and law degree', async ({ page }) => {
    await page.goto('/about');
    const main = page.locator('main');
    await expect(main).toContainText(`registration number ${site.doctor.ahpra}`);
    await expect(main).toContainText("Law degree: Bachelor of Laws (LLB), King's College London");
    await expect(main).toContainText('Fellow of the Royal Australian College of General Practitioners (FRACGP)');
  });

  test('undecided lines show as TODO boxes', async ({ page }) => {
    await page.goto('/about');
    const todos = page.locator('main .todo');
    await expect(todos).toHaveCount(
      [site.doctor.adhdTraining, site.doctor.outsideWork].filter((v) => v.startsWith('TODO')).length,
    );
  });

  test('intro video stays hidden until a file is set', async ({ page }) => {
    test.skip(Boolean(site.doctor.introVideo.src), 'video is set');
    await page.goto('/about');
    await expect(page.locator('video, [data-intro-video]')).toHaveCount(0);
  });

  test('ends with the site CTA', async ({ page }) => {
    await page.goto('/about');
    await expect(page.locator('[data-cta="about"]')).toHaveAttribute('href', '/check');
    await expect(page.locator('[data-cta="about"]')).toContainText('Check if this is for you (60 sec)');
  });

  test('structured data: IndividualPhysician linked to the clinic', async ({ page }) => {
    await page.goto('/about');
    const raw = await page.locator('head script[type="application/ld+json"]').textContent();
    const data = JSON.parse(raw!);
    expect(data['@context']).toBe('https://schema.org');
    expect(data['@type']).toBe('IndividualPhysician');
    expect(data.name).toBe('Dr Sam Thomas');
    expect(data.description).toBe(site.doctor.bioShort);
    expect(data.medicalSpecialty).toBe('https://schema.org/PrimaryCare');
    expect(data.practicesAt['@type']).toBe('MedicalClinic');
    expect(data.practicesAt.address.addressLocality).toBe('Cannonvale');
    expect(data.image).toMatch(/^https:\/\/.+\.webp$/);
    expect(data.sameAs).toEqual([]);
  });
});

test.describe('/book in-person option', () => {
  test('HotDoc link, clinic phone and the ADHD-assessment instruction', async ({ page }) => {
    await page.goto('/book');
    const box = page.locator('[data-in-person]');
    await expect(box).toContainText("say it's for an ADHD assessment");
    await expect(box.getByRole('link', { name: /HotDoc/ })).toHaveAttribute('href', site.booking.inPerson.hotdocUrl);
    await expect(box.getByRole('link', { name: /07 4948 0041/ })).toHaveAttribute('href', 'tel:0749480041');
  });
});
