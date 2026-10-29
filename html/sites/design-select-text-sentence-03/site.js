// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-select-text-sentence-03',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'sheet',
        'theme': 'paper',
        'title': 'Text Task',
        'menu': 'Home',
        'foot': '',
        'accent': '#3f64d4',
        'bg': '#f1f3f8',
        'surface': '#fff',
        'font': "Roboto, 'Helvetica Neue', Arial, sans-serif",
      },
      parts: {
        'frame.2': (base, S) =>
          function (_c) {
            const { C } = S;
            const { body, ctx } = _c;
            body.className =
              'design ' +
              C.theme +
              ' layout-' +
              C.layout +
              ' display-' +
              ctx.display +
              (ctx.display === 'toast' ? ' has-instruction-toast' : '');
          },
        'frame.3': () => () => {},
        'frame.9': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            const mast = u.el('div', 'mast', head),
              ttl = u.el('div', 'title', mast);
            {
              const lg = u.svg(
                'svg',
                { class: 'logo', width: 34, height: 40, viewBox: '0 0 34 40', fill: 'none' },
                ttl,
              );
              u.svg('path', { d: 'M4 0H21L32 11V37Q32 40 29 40H4Q1 40 1 37V3Q1 0 4 0Z', fill: '#fff' }, lg);
              u.svg('path', { d: 'M21 1V12H31', stroke: '#3f64d4', 'stroke-width': 1.4 }, lg);
              u.svg('path', { d: 'M8 18H25M8 24H25M8 30H20', stroke: '#4169db', 'stroke-width': 2.3 }, lg);
            }
            u.el('span', 'brand', ttl, 'Text Task');
            const tl = u.el('div', 'toplinks', mast);
            {
              const q = u.svg('svg', { width: 34, height: 34, viewBox: '0 0 24 24' }, tl);
              u.svg('circle', { cx: 12, cy: 12, r: 10, fill: '#fff' }, q);
              u.svg(
                'path',
                {
                  d: 'M9.5 9.5Q9.5 7 12 7Q14.5 7 14.5 9.5Q14.5 11 12 12V13.5 M12 15.5V17',
                  stroke: '#3f64d4',
                  'stroke-width': 1.8,
                  fill: 'none',
                },
                q,
              );
              const av = u.svg('svg', { width: 38, height: 38, viewBox: '0 0 24 24' }, tl);
              u.svg('circle', { cx: 12, cy: 12, r: 10, fill: '#dce6ff' }, av);
              u.svg('circle', { cx: 12, cy: 8.5, r: 3.3, fill: '#3f64d4' }, av);
              u.svg('path', { d: 'M5.5 18Q12 11.5 18.5 18Q12 22 5.5 18', fill: '#3f64d4' }, av);
            }
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
            const { ctx, footer, mast, u } = _c;
            {
              const cn = u.el('button', 'cancel', footer, 'Cancel');
              cn.type = 'button';
              cn.onclick = () => env.log('cancel', {});
            }
            _c.submit = null;
            const endRng = ctx.rng.fork('chrome/end');
            const labels =
              ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
                ? ctx.content.END_LABELS
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
            const labelText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
            const end = ctx.finish
              ? null
              : endRng.bool(0.5)
                ? { where: 'footer', label: 'Submit' }
                : {
                    where: endRng.pick(['header', 'footer-link', 'header-link']),
                    label: labelText(endRng.pick(labels)),
                  };
            const endButton = (parent, where, label) => {
              const b = u.el(
                where.includes('link') ? 'a' : 'button',
                where === 'footer' ? 'submit' : 'episode-end',
                parent,
                label,
              );
              b.type = where.includes('link') ? '' : 'button';
              if (where.includes('link')) b.href = '#';
              b.dataset.role = 'submit';
              b.setAttribute('aria-label', label);
              b.title = label;
              b.onclick = (e) => {
                e.preventDefault();
                ctx.submit();
              };
              return b;
            };
            const collideRng = ctx.rng.fork('chrome/collide');
            _c.collide = null;
            if (!ctx.finish && collideRng.bool(0.3)) {
              const own = labelText(end.label).trim().toLowerCase();
              const pool = [...new Set(labels.map(labelText).filter((x) => x.trim().toLowerCase() !== own))];
              if (pool.length)
                _c.collide = {
                  label: labelText(collideRng.pick(pool)),
                  where: collideRng.pick(['header', 'header', 'footer']),
                };
            }
            const decoy = (parent, label) => {
              const b = u.el('button', 'end-xtra', parent, label);
              b.type = 'button';
              b.dataset.role = 'xtra';
              b.onclick = () => env.log('decoy', { label, collide: true });
            };
            const topTools = u.el('div', 'episode-tools', mast);
            if (_c.collide && _c.collide.where === 'header') decoy(topTools, _c.collide.label);
            if (end && end.where === 'header') _c.submit = endButton(topTools, 'header', end.label);
            if (end && end.where === 'header-link') _c.submit = endButton(topTools, 'header-link', end.label);
            if (!ctx.finish && (end.where === 'footer' || end.where === 'footer-link')) {
              if (_c.collide && _c.collide.where === 'footer') decoy(footer, _c.collide.label);
              _c.submit = endButton(footer, end.where === 'footer' ? 'footer' : 'footer-link', end.label);
            }
            Object.assign(_c, { collideRng, decoy, end, endButton, endRng, labelText, labels, topTools });
          },
        'frame.27': () => () => {},
      },
    },
  });
})();
