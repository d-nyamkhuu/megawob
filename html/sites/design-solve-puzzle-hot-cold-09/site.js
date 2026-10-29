(function () {
  'use strict';
  const C = {
    site: 'design-solve-puzzle-hot-cold-09',
    style: 'kinetic',
    layout: 'wide-source',
    title: '',
    menu: '',
    note: 'SEARCH (OPTIONAL)',
    aside: 'You can use the search box to look for something on the page.',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = 'kinetic wide-source instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      const center = u.el('div', 'center', app),
        brief = u.el('div', 'brief', center, ctx.display === 'hidden' ? '' : ctx.instruction),
        stage = u.el('section', 'stage', center);
      const hero = u.svg(
        'svg',
        { class: 'kinetic-title', viewBox: '0 0 1208 941', preserveAspectRatio: 'none', 'aria-hidden': 'true' },
        center,
      );
      const glyphs = {
        F: 'M0 0H100V140H53V405H90V545H53V1000H0Z',
        I: 'M0 0H100V1000H0Z',
        N: 'M0 0H38L65 550V0H100V1000H65L35 460V1000H0Z',
        D: 'M0 0H56Q100 0 100 150V850Q100 1000 56 1000H0Z M48 140V860H53Q62 860 62 810V190Q62 140 53 140Z',
        T: 'M0 0H100V140H72V1000H28V140H0Z',
        H: 'M0 0H40V405H60V0H100V1000H60V545H40V1000H0Z',
        E: 'M0 0H100V140H53V405H90V545H53V860H100V1000H0Z',
        O: 'M50 0C15 0 0 65 0 170V830C0 935 15 1000 50 1000S100 935 100 830V170C100 65 85 0 50 0Z M50 145C44 145 43 160 43 185V815C43 840 44 855 50 855S57 840 57 815V185C57 160 56 145 50 145Z',
        A: 'M0 1000L23 0H77L100 1000H60L56 795H43L40 1000Z M46 660H54L50 235Z',
        R: 'M0 0H52Q100 0 100 170V350Q100 470 73 500Q92 530 93 640L100 1000H58L52 630Q51 575 42 575V1000H0Z M42 145V435H48Q58 435 58 380V200Q58 145 48 145Z',
      };
      for (const [word, y, h, positions, color] of [
        [
          'FINDTHE',
          30,
          215,
          [
            [54, 61],
            [121, 34],
            [162, 80],
            [248, 76],
            [357, 72],
            [435, 76],
            [517, 60],
          ],
          '#0c1423',
        ],
        [
          'HOTAREA',
          265,
          242,
          [
            [54, 89],
            [152, 89],
            [248, 83],
            [365, 95],
            [467, 89],
            [562, 67],
            [632, 95],
          ],
          '#0649e8',
        ],
      ]) {
        [...word].forEach((letter, i) => {
          const [x, w] = positions[i];
          u.svg(
            'path',
            {
              d: glyphs[letter],
              transform: `translate(${x} ${y}) scale(${w / 100} ${h / 1000})`,
              fill: color,
              'fill-rule': 'evenodd',
            },
            hero,
          );
        });
      }
      if (ctx.display === 'panel' || ctx.display === 'toast') document.body.appendChild(brief);
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, C.note);
      const search = u.el('div', 'search-field', aside);
      u.svg('svg', { width: 28, height: 28, viewBox: '0 0 28 28', class: 'search-icon' }, search);
      u.svg(
        'circle',
        { cx: 11, cy: 11, r: 7.5, fill: 'none', stroke: 'currentColor', 'stroke-width': 2 },
        search.querySelector('svg'),
      );
      u.svg(
        'path',
        { d: 'm17 17 6 6', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 },
        search.querySelector('svg'),
      );
      u.el('span', 'search-caret', search);
      u.el('p', 'aside-copy', aside, C.aside);
      const er = ctx.rng.fork('chrome/end'),
        cr = ctx.rng.fork('chrome/collide');
      const labels = ctx.content.END_LABELS.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name));
      const classic = er.bool(0.5),
        placement = classic ? 'footer' : er.pick(['toolbar', 'link']),
        label = classic ? 'Submit' : er.pick(labels);
      const footer = u.el('footer', 'bottom end-' + placement + (ctx.finish ? ' finish-mode' : ''), document.body);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(placement === 'link' ? 'a' : 'button', 'submit', footer, label);
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      if (cr.bool(0.3)) {
        const options = labels.filter((x) => x.toLowerCase() !== label.toLowerCase());
        if (options.length) {
          const decoyLabel = cr.pick(options),
            decoy = u.el(
              'button',
              'xtra ' + (placement === 'footer' && !ctx.finish ? 'above-end' : 'below-end'),
              aside,
              decoyLabel,
            );
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: decoyLabel, collide: true }));
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
