(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-grid-10',
    'task': 'read-figure',
    'scenario': 'grid',
    'style': 'aero',
    'title': '',
    'menu': '',
    'note': '',
    'layout': 'utility',
    'subtitle': '',
    'aside': '',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = 'irix instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      u.el('span', 'irix-mark', top, 'IRIX');
      u.el('span', 'window-title', top, 'Graph Workbench');
      u.el('span', 'window-min', top, '−');
      u.el('span', 'clock', top, 'Mon Apr 21  10:24 AM');
      const menu = u.el('nav', 'menu', app);
      ['File', 'Edit', 'View', 'Tools', 'Help'].forEach((x) => u.el('span', '', menu, x));
      const center = u.el('div', 'center', app),
        stage = u.el('section', 'stage', center),
        aside = u.el('aside', 'aside', center);
      u.el('div', 'brief', aside, ctx.display === 'hidden' ? '' : ctx.instruction);
      u.el('div', 'panel-heading', aside, 'Point Tool');
      u.el('div', 'panel-label', aside, 'Current Position');
      const coords = u.el('div', 'coord-fields', aside);
      ['X', 'Y'].forEach((axis) => {
        const row = u.el('div', 'coord-row', coords);
        u.el('span', '', row, axis + ':');
        u.el('div', 'coord-value', row, '—');
      });
      u.el('div', 'panel-heading', aside, 'Point Style');
      const style = u.el('div', 'style-row', aside);
      u.el('span', 'color-chip', style, '');
      const select = u.el('div', 'style-select', style);
      u.el('span', '', select, 'Solid');
      u.el('span', 'drop-arrow', select, '▼');
      u.el('div', 'panel-heading', aside, 'Point Size');
      const size = u.el('div', 'size-row', aside);
      u.el('span', '', size, '8');
      const spin = u.el('span', 'spinner', size);
      u.el('i', '', spin, '▲');
      u.el('i', '', spin, '▼');
      const footer = u.el('footer', 'bottom', aside),
        strip = u.el('div', 'bottom-strip', app);
      // New episode choices use isolated streams; the existing task stream is untouched.
      const er = ctx.rng.fork('chrome/end'),
        cr = ctx.rng.fork('chrome/collide');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const labels = ctx.content.END_LABELS.map(labelOf);
      const placement = er.pick(['footer', 'footer', 'toolbar', 'status']);
      const referenceLabel = labels.find((x) => x === 'Submit') || labels[0];
      const label = placement === 'footer' ? referenceLabel : er.pick(labels.filter((x) => x !== referenceLabel));
      let tools = null;
      const toolbar = () => tools || (tools = u.el('div', 'chrome-tools', menu));
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'footer' ? footer : placement === 'toolbar' ? toolbar() : strip;
        submit = u.el('button', 'submit end-' + placement, parent, label);
        submit.type = 'button';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', ctx.submit);
      }
      if (cr.bool(0.3)) {
        const options = labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) {
          const text = cr.pick(options),
            decoy = u.el('button', 'chrome-xtra', toolbar(), text);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {
        cookie: 'This application stores preferences on your device.',
        toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?',
        promo: 'Try the new practice collection.',
        banner: 'An updated practice collection is available.',
      };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
