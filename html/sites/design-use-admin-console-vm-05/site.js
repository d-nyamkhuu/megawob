// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    endLabel: (base) => function (rng, content) {
      const label = base(rng, content);
      return rng.fork('aqua/end-label').bool(0.5) ? 'Apply' : label;
    },
    'frame.placement': (base) => function (_c) {
      base(_c);
      if (_c.ctx.finish) {
        _c.collide = null;
        _c.decoys = [];
      } else {
        _c.placement = _c.rng.fork('aqua/end-place').pick(['footer', 'footer', 'footer', 'header', 'icon', 'link', 'floating']);
        _c.wantFooter = _c.placement === 'footer' || _c.placement === 'link';
      }
    },
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
      if (display !== 'header' || nav) rng.pick(TITLES);
      const menu = util.el('div', 'aqua-menu', header);
      util.el('span', 'aqua-apple', menu, '●');
      for (const item of ['Cloud Console', 'File', 'Edit', 'View', 'Actions', 'Window', 'Help'])
        util.el('span', item === 'Cloud Console' ? 'aqua-appname' : '', menu, item);
      util.el('span', 'aqua-menu-right', menu, '◉   Mon Apr 16   10:24 AM');
      const titlebar = util.el('div', 'aqua-titlebar', header);
      const lights = util.el('div', 'aqua-lights', titlebar);
      for (const color of ['red', 'yellow', 'green']) util.el('i', color, lights);
      const brand = util.el('div', 'ref-brand', titlebar, 'Cloud Console');
      brand.dataset.role = 'brand';
      const search = util.el('div', 'aqua-search', titlebar);
      util.el('span', '', search, '⌕');
      const input = util.el('input', '', search);
      input.placeholder = 'Search'; input.setAttribute('aria-label', 'Search');
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
      Object.assign(_c, { headerTools, submit });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, ctx, display, local, lr, rng, sidebar, util, word } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body', document.body);
      const side = util.el('aside', 'ref-side', body);
      if (sidebar) local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
      const symbols = {
        Overview:'<path d="M3 17 18 4 33 17" fill="none" stroke="#8a4a0c" stroke-width="3"/><path d="M7 16 18 7 29 16v16H7z" fill="#d69b45" stroke="#70461a"/><path d="M12 17h12v15H12z" fill="#f5e6c9"/><path d="M16 24h5v8h-5z" fill="#704622"/>',
        Compute:'<rect x="5" y="3" width="26" height="9" rx="1" fill="#cddbe5" stroke="#58728b"/><rect x="5" y="13" width="26" height="9" rx="1" fill="#b9cedd" stroke="#58728b"/><rect x="5" y="23" width="26" height="9" rx="1" fill="#9eb6ca" stroke="#58728b"/><path d="M8 8h13M8 18h13M8 28h13" stroke="#f7fcff" stroke-width="2"/><circle cx="26" cy="8" r="2" fill="#4bd84a"/><circle cx="26" cy="18" r="2" fill="#4bd84a"/><circle cx="26" cy="28" r="2" fill="#4bd84a"/>',
        Storage:'<ellipse cx="18" cy="7" rx="12" ry="4" fill="#eaf3fb" stroke="#6c8298"/><path d="M6 7v20c0 5 24 5 24 0V7" fill="#b7cbdc" stroke="#6c8298"/><path d="M6 14c1 5 23 5 24 0M6 21c1 5 23 5 24 0" fill="none" stroke="#748da3"/><ellipse cx="18" cy="7" rx="12" ry="4" fill="#e5eff8" stroke="#6c8298"/>',
        Networks:'<circle cx="18" cy="18" r="15" fill="#2c84d4" stroke="#2a5596"/><path d="M9 7c5 2 4 6 1 9l5 4-1 7-5-2-3-7M22 5l3 5-5 3 4 5-4 6 4 6M18 3c-5 9-5 21 0 30M3 18h30" fill="none" stroke="#d4f5ff" stroke-width="2"/>',
        Identity:'<circle cx="12" cy="11" r="5" fill="#73b4f2" stroke="#376295"/><circle cx="25" cy="12" r="5" fill="#d4a17d" stroke="#775744"/><path d="M3 29c0-8 3-11 9-11s9 3 9 11v3H3z" fill="#2e8ae0" stroke="#245a9a"/><path d="M17 32v-5c0-6 3-9 8-9s8 4 8 10v4z" fill="#477cc0" stroke="#355b86"/>',
        Monitoring:'<rect x="3" y="4" width="30" height="27" rx="2" fill="#edf7fc" stroke="#607f9a"/><path d="M6 25h24M7 23l5-7 4 5 5-10 4 7 5-4" fill="none" stroke="#188fcb" stroke-width="2"/><path d="M6 8h24" stroke="#b8d1e1"/>',
        Billing:'<path d="M7 3h17l5 6v24H7z" fill="#edf5fb" stroke="#6f8fac"/><path d="M23 3v7h6M11 15h14M11 19h14M11 23h10M11 27h12" fill="none" stroke="#89a7bc"/><path d="M24 25h5v6h-5z" fill="#60a5da"/>',
        Support:'<circle cx="18" cy="18" r="15" fill="#ee5b22" stroke="#98622b"/><circle cx="18" cy="18" r="8" fill="#e8f5ff" stroke="#647d93"/><path d="M9 7l5 5M27 7l-5 5M9 29l5-5M27 29l-5-5" stroke="#fff" stroke-width="6"/>'
      };
      for (const item of ['Overview','Compute','Storage','Networks','Identity','Monitoring','Billing','Support']) {
        const a = util.el('a', 'ref-sidelink', side);
        const icon = util.el('span', 'nav-icon', a);
        icon.innerHTML = `<svg viewBox="0 0 36 36" aria-hidden="true">${symbols[item]}</svg>`;
        util.el('span', '', a, item);
        a.dataset.role = 'nav';
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
      }
      const help = util.el('aside', 'ref-help', body);
      const helpHead = util.el('div', 'ref-help-head', help);
      util.el('span', 'help-badge', helpHead, '?');
      util.el('strong', '', helpHead, 'Help & Tips');
      util.el('span', 'help-end', helpHead, '?');
      const helpContent = util.el('div', 'ref-help-content', help);
      util.el('h2', 'ref-help-title', helpContent, 'Regions');
      util.el('p', 'ref-help-copy', helpContent, 'A region is a geographic area that hosts a set of isolated infrastructure resources. Choose the region closest to your users to reduce latency and improve performance.');
      util.el('h3', 'ref-help-heading', helpContent, 'Available Regions');
      const tips = util.el('div', 'ref-help-list', helpContent);
      for (const [name, desc] of [['East Harbor','Primary region in the eastern US.'],['West Ridge','Western US region.'],['North Valley','Canada region.'],['Southreach','South America region.'],['Euro Central','Europe region.'],['Asia Pacific','Asia region.']]) {
        util.el('strong', '', tips, name); util.el('span', '', tips, desc);
      }
      util.el('h3', 'ref-help-heading ref-learn-heading', helpContent, 'More Information');
      const links = util.el('div', 'ref-help-links', helpContent);
      for (const text of ['About regions', 'Data residency', 'Pricing by region']) {
        const a = util.el('a', '', links, text); a.href = '#';
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'help', label: text }); });
      }
      if (display === 'panel') {
        const panel = util.el('aside', 'ref-panel', helpContent);
        const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
        util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
        util.el('div', 'ref-panel-text', panel, ctx.instruction);
        if (rng.bool(0.5)) body.classList.add('ref-panel-right');
        helpContent.prepend(panel);
      }
      document.body.classList.toggle('ref-header-note', display === 'header');
      Object.assign(_c, { body, help, links, tips });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, display, header, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      const heading = util.el('div', 'compute-heading', stage);
      util.el('span', 'server-icon', heading, '▤');
      util.el('strong', '', heading, 'Compute');
      if (display === 'header') {
        stage.cloudForgeInstruction = header.querySelector('.ref-instruction');
        stage.cloudForgeInstruction.remove();
        heading.append(stage.cloudForgeInstruction);
      }
      const back = util.el('div', 'compute-background', stage);
      const tabs = util.el('div', 'compute-tabs', back);
      for (const text of ['Instances', 'Images', 'Instance Types', 'Key Pairs']) util.el('span', '', tabs, text);
      const tableBox = util.el('div', 'instance-box', back);
      util.el('div', 'instance-caption', tableBox, 'Instances');
      const table = util.el('table', 'instance-table', tableBox);
      const tr = util.el('tr', '', table); for (const h of ['Name','Status','Type','Region']) util.el('th', '', tr, h);
      for (const [name,status] of [['web-01','Running'],['web-02','Running'],['app-01','Stopped'],['db-01','Running'],['test-01','Running'],['staging-01','Stopped']]) {
        const row = util.el('tr', '', table);
        util.el('td', '', row, name);
        const cell = util.el('td', '', row); util.el('i', status.toLowerCase(), cell); util.el('span', '', cell, status);
        util.el('td', '', row, 'c2.small'); util.el('td', '', row, 'East Harbor');
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
    name: 'design-use-admin-console-vm-05',
    template: 'site/base',
    design: { parts },
  });
})();
