(function () {
  'use strict';
  const C = {
    title: 'Point Practice',
    foot: 'Click on the canvas to choose a point.',
    accent: '#ff7373',
    bg: '#251834',
    surface: '#251834',
    font: '"Segoe UI",Arial,sans-serif',
  };
  env.site({
    name: 'design-click-point-midpoint-02',
    styles: ['site.css', 'dark.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className =
        'design precision-dark' +
        (ctx.display === 'toast' ? ' has-instruction-toast' : '') +
        (ctx.display === 'hidden' ? ' instruction-hidden' : '');
      const root = document.documentElement;
      for (const [k, v] of Object.entries({
        bg: C.bg,
        panel: C.surface,
        fg: '#f1ecf7',
        muted: '#a89bbb',
        line: '#3a2a52',
        accent: C.accent,
      }))
        root.style.setProperty('--' + k, v);
      root.style.setProperty('--font', C.font);
      const shell = u.el('div', 'shell', body),
        head = u.el('header', 'head', shell);
      const logo = u.svg('svg', { class: 'app-icon', width: 18, height: 18, viewBox: '0 0 18 18' }, head);
      u.svg('rect', { x: 0, y: 0, width: 18, height: 18, rx: 2, fill: '#a88cd9' }, logo);
      u.svg(
        'path',
        {
          d: 'M3 14L6 4H10L13 14M6 14L9 4H12L15 14M6 4V11Q6 14 9 14Q12 14 12 11V4',
          fill: 'none',
          stroke: '#f7f0ff',
          'stroke-width': 1,
        },
        logo,
      );
      u.el('div', 'title', head, C.title);
      const controls = u.el('div', 'window-controls', head);
      const glyph = { 'min': 'M0 5H10', 'max': 'M0.5 0.5H9.5V9.5H0.5Z', 'close': 'M0 0L10 10M10 0L0 10' };
      for (const k of ['min', 'max', 'close']) {
        const bt = u.el('button', '', controls);
        bt.type = 'button';
        bt.setAttribute('aria-label', k);
        const s = u.svg(
          'svg',
          { width: 10, height: 10, viewBox: '0 0 10 10', fill: 'none', stroke: 'currentColor', 'stroke-width': 1 },
          bt,
        );
        u.svg('path', { d: glyph[k] }, s);
        bt.onclick = () => env.log('window-control', { label: k });
      }
      const content = u.el('div', 'content', shell),
        note = u.el('section', 'task-note', content);
      u.el('div', 'instruction', note, ctx.instruction);
      if (ctx.display === 'hidden') note.hidden = true;
      else if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        const x = u.el('button', 'note-close', note, '×');
        x.onclick = () => (note.style.visibility = 'hidden');
      } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
      const endR = ctx.rng.fork('chrome/end'),
        keepDefault = endR.bool(0.5);
      const labelText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const endLabels = ctx.content.END_LABELS.map(labelText),
        endLabel = keepDefault ? 'Submit' : endR.pick(endLabels);
      const placement = keepDefault ? 'footer' : endR.pick(['header', 'footer-link']);
      const collideR = ctx.rng.fork('chrome/collide');
      let collision = null;
      if (collideR.bool(0.3)) {
        const choices = [...new Set(endLabels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase()))];
        if (choices.length) collision = collideR.pick(choices);
      }
      const endButton = (parent, cls, label) => {
        const b = u.el('button', cls, parent, label);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.onclick = () => ctx.submit();
        return b;
      };
      const decoyButton = (parent, label) => {
        const b = u.el('button', 'end-xtra', parent, label);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.onclick = () => env.log('decoy', { label, collide: true });
        return b;
      };
      if (placement === 'header') {
        const titleTools = u.el('div', 'title-tools', head);
        if (collision) decoyButton(titleTools, collision);
        if (!ctx.finish) endButton(titleTools, 'submit header-submit', endLabel);
      }
      const stage = u.el('main', 'stage', content);
      stage.dataset.role = 'stage';
      const footer = u.el('footer', 'footer', shell);
      const ic = u.svg(
        'svg',
        {
          class: 'foot-icon',
          width: 36,
          height: 36,
          viewBox: '0 0 36 36',
          fill: 'none',
          stroke: '#b9aed0',
          'stroke-width': 2,
        },
        footer,
      );
      u.svg('circle', { cx: 18, cy: 18, r: 16 }, ic);
      u.svg('circle', { cx: 18, cy: 18, r: 6 }, ic);
      u.el('div', 'footer-copy', footer, C.foot);
      const clear = u.el('button', 'clear', footer, 'Clear');
      clear.type = 'button';
      clear.onclick = () => {
        env.widgetDef.clear?.();
      };
      if (collision && placement !== 'header') decoyButton(footer, collision);
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'footer') submit = endButton(footer, 'submit', endLabel);
        else if (placement === 'footer-link') submit = endButton(footer, 'end-link', endLabel);
        else submit = shell.querySelector('[data-role="submit"]');
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
