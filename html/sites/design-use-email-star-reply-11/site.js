(function () {
  'use strict';
  const C = {
    'style': 'risc',
    'brand': 'RISC OS',
    'nav': '',
    'bg': '#5f85ae',
    'surface': '#d1d1d1',
    'fg': '#111',
    'line': '#777',
    'title': 'linear-gradient(#e4e4e4,#b1b1b1)',
    'control': 'linear-gradient(#eee,#bfbfbf)',
    'accent': '#2d63c7',
    'sel': '#125abb',
    'selfg': '#fff',
    'bar': 32,
    'foot': 65,
    'note': 'left:2%;bottom:13%;width:66%;background:#fff5be;font-size:18px;padding:8px',
    'end': 'left:60%;bottom:13.4%;padding:7px 28px',
    'ob': ['survey', 'Close survey'],
    'geo': {
      'folders': 'left:2%;top:20%;width:8%;height:65%',
      'ledger': 'left:10.5%;top:20%;width:28%;height:65%',
      'document': 'left:39%;top:20%;width:29%;height:34%',
      'editor': 'left:39%;top:55%;width:29%;height:30%',
      'contacts': 'display:none',
    },
    'site': 'design-use-email-star-reply-11',
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
    'folderList': ['inbox', 'sent', 'drafts', 'archive', 'junk'],
    'rowHeight': 34,
    'stack': false,
    'dock': ['Disc', 'Apps', 'Edit', 'Draw', 'Calc', 'Files', 'Net'],
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    initialOverlay: { kind: 'survey' },
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
        const note = E('aside', 'task-note' + (ctx.finish ? ' no-end' : ''), document.body);
        note.dataset.display = ctx.display;
        if (C.noteTitle) E('div', 'note-title', note, C.noteTitle);
        E('div', 'instruction', note, ctx.instruction);
      }
      const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
      const supplied = ctx.content && ctx.content.END_LABELS;
      const labels = (
        Array.isArray(supplied) && supplied.length
          ? supplied
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"]
      ).map(labelOf);
      const er = ctx.rng.fork('chrome/end');
      const placement = ctx.finish ? null : er.pick(['note', 'note', 'title', 'dock']);
      const label =
        placement === 'note' ? 'Submit' : er.pick(labels.filter((x) => x.trim().toLowerCase() !== 'submit'));
      let submit = null;
      if (!ctx.finish) {
        submit = E('button', 'end-control', document.body, label);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.dataset.placement = placement;
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', () => ctx.submit());
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && cr.bool(0.3)) {
        const pool = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (pool.length) {
          const d = E('button', 'end-xtra', document.body, cr.pick(pool));
          d.type = 'button';
          d.dataset.role = 'xtra';
          d.addEventListener('click', () => env.log('decoy', { label: d.textContent, collide: true }));
        }
      }
      /* A title/iconbar end control leaves the whole task note available for text. */ const taskNote =
        document.querySelector('.task-note');
      if (taskNote && placement !== 'note') taskNote.classList.add('no-end');
      /* Fit seeded instructions inside their reference region. */ for (const n of document.querySelectorAll(
        '.task-note',
      )) {
        let f = parseFloat(getComputedStyle(n).fontSize);
        while (n.scrollHeight > n.clientHeight + 1 && f > 12) {
          f -= 0.5;
          n.style.fontSize = f + 'px';
        }
      }
      for (const e of document.body.querySelectorAll('.task-note,.end-control,.end-xtra,.obstruction')) {
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
      if (ctx.kind === 'survey') {
        const E = (tag, cls, parent, text) => ctx.util.el(tag, cls, parent, text);
        const ob = E('aside', 'obstruction survey', document.body);
        ob.setAttribute('role', 'dialog');
        const content = E('div', 'survey-content', ob);
        E('p', '', content, 'How satisfied are you with Mail?');
        for (const [i, label] of [
          'Very satisfied',
          'Satisfied',
          'Neutral',
          'Dissatisfied',
          'Very dissatisfied',
        ].entries()) {
          const l = E('label', '', content);
          const r = E('input', '', l);
          r.type = 'radio';
          r.name = 'satisfaction';
          r.checked = i === 2;
          E('span', '', l, ' ' + label);
        }
        E('p', '', content, 'Additional comments:');
        E('textarea', '', content);
        E('h3', '', ob, 'Quick Survey');
        const b = E('button', '', ob, 'Close survey');
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
