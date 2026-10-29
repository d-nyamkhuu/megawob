(function () {
  'use strict';
  const C = {
    'title': 'Geometry Workshop',
    'foot': 'Click a point in the drawing area.',
    'accent': '#a8843c',
    'bg': '#3a2418',
    'surface': '#fbf9f3',
    'font': "Georgia, 'Times New Roman', serif",
  };
  env.site({
    name: 'design-click-point-bisect-05',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className = 'design wood' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
      const root = document.documentElement;
      for (const [k, v] of Object.entries({
        bg: C.bg,
        panel: C.surface,
        fg: '#1d1a16',
        muted: '#6a5d4a',
        line: '#cfc6b2',
        accent: C.accent,
      }))
        root.style.setProperty('--' + k, v);
      root.style.setProperty('--font', C.font);
      const winCtl = (parent) => {
        const c = u.el('div', 'wctl', parent);
        for (const g of ['m', 'x', 'c']) {
          const b = u.el('button', 'wbtn', c);
          b.type = 'button';
          const s = u.svg(
            'svg',
            { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'none', stroke: '#2a1a0c', 'stroke-width': 2.2 },
            b,
          );
          u.svg(
            'path',
            {
              d: g === 'm' ? 'M3 8H13' : g === 'x' ? 'M3.5 3.5H12.5V12.5H3.5Z' : 'M3.5 3.5L12.5 12.5M12.5 3.5L3.5 12.5',
            },
            s,
          );
          b.onclick = () => env.log('window-control', { label: g });
        }
      };
      const shell = u.el('div', 'shell', body),
        win = u.el('div', 'win', shell),
        head = u.el('header', 'head', win);
      const logo = u.el('div', 'logo', head);
      const ls = u.svg(
        'svg',
        { width: 40, height: 40, viewBox: '0 0 40 40', fill: 'none', stroke: '#2a1a0c', 'stroke-width': 1.6 },
        logo,
      );
      u.svg(
        'path',
        { d: 'M20 3V9M18 9H22L30 36L22 25L20 13L18 25L10 36Z M11 24Q20 17 29 24 M18 10L14 27M22 10L26 27' },
        ls,
      );
      u.el('div', 'title', head, C.title);
      winCtl(head);
      const menu = u.el('nav', 'menu', head);
      for (const m of ['File', 'Edit', 'View', 'Tools', 'Help']) u.el('span', '', menu, m);
      const endR = ctx.rng.fork('chrome/end'),
        labels = (ctx.content && ctx.content.END_LABELS) || [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
          'Complete',
          "I'm done",
        ],
        labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const keepDefault = endR.bool(0.5),
        placement = keepDefault ? 'footer' : endR.pick(['header', 'link', 'icon']),
        endLabel = keepDefault
          ? 'Submit'
          : labelOf(endR.pick(labels.filter((x) => labelOf(x).trim().toLowerCase() !== 'submit')));
      const collideR = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (collideR.bool(0.3)) {
        const choices = [
          ...new Set(labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase())),
        ];
        if (choices.length)
          collide = { label: collideR.pick(choices), where: collideR.pick(['header', 'header', 'footer']) };
      }
      const decoyBtn = (parent, text, isCollide) => {
        const b = u.el('button', 'wood-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.onclick = () => env.log('decoy', isCollide ? { label: text, collide: true } : { label: text });
        return b;
      };
      const endBtn = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', endLabel);
        b.title = endLabel;
        b.onclick = () => ctx.submit();
        return b;
      };
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'header') {
          submit = endBtn(menu, 'wood-header-end', endLabel);
          if (collide && collide.where === 'header') decoyBtn(menu, collide.label, true);
        } else if (placement === 'icon') {
          submit = endBtn(menu, 'wood-header-end wood-icon-end', '✓');
          submit.setAttribute('aria-label', endLabel);
          if (collide && collide.where === 'header') decoyBtn(menu, collide.label, true);
        } else if (collide && collide.where === 'header') decoyBtn(menu, collide.label, true);
      }
      const content = u.el('div', 'content', win),
        note = u.el('section', 'task-note', content);
      u.el('div', 'note-label', note, '');
      u.el('div', 'instruction', note, ctx.instruction);
      if (ctx.display === 'hidden') note.hidden = true;
      else if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        const x = u.el('button', 'note-close', note, '×');
        x.onclick = () => (note.style.visibility = 'hidden');
      } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
      const stage = u.el('main', 'stage', content);
      stage.dataset.role = 'stage';
      const footer = u.el('footer', 'footer', win);
      u.el('div', 'coords', footer, 'x:  —     y:  —');
      u.el('div', 'footer-copy', footer, C.foot);
      if (!ctx.finish && placement === 'footer') {
        submit = endBtn(footer, 'submit', endLabel);
      } else if (!ctx.finish && placement === 'link') {
        submit = endBtn(footer, 'wood-end-link', endLabel);
      }
      if (!ctx.finish && collide && collide.where === 'footer') decoyBtn(footer, collide.label, true);
      const tw = u.el('aside', 'aside tools', shell);
      const th = u.el('div', 'thead', tw);
      const ws = u.svg(
        'svg',
        { width: 33, height: 33, viewBox: '0 0 32 32', fill: '#d8c598', stroke: '#77603a', 'stroke-width': 0.8 },
        th,
      );
      u.svg('path', { d: 'M3 25L17 11Q15 5 21 2L25 1L21 7L24 11L29 6Q32 14 23 16L9 30Q5 33 2 29Q1 27 3 25Z' }, ws);
      u.svg('circle', { cx: 5.5, cy: 27, r: 1.5, fill: '#4b3b2a', stroke: 'none' }, ws);
      u.el('span', 'tt', th, 'Tools');
      winCtl(th);
      const tb = u.el('div', 'tbody', tw);
      const grp = (name) => {
        const g = u.el('section', 'tgrp', tb);
        u.el('h4', '', g, name);
        return g;
      };
      const g1 = grp('Pointer');
      const sel = u.el('button', 'tbtn big on', g1);
      sel.type = 'button';
      const ss = u.svg(
        'svg',
        {
          width: 34,
          height: 40,
          viewBox: '0 0 32 38',
          fill: '#303034',
          stroke: '#f7f3e8',
          'stroke-width': 1.4,
          'stroke-linejoin': 'round',
        },
        sel,
      );
      u.svg('path', { d: 'M6 2V30L13 23L18 34L23 32L18 21H28Z' }, ss);
      u.el('span', '', sel, 'Select');
      const g2 = grp('View');
      const row = u.el('div', 'trow', g2);
      for (const [n, p] of [
        ['Zoom In', 'M22 22L30 30M24 14A10 10 0 1 1 4 14A10 10 0 1 1 24 14M9 14H19M14 9V19'],
        ['Zoom Out', 'M22 22L30 30M24 14A10 10 0 1 1 4 14A10 10 0 1 1 24 14M9 14H19'],
        ['Reset', 'M12 7A11 11 0 1 1 5 20'],
      ]) {
        const b = u.el('button', 'tbtn', row);
        b.type = 'button';
        const s = u.svg(
          'svg',
          { width: 32, height: 32, viewBox: '0 0 32 32', fill: 'none', stroke: '#303034', 'stroke-width': 2.7 },
          b,
        );
        u.svg('path', { d: p }, s);
        u.el('span', '', b, n);
        if (n === 'Reset') {
          u.svg('path', { d: 'M12 1L5 8L12 14Z', fill: '#303034', stroke: 'none' }, s);
          b.onclick = () => env.widgetDef.clear?.();
        }
      }
      const g3 = grp('Options');
      for (const [n, on] of [
        ['Show labels (A, B, V)', 1],
        ['Show dotted circle', 1],
        ['Show angle measurement', 0],
      ]) {
        const l = u.el('label', 'opt', g3);
        const i = u.el('input', '', l);
        i.type = 'checkbox';
        i.checked = !!on;
        u.el('span', '', l, n);
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
