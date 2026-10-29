// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-crop-image-default-04',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'windows',
        'theme': 'academic',
        'title': 'Image Cropping Task',
        'aside': 'Image Controls',
        'foot': 'Vision Lab, 1995',
        'menu': 'Home  |  Tasks  |  Datasets  |  Help                                      Account  |  Sign Out',
        'accent': '#0864d8',
        'bg': '#fff',
        'surface': '#fff',
        'font': "Georgia, 'Times New Roman', serif",
      },
      parts: {
        'frame.3': () => () => {},
        'frame.8': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (['eink', 'office', 'vista', 'plain', 'aqua', 'motif', 'human', 'gtk', 'academic'].includes(C.theme)) {
              const controls = u.el('div', 'window-controls', head);
              for (const label of ['−', '□', '×']) {
                const bt = u.el('button', '', controls, label);
                bt.type = 'button';
                bt.onclick = () => env.log('window-control', { label });
              }
            }
          },
        'frame.14': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, note, u } = _c;
            u.el(
              'div',
              'note-label',
              note,
              ctx.display === 'panel'
                ? 'Instructions'
                : ctx.display === 'toast'
                  ? 'Task notice'
                  : C.layout === 'left'
                    ? 'Task'
                    : '',
            );
          },
        'frame.22': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, u } = _c;
            _c.aside = u.el('aside', 'aside', content);
            u.el('h3', '', _c.aside, C.aside);
            u.el('hr', '', _c.aside);
            u.el('div', 'zoom-row', _c.aside, 'Zoom:');
            const zoom = u.el('button', 'zoom-select', _c.aside, '100%  ▾');
            zoom.type = 'button';
            const fit = u.el('button', 'fit-button', _c.aside, 'Fit to Window');
            fit.type = 'button';
            fit.onclick = () => {};
            u.el('hr', '', _c.aside);
            u.el('h3', 'instructions-heading', _c.aside, 'Instructions');
            const steps = u.el('ol', 'academic-steps', _c.aside);
            for (const t of [
              'Drag the crop handles to resize the box.',
              'Drag inside the box to reposition it.',
            ])
              u.el('li', '', steps, t);
          },
        'frame.23': () => () => {},
        'frame.25': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, footer, head, shell, u } = _c;
            const footlinks = u.el('div', 'footer-links', footer);
            for (const label of ['About', 'Privacy', 'Contact']) {
              const a = u.el('a', '', footlinks, label);
              a.href = '#';
              a.onclick = (e) => e.preventDefault();
            }
            u.el('div', 'footer-copy', footer, C.foot || '');
            const er = ctx.rng.fork('chrome/end'),
              cr = ctx.rng.fork('chrome/collide');
            const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
            const endLabels = ctx.content.END_LABELS.map(labelOf);
            const referenceEnd = er.bool(0.5);
            const placement = referenceEnd ? 'aside' : er.pick(['header', 'link']);
            const endLabel = referenceEnd ? 'Submit' : er.pick(endLabels);
            ((_c.submit = null), (_c.headerTools = null));
            const tools = () => {
              if (!_c.headerTools) {
                head.classList.add('has-end-tools');
                _c.headerTools = u.el('div', 'academic-end-tools', head);
              }
              return _c.headerTools;
            };
            if (!ctx.finish) {
              const parent = placement === 'aside' ? _c.aside : placement === 'header' ? tools() : footer;
              _c.submit = u.el(
                placement === 'link' ? 'a' : 'button',
                'submit' + (placement === 'aside' ? '' : ' academic-end-' + placement),
                parent,
                endLabel,
              );
              if (placement === 'link') {
                _c.submit.href = '#';
                footer.insertBefore(_c.submit, footer.querySelector('.footer-copy'));
              } else _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.dataset.placement = placement;
              _c.submit.title = endLabel;
              _c.submit.setAttribute('aria-label', endLabel);
              _c.submit.onclick = (e) => {
                e.preventDefault();
                ctx.submit();
              };
            }
            if (cr.bool(0.3)) {
              const choices = [...new Set(endLabels)].filter(
                (label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
              );
              if (choices.length) {
                const label = cr.pick(choices),
                  decoy = u.el('button', 'academic-xtra', tools(), label);
                decoy.type = 'button';
                decoy.dataset.role = 'xtra';
                decoy.onclick = () => env.log('decoy', { label, collide: true });
              }
            }
            const help = u.el('section', 'help-window', shell);
            const helpbar = u.el('header', 'help-titlebar', help);
            u.el('strong', '', helpbar, 'Help');
            const hc = u.el('div', 'help-controls', helpbar);
            for (const label of ['−', '□', '×']) {
              const b = u.el('button', '', hc, label);
              b.type = 'button';
              b.onclick = () => {
                if (label === '×') help.hidden = true;
              };
            }
            const helpbody = u.el('div', 'help-body', help);
            u.el('h2', '', helpbody, 'Cropping Guide');
            const sample = u.el('div', 'help-example', helpbody);
            u.el('div', 'mini-preview', sample);
            const copy = u.el(
              'p',
              '',
              helpbody,
              'Drag a corner or edge handle to resize the crop box. Drag inside to move it.',
            );
            const links = u.el('div', 'help-links', helpbody);
            u.el('a', '', links, 'More Help');
            u.el('a', '', links, 'Examples');
            const close = u.el('a', '', links, 'Close');
            close.href = '#';
            close.onclick = (e) => {
              e.preventDefault();
              help.hidden = true;
            };
            Object.assign(_c, {
              close,
              copy,
              cr,
              endLabel,
              endLabels,
              er,
              footlinks,
              hc,
              help,
              helpbar,
              helpbody,
              labelOf,
              links,
              placement,
              referenceEnd,
              sample,
              tools,
            });
          },
        'frame.26': () => () => {},
        'frame.27': () => () => {},
      },
    },
  });
})();
