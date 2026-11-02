(function () {
  'use strict';
  const cfg = {
    title: 'People',
    tools: 'File Edit View People Tools Help',
    overview: 'All People|59 contacts',
    rail: 'All People|☆  Favorites|◷  Recent|◇  Tags|Groups|♧  Clients|♧  Colleagues|♧  Partners|♧  Vendors|♧  Recruiting',
    side: 'Giorgos Arslan|Solutions Architect|Trellis|Email     giorgos.arslan@trellis.com|Phone     +1 617 555 0133|Location     Boston, MA|Job Title     Solutions Architect|Company     Trellis|Department     Engineering|Website     https://trellis.com|Tags     Partners   Engineering|Notes     Met at Cloud Summit 2023.',
  };
  const palette = { bg: '#0b1116', panel: '#10181e', fg: '#e8eef6', muted: '#b4c0ce', line: '#26343e' };
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
      const u = _c.util;
      document.body.classList.add('ref', 'mica', 'contacts');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head, cfg.title);
      const controls = u.el('span', 'window-controls', title);
      controls.innerHTML = '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      const tools = u.el('div', 'tools', head);
      cfg.tools.split(' ').forEach((label) => {
        const item = u.el('span', 'menu-label', tools);
        u.el('u', '', item, label[0]);
        u.el('span', '', item, label.slice(1));
      });
      const toolbar = u.el('div', 'app-toolbar', head);
      ['New Contact', 'Edit', 'Delete', 'Email', 'Meet', 'Tag'].forEach((label, i) => {
        const b = u.el('span', 'toolbar-item', toolbar);
        b.innerHTML = '<i>' + [
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="8" r="3"/><path d="M3 20v-1a6 6 0 0 1 12 0v1M18 8v6M15 11h6"/></svg>',
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m14 5 5 5M4 20l4-.8L19 8a2 2 0 0 0-3-3L5 16z"/></svg>',
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 7h14M10 4h4M8 7v13h8V7M10 10v7M14 10v7"/></svg>',
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>',
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="5" width="16" height="16" rx="2"/><path d="M8 3v4m8-4v4M4 10h16M8 14h3M8 17h6"/></svg>',
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 12 12 20H5V13l8-8zM15 6l3 3"/><circle cx="9" cy="15" r="1"/></svg>',
        ][i] + '</i>' + label;
      });
      u.el('span', 'toolbar-search', toolbar, '⌕  Search people');
      const overview = u.el('section', 'overview', shell);
      cfg.overview.split('|').forEach((s, i) => u.el(i === 0 ? 'h2' : 'p', '', overview, s));
      const filters = u.el('div', 'contact-filters', overview);
      ['All', 'Clients', 'Colleagues', 'Partners', 'Vendors', 'Recruiting'].forEach((label, i) => u.el('span', i === 0 ? 'selected' : '', filters, label));
      u.el('span', 'list-search', overview, '⌕  Search this list…');
      Object.assign(_c, { shell, toolbar, header: overview });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'work', _c.shell);
      const rail = u.el('nav', 'rail', body);
      cfg.rail.split('|').forEach((s, i) => u.el('div', i === 0 ? 'active' : '', rail, s));
      const center = u.el('section', 'center', body);
      const aside = u.el('aside', 'inspector', body);
      cfg.side.split('|').forEach((s, i) => {
        const p = u.el(i === 0 ? 'h2' : 'p', i > 2 ? 'detail-line' : '', aside, s);
        if (i > 2) {
          const pair = s.split('     ');
          if (pair.length > 1) {
            p.textContent = '';
            u.el('span', 'detail-label', p, pair[0]);
            u.el('span', 'detail-value', p, pair.slice(1).join(' ').trim());
          }
        }
        if (i === 2) {
          const actions = u.el('div', 'profile-actions', aside);
          [['✉', 'Email'], ['▦', 'Meet'], ['♧', 'Call'], ['◇', 'Tag']].forEach(([icon, label]) => {
            const a = u.el('div', 'profile-action', actions);
            u.el('i', '', a, icon);
            u.el('span', '', a, label);
          });
        }
      });
      Object.assign(_c, { body, center });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.center;
      base(_c);
      _c.body = body;
      const panel = _c.center.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('instruction');
        panel.dataset.display = _c.display;
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'instruction-toast');
        note.dataset.display = _c.display;
        _c.center.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      const statusbar = _c.util.el('div', 'bottom-status', _c.shell);
      _c.util.el('span', '', statusbar, 'Connected');
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.querySelector('.ref-foot-text').textContent = '';
      statusbar.appendChild(foot);
      _c.statusbar = statusbar;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.statusbar.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el('strong', '', el, {
        cookie: 'Cookie preferences', toast: 'Notification', chat: 'Support', promo: 'A special offer', banner: 'Service notice',
      }[ctx.kind]);
      ctx.util.el('p', '', el, {
        cookie: 'Choose your preferences to continue.', toast: 'Your workspace is ready.', chat: 'How can we help?', promo: 'Explore the latest tools.', banner: 'A new update is available.',
      }[ctx.kind]);
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-click-control-rows-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: { THEMES: { mica: palette }, LOW_THEME: palette, ACCENTS: ['#149fe8'], LOW_ACCENTS: ['#149fe8'], parts },
  });
})();
