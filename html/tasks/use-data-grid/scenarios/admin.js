/*
 * use-data-grid / shared by crm, virtual and colfilter: the A1 ticket-app sampler
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('use-data-grid');
  const { BUDGET, COLW, DOMAINS, fitWidths, person, STATUS } = fam.lib;

  function sampleAdmin(rng, opts) {
    const scenario = opts.scenario;
    const level = opts.level || 'normal';
    const spec = { scenario, domain: 'tickets', title: rng.pick(DOMAINS.tickets.title), entity: 'ticket', entities: 'tickets',
      startMode: opts.startMode || 'off', isplit: opts.isplit || 'train', csplit: opts.csplit || 'train',
      level, ood: !!opts.ood, locale: 'en-US', currency: 'USD', keys: false, route: 'menu', statusCol: 'status',
      statuses: STATUS.tickets.slice(), recoverable: true };
    const n = scenario === 'virtual' ? (opts.ood ? 120 : level === 'easy' ? 24 : level === 'medium' ? 40 : 64)
      : opts.ood ? 12 : level === 'easy' ? 6 : level === 'medium' ? 8 : 10;
    spec.rows = DOMAINS.tickets.gen(rng, spec, n);
    spec.cols = fitWidths(DOMAINS.tickets.cols.map(c => ({ ...c, w: COLW[c.type] })), BUDGET);
    spec.pageSize = scenario === 'virtual' ? 6 : n;
    if (scenario === 'colfilter') {
      const values = [rng.pick(['High', 'Urgent'])];
      if (level !== 'easy' && rng.bool(0.4)) values.push(values[0] === 'High' ? 'Urgent' : 'High');
      spec.rows[0].c.priority = values[0];
      spec.rows[1].c.priority = values[0];
      spec.rows[n - 1].c.priority = 'Low';
      // a second value no row has could never be filtered on (the menu lists the rows' values only)
      if (values.length > 1 && !spec.rows.some(r => r.c.priority === values[1])) spec.rows[2].c.priority = values[1];
      spec.goal = { col: 'priority', values, how: 'match', action: 'status', value: 'Closed' };
      spec.target = spec.rows.filter(r => values.includes(r.c.priority)).map(r => r.id);
    } else {
      const row = spec.rows[rng.int(scenario === 'virtual' ? 12 : 0, n - 1)];
      const col = rng.pick(['owner', 'subject']);
      const text = col === 'owner' ? person(rng, spec).full : rng.pick(['Resolve billing discrepancy', 'Review account permissions', 'Replace damaged shipment']);
      spec.goal = { row: row.id, col, text: text === row.c[col] ? text + ' II' : text };
      spec.target = [row.id];
    }
    return spec;
  }

  Object.assign(fam.lib, { sampleAdmin });
})();
