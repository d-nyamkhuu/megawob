// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    overlay: (base, S) => function overlay(ctx) {
      const { K } = S;
      const { rng, util, kind } = ctx;
      const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
      const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
      const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
      el.dataset.role = 'overlay';
      if (kind === 'banner') {
        const header = document.querySelector('.ref-task');
        document.body.append(el);
        el.style.top = `${header.getBoundingClientRect().height}px`;
      }
      const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
      let contentBox = box;
      if (kind === 'promo') {
        const art = util.svg('svg', {viewBox:'0 0 240 240', class:'paper-promo-art', 'aria-hidden':'true'}, box);
        util.svg('path', {d:'M37 68C30 19 105 9 141 43S224 66 207 119 234 195 157 204 22 196 28 143 45 111 37 68', fill:'#d9eaff'}, art);
        util.svg('circle', {cx:51, cy:52, r:17, fill:'#a9cfff'}, art);
        util.svg('path', {d:'M27 119 120 49 213 119v99H27z', fill:'#1977f7'}, art);
        util.svg('rect', {x:52, y:76, width:136, height:116, rx:6, fill:'#fff'}, art);
        util.svg('path', {d:'M73 103h94M73 122h94M73 141h69', fill:'none', stroke:'#c9e0ff', 'stroke-width':9}, art);
        util.svg('path', {d:'m27 119 93 66 93-66v99H27z', fill:'#0863e5'}, art);
        util.svg('path', {d:'m27 218 79-63h28l79 63', fill:'#1976f1'}, art);
        contentBox = util.el('div', 'paper-promo-content', box);
        util.el('strong', 'paper-promo-title', contentBox, 'Stay in the loop');
      } else if (kind === 'chat') {
        util.el('strong', 'paper-chat-title', box, 'Hi there!');
      }
      util.el('div', 'ref-ov-text', contentBox, word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text);
      if (kind === 'promo') {
        const email = util.el('input', 'paper-promo-email', contentBox);
        email.type = 'text'; email.placeholder = 'Your email address'; email.setAttribute('aria-label', 'Your email address');
      }
      const row = util.el('div', 'ref-ov-row', contentBox);
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
        dismiss.title = dismiss.textContent; dismiss.setAttribute('aria-label', dismiss.textContent);
        dismiss.textContent = '×'; dismiss.classList.add('paper-promo-close'); box.append(dismiss);
      }
      if (kind === 'chat') {
        const message = util.el('input', 'paper-chat-input', box);
        message.type = 'text'; message.placeholder = 'Type a message...'; message.setAttribute('aria-label', 'Type a message');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const product = util.el('div', 'paper-product', header);
      const logo = util.svg('svg', {viewBox: '0 0 32 36', width: 30, height: 36, 'aria-hidden': 'true'}, product);
      util.svg('path', {d: 'M4 1h16l9 9v24H4z', fill: '#fff'}, logo);
      util.svg('path', {d: 'M20 1v10h9M9 17h15M9 22h15M9 27h10', fill: 'none', stroke: '#31519e', 'stroke-width': 2}, logo);
      util.el('span', '', product, 'Form Builder');
      const productNav = util.el('div', 'paper-product-nav', header);
      for (const text of ['Forms', 'Responses', 'Settings']) {
        const b = util.el('button', text === 'Forms' ? 'active' : '', productNav, text);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', {what: 'nav', label: text}));
      }
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      const search = util.el('button', 'paper-search', headerTools);
      search.type = 'button';
      search.title = 'Search';
      search.setAttribute('aria-label', 'Search');
      const searchIcon = util.svg('svg', {viewBox: '0 0 24 24', width: 28, height: 28, 'aria-hidden': 'true'}, search);
      util.svg('path', {d: 'M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0M15 15l7 7', fill: 'none', stroke: 'currentColor', 'stroke-width': 2.2}, searchIcon);
      search.addEventListener('click', () => env.log('decoy', {label: 'Search'}));
      const profile = util.el('button', 'paper-profile', headerTools, 'JD');
      profile.type = 'button';
      profile.title = 'Profile';
      profile.setAttribute('aria-label', 'Profile');
      profile.addEventListener('click', () => env.log('decoy', {label: 'Profile'}));
      // Keep the sampled toolbar actions and their click handlers as icon controls.
      const iconActions = [...headerTools.querySelectorAll('.ref-xtra')];
      iconActions.forEach((button, i) => {
        const text = button.textContent;
        button.title = text; button.setAttribute('aria-label', text);
        button.replaceChildren();
        if (i === 0) {
          button.classList.add('paper-search'); button.append(searchIcon.cloneNode(true)); search.remove();
        } else if (i === 1) {
          button.classList.add('paper-profile'); button.textContent = 'JD'; profile.remove();
        } else { button.classList.add('paper-overflow'); button.textContent = '⋮'; }
      });
      Object.assign(_c, { headerTools, iconActions, logo, product, productNav, profile, search, searchIcon, submit });
    },
  };

  env.site({
    name: 'design-use-form-builder-validation-03',
    template: 'site/base',
    design: { parts },
  });
})();
