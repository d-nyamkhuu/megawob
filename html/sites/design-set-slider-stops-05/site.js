// Classic Macintosh (1988) window: stippled title bar, bordered sheet with the slider, a records list, a footer strip.
(function () {
  'use strict';
  const ROWS = [
    ['Front Lawn', 'North Yard', 'Pop-up', 'Jet'],
    ['Side Yard', 'East Side', 'Rotor', 'Fan'],
    ['Garden Bed', 'West Garden', 'Pop-up', 'Mist'],
    ['Back Lawn', 'South Yard', 'Rotor', 'Fan'],
    ['Driveway', 'Near Garage', 'Pop-up', 'Jet'],
    ['Patio', 'Back Deck', 'Pop-up', 'Mist'],
  ];
  const frame = () => function (ctx) {
    const u = ctx.util;
    const endRng = ctx.rng.fork('chrome/end');
    const placement = endRng.pick(['footer', 'footer', 'header', 'note']);
    const endLabels = ctx.content && ctx.content.END_LABELS;
    const endLabel = endRng.pick(Array.isArray(endLabels) && endLabels.length ? endLabels : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"]);
    const label = typeof endLabel === 'string' ? endLabel : endLabel.label || endLabel.text || endLabel.name || String(endLabel);
    const collideRng = ctx.rng.fork('chrome/collide');
    const pool = (Array.isArray(endLabels) && endLabels.length ? endLabels : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"]).map(x => typeof x === 'string' ? x : x.label || x.text || x.name || String(x)).filter(x => x.trim().toLowerCase() !== label.trim().toLowerCase());
    const collision = collideRng.bool(.3) && pool.length ? collideRng.pick(pool) : null;
    document.body.className = `mac instruction-${ctx.display}`;
    let submit = null;
    const mk = (parent, cls, text) => {
      const b = u.el('button', cls, parent, text);
      b.type = 'button';
      b.dataset.role = 'submit';
      b.setAttribute('aria-label', label);
      b.title = label;
      b.onclick = () => ctx.submit();
      return b;
    };
    const win = u.el('div', 'mac-win', document.body);
    const bar = u.el('header', 'mac-title', win);
    u.el('span', 'mac-apple', bar, '');
    u.el('span', 'mac-name', bar, 'Watering Setup');
    u.el('span', 'mac-zoom', bar);
    if (!ctx.finish && placement === 'header') submit = mk(bar, 'mac-btn mac-hdr', label);
    const note = u.el('div', 'mac-note', win);
    const instruction = u.el('div', 'instruction', note, ctx.instruction);
    if (ctx.display === 'hidden') note.hidden = true;
    if (ctx.display === 'panel' || ctx.display === 'toast') note.classList.add('mac-' + ctx.display);
    if (ctx.display === 'toast') {
      const close = u.el('button', 'mac-btn instruction-close', instruction, 'OK');
      close.onclick = () => { note.hidden = true; };
    }
    const main = u.el('div', 'mac-main', win);
    const stage = u.el('main', 'record-stage', main);
    stage.dataset.role = 'stage';
    const list = u.el('section', 'mac-list', main);
    u.el('div', 'mac-list-title', list, 'Sprinklers');
    const tbl = u.el('table', '', list);
    const hr = u.el('tr', '', u.el('thead', '', tbl));
    for (const h of ['Name', 'Location', 'Type', 'Spray Pattern']) u.el('th', '', hr, h);
    const tb = u.el('tbody', '', tbl);
    for (const r of ROWS) {
      const tr = u.el('tr', '', tb);
      r.forEach((c, i) => { const td = u.el('td', '', tr, c); if (!i) td.className = 'mac-first'; });
    }
    const footer = u.el('footer', 'mac-foot', win);
    const left = u.el('div', 'mac-foot-l', footer, '5 of 6 items');
    const actions = u.el('div', 'mac-actions', footer);
    if (!ctx.finish && placement === 'note') {
      submit = u.el('a', 'mac-link', actions, label);
      submit.href = '#';
      submit.dataset.role = 'submit';
      submit.setAttribute('aria-label', label);
      submit.title = label;
      submit.onclick = e => { e.preventDefault(); ctx.submit(); };
    }
    if (collision) {
      const d = u.el('button', 'mac-btn end-xtra', actions, collision);
      d.type = 'button';
      d.dataset.role = 'xtra';
      d.onclick = () => env.log('decoy', { label: collision, collide: true });
    }
    const reset = u.el('button', 'mac-btn reset', actions, 'Reset');
    reset.type = 'button';
    reset.dataset.action = 'reset';
    if (!ctx.finish && placement === 'footer') submit = mk(actions, 'mac-btn mac-default', label);
    return { stage, submit };
  };
  const overlay = function (ctx) {
    const u = ctx.util;
    const el = u.el('aside', 'mac-dlg overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const text = ({ chat: 'Need help? Ask the Help Desk.', cookie: 'This program may save your preferences.', toast: 'Disk almost full.', promo: 'Upgrade to System 6.0.8 today!', banner: 'Notice: backup your disks.' })[ctx.kind];
    u.el('p', '', el, text);
    const b = u.el('button', 'mac-btn mac-default', el, 'OK');
    b.type = 'button';
    b.setAttribute('aria-label', 'Close');
    b.onclick = () => ctx.dismiss('close');
    return { el, dismiss: b, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  };
  env.site({
    name: 'design-set-slider-stops-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/set-slider-horizontal-11',
    design: { parts: { frame, drawOverlay: () => overlay } },
  });
})();
