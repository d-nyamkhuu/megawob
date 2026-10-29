(function () {
  'use strict';
  const C = { site: 'design-find-fact-count-13' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const s = window.getSelection();
      if (s) s.removeAllRanges();
      const u = ctx.util;
      const title = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-appicon', title, '▣');
      u.el('span', 'ds-brand', title, 'Community Guide - Documentation Viewer');
      const win = u.el('div', 'ds-window', title);
      ['−', '□', '×'].forEach((x, i) => u.el('span', 'ds-winbtn w' + i, win, x));
      const menu = u.el('nav', 'ds-menu', document.body);
      ['File', 'Edit', 'View', 'Tools', 'Help'].forEach((t) => u.el('span', '', menu, t));
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      [
        ['▤', 'Documents'],
        ['◷', 'Recent'],
        ['★', 'Favorites'],
        ['📁', 'Libraries'],
        ['⌕', 'Search'],
      ].forEach((v, i) => {
        const item = u.el('div', 'ds-navitem' + (i === 0 ? ' active' : ''), rail);
        u.el('i', '', item, v[0]);
        u.el('span', '', item, v[1]);
      });
      const content = u.el('div', 'ds-content', body);
      let mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'panel'
              : 'header';
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'header') briefing(content, 'ds-header-note');
      const stage = u.el('main', 'ds-stage', content);
      const expand = u.el('button', 'ds-expand', content, '⊞　Expand all');
      expand.type = 'button';
      expand.addEventListener('click', () => {
        const actual = stage.querySelector('.rl-tbtn[data-key=expand]');
        if (actual) {
          actual.click();
          return;
        }
        stage.querySelectorAll('button.rl-sech[aria-expanded="false"]').forEach((b) => b.click());
      });
      if (mode === 'panel') briefing(stage, 'ds-brief');
      if (mode === 'toast') briefing(content, 'ds-toast');
      const foot = u.el('footer', 'ds-footer', content);
      u.el('div', 'ds-inspector-title', foot, 'Document Details');
      const details = u.el('div', 'ds-details', foot);
      const left = u.el('div', 'ds-detail-left', details);
      u.el('div', 'ds-fileicon', left, '▤');
      const meta = u.el('div', 'ds-meta', left);
      u.el('b', '', meta, 'Riverton Community Guide');
      u.el('span', '', meta, 'Type:　 Help Document');
      u.el('span', '', meta, 'Size:　 214 KB');
      u.el('span', '', meta, 'Modified:　 Apr 12, 2007 10:24 AM');
      const right = u.el('div', 'ds-detail-right', details);
      u.el('span', '', right, 'Summary:');
      u.el(
        'p',
        '',
        right,
        'An introduction to Riverton, including information about neighborhoods, parks, services, and upcoming events.',
      );
      u.el('span', '', right, 'Keywords:');
      u.el('p', '', right, 'Riverton, community, Harbor, travel, city guide');
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
          ? 'Apply'
          : er.pick(labels.filter((x) => String(x).toLowerCase() !== 'apply'));
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const p = labels.filter((x) => String(x).toLowerCase() !== String(label).toLowerCase());
        if (p.length) collide = cr.pick(p);
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
      const tools = u.el('div', 'ds-tools', title);
      if (collide) decoy(placement === 'footer' ? foot : tools, collide, true);
      if (placement === 'header') submit = end(tools, 'ds-submit ds-header-submit', label);
      if (placement === 'footer') submit = end(foot, 'ds-submit', label);
      if (placement === 'link') submit = end(foot, 'ds-endlink', label);
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
      const d = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      d.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss: d, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
