// site/form-pick-autocomplete-01: site template generated from the site.js of design-choose-option-autocomplete-01, of which
// many design-* sites were restyled copies; they are designs on it (templates/README.md, "Generated site templates").
// The defaults (design {}) reproduce design-choose-option-autocomplete-01. Tokens (each replaced whole): C. Parts: labelOf,
// frame, overlay, and the sections of frame() ('frame.1'..'frame.41'), overlay() ('overlay.1'..'overlay.7'): one
// per statement of the original body, run in order.
(function () {
  'use strict';

  const TOKENS = {
    C: {
      site: 'design-choose-option-autocomplete-01',
      brand: 'Trip Details',
      title: 'Destination',
      instruction: 'top',
      rail: '',
      menu: '',
      briefTitle: 'Instructions'
    },
  };

  const base = (S) => ({
    labelOf: x => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x),
    frame: function frame(ctx) {
      const _c = { ctx };
      for (let i = 1; i <= 41; i++) {
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
      const u = ctx.util, content = ctx.content || ({}), rng = ctx.rng;
      Object.assign(_c, {
        content,
        rng,
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
      const contentRoot = u.el('div', 'ds-content', body), width = window.innerWidth, height = window.innerHeight;
      Object.assign(_c, {
        contentRoot,
        height,
        width
      });
    },
    'frame.12': function (_c) {
      const {C} = S;
      const {ctx} = _c;
      _c.mode = ctx.display === 'hidden' ? 'hidden' : ctx.display === 'toast' ? 'toast' : ctx.display === 'panel' ? 'panel' : C.instruction;
    },
    'frame.13': function (_c) {
      const {C} = S;
      const {height, width} = _c;
      if (_c.mode === 'panel' && width < 1260 || _c.mode === 'toast' && height < 700) _c.mode = C.instruction;
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
      const {briefing, contentRoot} = _c;
      if (_c.mode === 'top') briefing(contentRoot, 'ds-header-note');
    },
    'frame.16': function (_c) {
      const {briefing, contentRoot} = _c;
      if (_c.mode === 'panel') briefing(contentRoot, 'ds-brief');
    },
    'frame.17': function (_c) {
      const {contentRoot, u} = _c;
      const main = u.el('div', 'ds-main', contentRoot);
      Object.assign(_c, {
        main
      });
    },
    'frame.18': function (_c) {
      const {C} = S;
      if (C.rail) {}
    },
    'frame.19': function (_c) {
      const {main, u} = _c;
      const stage = u.el('main', 'ds-stage', main), marker = u.el('div', 'ds-swiss-label', stage);
      Object.assign(_c, {
        marker,
        stage
      });
    },
    'frame.20': function (_c) {
      const {marker, u} = _c;
      u.el('strong', '', marker, '01');
    },
    'frame.21': function (_c) {
      const {marker, u} = _c;
      u.el('h1', '', marker, 'Trip Details');
    },
    'frame.22': function (_c) {
      const {marker, u} = _c;
      u.el('div', 'ds-redrule', marker);
    },
    'frame.23': function (_c) {
      const {marker, u} = _c;
      u.el('p', '', marker, 'Fill in your travel information to continue.');
    },
    'frame.24': function (_c) {
      const {briefing, contentRoot, main} = _c;
      if (_c.mode === 'toast') {
        const note = briefing(contentRoot, 'ds-toast');
        contentRoot.insertBefore(note, main);
      }
    },
    'frame.25': function (_c) {
      const {rng} = _c;
      const endRng = rng.fork('chrome/end'), collideRng = rng.fork('chrome/collide');
      Object.assign(_c, {
        collideRng,
        endRng
      });
    },
    'frame.26': function (_c) {
      const {labelOf} = S;
      const {content} = _c;
      const labels = (Array.isArray(content.END_LABELS) && content.END_LABELS.length ? content.END_LABELS : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']).map(labelOf);
      Object.assign(_c, {
        labels
      });
    },
    'frame.27': function (_c) {
      const {labelOf} = S;
      const {content} = _c;
      const decoyLabels = (Array.isArray(content.DECOY_LABELS) && content.DECOY_LABELS.length ? content.DECOY_LABELS : ['Help', 'Feedback', 'Preview', 'Save draft', 'Reset view']).map(labelOf);
      Object.assign(_c, {
        decoyLabels
      });
    },
    'frame.28': function (_c) {
      (_c.placement = null, _c.label = null);
    },
    'frame.29': function (_c) {
      const {ctx, endRng, labels} = _c;
      if (!ctx.finish) {
        if (endRng.bool(0.5)) {
          _c.placement = 'footer';
          _c.label = 'Submit';
        } else {
          _c.placement = endRng.pick(['footer', 'link', 'header']);
          const alternatives = labels.filter(x => x.trim().toLowerCase() !== 'submit');
          _c.label = alternatives.length ? endRng.pick(alternatives) : 'Done';
        }
      }
    },
    'frame.30': function (_c) {
      _c.collide = null;
    },
    'frame.31': function (_c) {
      const {collideRng, ctx, labels} = _c;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const pool = [...new Set(labels.filter(x => x.trim().toLowerCase() !== _c.label.trim().toLowerCase()))];
        if (pool.length) _c.collide = {
          text: collideRng.pick(pool),
          where: collideRng.pick(['header', 'footer'])
        };
      }
    },
    'frame.32': function (_c) {
      const {u} = _c;
      const decoyBtn = (parent, text, isCollide) => {
        const b = u.el('button', 'ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
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
    'frame.33': function (_c) {
      const {ctx, u} = _c;
      const endBtn = (parent, cls, text) => {
        const b = u.el(cls === 'ds-endlink' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button'; else b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', _c.label);
        b.title = _c.label;
        b.addEventListener('click', e => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      Object.assign(_c, {
        endBtn
      });
    },
    'frame.34': function (_c) {
      const {contentRoot, u} = _c;
      const foot = u.el('footer', 'ds-footer', contentRoot);
      Object.assign(_c, {
        foot
      });
    },
    'frame.35': function (_c) {
      const {foot, u} = _c;
      const cancel = u.el('button', 'ds-travel-cancel', foot, 'Cancel');
      Object.assign(_c, {
        cancel
      });
    },
    'frame.36': function (_c) {
      const {cancel} = _c;
      cancel.type = 'button';
    },
    'frame.37': function (_c) {
      _c.submit = null;
    },
    'frame.38': function (_c) {
      const {ctx, decoyBtn, endBtn, foot, top, u} = _c;
      if (!ctx.finish) {
        if (_c.placement === 'header') {
          let tools = document.querySelector('.ds-header-note');
          if (!tools) {
            tools = u.el('div', 'ds-header-tools', top);
            top.classList.add('ds-tools-visible');
          }
          if (_c.collide && _c.collide.where === 'header') decoyBtn(tools, _c.collide.text, true);
          _c.submit = endBtn(tools, 'ds-submit ds-submit-head', _c.label);
        } else {
          if (_c.collide && _c.collide.where === 'header') {
            const tools = u.el('div', 'ds-header-tools', top);
            top.classList.add('ds-tools-visible');
            decoyBtn(tools, _c.collide.text, true);
          }
          if (_c.collide && _c.collide.where === 'footer') decoyBtn(foot, _c.collide.text, true);
          _c.submit = _c.placement === 'link' ? endBtn(foot, 'ds-endlink', `${_c.label} ›`) : endBtn(foot, 'ds-submit', _c.label);
        }
      }
    },
    'frame.39': function (_c) {
      const {rng} = _c;
      const fillerRng = rng.fork('chrome/filler');
      Object.assign(_c, {
        fillerRng
      });
    },
    'frame.40': function (_c) {
      const {ctx, decoyBtn, decoyLabels, fillerRng, foot} = _c;
      if (!ctx.finish && fillerRng.bool(0.22)) decoyBtn(foot, fillerRng.pick(decoyLabels), false);
    },
    'frame.41': function (_c) {
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
      const u = ctx.util, el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      Object.assign(_c, {
        el,
        u
      });
    },
    'overlay.2': function (_c) {
      const {el} = _c;
      el.dataset.role = 'overlay';
    },
    'overlay.3': function (_c) {
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
    'overlay.4': function (_c) {
      const {ctx, el, texts, u} = _c;
      u.el('div', '', el, texts[ctx.kind]);
    },
    'overlay.5': function (_c) {
      const {ctx, el, u} = _c;
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      Object.assign(_c, {
        dismiss
      });
    },
    'overlay.6': function (_c) {
      const {ctx, dismiss} = _c;
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
    },
    'overlay.7': function (_c) {
      const {ctx, dismiss, el} = _c;
      return {
        el,
        dismiss,
        ttlSteps: ctx.kind === 'toast' ? 4 : 0
      };
    },
  });

  env.template('site/choose-option-autocomplete-01', (design, def) => {
    const S = {};
    const { D, P } = env.templateDesign('site/choose-option-autocomplete-01', design, def, { tokens: TOKENS, base: base(S), state: S });
    Object.assign(S, D, P);
    return { frame: P.frame, overlay: P.overlay };
  });
})();
