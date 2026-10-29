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
      if(kind==='banner'||kind==='promo') {
        const toolbar=document.querySelector('.ac-toolbar');
        if(toolbar) el.style.top=`${toolbar.getBoundingClientRect().bottom}px`;
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
    'frame.theme': (base, S) => function (_c) {
      const { ctx } = _c;
      const { ACCENTS, LOW_ACCENTS, LOW_THEME, THEMES } = S;
      const { rng, util, content } = ctx;
      let name = rng.pick(Object.keys(THEMES));
      const root = document.documentElement;
      let accent = rng.pick(ACCENTS);
      const tr = rng.fork('chrome/theme');
      if (tr.bool(0.08)) {
        name = 'low';
        accent = tr.pick(LOW_ACCENTS);
      }
      // This design is the dark developer calendar in the reference image.
      name = 'dark';
      accent = '#63ee72';
      for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name])) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', accent);
      root.dataset.theme = name;
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const dock = util.el('nav', 'calendar-dock', document.body);
      const dockIcons = {
        Calendar:'M5 5h14a1 1 0 0 1 1 1v15H4V6a1 1 0 0 1 1-1M4 10h16M8 2v6M16 2v6M8 14h3M8 18h6',
        Tasks:'M20 11v10H3V4h13M7 10l4 4L22 2',
        Projects:'M3 6h7l2 2h9v13H3zM3 6V3h7l2 2h7v3',
        People:'M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8M2 21v-3a6 6 0 0 1 12 0v3M17 4a4 4 0 0 1 0 8M18 15a5 5 0 0 1 4 5',
        Reports:'M12 3a9 9 0 1 0 9 9h-9zM14 2v8h8M12 12l-6 7M12 12l3 8',
        search:'M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
        bell:'M5 17h14l-2-3V9a5 5 0 0 0-10 0v5l-2 3M10 21h4',
        settings:'M9 3h6l1 3 3 1 2 5-2 2v4l-4 3-3-2-3 2-4-3v-4l-2-2 2-5 3-1zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8',
      };
      const dockIcon=(parent,name)=>{const svg=util.svg('svg',{viewBox:'0 0 24 24',class:'calendar-dock-icon','aria-hidden':'true'},parent);util.svg('path',{d:dockIcons[name]},svg);return svg;};
      const dockItems = [['', 'Calendar'], ['', 'Tasks'], ['', 'Projects'], ['', 'People'], ['', 'Reports']];
      for (const [icon, text] of dockItems) {
        const item = util.el('div', `calendar-dock-item${text === 'Calendar' ? ' active' : ''}`, dock);
        dockIcon(item,text);
        util.el('span', '', item, text);
      }
      const dockTools = util.el('div', 'calendar-dock-tools', dock);
      dockIcon(dockTools,'search');
      const bell=util.el('span','calendar-dock-bell',dockTools);
      dockIcon(bell,'bell');
      dockIcon(dockTools,'settings');
      Object.assign(_c, { bell, dock, dockIcon, dockIcons, dockItems, dockTools, stage });
    },
    'frame.floating': (base, S) => function (_c) {
      const { dock, dockTools, endBtn, label, placement, util } = _c;
      let { submit } = _c;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      const footer=document.querySelector('.ref-foot');
      if(footer) {const tools=footer.querySelector('.ref-tools');dock.insertBefore(tools,dockTools);tools.classList.add('calendar-end-tools');footer.hidden=true;}
      const floating=document.querySelector('.ref-float-dock');
      if(floating) {submit.classList.remove('ref-float');dock.insertBefore(submit,dockTools);submit.classList.add('calendar-end-tools');floating.hidden=true;}
      Object.assign(_c, { floating, footer, submit });
    },
  };

  env.site({
    name: 'design-use-calendar-move-05',
    template: 'site/base',
    design: { parts },
  });
})();
