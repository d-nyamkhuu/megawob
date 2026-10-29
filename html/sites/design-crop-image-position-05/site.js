// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-crop-image-position-05',
    styles: ['site.css', 'mint.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'fullbleed',
        'theme': 'mint-crop',
        'title': 'Edit Photo',
        'subtitle': 'Photo 4 of 12　 |　 148 photos total',
        'menu': 'Home|Photos|Albums|People|Sharing|Help',
        'accent': '#245C94',
        'bg': '#fff',
        'surface': '#fff',
        'font': 'Arial, Helvetica, sans-serif',
      },
      parts: {
        'frame.2': (base, S) =>
          function (_c) {
            const { C } = S;
            const { body, ctx } = _c;
            _c.display = ctx.display || 'header';
            const size = ctx.size || {},
              width = size.width || size.w || document.documentElement.clientWidth;
            if ((_c.display === 'panel' || _c.display === 'toast') && width < 850) _c.display = 'header';
            body.className =
              'design ' + C.theme + ' layout-' + C.layout + (_c.display === 'toast' ? ' has-instruction-toast' : '');
            Object.assign(_c, { size, width });
          },
        'frame.3': () => () => {},
        'frame.9': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, shell, content, u } = _c;
            const title = u.el('div', 'title', head);
            u.el('span', 'library-name', title, 'Media Library');
            const band = u.el('div', 'band', head);
            const thumb = u.el('div', 'band-thumb', band);
            u.el('canvas', 'band-ball', thumb);
            const info = u.el('div', 'band-info', band);
            for (const [k, v] of [
              ['File name:', 'garden.jpg'],
              ['Type:', 'JPEG Image'],
              ['Dimensions:', '1024 × 768'],
              ['File size:', '364 KB'],
              ['Date added:', 'Mar 14, 2003'],
            ]) {
              u.el('span', 'bi-k', info, k);
              u.el('span', 'bi-v', info, v);
            }
            const sum = u.el('div', 'band-sum', band);
            u.el('div', 'sum-h', sum, 'Library Summary');
            for (const [k, v] of [['Images', 24], ['Documents', 6], ['Audio', 3], ['Video', 2], ['Total', 35]]) {
              const row = u.el('div', 'sum-r' + (k === 'Total' ? ' tot' : ''), sum);
              u.el('span', '', row, k);
              u.el('span', '', row, String(v));
            }
            u.el('div', 'edit-h', head, 'Edit Image');
            const dock = u.el('nav', 'dock', shell);
            for (const [i, label] of ['Media Library', 'Documents', 'Contacts', 'Calendar', 'Settings'].entries()) {
              const t = u.el('button', 'dock-tab' + (i === 0 ? ' active' : ''), dock);
              t.type = 'button';
              const ic = u.el('i', 'dock-ic ic' + i, t);
              const svgs = [
                '<rect x="2" y="3" width="20" height="18" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 18l5-7 4 5 3-3 4 5z" fill="currentColor"/><circle cx="16" cy="8" r="2" fill="currentColor"/>',
                '<path d="M5 2h10l5 5v15H5z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 11h9M8 15h9M8 19h9" stroke="currentColor" stroke-width="1.5"/>',
                '<circle cx="9" cy="8" r="4" fill="currentColor"/><path d="M1 21c0-6 16-6 16 0z" fill="currentColor"/><circle cx="17" cy="9" r="3" fill="currentColor"/><path d="M14 15c5-1 9 1 9 6h-7z" fill="currentColor"/>',
                '<rect x="2" y="4" width="20" height="18" fill="none" stroke="currentColor" stroke-width="2"/><path d="M2 9h20M7 2v4M17 2v4" stroke="currentColor" stroke-width="2"/><path d="M6 12h3v3H6zM11 12h3v3h-3zM16 12h3v3h-3zM6 17h3v3H6zM11 17h3v3h-3z" fill="currentColor"/>',
                '<circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="3"/><path d="M12 1v4M12 19v4M1 12h4M19 12h4M4 4l3 3M17 17l3 3M20 4l-3 3M7 17l-3 3" stroke="currentColor" stroke-width="3"/>',
              ];
              ic.innerHTML = '<svg viewBox="0 0 24 24" width="100%" height="100%">' + svgs[i] + '</svg>';
              u.el('span', '', t, label);
              t.onclick = () => {
                dock.querySelectorAll('.dock-tab').forEach((x) => x.classList.remove('active'));
                t.classList.add('active');
              };
            }
          },
        'frame.11': () => () => {},
        'frame.18': (base, S) =>
          function (_c) {
            const { note, u, head } = _c;
            if (_c.display === 'hidden') note.hidden = true;
            else if (_c.display === 'panel') note.classList.add('panel-mode');
            else if (_c.display === 'toast') {
              note.classList.add('instruction-toast');
              const x = u.el('button', 'note-close', note, '×');
              x.onclick = () => (note.style.visibility = 'hidden');
            }
            else head.querySelector('.title').append(note);
          },
        'frame.22': () =>
          function (_c) {
            const { content, u } = _c;
            const side = u.el('div', 'cropside', content);
            u.el('div', 'cs-h', side, 'Crop');
            const grp = (t, rows) => {
              u.el('div', 'cs-t', side, t);
              for (const [k, v, key] of rows) {
                const r = u.el('div', 'cs-r', side);
                u.el('span', 'cs-k', r, k);
                const field = u.el('span', 'cs-in', r);
                const value = u.el('span', '', field, v);
                value.dataset.cropField = key;
                u.el('span', 'cs-u', r, 'pixels');
              }
            };
            grp('Selection Size', [['Width:', '320', 'w'], ['Height:', '320', 'h']]);
            grp('Selection Position', [['X:', '45', 'x'], ['Y:', '32', 'y']]);
            u.el('div', 'cs-t cs-rule', side, 'Aspect Ratio');
            u.el('div', 'cs-sel', side, 'Free form');
            u.el('div', 'cs-t cs-rule', side, 'Crop Preview');
            u.el('canvas', 'cs-prev', side);
          },
        'frame.23': () => () => {},
        'frame.26': (base, S) =>
          function (_c) {
            const { ctx, footer, head, shell, u } = _c;
            const endRng = ctx.rng.fork('chrome/end'),
              labelBank = ctx.content && ctx.content.END_LABELS;
            const endLabels = (
              Array.isArray(labelBank) && labelBank.length
                ? labelBank
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
            ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
            ((_c.placement = null), (_c.label = null));
            if (!ctx.finish) {
              const common = [endRng.bool(0.5), endRng.bool(0.5), endRng.bool(0.5)].filter(Boolean).length >= 2;
              if (common) {
                _c.placement = 'header';
                _c.label = 'Continue';
              } else {
                _c.placement = endRng.pick(['header', 'footer', 'link']);
                const alternatives = endLabels.filter((x) => String(x).trim().toLowerCase() !== 'submit');
                _c.label =
                  _c.placement === 'header' ? 'Continue' : endRng.pick(alternatives.length ? alternatives : endLabels);
              }
            }
            const collideRng = ctx.rng.fork('chrome/collide');
            _c.collide = null;
            if (!ctx.finish && collideRng.bool(0.3)) {
              const options = [
                ...new Set(
                  endLabels.filter((x) => String(x).trim().toLowerCase() !== String(_c.label).trim().toLowerCase()),
                ),
              ];
              if (options.length) _c.collide = collideRng.pick(options);
            }
            _c.submit = null;
            const makeSubmit = (parent, cls, text) => {
              const b = u.el(cls === 'end-link' ? 'a' : 'button', cls, parent, text);
              if (b.tagName === 'BUTTON') b.type = 'button';
              else b.href = '#';
              b.dataset.role = 'submit';
              b.setAttribute('aria-label', _c.label);
              b.title = _c.label;
              b.onclick = (e) => {
                e.preventDefault();
                ctx.submit();
              };
              return b;
            };
            if (_c.placement === 'header') _c.submit = makeSubmit(head, 'submit header-submit', _c.label);
            else if (_c.placement === 'aside' && _c.aside)
              _c.submit = makeSubmit(shell, 'submit placed-aside', _c.label);
            else if (_c.placement === 'footer') _c.submit = makeSubmit(shell, 'submit placed-footer', _c.label);
            else if (_c.placement === 'link') _c.submit = makeSubmit(shell, 'end-link', _c.label + ' ›');
            if (!ctx.finish && _c.aside && (!_c.submit || !_c.submit.isConnected || _c.submit.closest('[hidden]'))) {
              if (_c.submit) _c.submit.remove();
              _c.placement = 'aside';
              _c.label = 'Submit';
              _c.submit = makeSubmit(shell, 'submit placed-aside', _c.label);
            }
            if (_c.collide) {
              const parent = _c.placement === 'header' ? head : _c.aside || footer;
              const b = u.el('button', 'end-xtra', parent, _c.collide);
              b.type = 'button';
              b.dataset.role = 'xtra';
              b.onclick = () => env.log('decoy', { label: _c.collide, collide: true });
            }
            footer.hidden = true;
            Object.assign(_c, { collideRng, endLabels, endRng, labelBank, makeSubmit });
          },
        'frame.27': () => () => {},
      },
    },
  });
})();
