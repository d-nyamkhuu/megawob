(function () {
  'use strict';
  const drawIcon = (parent, name) => {
    const paths = {
      calendar: '<rect x="4" y="5" width="16" height="16" rx="1.5"/><path d="M8 3v4M16 3v4M4 10h16M8 14h2M14 14h2M8 17h2"/>',
      people: '<circle cx="9" cy="7" r="2.5"/><path d="M3.5 19v-2.5A4.5 4.5 0 018 12h2a4.5 4.5 0 014.5 4.5V19M16 5a2.5 2.5 0 010 5M17 13a4 4 0 013.5 4v2"/>',
      clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 6v6l4 2"/>',
      heart: '<path fill="currentColor" stroke="none" d="M12 21C8 17.6 3 14 3 8.8 3 3.8 9 2 12 6c3-4 9-2.2 9 2.8C21 14 16 17.6 12 21z"/>'
    };
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox','0 0 24 24'); svg.setAttribute('fill','none'); svg.setAttribute('stroke','currentColor');
    svg.setAttribute('stroke-width','2'); svg.setAttribute('stroke-linecap','round'); svg.setAttribute('stroke-linejoin','round');
    svg.setAttribute('aria-hidden','true'); svg.innerHTML=paths[name] || paths.calendar; parent.appendChild(svg);
  };
  env.site({
    name: 'design-use-desktop-tools-week-05',
    template: 'site/base',
    design: {
        THEMES: { light: { bg: '#f5f4fc', panel: '#ffffff', fg: '#111b31', muted: '#596273', line: '#dfe3eb' }, dark: { bg: '#f5f4fc', panel: '#ffffff', fg: '#111b31', muted: '#596273', line: '#dfe3eb' }, warm: { bg: '#f5f4fc', panel: '#ffffff', fg: '#111b31', muted: '#596273', line: '#dfe3eb' } },
        ACCENTS: ['#2684f5'], LOW_THEME: { bg: '#f5f4fc', panel: '#fff', fg: '#111b31', muted: '#596273', line: '#dfe3eb' }, LOW_ACCENTS: ['#2684f5'],
        LANGS: ['en'], TITLES: ['Calendar'],
      parts: {
        'frame.header': (base, S) => function (_c) {
          const u = _c.util;
          document.body.classList.add('calendar-app', 'instruction-' + _c.display);
          const shell = u.el('div', 'calendar-window', document.body);
          const headArea = u.el('header', 'calendar-header', shell);
          const header = u.el('div', 'window-titlebar', headArea);
          drawIcon(u.el('span', 'calendar-app-icon', header), 'calendar');
          u.el('strong', 'window-title', header, 'Calendar');
          const actions = u.el('div', 'window-actions', header);
          const controls = u.el('div', 'native-controls', header);
          u.el('span', 'minimize', controls, '−'); u.el('span', 'maximize', controls, '□'); u.el('span', 'close', controls, '×');
          Object.assign(_c, { shell, header: headArea, actions });
        },
        'frame.nav': () => function () {},
        'frame.instruction': (base) => function (_c) {
          base(_c);
          const note = _c.header.querySelector('.ref-instruction');
          if (note) note.classList.add('header-instruction');
        },
        'frame.tools': (base) => function (_c) {
          const header = _c.header;
          _c.header = _c.actions;
          base(_c);
          _c.header = header;
        },
        'frame.body': () => function (_c) {
          const u = _c.util;
          const inner = u.el('div', 'calendar-content', _c.shell);
          const workspace = u.el('main', 'calendar-workspace', inner);
          const side = u.el('aside', 'calendar-side', workspace);
          const summary = u.el('section', 'week-summary', side);
          u.el('h2', '', summary, 'This Week');
          u.el('div', 'summary-dates', summary, 'Apr 27 – May 3, 2025');
          const grid = u.el('div', 'summary-grid', summary);
          const stats = [['10','Total events','calendar','blue'],['6','Meetings','people','green'],['2','Focus blocks','clock','purple'],['2','Personal','heart','pink']];
          for (const [value, title, icon, color] of stats) {
            const card = u.el('div', 'summary-card', grid);
            u.el('strong', '', card, value); drawIcon(u.el('span', 'summary-icon '+color, card),icon); u.el('small', '', card, title);
          }
          Object.assign(_c, { body: workspace, side });
        },
        'frame.panel': (base) => function (_c) {
          const body = _c.body;
          _c.body = _c.side;
          base(_c);
          _c.body = body;
          const panel = _c.side.querySelector('.ref-panel');
          if (panel) {
            panel.classList.add('instruction-card');
            drawIcon(_c.util.el('span', 'instruction-icon', panel), 'calendar');
            panel.prepend(panel.lastChild);
            _c.side.prepend(panel);
          }
        },
        'frame.stage': (base) => function (_c) {
          base(_c);
          _c.stage.classList.replace('ref-stage', 'week-stage');
          _c.body.prepend(_c.stage);
        },
        'frame.toast': (base) => function (_c) {
          base(_c);
          const note = document.querySelector('.ref-note');
          if (note) {
            note.classList.add('task-toast');
            _c.side.appendChild(note);
          }
        },
        'frame.footer': (base) => function (_c) {
          base(_c);
          const foot = document.querySelector('.ref-foot');
          if (foot) {
            foot.classList.add('calendar-footer');
            _c.shell.appendChild(foot);
          }
        },
        'frame.floating': (base) => function (_c) {
          base(_c);
          const dock = document.querySelector('.ref-float-dock');
          if (dock) _c.shell.appendChild(dock);
        },
        overlay: (base, S) => function(ctx) {
          const result = base(ctx);
          if (ctx.kind === 'banner') {
            result.el.classList.add('calendar-banner');
            result.el.style.top = (document.querySelector('.calendar-header').getBoundingClientRect().bottom + 10) + 'px';
          }
          return result;
        },
        fault: (base, S) => function(ctx) {
          const result = base(ctx);
          if (ctx.kind === 'shift') document.querySelector('.calendar-header').after(result.el);
          return result;
        },
      },
    },
  });
})();
