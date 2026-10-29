(function () {
  'use strict';
  const cfg = { 'title': 'Text Utility', 'theme': 'aqua', 'layout': 'dock', 'tools': '', 'foot': '' };
  env.site({
    name: 'design-handle-text-copy-paste-2-08',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref ' + cfg.theme + ' ' + cfg.layout;
      document.body.classList.toggle('aqua-note-header', ctx.display === 'header' && !ctx.finish);
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head);
      u.el('span', 'title-text', title, cfg.title);
      if (['qt', 'openlook', 'win92', 'clearlooks', 'industrial', 'electron', 'yosemite', 'aqua'].includes(cfg.theme)) {
        const controls = u.el('span', 'window-controls', title);
        controls.innerHTML =
          '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      }
      if (cfg.tools) u.el('div', 'tools', head, cfg.tools);
      if (cfg.theme === 'aqua') {
        const tabs = u.el('nav', 'ribbon-tabs', head);
        ['Home', 'Edit', 'View', 'Tools', 'Help'].forEach((x, i) => u.el('div', i === 0 ? 'selected' : '', tabs, x));
        const ribbon = u.el('div', 'ribbon', head);
        [
          [
            'Clipboard',
            [
              ['✂', 'Cut'],
              ['▣', 'Copy'],
              ['▤', 'Paste'],
            ],
          ],
          [
            'Find & Select',
            [
              ['⌕', 'Find'],
              ['ab↔ac', 'Replace'],
              ['▧', 'Select All'],
            ],
          ],
          [
            'Text Options',
            [
              ['A', 'Font'],
              ['▤', 'Word Wrap'],
              ['☷', 'Line Numbers'],
            ],
          ],
          [
            'Zoom',
            [
              ['⊖', 'Zoom Out'],
              ['⊕', 'Zoom In'],
              ['100%⌄', ''],
            ],
          ],
          ['Settings', [['⚙', 'Preferences']]],
        ].forEach((g) => {
          const group = u.el('section', 'ribbon-group', ribbon),
            acts = u.el('div', 'ribbon-actions', group);
          g[1].forEach((a) => {
            const b = u.el('div', 'ribbon-action', acts);
            u.el('span', 'ribbon-icon', b, a[0]);
            u.el('span', 'ribbon-label', b, a[1]);
          });
          u.el('span', 'ribbon-caption', group, g[0]);
        });
      }
      if (cfg.theme === 'aqua') {
        const tabs = u.el('nav', 'ribbon-tabs', head);
        ['Home', 'Edit', 'View', 'Tools', 'Help'].forEach((x, i) => u.el('div', i === 0 ? 'selected' : '', tabs, x));
        const ribbon = u.el('div', 'ribbon', head);
        [
          [
            'Clipboard',
            [
              ['✂', 'Cut'],
              ['▣', 'Copy'],
              ['▤', 'Paste'],
            ],
          ],
          [
            'Find & Select',
            [
              ['⌕', 'Find'],
              ['ab↔ac', 'Replace'],
              ['▧', 'Select All'],
            ],
          ],
          [
            'Text Options',
            [
              ['A', 'Font'],
              ['▤', 'Word Wrap'],
              ['☷', 'Line Numbers'],
            ],
          ],
          [
            'Zoom',
            [
              ['⊖', 'Zoom Out'],
              ['⊕', 'Zoom In'],
              ['100%⌄', ''],
            ],
          ],
          ['Settings', [['⚙', 'Preferences']]],
        ].forEach((g) => {
          const group = u.el('section', 'ribbon-group', ribbon);
          const acts = u.el('div', 'ribbon-actions', group);
          g[1].forEach((a) => {
            const b = u.el('div', 'ribbon-action', acts);
            u.el('span', 'ribbon-icon', b, a[0]);
            u.el('span', 'ribbon-label', b, a[1]);
          });
          u.el('span', 'ribbon-caption', group, g[0]);
        });
      }
      if (cfg.overview) {
        const ov = u.el('section', 'overview', shell);
        cfg.overview.split('|').forEach((s, i) => u.el(i === 0 ? 'h2' : 'p', '', ov, s));
      }
      const work = u.el('div', 'work', shell);
      if (cfg.rail) {
        const rail = u.el('nav', 'rail', work);
        cfg.rail.split('|').forEach((s, i) => u.el('div', i === 0 ? 'active' : '', rail, s));
      }
      const center = u.el('section', 'center', work);
      const note = u.el('div', 'instruction', cfg.layout === 'response' ? work : center, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
      }
      const stage = u.el('div', 'stage', center);
      let aside = null;
      if (cfg.side) {
        aside = u.el('aside', 'inspector', work);
        cfg.side.split('|').forEach((s, i) => u.el(i === 0 ? 'h2' : 'p', '', aside, s));
      }
      if (cfg.layout === 'console' && aside && ctx.display !== 'toast') {
        aside.insertBefore(note, aside.children[1] || null);
      }
      const foot = u.el('footer', 'footer', shell);
      if (ctx.display === 'header' && !note.hidden) {
        center.insertBefore(note, stage);
        note.classList.add('aqua-header-note');
      }
      if (ctx.display === 'toast' && !note.hidden) {
        note.classList.add('aqua-toast');
        foot.insertBefore(note, foot.firstChild);
      }
      if (cfg.foot) {
        const dock = u.el('div', 'dock-sections', foot);
        cfg.foot.split('|').forEach((s) => {
          const d = u.el('section', 'dock-section', dock);
          const parts = s.split(/ (.+)/);
          const label = u.el('div', 'dock-copy', d);
          u.el('strong', '', label, parts[0]);
          u.el('span', '', label, parts[1] || '');
          if (cfg.theme === 'qt') {
            if (s === 'Task List') {
              ['1.  Click requested control', '2.  Review result', '3.  Submit', '4.  Finish'].forEach((t, i) =>
                u.el('div', i === 0 ? 'current-task' : 'task-row', d, t),
              );
            } else if (s === 'Status') {
              ['Current Step:     1 of 4', 'Status:    Not completed', 'Attempts:    0', 'Result:    —'].forEach((t) =>
                u.el('div', 'status-row', d, t),
              );
            } else if (s === 'Notes') {
              u.el('div', 'dock-note', d, 'Follow the instruction above.');
            }
          }
        });
      } else {
        u.el('span', 'ready', foot, 'Ready.');
        if (cfg.theme === 'aqua') {
          const clear = u.el('button', 'clear', foot, 'Clear');
          clear.type = 'button';
          clear.addEventListener('click', () => {
            const input = document.querySelector('.ut-input');
            if (input) {
              input.value = '';
              input.dispatchEvent(new Event('input', { bubbles: true }));
              input.focus();
            }
          });
        }
      }
      if (cfg.theme === 'modernist') {
        const paths = [
          'M21 8h18l13 14v36q0 5-5 5H21q-5 0-5-5V13q0-5 5-5Z M39 8v14h13 M16 20H10q-6 0-6 6v39q0 5 5 5h23q5 0 5-5v-2',
          'M18 8h-5q-5 0-5 5v46q0 5 5 5h34q5 0 5-5V13q0-5-5-5h-7 M23 3h12q5 0 5 5v7H18V8q0-5 5-5Z',
          'M9 18h43q4 0 4 4v28q0 4-4 4H9q-5 0-5-4V22q0-4 5-4Z M13 28h4v2h-4Z M27 28h4v2h-4Z M41 28h4v2h-4Z M13 41h12v2H13Z M39 41h5v2h-5Z',
          'M30 3c-13 0-19 9-19 23v20c0 15 7 24 19 24s19-9 19-24V26C49 12 43 3 30 3Z M29 17h2v11h-2Z',
        ];
        foot.querySelectorAll('.dock-section').forEach((d, i) => {
          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.setAttribute('viewBox', '0 0 60 76');
          svg.innerHTML = '<path d="' + paths[i] + '"/>';
          d.prepend(svg);
        });
      }
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end'),
          cr = ctx.rng.fork('chrome/collide'),
          raw = (ctx.content && ctx.content.END_LABELS) || [
            'Submit',
            'Done',
            'Finish',
            'Continue',
            'Save',
            'OK',
            'Confirm',
            'Apply',
            '✓',
          ];
        const text = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x));
        const labels = raw.map(text);
        const label =
          er.bool(0.5) && labels.some((x) => x.toLowerCase() === 'submit')
            ? 'Submit'
            : er.pick(labels.filter((x) => x.toLowerCase() !== 'submit'));
        const pr = ctx.rng.fork('chrome/end-place'),
          place = pr.float() < 0.5 ? 'footer' : pr.float() < 0.5 ? 'ribbon' : 'link';
        const button = (parent, cls, word, action) => {
          const b = u.el(cls === 'aqua-endlink' ? 'a' : 'button', cls, parent, word);
          if (b.tagName === 'BUTTON') b.type = 'button';
          else b.href = '#';
          b.title = label;
          b.setAttribute('aria-label', label);
          b.addEventListener('click', (e) => {
            e.preventDefault();
            action();
          });
          return b;
        };
        const collide = cr.bool(0.3) ? cr.pick(labels.filter((x) => x.toLowerCase() !== label.toLowerCase())) : null;
        if (place === 'footer') submit = button(foot, 'submit', label, ctx.submit);
        else if (place === 'ribbon') submit = button(head, 'aqua-ribbon-end', label, ctx.submit);
        else submit = button(foot, 'aqua-endlink', label, ctx.submit);
        if (collide) {
          const d = button(place === 'ribbon' ? head : foot, 'aqua-xtra', collide, () =>
            env.log('decoy', { label: collide, collide: true }),
          );
          d.removeAttribute('title');
          d.removeAttribute('aria-label');
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong',
        '',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      ctx.util.el(
        'p',
        '',
        el,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Explore the latest tools.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
