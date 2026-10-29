import test from 'node:test';
import assert from 'node:assert/strict';
import { roundPage } from './fixtures.mjs';

test('reply: free report clauses preserve punctuation inside labels, including label aliases', async () => {
  const { win } = await roundPage();
  const { freeShare } = win.__megawobKit.reply;
  const facts = [
    { label: 'SKU of Dish Drying Rack, 2-Tier', labels: ['Code for Rack, 2-Tier'], value: 'HU824210' },
    { label: 'Price of Harbor Supply Co. carafe', value: '$119.00' },
    { label: 'Room', value: 'Juniper Room, 2nd Floor' },
  ];
  for (const label of [facts[0].label, facts[0].labels[0], 'SKU OF DISH DRYING RACK,   2-TIER']) {
    const message = `${label}: HU824210; Price of Harbor Supply Co. carafe: $119.00; Room: Juniper Room, 2nd Floor`;
    assert.equal(freeShare(facts, message), 1, message);
  }
});

test('reply: protecting a punctuated label leaves guess boundaries and length bounds intact', async () => {
  const { win } = await roundPage();
  const { freeShare, freeLimit } = win.__megawobKit.reply;
  const facts = [{ label: 'SKU of Dish Drying Rack, 2-Tier', value: 'HU824210' }];
  assert.equal(freeLimit(facts), 160);
  for (const message of [
    `${facts[0].label}: wrong, HU824210`,
    `${facts[0].label}: one two three four five HU824210`,
    `${facts[0].label}: HU824210 ${'dump '.repeat(40)}`,
  ]) assert.equal(freeShare(facts, message), 0, message);
  // Ordinary comma-separated prose keeps the original clause behavior.
  assert.equal(freeShare([{ label: 'Value', value: '12' }, { label: 'Status', value: 'Saved' }],
    'Done: value 12, status saved.'), 1);
});

test('reply: a sentence break inside a value does not split its clause', async () => {
  const { win } = await roundPage();
  const { freeShare } = win.__megawobKit.reply;
  const facts = [{ label: 'Selected text', value: 'account holder. Good' }];
  assert.equal(freeShare(facts, 'Selected text: account holder. Good.'), 1);
  // Only the complete value is protected: a period elsewhere still ends the clause.
  assert.equal(freeShare(facts, 'Selected text: account holder. Something good.'), 0);
});
