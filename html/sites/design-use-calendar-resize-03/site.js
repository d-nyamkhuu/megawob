// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const THEMES = {
    light: { bg: '#c7cbd0', panel: '#e6e6e6', fg: '#111820', muted: '#414b55', line: '#929ba4' },
    dark: { bg: '#c7cbd0', panel: '#e6e6e6', fg: '#111820', muted: '#414b55', line: '#929ba4' },
    warm: { bg: '#c7cbd0', panel: '#e6e6e6', fg: '#111820', muted: '#414b55', line: '#929ba4' },
  };

  const LOW_THEME = { bg: '#c7cbd0', panel: '#e6e6e6', fg: '#111820', muted: '#414b55', line: '#929ba4' };

  const LOW_ACCENTS = ['#7194b8', '#7194b8', '#7194b8', '#7194b8'];

  const ACCENTS = ['#7194b8', '#7194b8', '#7194b8', '#7194b8', '#7194b8', '#7194b8'];

  const parts = {
    overlay: (base, S) =>
      function overlay(ctx) {
        const { K } = S;
        const { rng, util, kind } = ctx;
        const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
        const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
        const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
        el.dataset.role = 'overlay';
        const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
        util.el(
          'div',
          'ref-ov-text',
          box,
          word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text,
        );
        const row = util.el('div', 'ref-ov-row', box);
        const btn = (label, how, primary) => {
          if (word && K.button[label]) label = word(K.button[label]);
          const b = util.el('button', primary ? 'ref-ov-btn ref-ov-primary' : 'ref-ov-btn', row, label);
          b.type = 'button';
          b.addEventListener('click', () => (how ? ctx.dismiss(how) : env.log('overlay-click', { label })));
          return b;
        };
        let dismiss;
        if (kind === 'cookie') {
          if (rng.bool(0.5)) btn('Settings', null, false);
          btn(rng.pick(['Reject all', 'Necessary only']), 'reject', false);
          dismiss = btn(rng.pick(['Accept all', 'Accept', 'Got it']), 'accept', true);
        } else if (kind === 'promo') {
          dismiss = btn(rng.pick(['No thanks', 'Maybe later', 'Close']), 'close', false);
          btn(rng.pick(['Upgrade now', 'Start trial', 'Learn more']), null, true);
        } else if (kind === 'banner') {
          const summary = document.querySelector('.cal-summary');
          if (summary) el.style.top = `${summary.getBoundingClientRect().bottom + 2}px`;
          dismiss = btn('Dismiss', 'close', false);
        } else {
          dismiss = btn('×', 'close', false);
          dismiss.setAttribute('aria-label', word ? word('close') : 'Close');
        }
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
    'frame.placement': (base, S) =>
      function (_c) {
        const { W, content, ctx, local, lr, rng, roomy, tall, util, word } = _c;
        const { K, endLabel } = S;
        // End control placement (none in finish mode).
        let placement = ctx.finish
          ? null
          : rng.pick(['header', 'header', 'header', 'footer', 'link', 'icon', 'floating']);
        const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
        if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
        // Keep the reference design's single-purpose desktop window. Draw the same
        // variation values as the shared site, but do not add dashboard navigation.
        const sidebarPick = roomy && rng.bool(0.35);
        const sidebar = false;
        const navPick = W >= 1180 && rng.bool(0.5);
        const nav = false;
        const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
        let label = endLabel(rng, content);
        if (word) label = word(lr.pick(K.end));
        // A decoy that reads like an end control (another end word, never this episode's label).
        const { collide, cr } = S.frameCollide(_c, label);
        const tabs = util.el('nav', 'cal-top-tabs', document.body);
        for (const item of ['Home', 'Calendar', 'People', 'Projects', 'Tasks', 'Documents']) {
          const a = util.el('a', `cal-tab${item === 'Calendar' ? ' active' : ''}`, tabs, item);
          a.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { what: 'nav', label: item });
          });
        }
        const search = util.el('div', 'cal-search', tabs);
        util.el('span', '', search, 'Search calendars');
        util.el('b', '', search, '⌕');
        Object.assign(_c, {
          collide,
          cr,
          decoys,
          label,
          nav,
          navPick,
          placement,
          search,
          sidebar,
          sidebarPick,
          tabs,
          wantFooter,
        });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { display, lr, navPick, rng, util, word } = _c;
        const { K, TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        if (display !== 'header' || navPick) {
          rng.pick(TITLES);
          if (word) lr.pick(K.brand);
        }
        const brand = util.el('div', 'ref-brand', header, 'Team Calendar');
        brand.dataset.role = 'brand';
        Object.assign(_c, { brand, header });
      },
    'frame.instruction': (base, S) =>
      function (_c) {
        const { ctx, display, header, util } = _c;
        if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
        else util.el('div', 'ref-spacer', header);
        const summary = util.el('section', 'cal-summary', document.body);
        const headerNote = header.querySelector('.ref-instruction');
        if (headerNote) summary.appendChild(headerNote);
        const peopleIcon = util.el('div', 'cal-people', summary);
        for (const color of ['green', 'blue', 'orange']) util.el('i', `cal-figure ${color}`, peopleIcon);
        util.el('div', 'cal-teamlinks', summary, 'Design   |   Marketing   |   Product   |   All Hands');
        const world = util.svg('svg', { viewBox: '0 0 320 115', class: 'cal-world', 'aria-hidden': 'true' }, summary);
        util.svg(
          'path',
          {
            d: 'M5 24 24 16 50 17 56 7 77 3 92 12 104 10 114 20 103 26 94 23 86 34 80 47 69 53 63 70 54 65 49 51 34 47 25 34 13 36ZM61 74 77 72 89 82 87 95 77 110 69 103 67 90ZM104 8 123 3 138 9 131 22 118 26 109 20ZM151 22 166 18 178 24 177 33 188 32 190 45 177 52 168 42 157 46 148 37ZM169 49 187 45 204 55 201 70 189 89 178 91 171 77 164 63ZM181 17 198 8 220 12 239 8 253 15 277 15 296 27 312 30 299 42 281 43 271 55 253 50 244 64 232 62 221 49 210 48 203 32 189 31ZM217 66 227 72 231 87 225 89 219 79ZM266 81 286 77 302 88 295 100 280 103 265 95ZM308 103 316 99 313 111 307 114Z',
            fill: '#bedcf0',
          },
          world,
        );
        util.svg(
          'path',
          {
            d: 'm24 22 12 6 14-1 7 7 12-1 10 5M38 28l-2 12 13 4 13-2 10 6M58 8l3 11 10 1 6-13M72 18l3 10 10 2M60 54l10 5M71 76l-2 10 7 8-2 12M70 85l13-1M151 30l9 2 7-6 8 5M159 33l5 10M177 26l7-4 13 3 12-3 11 5 18-6 12 5 23 1 14 6M189 33l10 9 11-3 10 8 12-4 15 8M211 27l-1 12M237 25l-5 18M259 29l-7 11 11 5M275 31l-5 10 7 5M170 54l15 4 15-3M182 58l-3 14 12 3M168 66l11 6M190 75l-4 12M269 88l13 3 15-3M281 91l-1 10',
            fill: 'none',
            stroke: '#f7fcff',
            'stroke-width': 1.2,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
          },
          world,
        );
        util.svg(
          'path',
          {
            d: 'm164 15 3-9 5-3 4 4-7 15-4 3M289 54l4-6 2 5-3 8-4 3M245 70l7 2 2 5-5-2M256 76l9 4 7 1-3 3-11-3M299 63l3 2-1 5-4-2M203 84l3-7 2 3-3 7',
            fill: '#bedcf0',
          },
          world,
        );
        for (const [city, time] of [
          ['San Francisco', '9:24 AM'],
          ['New York', '12:24 PM'],
        ]) {
          const zone = util.el('div', 'cal-zone', summary);
          util.el('span', '', zone, city);
          util.el('strong', '', zone, time);
          util.el('span', '', zone, 'Wed, Apr 12');
        }
        Object.assign(_c, { headerNote, peopleIcon, summary, world });
      },
    'frame.toast': (base, S) =>
      function (_c) {
        const { closeLabel, ctx, display, summary, util } = _c;
        if (display === 'toast') {
          const note = util.el('div', 'ref-note', summary);
          util.el('div', 'ref-note-text', note, ctx.instruction);
          const x = util.el('button', 'ref-note-x', note, '×');
          x.type = 'button';
          x.setAttribute('aria-label', closeLabel);
          x.addEventListener('click', () => {
            note.style.visibility = 'hidden';
            env.log('note-close');
          });
        }
      },
    'frame.floating': (base, S) =>
      function (_c) {
        const { endBtn, label, placement, util } = _c;
        let { submit } = _c;
        if (placement === 'floating') {
          // Reserve the control's space so it cannot intercept task clicks or drags.
          // On scrollable pages the dock follows the content, just like a form footer.
          const dock = util.el('div', 'ref-float-dock', document.body);
          submit = endBtn(dock, 'ref-submit ref-float', label);
        }
        const tips = util.el('footer', 'cal-tips', document.body);
        const tipsHeading = util.el('strong', '', tips);
        const bulb = util.svg(
          'svg',
          { viewBox: '0 0 30 42', class: 'cal-tip-bulb', 'aria-hidden': 'true' },
          tipsHeading,
        );
        const defs = util.svg('defs', {}, bulb);
        const glow = util.svg('radialGradient', { id: 'cal-bulb-glow', cx: '.35', cy: '.25', r: '.7' }, defs);
        util.svg('stop', { offset: '0', 'stop-color': '#fffef0' }, glow);
        util.svg('stop', { offset: '.5', 'stop-color': '#fff19b' }, glow);
        util.svg('stop', { offset: '1', 'stop-color': '#ffbf22' }, glow);
        util.svg(
          'path',
          {
            d: 'M8 29C8 23 2 21 2 13a13 13 0 0 1 26 0c0 8-6 10-6 16z',
            fill: 'url(#cal-bulb-glow)',
            stroke: '#dda12a',
            'stroke-width': 1.2,
          },
          bulb,
        );
        util.svg(
          'path',
          { d: 'M10 30V18l-4-4 5-2 4 4 4-4 5 2-4 4v12', fill: 'none', stroke: '#fffce5', 'stroke-width': 2 },
          bulb,
        );
        util.svg('path', { d: 'M9 29h12v8H9z', fill: '#b2bdc6', stroke: '#6c8193' }, bulb);
        util.svg('path', { d: 'M9 31h12M9 34h12M11 38h8', fill: 'none', stroke: '#778c9d', 'stroke-width': 2 }, bulb);
        util.el('span', '', tipsHeading, 'Tips');
        util.el('span', '', tips, '•  Drag an event to a new time to reschedule.');
        util.el('span', '', tips, '•  Drag the bottom edge to change the duration.');
        util.el('span', '', tips, '•  Use the Month view to see more of your schedule.');
        const legend = util.el('div', 'cal-legend', tips);
        util.el('strong', '', legend, 'Event Colors');
        for (const [label, color] of [
          ['My Events', 'blue'],
          ['Team Meetings', 'green'],
          ['Project Alpha', 'pink'],
          ['Marketing', 'yellow'],
          ['Holidays', 'purple'],
        ]) {
          const item = util.el('span', `cal-legend-item cal-legend-${color}`, legend);
          util.el('i', '', item);
          util.el('span', '', item, label);
        }
        Object.assign(_c, { bulb, defs, glow, legend, submit, tips, tipsHeading });
      },
  };

  env.site({
    name: 'design-use-calendar-resize-03',
    template: 'site/base',
    design: { THEMES, LOW_THEME, LOW_ACCENTS, ACCENTS, parts },
  });
})();
