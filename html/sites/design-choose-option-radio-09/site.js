(function () {
  'use strict';
  const palette = { bg: '#f8f5ef', panel: '#faf8f3', fg: '#10150e', muted: '#575956', line: '#e1dbcf' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'ds-body', document.body);
      body.addEventListener('click', (e) => {
        const a = e.target.closest && e.target.closest('a[href]');
        if (a && /^#?$/.test(a.getAttribute('href'))) e.preventDefault();
      });
      const content = u.el('div', 'ds-content', body);
      const top = u.el('header', 'ds-top2', content);
      const br = u.el('div', 'ds-brand2', top);
      br.innerHTML =
        '<svg width="34" height="44" viewBox="0 0 34 44" fill="none" stroke="#3d4630" stroke-width="1.4"><path d="M17 43V3M17 23C11 16 10 9 17 1C24 9 23 16 17 23ZM17 36C7 34 3 26 2 16C12 17 18 25 17 36ZM17 36C27 34 31 26 32 16C22 17 16 25 17 36ZM3 17L17 32L31 17"/></svg>';
      const bt = u.el('div', 'ds-brandtxt', br);
      u.el('div', 'ds-brandname', bt, 'Willow & Oak');
      u.el('div', 'ds-brandtag', bt, 'HOME · LIFE · A LITTLE BRIGHTER');
      const steps = u.el('nav', 'ds-steps', top);
      ['CART', 'DELIVERY', 'PAYMENT', 'REVIEW'].forEach((t, i) => {
        if (i) u.el('span', 'ds-sep', steps, '›');
        u.el('span', 'ds-step' + (i === 1 ? ' cur' : ''), steps, t);
      });
      const main = u.el('div', 'ds-main', content);
      Object.assign(_c, { contentEl: content, main, steps, header: main });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-banner');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.steps;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.main;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) {
        note.classList.add('ds-banner', 'ds-panel-note');
        note.querySelector('.ref-panel-title').textContent = 'DELIVERY NOTE';
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        _c.contentEl.insertBefore(note, _c.main);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.contentEl.appendChild(foot);
      foot.querySelector('.ref-foot-text').remove();
      const tools = foot.querySelector('.ref-tools');
      const back = _c.util.el('a', 'ds-back ds-reset', foot, '⟵  Back');
      back.href = '#';
      const save = _c.util.el('button', 'ds-save', foot, 'Save for later');
      save.type = 'button';
      foot.insertBefore(back, tools);
      foot.insertBefore(save, tools);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-choose-option-radio-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-choose-option-radio-09': palette },
      LOW_THEME: palette,
      ACCENTS: ['#454e35'],
      LOW_ACCENTS: ['#454e35'],
      parts,
    },
  });
})();
