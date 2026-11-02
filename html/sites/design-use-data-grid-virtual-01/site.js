// Design on templates/site/drag-composition-event-02.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-data-grid-virtual-01',
    styles: ['site.css'],
    scripts: [],
    template: 'site/complete-goals-event-02',
    design: {
      parts: {
        'frame.7': (base, S) => function (_c) {
          const { LOW_THEME, THEMES } = S;
          const { root } = _c;
          _c.name = 'light';
          _c.accent = '#0878ff';
          for (const [k, v] of Object.entries(_c.name === 'low' ? LOW_THEME : THEMES[_c.name])) root.style.setProperty(`--${k}`, v);
        },
        'frame.33': (base, S) => function (_c) {
          const { TITLES } = S;
          const { rng, util } = _c;
          const win = util.el('div', 'ref-window', document.body);
          const header = util.el('header', 'ref-task', win);
          rng.pick(TITLES);
          const brand = util.el('div', 'ref-brand', header, 'Support Tickets');
          brand.dataset.role = 'brand';
          Object.assign(_c, { brand, header, win });
        },
        'frame.34': () => () => {},
        'frame.45': (base, S) => function (_c) {
          const { util, win } = _c;
          const body = util.el('div', 'ref-body', win);
          Object.assign(_c, { body });
        },
        'frame.46': () => () => {},
        'frame.47': () => () => {},
        'frame.48': () => () => {},
        'frame.49': () => () => {},
        'frame.50': () => () => {},
        'frame.51': () => () => {},
        'frame.52': () => () => {},
        'frame.53': () => () => {},
        'frame.54': () => () => {},
        'frame.55': () => () => {},
        'frame.56': () => () => {},
        'frame.57': () => () => {},
        'frame.58': () => () => {},
        'frame.59': () => () => {},
        'frame.60': () => () => {},
        'frame.61': () => () => {},
        'frame.62': () => () => {},
        'frame.63': () => () => {},
        'frame.64': () => () => {},
        'frame.65': () => () => {},
        'frame.66': () => () => {},
        'frame.67': () => () => {},
        'frame.68': () => () => {},
        'frame.69': () => () => {},
        'frame.70': () => () => {},
        'frame.77': (base, S) => function (_c) {
          const { decoyBtn, decoys, endBtn, lr, rng, util, wantFooter, win, word } = _c;
          if (wantFooter) {
        const foot = util.el('footer', 'ref-foot', win);
        const footText = rng.pick(['© 2024 Example Co.', 'All changes are saved automatically.',
          'Need help? Contact your administrator.', 'v4.2.1 · Status: all systems normal']);
        util.el('span', 'ref-foot-text', foot, word ? lr.pick([`© 2024 Example Co. ${word('footRights')}`,
          word('footSaved'), word('footHelp'), `v4.2.1 · ${word('footStatus')}`]) : footText);
        const tools = util.el('div', 'ref-tools', foot);
        if (decoys.length > 1) decoyBtn(tools, decoys[1]);
        if (_c.collide && _c.collide.where === 'footer') decoyBtn(tools, _c.collide.text, true);
        if (_c.placement === 'footer') _c.submit = endBtn(tools, 'ref-submit', _c.label);
        if (_c.placement === 'link') _c.submit = endBtn(tools, 'ref-endlink', `${_c.label} ›`);
      }
        },
        'overlay.6': (base, S) => function (_c) {
          const { el, kind, util } = _c;
          if (kind === 'banner') el.style.top = `${document.querySelector('.ref-task').getBoundingClientRect().bottom}px`;
          const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
          Object.assign(_c, { box });
        },
      },
    },
  });
})();
