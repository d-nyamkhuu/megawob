(function () {
  'use strict';
  const C = {
    'site': 'design-set-date-range-07',
    'brand': 'Event Planner',
    'instruction': 'top',
    'rail': '',
    'menu': 'File|Edit|View|Tools|Help',
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
      const endRng = ctx.rng.fork('chrome/end');
      let placement, label;
      if (!ctx.finish) {
        if (endRng.bool(0.5)) {
          placement = 'footer';
          label = 'Submit';
        } else {
          placement = endRng.pick(['footer', 'header', 'link']);
          const labels = ctx.content && ctx.content.END_LABELS;
          label = endRng.pick(
            Array.isArray(labels) && labels.length
              ? labels
              : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"],
          );
          label = typeof label === 'string' ? label : label.label || label.text || label.name || String(label);
        }
      }
      const collideRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const labels = ctx.content && ctx.content.END_LABELS;
        const pool =
          Array.isArray(labels) && labels.length
            ? labels
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
        const own = String(label).trim().toLowerCase();
        const options = [
          ...new Set(
            pool
              .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))
              .filter((x) => String(x).trim().toLowerCase() !== own),
          ),
        ];
        if (options.length) collide = { label: collideRng.pick(options), where: collideRng.pick(['header', 'footer']) };
      }
      const uel = (parent, text, cls) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        return b;
      };
      const top = u.el('header', 'ds-top', document.body);
      const dots = u.el('span', 'ds-dots', top);
      ['#ff5f57', '#febc2e', '#28c840'].forEach((c) => {
        u.el('i', '', dots).style.background = c;
      });
      u.el('span', 'ds-brand', top, C.brand);
      const nav = u.el('nav', 'ds-menu', top);
      C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      const srch = u.el('span', 'ds-search', top);
      srch.innerHTML =
        '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#c8ccd2" stroke-width="1.6"><circle cx="6.5" cy="6.5" r="4.7"/><path d="M10 10l4.2 4.2"/></svg>';
      u.el('span', '', srch, 'Search events');
      let headerEnd = null;
      if (!ctx.finish && (placement === 'header' || (collide && collide.where === 'header'))) {
        const tools = u.el('div', 'ds-chrome-tools', top);
        if (collide && collide.where === 'header') uel(tools, collide.label, 'ds-pq');
        if (placement === 'header') {
          headerEnd = u.el('button', 'ds-top-submit', tools, label);
          headerEnd.type = 'button';
          headerEnd.dataset.role = 'submit';
          headerEnd.setAttribute('aria-label', label);
          headerEnd.title = label;
          headerEnd.addEventListener('click', () => ctx.submit());
        }
      }
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
      if (mode === 'top') briefing(content, 'ds-header-note');
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
      u.el('span', '', foot, 'Ready');
      let submit = headerEnd;
      if (!ctx.finish) {
        if (collide && collide.where === 'footer') uel(foot, collide.label, 'ds-pq');
        if (placement === 'link') {
          submit = u.el('a', 'ds-end-link', foot, label + ' ›');
          submit.href = '#';
          submit.setAttribute('aria-label', label);
          submit.title = label;
          submit.dataset.role = 'submit';
          submit.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
        } else if (placement === 'footer') {
          submit = u.el('button', 'ds-submit', foot, label);
          submit.type = 'button';
          submit.dataset.role = 'submit';
          submit.setAttribute('aria-label', label);
          submit.title = label;
          submit.addEventListener('click', () => ctx.submit());
        }
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
