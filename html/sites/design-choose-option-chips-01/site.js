(function () {
  'use strict';
  const C = {
    site: 'design-choose-option-chips-01',
    brand: 'Team Directory',
    menu: 'File|Edit|View|Tools|Help',
    rail: 'People|Projects|Calendar|Reports|Settings',
  };
  const palette = { bg: '#f8f8f8', panel: '#fff', fg: '#111', muted: '#555', line: '#777' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      let display = _c.ctx.display || 'header';
      if ((display === 'panel' && _c.W < 1100) || (display === 'toast' && _c.H < 700)) display = 'header';
      _c.display = display;
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
      document.body.classList.add('gem-window');
      const shell = u.el('div', 'gem-shell', document.body);
      const top = u.el('header', 'ds-top', shell);
      const sys = u.el('button', 'gem-system', top, '☰');
      sys.type = 'button';
      sys.setAttribute('aria-label', 'System menu');
      u.el('span', 'ds-brand', top, C.brand);
      const win = u.el('div', 'gem-window-controls', top);
      ['—', '□', '×'].forEach((x, i) => {
        const b = u.el('button', '', win, x);
        b.type = 'button';
        b.setAttribute('aria-label', ['Minimize', 'Maximize', 'Close'][i]);
      });
      Object.assign(_c, { shell, top, header: shell });
    },
    'frame.nav': () => (_c) => {
      const nav = _c.util.el('nav', 'ds-menu', _c.shell);
      C.menu.split('|').forEach((t) => _c.util.el('span', '', nav, t));
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.shell.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note', 'gem-header-mode');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('gem-header-tools');
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'ds-body', _c.shell);
      const rail = u.el('aside', 'ds-rail', body);
      const icons = [
        '<circle cx="16" cy="9" r="5"/><circle cx="7" cy="13" r="3.5"/><circle cx="25" cy="13" r="3.5"/><path d="M6 28c0-6 4-10 10-10s10 4 10 10v2H6zM1 28c0-4 2-7 6-8M31 28c0-4-2-7-6-8"/>',
        '<path d="M2 9h12l4 4h12v16H2z"/><path d="M2 9V6h12l4 4"/>',
        '<rect x="3" y="3" width="26" height="27"/><path d="M3 10h26M10 3v27M18 3v27M3 18h26"/>',
        '<rect x="5" y="2" width="22" height="28"/><path d="M10 9h12M10 14h12M10 19h12M10 24h9"/>',
        '<circle cx="16" cy="16" r="6"/><path d="M14 1h4l1 4 3 1 3-2 3 3-2 3 1 3 4 1v4l-4 1-1 3 2 3-3 3-3-2-3 1-1 4h-4l-1-4-3-1-3 2-3-3 2-3-1-3-4-1v-4l4-1 1-3-2-3 3-3 3 2 3-1z"/>',
      ];
      C.rail.split('|').forEach((t, i) => {
        const item = u.el('div', 'gem-nav-item' + (i === 0 ? ' selected' : ''), rail);
        const box = u.el('span', 'gem-nav-icon', item);
        box.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true">' + icons[i] + '</svg>';
        u.el('span', '', item, t);
      });
      const contentRoot = u.el('div', 'ds-content', body);
      const main = u.el('div', 'ds-main', contentRoot);
      Object.assign(_c, { body, contentRoot, main });
    },
    'frame.panel': (base) => (_c) => {
      // The note belongs inside the original Expertise help card, drawn with the stage.
      _c.drawPanelNote = (body) => base({ ..._c, body });
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const stage = u.el('main', 'ds-stage', _c.main);
      const staticForm = u.el('div', 'gem-form-static', _c.main);
      const field = (parent, title, cls) => {
        const f = u.el('div', 'gem-static-field ' + (cls || ''), parent);
        u.el('label', '', f, title);
        const box = u.el('div', 'gem-static-control', f);
        if (cls === 'arrow') u.el('span', 'gem-arrow', box, '');
        return f;
      };
      const primary = u.el('div', 'gem-primary', staticForm);
      const row1 = u.el('div', 'gem-static-row', primary);
      const row2 = u.el('div', 'gem-static-row', primary);
      field(row1, 'Name');
      field(row1, 'Role', 'arrow');
      field(row2, 'Department', 'arrow');
      field(row2, 'Location', 'arrow');
      u.el('div', 'gem-divider', staticForm);
      const secondary = u.el('div', 'gem-secondary', staticForm);
      const avail = field(secondary, 'Availability', 'arrow');
      avail.querySelector('.gem-static-control').insertAdjacentText('afterbegin', 'Any');
      const emp = field(secondary, 'Employment Type', 'arrow');
      emp.querySelector('.gem-static-control').insertAdjacentText('afterbegin', 'Any');
      const panel = u.el('aside', 'gem-help', _c.main);
      const ph = u.el('div', 'gem-help-head', panel);
      u.el('strong', '', ph, 'Expertise');
      const book = u.el('span', 'gem-book', ph);
      book.innerHTML = '<svg viewBox="0 0 40 32" aria-hidden="true"><path d="M3 4c7-2 13 0 17 4v21c-4-4-10-6-17-4zM37 4c-7-2-13 0-17 4v21c4-4 10-6 17-4z"/><path d="M20 8v21"/></svg>';
      const helpBody = u.el('div', 'gem-help-body', panel);
      _c.drawPanelNote(helpBody);
      if (_c.display !== 'panel') {
        u.el('p', 'gem-help-intro', helpBody, 'Choose one or more areas of expertise to match people with relevant experience.');
      }
      u.el('div', 'gem-rule', helpBody);
      u.el('h2', '', helpBody, 'About this field');
      u.el('p', 'gem-help-copy', helpBody, 'Select all areas that apply. You can choose multiple options. The selected expertise will appear as chips in the field above.');
      const tip = u.el('div', 'gem-tip', panel);
      const bulb = u.el('span', 'gem-bulb', tip);
      bulb.innerHTML = '<svg viewBox="0 0 40 48" aria-hidden="true"><path d="M20 3a13 13 0 0 0-8 23c2 2 3 4 3 7h10c0-3 1-5 3-7A13 13 0 0 0 20 3zM15 36h10M16 40h8M18 44h4"/><path d="M20 0v-3M4 8 1 5M36 8l3-3M3 20H0M37 20h3"/></svg>';
      const tiptext = u.el('div', '', tip);
      u.el('strong', '', tiptext, 'Tip');
      u.el('p', '', tiptext, 'You can select multiple options. The chosen expertise will appear as chips in the field above.');
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('gem-toast');
        _c.contentRoot.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.shell.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
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
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#111'],
      LOW_ACCENTS: ['#111'],
      parts,
    },
  });
})();
