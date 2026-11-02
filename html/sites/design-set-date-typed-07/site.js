(function () {
  'use strict';
  const C = {
    site: 'design-set-date-typed-07',
    brand: 'OS/2 Workplace Shell  -  Task Manager',
    menu: 'File|Edit|View|Tools|Help',
    briefTitle: 'Task Briefing',
    tabs: 'Task|Notes|Attachments|Recurrence',
    tools: 'New Task|Open|Save|Delete|Print|Clear Form',
  };
  const ICONS = {
    'New Task': '<svg viewBox="0 0 24 28"><path d="M3 1h14l5 5v21H3z" fill="#fff" stroke="#111" stroke-width="1.5"/><path d="M17 1v6h5M6 8h9M6 12h13M6 16h13M6 20h13M6 24h13" fill="none" stroke="#111" stroke-width="1.2"/><path d="M4 2v24h16" fill="none" stroke="#999" stroke-width=".6"/></svg>',
    Open: '<svg viewBox="0 0 28 27"><path d="M3 12l3-8h8l3 4h8v16H3z" fill="#ddd" stroke="#111" stroke-width="1.5"/><path d="M1 12h26l-2 13H3z" fill="#e5e5e5" stroke="#111" stroke-width="1.5"/><path d="M3 13h22M4 14l1 9" stroke="#fff" fill="none"/></svg>',
    Save: '<svg viewBox="0 0 26 28"><path d="M2 3h20l2 2v21H2z" fill="#555" stroke="#111" stroke-width="1.5"/><path d="M5 3h15v11H5z" fill="#fff" stroke="#111"/><path d="M14 4h3v7h-3z" fill="#333"/><path d="M5 18h16v8H5z" fill="#eee" stroke="#111"/><path d="M8 20h10v4H8z" fill="#aaa" stroke="#111"/><path d="M3 4v21M23 6v19" stroke="#eee"/></svg>',
    Delete: '<svg viewBox="0 0 24 28"><path d="M3 7h18l-1 2H4zM8 4l1-2h6l2 2M5 9l1 17h12l1-17" fill="#eee" stroke="#111" stroke-width="1.3"/><ellipse cx="12" cy="5" rx="10" ry="2" fill="#fff" stroke="#111" stroke-width="1.2"/><path d="M8 11v12M11 11v12M14 11v12M17 11v12" stroke="#111" stroke-width="1"/></svg>',
    Print: '<svg viewBox="0 0 30 28"><path d="M7 10l2-9h17l-2 9" fill="#fff" stroke="#111" stroke-width="1.4"/><path d="M11 4h10M11 7h9" stroke="#111"/><path d="M2 10h27v13H2z" fill="#ddd" stroke="#111" stroke-width="1.5"/><path d="M4 12h23v7H4z" fill="#eee" stroke="#111"/><path d="M7 19h17v7H7z" fill="#fff" stroke="#111" stroke-width="1.4"/><path d="M8 23h15M3 22h3M25 14h1" stroke="#111"/></svg>',
    'Clear Form': '<svg viewBox="0 0 28 24"><path d="M3 13l8 8L26 3" fill="none" stroke="#000" stroke-width="5"/></svg>',
  };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
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
      const top = u.el('header', 'ds-top', document.body);
      const ic = u.el('span', 'ds-sysicon', top);
      ic.innerHTML = '<svg viewBox="0 0 20 20"><path d="M2 2h15v5H2zM4 8h15v5H4zM2 14h15v4H2z" fill="#111"/><path d="M3 3h12M6 5h10M5 9h10M8 11h10M3 15h10M6 17h10" stroke="#eee" stroke-width="1"/><path d="M2 6H0M17 4h3M3 12H1M18 16h2" stroke="#111"/></svg>';
      u.el('span', 'ds-brand', top, C.brand);
      const wc = u.el('span', 'ds-wctl', top);
      ['_', '□', '×'].forEach((t) => u.el('i', '', wc, t));
      const outer = u.el('div', 'ds-body');
      const content = u.el('div', 'ds-content', outer);
      const header = u.el('div', 'ds-header-note', content);
      header.hidden = _c.display !== 'header';
      const foot = u.el('footer', 'ds-footer');
      const tools = u.el('div', 'ds-tools', foot);
      C.tools.split('|').forEach((t) => {
        const b = u.el('div', 'ds-tool' + (t === 'Print' || t === 'Clear Form' ? ' sep' : ''), tools);
        const i = u.el('span', '', b);
        i.innerHTML = ICONS[t];
        u.el('span', '', b, t);
      });
      const btns = u.el('div', 'ds-btns', foot);
      Object.assign(_c, { top, outer, content, header, foot, btns });
    },
    'frame.nav': () => (_c) => {
      const nav = _c.util.el('nav', 'ds-menu', document.body);
      C.menu.split('|').forEach((t) => {
        const s = _c.util.el('span', '', nav);
        const uu = document.createElement('u');
        uu.textContent = t[0];
        s.append(uu, t.slice(1));
      });
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.btns;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      document.body.appendChild(_c.outer);
      const body = _c.util.el('div', 'ds-main', _c.content);
      Object.assign(_c, { body });
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const b = _c.body.querySelector('.ref-panel');
      if (!b) return;
      const u = _c.util;
      b.classList.add('ds-brief');
      const title = b.querySelector('.ref-panel-title');
      title.textContent = C.briefTitle;
      const h = document.createElement('h2');
      h.className = title.className;
      h.textContent = title.textContent;
      title.replaceWith(h);
      const intro = u.el('div', 'ds-intro');
      intro.innerHTML = '<svg viewBox="0 0 30 40"><path d="M2 2h26v36H2z" fill="#fff" stroke="#111" stroke-width="1.7"/><path d="M5 6l2 1M24 5v2M7 9h16M7 13h16M7 17h16M7 21h16M7 25h16M7 29h16M7 33h16" stroke="#111" stroke-width="1.3"/><path d="M4 3v33h22" stroke="#999" stroke-width=".6" fill="none"/></svg>';
      u.el('span', '', intro, 'Create a new task with the following details.');
      const text = b.querySelector('.ref-panel-text');
      text.classList.add('ds-instruction');
      b.insertBefore(intro, text);
      const facts = u.el('div', 'ds-facts', b);
      [['Task Type:', 'Personal'], ['Priority:', 'Normal'], ['Category:', 'Planning']].forEach(([k, v]) => {
        u.el('span', '', facts, k);
        u.el('span', '', facts, v);
      });
      u.el('hr', '', b);
      u.el('div', 'ds-fill', b, 'Fill in the information on the right.');
    },
    'frame.stage': () => (_c) => {
      const right = _c.util.el('div', 'ds-right', _c.body);
      const tabs = _c.util.el('div', 'ds-tabs', right);
      C.tabs.split('|').forEach((t, i) => _c.util.el('span', i ? '' : 'on', tabs, t));
      _c.stage = _c.util.el('main', 'ds-stage', right);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.content.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const footer = document.body.querySelector('.ref-foot');
      footer.querySelector('.ref-foot-text').remove();
      _c.btns.appendChild(footer);
      const close = _c.util.el('button', 'ds-close', _c.btns, 'Close');
      close.type = 'button';
      _c.content.appendChild(_c.foot);
      const sb = _c.util.el('div', 'ds-status', document.body);
      const statusIcon = _c.util.el('span', 'ds-sb-ic', sb);
      statusIcon.innerHTML = '<svg viewBox="0 0 28 28"><g fill="#ddd" stroke="#111" stroke-width="1.6"><path d="M5 2h4v24H5zM9 5h12v4H9zM9 12h12v4H9zM9 19h12v4H9zM2 26h10M21 3l4-2v4l-2 2v14l2 3v3l-4-2"/></g><path d="M6 3v21M10 6h10M10 13h10M10 20h10" stroke="#fff"/></svg>';
      _c.util.el('span', 'ds-sb-ready', sb, 'Ready');
      _c.util.el('span', 'ds-sb-time', sb, 'Mon 27 Jun 1994  10:24 AM');
      _c.close = close;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.btns.insertBefore(dock, _c.close);
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
  const palette = { bg: '#d4d4d4', panel: '#d4d4d4', fg: '#000000', muted: '#222222', line: '#808080' };
  env.site({
    name: C.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: { THEMES: { site: palette }, LOW_THEME: palette, ACCENTS: ['#00cfe0'], LOW_ACCENTS: ['#00cfe0'], parts },
  });
})();
