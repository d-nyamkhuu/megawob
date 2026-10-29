// Design on templates/site/drag-composition-event-02.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-complete-goals-booking-03',
    styles: ['site.css'],
    scripts: [],
    template: 'site/complete-goals-event-02',
    design: {
      parts: {
        'frame.22': (base, S) => function (_c) {
          const { ctx, rng } = _c;
          document.body.dataset.instruction = _c.display;
          _c.placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
        },
        'frame.25': (base, S) => function (_c) {
          const { rng } = _c;
          const sidebarDraw = rng.bool(0.35);
          const sidebar = true;
          const navDraw = rng.bool(0.5);
          const nav = true;
          Object.assign(_c, { nav, navDraw, sidebar, sidebarDraw });
        },
        'frame.26': () => () => {},
        'frame.34': (base, S) => function (_c) {
          const { K, TITLES } = S;
          const { header, lr, nav, rng, util, word } = _c;
          if (_c.display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : 'Riverside Inn');
        brand.dataset.role = 'brand';
      }
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
        'frame.79': (base, S) => function (_c) {
          const { stage, util, wantFooter } = _c;
          const help = util.el('div', 'booking-help', document.body);
          util.el('div', 'booking-info', help, 'i');
          for (const [title, text] of [
        ['14-night maximum stay', 'Stays can be 1 to 14 nights.'],
        ['Real-time availability', 'Only available dates can be booked.'],
        ['Flexible options', 'Change or cancel most bookings online.'],
      ]) {
        const item = util.el('div', 'booking-help-item', help);
        util.el('strong', '', item, title);
        util.el('span', '', item, text);
      }
          document.body.classList.toggle('booking-footer-controls', !!(wantFooter || _c.placement === 'floating'));
          return { stage, submit: _c.submit };
          Object.assign(_c, { help });
        },
      },
    },
  });
})();
