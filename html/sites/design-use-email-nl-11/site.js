(function () {
  'use strict';
  const C = {
    'style': 'aqua',
    'brand': 'Mail   File   Edit   View   Message   Format   Window   Help',
    'nav': '',
    'bg': '#77b8f0',
    'surface': 'repeating-linear-gradient(90deg,#f8fbff 0 2px,#eef4fa 2px 4px)',
    'fg': '#10152b',
    'line': '#abc3dd',
    'title': 'linear-gradient(#d5eaff,#8bb7e1)',
    'control': 'linear-gradient(#fff,#dde4ec)',
    'accent': 'linear-gradient(#5db3ff,#0069e7)',
    'sel': '#1274ed',
    'selfg': '#fff',
    'font': '"DejaVu Sans",Arial,sans-serif',
    'bar': 24,
    'foot': 40,
    'note': 'left:1%;top:8%;width:98%;background:#fffbe8;padding:5px 10px;font-size:17px;text-align:center',
    'end': 'right:2%;bottom:1%;padding:5px 30px;font-size:15px',
    'ob': ['consent', 'Reject optional'],
    'geo': {
      'folders': 'display:none',
      'ledger': 'left:.5%;top:10%;width:54.5%;height:89%',
      'document': 'left:55.5%;top:10%;width:44%;height:55%',
      'editor': 'left:55.5%;top:66%;width:44%;height:33%',
      'contacts': 'display:none',
    },
    'site': 'design-use-email-nl-11',
    'scenario': 'nl',
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
    'folderList': ['inbox', 'starred', 'important', 'archive', 'trash'],
    'rowHeight': 41,
    'stack': false,
    'dock': [],
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    initialOverlay: { kind: 'cookie' },
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
      const dots = E('div', 'traffic-lights', document.body);
      dots.innerHTML = '<i></i><i></i><i></i>';
      const stage = E('main', 'stage', document.body);
      const footer = E('footer', 'desktop-footer', document.body);
      if (!C.foot) footer.hidden = true;
      if (C.foot) for (const t of C.dock) E('span', '', footer, t);
      document.body.dataset.episodeDisplay = ctx.display;
      if (ctx.display !== 'hidden') {
        const note = E('aside', 'task-note', document.body);
        note.dataset.display = ctx.display;
        if (C.noteTitle) E('div', 'note-title', note, C.noteTitle);
        E('div', 'instruction', note, ctx.instruction);
      }
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end'),
          labels = ctx.content && ctx.content.END_LABELS;
        const labelOf = (x) => (typeof x === 'string' ? x : String((x && (x.label || x.text || x.name)) || x));
        const pool = (
          labels && labels.length
            ? labels
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"]
        ).map(labelOf);
        const placement = er.pick(['shelf', 'shelf', 'title', 'split']);
        const label = placement === 'shelf' ? 'Submit' : er.pick(pool);
        submit = E(
          'button',
          'end-control ' + (placement === 'title' ? 'end-title' : placement === 'split' ? 'end-split' : ''),
          document.body,
          label,
        );
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', () => ctx.submit());
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const options = [...new Set(pool)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (options.length) {
            const text = cr.pick(options);
            const b = E('button', 'pq-xtra', document.body, text);
            b.type = 'button';
            b.dataset.role = 'xtra';
            b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
          }
        }
      }
      /* Keep notes above the task panes, including long instructions at small sizes. */ for (const n of document.querySelectorAll(
        '.task-note',
      )) {
        const titleEnd = submit && submit.classList.contains('end-title');
        if (n.dataset.display === 'toast' && titleEnd) {
          n.style.left = '1%';
          n.style.right = 'auto';
        }
        const s = stage.getBoundingClientRect(),
          top = bar.getBoundingClientRect().bottom + 2,
          bottom = s.top + s.height * 0.1 - 2;
        const headerWidth = titleEnd
          ? Math.max(200, submit.getBoundingClientRect().left - s.width * 0.01 - 8) + 'px'
          : '98%';
        if (n.dataset.display === 'header') n.style.width = headerWidth;
        let f = parseFloat(getComputedStyle(n).fontSize);
        while (n.getBoundingClientRect().height > bottom - top && f > 12) {
          f -= 0.5;
          n.style.fontSize = f + 'px';
        }
        if (n.getBoundingClientRect().height > bottom - top && n.dataset.display !== 'header') {
          n.dataset.display = 'header';
          n.style.left = '1%';
          n.style.right = 'auto';
          n.style.width = headerWidth;
          n.style.fontSize = '12px';
        }
        const r = n.getBoundingClientRect();
        n.style.top = Math.max(top, Math.min(r.top, bottom - r.height)) + 'px';
      }
      for (const e of document.body.querySelectorAll('.task-note,.end-control,.obstruction')) {
        const r = e.getBoundingClientRect();
        e.style.left = Math.round(r.left) + 'px';
        e.style.top = Math.round(r.top) + 'px';
        e.style.width = Math.ceil(r.width) + 'px';
        e.style.height = Math.ceil(r.height) + 'px';
        e.style.right = 'auto';
        e.style.bottom = 'auto';
      }
      return { stage, submit };
    },
    overlay(ctx) {
      if (ctx.initial) {
        const e = ctx.util.el('aside', 'obstruction consent', document.body);
        e.setAttribute('role', 'dialog');
        ctx.util.el('h3', '', e, 'Help Make Mail Better');
        ctx.util.el(
          'p',
          '',
          e,
          'Allow Apple to collect anonymous usage data to help improve Mail. No personal information is sent.',
        );
        const b = ctx.util.el('button', '', e, 'Reject optional');
        b.type = 'button';
        b.dataset.dismiss = 'true';
        b.addEventListener('click', () => ctx.dismiss('reject'));
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
