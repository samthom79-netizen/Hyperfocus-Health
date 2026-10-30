import { describe, expect, it } from 'vitest';
import { formatPrice, isTodo, listTodos, site } from '../../src/config/site';

/**
 * Guards the values that must never regress, whatever else changes.
 */
describe('site config', () => {
  it('names the only clinic as Cannonvale', () => {
    expect(site.clinic.suburb).toBe('Cannonvale');
    expect(site.clinic.state).toBe('QLD');
  });

  it('uses the permitted title wording', () => {
    const titleText = `${site.doctor.title} ${site.doctor.focus}`.toLowerCase();
    expect(titleText).toContain('specialist gp');
    expect(titleText).not.toContain('adhd specialist');
    expect(titleText).not.toContain('expert');
  });

  it('carries the required crisis numbers', () => {
    expect(site.crisis.emergency.number).toBe('000');
    const numbers = site.crisis.lines.map((l) => l.number);
    expect(numbers).toContain('13 11 14');
    expect(numbers).toContain('1300 642 255');
  });

  it('limits the service to Queensland adults', () => {
    expect(site.eligibility.minAge).toBe(18);
    expect(site.eligibility.state).toBe('Queensland');
  });

  it('detects TODO placeholders', () => {
    expect(isTodo('TODO: phone number')).toBe(true);
    expect(isTodo('0749480041')).toBe(false);
    expect(isTodo(42)).toBe(false);
  });

  it('keeps the main nav to 4 items and has the required footer links', () => {
    expect(site.nav.length).toBeLessThanOrEqual(4);
    const footer = site.footerLinks.map((l) => l.label);
    expect(footer).toEqual(['Privacy', 'Terms', 'Cancellations', 'Complaints', 'Accessibility']);
  });

  it('formats prices and leaves placeholders alone', () => {
    expect(formatPrice(695)).toBe('$695');
    expect(formatPrice('1250')).toBe('$1,250');
    expect(formatPrice('TODO: e.g. 695')).toBe('TODO: e.g. 695');
  });

  it('keeps the CTA label and its two parts in sync', () => {
    expect(`${site.cta.text} (${site.cta.time})`).toBe(site.cta.label);
  });

  it('lists every remaining placeholder by path', () => {
    const todos = listTodos();
    expect(todos).toContain('contact.phone');
    expect(todos.every((p) => typeof p === 'string' && p.length > 0)).toBe(true);
  });
});
