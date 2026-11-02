// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-star-reply-07',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'plain',
        'brand': 'WorkMail',
        'nav': 'People   Mail   Calendar   Tasks',
        'bg': '#fff',
        'surface': '#fff',
        'fg': '#000',
        'line': '#444',
        'title': '#fff',
        'control': '#ddd',
        'accent': '#ddd',
        'accentfg': '#000',
        'sel': '#ddd',
        'font': '"Times New Roman",serif',
        'bar': 60,
        'note': 'left:2%;top:9%;width:96%;padding:8px 0;border:0;border-block:1px solid #111;font-size:20px',
        'end': 'right:2%;bottom:1.5%;padding:7px 32px',
        'geo': {
          'folders': 'display:none',
          'ledger': 'left:2%;top:11%;width:25%;height:34%',
          'document': 'left:2%;top:11%;width:96%;height:45%;border:0;border-bottom:1px solid #111',
          'editor': 'left:2%;top:57%;width:96%;height:36%;border:0;border-bottom:1px solid #111',
          'contacts': 'display:none',
        },
        'site': 'design-use-email-star-reply-07',
        'scenario': 'star-reply',
        'platform': 'web',
        'account': 'Alex Chen|Settings|Help|Sign out',
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
        'rowHeight': 34,
        'stack': true,
        'dock': [],
      },
      parts: {
        'frame.6': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E, bar } = _c;
            const acct = E('span', 'account', bar);
            for (const t of C.account.split('|')) {
              const a = E('button', 'chrome-nav', acct, t);
              a.type = 'button';
              a.addEventListener('click', () => env.log('decoy', { label: t }));
            }
            const sv = (d) => '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + d + '"/></svg>';
            const toolsBox = E('aside', 'side-box tools-box', document.body);
            E('div', 'side-title', toolsBox, 'Tools');
            for (const [t, d] of [
              ['New Message', 'M3 5h15v14H3z M15 2l6 6-8 8h-4v-4z'],
              ['Address Book', 'M6 3h12v18H3l3-5z M12 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6 M8 17c0-4 8-4 8 0'],
              ['Filters', 'M3 4h18l-7 9v7l-4-2v-5z'],
            ]) {
              const b = E('button', 'side-item', toolsBox);
              b.type = 'button';
              b.innerHTML = sv(d) + '<span>' + t + '</span>';
              b.addEventListener('click', () => env.log('decoy', { label: t }));
            }
            const storeBox = E('aside', 'side-box storage-box', document.body);
            E('div', '', storeBox, 'Storage');
            const meter = E('div', 'meter', storeBox);
            E('i', '', meter);
            E('div', '', storeBox, '2.1 GB of 10 GB');
            E('aside', 'side-box submit-box', document.body);
            Object.assign(_c, { acct, meter, storeBox, sv, toolsBox });
          },
        'frame.7': () => () => {},
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.15': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E, ctx } = _c;
            if (ctx.display !== 'hidden') {
              const note = E('aside', 'task-note', document.body);
              note.dataset.display = ctx.display;
              if (C.noteTitle) E('div', 'note-title', note, C.noteTitle);
              E('div', 'instruction', note, ctx.instruction);
            }
            const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
            const labels =
              ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
                ? ctx.content.END_LABELS.map(labelOf)
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', '✓'];
            const endRng = ctx.rng.fork('chrome/end');
            const placement = endRng.pick(['default', 'default', 'default', 'header', 'perimeter']);
            _c.endLabel = 'Submit';
            if (!(placement === 'default' && endRng.bool(0.8))) {
              const others = labels.filter((x) => x.trim().toLowerCase() !== 'submit');
              if (others.length) _c.endLabel = endRng.pick(others);
            }
            Object.assign(_c, { endRng, labelOf, labels, placement });
          },
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            const { E, bar, ctx, labels, placement } = _c;
            if (!ctx.finish) {
              _c.submit = E('button', 'end-control', document.body, _c.endLabel);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.dataset.placement = placement;
              _c.submit.setAttribute('aria-label', _c.endLabel);
              _c.submit.title = _c.endLabel;
              _c.submit.addEventListener('click', () => ctx.submit());
            }
            const collideRng = ctx.rng.fork('chrome/collide');
            if (collideRng.bool(0.3)) {
              const pool = [...new Set(labels)].filter(
                (x) => x.trim().toLowerCase() !== _c.endLabel.trim().toLowerCase(),
              );
              if (pool.length) {
                const label = collideRng.pick(pool);
                const b = E('button', 'chrome-pq', bar, label);
                b.type = 'button';
                b.dataset.role = 'xtra';
                b.title = label;
                b.setAttribute('aria-label', label);
                b.addEventListener('click', () => env.log('decoy', { label, collide: true }));
              }
            }
            Object.assign(_c, { collideRng });
          },
      },
    },
  });
})();
