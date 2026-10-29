(function () {
  'use strict';
  const C = {
    site: 'design-choose-option-dropdown-12',
    nav: ['Now Playing', 'Media Library', 'Playlists', 'Settings', 'Equalizer'],
    steps: [
      'Click "Show controls" to reveal the task controls.',
      'Set the Subtitle language to the requested value from the dropdown list.',
    ],
  };
  const SVG = 'http://www.w3.org/2000/svg';
  function transport(u, parent) {
    const bar = u.el('div', 'pp-player', parent);
    const btns = u.el('div', 'pp-transport', bar);
    [
      ['pp-b', '<path d="M6 5h3v14H6zM20 5v14L10 12z" fill="#0d2342"/>'],
      ['pp-b big', '<path d="M8 4l13 8-13 8z" fill="#0d2342"/>'],
      ['pp-b', '<path d="M15 5h3v14h-3zM4 5l10 7-10 7z" fill="#0d2342"/>'],
      ['pp-b', '<path d="M6 6h12v12H6z" fill="#0d2342"/>'],
    ].forEach(([c, p]) => {
      const b = u.el('span', c, btns);
      b.innerHTML = '<svg viewBox="0 0 24 24" width="100%" height="100%">' + p + '</svg>';
    });
    const info = u.el('div', 'pp-info', bar);
    u.el('b', '', info, 'Sunrise');
    u.el('div', '', info, 'Maple Trees');
    u.el('div', '', info, '02:14 / 04:37');
    const seek = u.el('div', 'pp-seek', bar);
    u.el('i', '', seek);
    const vol = u.el('div', 'pp-vol', bar);
    const sp = u.el('em', 'pp-spk', vol);
    sp.innerHTML =
      '<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M3 9h4l5-4v14l-5-4H3z" fill="#173558"/><path d="M15 8q3 4 0 8M18 5q6 7 0 14" stroke="#173558" stroke-width="2" fill="none"/></svg>';
    const vs = u.el('div', 'pp-vseek', vol);
    u.el('i', '', vs);
    u.el('span', 'pp-sq', vol);
    return bar;
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
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endWords = ctx.content.END_LABELS.map(labelOf);
      const er = ctx.rng.fork('chrome/end');
      const original = er.bool(0.5);
      const placement = original ? 'footer' : er.pick(['header', 'link']);
      const endLabel = original ? 'Submit' : er.pick(endWords);
      const cr = ctx.rng.fork('chrome/collide');
      const collideWords = endWords.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
      const collide = cr.bool(0.3) && collideWords.length ? cr.pick(collideWords) : null;
      const mode = ctx.display === 'hidden' ? 'hidden' : ctx.display === 'toast' ? 'toast' : 'left';
      const left = u.el('aside', 'pp-left', document.body);
      u.el('div', 'pp-lh', left, 'Task Briefing');
      const lb = u.el('div', 'pp-lb', left);
      u.el('p', 'pp-intro', lb, 'Your task is to configure the player settings.');
      if (mode === 'left') {
        const note = u.el('div', 'ds-header-note', lb);
        u.el('div', 'ds-instruction', note, ctx.instruction);
      }
      u.el('div', 'pp-steps-h', lb, 'Steps:');
      const ol = u.el('ol', 'pp-steps', lb);
      C.steps.forEach((t, i) =>
        u.el(
          'li',
          '',
          ol,
          i === 1
            ? 'Choose the requested option from the dropdown list.'
            : i === 2
              ? ctx.finish
                ? 'Finish the episode when you are done.'
                : 'Click "' + endLabel + '" when you are done.'
              : t,
        ),
      );
      const right = u.el('div', 'pp-right', document.body);
      const top = u.el('header', 'pp-top', right);
      const logo = u.el('span', 'pp-logo', top, 'Pixel');
      u.el('span', '', logo, 'Play');
      u.el('span', 'pp-sub', top, 'MEDIA PLAYER 2002');
      const tn = u.el('nav', 'pp-tnav', top);
      ['LIBRARY', 'SETTINGS', 'HELP'].forEach((t, i) => u.el('span', i === 1 ? 'on' : '', tn, t));
      const shell = u.el('div', 'pp-shell', right);
      const nav = u.el('div', 'pp-nav', shell);
      C.nav.forEach((t) => u.el('div', 'pp-tab' + (t === 'Settings' ? ' on' : ''), nav, t));
      const content = u.el('div', 'ds-content', shell);
      u.el('h1', 'pp-h1', content, 'Settings');
      const stage = u.el('main', 'ds-stage', content);
      if (mode === 'toast') {
        const note = u.el('aside', 'ds-toast', content);
        u.el('div', 'ds-instruction', note, ctx.instruction);
        content.insertBefore(note, stage);
      }
      transport(u, right);
      right.classList.toggle('pp-finish', !!ctx.finish);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          'ds-submit ds-end-' + placement,
          placement === 'header' ? content : right,
          endLabel,
        );
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      if (collide) {
        const decoy = u.el(
          'button',
          'pp-xtra' + (!ctx.finish && placement === 'header' ? ' pp-xtra-footer' : ''),
          !ctx.finish && placement === 'header' ? right : content,
          collide,
        );
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
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
