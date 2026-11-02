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
      if (kind === 'banner') {
        const header = document.querySelector('.ref-task');
        const anchor = header?.parentElement === document.body ? header : document.querySelector('.cgh-app-toolbar');
        anchor.after(el);
      }
      if (kind === 'chat') {
        const title = util.el('div', 'cgh-chat-title', box, 'Chat with Support');
        title.appendChild(row);
        box.prepend(title);
      }
      // Reserve a footer row for consent so it cannot obscure any task or end control.
      if (kind === 'cookie') {
        const dock = document.querySelector('.ref-foot, .ref-float-dock');
        if (dock) dock.before(el);
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
    'frame.layout': (base, S) => function (_c) {
      const { ctx, util } = _c;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const roomy = W >= 1260;
      const tall = H >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
      const appTitle = util.el('div', 'ehr-titlebar', document.body);
      util.el('span', 'ehr-title-icon', appTitle, '▣');
      util.el('span', 'ehr-title-text', appTitle, 'Riverside Medical Center  -  Patient Chart');
      const winBtns = util.el('span', 'ehr-window-buttons', appTitle);
      for (const glyph of ['_', '□', '×']) util.el('span', 'ehr-window-button', winBtns, glyph);
      const menu = util.el('nav', 'ehr-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Patient', 'Schedule', 'Orders', 'Nursing', 'Reports', 'Window', 'Help']) {
        util.el('span', 'ehr-menu-item', menu, item);
      }
      const toolbar = util.el('div', 'ehr-toolbar', document.body);
      toolbar.classList.add('cgh-app-toolbar');
      for (const icon of ['Patients', 'Appointments', 'Orders', 'Medications', 'Nursing', 'Bed Management', 'Reports']) util.el('span', 'ehr-tool-icon', toolbar, icon);
      Object.assign(_c, { H, W, appTitle, display, menu, roomy, tall, toolbar, winBtns });
    },
    'frame.header': (base, S) => function (_c) {
      const { display, util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      header.classList.toggle('cgh-no-instruction', display !== 'header');
      S.frameBrand(_c, header);
      Object.assign(_c, { header });
    },
    'frame.tools': (base, S) => function (_c) {
      const { W, collide, decoyBtn, decoys, display, endBtn, header, label, placement, toolbar, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      if (display !== 'header') toolbar.appendChild(headerTools);
      if (display === 'header' && W >= 1400) {
        toolbar.classList.add('cgh-with-instruction');
        header.classList.add('cgh-toolbar-task');
        toolbar.appendChild(header);
      }
      Object.assign(_c, { headerTools, submit });
    },
    'frame.footer': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, headerTools, label, lr, placement, rng, util, wantFooter, word } = _c;
      let { submit } = _c;
      if (wantFooter) {
        const foot = util.el('footer', 'ref-foot', document.body);
        const footText = rng.pick(['© 2024 Example Co.', 'All changes are saved automatically.',
          'Need help? Contact your administrator.', 'v4.2.1 · Status: all systems normal']);
        const footStatus = util.el('span', 'ref-foot-text', foot, word ? lr.pick([`© 2024 Example Co. ${word('footRights')}`,
          word('footSaved'), word('footHelp'), `v4.2.1 · ${word('footStatus')}`]) : footText);
        footStatus.textContent = 'City General Hospital';
        const tools = util.el('div', 'ref-tools', foot);
        if (decoys.length > 1) decoyBtn(tools, decoys[1]);
        if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
        if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
        if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
        if (placement !== 'footer' && placement !== 'link') {
          for (const tool of [...tools.children]) headerTools.appendChild(tool);
          foot.remove();
        }
      }
      Object.assign(_c, { submit });
    },
  };

  env.site({
    name: 'design-use-health-records-appointment-05',
    template: 'site/base',
    design: { parts },
  });
})();
