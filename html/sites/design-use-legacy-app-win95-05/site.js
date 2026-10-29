// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    endLabel: (base, S) => function (rng, content) {
      const chosen = base(rng, content);
      return rng.fork('mac/end-label').bool(0.5) ? 'Confirm' : chosen;
    },
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
    'frame.header': (base, S) => function (_c) {
      base(_c);
      const brand = _c.header.querySelector('.ref-brand') || _c.util.el('div', 'ref-brand', _c.header);
      brand.textContent = 'Enterprise Manager';
    },
    'frame.nav': (base, S) => function (_c) {
      base(_c);
      const old = _c.header.querySelector('.ref-nav');
      if (old) old.remove();
      const nav = _c.util.el('nav', 'mac-top-nav');
      const items = [
        ['Home', 'M2 10 12 2l10 8h-2v11h-6v-7h-4v7H4V10z'],
        ['Records', 'M3 3h4v4H3z M10 3h12v4H10z M3 10h4v4H3z M10 10h12v4H10z M3 17h4v4H3z M10 17h12v4H10z'],
        ['Reporting', 'M2 16h5v6H2z M9 11h5v11H9z M16 3h5v19h-5z'],
        ['Administration', 'M10 1h4l.6 3 2.4 1 2.6-1.5 2.8 2.8L21 9l1 2 2 1v4l-3 1-.9 2.3 1.4 2.6-2.8 2.8-2.6-1.4-2.3 1H10l-1-3-2.3-.9-2.6 1.4-2.8-2.8 1.4-2.6L2 17l-3-1v-4l3-1L3 9 1.5 6.4l2.8-2.8L7 5l2.4-1z M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'],
        ['Help', 'M12 1a11 11 0 1 0 0 22 11 11 0 0 0 0-22z M12 18.8a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4z M15.9 9.3c0 2-1.2 2.9-2.3 3.7-.7.5-.9.9-.9 1.8h-1.9c0-1.5.4-2.2 1.4-2.9 1-.7 1.7-1.3 1.7-2.5 0-1.3-.8-2-2-2-1.1 0-1.9.6-2.1 2H7.8c.2-2.4 1.9-3.9 4.2-3.9 2.4 0 3.9 1.4 3.9 3.8z'],
      ];
      for (const [label, path] of items) {
        const button = _c.util.el('button', label === 'Records' ? 'mac-nav-item active' : 'mac-nav-item', nav);
        button.type = 'button';
        const holder = _c.util.el('span', 'mac-nav-icon', button);
        const icon = _c.util.svg('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true' }, holder);
        _c.util.svg('path', { d: path, fill: 'currentColor' }, icon);
        _c.util.el('span', '', button, label);
        button.addEventListener('click', () => env.log('nav', { label }));
      }
      _c.header.after(nav);
      _c.macNav = nav;
    },
    'frame.instruction': (base, S) => function (_c) {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) _c.macNav.after(note);
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
    name: 'design-use-legacy-app-win95-05',
    template: 'site/base',
    design: { parts },
  });
})();
