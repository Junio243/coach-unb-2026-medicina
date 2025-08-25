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

test('parses JSON even when surrounded by extraneous text', () => {
  const noisyJson = 'resultado:\n```json\n{"foo": 1}\n``` fim';
  const result = safeParseJSON(noisyJson);
  assert.deepEqual(result, { foo: 1 });
});

test('parses first JSON when multiple objects are present', () => {
  const mixedJson = 'one {"a": 1} two {"b": 2}';
  const result = safeParseJSON(mixedJson);
  assert.deepEqual(result, { a: 1 });
});

test('parses JSON arrays', () => {
  const jsonArray = '[1,2,3]';
  const result = safeParseJSON(jsonArray);
  assert.deepEqual(result, [1, 2, 3]);
});

test('returns input unchanged when not a string', () => {
  const obj = { foo: 1 };
  const result = safeParseJSON(obj);
  assert.equal(result, obj);
});
