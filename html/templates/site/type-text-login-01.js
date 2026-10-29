// site/form-text-login-01: site template generated from the site.js of design-type-text-login-01, of which many design-*
// sites were restyled copies; they are designs on it (templates/README.md, "Generated site templates"). The defaults
// (design {}) reproduce design-type-text-login-01. Tokens (each replaced whole): C. Parts: frame, overlay, and the
// sections of frame() ('frame.1'..'frame.27'), overlay() ('overlay.1'..'overlay.8'): one per statement of the
// original body, run in order.
(function () {
  'use strict';

  const TOKENS = {
    C: {
      "site": "design-type-text-login-01",
      "brand": "Account Access",
      "title": "",
      "instruction": "top",
      "rail": "",
      "menu": "Home|Accounts|Settings|Help|Sign out",
      "briefTitle": "Instructions"
    },
  };

  const base = (S) => ({
    frame: function frame(ctx) {
      const _c = { ctx };
      for (let i = 1; i <= 27; i++) {
        const r = S[`frame.${i}`](_c);
        if (r !== undefined) return r;
      }
    },
    'frame.1': function (_c) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
    },
    'frame.2': function (_c) {
      const selection = window.getSelection();
      Object.assign(_c, {
        selection
      });
    },
    'frame.3': function (_c) {
      const {selection} = _c;
      if (selection) selection.removeAllRanges();
    },
    'frame.4': function (_c) {
      const {ctx} = _c;
      const u = ctx.util;
      Object.assign(_c, {
        u
      });
    },
    'frame.5': function (_c) {
      const {u} = _c;
      const top = u.el('header', 'ds-top', document.body);
      Object.assign(_c, {
        top
      });
    },
    'frame.6': function (_c) {
      const {C} = S;
      const {top, u} = _c;
      u.el('span', 'ds-brand', top, C.brand);
    },
    'frame.7': function (_c) {
      const {top, u} = _c;
      u.el('span', '', top, '−    □    ×');
    },
    'frame.8': function (_c) {
      const {C} = S;
      const {u} = _c;
      if (C.menu) {
        const nav = u.el('nav', 'ds-menu', document.body);
        C.menu.split('|').forEach(t => u.el('span', '', nav, t));
      }
    },
    'frame.9': function (_c) {
      const {u} = _c;
      const body = u.el('div', 'ds-body', document.body);
      Object.assign(_c, {
        body
      });
    },
    'frame.10': function (_c) {
      const {C} = S;
      const {body, u} = _c;
      if (C.rail) {
        const rail = u.el('aside', 'ds-rail', body);
        C.rail.split('|').forEach(t => u.el('div', '', rail, t));
      }
    },
    'frame.11': function (_c) {
      const {body, u} = _c;
      const content = u.el('div', 'ds-content', body);
      Object.assign(_c, {
        content
      });
    },
    'frame.12': function (_c) {
      const {C} = S;
      const natural = C.instruction;
      Object.assign(_c, {
        natural
      });
    },
    'frame.13': function (_c) {
      const {ctx, natural} = _c;
      const mode = ctx.display === 'hidden' ? 'hidden' : ctx.display === 'toast' ? 'toast' : ctx.display === 'panel' ? 'left' : natural;
      Object.assign(_c, {
        mode
      });
    },
    'frame.14': function (_c) {
      const {C} = S;
      const {ctx, u} = _c;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle || 'Task');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      Object.assign(_c, {
        briefing
      });
    },
    'frame.15': function (_c) {
      const {briefing, content, mode} = _c;
      if (mode === 'top') briefing(content, 'ds-header-note');
    },
    'frame.16': function (_c) {
      const {content, u} = _c;
      const main = u.el('div', 'ds-main', content);
      Object.assign(_c, {
        main
      });
    },
    'frame.17': function (_c) {
      const {briefing, main, mode} = _c;
      if (mode === 'left' || mode === 'right') {
        const b = briefing(main, 'ds-brief');
        if (mode === 'right') b.style.order = '2';
      }
    },
    'frame.18': function (_c) {
      const {main, u} = _c;
      const stage = u.el('main', 'ds-stage', main);
      Object.assign(_c, {
        stage
      });
    },
    'frame.19': function (_c) {
      const {briefing, content, main, mode} = _c;
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
    },
    'frame.20': function (_c) {
      const {content, u} = _c;
      const foot = u.el('footer', 'ds-footer', content);
      Object.assign(_c, {
        foot
      });
    },
    'frame.21': function (_c) {
      const {foot, u} = _c;
      u.el('span', '', foot, 'Ready');
    },
    'frame.22': function (_c) {
      _c.submit = null;
    },
    'frame.23': function (_c) {
      _c.placement = null;
    },
    'frame.24': function (_c) {
      _c.label = 'Submit';
    },
    'frame.25': function (_c) {
      _c.collide = null;
    },
    'frame.26': function (_c) {
      const {ctx, foot, top, u} = _c;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const canonical = er.bool(0.5);
        if (!canonical) {
          _c.placement = er.pick(['header', 'link']);
          const labels = ctx.content && ctx.content.END_LABELS;
          const pool = Array.isArray(labels) && labels.length ? labels : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
          _c.label = String(er.pick(pool));
        }
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const labels = ctx.content && ctx.content.END_LABELS;
          const pool = (Array.isArray(labels) && labels.length ? labels : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']).map(x => typeof x === 'string' ? x : x.label || x.text || x.name || String(x));
          const options = [...new Set(pool)].filter(x => String(x).trim().toLowerCase() !== _c.label.trim().toLowerCase());
          if (options.length) _c.collide = cr.pick(options);
        }
        const addDecoy = (parent, text) => {
          const b = u.el('button', 'ds-xtra', parent, text);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.addEventListener('click', () => env.log('decoy', {
            label: text,
            collide: true
          }));
          return b;
        };
        const endButton = (parent, cls, text) => {
          const b = u.el('button', cls, parent, text);
          b.type = 'button';
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', _c.label);
          b.title = _c.label;
          b.addEventListener('click', () => ctx.submit());
          return b;
        };
        if (canonical) {
          _c.submit = endButton(foot, 'ds-submit', _c.label);
        } else if (_c.placement === 'header') {
          if (_c.collide) {
            const d = addDecoy(top, _c.collide);
            d.classList.add('ds-pq-header');
          }
          _c.submit = endButton(top, 'ds-submit ds-submit-header', _c.label);
        } else {
          if (_c.collide) {
            const d = addDecoy(foot, _c.collide);
            d.classList.add('ds-pq-link');
          }
          _c.submit = endButton(foot, 'ds-submit ds-submit-link', _c.label);
        }
      }
    },
    'frame.27': function (_c) {
      const {stage} = _c;
      return {
        stage,
        submit: _c.submit
      };
    },
    overlay: function overlay(ctx) {
      const _c = { ctx };
      for (let i = 1; i <= 8; i++) {
        const r = S[`overlay.${i}`](_c);
        if (r !== undefined) return r;
      }
    },
    'overlay.1': function (_c) {
      const {ctx} = _c;
      const u = ctx.util;
      Object.assign(_c, {
        u
      });
    },
    'overlay.2': function (_c) {
      const {ctx, u} = _c;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      Object.assign(_c, {
        el
      });
    },
    'overlay.3': function (_c) {
      const {el} = _c;
      el.dataset.role = 'overlay';
    },
    'overlay.4': function (_c) {
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.'
      };
      Object.assign(_c, {
        texts
      });
    },
    'overlay.5': function (_c) {
      const {ctx, el, texts, u} = _c;
      u.el('div', '', el, texts[ctx.kind]);
    },
    'overlay.6': function (_c) {
      const {ctx, el, u} = _c;
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      Object.assign(_c, {
        dismiss
      });
    },
    'overlay.7': function (_c) {
      const {ctx, dismiss} = _c;
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
    },
    'overlay.8': function (_c) {
      const {ctx, dismiss, el} = _c;
      return {
        el,
        dismiss,
        ttlSteps: ctx.kind === 'toast' ? 4 : 0
      };
    },
  });

  env.template('site/type-text-login-01', (design, def) => {
    const S = {};
    const { D, P } = env.templateDesign('site/type-text-login-01', design, def, { tokens: TOKENS, base: base(S), state: S });
    Object.assign(S, D, P);
    return { frame: P.frame, overlay: P.overlay };
  });
})();
