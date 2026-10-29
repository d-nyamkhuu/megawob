(function () {
  'use strict';
  const C = {
    site: 'design-read-figure-number-checkboxes-02',
    task: 'read-figure',
    scenario: 'number-checkboxes',
    title: 'Rivermere Public Library',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = 'library instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app),
        brand = u.el('div', 'brand', top);
      const icon = u.svg('svg', { width: 126, height: 92, viewBox: '0 0 126 92', class: 'bookmark' }, brand);
      u.svg(
        'path',
        {
          d: 'M8 18 Q34 8 61 20 L61 82 Q35 68 8 78 Z M64 20 Q91 8 118 18 L118 78 Q91 68 64 82 Z',
          fill: '#f5ead5',
          stroke: '#482b20',
          'stroke-width': 4,
        },
        icon,
      );
      u.svg(
        'path',
        {
          d: 'M14 22 Q36 14 55 23 M14 29 Q36 21 55 30 M14 36 Q36 28 55 37 M14 43 Q36 35 55 44 M14 50 Q36 42 55 51 M14 57 Q36 49 55 58 M71 23 Q92 14 112 22 M71 30 Q92 21 112 29 M71 37 Q92 28 112 36 M71 44 Q92 35 112 43 M71 51 Q92 42 112 50 M71 58 Q92 49 112 57',
          fill: 'none',
          stroke: '#70533e',
          'stroke-width': 1.4,
        },
        icon,
      );
      const name = u.el('div', 'library-name', brand);
      u.el('strong', '', name, 'Rivermere Public Library');
      u.el('span', '', name, 'ONLINE CATALOG');
      const nav = u.el('nav', 'menu', top, 'Search　 |　 Browse　 |　 My Account　 |　 Help');
      u.el('i', 'motto', top, 'Books connect us.');
      const center = u.el('div', 'center', app),
        brief = u.el('div', 'brief', center, ctx.display === 'hidden' ? '' : ctx.instruction),
        stage = u.el('section', 'stage', center),
        footer = u.el('footer', 'bottom', app),
        address = u.el('div', 'address', footer);
      u.el('div', '', address, 'Rivermere Public Library');
      u.el('div', '', address, '123 Maple Avenue　 |　 Rivermere, NY 10572');
      u.el('i', '', address, 'Knowledge for a brighter tomorrow.');
      const links = u.el('div', 'footer-links', footer, 'Hours　 |　 Contact　 |　 Privacy　 |　 Site Map');
      // New episode choices have independent streams; task and existing frame draws stay unchanged.
      const er = ctx.rng.fork('chrome/end'),
        cr = ctx.rng.fork('chrome/collide');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const reference = er.bool(0.5),
        placement = reference ? 'footer' : er.pick(['header', 'link']);
      const label = reference ? 'Submit' : er.pick(endLabels);
      let tools = null;
      const headerTools = () => {
        if (!tools) {
          tools = u.el('div', 'catalog-tools', top);
          top.classList.add('has-tools');
        }
        return tools;
      };
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'header' ? headerTools() : footer;
        submit = u.el(placement === 'link' ? 'a' : 'button', 'submit end-' + placement, parent, label);
        if (placement === 'link') {
          submit.href = '#';
          footer.classList.add('end-at-right');
        } else submit.type = 'button';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.dataset.role = 'submit';
        submit.addEventListener('click', (event) => {
          event.preventDefault();
          ctx.submit();
        });
      }
      if (cr.bool(0.3)) {
        const options = [...new Set(endLabels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) {
          const text = cr.pick(options),
            decoy = u.el('button', 'catalog-xtra', headerTools(), text);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body),
        messages = {
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
