(function () {
  'use strict';
  const C = {
    'style': 'swiss',
    'brand': '',
    'nav': '',
    'bg': '#fff',
    'surface': '#fff',
    'fg': '#111',
    'line': '#e4e4e4',
    'title': '#fff',
    'control': '#f7f7f7',
    'accent': '#ee281b',
    'sel': '#fcedec',
    'bar': 0,
    'foot': 105,
    'note': 'left:1.5%;top:1%;width:62%;border:0;border-bottom:4px solid #ee281b;padding:0 0 10px;font-size:22px',
    'end': 'right:1.5%;bottom:3%;width:16%',
    'ob': ['update', 'Remind me later'],
    'geo': {
      'folders': 'left:0;top:12%;width:12%;height:87%;border-left:0',
      'ledger': 'left:12%;top:12%;width:21.5%;height:87%',
      'document': 'left:33.5%;top:12%;width:36.5%;height:87%',
      'editor': 'left:70%;top:12%;width:30%;height:87%',
      'contacts': 'display:none',
    },
    'site': 'design-use-email-reply-11',
    'scenario': 'reply',
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
    'folderList': ['inbox', 'starred', 'sent', 'drafts', 'archive', 'spam', 'trash'],
    'rowHeight': 112,
    'stack': false,
    'dock': ['Mail', 'Calendar', 'Files', 'Settings'],
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
        if (ctx.display === 'panel') {
          note.classList.add('episode-panel');
          note.insertBefore(E('div', 'episode-panel-title', null, 'Task'), note.firstChild);
        }
        if (ctx.display === 'toast') {
          note.classList.add('episode-toast');
        }
      }
      const labels =
        ctx.content && Array.isArray(ctx.content.END_LABELS)
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const labelText = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x));
      const er = ctx.rng.fork('chrome/end');
      const defaultPick = er.bool(0.5);
      const canonical = labels.find((x) => labelText(x).toLowerCase() === 'submit');
      const alternatives = labels.filter((x) => labelText(x).toLowerCase() !== 'submit');
      const endLabel = labelText(
        defaultPick ? canonical || 'Submit' : alternatives.length ? er.pick(alternatives) : er.pick(labels),
      );
      const placement = defaultPick ? 'dock' : er.pick(['dock', 'link', 'icon', 'top']);
      const endControl = (cls, text) => {
        const b = E('button', 'end-control ' + cls, document.body, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', endLabel);
        b.title = endLabel;
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'link') {
          submit = E('a', 'end-control end-link', document.body, endLabel + ' ›');
          submit.href = '#';
          submit.dataset.role = 'submit';
          submit.title = endLabel;
          submit.setAttribute('aria-label', endLabel);
          submit.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
        } else if (placement === 'icon') {
          submit = endControl('end-icon', '✓');
        } else if (placement === 'top') {
          submit = endControl('end-top', endLabel);
        } else {
          submit = endControl('', endLabel);
        }
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && cr.bool(0.3)) {
        const same = (x) => String(x).trim().toLowerCase() === endLabel.trim().toLowerCase();
        const pool = [...new Set(labels.map(labelText).filter((x) => !same(x)))];
        if (pool.length) {
          const zone =
            placement === 'dock'
              ? 'episode-pq-main'
              : placement === 'icon'
                ? 'episode-pq-icon'
                : 'episode-pq-alt';
          const d = E('button', 'episode-pq ' + zone, footer, cr.pick(pool));
          d.type = 'button';
          d.dataset.role = 'xtra';
          d.addEventListener('click', () => env.log('decoy', { label: d.textContent, collide: true }));
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      if (ctx.initial) {
        const e = ctx.util.el('aside', 'obstruction update', document.body);
        e.setAttribute('role', 'dialog');
        ctx.util.el('h3', '', e, 'A newer version is available');
        ctx.util.el('p', '', e, 'Get the latest features and security updates for a better experience.');
        const b = ctx.util.el('button', '', e, 'Remind me later');
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
