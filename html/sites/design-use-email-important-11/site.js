(function () {
  'use strict';
  const C = {
    'style': 'xp',
    'brand': 'My Mail',
    'nav': 'File   Edit   View   Tools   Help',
    'bg': 'linear-gradient(#3c86e7 0 57%,#8db74a 57%,#366e1b)',
    'surface': '#f0eddf',
    'fg': '#111',
    'line': '#6a8fbd',
    'title': 'linear-gradient(#2c8dff,#0053df,#0054e8)',
    'titlefg': '#fff',
    'control': 'linear-gradient(#fff,#dde2ed)',
    'accent': 'linear-gradient(#fff,#d8e1ec)',
    'accentfg': '#003d8b',
    'sel': '#adc7f0',
    'bar': 0,
    'foot': 32,
    'note': 'right:1.4%;top:9%;width:19%;height:64%;background:#fffde2',
    'end': 'right:3%;top:67%;width:16%',
    'ob': ['tour', 'Skip tour'],
    'geo': {
      'folders': 'left:17%;top:25%;width:13%;height:58%',
      'ledger': 'left:31%;top:25%;width:46%;height:29%',
      'document': 'left:31%;top:55%;width:46%;height:28%',
      'editor': 'left:40%;top:56%;width:37%;height:27%',
      'contacts': 'display:none',
    },
    'site': 'design-use-email-important-11',
    'scenario': 'important',
    'platform': 'desktop',
    'account': 'Mon Apr 14  10:24 AM',
    'noteTitle': null,
    'folderLabels': {
      'sent': 'Sent',
      'drafts': 'Drafts',
      'junk': 'Junk',
      'spam': 'Spam',
      'templates': 'Templates',
      'compose': 'Compose',
    },
    'folderList': ['inbox', 'sent', 'drafts', 'junk', 'trash'],
    'rowHeight': 40,
    'stack': false,
    'dock': [],
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    initialOverlay: { kind: 'tour' },
    frame(ctx) {
      const E = (tag, cls, parent, text) => ctx.util.el(tag, cls, parent, text);
      document.body.dataset.design = C.style;
      const bar = E('header', 'desktop-bar', document.body);
      E('span', 'brand', bar, C.brand);
      if (C.nav) {
        const n = E('nav', 'nav', bar);
        for (const label of C.nav.split(/\s{2,}/)) {
          const a = E('button', 'chrome-nav', n, label);
          a.type = 'button';
          a.addEventListener('click', () => env.log('decoy', { label }));
        }
      }
      E('span', 'account', bar, C.account);
      const di = E('div', 'desktop-icons', document.body);
      di.innerHTML =
        '<div><svg viewBox="0 0 50 50"><path d="M4 14h17l5 5h20v25H4Z"/></svg>My Documents</div><div><svg viewBox="0 0 50 50"><path d="M6 5h38v28H6Z M22 33v8h-8v4h25v-4h-8v-8"/></svg>My Computer</div><div><svg viewBox="0 0 50 50"><path d="M11 10h28l-3 35H14Z M7 10h36 M18 5h14"/></svg>Recycle Bin</div>';
      const stage = E('main', 'stage', document.body);
      const footer = E('footer', 'desktop-footer', document.body);
      footer.hidden = false;
      const start = E('span', 'xp-start', footer, '◆ start');
      const task = E('span', 'xp-task', footer, '✉ My Mail');
      E('span', '', footer, '10:24 AM');
      if (C.foot) for (const t of C.dock) E('span', '', footer, t);
      const display = ctx.display === 'toast' && window.innerWidth < 1260 ? 'header' : ctx.display;
      if (display !== 'hidden') {
        const note = E('aside', 'task-note', document.body);
        note.dataset.display = display;
        if (C.noteTitle) E('div', 'note-title', note, C.noteTitle);
        E('div', 'instruction', note, ctx.instruction);
      }
      const endR = ctx.rng.fork('chrome/end'),
        collideR = ctx.rng.fork('chrome/collide');
      const labels = (
        (ctx.content && ctx.content.END_LABELS) || [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
          'Complete',
          "I'm done",
        ]
      ).map((x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)));
      const rest = labels.filter((x) => x.trim().toLowerCase() !== 'submit');
      const legacy = endR.bool(0.5);
      const endLabel = legacy ? 'Submit' : rest.length ? endR.pick(rest) : endR.pick(labels);
      const placement = legacy ? 'panel' : endR.pick(['toolbar', 'footer']);
      let submit = null;
      if (!ctx.finish) {
        submit = E('button', 'end-control', document.body, endLabel);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.dataset.placement = placement;
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', () => ctx.submit());
      }
      if (collideR.bool(0.3)) {
        const options = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (options.length) {
          const text = collideR.pick(options);
          const b = E('button', 'pq-xtra', document.body, text);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
      }
      /* Fit seeded instructions inside their reference region. */ for (const n of document.querySelectorAll(
        '.task-note',
      )) {
        let f = parseFloat(getComputedStyle(n).fontSize);
        while (n.scrollHeight > n.clientHeight + 1 && f > 12) {
          f -= 0.5;
          n.style.fontSize = f + 'px';
        }
      }
      for (const e of document.body.querySelectorAll('.task-note,.end-control,.obstruction')) {
        const r = e.getBoundingClientRect();
        e.style.left = Math.round(r.left) + 'px';
        e.style.top = Math.round(r.top) + 'px';
        e.style.width = Math.round(r.width) + 'px';
        e.style.height = Math.round(r.height) + 'px';
        e.style.right = 'auto';
        e.style.bottom = 'auto';
      }
      return { stage, submit };
    },
    overlay(ctx) {
      if (ctx.initial) {
        const e = ctx.util.el('aside', 'obstruction tour', document.body);
        e.setAttribute('role', 'dialog');
        ctx.util.el('h3', '', e, 'Welcome to My Mail!');
        ctx.util.el('p', '', e, 'Here you can read and manage your email. Take a quick tour to see key features.');
        const skip = ctx.util.el('button', '', e, 'Skip tour');
        skip.type = 'button';
        skip.dataset.dismiss = 'true';
        skip.addEventListener('click', () => ctx.dismiss());
        return { el: e, dismiss: skip };
      }
      const e = ctx.util.el('aside', 'perturb ' + ctx.kind, document.body);
      const texts = {
        cookie: ['Cookie preferences', 'Choose which cookies we may use.', 'Reject optional'],
        toast: ['Mail synchronized', 'Your mailbox is up to date.', 'Dismiss'],
        chat: ['Mail support', 'Need any help today?', 'Close chat'],
        promo: ['Get more from Mail', 'Try the expanded mailbox plan.', 'No thanks'],
        banner: ['Service announcement', 'Scheduled maintenance tonight.', 'Dismiss'],
      };
      const [title, body, label] = texts[ctx.kind];
      ctx.util.el('h3', '', e, title);
      ctx.util.el('p', '', e, body);
      const b = ctx.util.el('button', '', e, label);
      b.type = 'button';
      b.addEventListener('click', () => ctx.dismiss());
      return { el: e, dismiss: b };
    },
  });
})();
