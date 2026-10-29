(function () {
  'use strict';
  const C = {
    'theme': 'portal',
    'layout': 'portal',
    'title': 'WorldWeb Directory',
    'accent': '#1a2fc0',
    'bg': '#cdd3ea',
    'surface': '#fff',
    'font': 'Arial, Helvetica, sans-serif',
  };
  const CATS = [
    ['Arts & Humanities', ['Literature', 'History', 'Philosophy', 'The Arts']],
    ['Business & Economy', ['Companies', 'Jobs', 'Investing', 'Small Business']],
    ['Computers & Internet', ['Hardware', 'Software', 'Internet', 'Programming']],
    ['Education', ['Schools', 'Colleges', 'Libraries', 'Reference']],
    ['Health & Science', ['Health', 'Medicine', 'Science', 'Environment']],
    ['News & Media', ['Newspapers', 'Magazines', 'Radio', 'Television']],
    ['Recreation & Sports', ['Travel', 'Outdoors', 'Sports', 'Hobbies']],
    ['Society & People', ['Government', 'Law', 'People Finder', 'Community']],
  ];
  env.site({
    name: 'design-draw-shape-line-12',
    styles: ['site.css', 'portal.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className = 'design portal layout-portal' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
      const root = document.documentElement;
      for (const [k, v] of Object.entries({
        bg: C.bg,
        panel: C.surface,
        fg: '#111',
        muted: '#555',
        line: '#8a93c4',
        accent: C.accent,
      }))
        root.style.setProperty('--' + k, v);
      root.style.setProperty('--font', C.font);
      const noop = (a) => {
        a.href = '#';
        a.onclick = (ev) => ev.preventDefault();
        return a;
      };
      const shell = u.el('div', 'shell', body),
        head = u.el('header', 'head', shell);
      const globe = u.svg('svg', { class: 'globe', viewBox: '0 0 64 64' }, head);
      const gd = u.svg('defs', {}, globe),
        gg = u.svg('radialGradient', { id: 'globe-blue', cx: '30%', cy: '25%', r: '80%' }, gd);
      u.svg('stop', { offset: 0, 'stop-color': '#5edaff' }, gg);
      u.svg('stop', { offset: 1, 'stop-color': '#0074bd' }, gg);
      u.svg(
        'ellipse',
        { cx: 32, cy: 32, rx: 30, ry: 31, fill: 'url(#globe-blue)', stroke: '#001427', 'stroke-width': 2 },
        globe,
      );
      u.svg(
        'path',
        {
          d: 'M14 8L24 5L29 9L26 16L20 17L18 25L12 27L10 22L5 23L7 15ZM34 4L45 7L48 14L43 18L36 14L33 9ZM37 20L46 19L54 25L53 33L47 35L44 43L41 42L38 33L32 28ZM19 35L27 34L34 40L30 47L27 49L26 57L21 53L19 44L15 41ZM48 48L55 46L55 52L50 55Z',
          fill: '#55b919',
          stroke: '#133c05',
          'stroke-width': 1,
        },
        globe,
      );
      u.svg(
        'path',
        {
          d: 'M32 1C13 17 13 47 32 63M32 1C51 17 51 47 32 63M32 1V63M6 16Q32 25 58 16M2 32H62M6 48Q32 39 58 48M14 6Q32 16 50 6M14 58Q32 48 50 58',
          fill: 'none',
          stroke: '#002a40',
          'stroke-width': 1.4,
        },
        globe,
      );
      const brand = u.el('div', 'brand', head);
      u.el('div', 'brand-name', brand, 'WorldWeb Directory');
      u.el('div', 'brand-sub', brand, 'Your Guide to the Internet');
      u.el('div', 'year', head, '1998');
      const sr = u.el('div', 'search', head);
      u.el('label', '', sr, 'Search the Web:');
      const inp = u.el('div', 'search-box', sr);
      u.el('button', 'search-btn', sr, 'Search').type = 'button';
      const links = u.el('div', 'toplinks', head);
      ['Home', 'Site Map', 'Help'].forEach((t, i) => {
        if (i) u.el('span', '', links, '|');
        noop(u.el('a', '', links, t));
      });
      u.el('div', 'rule', shell);
      const strip = u.el('nav', 'strip', shell);
      for (const [h, items] of CATS) {
        const col = u.el('div', 'cat', strip);
        noop(u.el('a', 'cat-h', col, h));
        for (const t of items) noop(u.el('a', 'cat-l', col, t));
      }
      u.el('div', 'rule thick', shell);
      const main = u.el('section', 'pt-main', shell);
      const note = u.el('div', 'task-note', main);
      u.el('div', 'instruction', note, ctx.instruction);
      if (ctx.display === 'hidden') note.hidden = true;
      const row = u.el('div', 'pt-row', main);
      const stage = u.el('main', 'stage', row);
      stage.dataset.role = 'stage';
      const aside = u.el('aside', 'tools', row);
      u.el('div', 'tools-h', aside, 'Drawing Tools');
      const pencil = u.el('button', 'tool on', aside);
      pencil.type = 'button';
      const pi = u.svg('svg', { class: 'ticon', viewBox: '0 0 64 64' }, pencil);
      u.svg(
        'path',
        {
          d: 'M10 54L15 36L43 8Q45 6 47 8L56 17Q58 19 55 22L28 49Z',
          fill: '#090909',
          stroke: '#111',
          'stroke-width': 1.5,
          'stroke-linejoin': 'round',
        },
        pi,
      );
      u.svg(
        'path',
        {
          d: 'M15 36L28 49L10 54ZM40 11L52 23M19 36L40 15M22 39L43 18',
          fill: 'none',
          stroke: '#fff',
          'stroke-width': 2,
        },
        pi,
      );
      u.svg('path', { d: 'M12 50L15 40L23 48Z', fill: '#eee' }, pi);
      u.el('span', '', pencil, 'Freehand Pencil');
      const quick = u.el('button', 'tool quick', aside);
      quick.type = 'button';
      quick.disabled = true;
      const qi = u.svg('svg', { class: 'ticon', viewBox: '0 0 64 64' }, quick);
      u.svg('path', { d: 'M31 10L18 33H28L22 54L46 26H34L43 10Z', fill: '#a4a7aa' }, qi);
      const qt = u.el('span', '', quick, 'Quick action');
      u.el('small', '', qt, '(disabled)');
      const clr = u.el('button', 'tool clear', aside);
      clr.type = 'button';
      const ci = u.svg('svg', { class: 'ticon', viewBox: '0 0 64 64' }, clr);
      u.svg(
        'path',
        {
          d: 'M15 40L38 14Q40 12 43 14L52 23Q54 25 51 28L31 52H24L16 45Z',
          fill: '#fff',
          stroke: '#111',
          'stroke-width': 2,
          'stroke-linejoin': 'round',
        },
        ci,
      );
      u.svg('path', { d: 'M24 29L39 13L53 25L38 42Z', fill: '#080808' }, ci);
      u.svg('path', { d: 'M29 30L42 17M17 40L31 52', stroke: '#aaa', 'stroke-width': 2 }, ci);
      u.el('span', '', clr, 'Clear');
      clr.onclick = () => {
        env.widgetDef.clear?.();
      };
      const footer = u.el('footer', 'footer', shell);
      const ins = u.el('div', 'ins', footer);
      u.el('h3', '', ins, 'Instructions');
      const ol = u.el('ol', '', ins);
      for (const t of [
        'Click and hold on dot A.',
        'Draw continuously to dot B with one straight line.',
        'Release the mouse when you are done.',
      ])
        u.el('li', '', ol, t);
      const endR = ctx.rng.fork('chrome/end');
      let placement = ctx.finish ? null : endR.pick(['footer', 'footer', 'header', 'link']);
      const labels =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const endLabel = placement === 'footer' ? 'Submit' : labelOf(endR.pick(labels));
      let submit = null;
      const makeEnd = (parent, cls, text, tag = 'button') => {
        const b = u.el(tag, cls, parent, text);
        if (tag === 'button') b.type = 'button';
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
      const collideR = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideR.bool(0.3)) {
        const opts = [
          ...new Set(labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase())),
        ];
        if (opts.length) collide = labelOf(collideR.pick(opts));
      }
      const decoy = (parent, text, isCollide = false) => {
        const b = u.el('button', 'portal-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.onclick = () => env.log('decoy', isCollide ? { label: text, collide: true } : { label: text });
      };
      if (ctx.display === 'panel' || ctx.display === 'toast') {
        ins.replaceChildren();
        ins.classList.add(ctx.display === 'panel' ? 'episode-panel' : 'episode-toast');
        const cap = u.el('h3', '', ins, ctx.display === 'panel' ? 'Task instructions' : 'Notice');
        u.el('div', 'instruction', ins, ctx.instruction);
        if (ctx.display === 'toast') {
          const x = u.el('button', 'note-close', ins, '×');
          x.type = 'button';
          x.setAttribute('aria-label', 'Close');
          x.onclick = () => {
            ins.hidden = true;
          };
        }
        main.classList.add('instruction-in-footer');
        note.hidden = true;
      } else if (ctx.display === 'hidden') {
        ins.hidden = true;
      }
      let footerEnd = null;
      if (!ctx.finish && placement === 'footer') {
        footerEnd = makeEnd(footer, 'submit', endLabel);
      }
      if (!ctx.finish && (placement === 'header' || placement === 'link')) {
        const slot = placement === 'link' ? links : u.el('div', 'portal-header-end', head);
        submit = makeEnd(
          slot,
          placement === 'header' ? 'submit portal-header-submit' : 'portal-end-link',
          placement === 'link' ? endLabel + ' ›' : endLabel,
          placement === 'link' ? 'a' : 'button',
        );
      }
      if (footerEnd) submit = footerEnd;
      if (collide) decoy(footer, collide, true);
      const reset = u.el('button', 'reset', footer, 'Reset');
      reset.type = 'button';
      reset.onclick = () => {
        env.widgetDef.clear?.();
      };
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const title =
        {
          cookie: 'Your privacy',
          toast: 'Changes saved',
          chat: 'Support',
          promo: 'Directory update',
          banner: 'Service notice',
        }[kind] || 'Notice';
      const text =
        {
          cookie: 'This site stores optional cookies.',
          toast: 'Your changes have been saved.',
          chat: 'Need a hand with this page?',
          promo: 'Explore the latest directory features.',
          banner: 'You are viewing a shared page.',
        }[kind] || '';
      u.el('h3', '', box, title);
      u.el('p', '', box, text);
      const dismiss = u.el('button', 'dismiss', box, kind === 'cookie' ? 'Reject optional' : 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => {
        ctx.dismiss('close');
      };
      if (kind === 'cookie') {
        const accept = u.el('button', 'dismiss', box, 'Accept optional');
        accept.onclick = () => ctx.dismiss('accept');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  });
})();
