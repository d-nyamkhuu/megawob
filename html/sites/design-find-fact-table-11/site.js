(function () {
  'use strict';
  const C = {
    'site': 'design-find-fact-table-11',
    'brand': 'World Science Archive',
    'instruction': 'left',
    'nav': 'People|Research|Timeline|About',
    'links': 'Home|People|Climate|Contact',
    'briefTitle': 'Your Task',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    initialOverlay: { kind: 'promo' },
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = er.bool(0.5);
      const placement = referenceEnd ? 'form' : er.pick(['toolbar', 'link']);
      const label = referenceEnd ? 'Submit' : er.pick(endLabels);
      const cr = ctx.rng.fork('chrome/collide');
      const collideLabels = endLabels.filter((t) => t.trim().toLowerCase() !== label.trim().toLowerCase());
      const collide = cr.bool(0.3) && collideLabels.length ? cr.pick(collideLabels) : null;
      const top = u.el('header', 'ds-top', document.body);
      const left = u.el('div', 'ds-top-l', top);
      u.el('div', 'ds-brand', left, C.brand);
      const nav = u.el('nav', 'ds-nav', left);
      C.nav.split('|').forEach((t, i) => {
        if (i) u.el('i', '', nav, '|');
        u.el('span', '', nav, t);
      });
      const right = u.el('div', 'ds-top-r', top);
      u.el('div', 'ds-date', right, 'March 12, 2008');
      const sr = u.el('div', 'ds-search', right);
      u.el('div', 'ds-search-in', sr, 'Search this site...');
      u.el('div', 'ds-search-btn', sr, 'Search');
      const links = u.el('nav', 'ds-links', right);
      C.links.split('|').forEach((t, i) => {
        if (i) u.el('i', '', links, '|');
        u.el('span', '', links, t);
      });
      const body = u.el('div', 'ds-body', document.body);
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'panel'
              : 'left';
      body.classList.add('ds-mode-' + mode);
      const brief = u.el('aside', 'ds-brief', body);
      u.el('h2', '', brief, C.briefTitle);
      if (mode === 'left') u.el('div', 'ds-instruction', brief, ctx.instruction);
      if (mode === 'panel') {
        const note = u.el('section', 'ds-panel-note', brief);
        u.el('h4', '', note, 'Research request');
        u.el('div', 'ds-instruction', note, ctx.instruction);
      }
      u.el('hr', '', brief);
      u.el(
        'p',
        'ds-help',
        brief,
        'Use the table on the right to find the requested information.' +
          (ctx.spec.answerBy === 'reply'
            ? ''
            : ' Type your answer in the text field' + (ctx.finish ? '.' : ' and click ' + label + '.')),
      );
      u.el('h4', '', brief, 'Notes:');
      const ul = u.el('ul', '', brief);
      [
        ctx.spec.answerBy === 'reply'
          ? 'Give the value exactly as shown in the table.'
          : 'Enter the value exactly as shown in the table.',
        'Use only the information provided on this page.',
        'You can close the survey on the right to get more space if needed.',
      ].forEach((t) => u.el('li', '', ul, t));
      const content = u.el('div', 'ds-content', body);
      if (mode === 'toast') {
        const note = u.el('aside', 'ds-toast', content);
        u.el('div', 'ds-instruction', note, ctx.instruction);
      }
      const stage = u.el('main', 'ds-stage', content);
      const foot = u.el('footer', 'ds-footer', content);
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'toolbar' ? sr : placement === 'link' ? brief : foot;
        submit = u.el('button', 'ds-submit ds-end-' + placement, parent, label);
        if (placement === 'link') brief.insertBefore(submit, brief.children[1]);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', () => ctx.submit());
      }
      if (collide) {
        const decoy = u.el('button', 'ds-xtra', links, collide);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const x = u.el('button', 'ds-x', el, '×');
      x.type = 'button';
      u.el('h3', '', el, 'Quick Survey');
      u.el('p', 'ds-sub', el, 'Help us improve this site.');
      const qs = [
        ['1. How useful is this page?', ['Very useful', 'Somewhat useful', 'Not very useful', 'Not useful']],
        ['2. What best describes you?', ['Student', 'Educator', 'Researcher', 'General visitor']],
      ];
      qs.forEach((q) => {
        u.el('h4', '', el, q[0]);
        q[1].forEach((o) => {
          const r = u.el('div', 'ds-opt', el);
          u.el('i', '', r);
          u.el('span', '', r, o);
        });
      });
      u.el('h4', 'ds-q3', el, '3. Additional comments (optional):');
      u.el('div', 'ds-ta', el);
      const dismiss = u.el('button', 'ds-close', el, 'Close survey');
      dismiss.type = 'button';
      x.addEventListener('click', () => ctx.dismiss('close'));
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: 0 };
    },
  });
})();
