import assert from 'node:assert/strict';
import test from 'node:test';
import { fetchTimelineEntries, type Entry } from '../src/lib/timeline-data';

const entry: Entry = {
  id: 'entry-1', date: '2026-10-24', title: 'An event',
  consequence: 'A consequence', url: 'https://example.com/source',
  createdAt: '2026-10-24T00:00:00.000Z',
};
const response = (data: unknown, status = 200): typeof fetch => async () => Response.json(data, { status });

test('handles the production API error without treating it as an empty timeline', async () => {
  await assert.rejects(fetchTimelineEntries(response({ error: 'Failed to fetch entries' }, 500)), /service is unavailable/);
});

test('rejects non-array success responses before they reach map/filter rendering', async () => {
  for (const data of [null, {}, { error: 'Failed to fetch entries' }, 'not entries', 42]) {
    await assert.rejects(fetchTimelineEntries(response(data)), /invalid response/);
  }
});

test('rejects malformed records and links that would crash TimelineItem', async () => {
  for (const data of [[null], [{}], [{ ...entry, title: null }], [{ ...entry, url: 'https://' }]]) {
    await assert.rejects(fetchTimelineEntries(response(data)), /invalid response/);
  }
});

test('distinguishes a valid empty timeline from an outage', async () => {
  assert.deepEqual(await fetchTimelineEntries(response([])), []);
});

test('loads valid entries and permits a fresh attempt after a provider failure', async () => {
  const calls: { url: RequestInfo | URL; options?: RequestInit }[] = [];
  const retryingProvider: typeof fetch = async (url, options) => {
    calls.push({ url, options });
    return calls.length === 1
      ? Response.json({ error: 'Failed to fetch entries' }, { status: 500 })
      : Response.json([entry]);
  };
  await assert.rejects(fetchTimelineEntries(retryingProvider), /service is unavailable/);
  assert.deepEqual(await fetchTimelineEntries(retryingProvider), [entry]);
  assert.equal(calls[1].url, '/api/entries');
  assert.equal(calls[1].options?.cache, 'no-store');
});

test('reports network and invalid JSON failures as recoverable load errors', async () => {
  await assert.rejects(fetchTimelineEntries(async () => { throw new Error('network'); }), /service is unavailable/);
  await assert.rejects(fetchTimelineEntries(async () => new Response('invalid JSON')), /invalid response/);
});
