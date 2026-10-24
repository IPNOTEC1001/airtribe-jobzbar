import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// Exercise the exact access predicate shipped in the portable HTML.
const html = readFileSync('public/jobzbar.html', 'utf8');
const match = html.match(/function venueAllowed\(session,venueId,now=Date\.now\(\)\)\{([^}]+)\}/);
const predicateBody = match?.[1];
if (!predicateBody) throw new Error('Venue access predicate is missing');
const allowed = new Function('session', 'venueId', 'now', predicateBody) as (
  session: { mode: string; venueId: string; expiresAt: number } | null,
  venueId: string,
  now: number,
) => boolean;
const session = { mode: 'emulation', venueId: 'blr', expiresAt: 2000 };

describe('Partner venue chat access in the emulation', () => {
  it('locks chat without a portal session', () => {
    expect(allowed(null, 'blr', 1000)).toBe(false);
  });
  it('allows an active session only for its own venue', () => {
    expect(allowed(session, 'blr', 1000)).toBe(true);
    expect(allowed(session, 'lon', 1000)).toBe(false);
  });
  it('locks chat as soon as the venue session expires', () => {
    expect(allowed(session, 'blr', 2000)).toBe(false);
  });
  it('does not mistake an emulation for a real verified session', () => {
    expect(allowed({ ...session, mode: 'verified' }, 'blr', 1000)).toBe(false);
  });
});