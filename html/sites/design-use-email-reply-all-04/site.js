(function () {
  'use strict';
  const C = {
    'style': 'mac',
    'brand': 'File   Edit   Message   Window',
    'nav': '',
    'bg': '#fff',
    'surface': '#fff',
    'fg': '#080808',
    'line': '#111',
    'title': 'repeating-linear-gradient(0deg,#fff 0 1px,#555 1px 2px)',
    'control': '#fff',
    'accent': '#fff',
    'accentfg': '#000',
    'sel': '#050505',
    'selfg': '#fff',
    'font': '"DejaVu Sans Mono",monospace',
    'note': 'right:2%;top:7%;width:25%',
    'end': 'left:2%;bottom:3%',
    'geo': {
      'folders': 'left:2%;top:6%;width:24%;height:35%',
      'ledger': 'left:14%;top:14%;width:56%;height:58%',
      'document': 'right:2%;top:58%;width:32%;height:39%',
      'editor': 'right:2%;top:50%;width:36%;height:47%',
      'contacts': 'display:none',
    },
    'site': 'design-use-email-reply-all-04',
    'scenario': 'reply-all',
    'platform': 'desktop',
    'account': 'Mon Apr 14  10:24 AM',
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
    'rowHeight': 40,
    'stack': false,
    'dock': [],
  };
  Object.assign(C, {
    style: 'breeze',
    brand: 'Mail - KDE Mail',
    nav: 'Mail  Contacts  Calendar  Tasks  Notes  Settings',
    bg: '#f2f5f8',
    surface: '#fff',
    fg: '#1d2a3b',
    line: '#d5dde5',
    title: 'linear-gradient(#e9edf2,#dce3ea)',
    control: '#f7f9fb',
    accent: '#1688ed',
    accentfg: '#fff',
    sel: '#d9ebfb',
    selfg: '#172f49',
    font: 'Arial,sans-serif',
    note: 'right:2%;top:7%;width:25%',
    end: 'right:2%;bottom:3%',
    geo: {
      folders: 'left:0;top:0;width:19%;height:100%',
      ledger: 'left:19%;top:0;width:56%;height:100%',
      document: 'left:75%;top:0;width:0;height:0',
      editor: 'display:none',
      contacts: 'display:none',
    },
    account: '',
    noteTitle: 'Task',
    rowHeight: 78,
  });
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
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
      const stage = E('main', 'stage', document.body);
      const summary = E('aside', 'mail-summary', document.body);
      E('h2', 'summary-heading', summary, 'Mailbox');
      const counts = [
        ['▱', 'Inbox', '8'],
        ['▤', 'Drafts', '2'],
        ['➤', 'Sent', '124'],
        ['▤', 'Trash', '16'],
      ];
      for (const [icon, label, count] of counts) {
        const row = E('div', 'summary-row', summary);
        E('span', 'summary-icon', row, icon);
        E('span', '', row, label);
        E('span', 'summary-count', row, count);
      }
      const storage = E('section', 'storage', summary);
      E('h2', 'summary-heading', storage, 'Storage');
      E('div', 'storage-track', storage);
      E('div', 'storage-copy', storage, '2.4 GB of 15 GB (16%)');
      const footer = E('footer', 'desktop-footer', document.body);
      if (!C.foot) footer.hidden = true;
      if (C.foot) for (const t of C.dock) E('span', '', footer, t);
      const display = ctx.display || 'header';
      let note = null;
      if (display !== 'hidden') {
        note = E('aside', 'task-note', document.body);
        note.dataset.display = display;
        if (C.noteTitle && display !== 'toast') E('div', 'note-title', note, C.noteTitle);
        E('div', 'instruction', note, ctx.instruction);
      }
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const home = er.bool(0.5);
        const place = home ? 'home' : er.pick(['center', 'menubar']);
        const labels = ctx.content && ctx.content.END_LABELS;
        const endWords = (
          Array.isArray(labels) && labels.length
            ? labels
            : ['Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
        ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
        const label = home ? 'Submit' : er.pick(endWords);
        submit = E('button', 'end-control end-' + place, document.body, label);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', () => ctx.submit());
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const pool = (
            Array.isArray(labels) && labels.length
              ? labels
              : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
          ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
          const choices = [...new Set(pool)].filter(
            (x) => x.trim().toLowerCase() !== String(label).trim().toLowerCase(),
          );
          if (choices.length) {
            const d = E('button', 'chrome-nav pq-xtra', bar, cr.pick(choices));
            d.type = 'button';
            d.dataset.role = 'xtra';
            d.addEventListener('click', () => env.log('decoy', { label: d.textContent, collide: true }));
          }
        }
      }
      if (C.ob) {
        const [type, label] = C.ob;
        const ob = E('aside', 'obstruction ' + type, document.body);
        ob.setAttribute('role', 'dialog');
        const content = {
          newsletter: ['The Hillview Newsletter', 'Ideas. People. A Brighter Tomorrow.'],
          announcement: [
            'Campus System Maintenance This Weekend',
            'Email may be slower than usual from Sat 8:00 PM to Sun 6:00 AM.',
          ],
          tour: [
            'Welcome to My Mail!',
            'Here you can read and manage your email. Take a quick tour to see key features.',
          ],
          update: [
            'A newer version is available',
            'Get the latest features and security updates for a better experience.',
          ],
          notifications: [
            'Notifications',
            'Build complete\nUI build finished successfully.\n\nNew comment\nPriya commented on Design Doc.\n\nWeekly report\nYour weekly report is ready.\n\nCalendar update\nTeam sync moved to 3 PM.',
          ],
          survey: [
            'Quick Survey',
            'How satisfied are you with Mail?\n\n○ Very satisfied\n○ Satisfied\n◉ Neutral\n○ Dissatisfied\n○ Very dissatisfied',
          ],
          consent: [
            'Help Make Mail Better',
            'Allow Apple to collect anonymous usage data to help improve Mail. No personal information is sent.',
          ],
        }[type];
        E('h3', '', ob, content[0]);
        const p = E('p', '', ob, content[1]);
        p.style.whiteSpace = 'pre-line';
        const b = E('button', '', ob, label);
        b.type = 'button';
        b.dataset.dismiss = 'true';
        b.addEventListener('click', () => {
          ob.remove();
          env.log('overlay-dismiss', { kind: type, how: 'button' });
        });
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
