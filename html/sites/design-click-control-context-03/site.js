// Design on templates/site/ui-click-hover-menu-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-click-control-context-03',
    styles: ['site.css'],
    template: 'site/click-control-hover-menu-01',
    design: {
      cfg: {
        'title': 'Cloud Drive',
        'theme': 'soft',
        'layout': 'dock',
        'tools': 'File    Edit    View    Tools    Help',
        'foot': 'Task List|Status|Notes|Actions',
      },
      parts: {
        'frame.22': (base, S) =>
          function (_c) {
            if (_c.ctx.display === 'panel' && window.innerWidth <= 1250) {
              _c.note.dataset.display = 'header';
              return;
            }
            return base(_c);
          },
        'frame.36': (base, S) =>
          function (_c) {
            base(_c);
            // The Cloud Drive design replaces the template's header and status bar.
            // Keep their sampled end controls in the visible Actions section.
            const actions = _c.foot.querySelector('.dock-section:last-child');
            if (_c.submit && _c.placement !== 'actions') actions.appendChild(_c.submit);
            _c.head.querySelectorAll('.xtra-task').forEach((button) => actions.appendChild(button));
          },
        'frame.17': (base, S) =>
          function (_c) {
            const { u } = _c;
            const cloudRail = u.el('nav', 'cloud-rail', document.body);
            const brand = u.el('div', 'cloud-brand', cloudRail);
            brand.innerHTML =
              '<svg viewBox="0 0 48 34" aria-hidden="true"><path d="M14 30h22a10 10 0 0 0 0-20 13 13 0 0 0-25-2A11 11 0 0 0 14 30Z" fill="#0875f9"/></svg><b>Cloud Drive</b>';
            [
              ['▰', 'My Files'],
              ['♧', 'Shared with me'],
              ['◷', 'Recent'],
              ['★', 'Starred'],
              ['▤', 'Trash'],
            ].forEach(([ico, label], i) => {
              const row = u.el('div', i === 0 ? 'cloud-nav-item active' : 'cloud-nav-item', cloudRail);
              u.el('span', 'cloud-nav-icon', row, ico);
              u.el('span', '', row, label);
            });
            const toolbar = u.el('div', 'cloud-toolbar', document.body);
            [
              ['＋', 'New', 'primary'],
              ['↑', 'Upload', ''],
              ['♧', 'Share', ''],
              ['↓', 'Download', ''],
              ['▤', 'Delete', ''],
            ].forEach(([ico, label, kind]) => {
              const b = u.el('button', 'cloud-action ' + kind, toolbar);
              b.type = 'button';
              u.el('span', 'action-icon', b, ico);
              u.el('span', '', b, label);
              if (label === 'New') u.el('span', 'action-chevron', b, '⌄');
            });
            const views = u.el('div', 'cloud-views', toolbar);
            u.el('button', 'view active', views, '▦').type = 'button';
            u.el('button', 'view', views, '☷').type = 'button';
            const search = u.el('input', 'cloud-search', toolbar);
            search.type = 'search';
            search.placeholder = '⌕   Search files';
            const related = u.el('aside', 'cloud-related', document.body);
            u.el('h2', '', related, 'Related');
            [
              ['Dubois forecast 08.03.2019.csv', 'Aug 3, 2019', 'xlsx'],
              ['Annual report.pdf', 'Apr 3, 2019', 'pdf'],
              ['Meeting notes.docx', 'Mar 28, 2019', 'docx'],
              ['Paris.jpg', 'Mar 22, 2019', 'jpg'],
              ['Marketing plan.pptx', 'Jul 30, 2019', 'pptx'],
              ['Product roadmap.xlsx', 'Jul 18, 2019', 'xlsx'],
              ['Team photo.jpg', 'Jul 14, 2019', 'jpg'],
              ['Notes.txt', 'Jun 2, 2019', 'txt'],
            ].forEach(([name, date, type]) => {
              const row = u.el('div', 'related-row', related);
              const marker = u.el('span', 'related-marker ' + type, row);
              marker.innerHTML =
                type === 'jpg'
                  ? '<svg viewBox="0 0 64 48"><rect width="64" height="48" rx="4" fill="#a8d5f0"/><circle cx="47" cy="13" r="6" fill="#fff0bb"/><path d="M0 39 18 20l13 14 12-12 21 21v5H0Z" fill="#5d925a"/><path d="m0 42 21-15 13 12 14-12 16 14v7H0Z" fill="#356744"/></svg>'
                  : type === 'pdf'
                    ? '<svg viewBox="0 0 40 44"><path d="M20 5c4 8 1 17-5 27m-6 3c7-9 18-13 27-11M12 13c4 8 12 14 21 15m-25 8c8-1 21-10 27-19" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"/></svg>'
                    : type === 'xlsx'
                      ? '<svg viewBox="0 0 40 44"><rect x="8" y="8" width="25" height="28" rx="2" fill="none" stroke="white" stroke-width="2"/><path d="M16 9v26m9-26v26M9 17h23M9 26h23" stroke="white" stroke-width="2"/></svg>'
                      : type === 'pptx'
                        ? '<b>P</b>'
                        : '<svg viewBox="0 0 40 44"><path d="M9 11h22M9 18h22M9 25h15" stroke="white" stroke-width="3"/></svg>';
              const info = u.el('div', 'related-info', row);
              u.el('span', 'related-name', info, name);
              u.el('span', 'related-date', info, date);
            });
            _c.aside = null;
            Object.assign(_c, { brand, cloudRail, related, search, toolbar, views });
          },
      },
    },
  });
})();
