(function () {
  'use strict';
  const C = {
    'site': 'design-choose-option-checkbox-08',
    'brand': 'Preferences - Topic Selection',
    'instruction': 'top',
    'rail': '',
    'menu': 'File|Edit|View|Help',
    'briefTitle': 'Your Task',
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
      const endR = ctx.rng.fork('chrome/end');
      const endPool =
        ctx.content && ctx.content.END_LABELS && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const endText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const placement = ctx.finish ? null : endR.pick(['footer', 'footer', 'header', 'link']);
      const endLabel = ctx.finish ? '' : endText(endR.pick(endPool));
      const collideR = ctx.rng.fork('chrome/collide');
      const collisionPool = endPool
        .map(endText)
        .filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
      const collision =
        !ctx.finish && collisionPool.length && collideR.bool(0.3) ? endText(collideR.pick(collisionPool)) : null;
      let submit = null;
      const endButton = (parent, cls, label, tag = 'button') => {
        const b = u.el(tag, cls, parent, label);
        if (tag === 'button') b.type = 'button';
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
      const decoyButton = (parent, label, collides) => {
        const b = u.el('button', collides ? 'ds-pqs' : 'ds-xtra', parent, label);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', collides ? { label, collide: true } : { label }));
        return b;
      };
      const top = u.el('header', 'ds-top', document.body);
      const lg = u.el('span', 'ds-logo', top);
      lg.innerHTML =
        '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M5 5h6l-3 5v4l5-7h6v12h-7l3-5V9L9 19H4z" fill="white"/></svg>';
      u.el('span', 'ds-brand', top, 'InsightHub');
      u.el('span', 'ds-sep', top);
      u.el('span', 'ds-sub', top, 'Audience Preferences');
      u.el('span', 'ds-spacer', top);
      const IC = {
        Settings:
          '<path d="M9 2h6l.7 3 2 .9 2.7-.9 2 4-2.1 2v2l2.1 2-2 4-2.7-.9-2 .9-.7 3H9l-.7-3-2-.9-2.7.9-2-4 2.1-2v-2l-2.1-2 2-4 2.7.9 2-.9z"/><circle cx="12" cy="12" r="4"/>',
        Help: '<circle cx="12" cy="12" r="10.5"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17v.5"/>',
        'My Account':
          '<circle cx="12" cy="12" r="10.5"/><circle cx="12" cy="10" r="3"/><path d="M6.5 18c1.5-3 9.5-3 11 0"/>',
      };
      ['Settings', 'Help', 'My Account'].forEach((t) => {
        const s = u.el('span', 'ds-util', top);
        const i = u.el('span', 'ds-ico', s);
        i.innerHTML =
          '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#2a2f3a" stroke-width="1.6" stroke-linecap="round">' +
          IC[t] +
          '</svg>';
        u.el('span', '', s, t);
      });
      if (placement === 'header' && !ctx.finish) submit = endButton(top, 'ds-submit ds-header-submit', endLabel);
      if (collision && placement === 'header') decoyButton(top, collision, true);
      const body = u.el('div', 'ds-body', document.body);
      if (C.rail) {
        const rail = u.el('aside', 'ds-rail', body);
        C.rail.split('|').forEach((t) => u.el('div', '', rail, t));
      }
      const content = u.el('div', 'ds-content', body);
      const natural = C.instruction;
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'left'
              : natural;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle || 'Task');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'top') {
        const hn = briefing(content, 'ds-header-note');
        hn.insertBefore(u.el('div', 'ds-bar'), hn.firstChild);
        u.el('p', 'ds-lead', hn, 'Choose the topics you’re interested in.');
      }
      const main = u.el('div', 'ds-main', content);
      if (mode === 'left' || mode === 'right') {
        const b = briefing(main, 'ds-brief');
        if (mode === 'right') b.style.order = '2';
      }
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      const ca = u.el('button', 'ds-clear', foot, 'Clear all');
      ca.type = 'button';
      u.el('span', 'ds-fill', foot);
      const sv = u.el('button', 'ds-save', foot, 'Save for later');
      sv.type = 'button';
      sv.addEventListener('click', () => env.log('decoy', { label: 'Save for later' }));
      if (collision && placement !== 'header') decoyButton(foot, collision, true);
      if (!ctx.finish && placement === 'footer') submit = endButton(foot, 'ds-submit', endLabel);
      if (!ctx.finish && placement === 'link') submit = endButton(foot, 'ds-endlink', endLabel + ' ›', 'a');
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
