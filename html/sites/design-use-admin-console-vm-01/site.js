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
      // Keep every overlay clear of the episode's header and ending controls.
      const headerBottom = document.querySelector('.ref-task').getBoundingClientRect().bottom;
      const bottomSpace = [...document.querySelectorAll('.ref-foot, .ref-float-dock')]
        .reduce((sum, node) => sum + node.getBoundingClientRect().height, 0);
      if (kind === 'cookie') el.style.bottom = `${bottomSpace}px`;
      if (kind === 'chat') el.style.bottom = `${bottomSpace + 20}px`;
      if (kind === 'banner') el.style.top = `${document.querySelector('.ref-instruction')?.getBoundingClientRect().bottom || headerBottom}px`;
      if (kind === 'toast') el.style.top = `${headerBottom}px`;
      if (kind === 'promo') {
        el.style.top = `${document.querySelector('.ref-instruction')?.getBoundingClientRect().bottom || headerBottom}px`;
        el.style.bottom = `${bottomSpace}px`;
      }
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
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
    'frame.header': (base, S) => function (_c) {
      const { content, display, local, nav, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'CloudForge');
        brand.innerHTML = 'Cloud<span>Forge</span>';
        brand.dataset.role = 'brand';
      } else {
        const brand = util.el('div', 'ref-brand', header, 'CloudForge');
        brand.innerHTML = 'Cloud<span>Forge</span>';
        brand.dataset.role = 'brand';
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        for (const item of local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav)) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      } else {
        const n = util.el('nav', 'ref-nav', header);
        for (const item of ['Dashboard', 'Compute', 'Storage', 'Networking', 'Identity', 'Billing', 'Support']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { header });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      const session = util.el('div', 'ref-session', header, 'Logged in as　alex.chen　 |　 Help　 |　 ');
      util.el('span', '', session, 'Sign out');
      Object.assign(_c, { headerTools, session, submit });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, ctx, display, local, lr, rng, sidebar, util, word } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body', document.body);
      if (sidebar) {
        const side = util.el('aside', 'ref-side', body);
        for (const item of local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav)) {
          const a = util.el('a', 'ref-sidelink', side, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
      } else {
        util.el('aside', 'ref-side', body);
      }
      const help = body.querySelector('.ref-side');
      util.el('h2', 'ref-help-title', help, 'Virtual Machines');
      util.el('p', 'ref-help-copy', help, 'Provision and manage virtual machines for your applications and services. Choose an operating system, instance size and network, and deploy in the region that is closest to your users.');
      util.el('h3', 'ref-help-heading', help, 'Tips');
      const tips = util.el('ul', 'ref-help-list', help);
      for (const text of ['Select a region near your users to reduce latency.', 'Choose an instance size that matches your workload.', 'You can attach additional storage after the VM is created.', 'Use tags to help organize and track your resources.']) util.el('li', '', tips, text);
      util.el('h3', 'ref-help-heading ref-learn-heading', help, 'Learn more');
      const links = util.el('div', 'ref-help-links', help);
      for (const text of ['VM sizing guide', 'Supported operating systems', 'Networking overview', 'Tagging best practices', 'Pricing information']) {
        const a = util.el('a', '', links, text); a.href = '#';
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'help', label: text }); });
      }
      if (display === 'panel') {
        const panel = util.el('aside', 'ref-panel', body);
        const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
        util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
        util.el('div', 'ref-panel-text', panel, ctx.instruction);
        if (rng.bool(0.5)) body.classList.add('ref-panel-right');
        help.prepend(panel);
      }
      document.body.classList.toggle('ref-header-note', display === 'header');
      Object.assign(_c, { body, help, links, tips });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, display, header, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      if (display === 'header') {
        stage.cloudForgeInstruction = header.querySelector('.ref-instruction');
        stage.cloudForgeInstruction.remove();
      }
      S.frameAlign(_c, stage);
      Object.assign(_c, { stage });
    },
    'frame.nav': (base, S) => function (_c) {
    },
    'frame.panel': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-admin-console-vm-01',
    template: 'site/base',
    design: { parts },
  });
})();
