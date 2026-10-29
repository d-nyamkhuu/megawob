(function () {
  'use strict';
  const C = {
    'style': 'fluent',
    'brand': 'Mail',
    'nav': '',
    'bg': '#f8f7f5',
    'surface': '#fff',
    'fg': '#101626',
    'line': '#d6dce6',
    'title': '#e7edf5',
    'control': '#f4f6f9',
    'accent': '#0078ed',
    'sel': '#dbeaff',
    'bar': 104,
    'foot': 48,
    'note':
      'right:1%;top:12%;width:41.5%;height:6%;background:#deedff;border:0;font-size:clamp(12px,1vw,17px);padding:8px',
    'end': 'right:1.5%;bottom:.8%;padding:6px 30px;font-size:16px',
    'geo': {
      'folders': 'display:none',
      'ledger': 'left:57%;top:8%;width:42%;height:38%;border:0',
      'document': 'left:57%;top:47%;width:42%;height:24%;border:0;border-top:1px solid #ddd',
      'editor': 'left:57%;top:72%;width:42%;height:27%;border:1px solid #ddd',
      'contacts': 'display:none',
    },
    'site': 'design-use-email-reply-12',
    'scenario': 'reply',
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
    'folderList': [],
    'rowHeight': 72,
    'stack': false,
    'dock': [],
  };
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
      const controls = E('div', 'window-controls', bar);
      for (const [label, path] of [
        ['Minimize', 'M5 12h14'],
        ['Maximize', 'M6 5h12v14H6z'],
        ['Close', 'M5 5l14 14M19 5L5 19'],
      ]) {
        const b = E('button', '', controls);
        b.type = 'button';
        b.setAttribute('aria-label', label);
        b.innerHTML = '<svg viewBox="0 0 24 24"><path d="' + path + '"/></svg>';
      }
      const stage = E('main', 'stage', document.body);
      const footer = E('footer', 'desktop-footer', document.body);
      E('span', 'ready-status', footer, 'Ready');
      if (!C.foot) footer.hidden = true;
      if (C.foot) for (const t of C.dock) E('span', '', footer, t);
      document.body.dataset.instruction = ctx.display;
      document.body.style.setProperty('--mail-note-extra', '0px');
      document.body.style.setProperty('--mail-note-reserve', '0px');
      if (ctx.display !== 'hidden') {
        const note = E('aside', 'task-note', document.body);
        note.dataset.display = ctx.display;
        if (C.noteTitle) E('div', 'note-title', note, C.noteTitle);
        E('div', 'instruction', note, ctx.instruction);
        const bounds = note.getBoundingClientRect(),
          s = stage.getBoundingClientRect();
        if (ctx.display === 'header')
          document.body.style.setProperty(
            '--mail-note-extra',
            Math.max(0, Math.ceil(bounds.bottom + 6 - s.top - s.height * 0.08)) + 'px',
          );
        else document.body.style.setProperty('--mail-note-reserve', Math.ceil(bounds.height + 24) + 'px');
      }
      const er = ctx.rng.fork('chrome/end'),
        labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = er.bool(0.5),
        endPlacement = referenceEnd ? 'footer' : er.pick(['header', 'link']),
        endLabel = referenceEnd ? 'Submit' : er.pick(endLabels);
      let submit = null;
      if (!ctx.finish) {
        submit = E('button', 'end-control', document.body, endLabel);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.dataset.placement = endPlacement;
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', () => ctx.submit());
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const pool = [...new Set(endLabels)].filter(
          (label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
        );
        if (pool.length) {
          const label = cr.pick(pool),
            decoy = E('button', 'chrome-end-xtra', footer, label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
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
          'layout-error': [
            'Layout could not be restored.',
            'The previous window layout could not be restored. Some panes may be hidden or out of place.',
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
