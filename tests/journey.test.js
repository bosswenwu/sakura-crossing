import { test } from 'node:test';
import assert from 'node:assert/strict';

// Catch premature arrivals, repeated discoveries, and broken persisted data.
const journey = await import('../src/journey/state.js').catch(() => ({}));
test('discovers only places inside their arrival radius and never twice', () => {
  assert.equal(typeof journey.discover, 'function');
  const places = [{ id: 'a', x: 0, z: 0, radius: 5 }, { id: 'b', x: 30, z: 0, radius: 4 }];
  assert.deepEqual(journey.discover({ x: 3, z: 4 }, [], places), ['a']);
  assert.deepEqual(journey.discover({ x: 3, z: 4.1 }, [], places), []);
  assert.deepEqual(journey.discover({ x: 0, z: 0 }, ['a'], places), ['a']);
});
test('restores only known unique place ids and recovers corrupt saves', () => {
  assert.equal(typeof journey.restore, 'function');
  assert.deepEqual(journey.restore('["crossing","crossing","unknown"]'), ['crossing']);
  for (const bad of ['bad json', '{}', 'null', '42']) assert.deepEqual(journey.restore(bad), []);
});
test('guidance measures distance and relative bearing from the current heading', () => {
  assert.equal(typeof journey.guide, 'function');
  assert.deepEqual(journey.guide({ x: 0, z: 0 }, 0, { x: 3, z: -4 }), { distance: 5, bearing: Math.atan2(3, 4) });
  const turned = journey.guide({ x: 0, z: 0 }, -Math.PI / 2, { x: 10, z: 0 });
  assert.ok(Math.abs(turned.bearing) < 1e-9);
});
