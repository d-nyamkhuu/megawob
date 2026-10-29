(function () {
  'use strict';
  const C = {
    'site': 'design-type-text-login-06',
    'brand': 'Rivet',
    'instruction': 'top',
    'menu': 'Home|Projects|Archive|Settings',
    'briefTitle': 'Instructions',
  };
  const NS = 'http://www.w3.org/2000/svg';
  function textOf(x) {
    return (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
  }
  const ART =
    '<svg viewBox="0 0 560 560" preserveAspectRatio="xMaxYMax meet" xmlns="' +
    NS +
    '">' +
    '<polygon points="560,0 560,560 0,560" fill="#f8e4de"/>' +
    '<rect x="372" y="40" width="108" height="136" fill="none" stroke="#2b6b73" stroke-width="7"/>' +
    '<rect x="386" y="54" width="80" height="108" fill="none" stroke="#2b6b73" stroke-width="1" stroke-dasharray="3 3"/>' +
    '<g fill="#2b6b73" font-family="Arial,sans-serif" font-size="8" font-weight="700" text-anchor="middle" letter-spacing="1.5"><text x="426" y="80">A</text><text x="426" y="98">QUIETER</text><text x="426" y="116">INTERNET</text><text x="426" y="134">A BRIGHTER</text><text x="426" y="152">YOU</text></g>' +
    '<g fill="#2b6b73"><path d="M150 560 L158 380 L170 380 L168 560Z"/><path d="M160 400 C100 380 70 330 60 300 C110 290 150 330 160 400Z"/><path d="M165 360 C170 300 200 240 230 210 C250 270 220 330 165 360Z"/><path d="M168 430 C200 380 260 340 300 330 C290 390 240 430 168 430Z"/><path d="M160 330 C130 290 120 240 150 190 C185 230 185 290 160 330Z" fill="#3c8a8c"/><path d="M150 450 C110 440 60 420 40 380 C90 370 140 400 150 450Z"/></g>' +
    '<g><rect x="190" y="505" width="200" height="14" fill="#f4efe4" stroke="#2b6b73"/><rect x="200" y="490" width="180" height="14" fill="#f4efe4" stroke="#2b6b73"/><rect x="60" y="500" width="500" height="60" fill="#2b6b73"/><rect x="60" y="480" width="500" height="22" fill="#2b6b73"/></g>' +
    '<g><rect x="415" y="440" width="64" height="62" rx="4" fill="#efe6d8" stroke="#8a2c3c" stroke-width="2"/><path d="M479 455 q28 5 0 34" fill="none" stroke="#8a2c3c" stroke-width="8"/></g>' +
    '<path d="M300 560 Q420 520 560 520 L560 560Z" fill="#8a2c3c"/></svg>';
  function ink(u, parent, teal) {
    const layer = u.el('span', 'rv-ink', parent);
    layer.setAttribute('aria-hidden', 'true');
    const id = 'ink-' + parent.className;
    const x = teal ? 1500 : 1000,
      y = teal ? 18 : 40,
      w = teal ? 90 : 300,
      h = teal ? 45 : 80;
    layer.innerHTML =
      '<svg width="100%" height="100%" xmlns="' +
      NS +
      '"><defs><pattern id="' +
      id +
      '" width="' +
      w +
      '" height="' +
      h +
      '" patternUnits="userSpaceOnUse"><image href="sites/design-type-text-login-06/assets/reference-art.webp" x="-' +
      x +
      '" y="-' +
      y +
      '" width="1672" height="941"/></pattern></defs><rect width="100%" height="100%" fill="url(#' +
      id +
      ')"/></svg>';
  }
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const win = u.el('div', 'rv-win', document.body);
      const top = u.el('header', 'ds-top', win);
      ink(u, top, false);
      u.el('span', 'ds-brand', top, C.brand);
      const nav = u.el('nav', 'ds-menu', top);
      C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      const endR = ctx.rng.fork('chrome/end');
      const endWords =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      let endPlacement = null,
        endLabel = 'Submit';
      if (!ctx.finish) {
        if (endR.bool(0.5)) {
          endPlacement = 'footer';
        } else {
          endPlacement = endR.pick(['header', 'link']);
          endLabel = textOf(endR.pick(endWords));
        }
      }
      let submit = null;
      const collideR = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideR.bool(0.3)) {
        const choices = [...new Set(endWords.map(textOf))].filter(
          (x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
        );
        if (choices.length) collide = { label: collideR.pick(choices), where: collideR.pick(['header', 'footer']) };
      }
      function endControl(parent, where) {
        const isLink = where === 'link';
        const el = u.el(
          isLink ? 'a' : 'button',
          where === 'header' ? 'rv-head-end' : isLink ? 'rv-end-link' : 'ds-submit',
          parent,
          isLink ? endLabel + (endLabel === '✓' ? '' : ' ›') : '',
        );
        if (isLink) {
          el.href = '#';
        } else el.type = 'button';
        el.dataset.role = 'submit';
        el.setAttribute('aria-label', endLabel);
        el.title = endLabel;
        el.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        if (!isLink) {
          ink(u, el, false);
          u.el('span', 'rv-submit-label', el, endLabel);
        }
        return el;
      }
      function decoy(parent, label) {
        const b = u.el('button', 'rv-pq', parent, label);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        return b;
      }
      if (endPlacement === 'header') submit = endControl(top, 'header');
      if (collide && collide.where === 'header') decoy(nav, collide.label);
      const pal = u.el('aside', 'rv-pal', document.body);
      const ph = u.el('div', 'rv-pal-h', pal);
      ink(u, ph, true);
      u.el('span', '', ph, 'Notes');
      u.el('span', 'rv-min', ph, '');
      const pb = u.el('div', 'rv-pal-b', pal);
      u.el('div', 'rv-pal-t', pb, 'Tasks for today:');
      ['Sign in to Rivet', 'Explore the workspace', 'Save a project'].forEach((t) => {
        const r = u.el('div', 'rv-pal-r', pb);
        u.el('i', '', r);
        u.el('span', '', r, t);
      });
      const content = u.el('div', 'ds-content', win);
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'panel'
              : 'top';
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle);
        if (cls === 'rv-panel-task') u.el('h3', '', b, 'Current task');
        if (cls.indexOf('ds-header-note') >= 0) {
          const ic = u.el('span', 'rv-ex', b, '!');
        }
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'top') briefing(content, 'ds-header-note');
      if (mode === 'panel') {
        briefing(pb, 'rv-panel-task');
        briefing(content, 'ds-header-note rv-panel-header');
      }
      const main = u.el('div', 'ds-main', content);
      const art = u.el('div', 'rv-art', main);
      art.innerHTML =
        '<svg viewBox="670 346 644 563" preserveAspectRatio="none" aria-hidden="true" xmlns="' +
        NS +
        '"><defs><clipPath id="rv-scene"><path d="M740 346H1314V909H670L740 780Z"/></clipPath></defs><image clip-path="url(#rv-scene)" href="sites/design-type-text-login-06/assets/reference-art.webp" width="1672" height="941"/></svg>';
      const col = u.el('div', 'rv-col', main);
      const stage = u.el('main', 'ds-stage', col);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', col);
      if (endPlacement === 'footer') {
        submit = endControl(foot, 'footer');
      }
      if (collide && collide.where === 'footer') decoy(foot, collide.label);
      if (endPlacement === 'link') {
        submit = endControl(foot, 'link');
      }
      const orr = u.el('div', 'rv-or', foot);
      u.el('span', '', orr, 'or');
      u.el('a', 'rv-help', foot, 'Need help signing in?');
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
