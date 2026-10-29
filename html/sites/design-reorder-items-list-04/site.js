(function () {
  'use strict';
  const C = { 'font': 'Arial, Helvetica, sans-serif' };
  env.site({
    name: 'design-reorder-items-list-04',
    styles: ['site.css', 'wwd.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className = 'design wwd' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
      const endRng = ctx.rng.fork('chrome/end'),
        collideRng = ctx.rng.fork('chrome/collide');
      let endLabel = 'Submit',
        endPlacement = 'footer';
      if (!ctx.finish && !endRng.bool(0.5)) {
        const labels = (ctx.content && ctx.content.END_LABELS) || [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
          '✓',
        ];
        const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        endLabel = labelOf(endRng.pick(labels));
        endPlacement = endRng.pick(['top', 'link']);
      }
      let collide = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const labels = (ctx.content && ctx.content.END_LABELS) || [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
          '✓',
        ];
        const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        const pool = [...new Set(labels.map(labelOf))].filter(
          (x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
        );
        if (pool.length) collide = labelOf(collideRng.pick(pool));
      }
      const root = document.documentElement;
      for (const [k, v] of Object.entries({
        bg: '#ffffff',
        panel: '#ffffff',
        fg: '#000000',
        muted: '#333333',
        line: '#0a3fa8',
        accent: '#0a3fa8',
      }))
        root.style.setProperty('--' + k, v);
      root.style.setProperty('--font', C.font);
      const shell = u.el('div', 'shell', body),
        head = u.el('header', 'head', shell);
      const top = u.el('div', 'top', head);
      const logo = u.el('div', 'logo', top);
      const g = u.svg('svg', { width: 84, height: 84, viewBox: '0 0 84 84', class: 'globe' }, logo);
      const defs = u.svg('defs', {}, g),
        sea = u.svg('radialGradient', { id: 'wwd-sea', cx: '35%', cy: '27%', r: '75%' }, defs);
      for (const [offset, color] of [
        ['0', '#48b9f6'],
        ['.55', '#0879d1'],
        ['.85', '#005095'],
        ['1', '#003875'],
      ])
        u.svg('stop', { offset, 'stop-color': color }, sea);
      const land = u.svg('linearGradient', { id: 'wwd-land', x1: '0', y1: '0', x2: '1', y2: '1' }, defs);
      u.svg('stop', { offset: '0', 'stop-color': '#ffe768' }, land);
      u.svg('stop', { offset: '1', 'stop-color': '#efa42a' }, land);
      u.svg('circle', { cx: 42, cy: 42, r: 39, fill: 'url(#wwd-sea)', stroke: '#063c8c', 'stroke-width': 1.5 }, g);
      u.svg(
        'path',
        {
          d: 'M20 12L27 9 32 10 30 14 35 16 30 20 27 18 25 22 20 23 18 29 21 33 26 32 29 36 26 40 22 39 21 36 17 35 16 30 12 29 13 23 16 20ZM31 5L40 4 44 7 42 11 38 10 36 13 34 10ZM32 40L36 41 39 45 46 45 47 48 54 49 57 53 53 58 51 64 47 65 44 71 40 74 39 68 37 63 37 57 33 54 31 49 28 46ZM51 8L57 10 57 13 63 15 65 19 70 20 71 26 76 27 78 33 76 38 72 36 70 30 67 31 65 27 62 25 58 24 57 20 52 21 48 18 51 16 48 13ZM69 34L74 36 77 41 77 49 74 48 71 42 68 42 66 38Z',
          fill: 'url(#wwd-land)',
        },
        g,
      );
      u.svg(
        'path',
        {
          d: 'M36 19L39 18 40 21 37 22ZM42 14L45 14 46 17 43 18ZM26 38L29 38 31 41 29 43ZM59 28L61 29 61 32 59 31',
          fill: '#ffdc53',
        },
        g,
      );
      const tt = u.el('div', 'brand', logo);
      u.el('div', 'brand-name', tt, 'WorldWeb Directory');
      u.el('div', 'brand-sub', tt, 'Your Guide to the Internet');
      const nav = u.el('nav', 'topnav', top);
      ['Home', 'Site Map', 'Help', 'Contact Us'].forEach((t, i) => {
        if (i) u.el('span', 'sep', nav, '|');
        const a = u.el('a', '', nav, t);
        a.href = '#';
        a.onclick = (e) => e.preventDefault();
      });
      u.el('div', 'date', top, 'Mon, Apr 27, 1998');
      const row = u.el('div', 'panels', head);
      const panel = (cls, title) => {
        const p = u.el('section', 'panel ' + cls, row);
        u.el('h2', '', p, title);
        return u.el('div', 'pbody', p);
      };
      const ps = panel('p-search', 'Search the Directory');
      const inp = u.el('input', 'sbox', ps);
      inp.type = 'text';
      inp.onkeydown = (e) => e.stopPropagation();
      const sb = u.el('button', 'sbtn', ps, 'Search');
      sb.type = 'button';
      const rr = u.el('div', 'radios', ps);
      for (const [i, t] of ['Web Sites', 'Categories'].entries()) {
        const l = u.el('label', '', rr);
        const r = u.el('input', '', l);
        r.type = 'radio';
        r.name = 'scope';
        r.checked = i === 0;
        u.el('span', '', l, t);
      }
      const links = (cls, title, items, cols) => {
        const b = panel(cls, title);
        const lk = u.el('div', 'links cols' + cols, b);
        for (const t of items) {
          const a = u.el('a', '', lk, t);
          a.href = '#';
          a.onclick = (e) => e.preventDefault();
        }
      };
      links(
        'p-browse',
        'Browse by Category',
        [
          'Arts & Humanities',
          'Entertainment',
          'Business & Economy',
          'Health & Science',
          'Computers & Internet',
          'News & Media',
          'Education',
          'Recreation & Sports',
        ],
        2,
      );
      links(
        'p-pop',
        'Popular Links',
        ['Yahoo!', 'GeoCities', 'AltaVista', 'HotBot', 'Excite', 'Infoseek', 'Lycos', 'LookSmart'],
        2,
      );
      links('p-member', 'Member Tools', ['Sign In', 'Create Account', 'Preferences', 'Help'], 1);
      const content = u.el('div', 'content' + (ctx.display === 'panel' ? ' panel-mode' : ''), shell),
        note = u.el('section', 'task-note', content);
      u.el('div', 'instruction', note, ctx.instruction);
      if (ctx.display === 'hidden') note.hidden = true;
      else if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        const x = u.el('button', 'note-close', note, '×');
        x.onclick = () => (note.style.visibility = 'hidden');
      } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
      u.el(
        'p',
        'brief-copy',
        content,
        'Drag and drop the items into the correct order. Use the handle at the left of each item to move it.',
      );
      const stage = u.el('main', 'stage', content);
      stage.dataset.role = 'stage';
      if (ctx.display === 'panel') content.appendChild(note);
      const footer = u.el('footer', 'footer', shell);
      u.el('div', 'footer-copy', footer, 'Ready.');
      let submit = null;
      const btns = u.el('div', 'fbtns', footer);
      const reset = u.el('button', 'clear', btns, 'Reset');
      reset.type = 'button';
      reset.onclick = () => env.widgetDef.clear?.();
      const decoyBtn = (parent, label, collides) => {
        const b = u.el('button', 'xtra', parent, label);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.onclick = () => env.log('decoy', collides ? { label, collide: true } : { label });
        return b;
      };
      if (collide) decoyBtn(btns, collide, true);
      const endBtn = (parent, cls, label) => {
        const b = u.el(cls === 'end-link' ? 'a' : 'button', cls, parent, label);
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
      if (!ctx.finish) {
        if (endPlacement === 'top') submit = endBtn(top, 'top-submit', endLabel);
        else if (endPlacement === 'link') submit = endBtn(footer, 'end-link', endLabel + ' ›');
        else submit = endBtn(btns, 'submit', endLabel);
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
        promo: 'Directory update',
        banner: 'Service notice',
      }[kind];
      const text = {
        cookie: 'This site stores optional cookies.',
        toast: 'Your changes have been saved.',
        chat: 'Need a hand with the directory?',
        promo: 'Explore the latest directory features.',
        banner: 'You are viewing a shared page.',
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
