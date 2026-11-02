// site/app-email-unread-04: site template generated from the site.js of design-use-email-unread-04, of which many design-*
// sites were restyled copies; they are designs on it (templates/README.md, "Generated site templates"). The defaults
// (design {}) reproduce design-use-email-unread-04. Tokens (each replaced whole): C. Parts: frame, overlay, and the
// sections of frame() ('frame.1'..'frame.23'), overlay() ('overlay.1'..'overlay.9'): one per statement of the
// original body, run in order.
(function () {
  'use strict';

  const TOKENS = {
    C: {
      "style": "postline",
      "brand": "Postline",
      "nav": "Mail  Contacts  Calendar  Tasks",
      "bg": "#f8f4e7",
      "surface": "#fffaf0",
      "fg": "#092749",
      "line": "#d8d6cc",
      "title": "#70172d",
      "control": "#fffaf0",
      "accent": "#126e78",
      "accentfg": "#fffbeF",
      "sel": "#d2e5e2",
      "selfg": "#092749",
      "font": "Georgia,serif",
      "note": "right:2%;top:9%;width:25%",
      "end": "left:2%;bottom:3%",
      "geo": {
        "folders": "left:0;top:0;width:17%;height:100%",
        "ledger": "left:17%;top:0;width:83%;height:100%",
        "document": "left:17%;top:0;width:83%;height:100%",
        "editor": "right:2%;top:50%;width:36%;height:47%",
        "contacts": "display:none"
      },
      "site": "design-use-email-unread-04",
      "scenario": "unread",
      "platform": "desktop",
      "account": "Jamie Lee",
      "noteTitle": "Task",
      "folderLabels": {
        "sent": "Sent",
        "drafts": "Drafts",
        "junk": "Junk",
        "spam": "Spam",
        "templates": "Templates",
        "compose": "Compose"
      },
      "folderList": ["inbox", "sent", "drafts", "archive", "trash"],
      "rowHeight": 40,
      "stack": false,
      "dock": []
    },
  };

  const base = (S) => ({
    frame: function frame(ctx) {
      const _c = { ctx };
      for (let i = 1; i <= 23; i++) {
        const r = S[`frame.${i}`](_c);
        if (r !== undefined) return r;
      }
    },
    'frame.1': function (_c) {
      const {ctx} = _c;
      const E = (tag, cls, parent, text) => ctx.util.el(tag, cls, parent, text);
      Object.assign(_c, {
        E
      });
    },
    'frame.2': function (_c) {
      const {C} = S;
      document.body.dataset.design = C.style;
    },
    'frame.3': function (_c) {
      const {E} = _c;
      const bar = E('header', 'desktop-bar', document.body);
      Object.assign(_c, {
        bar
      });
    },
    'frame.4': function (_c) {
      const {C} = S;
      const {E, bar} = _c;
      E('span', 'brand', bar, C.brand);
    },
    'frame.5': function (_c) {
      const {C} = S;
      const {E, bar} = _c;
      if (C.nav) {
        const n = E('nav', 'nav', bar);
        for (const label of C.nav.split(/\s{2,}/)) {
          const a = E('button', 'chrome-nav', n, label);
          a.type = 'button';
          a.addEventListener('click', () => env.log('decoy', {
            label
          }));
        }
      }
    },
    'frame.6': function (_c) {
      const {C} = S;
      const {E, bar} = _c;
      E('span', 'account', bar, C.account);
    },
    'frame.7': function (_c) {
      const {E} = _c;
      const summary = E('section', 'summary-band', document.body);
      Object.assign(_c, {
        summary
      });
    },
    'frame.8': function (_c) {
      const {E, summary} = _c;
      E('div', 'greeting', summary, 'Good afternoon, Jamie.');
    },
    'frame.9': function (_c) {
      const {E, summary} = _c;
      E('div', 'greeting-sub', summary, 'Here’s your mail at a glance.');
    },
    'frame.10': function (_c) {
      const {E, summary} = _c;
      for (const [ico, num, lab] of [['✉', '12', 'Unread'], ['♟', '3', 'Today'], ['⚑', '0', 'Flagged']]) {
        const s = E('div', 'summary-stat', summary);
        E('b', 'stat-icon', s, ico);
        const t = E('span', 'stat-value', s, num);
        E('small', '', s, lab);
      }
    },
    'frame.11': function (_c) {
      const {E} = _c;
      const stage = E('main', 'stage', document.body);
      Object.assign(_c, {
        stage
      });
    },
    'frame.12': function (_c) {
      const {E} = _c;
      const footer = E('footer', 'desktop-footer', document.body);
      Object.assign(_c, {
        footer
      });
    },
    'frame.13': function (_c) {
      const {C} = S;
      const {footer} = _c;
      if (!C.foot) footer.hidden = true;
    },
    'frame.14': function (_c) {
      const {C} = S;
      const {E, footer} = _c;
      if (C.foot) for (const t of C.dock) E('span', '', footer, t);
    },
    'frame.15': function (_c) {
      const {ctx} = _c;
      const display = ctx.display || 'header';
      Object.assign(_c, {
        display
      });
    },
    'frame.16': function (_c) {
      _c.note = null;
    },
    'frame.17': function (_c) {
      const {C} = S;
      const {E, ctx, display} = _c;
      if (display !== 'hidden') {
        _c.note = E('aside', 'task-note', document.body);
        _c.note.dataset.display = display;
        if (C.noteTitle && display !== 'toast') E('div', 'note-title', _c.note, C.noteTitle);
        E('div', 'instruction', _c.note, ctx.instruction);
      }
    },
    'frame.18': function (_c) {
      _c.submit = null;
    },
    'frame.19': function (_c) {
      const {E, bar, ctx} = _c;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const home = er.bool(.5);
        const place = home ? 'home' : er.pick(['center', 'menubar']);
        const labels = ctx.content && ctx.content.END_LABELS;
        const endWords = (Array.isArray(labels) && labels.length ? labels : ['Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']).map(x => typeof x === 'string' ? x : x.label || x.text || x.name || String(x));
        const label = home ? 'Submit' : er.pick(endWords);
        _c.submit = E('button', 'end-control end-' + place, document.body, label);
        _c.submit.type = 'button';
        _c.submit.dataset.role = 'submit';
        _c.submit.setAttribute('aria-label', label);
        _c.submit.title = label;
        _c.submit.addEventListener('click', () => ctx.submit());
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(.3)) {
          const pool = (Array.isArray(labels) && labels.length ? labels : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']).map(x => typeof x === 'string' ? x : x.label || x.text || x.name || String(x));
          const choices = [...new Set(pool)].filter(x => x.trim().toLowerCase() !== String(label).trim().toLowerCase());
          if (choices.length) {
            const d = E('button', 'chrome-nav pq-xtra', bar, cr.pick(choices));
            d.type = 'button';
            d.dataset.role = 'xtra';
            d.addEventListener('click', () => env.log('decoy', {
              label: d.textContent,
              collide: true
            }));
          }
        }
      }
    },
    'frame.20': function (_c) {
      const {C} = S;
      const {E} = _c;
      if (C.ob) {
        const [type, label] = C.ob;
        const ob = E('aside', 'obstruction ' + type, document.body);
        ob.setAttribute('role', 'dialog');
        const content = ({
          newsletter: ['The Hillview Newsletter', 'Ideas. People. A Brighter Tomorrow.'],
          announcement: ['Campus System Maintenance This Weekend', 'Email may be slower than usual from Sat 8:00 PM to Sun 6:00 AM.'],
          tour: ['Welcome to My Mail!', 'Here you can read and manage your email. Take a quick tour to see key features.'],
          update: ['A newer version is available', 'Get the latest features and security updates for a better experience.'],
          notifications: ['Notifications', 'Build complete\nUI build finished successfully.\n\nNew comment\nPriya commented on Design Doc.\n\nWeekly report\nYour weekly report is ready.\n\nCalendar update\nTeam sync moved to 3 PM.'],
          survey: ['Quick Survey', 'How satisfied are you with Mail?\n\n○ Very satisfied\n○ Satisfied\n◉ Neutral\n○ Dissatisfied\n○ Very dissatisfied'],
          consent: ['Help Make Mail Better', 'Allow Apple to collect anonymous usage data to help improve Mail. No personal information is sent.']
        })[type];
        E('h3', '', ob, content[0]);
        const p = E('p', '', ob, content[1]);
        p.style.whiteSpace = 'pre-line';
        const b = E('button', '', ob, label);
        b.type = 'button';
        b.dataset.dismiss = 'true';
        b.addEventListener('click', () => {
          ob.remove();
          env.log('overlay-dismiss', {
            kind: type,
            how: 'button'
          });
        });
      }
    },
    'frame.21': function (_c) {
      for (const n of document.querySelectorAll('.task-note')) {
        let f = parseFloat(getComputedStyle(n).fontSize);
        while (n.scrollHeight > n.clientHeight + 1 && f > 12) {
          f -= .5;
          n.style.fontSize = f + 'px';
        }
      }
    },
    'frame.22': function (_c) {
      for (const e of document.body.querySelectorAll('.task-note,.end-control,.obstruction')) {
        const r = e.getBoundingClientRect();
        e.style.left = Math.round(r.left) + 'px';
        e.style.top = Math.round(r.top) + 'px';
        e.style.width = Math.round(r.width) + 'px';
        e.style.height = Math.round(r.height) + 'px';
        e.style.right = 'auto';
        e.style.bottom = 'auto';
      }
    },
    'frame.23': function (_c) {
      const {stage} = _c;
      return {
        stage,
        submit: _c.submit
      };
    },
    overlay: function overlay(ctx) {
      const _c = { ctx };
      for (let i = 1; i <= 9; i++) {
        const r = S[`overlay.${i}`](_c);
        if (r !== undefined) return r;
      }
    },
    'overlay.1': function (_c) {
      const {ctx} = _c;
      const e = ctx.util.el('aside', 'perturb ' + ctx.kind, document.body);
      Object.assign(_c, {
        e
      });
    },
    'overlay.2': function (_c) {
      const texts = {
        cookie: ['Cookie preferences', 'Choose which cookies we may use.', 'Reject optional'],
        toast: ['Mail synchronized', 'Your mailbox is up to date.', 'Dismiss'],
        chat: ['Mail support', 'Need any help today?', 'Close chat'],
        promo: ['Get more from Mail', 'Try the expanded mailbox plan.', 'No thanks'],
        banner: ['Service announcement', 'Scheduled maintenance tonight.', 'Dismiss']
      };
      Object.assign(_c, {
        texts
      });
    },
    'overlay.3': function (_c) {
      const {ctx, texts} = _c;
      const [title, body, label] = texts[ctx.kind];
      Object.assign(_c, {
        body,
        label,
        title
      });
    },
    'overlay.4': function (_c) {
      const {ctx, e, title} = _c;
      ctx.util.el('h3', '', e, title);
    },
    'overlay.5': function (_c) {
      const {body, ctx, e} = _c;
      ctx.util.el('p', '', e, body);
    },
    'overlay.6': function (_c) {
      const {ctx, e, label} = _c;
      const b = ctx.util.el('button', '', e, label);
      Object.assign(_c, {
        b
      });
    },
    'overlay.7': function (_c) {
      const {b} = _c;
      b.type = 'button';
    },
    'overlay.8': function (_c) {
      const {b, ctx} = _c;
      b.addEventListener('click', () => ctx.dismiss());
    },
    'overlay.9': function (_c) {
      const {b, e} = _c;
      return {
        el: e,
        dismiss: b
      };
    },
  });

  env.template('site/use-email-unread-04', (design, def) => {
    const S = {};
    const { D, P } = env.templateDesign('site/use-email-unread-04', design, def, { tokens: TOKENS, base: base(S), state: S });
    Object.assign(S, D, P);
    return { frame: P.frame, overlay: P.overlay };
  });
})();
