(function () {
  'use strict';
  const C = {
    'title': 'Document Viewer',
    'accent': '#e0701c',
    'bg': '#efe8dc',
    'surface': '#e9e2d6',
    'font': "Arial,'Trebuchet MS',sans-serif",
  };
  env.site({
    name: 'design-resize-element-ghost-06',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className = 'design gnome-human' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
      const root = document.documentElement;
      for (const [k, v] of Object.entries({
        bg: C.bg,
        panel: C.surface,
        fg: '#2b231c',
        muted: '#6d6154',
        line: '#b8ab98',
        accent: C.accent,
      }))
        root.style.setProperty('--' + k, v);
      root.style.setProperty('--font', C.font);
      const shell = u.el('div', 'shell', body);
      const head = u.el('header', 'head', shell);
      const tb = u.el('div', 'titlebar', head);
      const docIcon = u.svg(
        'svg',
        {
          class: 'tb-icon',
          width: 20,
          height: 22,
          viewBox: '0 0 20 22',
          fill: '#efede7',
          stroke: '#aaa59b',
          'stroke-width': 1,
        },
        tb,
      );
      u.svg('path', { d: 'M3 1.5H12L17 6.5V20.5H3ZM12 1.5V6.5H17' }, docIcon);
      u.svg('path', { d: 'M6 10H14M6 13H14M6 16H11', stroke: '#827c70' }, docIcon);
      u.el('div', 'title', tb, C.title);
      const controls = u.el('div', 'window-controls', tb);
      for (const [cls, label] of [
        ['min', '−'],
        ['max', '□'],
        ['close', '×'],
      ]) {
        const bt = u.el('button', cls, controls, label);
        bt.type = 'button';
        bt.onclick = () => env.log('window-control', { label });
      }
      const nav = u.el('nav', 'menu', head);
      for (const label of ['File', 'Edit', 'View', 'Go', 'Help']) u.el('span', '', nav, label);
      const over = u.el('section', 'overview', shell);
      const meta = u.el('div', 'ov-meta', over);
      const big = u.svg(
        'svg',
        {
          class: 'ov-icon',
          width: 60,
          height: 76,
          viewBox: '0 0 60 76',
          fill: '#f4f0e8',
          stroke: '#7b7064',
          'stroke-width': 2,
        },
        meta,
      );
      u.svg('path', { d: 'M3 3H38L57 22V73H3ZM38 3V22H57' }, big);
      for (const [y, w] of [
        [30, 34],
        [39, 34],
        [48, 34],
        [57, 21],
      ])
        u.svg('path', { d: `M13 ${y}H${13 + w}`, stroke: '#b5b1a9', 'stroke-width': 4 }, big);
      const mt = u.el('div', 'ov-text', meta);
      u.el('div', 'ov-name', mt, 'Project Plan');
      for (const t of ['Last modified: Apr 24, 2006', 'Size: 420 KB', 'Pages: 3']) u.el('div', 'ov-line', mt, t);
      u.el('div', 'ov-sep', over);
      const thumbs = u.el('div', 'ov-thumbs', over);
      for (let i = 1; i <= 3; i++) {
        const th = u.el('div', 'ov-th' + (i === 1 ? ' sel' : ''), thumbs);
        const pg = u.el('div', 'ov-page', th);
        if (i === 1) {
          u.el('b', '', pg, 'Project Plan');
          for (let k = 0; k < 6; k++) u.el('i', '', pg);
        } else if (i === 2) {
          for (let k = 0; k < 5; k++) u.el('i', '', pg);
          const ch = u.el('div', 'ov-chart', pg);
          for (let k = 0; k < 4; k++) u.el('em', '', ch);
        } else {
          for (let k = 0; k < 4; k++) u.el('i', '', pg);
          const table = u.el('div', 'ov-table', pg);
          for (let k = 0; k < 12; k++) u.el('span', '', table);
        }
        u.el('span', '', th, String(i));
      }
      u.el('div', 'splitter', shell);
      const content = u.el('div', 'content', shell),
        note = u.el('section', 'task-note', content);
      const ic = u.el('span', 'note-icon', note, 'i');
      u.el('div', 'instruction', note, ctx.instruction);
      if (ctx.display === 'hidden') note.hidden = true;
      else if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        const x = u.el('button', 'note-close', note, '×');
        x.type = 'button';
        x.setAttribute('aria-label', 'Close');
        x.onclick = () => (note.style.visibility = 'hidden');
      } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
      const stage = u.el('main', 'stage', content);
      stage.dataset.role = 'stage';
      const footer = u.el('footer', 'footer', shell);
      const reset = u.el('button', 'clear', footer, 'Reset');
      reset.type = 'button';
      const rs = u.svg(
        'svg',
        { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2.2 },
        reset,
      );
      u.svg('path', { d: 'M20 12A8 8 0 1 1 16.5 5.4M20 3V9H14' }, rs);
      reset.prepend(rs);
      reset.onclick = () => {
        env.widgetDef.clear?.();
      };
      u.el('div', 'footer-gap', footer);
      const cancel = u.el('button', 'cancel', footer, 'Cancel');
      cancel.type = 'button';
      cancel.onclick = () => {
        env.widgetDef.clear?.();
      };
      let submit = null;
      if (!ctx.finish) {
        const bank =
          Array.isArray(ctx.content?.END_LABELS) && ctx.content.END_LABELS.length
            ? ctx.content.END_LABELS
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
        const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        const er = ctx.rng.fork('chrome/end');
        const isDefault = er.bool(0.5);
        const placement = isDefault ? 'footer' : er.pick(['footer', 'footer', 'header', 'header', 'link', 'icon']);
        const labels = bank.map(labelOf),
          defaultLabel = labels.find((x) => x.toLowerCase() === 'submit') || labels[0];
        const label = isDefault ? defaultLabel : labelOf(er.pick(bank));
        const cr = ctx.rng.fork('chrome/collide');
        let collision = null;
        if (cr.bool(0.3)) {
          const options = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (options.length) collision = { label: cr.pick(options), where: cr.pick(['header', 'footer']) };
        }
        const makeSubmit = (parent, cls, text, icon) => {
          const b = u.el('button', cls, parent, text);
          b.type = 'button';
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.onclick = () => ctx.submit();
          if (icon) b.textContent = '✓';
          return b;
        };
        const makeDecoy = (parent, text, collide) => {
          const b = u.el('button', collide ? 'chrome-pq' : 'chrome-xtra', parent, text);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.onclick = () => env.log('decoy', collide ? { label: text, collide: true } : { label: text });
          return b;
        };
        const tools = u.el('div', 'chrome-tools', nav);
        if (collision?.where === 'header') makeDecoy(tools, collision.label, true);
        if (placement === 'header') submit = makeSubmit(tools, 'chrome-submit', label);
        else if (placement === 'icon') submit = makeSubmit(tools, 'chrome-submit chrome-icon', '✓', true);
        else if (placement === 'link') submit = makeSubmit(footer, 'submit chrome-link', label);
        else submit = makeSubmit(footer, 'submit', label);
        if (collision?.where === 'footer') makeDecoy(footer, collision.label, true);
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const title = {
        cookie: 'Your privacy',
        toast: 'Changes saved',
        chat: 'Support',
        promo: 'Workspace update',
        banner: 'Service notice',
      }[kind];
      const text = {
        cookie: 'This application stores optional cookies.',
        toast: 'Your changes have been saved.',
        chat: 'Need a hand with this workspace?',
        promo: 'Explore the latest workspace features.',
        banner: 'You are viewing a shared workspace.',
      }[kind];
      const label = kind === 'cookie' ? 'Reject optional' : 'Close';
      u.el('h3', '', box, title);
      u.el('p', '', box, text);
      const dismiss = u.el('button', 'dismiss', box, label);
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      if (kind === 'cookie') {
        const accept = u.el('button', 'dismiss', box, 'Accept optional');
        accept.onclick = () => ctx.dismiss('accept');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  });
})();
