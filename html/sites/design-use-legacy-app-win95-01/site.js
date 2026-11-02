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
      // Native accessory panels. These decorations consume no episode randomness.
      if (kind === 'cookie') {
        util.el('span', 'ref-cookie-icon', el, '◉');
      }
      if (kind === 'chat' || kind === 'promo') {
        const heading = util.el('h2', 'ref-overlay-title', box, kind === 'chat' ? 'How can we help?' : 'Get the latest updates');
        box.prepend(heading);
        const input = util.el('input', 'ref-overlay-input', box);
        input.type = kind === 'chat' ? 'text' : 'email';
        input.placeholder = kind === 'chat' ? 'Type a message…' : 'Enter your email address';
        input.setAttribute('aria-label', kind === 'chat' ? 'Message' : 'Email address');
        row.before(input);
      }
      if (kind === 'banner') {
        // Keep the obstruction out of page flow so it cannot move task anchors.
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
    'frame.theme': (base, S) => function (_c) {
      const { ctx } = _c;
      const { ACCENTS, LOW_ACCENTS, THEMES } = S;
      const { rng, util, content } = ctx;
      let name = rng.pick(Object.keys(THEMES));
      const root = document.documentElement;
      let accent = rng.pick(ACCENTS);
      const tr = rng.fork('chrome/theme');
      if (tr.bool(0.08)) {
        name = 'low';
        accent = tr.pick(LOW_ACCENTS);
      }
      for (const [k, v] of Object.entries(THEMES.light)) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', '#0878f9');
      root.dataset.theme = 'light';
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.body': (base, S) => function (_c) {
      const { display, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      body.dataset.instructionMode = display;
      S.frameSidebar(_c, body);
      Object.assign(_c, { body });
    },
    'frame.floating': (base, S) => function (_c) {
      const { body, endBtn, label, placement, util } = _c;
      let { submit } = _c;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      // Keep the original episode draws and controls, with the note beside the workbench.
      const taskPanel = body.querySelector('.ref-panel');
      if (taskPanel) body.append(taskPanel);
      Object.assign(_c, { submit, taskPanel });
    },
  };

  env.site({
    name: 'design-use-legacy-app-win95-01',
    template: 'site/base',
    design: { parts },
  });
})();
