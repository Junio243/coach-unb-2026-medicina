import test from 'node:test';
import assert from 'node:assert/strict';
import { safeParseJSON } from '../services/safeParseJSON.js';

test('parses valid JSON', () => {
  const json = '{"foo": 1}';
  const result = safeParseJSON(json);
  assert.deepEqual(result, { foo: 1 });
});

test('throws error with expected message for invalid JSON', () => {
  const badJson = '{foo: 1';
  assert.throws(() => safeParseJSON(badJson), { message: 'Resposta inválida do modelo.' });
});
