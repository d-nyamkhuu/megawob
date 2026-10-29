(function () {
  'use strict';
  const C = { 'accent': '#1a2a8a', 'bg': '#ffffff', 'surface': '#ffffff', 'font': 'Arial, Helvetica, sans-serif' };
  env.site({
    name: 'design-click-point-right-angle-07',
    styles: ['site.css', 'gl.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className = 'design gl' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
      const bank = (key, fallback) =>
        ctx.content && Array.isArray(ctx.content[key]) && ctx.content[key].length ? ctx.content[key] : fallback;
      const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
      const er = ctx.rng.fork('chrome/end'),
        endWords = bank('END_LABELS', ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']);
      const submitWord = endWords.find((x) => labelOf(x).trim().toLowerCase() === 'submit'),
        label = er.bool(0.5) && submitWord ? labelOf(submitWord) : labelOf(er.pick(endWords));
      const placement = ctx.finish ? null : er.pick(['aside', 'aside', 'aside', 'header', 'link']);
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (cr.bool(0.3)) {
        const options = [...new Set(endWords.map(labelOf))].filter(
          (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
        );
        if (options.length) collide = labelOf(cr.pick(options));
      }
      const root = document.documentElement;
      for (const [k, v] of Object.entries({
        bg: C.bg,
        panel: C.surface,
        fg: '#000',
        muted: '#333',
        line: '#9db4d8',
        accent: C.accent,
      }))
        root.style.setProperty('--' + k, v);
      root.style.setProperty('--font', C.font);
      const link = (p, t) => {
        const a = u.el('a', 'gl-link', p, t);
        a.href = '#';
        a.onclick = (e) => {
          e.preventDefault();
        };
        return a;
      };
      const shell = u.el('div', 'shell gl-shell', body);
      const head = u.el('header', 'gl-head', shell);
      const logo = u.svg(
        'svg',
        {
          class: 'gl-globe',
          width: 54,
          height: 54,
          viewBox: '0 0 54 54',
          fill: 'none',
          stroke: '#9ce5ff',
          'stroke-width': 1.8,
        },
        head,
      );
      u.svg('circle', { cx: 27, cy: 27, r: 25, fill: '#168dcc' }, logo);
      u.svg('ellipse', { cx: 27, cy: 27, rx: 11, ry: 25 }, logo);
      u.svg('path', { d: 'M2 27H52M6 14Q27 21 48 14M6 40Q27 33 48 40M27 2V52' }, logo);
      const brand = u.el('div', 'gl-brand', head);
      u.el('span', 'gl-geo', brand, 'Geo');
      u.el('span', 'gl-learn', brand, 'Learn');
      u.el('div', 'gl-tag', head, 'Math Resources for Everyone');
      const nav = u.el('nav', 'gl-nav', head);
      ['Home', 'Subjects', 'Resources', 'Help'].forEach((t, i) => {
        if (i) u.el('span', 'gl-bar', nav, '|');
        link(nav, t);
      });
      u.el('div', 'gl-date', head, 'Wed, Apr 22, 1998');
      const portal = u.el('section', 'gl-portal', shell);
      const cols = [
        ['Browse by Subject', ['Algebra', 'Geometry', 'Trigonometry', 'Calculus', 'Statistics']],
        ['Math Tools', ['Graphing Calculator', 'Unit Converter', 'Formula Library', 'Practice Problems', 'Math Games']],
        [
          'Student Center',
          ['Study Guides', 'Homework Help', 'Test Preparation', 'College Resources', 'Educator Corner'],
        ],
      ];
      for (const [t, items] of cols) {
        const c = u.el('div', 'gl-col', portal);
        u.el('div', 'gl-strip', c, t);
        for (const i of items) link(c, i);
      }
      const sc = u.el('div', 'gl-col gl-search', portal);
      u.el('div', 'gl-strip', sc, 'Search Our Site');
      const row = u.el('div', 'gl-srow', sc);
      const inp = u.el('div', 'gl-input', row);
      const sb = u.el('button', 'gl-btn gl-sbtn', row, 'Search');
      sb.type = 'button';
      const rad = u.el('div', 'gl-radios', sc);
      let rs = [];
      for (const [i, t] of ['All Pages', 'Math Resources'].entries()) {
        const l = u.el('label', '', rad);
        const r = u.el('input', '', l);
        r.type = 'radio';
        r.name = 'gl-scope';
        r.checked = i === 0;
        rs.push(r);
        u.el('span', '', l, t);
      }
      const adv = u.el('div', 'gl-adv', sc);
      link(adv, 'Advanced Search');
      u.el('span', 'gl-bar', adv, '|');
      link(adv, 'Site Map');
      const ad = u.el('div', 'gl-ad', portal);
      for (const t of ['A', 'Brighter', 'Future', 'Through', 'Mathematics']) u.el('div', '', ad, t);
      const main = u.el('div', 'gl-main', shell);
      const left = u.el('section', 'gl-left', main);
      const lh = u.el('div', 'gl-lh', left);
      u.el('span', 'gl-lt', lh, 'Geometry Practice');
      const lk = u.el('span', 'gl-lk', lh);
      ['Problems', 'Hints', 'Glossary'].forEach((t, i) => {
        if (i) u.el('span', 'gl-bar', lk, '|');
        link(lk, t);
      });
      const content = u.el('div', 'content gl-content', left),
        note = u.el('section', 'task-note', content);
      const instruction = u.el('div', 'instruction', note, ctx.instruction);
      if (ctx.display === 'hidden' || ctx.display === 'panel' || ctx.display === 'toast') note.hidden = true;
      const stage = u.el('main', 'stage', content);
      stage.dataset.role = 'stage';
      const aside = u.el('aside', 'aside gl-aside', main);
      u.el('div', 'gl-ah', aside, 'Your Task');
      const ol = u.el('ol', 'gl-steps', aside);
      u.el('li', '', ol, 'Click a point in the diagram.');
      u.el(
        'li',
        '',
        ol,
        'The line from the filled dot (B) to your point must be perpendicular to segment AB, and the point must be outside the dotted circle.',
      );
      if (ctx.display === 'panel' || ctx.display === 'toast') {
        const msg = u.el('section', ctx.display === 'panel' ? 'gl-instr-panel' : 'gl-instr-toast', aside);
        if (ctx.display === 'panel') u.el('div', 'gl-msg-head', msg, 'Task Instructions');
        u.el('div', 'gl-msg-text', msg, ctx.instruction);
      }
      u.el('hr', 'gl-rule', aside);
      u.el('div', 'gl-strip gl-strip2', aside, 'Tools');
      const tp = u.el('button', 'gl-btn gl-tool sel', aside);
      tp.type = 'button';
      const ic = u.svg(
        'svg',
        { width: 26, height: 26, viewBox: '0 0 32 32', fill: '#fff', stroke: '#000', 'stroke-width': 1.8 },
        tp,
      );
      u.svg('path', { d: 'M8 3V27L14 21L18 30L22 28L18 20H26Z' }, ic);
      u.el('span', '', tp, 'Point Tool (Click)');
      const cl = u.el('button', 'gl-btn gl-tool', aside);
      cl.type = 'button';
      const ic2 = u.svg(
        'svg',
        {
          width: 26,
          height: 26,
          viewBox: '0 0 32 32',
          fill: '#d8e4e9',
          stroke: '#000',
          'stroke-width': 1.8,
          'stroke-linejoin': 'round',
        },
        cl,
      );
      u.svg('path', { d: 'M5 20L19 5L28 13L14 28H8ZM12 12L21 21' }, ic2);
      u.el('span', '', cl, 'Clear Point');
      cl.onclick = () => {
        env.widgetDef.clear?.();
      };
      const submitRule = u.el('hr', 'gl-rule gl-rule2', aside),
        submitStrip = u.el('div', 'gl-strip gl-strip2', aside, 'Submit');
      const end = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.onclick = () => ctx.submit();
        return b;
      };
      const decoy = (parent, text) => {
        const b = u.el('button', 'gl-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.onclick = () => env.log('decoy', { label: text, collide: true });
        return b;
      };
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'aside') {
          submit = end(aside, 'submit gl-btn gl-submit', label);
        } else if (placement === 'header') {
          submit = end(lk, 'gl-end-header', label);
        } else {
          submit = u.el('a', 'gl-end-link', lk, label + ' ›');
          submit.href = '#';
          submit.dataset.role = 'submit';
          submit.title = label;
          submit.setAttribute('aria-label', label);
          submit.onclick = (e) => {
            e.preventDefault();
            ctx.submit();
          };
        }
      }
      if (placement !== 'aside' || ctx.finish) submitStrip.hidden = true;
      if (ctx.finish) submitRule.hidden = true;
      if (collide) {
        const slot = placement === 'aside' ? lk : lh;
        decoy(slot, collide);
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
        cookie: 'This site stores optional cookies.',
        toast: 'Your changes have been saved.',
        chat: 'Need a hand with this page?',
        promo: 'Explore the latest GeoLearn features.',
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
