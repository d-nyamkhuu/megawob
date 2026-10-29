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
      const header = document.querySelector('.ref-task');
      const headerBottom = header && !header.hidden ? header.getBoundingClientRect().bottom : 40;
      const footer = document.querySelector('.ref-foot:not([hidden]), .ref-float-dock');
      const bottomInset = footer ? Math.ceil(footer.getBoundingClientRect().height) : 0;
      if (kind === 'cookie' || kind === 'chat') el.style.bottom = (bottomInset + 18) + 'px';
      if (kind === 'banner' || kind === 'promo') el.style.top = Math.ceil(headerBottom) + 'px';
      if (kind === 'promo') el.style.bottom = bottomInset + 'px';
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
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
      document.body.dataset.instruction = display;
      Object.assign(_c, { H, W, display, roomy, tall });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const winbar = util.el('div', 'qt-titlebar', document.body);
      winbar.textContent = 'People Operations';
      const winbuttons = util.el('span', 'qt-window-buttons', winbar);
      winbuttons.textContent = '−  □  ×';
      const menubar = util.el('div', 'qt-menubar', document.body);
      menubar.textContent = 'File　 Edit　 View　 People　 Tools　 Reports　 Help';
      const rail = util.el('nav', 'qt-rail', document.body);
      for (const [icon, label] of [['⌂','Home'],['♧','Recruiting'],['♟','People'],['▣','Time Off'],['▥','Performance'],['▤','Compensation'],['▤','Reporting'],['⚙','Admin']]) {
        const item = util.el('div', `qt-rail-item${label === 'People' ? ' selected' : ''}`, rail);
        util.el('span', 'qt-rail-icon', item, icon);
        util.el('span', '', item, label);
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { header, menubar, rail, winbar, winbuttons });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const inspector = util.el('aside', 'hr-inspector', body);
      util.el('h2', '', inspector, 'Employee Details');
      for (const [label, value] of [['Employee ID', 'EMP-1043'], ['Department', 'Product Design'],
        ['Manager', 'Olivia Brooks'], ['Location', 'San Francisco, CA'], ['Employment type', 'Full-time'],
        ['Hire date', 'Mar 14, 2022']]) {
        const field = util.el('div', 'hr-inspector-field', inspector);
        util.el('div', 'hr-inspector-label', field, label);
        util.el('div', 'hr-inspector-value', field, value);
      }
      Object.assign(_c, { inspector, stage });
    },
    'frame.floating': (base, S) => function (_c) {
      const { body, collide, decoys, display, endBtn, header, headerTools, inspector, label, placement, util, wantFooter, winbar } = _c;
      let { submit } = _c;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      // Put compact native controls in the title bar when no header note is present.
      if (display !== 'header') {
        winbar.appendChild(headerTools);
        headerTools.classList.add('titlebar-tools');
        header.hidden = true;
      }
      if (display === 'panel') {
        const panel = body.querySelector('.ref-panel');
        if (panel) inspector.appendChild(panel);
      }
      if (display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        if (note) inspector.appendChild(note);
      }
      body.classList.remove('ref-panel-right');
      if (wantFooter && !['footer', 'link'].includes(placement) && !(collide && collide.where === 'footer') && decoys.length < 2) {
        document.body.querySelector('.ref-foot').hidden = true;
      }
      Object.assign(_c, { submit });
    },
  };

  env.site({
    name: 'design-use-hr-timeoff-03',
    template: 'site/base',
    design: { parts },
  });
})();
