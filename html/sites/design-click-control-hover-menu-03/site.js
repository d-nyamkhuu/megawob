// Design on templates/site/ui-click-hover-menu-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-click-control-hover-menu-03',
    styles: ['site.css'],
    template: 'site/click-control-hover-menu-01',
    design: {
      cfg: {
        'title': 'RIVET CO',
        'theme': 'rivet',
        'layout': 'dock',
        'tools': '',
        'overview': 'Good morning, Alex.|Here’s what’s happening at Rivet.',
        'side':
          'Recent People|Jordan Wu · Product Manager · Apr 26|Maya Kim · UX Designer · Apr 25|Daniel Lee · Software Engineer · Apr 24|Sophia Ramirez · Marketing Specialist · Apr 24|Chris Thompson · Sales Manager · Apr 23|Nina Gupta · People Operations · Apr 22|Priya Chen · Data Analyst · Apr 22|Jacob Miller · Customer Success · Apr 21|Liam Torres · DevOps Engineer · Apr 20|Emma Hall · Content Strategist · Apr 19',
        'foot': 'HOME|PEOPLE|PROJECTS|COMPANY|TOOLS',
      },
      parts: {
        'frame.7': (base, S) =>
          function (_c) {
            if (S.cfg.tools) return base(_c);
            _c.u.el('div', 'tools', _c.head);
          },
        'frame.8': (base, S) =>
          function (_c) {
            base(_c);
            _c.shell.querySelector('.overview').appendChild(_c.head);
          },
        'frame.18': (base, S) =>
          function (_c) {
            const { cfg } = S;
            const { u, work } = _c;
            if (cfg.side) {
              _c.aside = u.el('aside', 'inspector', work);
              cfg.side.split('|').forEach((s, i) => {
                if (i === 0) u.el('h2', '', _c.aside, s);
                else {
                  const row = u.el('p', 'person-row', _c.aside);
                  const parts = s.split(' · ');
                  u.el('b', 'person-name', row, parts[0]);
                  u.el('span', 'person-role', row, parts[1] || '');
                  u.el('span', 'person-date', row, parts[2] || '');
                }
              });
            }
          },
        'frame.22': (base, S) =>
          function (_c) {
            const { ctx, foot, note } = _c;
            if (ctx.display === 'panel') {
              const notes = foot.querySelector('.dock-section:nth-child(3)');
              const oldNote = notes.querySelector('.dock-note');
              if (oldNote) oldNote.remove();
              note.style.cssText =
                'display:block;position:static;width:auto;max-width:none;margin:4px 2px;padding:8px 10px;text-align:left;font:16px Arial,sans-serif;font-weight:400;line-height:1.25;white-space:normal;overflow-wrap:anywhere;background:#fafbfd;border:2px inset #e0e5eb;box-shadow:none;transform:none;z-index:auto;';
              if (_c.aside) _c.aside.insertBefore(note, _c.aside.children[1] || null);
              else notes.appendChild(note);
            }
          },
        'frame.23': (base, S) =>
          function (_c) {
            base(_c);
            _c.foot.appendChild(_c.statusbar);
          },
      },
    },
  });
})();
