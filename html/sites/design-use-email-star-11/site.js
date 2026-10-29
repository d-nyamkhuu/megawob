(function () {
  'use strict';
  const C = {
    'style': 'academic',
    'brand': 'Campus Mail',
    'nav': 'Riverton University',
    'bg': '#fff',
    'surface': '#fff',
    'fg': '#000',
    'line': '#aaa',
    'title': '#eee',
    'control': '#e9e9e9',
    'accent': '#e3e3e3',
    'accentfg': '#000',
    'sel': '#eee',
    'font': '"Times New Roman",serif',
    'bar': 55,
    'foot': 65,
    'note': 'left:2%;top:28%;width:94%;border:0;font-size:27px',
    'end': 'left:2%;bottom:3%',
    'ob': ['announcement', 'Collapse announcement'],
    'geo': {
      'folders': 'display:none',
      'ledger': 'left:1%;top:36%;width:98%;height:57%;border:0',
      'document': 'display:none',
      'editor': 'left:50%;top:50%;width:49%;height:40%',
      'contacts': 'display:none',
    },
    'site': 'design-use-email-star-11',
    'scenario': 'star',
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
    'rowHeight': 67,
    'stack': false,
    'dock': [],
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    initialOverlay: { kind: 'banner' },
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
      const endRng = ctx.rng.fork('chrome/end');
      const original = endRng.bool(0.5);
      const placement = original ? 'footer' : endRng.pick(['header', 'link']);
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
      ).map((x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x));
      const others = labels.filter((x) => x.trim().toLowerCase() !== 'submit');
      const label = original ? 'Submit' : String(endRng.pick(others.length ? others : labels));
      const collideRng = ctx.rng.fork('chrome/collide');
      const candidates = labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
      const collide = collideRng.bool(0.3) && candidates.length ? String(collideRng.pick(candidates)) : null;
      let submit = null;
      if (!ctx.finish) {
        const text = label + (placement === 'link' ? ' ›' : '');
        submit = E('button', 'end-control ' + (placement === 'link' ? 'end-link' : ''), document.body, text);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.dataset.placement = placement;
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', () => ctx.submit());
        if (collide) {
          const d = E('button', 'chrome-pq', document.body, collide);
          d.type = 'button';
          d.dataset.role = 'xtra';
          d.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
        }
      }
      E(
        'div',
        'footer-hint',
        footer,
        ctx.finish ? 'Complete the task above.' : `Complete the task above, then click ${label}.`,
      );
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
        const e = ctx.util.el('aside', 'obstruction announcement', document.body);
        e.setAttribute('role', 'dialog');
        ctx.util.el('h3', '', e, 'Campus System Maintenance This Weekend');
        ctx.util.el('p', '', e, 'Email may be slower than usual from Sat 8:00 PM to Sun 6:00 AM.');
        const a = ctx.util.el('a', 'announcement-details', e, 'See full details.');
        a.href = '#';
        a.addEventListener('click', (ev) => ev.preventDefault());
        const b = ctx.util.el('button', '', e, 'Collapse announcement');
        b.type = 'button';
        b.dataset.dismiss = 'true';
        b.addEventListener('click', () => ctx.dismiss());
        return { el: e, dismiss: b };
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
