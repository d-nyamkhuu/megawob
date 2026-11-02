// Design on templates/site/form-text-login-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-act-in-time-simon-01',
    styles: ['site.css'],
    scripts: [],
    template: 'site/type-text-login-01',
    design: {
      C: {"site":"design-act-in-time-simon-01","brand":"Memory Lights","title":"Game Area","instruction":"top","rail":"","menu":"Test your memory","briefTitle":"Instructions"},
      parts: {
        'frame.7': (base, S) => function (_c) {
          const { ctx, top, u } = _c;
          const controls = u.el('span', 'ds-window-controls', top);
          _c.submit = null;
          _c.placement = null;
          _c.label = 'Submit';
          _c.collide = null;
          if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        if (er.bool(0.5)) {
          _c.placement = 'footer';
          _c.label = 'Submit';
        } else {
          _c.placement = er.pick(['header', 'link']);
          const labels = ctx.content.END_LABELS || ['Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
          const nameOf = x => typeof x === 'string' ? x : (x.label || x.text || x.name);
          const options = labels.filter(x => nameOf(x).trim().toLowerCase() !== 'submit');
          _c.label = nameOf(er.pick(options));
        }
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const bank = (ctx.content.END_LABELS || ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'])
            .map(x => typeof x === 'string' ? x : (x.label || x.text || x.name))
            .filter(x => x.trim().toLowerCase() !== _c.label.trim().toLowerCase());
          if (bank.length) _c.collide = cr.pick(bank);
        }
      }
          function addSubmit(parent, cls, text) {
        const b = u.el(cls === 'ds-end-link' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'A') b.href = '#';
        else b.type = 'button';
        b.dataset.role = 'submit';
        b.title = _c.label;
        b.setAttribute('aria-label', _c.label);
        b.addEventListener('click', e => { e.preventDefault(); ctx.submit(); });
        _c.submit = b;
      }
          if (_c.placement === 'header') addSubmit(controls, 'ds-end-header', _c.label);
          if (_c.collide) {
        const d = u.el('button', 'ds-xtra', controls, _c.collide);
        d.type = 'button';
        d.dataset.role = 'xtra';
        d.addEventListener('click', () => env.log('decoy', {label: _c.collide, collide: true}));
      }
          u.el('span', 'ds-window-glyphs', controls, '−    □    ×');
          Object.assign(_c, { addSubmit, controls });
        },
        'frame.14': (base, S) => function (_c) {
          const { C } = S;
          const { ctx, mode, u } = _c;
          document.body.dataset.simonbrief = mode;
          function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle || 'Task');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
          Object.assign(_c, { briefing });
        },
        'frame.18': (base, S) => function (_c) {
          const { main, u } = _c;
          const notes = u.el('aside', 'ds-simon-notes', main);
          u.el('h2', '', notes, 'Instructions');
          const ol = u.el('ol', '', notes);
          ['Watch the buttons as they light up in a sequence.', 'After the sequence finishes, click the buttons in the same order.']
        .forEach(t => u.el('li', '', ol, t));
          u.el('h2', '', notes, 'Notes');
          const ul = u.el('ul', '', notes);
          ['Wait for the full sequence before clicking.', 'Replay the colors in the order they appeared.']
        .forEach(t => u.el('li', '', ul, t));
          const stage = u.el('main', 'ds-stage', main);
          Object.assign(_c, { notes, ol, stage, ul });
        },
        'frame.22': (base, S) => function (_c) {
          const { addSubmit, ctx, foot } = _c;
          if (!ctx.finish && _c.placement !== 'header') {
        if (_c.placement === 'link') addSubmit(foot, 'ds-end-link', _c.label + ' ›');
        else addSubmit(foot, 'ds-submit', _c.label);
      }
        },
        'frame.23': () => () => {},
        'frame.24': () => () => {},
        'frame.25': () => () => {},
        'frame.26': () => () => {},
      },
    },
  });
})();
