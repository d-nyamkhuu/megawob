// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';


  const TITLES = ['Northstar Admin Console'];

  const parts = {
    overlay: (base, S) => function overlay(ctx) {
      const { K } = S;
      const { rng, util, kind } = ctx;
      const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
      const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
      const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
      el.dataset.role = 'overlay';
      const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
      util.el('div', 'ref-ov-text', box, word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text);
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
      const headerBox = document.querySelector('.ref-task').getBoundingClientRect();
      const endBox = document.querySelector('[data-role="submit"]')?.getBoundingClientRect();
      const lowerClearance = endBox && endBox.top > window.innerHeight / 2 ? window.innerHeight - endBox.top + 12 : 0;
      if (kind === 'banner' || kind === 'toast') el.style.top = `${headerBox.bottom + (kind === 'toast' ? 12 : 0)}px`;
      if (kind === 'cookie' || kind === 'chat') el.style.bottom = `${Math.max(kind === 'chat' ? 20 : 0, lowerClearance)}px`;
      if (kind === 'promo') { el.style.top = `${headerBox.bottom}px`; el.style.bottom = `${lowerClearance}px`; }
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
    'frame.layout': (base, S) => function (_c) {
      const { ctx } = _c;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const roomy = W >= 1260;
      const tall = H >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      document.body.dataset.instructionDisplay = display;
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
      Object.assign(_c, { H, W, display, roomy, tall });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);
      if (!header.querySelector('.ref-brand')) util.el('div', 'ref-brand iam-fixed-brand', header, 'Northstar Admin Console');
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const appRail = util.el('aside', 'iam-rail', body);
      util.el('div', 'iam-mark', appRail, '✦');
      util.el('div', 'iam-wordmark', appRail, 'Northstar');
      const railItems = [['⌂','Home'],['♙','Directory'],['♧','Groups'],['▣','Devices'],['▦','Applications'],['▤','Licences'],['♢','Roles'],['▥','Billing'],['▱','Reports']];
      const railPaths = {
        Home: 'm2 10 10-8 10 8M5 9v12h5v-7h4v7h5V9',
        Directory: 'M16 6a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM3 21c0-8 18-8 18 0H3Z',
        Groups: 'M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM19 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM2 20v-2c0-6 13-6 13 0v2M15 14c5-1 7 1 7 5h-4',
        Devices: 'M3 3h18v14H3zM8 21h8M12 17v4',
        Applications: 'M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h6v6h-6z',
        Licences: 'M3 4h18v16H3zM3 8h18M7 13h3M7 16h5',
        Roles: 'm12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6l8-4Z',
        Billing: 'M3 20v-8h4v8ZM10 20V3h4v17ZM17 20V8h4v12Z',
        Reports: 'M5 2h9l5 5v15H5zM14 2v6h5',
        Settings: 'm10 2 4 0 1 4 3-1 3 3-2 3 3 1v4l-4 1 1 3-3 2-3-2-3 2-3-3 2-3-4-1v-4l4-1-1-3 3-2 3 2ZM16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
        Support: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0ZM9 8c0-4 7-4 6 0 0 2-3 2-3 5M12 17v1',
      };
      const railIcon = (parent, text) => {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('aria-hidden', 'true');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', railPaths[text]); svg.append(path); parent.append(svg);
      };
      for (const [icon, text] of railItems) {
        const item = util.el('div', `iam-rail-item${text === 'Directory' ? ' is-current' : ''}`, appRail);
        railIcon(util.el('span', 'iam-rail-icon', item), text);
        util.el('span', '', item, text);
      }
      util.el('div', 'iam-rail-rule', appRail);
      for (const [icon, text] of [['⚙','Settings'],['ⓘ','Support']]) {
        const item = util.el('div', 'iam-rail-item', appRail);
        railIcon(util.el('span', 'iam-rail-icon', item), text);
        util.el('span', '', item, text);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { appRail, body, railIcon, railItems, railPaths });
    },
  };

  env.site({
    name: 'design-use-admin-console-iam-01',
    template: 'site/base',
    design: { TITLES, parts },
  });
})();
