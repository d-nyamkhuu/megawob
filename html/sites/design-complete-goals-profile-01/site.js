// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    overlay: (base, S) =>
      function overlay(ctx) {
        const { K } = S;
        const { rng, util, kind } = ctx;
        const heading = document.querySelector('.studio-heading');
        const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
        const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
        const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
        el.dataset.role = 'overlay';
        const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
        if (kind === 'promo') {
          util.el('div', 'studio-envelope', box, '✉');
          util.el('h2', 'studio-overlay-title', box, 'Get product updates');
        }
        if (kind === 'chat') util.el('h2', 'studio-overlay-title', box, 'Need help?');
        util.el(
          'div',
          'ref-ov-text',
          box,
          word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text,
        );
        if (kind === 'promo' || kind === 'chat') {
          const input = util.el('input', 'studio-overlay-input', box);
          input.type = 'text';
          input.placeholder = kind === 'promo' ? 'Your email address' : 'Type a message…';
          input.setAttribute('aria-label', kind === 'promo' ? 'Email address' : 'Message');
        }
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
          dismiss = btn('Dismiss', 'close', false);
        } else {
          dismiss = btn('×', 'close', false);
          dismiss.setAttribute('aria-label', word ? word('close') : 'Close');
        }
        if (kind === 'promo') {
          dismiss.classList.add('studio-overlay-close');
          dismiss.title = dismiss.textContent;
          dismiss.setAttribute('aria-label', dismiss.textContent);
          dismiss.textContent = '×';
        }
        if (kind === 'banner') {
          if (heading) heading.before(el);
        }
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
    'frame.layout': (base, S) =>
      function (_c) {
        const { ctx } = _c;
        const W = document.documentElement.clientWidth;
        const H = document.documentElement.clientHeight;
        const roomy = W >= 1260;
        const tall = H >= 700;
        let display = ctx.display || 'header';
        if (display === 'panel' && !roomy) display = 'header';
        if (display === 'toast' && !tall) display = 'header';
        // reset() reuses the body: a previous toast must not shrink later episodes.
        document.body.classList.toggle('ref-has-note', display === 'toast');
        Object.assign(_c, { H, W, display, roomy, tall });
      },
    'frame.placement': (base, S) =>
      function (_c) {
        const { content, ctx, local, lr, rng, roomy, tall, word } = _c;
        const { K, endLabel } = S;
        // End control placement (none in finish mode).
        let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
        const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
        if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
        const sidebar = roomy && rng.bool(0.35);
        const nav = true;
        const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
        let label = endLabel(rng, content);
        if (word) label = word(lr.pick(K.end));
        // A decoy that reads like an end control (another end word, never this episode's label).
        const { collide, cr } = S.frameCollide(_c, label);
        Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { content, display, nav, rng, util } = _c;
        const { TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        if (display !== 'header' || nav) {
          const title = rng.pick(TITLES);
          const brand = util.el('div', 'ref-brand', header, 'Studio');
          brand.dataset.role = 'brand';
        }
        if (nav) {
          const n = util.el('nav', 'ref-nav', header);
          rng.sample(content.NAV_ITEMS, rng.int(3, 5));
          for (const item of ['Projects', 'Create', 'Assets', 'Team', 'Reports']) {
            const a = util.el('a', 'ref-navlink', n, item);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'nav', label: item });
            });
          }
        }
        Object.assign(_c, { header });
      },
    'frame.instruction': (base, S) =>
      function (_c) {
        const { ctx, display, header, util } = _c;
        if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
        else util.el('div', 'ref-spacer', header);

        // Swiss editorial application frame: horizontal tabs and an index of recent records.
        header.classList.add('studio-header');
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { content, ctx, display, header, local, lr, rng, sidebar, util, word } = _c;
        const { K } = S;
        const body = util.el('div', 'ref-body', document.body);
        const records = util.el('aside', 'studio-records', body);
        util.el('h2', 'studio-records-title', records, 'Recent Items');
        const recent = [
          ['Cherry', 'Apr 14, 2016', '#c7353c'],
          ['Ocean', 'Apr 12, 2016', '#2374ad'],
          ['Lime', 'Apr 10, 2016', '#71a83d'],
          ['Sunflower', 'Apr 8, 2016', '#f7c51c'],
          ['Slate', 'Apr 6, 2016', '#778794'],
          ['Violet', 'Apr 3, 2016', '#8960b7'],
          ['Mint', 'Mar 30, 2016', '#59bca7'],
          ['Coral', 'Mar 28, 2016', '#ed7258'],
          ['Sky', 'Mar 25, 2016', '#69c2df'],
          ['Sand', 'Mar 22, 2016', '#cfc3a8'],
        ];
        for (const [title, date, color] of recent) {
          const row = util.el('div', 'studio-record', records);
          const sw = util.el('i', 'studio-record-swatch', row);
          sw.style.background = color;
          const copy = util.el('span', 'studio-record-copy', row);
          util.el('span', 'studio-record-name', copy, title);
          util.el('span', 'studio-record-date', copy, date);
        }
        const main = util.el('div', 'studio-main', body);
        const heading = util.el('div', 'studio-heading', main);
        util.el('h1', 'studio-title', heading, 'New Item');
        if (display === 'header') heading.append(header.querySelector('.ref-instruction'));
        util.el('div', 'studio-rule', main);
        if (sidebar) {
          // Preserve the frame draws without the inherited navigation rail.
          local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
        }
        const workspace = util.el('div', 'studio-workspace', main);
        if (display === 'panel') {
          const panel = util.el('aside', 'ref-panel', workspace);
          const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
          util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
          util.el('div', 'ref-panel-text', panel, ctx.instruction);
          if (rng.bool(0.5)) body.classList.add('ref-panel-right');
        }
        const stage = util.el('main', 'ref-stage', workspace);
        stage.classList.add('studio-stage');
        Object.assign(_c, { body, heading, main, recent, records, stage, workspace });
      },
    'frame.toast': (base, S) =>
      function (_c) {
        const { closeLabel, ctx, display, heading, util } = _c;
        if (display === 'toast') {
          const note = util.el('div', 'ref-note', heading);
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
    'frame.nav': (base, S) => function (_c) {},
    'frame.panel': (base, S) => function (_c) {},
    'frame.stage': (base, S) =>
      function (_c) {
        const { stage } = _c;
        S.frameAlign(_c, stage);
      },
  };

  env.site({
    name: 'design-complete-goals-profile-01',
    template: 'site/base',
    design: { parts },
  });
})();
