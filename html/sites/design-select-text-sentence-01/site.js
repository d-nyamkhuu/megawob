// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-select-text-sentence-01',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'document',
        'theme': 'industrial',
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
            const { C } = S;
            const { head, u } = _c;
            const mast = u.el('div', 'mast', head),
              ttl = u.el('div', 'title', mast);
            u.el('span', 'brand', ttl, 'NorthBridge');
            u.el('span', 'sub', ttl, 'Extranet');
            const tl = u.el('div', 'toplinks', mast);
            ['Suppliers', 'Orders', 'Support', 'Account', 'Log Out'].forEach((t, i) => {
              if (i) u.el('i', '', tl, '|');
              u.el('span', '', tl, t);
            });
            const nav = u.el('nav', 'menu', head);
            C.menu.split(/\s{2,}/).forEach((t, i) => {
              const a = u.el('a', i === 0 ? 'on' : '', nav, t);
              a.href = '#';
              a.onclick = (e) => e.preventDefault();
            });
            u.el('span', 'date', nav, 'Tue, Apr 13, 1999');
            Object.assign(_c, { mast, nav, tl, ttl });
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
            const hint = u.el(
              'div',
              'hint',
              frame,
              'Read the text below. Use your mouse to highlight the requested sentence.',
            );
            const content = u.el('div', 'content', frame),
              note = u.el('section', 'task-note', content);
            Object.assign(_c, { content, frame, hint, note, ph });
          },
        'frame.18': (base, S) =>
          function (_c) {
            const { ctx, instruction, note, u } = _c;
            const display = ctx.display || 'header';
            if (display === 'hidden') note.hidden = true;
            else if (display === 'panel') {
              note.classList.add('instruction-panel');
              const caption = u.el('strong', 'panel-caption', note, 'Task instructions');
              note.insertBefore(caption, instruction);
            } else if (display === 'toast') {
              note.classList.add('instruction-toast');
              const caption = u.el('span', 'toast-caption', note, 'Notice');
              note.insertBefore(caption, instruction);
              const x = u.el('button', 'note-close', note, '×');
              x.type = 'button';
              x.setAttribute('aria-label', 'Close');
              x.onclick = () => {
                note.hidden = true;
                env.log('note-close');
              };
            }
            Object.assign(_c, { display });
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
            const { ctx, footer, hint, ph, u } = _c;
            {
              const cn = u.el('button', 'cancel', footer, 'Cancel');
              cn.type = 'button';
              cn.onclick = () => env.log('cancel', {});
            }
            _c.submit = null;
            ((_c.placement = null), (_c.label = null), (_c.collide = null));
            if (!ctx.finish) {
              const er = ctx.rng.fork('chrome/end');
              _c.placement = er.pick(['footer', 'footer', 'header', 'link']);
              const bank =
                ctx.content && ctx.content.END_LABELS && ctx.content.END_LABELS.length
                  ? ctx.content.END_LABELS
                  : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
              const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
              _c.label = er.bool(0.5)
                ? 'Submit'
                : labelOf(er.pick(bank.filter((x) => labelOf(x).toLowerCase() !== 'submit')));
              hint.textContent =
                'Read the text below. Use your mouse to highlight the requested sentence. Then click ' + _c.label + '.';
              const cr = ctx.rng.fork('chrome/collide');
              if (cr.bool(0.3)) {
                const alternatives = bank
                  .map(labelOf)
                  .filter((x) => x.trim().toLowerCase() !== _c.label.trim().toLowerCase());
                if (alternatives.length) _c.collide = cr.pick(alternatives);
              }
            }
            const makeDecoy = (parent, text, isCollide) => {
              const b = u.el('button', isCollide ? 'end-xtra pq-xtra' : 'end-xtra', parent, text);
              b.type = 'button';
              b.dataset.role = 'xtra';
              b.onclick = () => env.log('decoy', isCollide ? { label: text, collide: true } : { label: text });
              return b;
            };
            if (_c.placement === 'header' || (_c.collide && _c.placement === 'header')) {
              const tools = u.el('div', 'header-actions', ph);
              if (_c.collide && _c.placement === 'header') makeDecoy(tools, _c.collide, true);
              if (_c.placement === 'header') {
                _c.submit = u.el('button', 'submit header-submit', tools, _c.label);
                _c.submit.type = 'button';
                _c.submit.dataset.role = 'submit';
                _c.submit.title = _c.label;
                _c.submit.setAttribute('aria-label', _c.label);
                _c.submit.onclick = () => ctx.submit();
              }
            }
            if (_c.placement === 'footer' || _c.placement === 'link') {
              if (_c.collide && _c.placement !== 'header') makeDecoy(footer, _c.collide, true);
              _c.submit = u.el(
                _c.placement === 'link' ? 'a' : 'button',
                _c.placement === 'link' ? 'submit footer-link' : 'submit',
                footer,
                _c.placement === 'link' ? `${_c.label} ›` : _c.label,
              );
              if (_c.placement === 'link') _c.submit.href = '#';
              else _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.title = _c.label;
              _c.submit.setAttribute('aria-label', _c.label);
              _c.submit.onclick = (e) => {
                e.preventDefault();
                ctx.submit();
              };
            }
            Object.assign(_c, { makeDecoy });
          },
        'frame.27': () => () => {},
      },
    },
  });
})();
