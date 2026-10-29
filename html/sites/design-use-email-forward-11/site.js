(function () {
  'use strict';
  const C = {
    'style': 'developer',
    'brand': 'TaskHub | Mail',
    'nav': 'Task ready',
    'bg': '#11191f',
    'surface': '#141d23',
    'fg': '#e5edf6',
    'line': '#34424d',
    'title': '#172129',
    'control': '#1d2831',
    'accent': '#a7f86e',
    'accentfg': '#071204',
    'sel': '#21372d',
    'font': '"DejaVu Sans Mono",monospace',
    'bar': 45,
    'foot': 105,
    'note': 'left:27%;top:.7%;width:46%;padding:5px;font-size:15px;border-color:#a7f86e;background:#10181b',
    'end': 'right:1.5%;bottom:3%;width:12%',
    'ob': ['notifications', 'Dismiss all'],
    'geo': {
      'folders': 'left:0;top:0;width:12%;height:100%',
      'ledger': 'left:12.7%;top:0;width:16.5%;height:100%',
      'document': 'left:30%;top:0;width:27%;height:100%',
      'editor': 'left:57.5%;top:0;width:25.5%;height:100%',
      'contacts': 'display:none',
    },
    'site': 'design-use-email-forward-11',
    'scenario': 'forward',
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
    'rowHeight': 110,
    'stack': false,
    'dock': ['Quick Tools', 'Search', 'Add Note', 'Calculator', 'Contacts'],
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    initialOverlay: { kind: 'toast' },
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
        const er = ctx.rng.fork('chrome/end'),
          cr = ctx.rng.fork('chrome/collide'),
          words = (ctx.content && ctx.content.END_LABELS) || [
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
        const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        const original = er.bool(0.5);
        const label = original ? 'Submit' : labelOf(er.pick(words));
        const placement = original ? 'dock' : er.pick(['dock', 'header', 'link']);
        const endParent = placement === 'dock' ? document.body : bar;
        submit = E(
          placement === 'link' ? 'a' : 'button',
          'end-control end-' + placement,
          endParent,
          placement === 'link' ? label + ' ›' : label,
        );
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        if (cr.bool(0.3)) {
          const pool = [
            ...new Set(words.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase())),
          ];
          if (pool.length) {
            const clash = E('button', 'chrome-pq', bar, cr.pick(pool));
            clash.type = 'button';
            clash.dataset.role = 'xtra';
            clash.addEventListener('click', () => env.log('decoy', { label: clash.textContent, collide: true }));
          }
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
      for (const e of document.body.querySelectorAll('.task-note')) {
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
        const ob = ctx.util.el('aside', 'obstruction notifications', document.body);
        ob.setAttribute('role', 'dialog');
        ob.dataset.role = 'overlay';
        ctx.util.el('h3', '', ob, 'Notifications');
        const cards = [
          ['Build complete', 'UI build finished successfully.', '2m ago'],
          ['New comment', 'Priya commented on Design Doc.', '7m ago'],
          ['Weekly report', 'Your weekly report is ready.', '14m ago'],
          ['Calendar update', 'Team sync moved to 3 PM.', '28m ago'],
        ];
        const shapes = [
          [
            ['path', { d: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9' }],
            ['path', { d: 'M10 21h4' }],
          ],
          [
            ['circle', { cx: 12, cy: 12, r: 9 }],
            ['path', { d: 'M12 11v5' }],
            ['path', { d: 'M12 8h.01' }],
          ],
          [
            ['rect', { x: 3, y: 5, width: 18, height: 14, rx: 1 }],
            ['path', { d: 'm3 7 9 6 9-6' }],
          ],
          [
            ['rect', { x: 3, y: 5, width: 18, height: 16, rx: 1 }],
            ['path', { d: 'M7 3v4M17 3v4M3 10h18' }],
          ],
        ];
        cards.forEach(([title, body, time], i) => {
          const card = ctx.util.el('div', 'notification-card', ob);
          const badge = ctx.util.el('span', 'notification-icon icon-' + i, card);
          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.setAttribute('viewBox', '0 0 24 24');
          svg.setAttribute('aria-hidden', 'true');
          for (const [tag, attrs] of shapes[i]) {
            const part = document.createElementNS('http://www.w3.org/2000/svg', tag);
            for (const [key, value] of Object.entries(attrs)) part.setAttribute(key, value);
            svg.appendChild(part);
          }
          badge.appendChild(svg);
          const copy = ctx.util.el('div', 'notification-copy', card);
          ctx.util.el('strong', '', copy, title);
          ctx.util.el('span', '', copy, body);
          ctx.util.el('span', 'notification-time', card, time);
        });
        const b = ctx.util.el('button', '', ob, 'Dismiss all');
        b.type = 'button';
        b.dataset.dismiss = 'true';
        b.addEventListener('click', () => ctx.dismiss());
        return { el: ob, dismiss: b };
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
