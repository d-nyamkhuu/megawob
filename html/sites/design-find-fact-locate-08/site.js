document.addEventListener('click', (e) => {
  const b = e.target.closest('.qt-toolbar .qt-tool');
  if (!b) return;
  const t = b.textContent.trim();
  const key = t.startsWith('Find') ? 'open' : t === 'Expand all' ? 'expand' : null;
  if (!key) return;
  const target = document.querySelector(`.rl-tbtn[data-key="${key}"]`);
  if (target) target.click();
});
(function () {
  'use strict';
  const C = { site: 'design-find-fact-locate-08' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const title = u.el('header', 'qt-titlebar', document.body);
      u.el('span', 'qt-appicon', title, '▤');
      u.el('span', 'qt-title', title, 'Reference Guide - Document Viewer');
      u.el('span', 'qt-window-buttons', title, '−  □  ×');
      const menu = u.el('nav', 'qt-menubar', document.body);
      ['File', 'Edit', 'View', 'Go', 'Tools', 'Help'].forEach((x, i) => u.el('span', i === 0 ? 'first' : '', menu, x));
      const toolbar = u.el('div', 'qt-toolbar', document.body);
      const tool = (icon, label, disabled) => {
        const b = u.el('button', 'qt-tool' + (disabled ? ' disabled' : ''), toolbar);
        b.type = 'button';
        u.el('b', 'qt-icon', b, icon);
        u.el('span', '', b, label);
        if (disabled) b.disabled = true;
        return b;
      };
      tool('←', 'Back');
      u.el('span', 'qt-tool-drop', toolbar, '▾');
      tool('→', 'Forward', true);
      u.el('span', 'qt-tool-drop muted', toolbar, '▾');
      u.el('i', 'qt-sep', toolbar);
      tool('⌂', 'Home');
      u.el('i', 'qt-sep', toolbar);
      tool('▤', 'Print');
      u.el('i', 'qt-sep', toolbar);
      tool('⌕', 'Find (Ctrl+F)');
      u.el('i', 'qt-sep', toolbar);
      tool('▣', 'Expand all');
      const placementR = ctx.rng.fork('chrome/end');
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
      const baseline = !ctx.finish && placementR.bool(0.5);
      const placement = ctx.finish ? null : baseline ? 'footer' : placementR.pick(['header', 'link']);
      const label = ctx.finish
        ? ''
        : baseline
          ? 'Submit'
          : placementR.pick(labels.filter((x) => String(x).toLowerCase() !== 'submit'));
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const pool = labels.filter((x) => String(x).toLowerCase() !== String(label).toLowerCase());
        if (pool.length) collide = cr.pick(pool);
      }
      const decoy = (p, text, hit) => {
        const b = u.el('button', 'qt-xtra', p, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', hit ? { label: text, collide: true } : { label: text }));
      };
      const end = (p, cls, text) => {
        const b = u.el(cls === 'qt-endlink' ? 'a' : 'button', cls, p, text);
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
      if (collide) decoy(toolbar, collide, true);
      let submit = null;
      if (placement === 'header') submit = end(toolbar, 'qt-submit', label);
      const headerNote =
        ctx.display === 'header' ? u.el('div', 'qt-instruction', document.body, ctx.instruction) : null;
      const split = u.el('div', 'qt-content', document.body);
      const side = u.el('aside', 'qt-sidebar', split);
      const tabs = u.el('div', 'qt-tabs', side);
      ['Contents', 'Index', 'Search', 'Bookmarks'].forEach((x, i) => u.el('span', i === 0 ? 'active' : '', tabs, x));
      const tree = u.el('div', 'qt-tree', side);
      u.el('div', 'qt-booktitle', tree, '▰　Product Reference Guide');
      [
        'File Types and Formats',
        'System Components',
        'Network Services',
        'User Accounts',
        'Security and Permissions',
        'Backup and Recovery',
        'Troubleshooting',
      ].forEach((x, i) => {
        const row = u.el('div', 'qt-tree-row' + (i === 0 ? ' selected' : ''), tree);
        u.el('span', 'qt-docicon', row, '▤');
        u.el('span', '', row, `${i + 1}. ${x}`);
      });
      const summary = u.el('section', 'qt-summary', side);
      u.el('h2', '', summary, 'Document Summary');
      [
        ['Sections:', '7'],
        ['Total entries:', '42'],
        ['Pages:', '28'],
        ['Last updated:', 'Mar 10, 2002'],
        ['Version:', '1.3'],
      ].forEach(([k, v]) => {
        const row = u.el('div', 'qt-summary-row', summary);
        u.el('span', '', row, k);
        u.el('span', '', row, v);
      });
      if (ctx.display === 'panel') {
        const note = u.el('section', 'qt-side-note', side);
        u.el('h2', '', note, 'Task');
        u.el('div', '', note, ctx.instruction);
      }
      const stage = u.el('main', 'ds-stage', split);
      if (ctx.display === 'toast') {
        const note = u.el('aside', 'qt-toast', document.body);
        u.el('span', '', note, ctx.instruction);
        const close = u.el('button', '', note, '×');
        close.type = 'button';
        close.addEventListener('click', () => {
          note.remove();
          env.log('note-close');
        });
      }
      const foot = u.el('footer', 'qt-statusbar', document.body);
      u.el('span', '', foot, 'Ready');
      if (placement === 'footer') submit = end(foot, 'qt-submit', label);
      if (placement === 'link') submit = end(foot, 'qt-endlink', label + ' ›');
      if (ctx.finish) foot.classList.add('finish');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'This document viewer stores preferences on this computer.',
        toast: 'Document view updated.',
        chat: 'Reference Guide support\nHow can we help?',
        promo: 'Get the latest product documentation.',
        banner: 'Scheduled maintenance: documentation search may be briefly unavailable.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
