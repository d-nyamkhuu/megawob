(function () {
  'use strict';
  const C = { 'site': 'design-type-text-password-11', 'brand': 'Account Setup' };
  const BULB =
    '<svg viewBox="0 0 60 86" width="100%" height="100%"><defs><radialGradient id="bulb-glass" cx="40%" cy="30%" r="70%"><stop offset="0" stop-color="#fffedb"/><stop offset=".6" stop-color="#fff39a"/><stop offset="1" stop-color="#e3bf35"/></radialGradient><linearGradient id="bulb-metal"><stop stop-color="#40516a"/><stop offset=".5" stop-color="#afbbc4"/><stop offset="1" stop-color="#40516a"/></linearGradient></defs><path d="M30 2C14 2 3 14 3 30c0 11 5 17 11 24 4 5 5 7 5 12h22c0-5 1-7 5-12 6-7 11-13 11-24C57 14 46 2 30 2z" fill="url(#bulb-glass)" stroke="#bd9217" stroke-width="2"/><path d="M24 66l-4-28 6 4 4-6 4 6 6-4-4 28" fill="none" stroke="#dec75f" stroke-width="1"/><path d="M12 24C13 12 22 7 30 7" fill="none" stroke="#fffbd3" stroke-width="3"/><path d="M19 64h22v12q-3 7-11 7t-11-7z" fill="url(#bulb-metal)" stroke="#3d4b5e" stroke-width="1.5"/><path d="M19 68q11 5 22 0m-22 5q11 5 22 0m-20 5q9 4 18 0" fill="none" stroke="#394b60" stroke-width="1.5"/><path d="M25 83h10q-5 5-10 0" fill="#354251"/></svg>';
  const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const endRng = ctx.rng.fork('chrome/end');
      const endLabels = (
        (ctx.content && ctx.content.END_LABELS) || [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
        ]
      ).map(labelOf);
      const legacy = !ctx.finish && endRng.bool(0.5);
      const placement = ctx.finish ? null : legacy ? 'footer' : endRng.pick(['header', 'link']);
      const otherLabels = endLabels.filter((x) => x.toLowerCase() !== 'submit');
      const label = ctx.finish
        ? 'Submit'
        : legacy
          ? 'Submit'
          : labelOf(endRng.pick(otherLabels.length ? otherLabels : endLabels));
      const collideRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const options = [...new Set(endLabels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) collide = { label: collideRng.pick(options), where: collideRng.pick(['footer', 'header']) };
      }
      const top = u.el('header', 'ds-top', document.body);
      const ic = u.el('span', 'ds-ico', top);
      ic.innerHTML = BULB;
      u.el('span', 'ds-brand', top, C.brand);
      const wb = u.el('span', 'ds-wbtns', top);
      ['_', '', 'x'].forEach((t, i) => {
        const b = u.el('i', 'ds-wb' + (i === 2 ? ' x' : ''), wb);
        b.dataset.k = String(i);
      });
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      function briefing(parent, cls) {
        const h = u.el('aside', cls, parent);
        u.el('div', 'ds-instruction', h, ctx.instruction);
        return h;
      }
      if (ctx.display === 'header') briefing(content, 'ds-header-note');
      if (ctx.display === 'toast') briefing(content, 'ds-toast');
      const main = u.el('div', 'ds-main', content);
      if (ctx.display === 'panel') briefing(main, 'ds-brief');
      const stage = u.el('main', 'ds-stage', main);
      const foot = u.el('footer', 'ds-footer', content);
      const help = u.el('button', 'ds-btn ds-help', foot);
      help.type = 'button';
      u.el('span', 'ds-q', help, '?');
      u.el('span', '', help, 'Help');
      u.el('span', 'ds-sp', foot);
      const cancel = u.el('button', 'ds-btn', foot, 'Cancel');
      cancel.type = 'button';
      const decoyBtn = (parent, text) => {
        const b = u.el('button', 'ds-btn ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        return b;
      };
      let submit = null;
      const makeSubmit = (parent, cls, tag) => {
        const b = u.el(tag || 'button', cls, parent, label);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (!ctx.finish) {
        if (placement === 'footer') submit = makeSubmit(foot, 'ds-btn ds-submit');
        else if (placement === 'header') {
          submit = makeSubmit(top, 'ds-btn ds-submit ds-toolbar-submit');
          top.insertBefore(submit, wb);
        } else submit = makeSubmit(foot, 'ds-endlink', 'a');
      }
      if (collide) {
        if (collide.where === 'header') {
          const d = decoyBtn(top, collide.label);
          top.insertBefore(d, wb);
        } else decoyBtn(foot, collide.label);
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const tb = u.el('div', 'ds-otitle', el);
      const i = u.el('span', 'ds-oico', tb);
      i.innerHTML = BULB;
      u.el('span', '', tb, 'Tip of the day');
      const x = u.el('button', 'ds-ox', tb, '✕');
      x.type = 'button';
      x.addEventListener('click', () => ctx.dismiss('close'));
      const bd = u.el('div', 'ds-obody', el);
      const big = u.el('span', 'ds-obulb', bd);
      big.innerHTML = BULB;
      const tx = u.el('div', 'ds-otext', bd);
      u.el('h3', '', tx, 'Keep your account safe');
      u.el(
        'p',
        '',
        tx,
        'Use a strong password with a mix of letters, numbers and symbols. Avoid using personal information.',
      );
      const row = u.el('div', 'ds-orow', el);
      const lab = u.el('label', 'ds-ocheck', row);
      const cb = u.el('input', '', lab);
      cb.type = 'checkbox';
      u.el('span', '', lab, 'Do not show again');
      const dismiss = u.el('button', 'ds-btn ds-oclose', row, 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
