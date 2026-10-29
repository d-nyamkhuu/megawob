// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-star-reply-04',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'plain',
        'brand': 'WebMail',
        'nav': 'Inbox   Compose   Folders   Address Book   Options   Help',
        'bg': '#fff',
        'surface': '#fff',
        'fg': '#000',
        'line': '#444',
        'title': '#fff',
        'control': '#ddd',
        'accent': '#ddd',
        'accentfg': '#000',
        'sel': '#ddd',
        'font': '"Times New Roman",serif',
        'bar': 60,
        'note': 'left:2%;top:9%;width:96%;padding:8px 0;border:0;border-block:1px solid #111;font-size:20px',
        'end': 'right:2%;bottom:1.5%;padding:7px 32px',
        'geo': {
          'folders': 'display:none',
          'ledger': 'left:2%;top:11%;width:25%;height:34%',
          'document': 'left:2%;top:11%;width:96%;height:45%;border:0;border-bottom:1px solid #111',
          'editor': 'left:2%;top:57%;width:96%;height:36%;border:0;border-bottom:1px solid #111',
          'contacts': 'display:none',
        },
        'site': 'design-use-email-star-reply-04',
        'scenario': 'star-reply',
        'platform': 'web',
        'account': 'Help  |  My Account  |  Sign Out',
        'noteTitle': null,
        'folderLabels': {
          'sent': 'Sent',
          'drafts': 'Drafts',
          'junk': 'Junk',
          'spam': 'Spam',
          'templates': 'Templates',
          'compose': 'Compose',
        },
        'folderList': ['inbox', 'starred', 'important', 'archive', 'trash'],
        'rowHeight': 34,
        'stack': true,
        'dock': [],
        'foot': true,
      },
      parts: {
        'frame.3': (base, St) =>
          function (_c) {
            const { E } = _c;
            const S = (d, x) =>
              '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + d + '"/>' + (x || '') + '</svg>';
            const mailIcon =
              '<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="3" y="3" width="26" height="28" rx="3" fill="#677b89" opacity=".25"/><rect x="4" y="2" width="25" height="27" rx="2" fill="#f7fbff" stroke="#92a9ba"/><path d="M4 3h25v15L16 24 4 16z" fill="#309bef"/><path d="M6 4h21v16H6z" fill="#c6e6ff"/><path d="M4 11l12 9 13-9v17H4z" fill="#f3f7f9"/><path d="m4 28 10-10h4l11 10" fill="#e6ebef"/><path d="m4 11 12 9 13-9" stroke="#c3d2dc" stroke-width=".7"/></svg>';
            const bar = E('header', 'desktop-bar', document.body);
            const tb = E('div', 'kde-title', bar);
            E('span', 'kde-appicon', tb).innerHTML = mailIcon;
            E('span', 'kde-appname', tb, 'KMail');
            const wc = E('span', 'kde-wc', tb);
            wc.innerHTML = S('M5 18h14') + S('M5 5h14v14H5z') + S('m5 5 14 14 M19 5 5 19');
            const kt = E('div', 'kde-toolbar', bar);
            const tools = [
              ['New Message', 'M3 10 12 3l9 7v11H3z M3 10l9 6 9-6'],
              ['Reply', 'M9 3 2 10l7 6v-4c7-1 10 1 10 7 4-9-2-12-10-12z', 1],
              ['Reply All', 'm8 4-6 6 6 6 M14 3l7 7-7 6v-4c-7-1-10 1-10 7-4-9 2-12 10-12z'],
              ['Forward', 'm15 3 7 7-7 6v-4C8 11 5 13 5 19 1 10 7 7 15 7z'],
              0,
              ['Delete', 'M4 6h16 M9 6V3h6v3 M6 6l1 15h10l1-15 M10 10v7 M14 10v7'],
              ['Mark as Spam', '', '', 1],
              0,
              ['More', ''],
            ];
            for (const t of tools) {
              if (!t) {
                E('span', 'kde-sep', kt);
                continue;
              }
              const b = E('button', 'kde-tool' + (t[2] === 1 ? ' active' : ''), kt);
              b.type = 'button';
              b.innerHTML =
                (t[0] === 'More'
                  ? ''
                  : t[0] === 'Mark as Spam'
                    ? S('', '<circle cx="12" cy="12" r="9"/><path d="m7 17 10-10"/>')
                    : S(t[1])) +
                '<span>' +
                t[0] +
                '</span>' +
                (t[0] === 'More' ? S('m6 9 6 6 6-6') : '');
              b.addEventListener('click', () => {
                const keys = {
                  'New Message': 'compose:new',
                  'Reply': 'toolbar:reply',
                  'Reply All': 'toolbar:replyall',
                  'Forward': 'toolbar:forward',
                  'Delete': 'toolbar:delete',
                };
                const target =
                  keys[t[0]] && document.querySelector('.mail-surface .toolbar [data-target="' + keys[t[0]] + '"]');
                if (target) target.click();
                else env.log('decoy', { label: t[0] });
              });
            }
            const sb = E('div', 'kde-search', kt);
            sb.innerHTML =
              S('', '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>') + '<span>Search mail...</span>';
            Object.assign(_c, { S, bar, kt, mailIcon, sb, tb, tools, wc });
          },
        'frame.4': () => () => {},
        'frame.5': () => () => {},
        'frame.6': () => () => {},
        'frame.7': () => () => {},
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.14': (base, St) =>
          function (_c) {
            const { C } = St;
            const { E, S, ctx, footer, mailIcon } = _c;
            if (C.foot) {
              E('span', 'kde-k', footer).innerHTML =
                '<svg viewBox="0 0 40 40"><path d="m9 13-3-2-3 5 3 2v5l-3 2 3 5 3-2 4 2v4h6v-4l4-2 3 2 3-5-3-2v-5l3-2-3-5-3 2-4-2V7h-6v4z"/><circle cx="16" cy="21" r="7" fill="#31363b"/><path d="M16 7h5v12l9-12h6L25 22l11 13h-7l-8-10v10h-5z"/></svg>';
              E('span', 'kde-files', footer).innerHTML =
                '<svg viewBox="0 0 32 32"><path d="M3 4h10l3 3h13v21H3z" fill="#2179b6"/><path d="M4 9h25v18H4z" fill="#329fe0"/><path d="M5 7h23v3H5z" fill="#e7f4fb"/></svg>';
              const tk = E('span', 'kde-task', footer);
              tk.innerHTML = mailIcon + '<span>KMail</span>';
              const tr = E('span', 'kde-tray', footer);
              tr.innerHTML =
                S('M3 9h4l5-4v14l-5-4H3z M16 8c3 2 3 6 0 8 M19 5c5 4 5 10 0 14') +
                S('M3 9c5-5 13-5 18 0 M6 13c3-3 9-3 12 0 M10 17h4') +
                S('M7 4h10v17H7z M10 2h4 M4 8H2v10h2 M20 8h2v10h-2 M10 7v11 M14 7v11') +
                '<span>10:36</span><span>Apr 23, 2018</span>';
            }
            const gear = E('span', 'kde-gear', document.body);
            gear.innerHTML =
              '<svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="M10 1h4l1 3 2 1 3-1 2 4-2 2v3l2 2-2 4-3-1-2 1-1 3h-4l-1-3-2-1-3 1-2-4 2-2v-3L2 8l2-4 3 1 2-1z M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8"/></svg>';
            if (ctx.display !== 'hidden') {
              const note = E('aside', 'task-note', document.body);
              note.dataset.display = ctx.display;
              if (C.noteTitle) E('div', 'note-title', note, C.noteTitle);
              E('div', 'instruction', note, ctx.instruction);
            }
            Object.assign(_c, { gear });
          },
        'frame.15': () => () => {},
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base, St) =>
          function (_c) {
            const { E, ctx, kt, sb } = _c;
            if (!ctx.finish) {
              const endR = ctx.rng.fork('chrome/end');
              const keepDefault = endR.bool(0.5);
              const placement = keepDefault ? 'footer' : endR.pick(['toolbar', 'link']);
              const bank =
                ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
                  ? ctx.content.END_LABELS
                  : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
              const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
              const label = keepDefault ? 'Submit' : labelOf(endR.pick(bank));
              const addEnd = (parent, cls, text) => {
                const b = E('button', 'end-control ' + cls, parent, text);
                b.type = 'button';
                b.dataset.role = 'submit';
                b.setAttribute('aria-label', text);
                b.title = text;
                b.addEventListener('click', () => ctx.submit());
                return b;
              };
              const cr = ctx.rng.fork('chrome/collide');
              let collide = null;
              if (cr.bool(0.3)) {
                const options = [...new Set(bank.map(labelOf))].filter(
                  (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
                );
                if (options.length) collide = cr.pick(options);
              }
              if (placement === 'toolbar') {
                _c.submit = addEnd(kt, 'toolbar-end', label);
                kt.insertBefore(_c.submit, sb);
              } else {
                _c.submit = addEnd(document.body, placement === 'link' ? 'end-link' : '', label);
              }
              if (collide) {
                const b = E('button', 'kde-pq', kt, collide);
                b.type = 'button';
                b.dataset.role = 'xtra';
                b.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
                kt.insertBefore(b, sb);
              }
            }
          },
      },
    },
  });
})();
