(function () {
  'use strict';
  const C = {
    'style': 'minimal',
    'brand': 'Mail',
    'nav': '',
    'bg': '#fff',
    'surface': '#fff',
    'fg': '#3d4351',
    'line': '#e0e5e7',
    'title': '#fff',
    'control': '#f7faf9',
    'accent': '#2eb26c',
    'sel': '#e3f3eb',
    'bar': 68,
    'note':
      'left:28%;top:10.5%;width:48%;height:12%;background:transparent;border:0;padding:4px;font-size:clamp(20px,2vw,34px)',
    'end': 'right:1.8%;bottom:2.5%;padding:10px 42px;font-size:20px',
    'geo': {
      'folders': 'left:0;top:1%;width:12.5%;height:99%;border:0;border-right:1px solid #eee',
      'ledger': 'left:13.5%;top:17%;width:85.5%;height:44%;border:0',
      'document': 'left:57.5%;top:62%;width:41.5%;height:36%;border:1px solid #ddd',
      'editor': 'display:none',
      'contacts': 'display:none',
    },
    'site': 'design-use-email-important-12',
    'scenario': 'important',
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
    'folderList': ['inbox', 'starred', 'sent', 'drafts', 'archive', 'trash'],
    'rowHeight': 42,
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
      const brand = E('span', 'brand', bar);
      brand.innerHTML =
        '<svg class="brand-envelope" viewBox="0 0 42 32" aria-hidden="true"><defs><linearGradient id="envelope-green" x2="0" y2="1"><stop stop-color="#4bc286"/><stop offset="1" stop-color="#2eb16c"/></linearGradient></defs><rect x="1" y="1" width="40" height="30" rx="3" fill="url(#envelope-green)"/><path d="m4 5 17 13L38 5" fill="none" stroke="white" stroke-width="2.6"/></svg>';
      E('span', '', brand, C.brand);
      const searchBox = E('label', 'header-search', bar);
      searchBox.innerHTML =
        '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/></svg>';
      const headerSearch = E('input', '', searchBox);
      headerSearch.type = 'search';
      headerSearch.placeholder = 'Search email';
      headerSearch.setAttribute('aria-label', 'Search email');
      const account = E('div', 'account', bar);
      const avatar = E('span', 'account-avatar', account);
      avatar.innerHTML =
        '<svg viewBox="0 0 38 38" aria-hidden="true"><circle cx="19" cy="15" r="6"/><path d="M9 29c0-9 20-9 20 0"/></svg>';
      E('span', '', account, ctx.spec?.me?.name || 'Jordan Lee');
      const down = E('span', 'account-chevron', account);
      down.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 9 5 5 5-5"/></svg>';
      const stage = E('main', 'stage', document.body);
      const footer = E('footer', 'desktop-footer', document.body);
      if (!C.foot) footer.hidden = true;
      if (C.foot) for (const t of C.dock) E('span', '', footer, t);
      if (ctx.display !== 'hidden') {
        const note = E('aside', 'task-note', document.body);
        note.dataset.display = ctx.display;
        if (C.noteTitle) E('div', 'note-title', note, C.noteTitle);
        E('div', 'instruction', note, ctx.instruction);
      }
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const placement = er.bool(0.5) ? 'floating' : er.pick(['header', 'link']);
        const labels = ctx.content.END_LABELS || [
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
        ];
        const label = er.bool(0.5) ? 'Submit' : er.pick(labels);
        submit = E('button', 'end-control', document.body, placement === 'link' ? label + ' ›' : label);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.dataset.placement = placement;
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', () => ctx.submit());
      }
      const collideR = ctx.rng.fork('chrome/collide');
      if (collideR.bool(0.3)) {
        const labels = ctx.content.END_LABELS || [
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
        ];
        const current = submit?.getAttribute('aria-label') || '';
        const options = [
          ...new Set(labels.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))),
        ].filter((x) => x.trim().toLowerCase() !== current.trim().toLowerCase());
        if (options.length) {
          const label = collideR.pick(options);
          const b = E('button', 'end-xtra', document.body, label);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.addEventListener('click', () => env.log('decoy', { label, collide: true }));
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
      const taskNote = document.querySelector('.task-note');
      if (taskNote) {
        const limit = stage.getBoundingClientRect().top + stage.clientHeight * 0.173 - 6;
        let size = parseFloat(getComputedStyle(taskNote).fontSize);
        while (taskNote.getBoundingClientRect().bottom > limit && size > 17) {
          taskNote.style.fontSize = --size + 'px';
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
