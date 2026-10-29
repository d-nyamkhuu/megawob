// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-search-04',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'skymail',
        'brand': '◆   SkyMail',
        'nav': '',
        'bg': '#5894c3',
        'surface': '#fff',
        'fg': '#14243a',
        'line': '#c4d0d9',
        'title': 'linear-gradient(#338dcb,#176aa9)',
        'control': 'linear-gradient(#fff,#e7edf1)',
        'accent': '#168be0',
        'accentfg': '#fff',
        'sel': '#c6e5fb',
        'selfg': '#10233a',
        'font': 'Arial,sans-serif',
        'note': 'right:2%;top:7%;width:25%',
        'end': 'left:2%;bottom:3%',
        'geo': {
          'folders': 'left:2%;top:6%;width:24%;height:35%',
          'ledger': 'left:14%;top:14%;width:56%;height:58%',
          'document': 'right:2%;top:58%;width:32%;height:39%',
          'editor': 'right:2%;top:50%;width:36%;height:47%',
          'contacts': 'display:none',
        },
        'site': 'design-use-email-search-04',
        'scenario': 'search',
        'platform': 'desktop',
        'account': 'Alex Carter',
        'noteTitle': 'Task',
        'folderLabels': {
          'sent': 'Sent',
          'drafts': 'Drafts',
          'junk': 'Junk',
          'spam': 'Spam',
          'templates': 'Templates',
          'compose': 'Compose',
        },
        'folderList': ['inbox', 'sent', 'drafts', 'archive', 'trash'],
        'rowHeight': 32,
        'stack': false,
        'dock': ['✉   Mail', '▦   Calendar', '♟   Contacts', '☑   Tasks', '▤   Notes'],
        'foot': true,
      },
      parts: {
        'frame.7': () => () => {},
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.12': (base, St) =>
          function (_c) {
            const { E, stage } = _c;
            const scenery = E('div', 'desktop-scenery', stage);
            scenery.setAttribute('aria-hidden', 'true');
            const recent = E('aside', 'desktop-card recent-files', stage);
            E('h3', '', recent, 'Recent Files');
            for (const [icon, name] of [
              ['▤', 'Product Plan.docx'],
              ['▦', 'Budget Q3.xlsx'],
              ['▰', 'Roadmap.pdf'],
              ['▧', 'Photo.jpg'],
            ]) {
              const r = E('div', 'file-item', recent);
              E('b', '', r, icon);
              E('span', '', r, name);
            }
            const cal = E('aside', 'desktop-card team-calendar', stage);
            E('h3', '', cal, 'Team Calendar');
            for (const t of [
              '10:00   Project sync',
              '11:30   Marketing review',
              '1:00   Lunch',
              '3:00   Roadmap discussion',
            ])
              E('div', 'calendar-item', cal, t);
            document.body.append(recent, cal);
            const mailtools = E('div', 'desktop-mail-toolbar', stage);
            for (const [icon, label, drop, action] of [
              ['□', '', true, 'select'],
              ['↶', 'Reply', true, 'reply'],
              ['↪', 'Forward', true, 'forward'],
              ['▤', 'Delete', false, 'delete'],
              ['▣', 'Mark as', true, 'unread'],
              ['▰', 'Move to', true, 'move'],
            ]) {
              const b = E('button', 'mail-tool', mailtools);
              b.type = 'button';
              b.dataset.action = action;
              E('b', '', b, icon);
              if (label) E('span', '', b, label);
              if (drop) E('i', '', b, '▾');
              b.addEventListener('click', () => {
                const app = document.querySelector('.am-app');
                if (!app) return;
                let target = null;
                if (action === 'select') target = app.querySelector('.am-lhead input[type=checkbox]');
                else if (action === 'delete') target = app.querySelector('.am-bar .am-tb.del, .am-bulk .am-tb.del');
                else if (action === 'unread')
                  target = app.querySelector(
                    '.am-bar button[title="Mark unread"], .am-bulk button[title="Mark as unread"]',
                  );
                else if (action === 'move') target = app.querySelector('.am-bar button[title="Move to"]');
                else if (action === 'reply' || action === 'forward')
                  target = [...app.querySelectorAll('.am-acts button')].find((x) =>
                    x.textContent.trim().toLowerCase().includes(action),
                  );
                if (target) target.click();
              });
            }
            const sort = E('button', 'mail-tool sort-tool', mailtools);
            sort.type = 'button';
            sort.setAttribute('aria-label', 'Sort by');
            E('span', '', sort, 'Sort by');
            E('i', '', sort, '▾');
            document.body.append(mailtools);
            const footer = E('footer', 'desktop-footer', document.body);
            Object.assign(_c, { cal, footer, mailtools, recent, scenery, sort });
          },
        'frame.14': (base, St) =>
          function (_c) {
            const { C } = St;
            const { E, footer } = _c;
            if (C.foot) {
              const icons = ['mail', 'calendar', 'contacts', 'tasks', 'notes'];
              for (let i = 0; i < C.dock.length; i++) {
                const item = E('span', 'dock-item', footer);
                item.innerHTML =
                  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' +
                  [
                    'M3 5h18v14H3z M3 6l9 7 9-7',
                    'M5 4v3m14-3v3M4 8h16v12H4z M8 11h2m3 0h3m-8 4h2m3 0h3',
                    'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c.5-4 3-6 8-6s7.5 2 8 6',
                    'M5 4h14v16H5z M8 12l2.5 2.5L16 9',
                    'M6 3h12v18H6z M9 7h6m-6 4h6m-6 4h6',
                  ][i] +
                  '"/></svg><span class="dock-label">' +
                  C.dock[i].replace(/^\S+\s*/, '') +
                  '</span>';
                item.setAttribute('aria-hidden', 'true');
              }
              const meter = E('div', 'storage-meter', footer);
              E('span', '', meter, '2.1 GB of 10 GB used');
              const track = E('i', '', meter);
              E('b', '', track);
            }
          },
      },
    },
  });
})();
