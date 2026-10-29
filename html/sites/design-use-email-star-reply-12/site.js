(function () {
  'use strict';
  const C = {
    'style': 'beos',
    'brand': 'BeMail',
    'nav': 'File  Edit  Message  Window  Help',
    'bg': '#1c61a0',
    'surface': '#d9d9d9',
    'fg': '#111',
    'line': '#8a8a8a',
    'title': '#ffe266',
    'control': 'linear-gradient(#f5f5f5,#ccc)',
    'accent': '#ddd',
    'accentfg': '#111',
    'sel': '#1248c8',
    'selfg': '#fff',
    'bar': 0,
    'foot': 40,
    'note':
      'right:1.6%;top:13%;width:20.8%;height:21%;background:#fff8d6;padding:42px 18px 12px;font-size:clamp(14px,1.3vw,22px)',
    'end': 'right:6%;top:27%;padding:10px 50px;font-size:21px',
    'ob': ['stale', 'Continue without saving'],
    'geo': {
      'folders': 'left:2%;top:19%;width:11%;height:69%',
      'ledger': 'left:13.1%;top:19%;width:29%;height:69%',
      'document': 'left:42.5%;top:19%;width:32.5%;height:38%',
      'editor': 'left:42.5%;top:58%;width:32.5%;height:30%',
      'contacts': 'display:none',
    },
    'site': 'design-use-email-star-reply-12',
    'scenario': 'star-reply',
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
    'folderList': ['inbox', 'sent', 'drafts', 'starred', 'trash'],
    'rowHeight': 34,
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
      const stage = E('main', 'stage', document.body);
      const footer = E('footer', 'desktop-footer', document.body);
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
      if (C.foot) for (const t of C.dock) E('span', '', footer, t);
      let display = ctx.display;
      if ((display === 'panel' || display === 'toast') && (window.innerWidth < 1260 || window.innerHeight < 700))
        display = 'header';
      document.body.dataset.instrmode = display;
      if (display !== 'hidden') {
        const note = E('aside', 'task-note', document.body);
        note.dataset.display = display;
        if (C.noteTitle) E('div', 'note-title', note, C.noteTitle);
        E('div', 'instruction', note, ctx.instruction);
      }
      const content = ctx.content || {};
      const labels =
        Array.isArray(content.END_LABELS) && content.END_LABELS.length
          ? content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const er = ctx.rng.fork('chrome/end');
      const original = labels.find((x) => labelOf(x).trim().toLowerCase() === 'submit') || labels[0];
      const alternates = labels.filter((x) => labelOf(x).trim().toLowerCase() !== 'submit');
      const keepOriginal = er.bool(0.5);
      const placement = keepOriginal ? 'palette' : er.pick(['toolbar', 'footer']);
      const endLabel = labelOf(keepOriginal || !alternates.length ? original : er.pick(alternates));
      let submit = null;
      const makeEnd = (parent, cls, label) => {
        const b = E('button', cls, parent, label);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', endLabel);
        b.title = endLabel;
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      if (!ctx.finish) {
        if (placement === 'palette') submit = makeEnd(document.body, 'end-control', endLabel);
        else if (placement === 'toolbar') submit = makeEnd(document.body, 'end-control end-toolbar', endLabel);
        else submit = makeEnd(footer, 'end-control end-footer', endLabel);
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const pool = labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (pool.length) {
          const text = labelOf(cr.pick(pool));
          const b = E('button', 'end-xtra', footer, text);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
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
          stale: ['Unsaved layout changes', 'You have moved a panel. Continue without saving?'],
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
