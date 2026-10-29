// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-star-06',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'flash',
        'brand': 'Mail',
        'nav': 'File  Edit  View  Mailbox  Message  Format  Window  Help',
        'bg': '#9fcbef',
        'surface': '#eff6fc',
        'fg': '#062354',
        'line': '#8daed0',
        'title': '#3164a2',
        'titlefg': '#fff',
        'control': '#d3e4f4',
        'accent': '#f6d956',
        'accentfg': '#082356',
        'sel': '#c3ddf3',
        'bar': 75,
        'note': 'left:1%;top:13%;width:19%;background:#ffe896;clip-path:polygon(0 0,100% 0,100% 86%,90% 100%,0 100%)',
        'end': 'left:2%;bottom:5%;width:17%;clip-path:polygon(9% 0,94% 0,100% 50%,90% 100%,0 100%,0 60%)',
        'geo': {
          'folders': 'left:.5%;top:24%;width:20%;height:74%;background:#80b6e8;border:0',
          'ledger': 'left:21.2%;top:1%;width:78%;height:44%',
          'document': 'left:21.2%;top:47%;width:78%;height:51%',
          'editor': 'left:52%;top:48%;width:47%;height:50%',
          'contacts': 'display:none',
        },
        'site': 'design-use-email-star-06',
        'scenario': 'star',
        'platform': 'web',
        'account': 'Mon Apr 23   10:24 AM',
        'noteTitle': 'Task',
        'folderLabels': {
          'sent': 'Sent Mail',
          'drafts': 'Drafts',
          'junk': 'Junk',
          'spam': 'Spam',
          'templates': 'Templates',
          'compose': 'Compose',
        },
        'folderList': ['inbox', 'compose', 'sent', 'drafts', 'trash'],
        'rowHeight': 44,
        'stack': false,
        'dock': [],
      },
      parts: {
        'frame.7': () => () => {},
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.15': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E, bar, ctx } = _c;
            _c.display = ctx.display || 'header';
            const W = window.innerWidth,
              H = window.innerHeight;
            if (_c.display === 'panel' && W < 1260) _c.display = 'header';
            if (_c.display === 'toast' && H < 700) _c.display = 'header';
            if (_c.display !== 'hidden') {
              const note = E('aside', 'task-note', document.body);
              note.dataset.display = _c.display;
              const title = C.noteTitle ? E('div', 'note-title', note, C.noteTitle) : null;
              E('div', 'instruction', note, ctx.instruction);
              if (_c.display === 'panel') {
                Object.assign(note.style, {
                  left: '74%',
                  top: '14%',
                  width: '24%',
                  height: 'auto',
                  maxHeight: '25%',
                  padding: '14px',
                  background: 'linear-gradient(#f8fcff,#edf7ff)',
                  border: '1px solid #a8c7e6',
                  borderRadius: '8px',
                  clipPath: 'none',
                  boxShadow: '0 3px 12px #06366a33',
                  fontSize: 'clamp(14px,1.15vw,19px)',
                  lineHeight: '1.3',
                  color: '#12315d',
                });
                if (title)
                  Object.assign(title.style, {
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    padding: '0 0 7px',
                    margin: '0 0 8px',
                    background: 'transparent',
                    color: '#4776a8',
                    borderBottom: '1px solid #c6daec',
                  });
              } else if (_c.display === 'toast') {
                Object.assign(note.style, {
                  left: '74%',
                  top: '14%',
                  width: '24%',
                  height: 'auto',
                  minHeight: '7%',
                  padding: '12px 16px',
                  background: 'linear-gradient(#f8fcff,#edf7ff)',
                  border: '1px solid #a8c7e6',
                  borderRadius: '8px',
                  clipPath: 'none',
                  boxShadow: '0 3px 12px #06366a33',
                  fontSize: 'clamp(14px,1.15vw,19px)',
                  lineHeight: '1.3',
                  color: '#12315d',
                });
              }
            }
            const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
            const defaults = [
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
            const labels =
              ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
                ? ctx.content.END_LABELS.map(labelOf)
                : defaults;
            const er = ctx.rng.fork('chrome/end');
            const placement = er.pick(['header', 'header', 'header', 'footer', 'link', 'footer']);
            const alternatives = labels.filter((x) => x.trim().toLowerCase() !== 'submit');
            const label = er.bool(0.5) ? 'Submit' : labelOf(er.pick(alternatives.length ? alternatives : labels));
            const cr = ctx.rng.fork('chrome/collide');
            _c.collide = null;
            if (cr.bool(0.3)) {
              const pool = [...new Set(labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase()))];
              if (pool.length) _c.collide = labelOf(cr.pick(pool));
            }
            if (_c.collide) {
              const d = E('button', 'chrome-nav end-xtra', bar, _c.collide);
              d.type = 'button';
              d.addEventListener('click', () => env.log('decoy', { label: _c.collide, collide: true }));
            }
            Object.assign(_c, { H, W, alternatives, cr, defaults, er, label, labelOf, labels, placement });
          },
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            const { E, ctx, label, placement } = _c;
            if (!ctx.finish) {
              const isLink = placement === 'link';
              _c.submit = E(
                isLink ? 'a' : 'button',
                'end-control' + (isLink ? ' end-link' : ''),
                document.body,
                isLink ? label + ' ›' : label,
              );
              if (isLink) _c.submit.href = '#';
              else _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.setAttribute('aria-label', label);
              _c.submit.title = label;
              _c.submit.addEventListener('click', (e) => {
                e.preventDefault();
                ctx.submit();
              });
              if (placement === 'footer')
                Object.assign(_c.submit.style, {
                  left: '23%',
                  top: 'auto',
                  right: 'auto',
                  bottom: '7%',
                  width: 'auto',
                  height: 'auto',
                  minWidth: '8%',
                  padding: '9px 22px',
                  whiteSpace: 'nowrap',
                });
              if (isLink)
                Object.assign(_c.submit.style, {
                  left: '23%',
                  top: 'auto',
                  right: 'auto',
                  bottom: '7%',
                  width: 'auto',
                  height: 'auto',
                  padding: '8px 12px',
                  background: 'transparent',
                  border: 0,
                  boxShadow: 'none',
                  clipPath: 'none',
                  color: '#fff',
                  textDecoration: 'underline',
                  textShadow: '0 1px 3px #123',
                  whiteSpace: 'nowrap',
                });
            }
          },
      },
    },
  });
})();
