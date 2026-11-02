// site/drag-slider-horizontal-11: site template generated from the site.js of design-set-slider-horizontal-11, of which
// many design-* sites were restyled copies; they are designs on it (templates/README.md, "Generated site templates").
// The defaults (design {}) reproduce design-set-slider-horizontal-11. Tokens (each replaced whole): none. Parts: books,
// drawOverlay, frame, and the sections of frame() ('frame.1'..'frame.53'): one per statement of the original
// body, run in order.
(function () {
  'use strict';

  const TOKENS = {
  };

  const base = (S) => ({
    books: function books(parent) {
      const svg = env.util.svg('svg', {
        viewBox: '0 0 100 100',
        class: 'books',
        'aria-hidden': 'true'
      }, parent);
      const u = env.util;
      u.svg('ellipse', {
        cx: 50,
        cy: 86,
        rx: 44,
        ry: 7,
        fill: '#c9c4b7'
      }, svg);
      for (const [x, y, w, h, color, angle] of [[12, 17, 14, 68, '#c1a17d', 8], [31, 13, 16, 74, '#be986d', 1], [47, 9, 19, 79, '#994527', 0], [67, 17, 22, 68, '#954c32', -2]]) {
        const g = u.svg('g', {
          transform: `rotate(${angle} ${x + w / 2} ${y + h})`
        }, svg);
        u.svg('path', {
          d: `M${x} ${y}l6 -3h${w}v${h}l-6 3h-${w}Z`,
          fill: color,
          stroke: '#50392b',
          'stroke-width': 1.4
        }, g);
        u.svg('path', {
          d: `M${x} ${y}h${w}v${h}M${x + w} ${y}l6 -3M${x + 3} ${y + 6}h${w - 6}M${x + 3} ${y + 11}h${w - 6}M${x + 3} ${y + h - 8}h${w - 6}`,
          fill: 'none',
          stroke: '#513b2c'
        }, g);
        u.svg('path', {
          d: `M${x + 4} ${y + 18}h${w - 8}M${x + 4} ${y + 21}h${w - 8}`,
          stroke: '#dabf96',
          fill: 'none'
        }, g);
      }
    },
    drawOverlay: function drawOverlay(ctx) {
      const u = ctx.util;
      const el = u.el('aside', 'survey-drawer overlay-' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      const dismiss = reason => {
        if (ctx.initial) {
          document.body.classList.add('survey-closed');
          env.reanchor();
          env.log('reference-obstruction-dismiss', {
            reason
          });
        }
        ctx.dismiss(reason);
      };
      const survey = ctx.kind === 'chat';
      const title = ({
        chat: 'We value your feedback',
        cookie: 'Your privacy matters',
        toast: 'Catalog notice',
        promo: 'Support your library',
        banner: 'Library service notice'
      })[ctx.kind];
      u.el('h2', '', el, title);
      const x = u.el('button', 'survey-x', el, '×');
      x.setAttribute('aria-label', 'Close notice');
      x.onclick = () => dismiss('close');
      if (survey) {
        u.el('p', 'survey-intro', el, 'Quick survey (2 questions)');
        u.el('hr', '', el);
        const q1 = u.el('div', 'survey-question', el, '1. How easy was it to find what you needed today?');
        const choices = u.el('div', 'survey-choices', el);
        ['Very easy', 'Somewhat easy', 'Neither easy nor difficult', 'Somewhat difficult', 'Very difficult'].forEach(label => {
          const row = u.el('label', '', choices);
          const radio = u.el('input', '', row);
          radio.type = 'radio';
          radio.name = 'ease';
          radio.value = label;
          u.el('span', '', row, label);
        });
        u.el('div', 'survey-question second', el, '2. What could we improve?');
        const dropdown = u.el('div', 'survey-dropdown', el);
        const toggle = u.el('button', 'survey-select', dropdown, 'Select an option…');
        toggle.type = 'button';
        toggle.setAttribute('aria-expanded', 'false');
        const options = u.el('div', 'survey-options', dropdown);
        options.hidden = true;
        for (const label of ['Finding records', 'Image quality', 'Help and guidance']) {
          const b = u.el('button', '', options, label);
          b.type = 'button';
          b.onclick = () => {
            toggle.textContent = label;
            options.hidden = true;
            toggle.setAttribute('aria-expanded', 'false');
          };
        }
        toggle.onclick = () => {
          options.hidden = !options.hidden;
          toggle.setAttribute('aria-expanded', String(!options.hidden));
        };
      } else {
        u.el('p', 'survey-intro', el, ({
          cookie: 'This local catalog can remember your display preferences.',
          toast: 'The record is ready for editing.',
          promo: 'Discover the library’s growing digital archive.',
          banner: 'The digital catalog is available offline.'
        })[ctx.kind]);
      }
      const closeButton = u.el('button', 'primary survey-close', el, survey ? 'Close survey' : ctx.kind === 'cookie' ? 'Reject optional' : 'Dismiss');
      closeButton.type = 'button';
      closeButton.onclick = () => dismiss('dismiss');
      return {
        el,
        dismiss: closeButton,
        ttlSteps: ctx.kind === 'toast' ? 5 : 0
      };
    },
    frame: function frame(ctx) {
      const _c = { ctx };
      for (let i = 1; i <= 53; i++) {
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
      const {ctx} = _c;
      const endRng = ctx.rng.fork('chrome/end');
      Object.assign(_c, {
        endRng
      });
    },
    'frame.3': function (_c) {
      const {endRng} = _c;
      const placement = endRng.pick(['footer', 'footer', 'header', 'note']);
      Object.assign(_c, {
        placement
      });
    },
    'frame.4': function (_c) {
      const {ctx} = _c;
      const endLabels = ctx.content && ctx.content.END_LABELS;
      Object.assign(_c, {
        endLabels
      });
    },
    'frame.5': function (_c) {
      const {endLabels, endRng} = _c;
      const endLabel = endRng.pick(Array.isArray(endLabels) && endLabels.length ? endLabels : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"]);
      Object.assign(_c, {
        endLabel
      });
    },
    'frame.6': function (_c) {
      const {endLabel} = _c;
      const label = typeof endLabel === 'string' ? endLabel : endLabel.label || endLabel.text || endLabel.name || String(endLabel);
      Object.assign(_c, {
        label
      });
    },
    'frame.7': function (_c) {
      const {ctx} = _c;
      const collideRng = ctx.rng.fork('chrome/collide');
      Object.assign(_c, {
        collideRng
      });
    },
    'frame.8': function (_c) {
      const {endLabels, label} = _c;
      const collisionPool = (Array.isArray(endLabels) && endLabels.length ? endLabels : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"]).map(x => typeof x === 'string' ? x : x.label || x.text || x.name || String(x)).filter(x => x.trim().toLowerCase() !== label.trim().toLowerCase());
      Object.assign(_c, {
        collisionPool
      });
    },
    'frame.9': function (_c) {
      const {collideRng, collisionPool} = _c;
      const collision = collideRng.bool(.3) && collisionPool.length ? collideRng.pick(collisionPool) : null;
      Object.assign(_c, {
        collision
      });
    },
    'frame.10': function (_c) {
      const {ctx} = _c;
      document.body.className = `library instruction-${ctx.display}`;
    },
    'frame.11': function (_c) {
      const {u} = _c;
      const head = u.el('header', 'library-header', document.body);
      Object.assign(_c, {
        head
      });
    },
    'frame.12': function (_c) {
      const {books} = S;
      const {head} = _c;
      books(head);
    },
    'frame.13': function (_c) {
      const {head, u} = _c;
      const brand = u.el('div', 'brand', head);
      Object.assign(_c, {
        brand
      });
    },
    'frame.14': function (_c) {
      const {brand, u} = _c;
      u.el('h1', '', brand, 'Rivermere Public Library');
    },
    'frame.15': function (_c) {
      const {brand, u} = _c;
      u.el('div', 'motto', brand, 'CATALOG · PEOPLE · IDEAS · A BRIGHTER TOMORROW');
    },
    'frame.16': function (_c) {
      const {head, u} = _c;
      u.el('div', 'established', head, 'EST. 1896');
    },
    'frame.17': function (_c) {
      const {head, u} = _c;
      u.el('blockquote', '', head, '“Good books build\nstronger communities.”');
    },
    'frame.18': function (_c) {
      _c.submit = null;
    },
    'frame.19': function (_c) {
      const {ctx, label, u} = _c;
      const makeSubmit = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.onclick = () => ctx.submit();
        return b;
      };
      Object.assign(_c, {
        makeSubmit
      });
    },
    'frame.20': function (_c) {
      const {ctx, head, label, makeSubmit, placement} = _c;
      if (!ctx.finish && placement === 'header') _c.submit = makeSubmit(head, 'primary header-submit', label);
    },
    'frame.21': function (_c) {
      const {u} = _c;
      const main = u.el('div', 'library-main', document.body);
      Object.assign(_c, {
        main
      });
    },
    'frame.22': function (_c) {
      const {main, u} = _c;
      const task = u.el('aside', 'catalog-task', main);
      Object.assign(_c, {
        task
      });
    },
    'frame.23': function (_c) {
      const {task, u} = _c;
      u.el('h2', '', task, 'Cataloging Task');
    },
    'frame.24': function (_c) {
      const {task, u} = _c;
      u.el('p', 'briefing', task, 'You are assisting with the digital archive. Adjust the image settings for this book record so the scan meets preservation standards.');
    },
    'frame.25': function (_c) {
      const {task, u} = _c;
      u.el('hr', '', task);
    },
    'frame.26': function (_c) {
      const {ctx, task, u} = _c;
      const instruction = u.el('div', 'instruction', task, ctx.instruction);
      Object.assign(_c, {
        instruction
      });
    },
    'frame.27': function (_c) {
      const {ctx, instruction} = _c;
      if (ctx.display === 'hidden') instruction.hidden = true;
    },
    'frame.28': function (_c) {
      const {ctx, instruction, u} = _c;
      if (ctx.display === 'toast') {
        const close = u.el('button', 'instruction-close', instruction, 'Close');
        close.onclick = () => {
          instruction.hidden = true;
        };
      }
    },
    'frame.29': function (_c) {
      const {task, u} = _c;
      u.el('p', 'other-settings', task, 'Other settings are already correct. Do not change them.');
    },
    'frame.30': function (_c) {
      const {main, u} = _c;
      const stage = u.el('main', 'record-stage', main);
      Object.assign(_c, {
        stage
      });
    },
    'frame.31': function (_c) {
      const {stage} = _c;
      stage.dataset.role = 'stage';
    },
    'frame.32': function (_c) {
      const {main, u} = _c;
      u.el('aside', 'survey-space', main);
    },
    'frame.33': function (_c) {
      const {u} = _c;
      const footer = u.el('footer', 'library-footer', document.body);
      Object.assign(_c, {
        footer
      });
    },
    'frame.34': function (_c) {
      const {footer, u} = _c;
      const footerBrand = u.el('div', 'footer-brand', footer);
      Object.assign(_c, {
        footerBrand
      });
    },
    'frame.35': function (_c) {
      const {books} = S;
      const {footerBrand} = _c;
      books(footerBrand);
    },
    'frame.36': function (_c) {
      const {footerBrand, u} = _c;
      const text = u.el('div', '', footerBrand);
      Object.assign(_c, {
        text
      });
    },
    'frame.37': function (_c) {
      const {text, u} = _c;
      u.el('div', 'footer-name', text, 'Rivermere Public Library');
    },
    'frame.38': function (_c) {
      const {text, u} = _c;
      u.el('div', 'footer-version', text, 'Cataloging System v2.3');
    },
    'frame.39': function (_c) {
      const {footer, u} = _c;
      const navigation = u.el('div', 'footer-navigation', footer);
      Object.assign(_c, {
        navigation
      });
    },
    'frame.40': function (_c) {
      const {navigation, u} = _c;
      u.el('div', '', navigation, 'Record 12 of 87');
    },
    'frame.41': function (_c) {
      const {navigation, u} = _c;
      const navBtns = u.el('div', 'record-nav', navigation);
      Object.assign(_c, {
        navBtns
      });
    },
    'frame.42': function (_c) {
      const {navBtns, u} = _c;
      for (const label of ['‹  Previous', 'Next  ›']) {
        const b = u.el('button', '', navBtns, label);
        b.type = 'button';
        b.setAttribute('aria-disabled', 'true');
      }
    },
    'frame.43': function (_c) {
      const {footer, u} = _c;
      const note = u.el('div', 'footer-note', footer);
      Object.assign(_c, {
        note
      });
    },
    'frame.44': function (_c) {
      const {note, u} = _c;
      u.el('div', '', note, 'Changes apply to this record only.');
    },
    'frame.45': function (_c) {
      const {note, u} = _c;
      u.el('small', '', note, 'Do not alter other settings.');
    },
    'frame.46': function (_c) {
      const {ctx, label, note, placement, u} = _c;
      if (!ctx.finish && placement === 'note') {
        _c.submit = u.el('a', 'footer-submit-link', note, label);
        _c.submit.href = '#';
        _c.submit.dataset.role = 'submit';
        _c.submit.setAttribute('aria-label', label);
        _c.submit.title = label;
        _c.submit.onclick = e => {
          e.preventDefault();
          ctx.submit();
        };
      }
    },
    'frame.47': function (_c) {
      const {footer, u} = _c;
      const actions = u.el('div', 'footer-actions', footer);
      Object.assign(_c, {
        actions
      });
    },
    'frame.48': function (_c) {
      const {actions, ctx, label, makeSubmit, placement} = _c;
      if (!ctx.finish && placement === 'footer') _c.submit = makeSubmit(actions, 'primary', label);
    },
    'frame.49': function (_c) {
      const {actions, collision, head, placement, u} = _c;
      if (collision) {
        const parent = placement === 'header' ? actions : head;
        const decoy = u.el('button', 'end-xtra', parent, collision);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.onclick = () => env.log('decoy', {
          label: collision,
          collide: true
        });
      }
    },
    'frame.50': function (_c) {
      const {actions, u} = _c;
      const reset = u.el('button', 'reset', actions, 'Reset');
      Object.assign(_c, {
        reset
      });
    },
    'frame.51': function (_c) {
      const {reset} = _c;
      reset.type = 'button';
    },
    'frame.52': function (_c) {
      const {reset} = _c;
      reset.dataset.action = 'reset';
    },
    'frame.53': function (_c) {
      const {stage} = _c;
      return {
        stage,
        submit: _c.submit
      };
    },
  });

  env.template('site/set-slider-horizontal-11', (design, def) => {
    const S = {};
    const { D, P } = env.templateDesign('site/set-slider-horizontal-11', design, def, { tokens: TOKENS, base: base(S), state: S });
    Object.assign(S, D, P);
    return { frame: P.frame, overlay: S.drawOverlay };
  });
})();
