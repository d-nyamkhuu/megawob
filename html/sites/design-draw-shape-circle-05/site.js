(function () {
  'use strict';
  const C = { 'theme': 'lisa', 'menu': ['File', 'Edit', 'Paper', 'Special', 'Help'], 'clock': '10:24 AM' };
  env.site({
    name: 'design-draw-shape-circle-05',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className = 'design lisa' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
      const root = document.documentElement;
      for (const [k, v] of Object.entries({
        bg: '#f7f4eb',
        panel: '#faf8ef',
        fg: '#000',
        muted: '#444',
        line: '#000',
        accent: '#000',
      }))
        root.style.setProperty('--' + k, v);
      root.style.setProperty('--font', 'Georgia, "Times New Roman", serif');
      const shell = u.el('div', 'lisa-shell', body);
      const bar = u.el('header', 'lisa-menubar', shell);
      const ap = u.svg('svg', { class: 'lisa-apple', width: 22, height: 24, viewBox: '0 0 22 24' }, bar);
      u.svg(
        'path',
        {
          d: 'M11 7C9 5.5 4 5.5 3.5 11C3 16 6.5 21 8.5 21C9.5 21 10 20.3 11 20.3C12 20.3 12.5 21 13.5 21C15.5 21 18.5 16.5 18.5 14C16 13 15.5 9.5 18 8C16.5 6 13 5.7 11 7ZM11 6C11 3.5 12.5 2 14.5 1.5C14.5 4 13 5.5 11 6Z',
          fill: '#000',
        },
        ap,
      );
      for (const m of C.menu) {
        const s = u.el('span', 'lisa-menu', bar, m);
      }
      u.el('span', 'lisa-spacer', bar);
      const ic = u.svg('svg', { class: 'lisa-icon', width: 30, height: 30, viewBox: '0 0 30 30' }, bar);
      u.svg(
        'rect',
        { x: 1.5, y: 1.5, width: 27, height: 27, rx: 3, fill: 'none', stroke: '#000', 'stroke-width': 2 },
        ic,
      );
      u.svg(
        'path',
        {
          d: 'M9 24L11 15L16 12L18 5L22 6L20 12L24 10M10 8L13 11L9 15M13 17L17 14L20 17L19 24M15 6L16 9M7 18L9 21M21 20L23 23',
          fill: 'none',
          stroke: '#000',
          'stroke-width': 1.5,
        },
        ic,
      );
      u.svg('path', { d: 'M12 4L14 5L13 8L11 7ZM17 10L20 9L20 13L17 14Z', fill: '#000' }, ic);
      u.el('span', 'lisa-clock', bar, C.clock);
      const endRng = ctx.rng.fork('chrome/end'),
        endLabels = ctx.content && ctx.content.END_LABELS;
      const labels = (
        Array.isArray(endLabels) && endLabels.length
          ? endLabels
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
      ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
      const endLabel = endRng.pick(['Submit', 'Submit', 'Submit', 'Submit', 'Done', ...labels]);
      const placement = ctx.finish
        ? null
        : endRng.pick(['footer', 'footer', 'footer', 'footer', 'header', 'header', 'link', 'link']);
      const content = u.el('div', 'lisa-content', shell);
      const note = u.el('section', 'task-note', content);
      const instruction = u.el('div', 'instruction', note, ctx.instruction);
      if (ctx.display === 'hidden') note.hidden = true;
      else if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        const x = u.el('button', 'note-close', note, '×');
        x.onclick = () => (note.style.visibility = 'hidden');
      } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
      const stage = u.el('main', 'stage', content);
      stage.dataset.role = 'stage';
      const footer = u.el('footer', 'footer', shell);
      const mk = (cls, name, path, sel) => {
        const w = u.el('div', 'lisa-tool', footer);
        const bt = u.el('button', cls + (sel ? ' selected' : ''), w);
        bt.type = 'button';
        const s = u.svg(
          'svg',
          {
            width: 44,
            height: 40,
            viewBox: '0 0 44 40',
            fill: 'none',
            stroke: '#000',
            'stroke-width': 2.2,
            'stroke-linejoin': 'round',
          },
          bt,
        );
        u.svg('path', { d: path }, s);
        u.el('span', '', w, name);
        return bt;
      };
      const pencil = mk(
        'pencil',
        'Pencil',
        'M10 35L13 25L31 5Q33 3 35 5L39 9Q40 10 38 12L20 31ZM13 25L20 31M29 7L36 14M16 26L33 9M11 34L15 32L13 29Z',
        true,
      );
      u.svg('path', { d: 'M10 35L15 33L12 30Z', fill: '#000', stroke: 'none' }, pencil.querySelector('svg'));
      const clr = mk(
        'clear',
        'Clear',
        'M8 25L24 7L34 7L37 11L37 18L21 34L12 34L8 30ZM8 25H21L37 11M21 25V34M8 25V30L12 34',
        false,
      );
      clr.onclick = () => {
        env.widgetDef.clear?.();
      };
      u.el('span', 'lisa-spacer', footer);
      let submit = null;
      const makeSubmit = (parent, cls, label) => {
        const b = u.el(cls === 'submit-link' ? 'a' : 'button', cls, parent, label);
        b.type = 'button';
        if (b.tagName === 'A') {
          b.href = '#';
          b.onclick = (e) => e.preventDefault();
        }
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', endLabel);
        b.title = endLabel;
        b.onclick = (e) => {
          if (b.tagName === 'A') e.preventDefault();
          ctx.submit();
        };
        return b;
      };
      if (!ctx.finish) {
        if (placement === 'header') submit = makeSubmit(bar, 'submit lisa-header-submit', endLabel);
        else if (placement === 'link') submit = makeSubmit(footer, 'submit-link', endLabel + ' ›');
        else submit = makeSubmit(footer, 'submit', endLabel);
        const collideRng = ctx.rng.fork('chrome/collide');
        if (collideRng.bool(0.3)) {
          const pool = labels.filter((x) => String(x).trim().toLowerCase() !== String(endLabel).trim().toLowerCase());
          if (pool.length) {
            const d = u.el('button', 'lisa-xtra', footer, collideRng.pick(pool));
            d.type = 'button';
            d.dataset.role = 'xtra';
            d.onclick = () => env.log('decoy', { label: d.textContent, collide: true });
            const spacer = footer.querySelector('.lisa-spacer');
            if (spacer) footer.insertBefore(d, spacer);
          }
        }
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
      u.el('h3', '', box, title);
      u.el('p', '', box, text);
      const dismiss = u.el('button', 'dismiss', box, kind === 'cookie' ? 'Reject optional' : 'Close');
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
