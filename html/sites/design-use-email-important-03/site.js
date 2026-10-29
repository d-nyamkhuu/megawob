// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-important-03',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'gtk',
        'brand': 'Inbox - Mozilla Thunderbird',
        'nav': '',
        'bg': '#eeede7',
        'surface': '#eeece4',
        'fg': '#111',
        'line': '#aaa99e',
        'title': 'linear-gradient(#4f83b4,#32689e)',
        'titlefg': '#fff',
        'control': 'linear-gradient(#f5f4ec,#dedcd0)',
        'accent': '#bacada',
        'accentfg': '#000',
        'sel': '#dce6ee',
        'bar': 35,
        'note': 'left:.5%;top:1%;width:20%;height:98%;font-weight:400',
        'end': 'left:2%;bottom:4%;width:17%',
        'geo': {
          'folders': 'left:21.3%;top:16%;width:14%;height:83%',
          'ledger': 'left:35.8%;top:16%;width:63.7%;height:40%',
          'document': 'left:35.8%;top:57%;width:63.7%;height:42%',
          'editor': 'left:64%;top:58%;width:35.5%;height:41%',
          'contacts': 'display:none',
        },
        'site': 'design-use-email-important-03',
        'scenario': 'important',
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
        'folderList': ['inbox', 'sent', 'drafts', 'templates', 'junk', 'trash'],
        'rowHeight': 36,
        'stack': false,
        'dock': [],
      },
      parts: {
        'frame.4': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E, bar } = _c;
            const brand = E('span', 'brand', bar, C.brand);
            brand.innerHTML =
              '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18v14H3z M3 5l9 7 9-7"/></svg><span>Mail</span>';
            Object.assign(_c, { brand });
          },
        'frame.6': (base, S) =>
          function (_c) {
            const { E, bar, ctx } = _c;
            const acct = E('span', 'account', bar, '');
            acct.innerHTML =
              '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 18h14"/></svg><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h14v14H5z"/></svg><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 5 14 14 M19 5 5 19"/></svg>';
            if (ctx.display === 'header' || ctx.display === 'panel') {
              const td = E('aside', 'task-details', document.body);
              E('h3', '', td, ctx.display === 'panel' ? 'Your task' : 'Mail help');
              if (ctx.display === 'panel') {
                E('div', 'instruction panel-instruction', td, ctx.instruction);
              } else {
                const ol = E('ol', '', td);
                for (const t of [
                  'Browse or search your inbox.',
                  'Open a message to read it.',
                  'Use Message actions to manage mail.',
                ])
                  E('li', '', ol, t);
                let f = parseFloat(getComputedStyle(ol).fontSize);
                while (td.scrollHeight > td.clientHeight && f > 12) {
                  f -= 0.5;
                  ol.style.fontSize = f + 'px';
                }
              }
            }
            Object.assign(_c, { acct });
          },
        'frame.7': () => () => {},
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.15': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E, ctx } = _c;
            if (ctx.display !== 'hidden' && ctx.display !== 'panel') {
              const note = E('aside', 'task-note', document.body);
              note.dataset.display = ctx.display;
              if (C.noteTitle) E('div', 'note-title', note, C.noteTitle);
              E('div', 'instruction', note, ctx.instruction);
            }
            const endRng = ctx.rng.fork('chrome/end');
            const placements = ['bottom', 'bottom', 'bottom', 'bar', 'icon'];
            const placement = ctx.finish ? null : endRng.pick(placements);
            const labels =
              ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
                ? ctx.content.END_LABELS
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
            const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
            const submitWord = labels.find((x) => labelOf(x).trim().toLowerCase() === 'submit');
            const endLabel = labelOf(submitWord && endRng.bool(0.5) ? submitWord : endRng.pick(labels));
            Object.assign(_c, { endLabel, endRng, labelOf, labels, placement, placements, submitWord });
          },
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            const { E, ctx, endLabel, labelOf, labels, placement } = _c;
            if (!ctx.finish) {
              _c.submit = E('button', 'end-control', document.body, placement === 'icon' ? '✓' : endLabel);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.dataset.placement = placement;
              _c.submit.setAttribute('aria-label', endLabel);
              _c.submit.title = endLabel;
              _c.submit.addEventListener('click', () => ctx.submit());
            }
            const collideRng = ctx.rng.fork('chrome/collide');
            if (collideRng.bool(0.3)) {
              const own = endLabel.trim().toLowerCase();
              const choices = [...new Set(labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== own))];
              if (choices.length) {
                const text = labelOf(collideRng.pick(choices));
                const b = E('button', 'pqs-xtra', document.body, text);
                b.type = 'button';
                b.dataset.role = 'xtra';
                b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
              }
            }
            Object.assign(_c, { collideRng });
          },
      },
    },
  });
})();
