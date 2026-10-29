(function () {
  'use strict';
  const C = {
    'style': 'macrecover',
    'brand': 'File   Edit   View   Message   Window   Help',
    'nav': '',
    'bg': '#fff',
    'surface': '#fff',
    'fg': '#000',
    'line': '#111',
    'title': 'repeating-linear-gradient(45deg,#aaa 0 1px,#fff 1px 3px)',
    'control': '#fff',
    'accent': '#fff',
    'accentfg': '#000',
    'sel': '#000',
    'selfg': '#fff',
    'font': '"DejaVu Sans Mono",monospace',
    'bar': 34,
    'note':
      'left:1.2%;bottom:6%;width:30.5%;height:24%;font-size:clamp(16px,1.5vw,25px);border:4px double #111;padding:50px 22px 16px',
    'end': 'right:1.6%;bottom:2.6%;padding:8px 30px;font-size:23px',
    'ob': ['layout-error', 'Use default layout'],
    'geo': {
      'folders': 'display:none',
      'ledger': 'left:.5%;top:0;width:32%;height:67%;border:3px double #111',
      'document': 'left:33%;top:13%;width:66.5%;height:48%;border:3px double #111',
      'editor': 'left:33%;top:61.5%;width:66.5%;height:37%;border:3px double #111',
      'contacts': 'display:none',
    },
    'site': 'design-use-email-forward-12',
    'scenario': 'forward',
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
    'rowHeight': 34,
    'stack': false,
    'dock': [],
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    initialOverlay: { kind: 'promo' },
    frame(ctx) {
      const E = (tag, cls, parent, text) => ctx.util.el(tag, cls, parent, text);
      document.body.dataset.design = C.style;
      const bar = E('header', 'desktop-bar', document.body);
      const apple = E('span', 'apple-mark', bar);
      apple.innerHTML =
        '<svg viewBox="0 0 24 28" aria-hidden="true"><path d="M16 5c1-2 1-4 1-5-3 0-5 2-5 5 1 0 3 0 4-1ZM20 7c-3-2-5-1-8 0-3-2-6-2-8 0-5 4-3 12 1 17 2 3 4 1 7 1s5 2 7-1c2-2 3-5 4-7-5-2-6-7-3-10Z"/></svg>';
      E('span', 'brand', bar, C.brand);
      if (C.nav) {
        const n = E('nav', 'nav', bar);
        for (const label of C.nav.split(/\s{2,}/)) {
          const a = E('button', 'chrome-nav', n, label);
          a.type = 'button';
          a.addEventListener('click', () => env.log('decoy', { label }));
        }
      }
      E('span', 'account', bar, 'Mon Apr 4  10:24 AM');
      const stage = E('main', 'stage', document.body);
      const footer = E('footer', 'desktop-footer', document.body);
      if (!C.foot) footer.hidden = true;
      if (C.foot) for (const t of C.dock) E('span', '', footer, t);
      if (ctx.display !== 'hidden') {
        const note = E('aside', 'task-note', document.body);
        note.dataset.display = ctx.display;
        const title = E('div', 'note-title', note);
        E('span', 'title-label', title, C.noteTitle || 'Task');
        const text = E('div', 'instruction', note, ctx.instruction);
        const style = getComputedStyle(note),
          available = note.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
        let font = parseFloat(style.fontSize);
        while (text.scrollHeight > available && font > 12) {
          text.style.fontSize = --font + 'px';
        }
      }
      const labelOf = (v) => (typeof v === 'string' ? v : v.label || v.text || v.name);
      const labels = ctx.content.END_LABELS.map(labelOf);
      const er = ctx.rng.fork('chrome/end');
      const original = er.bool(0.5);
      const placement = original ? 'footer' : er.pick(['toolbar', 'link']);
      const endLabel = original ? 'Submit' : er.pick(labels);
      let submit = null;
      if (!ctx.finish) {
        submit = E(placement === 'link' ? 'a' : 'button', 'end-control end-' + placement, document.body, endLabel);
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', (ev) => {
          ev.preventDefault();
          ctx.submit();
        });
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const pool = labels.filter((v) => v.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (pool.length) {
          const label = cr.pick(pool),
            b = E('button', 'chrome-xtra', document.body, label);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        }
      }
      for (const e of document.body.querySelectorAll('.task-note,.end-control')) {
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
        const E = (tag, cls, parent, text) => ctx.util.el(tag, cls, parent, text);
        const ob = E('aside', 'obstruction layout-error', document.body);
        ob.setAttribute('role', 'dialog');
        const warning = E('span', 'warning-icon', ob);
        warning.innerHTML =
          '<svg viewBox="0 0 76 68" aria-hidden="true"><path d="M35 5Q38 0 41 5L72 57Q76 64 69 64H7Q0 64 4 57Z"/><path d="M37 21h3l-1 21h-1Z"/><circle cx="39" cy="51" r="2"/></svg>';
        E('h3', '', ob, 'Layout could not be restored.');
        const p = E('p', '', ob, 'The previous ');
        p.style.whiteSpace = 'pre-line';
        E('strong', '', p, 'window layout');
        p.append(document.createTextNode(' could not be restored.\nSome panes may be hidden or out of place.'));
        const b = E('button', '', ob, 'Use default layout');
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
