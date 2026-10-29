// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-star-reply-02',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'cdrom',
        'brand': 'WorldView Online',
        'nav': 'Explore   Learn   Connect',
        'bg': '#092b4b',
        'surface': '#e9e0ce',
        'fg': '#111',
        'line': '#b4a589',
        'title': '#181455',
        'titlefg': '#f3d56e',
        'control': 'linear-gradient(#e4dacb,#c9bda9)',
        'accent': 'linear-gradient(#664374,#382349)',
        'sel': '#225dd0',
        'selfg': '#fff',
        'font': '"Times New Roman",serif',
        'bar': 45,
        'foot': 26,
        'note':
          'left:1%;top:8%;width:98%;height:9%;background:#fff0c3;padding:8px 16px;font-size:21px;border:2px solid #b59a50',
        'end': 'right:2%;top:9%;font-family:Georgia,serif;color:#ffe082;padding:5px 28px',
        'geo': {
          'folders': 'display:none',
          'ledger': 'left:1%;top:18%;width:39%;height:80%',
          'document': 'left:40.5%;top:18%;width:58.5%;height:43%',
          'editor': 'left:40.5%;top:62%;width:58.5%;height:36%',
          'contacts': 'display:none',
        },
        'site': 'design-use-email-star-reply-02',
        'scenario': 'star-reply',
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
        'rowHeight': 51,
        'stack': false,
        'dock': ['A Brighter Tomorrow Together'],
      },
      parts: {
        'frame.7': () => () => {},
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.15': (base, S) =>
          function (_c) {
            const { E, ctx } = _c;
            if (ctx.display !== 'hidden') {
              const note = E('aside', 'task-note', document.body);
              note.dataset.display = ctx.display;
              if (ctx.display === 'panel') E('div', 'note-title', note, 'Message from the task desk');
              E('div', 'instruction', note, ctx.instruction);
            }
          },
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            const { E, bar, ctx } = _c;
            _c.endDecoy = null;
            if (!ctx.finish) {
              const er = ctx.rng.fork('chrome/end');
              const labels = (ctx.content && ctx.content.END_LABELS) || [
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
              const pool = labels.map(labelOf);
              const common = er.bool(0.5);
              const label = common
                ? pool.find((x) => x.trim().toLowerCase() === 'submit') || 'Submit'
                : labelOf(er.pick(pool));
              const place = common ? 'header' : er.pick(['header', 'link', 'icon']);
              const tag = place === 'link' ? 'a' : 'button';
              _c.submit = E(
                tag,
                'end-control ' + (place === 'link' ? 'end-link' : place === 'icon' ? 'end-icon' : ''),
                document.body,
                place === 'icon' ? '✓' : label,
              );
              if (tag === 'a') _c.submit.href = '#';
              else _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.dataset.place = place;
              _c.submit.setAttribute('aria-label', label);
              _c.submit.title = label;
              _c.submit.addEventListener('click', (e) => {
                e.preventDefault();
                ctx.submit();
              });
              const cr = ctx.rng.fork('chrome/collide');
              if (cr.bool(0.3)) {
                const options = [...new Set(pool.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase()))];
                if (options.length) {
                  const text = labelOf(cr.pick(options));
                  _c.endDecoy = E('button', 'chrome-end-xtra', bar, text);
                  _c.endDecoy.type = 'button';
                  _c.endDecoy.dataset.role = 'xtra';
                  _c.endDecoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
                }
              }
            }
          },
      },
    },
  });
})();
