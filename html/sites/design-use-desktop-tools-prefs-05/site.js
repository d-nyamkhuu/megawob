// Shared, crisp pictograms for the workspace frame and its Files browser.
window.wbIcon = function (name) {
  const paths = {
    brand: '<path fill="currentColor" stroke="none" d="M2 2h12v6H8v6H2zm20 20H10v-6h6v-6h6z"/>',
    Files: '<path fill="currentColor" stroke="none" d="M2 5a2 2 0 012-2h6l3 3h7a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2z"/>',
    Tasks: '<rect x="3" y="3" width="18" height="18" rx="1"/><path d="m7 12 4 4 7-9"/>',
    Calendar: '<rect x="3" y="5" width="18" height="17" rx="1"/><path d="M3 10h18M7 2v6m10-6v6M7 14h2m3 0h2m3 0h1M7 18h2m3 0h2m3 0h1"/>',
    Notes: '<rect x="5" y="2" width="14" height="20" rx="1" fill="currentColor" stroke="none"/><path d="M8 6h8M8 10h8M8 14h8M8 18h7" stroke="var(--icon-paper,#fff)" stroke-width="1.6"/>',
    Terminal: '<rect x="2" y="3" width="21" height="18"/><path d="m6 8 4 4-4 4m7 0h6"/>',
    gear: '<path fill="currentColor" stroke="none" d="m10 1-1 3-3 1-3-1-2 4 2 2v4l-2 2 2 4 3-1 3 1 1 3h4l1-3 3-1 3 1 2-4-2-2v-4l2-2-2-4-3 1-3-1-1-3zm2 7a4 4 0 110 8 4 4 0 010-8"/>',
    star: '<path fill="currentColor" stroke="none" d="m12 1 3.4 7 7.6 1.1-5.5 5.4 1.3 7.5-6.8-3.6L5.2 22l1.3-7.5L1 9.1 7.6 8z"/>',
    recent: '<circle cx="12" cy="12" r="9"/><path d="M12 5v7l5 3"/>',
    shared: '<circle cx="9" cy="7" r="4" fill="currentColor" stroke="none"/><circle cx="18" cy="8" r="3" fill="currentColor" stroke="none"/><path fill="currentColor" stroke="none" d="M1 22v-5c0-6 16-6 16 0v5zm18 0v-6c0-2-1-3-2-4 6-1 7 3 7 5v5z"/>',
    trash: '<path fill="currentColor" stroke="none" d="M5 7h14l-1 15H6zM3 3h7V1h4v2h7v3H3z"/>',
    search: '<circle cx="10" cy="10" r="7"/><path d="m15 15 7 7"/>',
    image: '<rect x="3" y="2" width="18" height="21" rx="2" fill="currentColor" stroke="none"/><path fill="#fff" stroke="none" d="m5 19 5-8 4 5 3-3 3 6z"/>',
    document: '<path fill="currentColor" stroke="none" d="M4 1h12l5 5v17H4z"/><path d="M7 7h8M7 11h11M7 15h11M7 19h10" stroke="#fff" stroke-width="1.4"/>',
    pdf: '<path fill="currentColor" stroke="none" d="M4 1h12l5 5v17H4z"/><path d="M7 18c6-7 6-14 5-12-2 3 0 10 6 8-2-2-9 0-11 4z" stroke="#fff" stroke-width="1.5"/>',
    chevron: '<path d="m8 4 7 8-7 8"/>',
    list: '<path d="M8 5h14M8 12h14M8 19h14M2 5h2M2 12h2M2 19h2"/>',
    grid: '<path fill="currentColor" stroke="none" d="M2 2h8v8H2zm12 0h8v8h-8zM2 14h8v8H2zm12 0h8v8h-8z"/>'
  };
  return '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + (paths[name] || paths.Files) + '</svg>';
};
env.site({
  name: 'design-use-desktop-tools-prefs-05',
  template: 'site/base',
  design: {
    THEMES: {
      light: { bg: '#f6f2ea', panel: '#ffffff', fg: '#111111', muted: '#6b6b6b', line: '#ddd8cc' },
      dark: { bg: '#f6f2ea', panel: '#ffffff', fg: '#111111', muted: '#6b6b6b', line: '#ddd8cc' },
      warm: { bg: '#f6f2ea', panel: '#ffffff', fg: '#111111', muted: '#6b6b6b', line: '#ddd8cc' },
    },
    LOW_THEME: { bg: '#f6f2ea', panel: '#ffffff', fg: '#111111', muted: '#6b6b6b', line: '#ddd8cc' },
    LOW_ACCENTS: ['#d12a24'],
    ACCENTS: ['#d12a24'],
    parts: {
      overlay: (base) => function (ctx) {
        const result = base(ctx);
        if (ctx.kind === 'banner') document.querySelector('.wb-band').appendChild(result.el);
        return result;
      },
      'frame.header': (base) => function (_c) {
        base(_c);
        const { header, util } = _c;
        header.textContent = '';
        const brand = util.el('div', 'wb-brand', header);
        brand.innerHTML = window.wbIcon('brand') + '<span>WorkSpace</span>';
        const nav = util.el('nav', 'wb-nav', header);
        ['Files', 'Tasks', 'Notes', 'Calendar', 'Terminal'].forEach((t, i) => {
          const tab = util.el('span', 'wb-tab' + (i === 0 ? ' on' : ''), nav);
          tab.innerHTML = window.wbIcon(t) + '<span>' + t + '</span>';
        });
        util.el('div', 'wb-prefs-slot', header);
      },
      'frame.nav': (base) => function (_c) {
        base(_c);
        const n = _c.header.querySelector('.ref-nav');
        if (n) n.remove();
      },
      'frame.instruction': (base) => function (_c) {
        base(_c);
        const i = _c.header.querySelector('.ref-instruction');
        if (i) i.remove();
        const s = _c.header.querySelector('.ref-spacer');
        if (s) s.remove();
      },
      'frame.stage': (base) => function (_c) {
        base(_c);
        const { body, util } = _c;
        const side = util.el('aside', 'wb-agenda', body);
        const schedule = util.el('section', 'wb-schedule', side);
        const day = (title, date, rows) => {
          const section = util.el('section', 'wb-day-section', schedule);
          const h = util.el('div', 'wb-day', section);
          util.el('b', '', h, title);
          util.el('span', '', h, date);
          rows.forEach(([t, name, w]) => {
            const r = util.el('div', 'wb-ev', section);
            util.el('i', '', r);
            util.el('span', '', r, t);
            util.el('div', '', r, name);
            util.el('small', '', r, w);
          });
        };
        day('Today', 'Thu, Apr 17, 2025', [['9:00 AM – 10:00 AM', 'Team standup', 'Conference Room A'], ['11:00 AM – 12:00 PM', 'Design review', 'Meeting Room 2'], ['2:00 PM – 3:00 PM', 'Product planning', 'Conference Room B']]);
        day('Tomorrow', 'Fri, Apr 18, 2025', [['10:00 AM – 11:00 AM', '1:1 with Alex', 'Video call']]);
        const notes = util.el('section', 'wb-recent-notes', side);
        const h = util.el('div', 'wb-day', notes);
        util.el('b', '', h, 'Recent Notes');
        util.el('span', 'wb-arrow', h).innerHTML = window.wbIcon('chevron');
        ['Meeting notes', 'Project ideas', 'Vacation planning'].forEach((n, i) => {
          const row = util.el('div', 'wb-note-row', notes);
          row.innerHTML = window.wbIcon('Notes');
          util.el('span', '', row, n);
          util.el('small', '', row, ['Apr 16, 2025', 'Apr 14, 2025', 'Apr 10, 2025'][i]);
        });
      },
      'frame.toast': (base) => function (_c) {
        base(_c);
        const note = document.querySelector('.ref-note');
        if (note) document.body.appendChild(note);
      },
      'frame.body': (base) => function (_c) {
        const { ctx, display, util } = _c;
        const band = util.el('section', 'wb-band', document.body);
        const greet = util.el('div', 'wb-greet', band);
        util.el('h1', '', greet, 'Good morning');
        if (display === 'header') {
          const note = util.el('p', 'wb-note', greet, ctx.instruction);
          note.dataset.role = 'instruction';
        } else util.el('p', 'wb-sub', greet, "Here's what's happening today.");
        const cards = util.el('div', 'wb-cards', greet);
        [['Files', '12 items'], ['Tasks', '5 due this week'], ['Calendar', '2 events today'], ['Notes', '3 recent notes']].forEach(([a, b]) => {
          const c = util.el('div', 'wb-card', cards);
          util.el('i', '', c).innerHTML = window.wbIcon(a);
          const s = util.el('span', '', c);
          util.el('b', '', s, a);
          util.el('small', '', s, b);
          util.el('span', 'wb-arrow', c).innerHTML = window.wbIcon('chevron');
        });
        const sto = util.el('div', 'wb-storage', band);
        util.el('b', '', sto, 'Storage');
        util.el('em', '', sto, '62% used');
        const bar = util.el('div', 'wb-bar', sto);
        util.el('div', '', bar);
        util.el('small', '', sto, '62.1 GB of 100 GB');
        base(_c);
      },
    },
  },
});
