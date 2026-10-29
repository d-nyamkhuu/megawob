// site/ui-click-hover-menu-01: site template generated from the site.js of design-click-control-hover-menu-01, of which many
// design-* sites were restyled copies; they are designs on it (templates/README.md, "Generated site templates"). The
// defaults (design {}) reproduce design-click-control-hover-menu-01. Tokens (each replaced whole): cfg. Parts: frame,
// overlay, and the sections of frame() ('frame.1'..'frame.37'), overlay() ('overlay.1'..'overlay.7'): one per
// statement of the original body, run in order.
(function () {
  'use strict';

  const TOKENS = {
    cfg: {
      "title": "Task Trainer",
      "theme": "qt",
      "layout": "dock",
      "tools": "File    Edit    View    Tools    Help",
      "foot": "Task List|Status|Notes|Actions"
    },
  };

  const base = (S) => ({
    frame: function frame(ctx) {
      const _c = { ctx };
      for (let i = 1; i <= 37; i++) {
        const r = S[`frame.${i}`](_c);
        if (r !== undefined) return r;
      }
    },
    'frame.1': function (_c) {
      const {ctx} = _c;
      const u = ctx.util;
      Object.assign(_c, {
        u
      });
    },
    'frame.2': function (_c) {
      const {cfg} = S;
      document.body.className = 'ref ' + cfg.theme + ' ' + cfg.layout;
    },
    'frame.3': function (_c) {
      const {u} = _c;
      const shell = u.el('main', 'shell', document.body);
      Object.assign(_c, {
        shell
      });
    },
    'frame.4': function (_c) {
      const {shell, u} = _c;
      const head = u.el('header', 'head', shell);
      Object.assign(_c, {
        head
      });
    },
    'frame.5': function (_c) {
      const {cfg} = S;
      const {head, u} = _c;
      const title = u.el('div', 'title', head, cfg.title);
      Object.assign(_c, {
        title
      });
    },
    'frame.6': function (_c) {
      const {cfg} = S;
      const {title, u} = _c;
      if (['qt', 'openlook', 'win92', 'clearlooks', 'industrial', 'electron', 'yosemite'].includes(cfg.theme)) {
        const controls = u.el('span', 'window-controls', title);
        controls.innerHTML = '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      }
    },
    'frame.7': function (_c) {
      const {cfg} = S;
      const {head, u} = _c;
      if (cfg.tools) {
        const tools = u.el('div', 'tools', head);
        cfg.tools.trim().split(/\s+/).forEach(label => {
          const item = u.el('span', 'menu-label', tools);
          u.el('u', '', item, label[0]);
          u.el('span', '', item, label.slice(1));
        });
      }
    },
    'frame.8': function (_c) {
      const {cfg} = S;
      const {shell, u} = _c;
      if (cfg.overview) {
        const ov = u.el('section', 'overview', shell);
        cfg.overview.split('|').forEach((s, i) => u.el(i === 0 ? 'h2' : 'p', '', ov, s));
      }
    },
    'frame.9': function (_c) {
      const {shell, u} = _c;
      const work = u.el('div', 'work', shell);
      Object.assign(_c, {
        work
      });
    },
    'frame.10': function (_c) {
      const {cfg} = S;
      const {u, work} = _c;
      if (cfg.rail) {
        const rail = u.el('nav', 'rail', work);
        cfg.rail.split('|').forEach((s, i) => u.el('div', i === 0 ? 'active' : '', rail, s));
      }
    },
    'frame.11': function (_c) {
      const {u, work} = _c;
      const center = u.el('section', 'center', work);
      Object.assign(_c, {
        center
      });
    },
    'frame.12': function (_c) {
      const {cfg} = S;
      const {center, ctx, u, work} = _c;
      const note = u.el('div', 'instruction', cfg.layout === 'response' ? work : center, ctx.instruction);
      Object.assign(_c, {
        note
      });
    },
    'frame.13': function (_c) {
      const {ctx, note} = _c;
      note.dataset.display = ctx.display;
    },
    'frame.14': function (_c) {
      const {ctx, note} = _c;
      note.hidden = ctx.display === 'hidden';
    },
    'frame.15': function (_c) {
      const {ctx, note} = _c;
      if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
      }
    },
    'frame.16': function (_c) {
      const {center, u} = _c;
      const stage = u.el('div', 'stage', center);
      Object.assign(_c, {
        stage
      });
    },
    'frame.17': function (_c) {
      _c.aside = null;
    },
    'frame.18': function (_c) {
      const {cfg} = S;
      const {u, work} = _c;
      if (cfg.side) {
        _c.aside = u.el('aside', 'inspector', work);
        cfg.side.split('|').forEach((s, i) => u.el(i === 0 ? 'h2' : 'p', '', _c.aside, s));
      }
    },
    'frame.19': function (_c) {
      const {cfg} = S;
      const {ctx, note} = _c;
      if (cfg.layout === 'console' && _c.aside && ctx.display !== 'toast') {
        _c.aside.insertBefore(note, _c.aside.children[1] || null);
      }
    },
    'frame.20': function (_c) {
      const {shell, u} = _c;
      const foot = u.el('footer', 'footer', shell);
      Object.assign(_c, {
        foot
      });
    },
    'frame.21': function (_c) {
      const {cfg} = S;
      const {foot, u} = _c;
      if (cfg.foot) {
        const dock = u.el('div', 'dock-sections', foot);
        cfg.foot.split('|').forEach(s => {
          const d = u.el('section', 'dock-section', dock);
          u.el('strong', '', d, s);
          if (cfg.theme === 'qt') {
            if (s === 'Task List') {
              ['1.  Click the button', '2.  Review result', '3.  Submit', '4.  Finish'].forEach((t, i) => u.el('div', i === 0 ? 'current-task' : 'task-row', d, t));
            } else if (s === 'Status') {
              [['Current Step:', '1 of 4'], ['Status:', 'Not completed'], ['Attempts:', '0'], ['Result:', '—']].forEach(([label, value]) => {
                const row = u.el('div', 'status-row', d);
                u.el('span', 'status-label', row, label);
                u.el('span', 'status-value', row, value);
              });
            } else if (s === 'Notes') {
              const dockNote = u.el('div', 'dock-note', d, 'Follow the instruction above.');
              const scroll = u.el('div', 'notes-scroll', dockNote);
              u.el('span', 'scroll-up', scroll, '');
              u.el('span', 'scroll-down', scroll, '');
            }
          }
        });
      } else u.el('span', 'ready', foot, 'Ready.');
    },
    'frame.22': function (_c) {
      const {ctx, foot, note} = _c;
      if (ctx.display === 'panel') {
        const notes = foot.querySelector('.dock-section:nth-child(3)');
        const oldNote = notes.querySelector('.dock-note');
        if (oldNote) oldNote.remove();
        note.style.cssText = 'display:block;position:static;width:auto;max-width:none;margin:4px 2px;padding:8px 10px;text-align:left;font:16px Arial,sans-serif;font-weight:400;line-height:1.25;white-space:normal;overflow-wrap:anywhere;background:#fafbfd;border:2px inset #e0e5eb;box-shadow:none;transform:none;z-index:auto;';
        notes.appendChild(note);
      }
    },
    'frame.23': function (_c) {
      const {shell, u} = _c;
      const statusbar = u.el('div', 'bottom-status', shell);
      Object.assign(_c, {
        statusbar
      });
    },
    'frame.24': function (_c) {
      const {statusbar, u} = _c;
      u.el('span', '', statusbar, 'Ready');
    },
    'frame.25': function (_c) {
      const {statusbar, u} = _c;
      u.el('span', '', statusbar, 'Tue Apr 23, 2002   10:24 AM');
    },
    'frame.26': function (_c) {
      _c.submit = null;
    },
    'frame.27': function (_c) {
      const {ctx} = _c;
      const endRng = ctx.rng.fork('chrome/end');
      Object.assign(_c, {
        endRng
      });
    },
    'frame.28': function (_c) {
      const {ctx} = _c;
      const endBank = ctx.content && Array.isArray(ctx.content.END_LABELS) ? ctx.content.END_LABELS : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      Object.assign(_c, {
        endBank
      });
    },
    'frame.29': function (_c) {
      const endText = x => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
      Object.assign(_c, {
        endText
      });
    },
    'frame.30': function (_c) {
      const {endBank, endRng, endText} = _c;
      const label = endRng.bool(.5) ? 'Submit' : endText(endRng.pick(endBank.filter(x => endText(x) !== 'Submit')));
      Object.assign(_c, {
        label
      });
    },
    'frame.31': function (_c) {
      const {endRng} = _c;
      const placement = endRng.pick(['actions', 'actions', 'header', 'status']);
      Object.assign(_c, {
        placement
      });
    },
    'frame.32': function (_c) {
      const {ctx} = _c;
      const collideRng = ctx.rng.fork('chrome/collide');
      Object.assign(_c, {
        collideRng
      });
    },
    'frame.33': function (_c) {
      _c.collide = null;
    },
    'frame.34': function (_c) {
      const {collideRng, endBank, endText, label} = _c;
      if (collideRng.bool(.3)) {
        const choices = [...new Set(endBank.map(endText).filter(x => x.trim().toLowerCase() !== label.trim().toLowerCase()))];
        if (choices.length) _c.collide = collideRng.pick(choices);
      }
    },
    'frame.35': function (_c) {
      const {u} = _c;
      const decoyBtn = (parent, text, isCollide) => {
        const b = u.el('button', 'xtra-task', parent, text);
        b.type = 'button';
        b.style.cssText = parent.classList.contains('tools') ? 'width:auto;min-width:58px;height:27px;margin:0 0 0 5px;padding:2px 8px;font:14px Arial;vertical-align:middle;background:linear-gradient(#e0e5ed,#bec5d0);border:2px ridge #a1adbd;' : 'width:auto;min-width:65px;height:34px;margin:15px 2px 0;padding:3px 7px;font:14px Arial;background:linear-gradient(#e0e5ed,#bec5d0);border:2px ridge #a1adbd;';
        b.addEventListener('click', () => env.log('decoy', isCollide ? {
          label: text,
          collide: true
        } : {
          label: text
        }));
        return b;
      };
      Object.assign(_c, {
        decoyBtn
      });
    },
    'frame.36': function (_c) {
      const {collideRng, ctx, decoyBtn, foot, label, placement, shell, statusbar, u} = _c;
      if (!ctx.finish) {
        const actions = foot.querySelector('.dock-section:last-child');
        const makeEnd = (parent, compact) => {
          const b = u.el('button', compact ? 'submit chrome-submit' : 'submit', parent, label);
          b.type = 'button';
          b.addEventListener('click', ctx.submit);
          if (compact) b.style.cssText = 'width:auto;min-width:74px;height:27px;margin:0 0 0 8px;padding:2px 10px;font:700 14px Arial;vertical-align:middle;';
          return b;
        };
        if (placement === 'actions') {
          _c.submit = makeEnd(actions, false);
          const resetBtn = actions.querySelector('.reset-task');
          if (resetBtn) actions.insertBefore(_c.submit, resetBtn);
        } else if (placement === 'header') _c.submit = makeEnd(shell.querySelector('.tools'), true); else _c.submit = makeEnd(statusbar, true);
        if (_c.collide) decoyBtn(collideRng.pick([shell.querySelector('.tools'), actions]), _c.collide, true);
      }
    },
    'frame.37': function (_c) {
      const {stage} = _c;
      return {
        stage,
        submit: _c.submit
      };
    },
    overlay: function overlay(ctx) {
      const _c = { ctx };
      for (let i = 1; i <= 7; i++) {
        const r = S[`overlay.${i}`](_c);
        if (r !== undefined) return r;
      }
    },
    'overlay.1': function (_c) {
      const {ctx} = _c;
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      Object.assign(_c, {
        el
      });
    },
    'overlay.2': function (_c) {
      const {ctx, el} = _c;
      ctx.util.el('strong', '', el, ({
        cookie: 'Cookie preferences',
        toast: 'Notification',
        chat: 'Support',
        promo: 'A special offer',
        banner: 'Service notice'
      })[ctx.kind]);
    },
    'overlay.3': function (_c) {
      const {ctx, el} = _c;
      ctx.util.el('p', '', el, ({
        cookie: 'Choose your preferences to continue.',
        toast: 'Your workspace is ready.',
        chat: 'How can we help?',
        promo: 'Explore the latest tools.',
        banner: 'A new update is available.'
      })[ctx.kind]);
    },
    'overlay.4': function (_c) {
      const {ctx, el} = _c;
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      Object.assign(_c, {
        dismiss
      });
    },
    'overlay.5': function (_c) {
      const {dismiss} = _c;
      dismiss.type = 'button';
    },
    'overlay.6': function (_c) {
      const {ctx, dismiss} = _c;
      dismiss.addEventListener('click', ctx.dismiss);
    },
    'overlay.7': function (_c) {
      const {dismiss, el} = _c;
      return {
        el,
        dismiss
      };
    },
  });

  env.template('site/click-control-hover-menu-01', (design, def) => {
    const S = {};
    const { D, P } = env.templateDesign('site/click-control-hover-menu-01', design, def, { tokens: TOKENS, base: base(S), state: S });
    Object.assign(S, D, P);
    return { frame: P.frame, overlay: P.overlay };
  });
})();
