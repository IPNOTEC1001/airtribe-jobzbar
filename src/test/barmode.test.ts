import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const html = readFileSync('public/jobzbar.html', 'utf8');

describe('BAR MODE pricing and access', () => {
  it('charges a single one-time fee of ₹369', () => {
    expect(html).toMatch(/const BM_PRICE=369;/);
  });
  it('has removed the old ₹30/₹60/₹90 and ₹1001 prices', () => {
    expect(html).not.toMatch(/₹(30|60|90|1001)(?![0-9,])/);
  });
  it('keeps the paid test locked until the fee is paid', () => {
    const body = html.match(/function bmAllowed\(state\)\{([^}]+)\}/)?.[1];
    if (!body) throw new Error('BAR MODE access check missing');
    const allowed = new Function('state', body) as (s: unknown) => boolean;
    expect(allowed(null)).toBe(false);
    expect(allowed({ paid: false })).toBe(false);
    expect(allowed({ paid: true })).toBe(true);
  });
});
