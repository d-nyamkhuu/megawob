(function () {
  'use strict';
  const C = {
    site: 'design-find-fact-table-07',
    brand: 'The Daily Chronicle',
    tag: 'TRUSTED NEWS|FOR A BRIGHTER TOMORROW',
    date: 'Tuesday, March 15, 2011',
    title: 'Community Volunteers',
    sub: 'Match the details from the table below.',
  };
  const palette = { bg: '#f6f4f0', panel: '#f6f4f0', fg: '#1a1a1a', muted: '#444', line: '#b9b5ad' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const page = u.el('div', 'ds-page', document.body);
      const mast = u.el('header', 'ds-mast', page);
      const brand = u.el('span', 'ds-brand', mast);
      brand.setAttribute('aria-label', C.brand);
      u.el('span', 'ds-brand-lettering', brand, '𝕿𝖍𝖊 𝕯𝖆𝖎𝖑𝖞 𝕮𝖍𝖗𝖔𝖓𝖎𝖈𝖑𝖊').setAttribute('aria-hidden', 'true');
      u.el('span', 'ds-rule', mast);
      const tag = u.el('span', 'ds-tag', mast);
      C.tag.split('|').forEach((t) => u.el('div', '', tag, t));
      u.el('span', 'ds-date', mast, C.date);
      const head = u.el('div', 'ds-head', page);
      u.el('h1', '', head, C.title);
      u.el('p', '', head, C.sub);
      const side = u.el('aside', 'ds-side', document.body);
      u.el('div', 'ds-side-rule', side);
      u.el('h2', '', side, 'Record Lookup');
      const g = u.el('section', 'ds-box', side);
      u.el('h3', '', g, 'Field Guide');
      u.el('p', '', g, 'Use the table on the left to find the matching value for each field.');
      u.el('hr', '', g);
      u.el('h3', '', g, 'Fields to complete');
      u.el('ul', 'ds-field-guide', g);
      g.hidden = _c.display === 'panel' || _c.display === 'toast';
      const h = u.el('section', 'ds-box', side);
      u.el('h3', '', h, 'Need help?');
      u.el('p', '', h, 'Read the table carefully and make sure each entry matches the correct person.');
      const toolbar = u.el('div', 'ds-toolbar');
      Object.assign(_c, { page, side, guide: g, toolbar, header: page });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note', 'ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.page);
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.side;
      base(_c);
      _c.body = body;
      const panel = _c.side.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-title').textContent = 'Instructions';
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
        _c.side.insertBefore(panel, _c.guide);
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
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.side.insertBefore(note, _c.guide);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.page.appendChild(foot);
      foot.prepend(_c.toolbar);
      const clr = _c.util.el('button', 'ds-clear', _c.toolbar, 'Clear All');
      clr.type = 'button';
      clr.addEventListener('click', () => {
        _c.stage.querySelectorAll('input').forEach((i) => {
          i.value = '';
          i.dispatchEvent(new Event('input', { bubbles: true }));
        });
      });
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
    name: C.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-find-fact-table-07': palette },
      LOW_THEME: palette,
      ACCENTS: ['#a50f15'],
      LOW_ACCENTS: ['#a50f15'],
      parts,
    },
  });
})();
