(function () {
  'use strict';
  const palette = { bg: '#172b73', panel: '#f4ebcf', fg: '#080c2b', muted: '#ffdc79', line: '#d9bd68' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast' && _c.W < 1100) _c.display = 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('design', 'notebook');
      const head = u.el('div', 'banner', document.body);
      const globe = u.el('div', 'globe', head);
      globe.setAttribute('aria-hidden', 'true');
      const brand = u.el('div', 'brand', head);
      u.el('div', 'brand-name', brand, 'Discovery Library');
      u.el('div', 'brand-sub', brand, 'EXPLORE ▸ LEARN ▸ GROW');
      const tag = u.el('div', 'tagline', head);
      tag.innerHTML = 'A Brighter<br>World of Knowledge';
      const shell = u.el('div', 'shell', document.body);
      const margin = u.el('aside', 'margin', document.body);
      const toolbar = u.el('div', 'quick-tools', document.body);
      Object.assign(_c, { shell, margin, toolbar });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const tabs = u.el('nav', 'notebook-tabs', _c.shell);
      for (const name of ['Activities', 'Reference', 'Games', 'About']) {
        const tab = u.el('button', 'notebook-tab' + (name === 'Activities' ? ' active' : ''), tabs, name);
        tab.type = 'button';
        tab.onclick = () => env.log('notebook-tab', { name });
      }
      const page = u.el('div', 'page', _c.shell);
      for (const corner of ['tl', 'tr', 'bl', 'br']) {
        const ornament = u.el('span', 'page-corner ' + corner, page);
        ornament.setAttribute('aria-hidden', 'true');
      }
      const header = u.el('header', 'task-note', page);
      header.hidden = _c.display !== 'header';
      Object.assign(_c, { page, header });
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.page;
    },
    'frame.panel': (base) => (_c) => {
      const u = _c.util;
      const margin = _c.margin;
      const heading = u.el('h2', 'm-head', margin, 'Instructions');
      heading.hidden = _c.display !== 'panel';
      const body = _c.body;
      _c.body = margin;
      base(_c);
      _c.body = body;
      u.el('hr', 'm-rule', margin);
      u.el('h2', 'm-head act', margin, 'Actions');
      const ol = u.el('ol', 'm-list', margin);
      for (const t of ['Drag a card from the tray.', 'Drop it into the correct column.', 'Repeat until all cards are sorted.']) u.el('li', '', ol, t);
      u.el('hr', 'm-rule', margin);
      _c.foot = u.el('footer', 'footer', margin);
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.page);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.margin.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.foot.appendChild(foot);
      const clear = _c.util.el('button', 'clear', _c.foot, 'Clear All');
      clear.type = 'button';
      clear.onclick = () => env.log('clear-all', {});
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.margin.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'obstruction obstruction-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const titles = { cookie: 'Privacy notice', toast: 'Changes saved', chat: 'Help', promo: 'Notebook news', banner: 'Notice' };
      u.el('h3', '', box, titles[ctx.kind] || 'Notice');
      u.el('p', '', box, ctx.kind === 'cookie' ? 'Allow optional cookies for this page?' : 'You can close this note to return to the activity.');
      const dismiss = u.el('button', 'dismiss', box, ctx.kind === 'cookie' ? 'Reject optional' : 'Close');
      dismiss.type = 'button'; dismiss.onclick = () => ctx.dismiss('close');
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
    },
  };
  env.site({
    name: 'design-reorder-items-kanban-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#d9bd68'], LOW_ACCENTS: ['#d9bd68'], parts,
    },
  });
})();
