// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  const G = {
    term: '<rect x="7" y="8" width="34" height="28" fill="#0c0c10" stroke="#8a8fb8" stroke-width="3"/><rect x="14" y="38" width="20" height="4" fill="#8a8fb8"/>',
    folder: '<path d="M5 14h14l4 5h20v22H5z" fill="#8f94e6" stroke="#4a4e96" stroke-width="2"/>',
    edit: '<rect x="9" y="6" width="26" height="36" fill="#eceef8" stroke="#555" stroke-width="2"/><path d="M14 16h16M14 22h16M14 28h10" stroke="#777"/><path d="M38 6l5 5-14 18-6 1 1-6z" fill="#d9b24a" stroke="#555"/>',
    mail: '<rect x="4" y="10" width="40" height="28" fill="#eceef8" stroke="#44488a" stroke-width="2"/><path d="M4 11l20 15 20-15" fill="none" stroke="#44488a" stroke-width="2"/>',
    web: '<circle cx="24" cy="24" r="19" fill="#4a5bd0" stroke="#22265a" stroke-width="2"/><path d="M5 24h38M8 14h32M8 34h32M24 5c-12 12-12 26 0 38M24 5c12 12 12 26 0 38" fill="none" stroke="#bcc4ff"/>',
    calc: '<rect x="8" y="5" width="32" height="38" fill="#8f94e6" stroke="#44488a" stroke-width="2"/><path d="M13 12h22v6H13z" fill="#dde"/><path d="M14 25h4M22 25h4M30 25h4M14 31h4M22 31h4M30 31h4M14 37h4M22 37h4M30 37h4" stroke="#fff" stroke-width="3"/>',
    sys: '<rect x="7" y="6" width="34" height="26" fill="#d8dbf5" stroke="#44488a" stroke-width="2"/><rect x="11" y="10" width="26" height="18" fill="#4f6be8"/><rect x="14" y="36" width="20" height="6" fill="#aab" stroke="#44488a"/>',
    disk: '<path d="M8 11v26c0 5 32 5 32 0V11" fill="#c4c7ea" stroke="#44488a" stroke-width="2"/><ellipse cx="24" cy="11" rx="16" ry="6" fill="#e6e8fa" stroke="#44488a" stroke-width="2"/>',
    net: '<rect x="17" y="5" width="14" height="11" fill="#8f94e6" stroke="#44488a" stroke-width="2"/><rect x="5" y="30" width="14" height="11" fill="#8f94e6" stroke="#44488a" stroke-width="2"/><rect x="29" y="30" width="14" height="11" fill="#8f94e6" stroke="#44488a" stroke-width="2"/><path d="M24 16v7M12 30v-7h24v7" fill="none" stroke="#44488a" stroke-width="2"/>',
    help: '<circle cx="24" cy="24" r="19" fill="#4a5bd0" stroke="#22265a" stroke-width="2"/><text x="24" y="33" text-anchor="middle" font-size="28" font-weight="bold" fill="#fff" font-family="Arial">?</text>',
    logo: '<path d="M24 3l17 11v20L24 45 7 34V14z" fill="#33375f"/><path d="M24 10l8 8-8 8-8-8z" fill="#d8dbf5"/>',
  };
  function shelfIcon(k) {
    const forms = {
      term: '<rect x="5" y="5" width="38" height="37" fill="url(#sMetal)"/><rect x="9" y="9" width="30" height="27" fill="#090c11"/><path d="M10 36h26" stroke="#fff"/>',
      folder:
        '<path d="M4 10h16l5 5h18v28H4z" fill="url(#sViolet)"/><path d="M5 17h37v26H5z" fill="url(#sViolet)"/><path d="M5 12h14l5 5h17" stroke="#fff" fill="none"/>',
      mail: '<rect x="2" y="5" width="44" height="38" fill="url(#sViolet)"/><path d="M3 6l21 21L45 6M3 42l14-17M45 42 31 25" fill="none" stroke="#202747" stroke-width="1.5"/><path d="M4 7l20 18L44 7" fill="none" stroke="#fff"/>',
      disk: '<path d="M8 10v27c0 8 32 8 32 0V10z" fill="url(#sMetal)"/><ellipse cx="24" cy="10" rx="16" ry="6" fill="#d3d8e2"/><path d="M8 20c0 8 32 8 32 0M8 30c0 8 32 8 32 0" stroke="#343d58" fill="none"/><path d="M10 21c2 6 26 6 28 0M10 31c2 6 26 6 28 0" stroke="#f8f8ff" fill="none"/>',
      logo: '<path d="M24 3 8 19 19 30 26 23 21 18 31 8zM24 45 40 29 29 18 22 25 27 30 17 40z" fill="url(#sMetal)" stroke="#28304e" stroke-width="2"/>',
      calc: '<rect x="8" y="3" width="32" height="42" fill="url(#sMetal)"/><g fill="url(#sViolet)"><path d="M12 8h6v6h-6zM21 8h6v6h-6zM30 8h6v6h-6zM12 18h6v6h-6zM21 18h6v6h-6zM30 18h6v6h-6zM12 28h6v6h-6zM21 28h6v6h-6zM30 28h6v6h-6zM12 37h6v5h-6zM21 37h6v5h-6zM30 37h6v5h-6z"/></g>',
      sys: '<rect x="9" y="3" width="30" height="32" fill="url(#sMetal)"/><rect x="13" y="7" width="22" height="22" fill="url(#sViolet)"/><path d="M12 35h24l8 10H4z" fill="url(#sMetal)"/><path d="M11 39h26M27 42h9" stroke="#434c68"/>',
      help: '<circle cx="24" cy="24" r="19" fill="url(#sViolet)"/><text x="24" y="34" text-anchor="middle" font-size="30" fill="#17204b" stroke="#e7e8fc" stroke-width=".4" font-family="Arial">?</text>',
    };
    return (
      '<svg viewBox="0 0 48 48"><defs><linearGradient id="sViolet" x2=".9" y2="1"><stop stop-color="#f4edff"/><stop offset=".45" stop-color="#a8a0ef"/><stop offset="1" stop-color="#4c5598"/></linearGradient><linearGradient id="sMetal" x2="1" y2=".3"><stop stop-color="#f2f3fc"/><stop offset=".4" stop-color="#b0b8cc"/><stop offset="1" stop-color="#6c7798"/></linearGradient></defs><g stroke="#39415d" stroke-width="1.2">' +
      (forms[k] ||
        G[k]
          .replace(/fill="#8f94e6"/g, 'fill="url(#sViolet)"')
          .replace(/fill="#4a5bd0"/g, 'fill="url(#sViolet)"')
          .replace(/fill="#eceef8"/g, 'fill="url(#sMetal)"')) +
      '</g></svg>'
    );
  }
  env.site({
    name: 'design-use-email-reply-04',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'civic',
        'brand': 'CityMail',
        'nav': 'A cleaner, stronger community',
        'bg': '#f4f8fb',
        'surface': '#fff',
        'fg': '#112039',
        'line': '#c4cdd7',
        'title': '#f1f4f7',
        'control': '#edf1f5',
        'accent': '#235d98',
        'sel': '#e8f0f8',
        'bar': 50,
        'note': 'right:1.2%;top:13%;width:22%;height:43%;font-weight:400',
        'end': 'right:3%;top:39%;width:18%',
        'geo': {
          'folders': 'display:none',
          'ledger': 'left:1%;top:29%;width:18%;height:42%;border:0;background:transparent',
          'document': 'left:20.5%;top:4%;width:54.5%;height:90%',
          'editor': 'left:20.5%;top:4%;width:54.5%;height:90%',
          'contacts': 'display:none',
        },
        'site': 'design-use-email-reply-04',
        'scenario': 'reply',
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
        'rowHeight': 52,
        'stack': false,
        'foot': true,
        'dock': ['Workspace 1  ▸', 'MailTool', 'Terminal', 'File Manager', 'Apr 24   10:26'],
      },
      parts: {
        'frame.7': (base, S) =>
          function (_c) {
            const { E } = _c;
            const win = E('div', 'irix-win', document.body);
            const wt = E('div', 'irix-title', document.body);
            const motif = E('span', '', wt);
            motif.innerHTML = '<svg viewBox="0 0 16 18"><path d="M8 1 2 6h12zM8 17 2 12h12zM2 9h12"/></svg>';
            E('b', '', wt, 'MailTool');
            E('span', '', wt, '–');
            E('b', '', wt, 'Inbox');
            const gadgets = E('span', 'tb', wt);
            for (const g of ['▾', '×']) E('span', 'window-gadget', gadgets, g);
            const mb = E('div', 'irix-menu', document.body);
            for (const t of ['File', 'Edit', 'View', 'Message', 'Tools']) E('span', t === 'Message' ? 'on' : '', mb, t);
            E('span', 'help', mb, 'Help');
            const shelf = (cls, head, items) => {
              const s = E('div', 'irix-shelf ' + cls, document.body);
              if (head) E('div', 'shelf-head', s, head);
              for (const [g, l, on] of items) {
                const it = E('div', 'shelf-item' + (on ? ' on' : ''), s);
                const ic = E('span', 'ico', it);
                ic.innerHTML = shelfIcon(g);
                E('span', '', it, l);
              }
              return s;
            };
            shelf('left', 'Tools · ✕', [
              ['term', 'Terminal'],
              ['folder', 'File Manager'],
              ['edit', 'Text Editor'],
              ['mail', 'MailTool', 1],
              ['web', 'Browser'],
              ['calc', 'Calculator'],
            ]);
            {
              const r = shelf('right', '', [
                ['logo', 'I R I X'],
                ['sys', 'System'],
                ['disk', 'Disks'],
                ['net', 'Network'],
                ['help', 'Help'],
              ]);
              r.firstChild.classList.add('logo');
            }
            Object.assign(_c, { gadgets, mb, motif, shelf, win, wt });
          },
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.14': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E, ctx, footer } = _c;
            if (C.foot) {
              C.dock.forEach((t, i) => {
                const item = E('span', '', footer);
                if (i > 0 && i < 4) {
                  const ic = E('i', '', item);
                  ic.innerHTML = shelfIcon(['', 'mail', 'term', 'folder'][i]);
                }
                E('span', 'dock-label', item, t);
              });
              const corner = E('i', 'corner-icon', footer);
              corner.innerHTML = shelfIcon('disk');
            }
            if (ctx.display !== 'hidden') {
              const note = E('aside', 'task-note', document.body);
              note.dataset.display = ctx.display;
              if (C.noteTitle) E('div', 'note-title', note, C.noteTitle);
              E('div', 'instruction', note, ctx.instruction);
            }
          },
        'frame.15': () => () => {},
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            const { E, ctx } = _c;
            if (!ctx.finish) {
              const er = ctx.rng.fork('chrome/end');
              const labels =
                ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
                  ? ctx.content.END_LABELS
                  : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
              const textOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
              const placement = er.bool(0.5) ? 'composer' : er.pick(['title', 'dock']);
              const label =
                placement === 'composer'
                  ? textOf(labels.find((x) => textOf(x).toLowerCase() === 'submit') || labels[0] || 'Submit')
                  : textOf(er.pick(labels));
              const end = (cls, parent, text) => {
                const b = E('button', cls, parent, text);
                b.type = 'button';
                b.dataset.role = 'submit';
                b.setAttribute('aria-label', label);
                b.title = label;
                b.addEventListener('click', () => ctx.submit());
                return b;
              };
              _c.submit = end(
                'end-control' + (placement === 'composer' ? '' : ' place-' + placement),
                document.body,
                label,
              );
            }
            {
              const cr = ctx.rng.fork('chrome/collide');
              if (!ctx.finish && cr.bool(0.3)) {
                const labels =
                  ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
                    ? ctx.content.END_LABELS
                    : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
                const current = _c.submit.textContent.trim().toLowerCase();
                const pool = [
                  ...new Set(
                    labels.map((x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x))),
                  ),
                ].filter((x) => x.trim().toLowerCase() !== current);
                if (pool.length) {
                  const b = E(
                    'button',
                    'end-xtra ' + (cr.pick(['title', 'dock']) === 'title' ? 'xtra-title' : 'xtra-dock'),
                    document.body,
                    pool[cr.int(0, pool.length)],
                  );
                  b.type = 'button';
                  b.dataset.role = 'xtra';
                  b.addEventListener('click', () => env.log('decoy', { label: b.textContent, collide: true }));
                }
              }
            }
          },
      },
    },
  });
})();
