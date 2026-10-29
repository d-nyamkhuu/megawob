(function () {
  'use strict';
  const C = {
    'site': 'design-find-fact-table-05',
    'brand': 'World Scientists Archive',
    'nav': 'Explore|Learn|Discover',
    'tabs': 'Scientists|Research Areas|Timelines|Publications',
    'foot': ['Help', 'Settings', 'Exit'],
    'instruction': 'top',
    'briefTitle': 'Instructions',
  };
  const NS = 'http://www.w3.org/2000/svg';
  function svg(parent, html, cls) {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 100 100');
    if (cls) s.setAttribute('class', cls);
    s.innerHTML = html;
    parent.appendChild(s);
    return s;
  }
  const GLOBE =
    '<defs><radialGradient id="gg" cx=".3" cy=".28" r=".8"><stop stop-color="#297bb0"/><stop offset=".65" stop-color="#124d7c"/><stop offset="1" stop-color="#031b2d"/></radialGradient><radialGradient id="gs" cx=".3" cy=".25" r=".8"><stop stop-color="#eedc8c" stop-opacity=".35"/><stop offset=".55" stop-color="#132f21" stop-opacity="0"/><stop offset="1" stop-color="#00111b" stop-opacity=".8"/></radialGradient></defs><circle cx="50" cy="50" r="48" fill="#061e39" stroke="#e3b850" stroke-width="2"/><circle cx="50" cy="50" r="44" fill="url(#gg)" stroke="#72a8aa" stroke-width=".5"/><g fill="#939d4d" stroke="#c0b66a" stroke-width=".45"><path d="M21 19 30 13 42 10 49 13 45 18 50 22 45 25 41 22 36 25 37 29 45 29 49 34 45 38 39 36 35 41 30 43 29 48 34 52 39 52 42 57 39 60 33 55 31 51 25 50 22 43 18 40 16 33 20 29 17 26Z"/><path d="m43 11 10-3 10 4-6 5-5 9-5-4 2-7Z"/><path d="m42 58 7-3 8 5 12 2 6 7-6 6-4 7-6 7-4 6-4-5 1-9-4-8-1-6-5-4Z"/><path d="m63 17 7 1 8 8-2 5 6 5 4 10-4 5-6-4-2-10-6-4-2-6-6-4Z"/><path d="m40 44 6 3 3-1 3 4-5 1-4-2Z"/></g><g fill="none" stroke="#aac8a1" opacity=".2" stroke-width=".55"><ellipse cx="50" cy="50" rx="24" ry="44"/><path d="M10 35Q50 48 90 35M7 58Q50 70 93 58M21 18Q50 30 79 18"/></g><circle cx="50" cy="50" r="44" fill="url(#gs)"/>';
  const DISC =
    '<defs><linearGradient id="cd" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#d5c78a"/><stop offset=".2" stop-color="#9ed0cd"/><stop offset=".38" stop-color="#eee5be"/><stop offset=".5" stop-color="#777f9c"/><stop offset=".65" stop-color="#e2ca81"/><stop offset=".8" stop-color="#91c6ce"/><stop offset="1" stop-color="#f8edc5"/></linearGradient></defs><circle cx="50" cy="50" r="47" fill="url(#cd)" stroke="#061e32" stroke-width="2"/><circle cx="50" cy="50" r="44" fill="none" stroke="#f4e5b4" stroke-width="1"/><path d="M48 36 22 12M61 45 87 26M53 64 74 90M38 55 12 74" stroke="#fff" opacity=".4" stroke-width="7"/><circle cx="50" cy="50" r="16" fill="#889b99" stroke="#e4d8ab" stroke-width="2"/><circle cx="50" cy="50" r="10" fill="#0b2545" stroke="#f5e3b0" stroke-width="2"/>';
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      svg(top, GLOBE, 'ds-globe');
      u.el('span', 'ds-brand', top, C.brand);
      const nav = u.el('nav', 'ds-nav', top);
      C.nav.split('|').forEach((t, i) => {
        if (i) u.el('b', '', nav, '•');
        u.el('span', '', nav, t);
      });
      const content = u.el('div', 'ds-content', document.body);
      const natural = C.instruction;
      const width = ctx.size?.width || document.documentElement.clientWidth;
      const height = ctx.size?.height || document.documentElement.clientHeight;
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? height < 700
              ? natural
              : 'toast'
            : ctx.display === 'panel'
              ? width < 1260
                ? natural
                : 'left'
              : natural;
      const endRng = ctx.rng.fork('chrome/end');
      const collideRng = ctx.rng.fork('chrome/collide');
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const endLabels = (
        ctx.content && ctx.content.END_LABELS && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
      ).map(labelOf);
      const original = !endRng.bool(0.5);
      const placement = original ? 'form' : endRng.pick(['toolbar', 'footer']);
      const endLabel = original ? 'Submit' : endRng.pick(endLabels);
      let collide = null;
      if (collideRng.bool(0.3)) {
        const options = [...new Set(endLabels)].filter((t) => t.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (options.length) collide = collideRng.pick(options);
      }
      function endBtn(parent, cls) {
        const b = u.el('button', cls, parent, endLabel);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.title = endLabel;
        b.setAttribute('aria-label', endLabel);
        b.addEventListener('click', () => ctx.submit());
        return b;
      }
      function decoyBtn(parent, label, collides) {
        const b = u.el('button', 'ds-fbtn', parent, label);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', collides ? { label, collide: true } : { label }));
        return b;
      }
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle || 'Task');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'top') briefing(content, 'ds-header-note');
      if (mode === 'toast') {
        briefing(content, 'ds-toast');
      }
      const tabs = u.el('div', 'ds-tabs', content);
      C.tabs.split('|').forEach((t, i) => u.el('span', i ? 'ds-tab' : 'ds-tab on', tabs, t));
      const sheet = u.el('div', 'ds-sheet', content);
      sheet.classList.toggle('has-form-submit', !ctx.finish && placement === 'form');
      const main = u.el('div', 'ds-main', sheet);
      if (mode === 'left' || mode === 'right') {
        const b = briefing(main, 'ds-brief');
        if (mode === 'right') b.style.order = '2';
      }
      const stage = u.el('main', 'ds-stage', main);
      let submit = null;
      if (!ctx.finish && placement === 'form') {
        const bar = u.el('div', 'ds-answerbar', sheet);
        submit = endBtn(bar, 'ds-submit');
      }
      if (!ctx.finish && placement === 'toolbar') {
        const tools = u.el('div', 'ds-tab-tools', tabs);
        submit = endBtn(tools, 'ds-submit ds-toolbar-submit');
      }
      const foot = u.el('footer', 'ds-footer', document.body);
      svg(foot, DISC, 'ds-disc');
      const ft = u.el('div', 'ds-foot-name', foot);
      u.el('div', '', ft, C.brand);
      u.el('div', '', ft, 'CD-ROM Companion');
      const fb = u.el('div', 'ds-foot-btns', foot);
      if (collide) decoyBtn(fb, collide, true);
      C.foot.forEach((t) => {
        decoyBtn(fb, t, false);
      });
      if (!ctx.finish && placement === 'footer') submit = endBtn(fb, 'ds-fbtn ds-footer-submit');
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
