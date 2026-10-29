import test from 'node:test';
import { bootPage } from './stubdom.mjs';
import { same } from './fixtures.mjs';

test('shopping wheel plans identify the control whose pane must scroll', async () => {
  const { env } = await bootPage({ task: 'use-shop', widget: 'store' });
  env.reset(0, 'compare', { startState: 'off', judgment: 'off' });
  const key = `select:${env.spec.target}`;
  const model = { ...env.model, selected: null, shopReveal: { [key]: 120 } };
  same(env.taskDef.plan(model, env.spec), { wheel: [{ shop: 'pane', control: key }, 120] });
  same(env.taskDef.plan({ ...model, shopReveal: { [key]: 0 } }, env.spec), { click: { shop: key } });
});

test('coupon typing and Apply can reveal their own scrolling pane', async () => {
  const { env } = await bootPage({ task: 'use-shop', widget: 'store' });
  env.reset(0, 'coupon', { startState: 'off', judgment: 'off' });
  const model = { ...env.model, couponText: '', shopReveal: { coupon: 95 } };
  same(env.taskDef.plan(model, env.spec), { wheel: [{ shop: 'pane', control: 'coupon' }, 95] });
  same(env.taskDef.plan({ ...model, shopReveal: {} }, env.spec), { type: [{ shop: 'coupon' }, env.spec.want.code] });
  const ready = { ...model, couponText: env.spec.want.code, shopReveal: { apply: -40 } };
  same(env.taskDef.plan(ready, env.spec), { wheel: [{ shop: 'pane', control: 'apply' }, -40] });
  same(env.taskDef.plan({ ...ready, shopReveal: {} }, env.spec), { click: { shop: 'apply' } });
});
