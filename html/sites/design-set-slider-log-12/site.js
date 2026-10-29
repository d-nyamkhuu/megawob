/* Fluent 2021 desktop: Image Adjuster window with a View Presets window beside it; seeded instruction in an unobscured note. */
(function () {
  'use strict';
  const NAV = [
    ['Adjust', 'M3 5h5m4 0h9M3 12h11m4 0h3M3 19h3m4 0h11M8 3v4m6 3v4M6 17v4'],
    ['Crop', 'M7 3v14h14M3 7h14v14M4 20L20 4'],
    ['Filters', 'M12 3a9 9 0 100 18 9 9 0 000-18zM6 5l4 5-2 4 2 6m9-14-4 4 3 4-2 6'],
    ['Markup', 'M4 20l4-1 11-11-3-3L5 16zM13 8l3 3'],
    ['Export', 'M8 4H5v17h15V4h-4M12 15V2m-4 4 4-4 4 4'],
  ];
  const PRESETS = [
    ['Natural', 'a'],
    ['Vivid', 'b'],
    ['Muted', 'c'],
    ['Warm', 'd'],
  ];
  function icon(parent, d, cls) {
    const s = env.util.svg(
      'svg',
      {
        viewBox: '0 0 24 24',
        class: cls || 'ico',
        'aria-hidden': 'true',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': 1.7,
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
      },
      parent,
    );
    env.util.svg('path', { d }, s);
    return s;
  }
  function titlebar(u, parent, title, cls) {
    const tb = u.el('div', 'tb ' + (cls || ''), parent);
    const app = u.el('span', 'app-ico', tb);
    icon(app, 'M3 17l5-6 4 4 3-3 6 6M15 6h.01', 'app-glyph');
    u.el('span', 'tb-title', tb, title);
    const c = u.el('div', 'tb-ctl', tb);
    u.el('span', '', c, '—');
    u.el('span', 'sq', c);
    u.el('span', '', c, '✕');
    return tb;
  }
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('aside', 'dlg overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const title = {
      chat: 'Quick feedback',
      cookie: 'Your privacy matters',
      toast: 'Notice',
      promo: 'Try Image Adjuster Plus',
      banner: 'Service notice',
    }[ctx.kind];
    u.el('h2', '', el, title);
    const x = u.el('button', 'dlg-x', el, '✕');
    x.type = 'button';
    x.setAttribute('aria-label', 'Close notice');
    x.onclick = () => ctx.dismiss('close');
    u.el(
      'p',
      '',
      el,
      {
        chat: 'Help us improve the adjuster.',
        cookie: 'This app can remember your display preferences.',
        toast: 'Your image is ready for editing.',
        promo: 'Discover more adjustments.',
        banner: 'Presets are available offline.',
      }[ctx.kind],
    );
    const dismiss = u.el('button', 'primary dlg-close', el, ctx.kind === 'cookie' ? 'Reject optional' : 'Dismiss');
    dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('dismiss');
    return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  env.site({
    name: 'design-set-slider-log-12',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const endRng = ctx.rng.fork('chrome/end');
      const collideRng = ctx.rng.fork('chrome/collide');
      const W = (ctx.size && ctx.size.width) || window.innerWidth;
      const H = (ctx.size && ctx.size.height) || window.innerHeight;
      let display = ctx.display || 'header';
      if ((display === 'panel' && W < 1260) || (display === 'toast' && H < 700)) display = 'header';
      const placement = ctx.finish ? null : endRng.pick(['footer', 'footer', 'header', 'panel-link']);
      const endLabels = ctx.content && ctx.content.END_LABELS;
      const labelText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const endLabel =
        !ctx.finish && endRng.bool(0.5)
          ? 'Submit'
          : labelText(
              endRng.pick(
                endLabels && endLabels.length
                  ? endLabels
                  : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'],
              ),
            );
      let collide = null;
      const collidePool =
        endLabels && endLabels.length
          ? endLabels.map(labelText)
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      if (!ctx.finish && collideRng.bool(0.3)) {
        const available = [...new Set(collidePool)].filter(
          (x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
        );
        if (available.length) collide = collideRng.pick(available);
      }
      document.body.className = `fluent instruction-${display}`;
      u.el('div', 'desk', document.body);

      const win = u.el('section', 'win main-win', document.body);
      titlebar(u, win, 'Image Adjuster');
      const body = u.el('div', 'wbody', win);
      const side = u.el('nav', 'side', body);
      NAV.forEach(([label, d], i) => {
        const it = u.el('div', 'nav-item' + (i === 0 ? ' on' : ''), side);
        icon(it, d);
        u.el('span', '', it, label);
      });
      u.el('div', 'grow', side);
      const set = u.el('div', 'nav-item', side);
      icon(
        set,
        'M9 3l1-2h4l1 2 3 1 2 3-1 2v4l1 2-2 3-3 1-1 2h-4l-1-2-3-1-2-3 1-2V9L4 7l2-3zM12 8a4 4 0 100 8 4 4 0 000-8z',
      );
      u.el('span', '', set, 'Settings');

      const content = u.el('div', 'content', body);
      const instruction = u.el('div', 'note instruction', content, ctx.instruction);
      if (ctx.instruction.length > 65) instruction.classList.add('long-note');
      if (display === 'hidden' || display === 'panel' || display === 'toast') instruction.hidden = true;
      if (display === 'toast') {
        const toast = u.el('div', 'note instruction toast-note', document.body, ctx.instruction);
        if (ctx.instruction.length > 65) toast.classList.add('long-note');
        const close = u.el('button', 'instruction-close', toast, '×');
        close.type = 'button';
        close.setAttribute('aria-label', 'Close task notification');
        close.onclick = () => {
          toast.hidden = true;
        };
      }
      const row = u.el('div', 'crow', content);
      const prev = u.el('div', 'preview', row);
      u.el('div', 'pv-sky', prev);
      u.el('div', 'pv-mtn', prev);
      u.el('div', 'pv-forest', prev);
      u.el('div', 'pv-lake', prev);
      u.el('div', 'pv-cap', prev, 'Sample Preview (opacity applied)');
      const stage = u.el('main', 'record-stage', row);
      stage.dataset.role = 'stage';

      const foot = u.el('div', 'cfoot', content);
      const reset = u.el('button', 'btn reset', foot, 'Reset All');
      reset.type = 'button';
      reset.dataset.action = 'reset';
      u.el('div', 'grow', foot);
      const sv = u.el('button', 'btn savev', foot, 'Save View');
      sv.type = 'button';
      icon(sv, 'M4 3h14l3 3v15H3V3zM7 3v7h10V3M7 21v-8h10v8M13 5v3', 'save-icon');
      let submit = null;
      const makeSubmit = (parent, cls, text, tag) => {
        const b = u.el(tag || 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', endLabel);
        b.title = endLabel;
        b.onclick = (e) => {
          e.preventDefault();
          ctx.submit();
        };
        return b;
      };
      if (!ctx.finish && placement === 'footer') submit = makeSubmit(foot, 'btn primary', endLabel);
      if (!ctx.finish && placement === 'header') {
        const controls = win.querySelector('.tb-ctl');
        submit = makeSubmit(controls.parentNode, 'chrome-end-header', endLabel);
        controls.parentNode.insertBefore(submit, controls);
      }

      const pw = u.el('section', 'win pres-win', document.body);
      titlebar(u, pw, 'View Presets');
      const pb = u.el('div', 'pbody', pw);
      u.el('h2', '', pb, 'View Presets');
      const p = u.el('p', 'psub', pb, 'Save and manage your display preferences');
      u.el('p', 'psub', pb).innerHTML = '(This <b>only</b> saves presentation settings.)';
      p.classList.add('first');
      if (display === 'panel') {
        const taskPanel = u.el('section', 'task-panel', pb);
        u.el('strong', '', taskPanel, 'Task instructions');
        u.el('div', '', taskPanel, ctx.instruction);
      }
      const list = u.el('div', 'plist', pb);
      const radios = [];
      PRESETS.forEach(([name, k], i) => {
        const r = u.el('div', 'prow', list);
        u.el('span', 'pth th-' + k, r);
        u.el('span', 'pname', r, name);
        const rd = u.el('span', 'radio' + (i === 0 ? ' on' : ''), r);
        radios.push(rd);
        r.onclick = () => radios.forEach((x, j) => x.classList.toggle('on', j === i));
      });
      const actions = u.el('div', 'preset-actions', pb);
      const sv2 = u.el('button', 'btn savev big', actions, 'Save View');
      sv2.type = 'button';
      icon(sv2, 'M4 3h14l3 3v15H3V3zM7 3v7h10V3M7 21v-8h10v8M13 5v3', 'save-icon');
      if (!ctx.finish && placement === 'panel-link') submit = makeSubmit(actions, 'chrome-end-link', endLabel, 'a');
      if (collide) {
        const decoy = u.el('button', 'chrome-xtra', foot, collide);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      if (collide && placement === 'footer' && submit) foot.insertBefore(foot.lastElementChild, submit);

      const tk = u.el('div', 'taskbar', document.body);
      u.el('span', 'wlogo', tk);
      u.el('span', 'tsearch', tk, 'Search');
      u.el('span', 'tapp a1', tk);
      u.el('span', 'tapp a2', tk);
      u.el('span', 'tapp a3', tk);
      const tray = u.el('div', 'tray', tk);
      icon(tray, 'M4 14l8-8 8 8');
      icon(tray, 'M2 8q10-9 20 0M5 12q7-6 14 0M9 16q3-3 6 0M12 20h.01');
      icon(tray, 'M3 9h4l5-5v16l-5-5H3zM16 8q6 4 0 8');
      icon(tray, 'M2 6h18v12H2zM22 10v4M5 9h11v6H5z');
      const clk = u.el('div', 'tclock', tk);
      u.el('div', '', clk, '10:24 AM');
      u.el('div', '', clk, 'Mar 4, 2025');
      return { stage, submit };
    },
    overlay: drawOverlay,
  });
})();
