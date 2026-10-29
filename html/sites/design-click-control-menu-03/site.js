(function () {
  'use strict';
  const cfg = {
    'title': 'Document Editor - Untitled 1',
    'theme': 'gtk',
    'layout': 'inspector',
    'tools': 'Menu    Edit    View    Insert    Format    Tools    Table    Help',
    'side': 'Document|Title:|Format:|Words:|Characters:',
  };
  env.site({
    name: 'design-click-control-menu-03',
    styles: ['site.css', 'gtk.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref ' + cfg.theme + ' ' + cfg.layout;
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head, cfg.title);
      const appIcon = u.el('span', 'gtk-appicon', title);
      appIcon.innerHTML =
        '<svg viewBox="0 0 24 28" fill="none" stroke="#61758e" stroke-width="1.3"><path d="M3 1h15l3 3v22H3z" fill="#eef3fa"/><path d="M17 1v5h4M6 8h6v5H6zM12 16h6v5h-6z" fill="#bbcadd"/><path d="M11 6h6v5h-6zM6 18h6v5H6z" fill="#fff"/><path d="M7 15h10M9 12v5M16 12v4"/></svg>';
      if (['qt', 'openlook', 'gtk', 'win92', 'clearlooks', 'industrial', 'electron', 'yosemite'].includes(cfg.theme)) {
        const controls = u.el('span', 'window-controls', title);
        controls.innerHTML =
          '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      }
      if (cfg.theme === 'openlook') {
        const badge = u.el('span', 'app-badge', title);
        badge.innerHTML =
          '<svg viewBox="0 0 24 24"><rect x="5" y="6" width="14" height="15" rx="2" fill="#172335" stroke="#fff"/><path d="M7 5Q12 0 17 5M4 8v13h15" fill="none" stroke="#172335"/></svg>';
        u.el('span', 'sun-brand', title, '❖ Sun');
      }
      if (cfg.tools) {
        const tools = u.el('div', 'tools', head);
        cfg.tools.split(/ {2,}/).forEach((t) => {
          const label = u.el('span', 'tool-label', tools);
          u.el('u', '', label, t[0]);
          label.appendChild(document.createTextNode(t.slice(1)));
        });
        const tb = u.el('div', 'toolbar', head);
        const S = (d, x) =>
          '<span class="tb-ico' +
          (x || '') +
          '"><svg viewBox="0 0 24 24" fill="url(#gtk-paper)" stroke="#556273" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"><defs><linearGradient id="gtk-paper" x2="0" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#d2d6db"/></linearGradient></defs>' +
          d +
          '</svg></span>';
        const L = (a) =>
          a.map((w, i) => '<path d="M' + (4 + (w[0] || 0)) + ' ' + (5 + i * 5) + 'h' + w[1] + '"/>').join('');
        tb.innerHTML =
          S('<path d="M6 3h8l4 4v14H6z"/>') +
          S('<rect x="5" y="5" width="14" height="16" rx="2"/><rect x="9" y="3" width="6" height="4"/>') +
          S('<path d="M7 9V3h10v6M6 17H3v-8h18v8h-3M7 14h10v7H7z"/>') +
          S('<path d="M9 7 4 12l5 5M4 12h10a6 6 0 0 1 6 6" stroke="#9a9ea6"/>') +
          S('<path d="m15 7 5 5-5 5M20 12H10a6 6 0 0 0-6 6" stroke="#9a9ea6"/>') +
          '<span class="tb-sel wide">Sans <em>&#8964;</em></span><span class="tb-sel">12 <em>&#8964;</em></span><b>B</b><i>I</i><u>U</u>' +
          S(
            L([
              [0, 16],
              [0, 10],
              [0, 16],
              [0, 10],
            ]),
            ' on',
          ) +
          S(
            L([
              [2, 12],
              [0, 16],
              [2, 12],
              [0, 16],
            ]),
          ) +
          S(
            L([
              [4, 12],
              [0, 16],
              [4, 12],
              [0, 16],
            ]),
          ) +
          S(
            L([
              [0, 16],
              [0, 16],
              [0, 16],
              [0, 16],
            ]),
          ) +
          S(
            '<path d="M10 6h10M10 12h10M10 18h10"/><circle cx="5" cy="6" r="1"/><circle cx="5" cy="12" r="1"/><circle cx="5" cy="18" r="1"/>',
          ) +
          S('<path d="M11 6h9M11 12h9M11 18h9M4 5h3v4M4 11h3l-3 3h3M4 17h3v4H4"/>') +
          S('<path d="M11 6h9M11 12h9M11 18h9M4 8l3 2-3 2"/>') +
          S('<path d="M11 6h9M11 12h9M11 18h9M7 8l-3 2 3 2"/>');
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
      const display = ctx.display;
      const note = u.el('div', 'instruction', cfg.layout === 'response' ? work : center, ctx.instruction);
      note.dataset.display = display;
      note.hidden = display === 'hidden';
      const stage = u.el('div', 'stage', center);
      let aside = null;
      if (cfg.side) {
        aside = u.el('aside', 'inspector', work);
        cfg.side.split('|').forEach((s, i) => {
          const line = u.el(i === 0 ? 'h2' : 'p', '', aside);
          if (i > 1 && s.includes('—')) {
            u.el('span', 'detail-label', line, s.split(':')[0] + ':');
            u.el('span', 'detail-value', line, '—');
          } else if (i === 1) u.el('span', 'contact-empty', line, s);
          else line.textContent = s;
          if (i === 1) {
            const portrait = u.el('span', 'portrait', line);
            portrait.innerHTML =
              '<svg viewBox="0 0 90 90"><circle cx="45" cy="29" r="14"/><path d="M24 76V61C24 37 66 37 66 61V76Z"/></svg>';
            line.prepend(portrait);
          }
          if (i === 6) {
            const notes = u.el('div', 'notes-box', line);
            const track = u.el('div', 'notes-track', notes);
            u.el('span', 'notes-up', track, '▲');
            u.el('span', 'notes-down', track, '▼');
          }
        });
      }
      if (display === 'panel' && aside) {
        note.classList.add('instruction-panel');
        aside.appendChild(note);
      }
      if (display === 'toast') {
        note.classList.add('instruction-toast');
        document.body.appendChild(note);
      }
      if (cfg.layout === 'console' && aside && display !== 'toast' && display !== 'panel') {
        aside.insertBefore(note, aside.children[1] || null);
      }
      const foot = u.el('footer', 'footer', shell);
      if (cfg.foot) {
        const dock = u.el('div', 'dock-sections', foot);
        cfg.foot.split('|').forEach((s) => {
          const d = u.el('section', 'dock-section', dock);
          u.el('strong', '', d, s);
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
      } else u.el('span', 'ready', foot, 'Ln 1, Col 1');
      const status = foot.querySelector('.ready');
      if (status) u.el('span', '', status, 'INS');
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const placement = er.pick(['inspector', 'inspector', 'toolbar', 'status']);
        shell.dataset.endPlacement = placement;
        const bank = (ctx.content && ctx.content.END_LABELS) || [
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
        const alternate = labelOf(er.pick(bank));
        const label = placement === 'inspector' ? 'Submit' : alternate;
        const cr = ctx.rng.fork('chrome/collide');
        let collide = null;
        if (cr.bool(0.3)) {
          const options = [...new Set(bank.map(labelOf))].filter(
            (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
          );
          if (options.length) collide = cr.pick(options);
        }
        const decoy = (parent, text, isEnd) => {
          const b = u.el('button', 'gtk-xtra', parent, text);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.addEventListener('click', () => env.log('decoy', isEnd ? { label: text, collide: true } : { label: text }));
        };
        if (placement === 'inspector') {
          submit = u.el('button', 'submit gtk-end', aside || foot, label);
          submit.type = 'button';
          submit.addEventListener('click', ctx.submit);
        } else if (placement === 'toolbar') {
          submit = u.el('button', 'gtk-end gtk-end-toolbar', head.querySelector('.toolbar') || head, label);
          submit.type = 'button';
          submit.addEventListener('click', ctx.submit);
        } else {
          submit = u.el('a', 'gtk-endlink', foot, label + ' ›');
          submit.href = '#';
          submit.dataset.role = 'submit';
          submit.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
        }
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        if (collide) decoy(foot, collide, true);
        const dr = ctx.rng.fork('chrome/decoy');
        const ds = (ctx.content && ctx.content.DECOY_LABELS) || [];
        if (ds.length && dr.bool(0.35)) decoy(foot, labelOf(dr.pick(ds)), false);
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
