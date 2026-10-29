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
      for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name])) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', accent);
      root.dataset.theme = name;
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      stage.style.setProperty('position', 'absolute', 'important');
      stage.style.setProperty('left', '0', 'important');
      stage.style.setProperty('top', '0', 'important');
      stage.style.setProperty('width', '100%', 'important');
      stage.style.setProperty('height', '100%', 'important');
      stage.style.setProperty('min-width', '0', 'important');
      stage.style.setProperty('right', 'auto', 'important');
      stage.style.setProperty('bottom', 'auto', 'important');
      S.frameAlign(_c, stage);
      Object.assign(_c, { stage });
    },
    'frame.floating': (base, S) => function (_c) {
      const { display, endBtn, header, headerTools, label, placement, util, wantFooter } = _c;
      let { submit } = _c;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      // Native application frame; the episode controls above retain their sampled forms.
      document.body.dataset.instruction = display;
      document.body.classList.toggle('med-has-footer', wantFooter || placement === 'floating');
      const titlebar = util.el('div', 'med-titlebar', document.body);
      util.el('span', 'med-app-icon', titlebar, '⋈');
      util.el('strong', '', titlebar, 'MediCare – Patient Record');
      const titleNote = header.querySelector('.ref-instruction');
      if (titleNote) titlebar.appendChild(titleNote);
      const gadgets = util.el('div', 'med-window-gadgets', titlebar);
      for (const symbol of ['_', '▣', '×']) util.el('span', '', gadgets, symbol);
      const menu = util.el('div', 'med-menubar', header);
      for (const text of ['File', 'Edit', 'View', 'Patient', 'Orders', 'Medications', 'Nursing', 'Bed Management', 'Window', 'Help']) util.el('span', '', menu, text);
      const iconbar = util.el('div', 'med-iconbar', header);
      const icons = {
        Patients: '<path fill="#e3ba38" d="M2 10h8l3-4h11v17H2z"/><path fill="#ffe183" d="M3 12h24l-5 13H1z"/><path d="M8 5h12v3H8z" fill="#fff4a1"/>',
        Schedule: '<path fill="#fff" d="M3 5h24v22H3z"/><path fill="#d34141" d="M3 5h24v5H3z"/><path d="M8 2v6m14-6v6M7 14h3m4 0h3m4 0h3M7 19h3m4 0h3m4 0h3M7 24h3m4 0h3m4 0h3"/>',
        Orders: '<path fill="#fff" d="M6 3h18v25H6z"/><path fill="#b8cad4" d="M12 1h7v5h-7z"/><path d="M9 10h3m3 0h6M9 15h3m3 0h6M9 20h3m3 0h6M9 25h3m3 0h6"/>',
        Medications: '<g transform="rotate(37 15 15)"><rect x="4" y="3" width="10" height="23" rx="5" fill="#e03532"/><path d="M4 15h10v6a5 5 0 0 1-10 0z" fill="#dedede"/><rect x="16" y="8" width="10" height="19" rx="5" fill="#e3e9ed"/><path d="M16 17h10v-4a5 5 0 0 0-10 0z" fill="#427cad"/></g>',
        Flowsheets: '<path fill="#fff" d="M2 3h26v25H2z"/><path fill="#3b74a6" d="M2 3h26v5H2z"/><path d="M7 12v12m7-12v12m7-12v12M4 16h21M4 21h21" stroke="#888"/><path d="m7 23 5-9 4 4 7-7" stroke="#263e6c"/>',
        Beds: '<path fill="#cedce9" d="M3 13h25v11H3z"/><path fill="#477cb7" d="M11 9h16v11H11z"/><path fill="#fff" d="M4 8h6v9H4z"/><path d="M2 3v25m26-17v17M2 22h26" stroke-width="2"/>'
      };
      for (const [text, drawing] of Object.entries(icons)) {
        const item = util.el('span', `med-iconitem${text === 'Medications' ? ' active' : ''}`, iconbar);
        const icon = util.el('span', 'med-toolbar-icon', item);
        icon.innerHTML = `<svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#17212a" stroke-width="1.4">${drawing}</svg>`;
        util.el('span', '', item, text);
      }
      iconbar.appendChild(headerTools);
      Object.assign(_c, { gadgets, iconbar, icons, menu, submit, titleNote, titlebar });
    },
  };

  env.site({
    name: 'design-use-health-records-medrec-04',
    template: 'site/base',
    design: { parts },
  });
})();
