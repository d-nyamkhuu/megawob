// site/form-fill-receipt-03: site template generated from the site.js of design-fill-form-receipt-03, of which many
// design-* sites were restyled copies; they are designs on it (templates/README.md, "Generated site templates"). The
// defaults (design {}) reproduce design-fill-form-receipt-03. Tokens (each replaced whole): C. Parts: frame, overlay,
// and the sections of frame() ('frame.1'..'frame.55'), overlay() ('overlay.1'..'overlay.8'): one per statement of
// the original body, run in order.
(function () {
  'use strict';

  const TOKENS = {
    C: {
      "site": "design-fill-form-receipt-03",
      "brand": "Expense Manager",
      "title": "New Expense",
      "instruction": "top",
      "rail": "",
      "menu": "Expenses|Reports|Settings",
      "briefTitle": "Instructions"
    },
  };

  const base = (S) => ({
    frame: function frame(ctx) {
      const _c = { ctx };
      for (let i = 1; i <= 55; i++) {
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
      const {ctx} = _c;
      const er = ctx.rng.fork('chrome/end');
      Object.assign(_c, {
        er
      });
    },
    'frame.6': function (_c) {
      const {ctx} = _c;
      const bank = ctx.content && ctx.content.END_LABELS;
      Object.assign(_c, {
        bank
      });
    },
    'frame.7': function (_c) {
      const {bank} = _c;
      const labels = Array.isArray(bank) && bank.length ? bank : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      Object.assign(_c, {
        labels
      });
    },
    'frame.8': function (_c) {
      const labelOf = x => typeof x === 'string' ? x : x && (x.label || x.text || x.name) || String(x);
      Object.assign(_c, {
        labelOf
      });
    },
    'frame.9': function (_c) {
      const {labelOf, labels} = _c;
      const preferred = labels.find(x => labelOf(x).trim().toLowerCase() === 'submit') || labels[0];
      Object.assign(_c, {
        preferred
      });
    },
    'frame.10': function (_c) {
      const {labelOf, labels} = _c;
      const alternate = labels.filter(x => labelOf(x).trim().toLowerCase() !== 'submit');
      Object.assign(_c, {
        alternate
      });
    },
    'frame.11': function (_c) {
      const {ctx, er} = _c;
      const original = !ctx.finish && er.bool(.5);
      Object.assign(_c, {
        original
      });
    },
    'frame.12': function (_c) {
      const {alternate, er, labelOf, labels, original, preferred} = _c;
      const endLabel = original ? labelOf(preferred) : labelOf(er.pick(alternate.length ? alternate : labels));
      Object.assign(_c, {
        endLabel
      });
    },
    'frame.13': function (_c) {
      const {ctx, er, original} = _c;
      const placement = ctx.finish ? null : original ? 'footer' : er.pick(['toolbar', 'toolbar', 'status', 'status']);
      Object.assign(_c, {
        placement
      });
    },
    'frame.14': function (_c) {
      const {ctx} = _c;
      const cr = ctx.rng.fork('chrome/collide');
      Object.assign(_c, {
        cr
      });
    },
    'frame.15': function (_c) {
      _c.collide = null;
    },
    'frame.16': function (_c) {
      const {cr, ctx, endLabel, labelOf, labels} = _c;
      if (!ctx.finish && cr.bool(.3)) {
        const choices = [...new Set(labels.map(labelOf))].filter(x => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (choices.length) _c.collide = {
          label: cr.pick(choices),
          where: cr.pick(['toolbar', 'status'])
        };
      }
    },
    'frame.17': function (_c) {
      const {u} = _c;
      const top = u.el('header', 'ds-top', document.body);
      Object.assign(_c, {
        top
      });
    },
    'frame.18': function (_c) {
      const {C} = S;
      const {top, u} = _c;
      u.el('span', 'ds-brand', top, C.brand);
    },
    'frame.19': function (_c) {
      const {top, u} = _c;
      u.el('span', '', top, '−    □    ×');
    },
    'frame.20': function (_c) {
      const {C} = S;
      const {u} = _c;
      if (C.menu) {
        const nav = u.el('nav', 'ds-menu', document.body);
        C.menu.split('|').forEach(t => u.el('span', '', nav, t));
      }
    },
    'frame.21': function (_c) {
      const {u} = _c;
      const ribbon = u.el('div', 'ds-ribbon', document.body);
      Object.assign(_c, {
        ribbon
      });
    },
    'frame.22': function (_c) {
      const paths = {
        person: 'M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10M3 24c0-12 18-12 18 0M22 8v10M17 13h10',
        edit: 'M5 2h14v22H5zM10 17l10-10 4 4-10 10-5 1z',
        delete: 'M5 4l17 18M22 4L5 22',
        import: 'M5 1h13l5 5v19H5zM14 7v12m-5-5 5 5 5-5',
        export: 'M5 1h13l5 5v19H5zM14 19V7m-5 5 5-5 5 5',
        group: 'M7 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M19 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M0 25c0-13 14-13 14 0M14 25c0-13 14-13 14 0',
        grid: 'M2 2h10v10H2zM16 2h10v10H16zM2 16h10v10H2zM16 16h10v10H16z',
        gear: 'M14 6v-5M14 27v-5M6 14H1M27 14h-5M8 8 4 4M24 24l-4-4M8 20l-4 4M24 4l-4 4M14 6a8 8 0 1 0 0 16 8 8 0 0 0 0-16',
        help: 'M14 2a12 12 0 1 0 0 24 12 12 0 0 0 0-24M10 9c1-7 12-3 6 2l-2 2v3M14 21v-1'
      };
      Object.assign(_c, {
        paths
      });
    },
    'frame.23': function (_c) {
      const {paths, ribbon, u} = _c;
      [['New Contact', 'person'], ['Edit', 'edit'], ['Delete', 'delete'], ['Import', 'import'], ['Export', 'export'], ['Address Book', 'group'], ['Categories', 'grid'], ['Options', 'gear'], ['Help', 'help']].forEach(([label, key]) => {
        const b = u.el('button', 'ds-ribbon-item', ribbon);
        b.type = 'button';
        b.innerHTML = '<svg viewBox="-2 -2 32 32" width="38" height="38"><path d="' + paths[key] + '" fill="' + (key === 'grid' ? '#efbf3e' : '#9fc5e5') + '" stroke="' + (key === 'delete' ? '#bd514d' : '#4f7598') + '" stroke-width="2" stroke-linejoin="round"/></svg>';
        u.el('span', '', b, label);
      });
    },
    'frame.24': function (_c) {
      const {ribbon} = _c;
      const items = [...ribbon.children];
      Object.assign(_c, {
        items
      });
    },
    'frame.25': function (_c) {
      const {items, ribbon, u} = _c;
      [['Manage', 3], ['Data', 2], ['Organize', 2], ['Support', 2]].forEach(([label, n]) => {
        const g = u.el('div', 'ds-ribbon-group', ribbon);
        for (let i = 0; i < n; i++) g.append(items.shift());
        u.el('span', 'ds-ribbon-caption', g, label);
      });
    },
    'frame.26': function (_c) {
      _c.submit = null;
    },
    'frame.27': function (_c) {
      const {ctx, endLabel, u} = _c;
      const makeEnd = (parent, cls, text, tag = 'button') => {
        const b = u.el(tag, cls, parent, text);
        if (tag === 'button') b.type = 'button'; else b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', endLabel);
        b.title = endLabel;
        b.addEventListener('click', e => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      Object.assign(_c, {
        makeEnd
      });
    },
    'frame.28': function (_c) {
      const {u} = _c;
      const decoy = (parent, text) => {
        const b = u.el('button', 'ds-end-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', {
          label: text,
          collide: true
        }));
      };
      Object.assign(_c, {
        decoy
      });
    },
    'frame.29': function (_c) {
      const {endLabel, makeEnd, placement, ribbon} = _c;
      if (placement === 'toolbar') _c.submit = makeEnd(ribbon, 'ds-ribbon-end', endLabel);
    },
    'frame.30': function (_c) {
      const {decoy, ribbon} = _c;
      if (_c.collide && _c.collide.where === 'toolbar') decoy(ribbon, _c.collide.label);
    },
    'frame.31': function (_c) {
      const {u} = _c;
      const status = u.el('div', 'ds-statusbar', document.body);
      Object.assign(_c, {
        status
      });
    },
    'frame.32': function (_c) {
      const {status, u} = _c;
      u.el('span', '', status, 'Ready');
    },
    'frame.33': function (_c) {
      const {endLabel, makeEnd, placement, status} = _c;
      if (placement === 'status') _c.submit = makeEnd(status, 'ds-status-end', endLabel, 'a');
    },
    'frame.34': function (_c) {
      const {decoy, status} = _c;
      if (_c.collide && _c.collide.where === 'status') decoy(status, _c.collide.label);
    },
    'frame.35': function (_c) {
      const {status, u} = _c;
      u.el('span', '', status, '▤  ▦   100%   − ━━━━━━━ +');
    },
    'frame.36': function (_c) {
      const {u} = _c;
      const body = u.el('div', 'ds-body', document.body);
      Object.assign(_c, {
        body
      });
    },
    'frame.37': function (_c) {
      const {C} = S;
      const {body, u} = _c;
      if (C.rail) {
        const rail = u.el('aside', 'ds-rail', body);
        C.rail.split('|').forEach(t => u.el('div', '', rail, t));
      }
    },
    'frame.38': function (_c) {
      const {body, u} = _c;
      const content = u.el('div', 'ds-content', body);
      Object.assign(_c, {
        content
      });
    },
    'frame.39': function (_c) {
      const {C} = S;
      const natural = C.instruction;
      Object.assign(_c, {
        natural
      });
    },
    'frame.40': function (_c) {
      const {ctx, natural} = _c;
      const mode = ctx.display === 'hidden' ? 'hidden' : ctx.display === 'toast' ? 'toast' : ctx.display === 'panel' ? 'left' : natural;
      Object.assign(_c, {
        mode
      });
    },
    'frame.41': function (_c) {
      const {ctx, u} = _c;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, 'Task');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      Object.assign(_c, {
        briefing
      });
    },
    'frame.42': function (_c) {
      const {briefing, content, mode} = _c;
      if (mode === 'top') briefing(content, 'ds-header-note');
    },
    'frame.43': function (_c) {
      const {content, u} = _c;
      const main = u.el('div', 'ds-main', content);
      Object.assign(_c, {
        main
      });
    },
    'frame.44': function (_c) {
      const {briefing, main, mode} = _c;
      if (mode === 'left' || mode === 'right') {
        const b = briefing(main, 'ds-brief');
        if (mode === 'right') b.style.order = '2';
      }
    },
    'frame.45': function (_c) {
      const {main, u} = _c;
      const stage = u.el('main', 'ds-stage', main);
      Object.assign(_c, {
        stage
      });
    },
    'frame.46': function (_c) {
      const {main, u} = _c;
      const tips = u.el('aside', 'ds-tips', main);
      Object.assign(_c, {
        tips
      });
    },
    'frame.47': function (_c) {
      const {tips, u} = _c;
      u.el('h2', '', tips, 'ⓘ  Help & Tips');
    },
    'frame.48': function (_c) {
      const {tips, u} = _c;
      ['Enter values exactly as they appear on the receipt.', 'Leave a field blank if the receipt does not contain that information.', 'Use the receipt date, merchant name, total amount and payment method.', 'Select the most appropriate expense category.', 'Add a note only if needed.'].forEach(t => u.el('p', '', tips, '•  ' + t));
    },
    'frame.49': function (_c) {
      const {briefing, content, main, mode} = _c;
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
    },
    'frame.50': function (_c) {
      const {content, u} = _c;
      const foot = u.el('footer', 'ds-footer', content);
      Object.assign(_c, {
        foot
      });
    },
    'frame.51': function (_c) {
      const {foot, u} = _c;
      u.el('span', '', foot, 'Ready');
    },
    'frame.52': function (_c) {
      const {ctx, endLabel, foot, makeEnd, placement} = _c;
      if (!ctx.finish && placement === 'footer') _c.submit = makeEnd(foot, 'ds-submit', endLabel);
    },
    'frame.53': function (_c) {
      const {foot, u} = _c;
      const cancel = u.el('button', 'ds-cancel', foot, 'Cancel');
      Object.assign(_c, {
        cancel
      });
    },
    'frame.54': function (_c) {
      const {cancel} = _c;
      cancel.type = 'button';
    },
    'frame.55': function (_c) {
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

  env.template('site/fill-form-receipt-03', (design, def) => {
    const S = {};
    const { D, P } = env.templateDesign('site/fill-form-receipt-03', design, def, { tokens: TOKENS, base: base(S), state: S });
    Object.assign(S, D, P);
    return { frame: P.frame, overlay: P.overlay };
  });
})();
