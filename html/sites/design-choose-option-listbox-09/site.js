(function () {
  'use strict';
  const C = {
    'site': 'design-choose-option-listbox-09',
    'brand': 'LumiCal 1.2.0  - Display Calibration Utility',
    'instruction': 'left',
  };
  const SWATCH = [
    ['Olive', '#7a7a0a'],
    ['Orange', '#ff6a00'],
    ['Peach', '#ffd0bd'],
    ['Plum', '#a070a8'],
  ];
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const labels = ctx.content.END_LABELS.map(labelOf);
      const original = er.bool(0.5);
      const placement = original ? 'footer' : er.pick(['toolbar', 'link']);
      const endLabel = original ? 'Submit' : er.pick(labels);
      const cr = ctx.rng.fork('chrome/collide');
      const others = labels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
      const collide = cr.bool(0.3) && others.length ? cr.pick(others) : null;
      const top = u.el('header', 'lc-title', document.body);
      top.innerHTML =
        '<svg class="lc-ico" viewBox="0 0 30 30"><rect x="2" y="1" width="26" height="21" fill="#c8d4e8" stroke="#223" stroke-width="2"/><rect x="5" y="4" width="20" height="15" fill="#2a58b8" stroke="#111"/><rect x="12" y="23" width="6" height="3" fill="#aaa"/><rect x="8" y="27" width="14" height="2" fill="#ccc" stroke="#222"/></svg>';
      u.el('span', 'lc-brand', top, C.brand);
      const wb = u.el('span', 'lc-wbtns', top);
      ['_', '□', '×'].forEach((t) => u.el('i', '', wb, t));
      const nav = u.el('nav', 'lc-menu', document.body);
      ['File', 'Edit', 'Tools', 'Help'].forEach((t) => u.el('span', '', nav, t));
      const body = u.el('div', 'lc-body', document.body);
      const row1 = u.el('div', 'lc-row1', body);
      const mode = ctx.display || 'header';
      const task = u.el('section', 'lc-panel lc-task', row1);
      task.dataset.display = mode;
      u.el('h2', 'lc-h', task, 'Task');
      if (mode === 'header') {
        const taskIn = u.el('div', 'lc-taskin', task);
        u.el('div', 'ds-instruction lc-instr', taskIn, ctx.instruction);
      } else if (mode === 'panel') {
        const note = u.el('fieldset', 'lc-taskcard', task);
        u.el('legend', '', note, 'Instructions');
        u.el('div', 'ds-instruction lc-instr', note, ctx.instruction);
      }
      u.el(
        'p',
        'lc-help',
        task,
        'Choose only the specified colors from the list. You can scroll if needed. Multiple selection is enabled.',
      );
      if (mode === 'toast') {
        // Keep the notification in the briefing column, outside every task/end target.
        const note = u.el('aside', 'ds-toast', task);
        u.el('div', 'lc-toasttitle', note, 'LumiCal notification');
        u.el('div', 'ds-instruction', note, ctx.instruction);
      }
      u.el('div', 'lc-curlab', task, 'Current selection:');
      u.el('div', 'lc-cursel', task);
      const app = u.el('section', 'lc-panel lc-app', row1);
      u.el('h2', 'lc-h', app, 'Appearance Settings');
      const tabs = u.el('div', 'lc-tabs', app);
      ['Colors', 'Fonts', 'Display', 'Advanced'].forEach((t, i) => u.el('span', 'lc-tab' + (i ? '' : ' on'), tabs, t));
      const tb = u.el('div', 'lc-tabbody', app);
      const stage = u.el('main', 'ds-stage', tb);
      const side = u.el('div', 'lc-side', tb);
      const pv = u.el('fieldset', 'lc-fs lc-prev', side);
      u.el('legend', '', pv, 'Preview');
      const win = u.el('div', 'lc-win', pv);
      const wt = u.el('div', 'lc-wtitle', win);
      u.el('span', '', wt, 'Sample Window');
      const wbb = u.el('span', 'lc-wbtns sm', wt);
      ['_', '□', '×'].forEach((t) => u.el('i', '', wbb, t));
      const wm = u.el('div', 'lc-wmenu', win);
      ['File', 'Edit', 'View', 'Help'].forEach((t) => u.el('span', '', wm, t));
      const wbody = u.el('div', 'lc-wbody', win);
      u.el('div', '', wbody, 'The quick brown fox');
      u.el('div', '', wbody, 'jumps over the lazy dog.');
      u.el('span', 'lc-ok', wbody, 'OK');
      const ci = u.el('fieldset', 'lc-fs lc-info', side);
      u.el('legend', '', ci, 'Color information');
      [
        ['Name:', '(none)'],
        ['RGB:', '---'],
        ['Hex:', '---'],
      ].forEach((p) => {
        const r = u.el('div', 'lc-ir', ci);
        u.el('span', '', r, p[0]);
        u.el('span', '', r, p[1]);
      });
      const foot = u.el('footer', 'lc-actions', document.body);
      const actionHeading = u.el('h2', 'lc-h', foot, 'Actions');
      const strip = u.el('div', 'lc-strip', foot);
      const mk = (t, collides = false) => {
        const b = u.el('button', 'lc-btn', strip, t);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', collides ? { label: t, collide: true } : { label: t }));
        return b;
      };
      mk('Load Profile...');
      mk('Save Profile...');
      u.el('span', 'lc-sep', strip);
      mk('Reset');
      mk(collide || 'Preview', !!collide);
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'toolbar' ? nav : placement === 'link' ? actionHeading : strip;
        if (placement === 'footer') u.el('span', 'lc-sep', strip);
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          'ds-submit ' +
            (placement === 'link' ? 'lc-endlink' : 'lc-btn') +
            (placement === 'toolbar' ? ' lc-endtool' : ''),
          parent,
          endLabel,
        );
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
