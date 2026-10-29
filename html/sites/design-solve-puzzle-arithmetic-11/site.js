(function () {
  'use strict';
  const C = {
    'site': 'design-solve-puzzle-arithmetic-11',
    'task': 'solve-puzzle',
    'scenario': 'arithmetic',
    'style': 'academic',
    'title': 'Math Practice',
    'menu': '',
    'note': 'Math Practice',
    'layout': 'document',
    'subtitle': '',
    'aside': '',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    initialOverlay: { kind: 'banner' },
    frame(ctx) {
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app),
        groups = [
          ['File', ['New', 'Open', 'Save']],
          ['Edit', ['Cut', 'Copy', 'Paste']],
          ['Insert', ['Image', 'Link']],
          ['Format', ['Bold', 'Italic', 'Underline']],
          ['Tools', ['Calculator', 'Spelling']],
          ['Help', ['Contents']],
        ],
        icons = ['▧', '📂', '▣', '✂', '▤', '▣', '▧', '🔗', 'B', 'I', 'U', '▦', 'ABC', '?'];
      let ix = 0;
      groups.forEach((g, gi) => {
        const section = u.el('div', 'ribbon-group group-' + gi, top);
        u.el('b', 'ribbon-heading', section, g[0]);
        const row = u.el('div', 'ribbon-items', section);
        g[1].forEach((label) => {
          const item = u.el('div', 'ribbon-item', row);
          u.el('span', 'ribbon-icon icon-' + label.toLowerCase(), item, icons[ix++]);
          const link = u.el('a', '', item, label);
          link.href = '#';
          link.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { label });
          });
        });
      });
      const center = u.el('div', 'center', app);
      u.el('h1', 'document-title', center, 'Math Practice');
      u.el('p', 'document-desc', center, 'Solve the problem below. Show your work if needed.');
      const brief = u.el('div', 'brief', center, ctx.display === 'hidden' ? '' : ctx.instruction);
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', document.body),
        footer = u.el('footer', 'bottom', app);
      u.el('span', 'status-ready', footer, 'Ready');
      u.el('b', 'status-task', footer, 'Math Practice');
      u.el('span', 'status-zoom', footer, '1:1');
      const endRng = ctx.rng.fork('chrome/end'),
        labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name),
        endLabels = ctx.content.END_LABELS.map(labelOf),
        referenceEnd = endRng.bool(0.5),
        placement = referenceEnd ? 'form' : endRng.pick(['header', 'footer']),
        label = referenceEnd ? 'Submit' : endRng.pick(endLabels);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el('button', 'submit end-' + placement, placement === 'header' ? center : footer, label);
        submit.type = 'button';
        submit.dataset.placement = placement;
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', ctx.submit);
      }
      const collideRng = ctx.rng.fork('chrome/collide');
      if (collideRng.bool(0.3)) {
        const choices = endLabels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (choices.length) {
          const decoyLabel = collideRng.pick(choices),
            decoy = u.el('button', 'end-xtra', footer, decoyLabel);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: decoyLabel, collide: true }));
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay update-reminder ' + ctx.kind, document.body),
        bar = u.el('div', 'update-titlebar', el);
      u.el('span', '', bar, 'Software Update');
      const close = u.el('button', 'update-close', bar, '×');
      close.addEventListener('click', ctx.dismiss);
      const body = u.el('div', 'update-body', el);
      u.el('span', 'globe', body, '🌎');
      const copy = u.el('div', 'update-copy', body);
      u.el('strong', '', copy, 'A newer version of this application is available.');
      u.el('p', '', copy, 'We recommend updating for improved security and performance.');
      const actions = u.el('div', 'update-actions', el);
      const update = u.el('button', '', actions, 'Update now');
      update.addEventListener('click', () => env.log('decoy', { label: 'Update now' }));
      const later = u.el('button', 'remind-later', actions, 'Remind me later');
      later.addEventListener('click', ctx.dismiss);
      const details = u.el('button', '', actions, 'View details');
      details.addEventListener('click', () => env.log('decoy', { label: 'View details' }));
      return { el, dismiss: later };
    },
  });
})();
