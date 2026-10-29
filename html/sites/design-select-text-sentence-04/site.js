// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-select-text-sentence-04',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'document',
        'theme': 'precision',
        'title': 'NorthBridge  Extranet',
        'menu': 'Home       Catalog       Orders       Invoices       Reports       Admin',
        'foot': '',
        'accent': '#173959',
        'bg': '#d3d7da',
        'surface': '#fff',
        'font': 'Verdana, sans-serif',
      },
      parts: {
        'frame.3': () => () => {},
        'frame.9': (base, S) =>
          function (_c) {
            const { head, u } = _c;
            const mast = u.el('div', 'mast', head),
              ttl = u.el('div', 'title', mast);
            {
              const ic = u.svg(
                'svg',
                { width: 28, height: 32, viewBox: '0 0 28 32', fill: 'none', stroke: '#e9e2ee', 'stroke-width': 2.2 },
                ttl,
              );
              u.svg('path', { d: 'M4 2H17L24 9V30H4Z', fill: '#e9e2ee' }, ic);
              u.svg('path', { d: 'M17 2V9H24 M8 14H20 M8 19H20 M8 24H17', stroke: '#34273c' }, ic);
            }
            u.el('span', 'brand', ttl, 'DocMark');
            u.el('i', 'sep', ttl);
            u.el('span', 'sub', ttl, 'Reading Practice.txt');
            const wc = u.el('div', 'toplinks', mast);
            {
              const mk = (d) => {
                const b = u.el('button', 'wbtn', wc);
                b.type = 'button';
                b.onclick = () => env.log('window-control', {});
                const s = u.svg(
                  'svg',
                  { width: 20, height: 20, viewBox: '0 0 20 20', fill: 'none', stroke: '#e9e2ee', 'stroke-width': 1.6 },
                  b,
                );
                u.svg('path', { d }, s);
              };
              mk('M3 10H17');
              mk('M3.5 3.5H16.5V16.5H3.5Z');
              mk('M3 3L17 17M17 3L3 17');
            }
            Object.assign(_c, { mast, ttl, wc });
          },
        'frame.10': () => () => {},
        'frame.11': () => () => {},
        'frame.13': (base, S) =>
          function (_c) {
            const { ctx, shell, u } = _c;
            const frame = u.el('div', 'frame', shell),
              ph = u.el('div', 'ptitle', frame);
            {
              const ic = u.svg(
                'svg',
                { width: 34, height: 40, viewBox: '0 0 34 40', fill: '#fff', stroke: '#1d3557', 'stroke-width': 2 },
                ph,
              );
              u.svg('path', { d: 'M3 2H22L31 11V38H3Z M22 2V11H31 M9 17H25 M9 22H25 M9 27H25 M9 32H25' }, ic);
              u.el('b', '', ph, 'Document Review');
              u.el('span', '', ph, 'Ref: DR-4827');
            }
            u.el(
              'div',
              'hint',
              frame,
              'Read the text below. Use your mouse to highlight the requested sentence.',
            );
            const content = u.el('div', 'content', frame),
              note = u.el('section', 'task-note', content);
            Object.assign(_c, { content, frame, note, ph });
          },
        'frame.22': () => () => {},
        'frame.24': (base, S) =>
          function (_c) {
            const { frame, u } = _c;
            const footer = u.el('footer', 'footer', frame);
            const clr = u.el('button', 'clear', footer, 'Clear Selection');
            clr.type = 'button';
            clr.onclick = () => {
              env.widgetDef.clear?.();
            };
            Object.assign(_c, { clr, footer });
          },
        'frame.26': (base, S) =>
          function (_c) {
            const { ctx, footer, head, u } = _c;
            {
              const cn = u.el('button', 'cancel', footer, 'Cancel');
              cn.type = 'button';
              cn.onclick = () => env.log('cancel', {});
            }
            _c.submit = null;
            if (!ctx.finish) {
              const er = ctx.rng.fork('chrome/end'),
                cr = ctx.rng.fork('chrome/collide');
              const bank = ctx.content && ctx.content.END_LABELS;
              const labels =
                Array.isArray(bank) && bank.length
                  ? bank
                  : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
              const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
              const label = er.bool(0.52) ? 'Submit' : labelOf(er.pick(labels));
              const placement = er.pick(['corner', 'corner', 'header', 'link']);
              const same = (x) => labelOf(x).trim().toLowerCase() === label.trim().toLowerCase();
              let collide = null;
              if (cr.bool(0.3)) {
                const choices = [...new Set(labels.map(labelOf))].filter((x) => !same(x));
                if (choices.length) collide = labelOf(cr.pick(choices));
              }
              const end = (parent, cls, text) => {
                const b = u.el(cls === 'precision-endlink' ? 'a' : 'button', cls, parent, text);
                if (b.tagName === 'BUTTON') b.type = 'button';
                else b.href = '#';
                b.dataset.role = 'submit';
                b.setAttribute('aria-label', label);
                b.title = label;
                b.onclick = (e) => {
                  e.preventDefault();
                  ctx.submit();
                };
                return b;
              };
              const decoy = (parent) => {
                if (!collide) return;
                const d = u.el('button', 'precision-xtra', parent, collide);
                d.type = 'button';
                d.dataset.role = 'xtra';
                d.onclick = () => env.log('decoy', { label: collide, collide: true });
              };
              if (placement === 'header') {
                _c.submit = end(head, 'submit precision-head-submit', label);
                decoy(head);
              } else if (placement === 'link') {
                _c.submit = end(footer, 'precision-endlink', label + ' ›');
                decoy(footer);
              } else {
                _c.submit = end(footer, 'submit', label);
                decoy(footer);
              }
            }
          },
        'frame.27': () => () => {},
      },
    },
  });
})();
