(function () {
  'use strict';
  const cfg = {
    'title': 'Contact Manager',
    'theme': 'openlook',
    'layout': 'inspector',
    'tools': 'File    Edit    View    People    Tools    Help',
    'side': 'Contact Details|No contact selected|Name:   \u2014|Email:   \u2014|Phone:   \u2014|Group:   \u2014|Notes:',
  };
  env.site({
    name: 'design-click-control-menu-01',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      const endRng = ctx.rng.fork('chrome/end');
      const endPool = (ctx.content && ctx.content.END_LABELS) || [
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
      const label = endRng.bool(0.5) ? 'Submit' : labelOf(endRng.pick(endPool));
      const placement = ctx.finish
        ? null
        : endRng.pick(['inspector', 'inspector', 'inspector', 'footer', 'header', 'footer']);
      const collideRng = ctx.rng.fork('chrome/collide');
      let collision = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const choices = [
          ...new Set(endPool.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase())),
        ];
        if (choices.length) collision = collideRng.pick(choices);
      }
      document.body.className = 'ref ' + cfg.theme + ' ' + cfg.layout + ' display-' + (ctx.display || 'header');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head, cfg.title);
      if (['qt', 'openlook', 'win92', 'clearlooks', 'industrial', 'electron', 'yosemite'].includes(cfg.theme)) {
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
      let tools = null;
      if (cfg.tools) {
        tools = u.el('div', 'tools', head);
        cfg.tools.split(/ {2,}/).forEach((t) => u.el('span', 'tool-label', tools, t));
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
      if (cfg.layout === 'console' && aside && ctx.display !== 'toast') {
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
      } else u.el('span', 'ready', foot, 'Ready.');
      let submit = null;
      const makeEnd = (parent, cls) => {
        const b = u.el('button', 'submit ' + cls, parent, label);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.addEventListener('click', ctx.submit);
        return b;
      };
      const decoy = (parent, text) => {
        const b = u.el('button', 'chrome-xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        return b;
      };
      if (!ctx.finish) {
        if (placement === 'inspector') {
          const parent = aside || note;
          submit = makeEnd(parent, 'end-inspector');
        } else if (placement === 'footer') {
          submit = makeEnd(foot, 'end-footer');
        } else {
          submit = makeEnd(tools || head, 'end-header');
        }
      }
      if (collision && tools) decoy(tools, collision);
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
