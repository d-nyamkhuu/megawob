(function () {
  'use strict';
  const C = {
    'title': 'Document Editor',
    'doc': 'Q2_Project_Plan.docx',
    'accent': '#1f6feb',
    'bg': '#ffffff',
    'surface': '#f2f2f2',
    'font': "'Helvetica Neue', Helvetica, Arial, sans-serif",
  };
  const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
  const END_FALLBACK = [
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
  ];
  env.site({
    name: 'design-resize-element-ghost-12',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className = 'design yos';
      const root = document.documentElement;
      for (const [k, v] of Object.entries({
        bg: C.bg,
        panel: C.surface,
        fg: '#2b2f36',
        muted: '#6b7280',
        line: '#c9cdd2',
        accent: C.accent,
      }))
        root.style.setProperty('--' + k, v);
      root.style.setProperty('--font', C.font);
      const shell = u.el('div', 'shell', body);
      const er = ctx.rng.fork('chrome/end'),
        placements = ['left', 'left', 'left', 'left', 'header', 'status'];
      const placement = ctx.finish ? null : er.pick(placements);
      const labels =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : END_FALLBACK;
      const label = labelOf(er.bool(0.5) ? labels.find((x) => labelOf(x) === 'Submit') || 'Submit' : er.pick(labels));
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const choices = [...new Set(labels.map(labelOf))].filter(
          (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
        );
        if (choices.length) collide = cr.pick(choices);
      }
      // title bar
      const head = u.el('header', 'yos-bar', shell);
      const lights = u.el('div', 'yos-lights', head);
      for (const c of ['r', 'y', 'g']) u.el('i', c, lights);
      u.el('div', 'yos-apptitle', head, C.title);
      const dn = u.el('div', 'yos-docname', head, C.doc);
      u.el('span', '', dn, ' — ');
      u.el('span', 'edited', dn, 'Edited');
      const search = u.el('div', 'yos-search', head);
      u.svg(
        'path',
        { d: 'M10 10L15 15M7 12A5 5 0 1 1 7 2A5 5 0 0 1 7 12Z' },
        u.svg(
          'svg',
          { width: 16, height: 16, viewBox: '0 0 17 17', fill: 'none', stroke: '#555', 'stroke-width': 1.5 },
          search,
        ),
      );
      u.el('span', '', search, 'Search');
      const endBtn = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', text);
        b.title = text;
        b.onclick = () => ctx.submit();
        return b;
      };
      const decoyBtn = (parent, text) => {
        const b = u.el('button', 'yos-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.onclick = () => env.log('decoy', { label: text, collide: true });
        return b;
      };
      let submit = null;
      if (!ctx.finish && placement === 'header') submit = endBtn(head, 'yos-end-header', label);
      // left column
      const left = u.el('section', 'yos-left', shell);
      let display = ctx.display || 'header';
      if (display === 'panel' && window.innerWidth < 1260) display = 'header';
      if (display === 'toast' && window.innerHeight < 700) display = 'header';
      const note = u.el('div', 'yos-note yos-note-' + display, left);
      u.el('div', 'instruction', note, ctx.instruction);
      if (display === 'hidden') note.hidden = true;
      if (collide) decoyBtn(left, collide);
      const pv = u.el('button', 'yos-preview', left, 'Preview');
      pv.type = 'button';
      pv.onclick = () => env.log('preview');
      const previewCaption = u.el('p', 'yos-cap pv', left, 'See a full preview of this document');
      u.el('br', '', previewCaption);
      previewCaption.appendChild(document.createTextNode('(with sample annotations).'));
      u.el('hr', 'yos-sep', left);
      const submitCaption = u.el('p', 'yos-cap sb', left, 'When the Inspector panel matches');
      u.el('br', '', submitCaption);
      submitCaption.appendChild(document.createTextNode('the dashed outline, click ' + (label || 'Submit') + '.'));
      submitCaption.hidden = ctx.finish;
      if (!ctx.finish && placement === 'left') submit = endBtn(left, 'submit yos-submit', label);
      // document area
      const main = u.el('section', 'yos-main', shell);
      const paper = u.el('div', 'yos-paper', main);
      const at = (tag, cls, text, x, y, w) => {
        const e = u.el(tag, cls, paper, text);
        e.style.setProperty('--x', x);
        e.style.setProperty('--y', y);
        if (w) e.style.setProperty('--w', w);
        return e;
      };
      at('h1', 'p-h1', 'Project Plan', 66, 86);
      at('div', 'p-sub', 'Q2 2025', 66, 144);
      at('div', 'p-rule', '', 66, 197, '470');
      at('h2', 'p-h2', '1. Overview', 66, 236);
      at(
        'p',
        'p-para',
        'Our goal for Q2 is to deliver a simpler, faster experience for our customers. This plan outlines the key initiatives, milestones, and owners.',
        66,
        279,
        '470',
      );
      at('h2', 'p-h2', '2. Key Initiatives', 66, 412);
      [
        'Improve onboarding flow',
        'Enhance performance and reliability',
        'Expand to additional customer segments',
      ].forEach((t, i) => {
        at('div', 'p-li', i + 1 + '.', 72, 452 + i * 31);
        at('div', 'p-li t', t, 98, 452 + i * 31);
      });
      at('h2', 'p-h2', '3. Milestones', 66, 593);
      const tbl = at('table', 'p-table', '', 66, 639, '646');
      const rows = [
        ['Milestone', 'Owner', 'Target Date'],
        ['Design complete', 'A. Chen', 'Apr 4, 2025'],
        ['Development complete', 'M. Patel', 'May 16, 2025'],
        ['Launch', 'T. Nguyen', 'Jun 30, 2025'],
      ];
      rows.forEach((r, i) => {
        const tr = u.el('tr', '', tbl);
        r.forEach((v) => u.el(i ? 'td' : 'th', '', tr, v));
      });
      const stage = u.el('main', 'stage', paper);
      stage.dataset.role = 'stage';
      // tool rail
      const rail = u.el('aside', 'yos-rail', shell);
      const icons = [
        'M5 3L5 21L10 16L14 24L17 22.5L13 15H20Z',
        'M4 5H24V19H12L7 24V19H4Z M9 10H19M9 14H16',
        'M5 5H23V23H5Z',
        'M14 4A10 10 0 1 1 14 24A10 10 0 0 1 14 4Z',
        'M5 23L23 5',
        'M5 5H23M14 5V24',
        'M12 4A8 8 0 1 1 12 20A8 8 0 0 1 12 4ZM18 18L25 25',
      ];
      icons.forEach((d, i) => {
        const b = u.el('button', 'yos-tool' + (i === 0 ? ' sel' : ''), rail);
        b.type = 'button';
        b.onclick = () => {
          rail.querySelectorAll('.yos-tool').forEach((x) => x.classList.remove('sel'));
          b.classList.add('sel');
        };
        u.svg(
          'path',
          { d },
          u.svg(
            'svg',
            {
              width: 30,
              height: 30,
              viewBox: '0 0 28 28',
              fill: 'none',
              stroke: 'currentColor',
              'stroke-width': 1.7,
              'stroke-linejoin': 'round',
            },
            b,
          ),
        );
      });
      // status bar
      const st = u.el('footer', 'yos-status', shell);
      u.el('span', '', st, 'Page 1 of 1');
      u.el('span', 'wc', st, '148 words');
      const zoom = u.el('span', 'yos-zoom', st, '100%');
      u.el('em', '', zoom, '⌄');
      u.el('span', 'yos-minus', st, '−');
      const sl = u.el('span', 'yos-slider', st);
      u.el('i', '', sl);
      u.el('span', 'yos-plus', st, '+');
      if (!ctx.finish && placement === 'status') submit = endBtn(st, 'yos-end-status', label);
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
