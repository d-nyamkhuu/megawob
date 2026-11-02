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
    'frame.placement': (base, S) => function (_c) {
      base(_c);
      _c.decoys = [];
      if (_c.ctx.finish) _c.collide = null;
      if (!_c.ctx.finish) {
        const choice = _c.ctx.rng.fork('iam/notebook-end');
        if (choice.bool(0.52)) {
          _c.placement = 'footer';
          _c.wantFooter = true;
          _c.label = 'Confirm';
        } else if (_c.placement === 'floating') {
          _c.placement = 'footer';
          _c.wantFooter = true;
        }
      }
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const instruction = document.querySelector('.ref-task .ref-instruction');
      if (instruction) body.append(instruction);
      const appRail = util.el('nav', 'iam-rail', body);
      const railItems = [['⌂','Overview'],['♙','Accounts'],['♧','Groups'],['▤','Licences'],['▣','Devices'],['▥','Billing'],['⚙','Settings']];
      const railPaths = {
        Overview: 'm2 10 10-8 10 8M5 9v12h5v-7h4v7h5V9',
        Accounts: 'M9 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM2 21v-4c0-6 14-6 14 0v4ZM18 3a3 3 0 1 1 0 6M17 13c4 0 5 2 5 5v3h-4',
        Groups: 'M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM19 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM2 20v-2c0-6 13-6 13 0v2M15 14c5-1 7 1 7 5h-4',
        Devices: 'M3 3h18v14H3zM8 21h8M12 17v4',
        Licences: 'M5 2h11l4 4v16H5zM15 2v5h5M8 11h9M8 15h9M8 19h7',
        Billing: 'M3 5h18v15H3zM3 9h18M6 15h7',
        Settings: 'm10 2 4 0 1 4 3-1 3 3-2 3 3 1v4l-4 1 1 3-3 2-3-2-3 2-3-3 2-3-4-1v-4l4-1-1-3 3-2 3 2ZM16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
      };
      const railIcon = (parent, text) => {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('aria-hidden', 'true');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', railPaths[text]); svg.append(path); parent.append(svg);
      };
      for (const [icon, text] of railItems) {
        const item = util.el('div', `iam-rail-item${text === 'Accounts' ? ' is-current' : ''}`, appRail);
        railIcon(util.el('span', 'iam-rail-icon', item), text);
        util.el('span', '', item, text);
      }
      const groups = util.el('aside', 'iam-groups', body);
      util.el('h2', '', groups, 'Groups');
      const groupLists = [
        [['All users','24'],['Administrators','4'],['Operators','8'],['Viewers','6'],['Unassigned','2']],
        [['Engineering','7'],['Finance','4'],['HR','3'],['IT Support','4'],['Marketing','3'],['Product','3']]
      ];
      for (const list of groupLists) {
        const section = util.el('div', 'iam-group-section', groups);
        for (const [label, count] of list) {
          const item = util.el('div', `iam-group-item${label === 'All users' ? ' is-current' : ''}`, section);
          util.el('span', '', item, label); util.el('span', '', item, count);
        }
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { appRail, body, railIcon, railItems, railPaths });
    },
  };

  env.site({
    name: 'design-use-admin-console-iam-05',
    template: 'site/base',
    design: { TITLES, parts },
  });
})();
