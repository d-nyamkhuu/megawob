(function () {
  'use strict';
  const C = {
    site: 'design-find-fact-locate-07',
    brand: 'Parks Information Guide',
    instruction: 'top',
    rail: 'Guide|Parks|Facilities|Fees|Maps|Index',
    briefTitle: 'Instructions',
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
      const top = u.el('header', 'ds-top', document.body);
      u.el('button', 'ds-appmenu', top, '☰');
      u.el('span', 'ds-brand', top, C.brand);
      u.el('span', 'ds-window', top, '↙　▣　×');
      const menu = u.el('nav', 'ds-menu', document.body);
      ['File', 'Edit', 'View', 'Go', 'Bookmarks', 'Help'].forEach((t) => u.el('span', '', menu, t));
      const body = u.el('div', 'ds-body', document.body);
      if (C.rail) {
        const rail = u.el('aside', 'ds-rail', body);
        C.rail.split('|').forEach((t, i) => {
          const a = u.el('div', i === 0 ? 'on' : '', rail);
          const icon = u.el('span', 'ds-navicon', a);
          icon.innerHTML = [
            '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#9b6337" d="M2 8h11l3 3h14v17H2z"/><path fill="#d7b37d" d="M3 13h25v14H3z"/><path fill="#eee0c3" d="M5 15h21v10H5z"/></svg>',
            '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#755334" d="M14 21h4v9h-4z"/><path fill="#2c7540" d="M16 1 5 15h7L3 23h11v4h4v-4h11l-9-8h7z"/><path fill="#4a9a54" d="m16 4-8 10h6l-8 7h9z"/></svg>',
            '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#888d94" stroke="#353a40" d="M4 28V8l8-5 7 4 8-4v25l-8 3-7-3z"/><path fill="#d8d9d5" d="M7 10h4v5H7zm0 8h4v5H7zm8-8h4v5h-4zm0 8h4v5h-4zm8-8h2v13h-2z"/></svg>',
            '<svg viewBox="0 0 32 32" aria-hidden="true"><ellipse cx="13" cy="25" rx="10" ry="4" fill="#b98708" stroke="#4b3a0a"/><path fill="#edc52f" stroke="#4b3a0a" d="M3 20v5c0 2 4 4 10 4s10-2 10-4v-5z"/><ellipse cx="13" cy="20" rx="10" ry="4" fill="#ffe15a" stroke="#4b3a0a"/><ellipse cx="23" cy="12" rx="8" ry="3" fill="#ffe15a" stroke="#4b3a0a"/><path fill="#d7a616" stroke="#4b3a0a" d="M15 12v6c0 2 3 3 8 3s8-1 8-3v-6z"/></svg>',
            '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#d3cc7b" stroke="#39434b" stroke-width="1.5" d="m3 7 8-4 10 4 8-4v22l-8 4-10-4-8 4z"/><path fill="none" stroke="#385f87" stroke-width="2" d="m11 3 0 22m10-18v22M4 20l7-7 6 3 6-8 6 3"/><path fill="#cc5b35" d="m19 10 4-4 4 4-4 4z"/></svg>',
            '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#efeee8" stroke="#52575e" stroke-width="2" d="M5 2h17l6 6v22H5z"/><path fill="#b9cce0" d="M21 2v7h7"/><path stroke="#58616b" stroke-width="1.5" d="M9 13h14M9 17h14M9 21h14M9 25h14"/></svg>',
          ][i];
          u.el('span', '', a, t);
        });
      }
      const content = u.el('div', 'ds-content', body);
      const natural = C.instruction;
      let mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'left'
              : natural;
      if (mode === 'left' && window.innerWidth < 1260) mode = 'top';
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle);
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
      u.el('span', '', foot, '');
      let submit = null;
      const er = ctx.rng.fork('chrome/end');
      const labels = (
        (ctx.content && ctx.content.END_LABELS) || [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
          'Complete',
        ]
      ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name));
      const baseline = !ctx.finish && er.bool(0.5);
      const placement = ctx.finish ? null : baseline ? 'footer' : er.pick(['header', 'link']);
      const label = ctx.finish
        ? ''
        : baseline
          ? 'Submit'
          : er.pick(labels.filter((x) => String(x).toLowerCase() !== 'submit'));
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const pool = labels.filter((x) => String(x).toLowerCase() !== String(label).toLowerCase());
        if (pool.length) collide = cr.pick(pool);
      }
      const decoy = (parent, text, isCollide) => {
        const b = u.el('button', 'ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () =>
          env.log('decoy', isCollide ? { label: text, collide: true } : { label: text }),
        );
      };
      const end = (parent, cls, text) => {
        const b = u.el(cls === 'ds-endlink' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      const tools = u.el('div', 'ds-tools', top);
      if (collide) decoy(placement === 'footer' ? foot : tools, collide, true);
      if (placement === 'header') submit = end(tools, 'ds-submit ds-header-submit', label);
      if (placement === 'footer') submit = end(foot, 'ds-submit', label);
      if (placement === 'link') submit = end(foot, 'ds-endlink', label + ' ›');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'This guide uses cookies.',
        toast: 'Changes synced.',
        chat: 'How can we help?',
        promo: 'Explore Parks Guide.',
        banner: 'County Parks Department notice.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
