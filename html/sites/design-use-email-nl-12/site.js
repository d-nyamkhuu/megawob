// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-nl-12',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'pixel',
        'brand': 'MailBox',
        'nav': 'Mail  Contacts  Calendar  Settings',
        'bg': '#d5edf1',
        'surface': '#fffdf2',
        'fg': '#092850',
        'line': '#11345c',
        'title': '#c6e2eb',
        'control': '#e0edf0',
        'accent': '#00b5c1',
        'accentfg': '#052449',
        'sel': '#c4e2ed',
        'font': '"DejaVu Sans Mono",monospace',
        'bar': 88,
        'foot': 140,
        'note':
          'left:1%;top:11%;width:98%;height:18%;font-size:clamp(23px,3vw,51px);padding:25px 40px;background:#fff8cd;border:4px solid #14365c',
        'end': 'right:2%;bottom:4%;padding:17px 40px;font-size:30px;border:4px solid #11345c',
        'geo': {
          'folders': 'left:1%;top:29%;width:18.5%;height:69%',
          'ledger': 'left:19.7%;top:29%;width:79.3%;height:69%',
          'document': 'left:40%;top:32%;width:59%;height:65%;display:none',
          'editor': 'left:40%;top:50%;width:59%;height:47%;display:none',
          'contacts': 'display:none',
        },
        'site': 'design-use-email-nl-12',
        'scenario': 'nl',
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
        'folderList': ['inbox', 'sent', 'drafts', 'archive', 'spam', 'trash'],
        'rowHeight': 74,
        'stack': true,
        'dock': [],
      },
      parts: {
        'frame.7': () => () => {},
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.13': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E, footer } = _c;
            if (C.style === 'pixel') {
              E('span', '', footer, 'Quick action:');
              const disabled = E('button', 'quick-disabled', footer, 'Star this message');
              disabled.disabled = true;
              const tools = E('div', 'footer-real-tools', footer);
              for (const op of ['Reply', 'Forward', 'Delete']) {
                const b = E('button', '', tools, op);
                b.type = 'button';
                b.addEventListener('click', () => {
                  const k = op.toLowerCase();
                  const target = document.querySelector('[data-target=\"toolbar:' + k + '\"]');
                  if (target) target.click();
                });
              }
            }
            if (!C.foot) footer.hidden = true;
          },
        'frame.15': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E, ctx } = _c;
            if (ctx.display !== 'hidden') {
              const note = E('aside', 'task-note', document.body);
              note.dataset.display = ctx.display;
              if (C.noteTitle) E('div', 'note-title', note, C.noteTitle);
              E('div', 'instruction', note, ctx.instruction);
            }
          },
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            base(_c);
            if (_c.submit && !_c.submit.classList.contains('end-home')) {
              const place = _c.ctx.rng.fork('chrome/site').pick(['center', 'menubar']);
              _c.submit.classList.remove('end-center', 'end-menubar');
              _c.submit.classList.add('end-' + place);
            }
          },
      },
    },
  });
})();
