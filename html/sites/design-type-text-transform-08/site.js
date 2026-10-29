(function () {
  'use strict';
  const C = {
    'site': 'design-type-text-transform-08',
    'brand': 'Text Transformation',
    'instruction': 'top',
    'tabs': 'Task|Notes|Tools|Reference',
    'tagline': 'Simple tools|for clear work',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const tabs = u.el('nav', 'nb-tabs', document.body);
      C.tabs.split('|').forEach((t, i) => {
        const b = u.el('div', 'nb-tab' + (i === 0 ? ' on' : ''), tabs, t);
      });
      const rings = u.el('div', 'nb-rings', document.body);
      for (let i = 0; i < 12; i++) u.el('i', '', rings);
      const page = u.el('div', 'nb-page', document.body);
      const head = u.el('header', 'nb-head', page);
      u.el('h1', '', head, C.brand);
      const tag = u.el('div', 'nb-tag', head);
      C.tagline.split('|').forEach((t) => u.el('span', '', tag, t));
      const ilen = String(ctx.instruction || '').length,
        fit = ilen > 140 ? Math.sqrt(140 / ilen).toFixed(3) : null;
      const disp = ctx.display || 'header';
      const small = ctx.size && (ctx.size.width < 1100 || ctx.size.height < 700);
      const mode =
        disp === 'hidden'
          ? 'hidden'
          : small && (disp === 'panel' || disp === 'toast')
            ? C.instruction
            : disp === 'toast'
              ? 'toast'
              : disp === 'panel'
                ? 'left'
                : C.instruction;
      const er = ctx.rng.fork('chrome/end');
      const endBank = ctx.content && ctx.content.END_LABELS;
      const endNames =
        endBank && endBank.length
          ? endBank.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const canonical = er.bool(0.5);
      const submitName = endNames.find((x) => String(x).toLowerCase() === 'submit');
      const alternatives = endNames.filter((x) => String(x).trim().toLowerCase() !== 'submit');
      const endLabel = canonical
        ? submitName || er.pick(endNames)
        : er.pick(alternatives.length ? alternatives : endNames);
      const placement = canonical ? 'footer' : er.pick(['footer', 'link', 'header']);
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (cr.bool(0.3)) {
        const options = [...new Set(endNames)].filter(
          (x) => String(x).trim().toLowerCase() !== String(endLabel).trim().toLowerCase(),
        );
        if (options.length) collide = { label: cr.pick(options), where: cr.pick(['header', 'footer']) };
      }
      let headTools = null;
      if (!ctx.finish && (placement === 'header' || (collide && collide.where === 'header'))) {
        headTools = u.el('div', 'ds-head-tools', head);
      }
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        u.el('div', 'nb-kicker', b, 'Instruction');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        if (fit && cls === 'ds-header-note') b.style.setProperty('--fit', fit);
        return b;
      }
      let main;
      if (mode === 'toast') {
        const note = briefing(page, 'ds-toast');
        main = u.el('div', 'ds-main', page);
      } else {
        if (mode === 'top') briefing(page, 'ds-header-note');
        main = u.el('div', 'ds-main' + (mode === 'left' ? ' panel' : ''), page);
        if (mode === 'left') briefing(main, 'ds-brief');
      }
      const stage = u.el('main', 'ds-stage', main);
      const foot = u.el('footer', 'ds-footer', page);
      const clear = u.el('button', 'nb-clear', foot, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () => {
        const inp = stage.querySelector('input,textarea');
        if (inp) {
          inp.value = '';
          inp.dispatchEvent(new Event('input', { bubbles: true }));
          inp.focus();
        }
      });
      const decoyBtn = (parent, label) => {
        const b = u.el('button', parent === headTools ? 'ds-head-xtra' : 'ds-footer-xtra', parent, label);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        return b;
      };
      if (collide && collide.where === 'header' && headTools) decoyBtn(headTools, collide.label);
      let submit = null;
      const endBtn = (parent, cls, label) => {
        const b = u.el(cls === 'ds-endlink' ? 'a' : 'button', cls, parent, label);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', endLabel);
        b.title = endLabel;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (!ctx.finish) {
        if (placement === 'header' && headTools) submit = endBtn(headTools, 'ds-head-submit', endLabel);
        else if (placement === 'link') submit = endBtn(foot, 'ds-endlink', endLabel + ' ›');
        else submit = endBtn(foot, 'ds-submit', endLabel);
      }
      if (collide && collide.where === 'footer') decoyBtn(foot, collide.label);
      const leaf = u.el('div', 'nb-leaf', page);
      leaf.innerHTML =
        '<svg viewBox="0 0 100 110" width="100%" height="100%" fill="#6e9692" stroke="#779b94" stroke-width="1.1"><path fill="none" d="M92 104Q53 81 76 9M90 102Q53 76 8 100M68 78L43 57"/><path d="M76 33Q64 15 81 2Q86 20 76 33ZM74 51Q66 35 79 25Q85 40 74 51ZM72 65Q68 48 85 39Q86 56 72 65ZM73 80Q75 61 91 56Q89 73 73 80ZM68 59Q55 54 57 36Q70 42 68 59ZM66 76Q52 72 50 56Q64 59 66 76ZM59 86Q44 84 40 67Q53 69 59 86ZM40 94Q26 103 9 101Q24 88 40 94ZM57 94Q43 107 30 104Q42 92 57 94ZM73 99Q62 109 48 108Q57 97 73 99Z"/><g fill="none" stroke="#d7dfcf" stroke-width=".8"><path d="M78 8L76 26M80 31L75 46M82 44L74 60M87 62L76 75M59 42L66 56M53 60L63 73M44 73L55 83M15 99L34 96M36 102L52 96M54 106L69 101"/></g></svg>';
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
