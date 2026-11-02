(function () {
  'use strict';
  const palette = { bg: '#f4f0e5', panel: '#fbf8ef', fg: '#173b5c', muted: '#77736f', line: '#d2cfc4' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.className = 'workspace instruction-' + _c.display;
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      u.el('div', 'design-brand', header, 'WorkSpace');
      const nav = u.el('nav', 'design-nav', header);
      const glyphs = ['▰', '☑', '▦', '▤', '⚙'];
      'Files|Tasks|Calendar|Notes|Preferences'.split('|').forEach((label, i) => {
        const item = u.el('div', 'design-navitem' + (i === 0 ? ' active' : ''), nav);
        u.el('span', 'nav-glyph', item, glyphs[i]);
        u.el('span', '', item, label);
      });
      u.el('div', 'design-search', header, '⌕  Search');
      Object.assign(_c, { shell, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('task-note');
    },
    'frame.tools': (base) => (_c) => { base(_c); },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'design-body', _c.shell);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) _c.body.appendChild(note);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) note.classList.add('task-note');
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const stage = u.el('main', 'stage', _c.body);
      const side = u.el('aside', 'records-panel', _c.body);
      u.el('h2', 'records-title', side, 'Recent Files');
      const records = [
        ['W', 'draft v4 (final).doc', 'Apr 11, 2015', 'word'], ['X', 'plan.xlsx', 'Apr 07, 2015', 'sheet'],
        ['▤', 'research-notes.md', 'Apr 09, 2015', 'plain'], ['P', 'marketing-overview.pptx', 'Apr 06, 2015', 'slide'],
        ['X', 'budget.xlsx', 'Apr 05, 2015', 'sheet'], ['▧', 'design-mockup.png', 'Apr 04, 2015', 'image'],
        ['▤', 'brief.txt', 'Apr 02, 2015', 'plain'], ['▣', 'draft v3.doc', 'Apr 08, 2015', 'word']
      ];
      const recList = u.el('div', 'record-list', side);
      for (const [icon, name, date, type] of records) {
        const row = u.el('div', 'record-row', recList);
        u.el('span', 'file-mark ' + type, row, icon);
        u.el('span', 'record-name', row, name);
        u.el('time', '', row, date);
      }
      const cal = u.el('section', 'mini-calendar', side);
      u.el('h2', 'records-title', cal, 'Calendar');
      const month = u.el('div', 'calendar-month', cal);
      u.el('span', '', month, '‹'); u.el('b', '', month, 'April 2015'); u.el('span', '', month, '›');
      const calgrid = u.el('div', 'calendar-grid', cal);
      ['Sun|12','Mon|13','Tue|14','Wed|15','Thu|16','Fri|17','Sat|18'].forEach((x) => {
        const [day, n] = x.split('|'); const cell = u.el('div', 'cal-cell', calgrid); u.el('b', '', cell, day); u.el('strong', '', cell, n);
      });
      const events = u.el('div', 'calendar-events', cal);
      ['9 AM','10 AM','11 AM','12 PM','1 PM','2 PM','3 PM','4 PM','5 PM'].forEach((hour, i) => {
        const line = u.el('div', 'cal-hour', events); u.el('span', '', line, hour);
        if ([1,2,4,5,6].includes(i)) u.el('i', 'event e' + i, line, ['Team Standup','Project Review','Lunch w/ Alex','Client Call','Planning'][[1,2,4,5,6].indexOf(i)]);
      });
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) { note.classList.add('task-note'); _c.body.appendChild(note); }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const footer = document.body.querySelector('.ref-foot');
      footer.classList.add('design-footer');
      _c.shell.appendChild(footer);
      const text = footer.querySelector('.ref-foot-text');
      text.classList.add('footer-label');
      text.textContent = 'Ready';
      _c.foot = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util, named = ['BeOS Newsletter', 'Be the first to know. Get news, tips and updates from the BeOS team.', 'Close'];
      const texts = {
        cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
        chat: ['Help', 'Need help with this workspace?', 'Close'],
        promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
        banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement']
      };
      let [title, copy, label] = texts[ctx.kind];
      if (named && ['promo', 'toast', 'banner', 'cookie'].includes(ctx.kind)) [title, copy, label] = named;
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', title);
      u.el('h2', '', el, title);
      u.el('div', 'overlay-copy', el, copy);
      const actions = u.el('div', 'overlay-actions', el);
      if (ctx.kind === 'cookie') {
        const accept = u.el('button', '', actions, 'Accept all');
        accept.addEventListener('click', () => ctx.dismiss());
      }
      if (/Tip/.test(title)) {
        const c = u.el('label', '', el);
        c.style.cssText = 'display:block;padding:0 22px 14px';
        const ch = u.el('input', '', c);
        ch.type = 'checkbox';
        c.append(' Do not show again');
      }
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    }
  };
  env.site({
    name: 'design-use-desktop-tools-move-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: { THEMES: { site: palette }, LOW_THEME: palette, ACCENTS: ['#8d3444'], LOW_ACCENTS: ['#8d3444'], parts }
  });
})();
