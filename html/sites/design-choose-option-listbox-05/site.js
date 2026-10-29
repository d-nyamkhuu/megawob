(function () {
  'use strict';
  const C = { 'site': 'design-choose-option-listbox-05', 'instruction': 'top' };
  const PEOPLE =
    '<svg viewBox="0 0 28 20" width="100%" height="100%"><circle cx="9" cy="6" r="4.5" fill="#fff"/><path d="M0 19c0-6 4-8 9-8s9 2 9 8z" fill="#fff"/><circle cx="20" cy="7" r="3.5" fill="#fff"/><path d="M18 12c5 0 9 1.500 9 7h-8c0-3-0.500-5-1-7z" fill="#fff"/></svg>';
  const NOTE =
    '<svg viewBox="0 0 24 28" width="100%" height="100%"><rect x="2" y="1" width="20" height="26" rx="1" fill="#ffce3e"/><path d="M4 6h16v18H4z" fill="#fffbea"/><path d="M6 9h12M6 12h12M6 15h12M6 18h9" stroke="#bfd3e4"/><path d="M17 20l5-5 2 2-5 5-4 2z" fill="#edba37"/></svg>';
  const FOLDER =
    '<svg viewBox="0 0 32 28" width="100%" height="100%"><path d="M1 3h11l3 4h16v20H1z" fill="#edb42e"/><path d="M2 9h28v17H2z" fill="#ffd257"/><path d="M2 10h28v3H2z" fill="#ffe89b"/><path d="M8 18h14v10H8z" fill="#3094ba"/><path d="M10 20h10v6H10z" fill="#6fc6e0"/></svg>';
  const WIN =
    '<svg viewBox="0 0 32 32" width="100%" height="100%"><path d="M2 5l12-2v11H2zM16 2.500L30 0v14H16zM2 17h12v11L2 26zM16 17h14v15L16 29.500z" fill="#fff"/></svg>';
  const CHEV =
    '<svg viewBox="0 0 12 8" width="100%" height="100%"><path d="M1 1l5 5 5-5" fill="none" stroke="#222" stroke-width="2.200"/></svg>';
  const CAL =
    '<svg viewBox="0 0 20 20" width="100%" height="100%"><rect x="1.500" y="3" width="17" height="15" fill="#fff" stroke="#555"/><path d="M1.500 7h17" stroke="#555"/><path d="M5 1v4M15 1v4" stroke="#555" stroke-width="1.500"/><path d="M4 10h2M8 10h2M12 10h2M4 13h2M8 13h2M12 13h2M4 16h2M8 16h2" stroke="#777" stroke-width="1.500"/></svg>';
  function winButtons(u, parent) {
    const b = u.el('span', 'mw-btns', parent);
    u.el('i', 'mw-min', b);
    u.el('i', 'mw-max', b);
    u.el('i', 'mw-x', b).innerHTML =
      '<svg viewBox="0 0 12 12" width="100%" height="100%"><path d="M1 1l10 10M11 1L1 11" stroke="#fff" stroke-width="1.600"/></svg>';
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
      const desk = u.el('div', 'mw-desk', document.body);
      const win2 = u.el('section', 'mw-win mw-win2', desk);
      const t2 = u.el('div', 'mw-title', win2);
      u.el('span', 'mw-ico', t2).innerHTML = NOTE;
      u.el('span', 'mw-ttl', t2, 'Quick Notes');
      winButtons(u, t2);
      const nb = u.el('div', 'mw-notes', win2);
      u.el('h2', '', nb, 'Notes');
      const nl = u.el('ul', '', u.el('div', 'mw-notebox', nb));
      [
        'Add new engineering team member.',
        'Office location should be Seattle.',
        'Send welcome email after setup.',
      ].forEach((t) => u.el('li', '', nl, t));
      const win = u.el('section', 'mw-win mw-win1', desk);
      const t1 = u.el('div', 'mw-title', win);
      u.el('span', 'mw-ico', t1).innerHTML = PEOPLE;
      u.el('span', 'mw-ttl', t1, 'Employee Setup');
      winButtons(u, t1);
      const body = u.el('div', 'ds-body', win);
      const rail = u.el('aside', 'mw-side', body);
      ['Employees', 'Departments', 'Office Locations', 'IT Access', 'Review'].forEach((t, i) =>
        u.el('div', 'mw-nav' + (i ? '' : ' on'), rail, t),
      );
      const content = u.el('div', 'ds-content', body);
      u.el('h1', 'mw-h1', content, 'Add New Employee');
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
        u.el('div', 'ds-instruction' + (ctx.instruction.length > 70 ? ' long' : ''), b, ctx.instruction);
        return b;
      }
      if (mode === 'top') briefing(content, 'ds-header-note');
      if (mode === 'panel') briefing(nb, 'ds-panel-note');
      if (mode === 'toast') briefing(rail, 'ds-toast');
      const main = u.el('div', 'ds-main', content);
      function row(label, val, kind) {
        const r = u.el('div', 'mw-row', main);
        u.el('span', 'mw-lab', r, label);
        const f = u.el('div', 'mw-fld' + (kind ? ' ' + kind : ''), r);
        u.el('span', '', f, val);
        if (kind === 'sel') u.el('i', 'mw-chev', f).innerHTML = CHEV;
        if (kind === 'date') u.el('i', 'mw-cal', f).innerHTML = CAL;
      }
      row('First name', 'Jordan');
      row('Last name', 'Patel');
      row('Department', 'Engineering', 'sel');
      const stage = u.el('main', 'ds-stage', main);
      row('Job title', 'Software Engineer');
      row('Start date', '4/22/2013', 'date');
      const foot = u.el('footer', 'ds-footer', content);
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const labels = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = er.bool(0.5);
      const placement = referenceEnd ? 'footer' : er.pick(['toolbar', 'link']);
      const label = referenceEnd ? 'Submit' : er.pick(labels.filter((x) => x !== 'Submit'));
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(
          'button',
          placement === 'toolbar'
            ? 'ds-submit ds-end-toolbar'
            : placement === 'link'
              ? 'ds-submit ds-end-link'
              : 'ds-submit',
          placement === 'toolbar' ? t1 : foot,
          label,
        );
        if (placement === 'toolbar') t1.insertBefore(submit, t1.querySelector('.mw-btns'));
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', () => ctx.submit());
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const choices = labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (choices.length) {
          const text = cr.pick(choices);
          const decoy = u.el('button', 'ds-end-xtra', foot, text);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
      }
      const cancel = u.el('button', 'ds-travel-cancel', foot, 'Cancel');
      cancel.type = 'button';
      cancel.dataset.role = 'xtra';
      cancel.addEventListener('click', () => env.log('decoy', { label: 'Cancel' }));
      const bar = u.el('footer', 'mw-task', document.body);
      u.el('span', 'mw-start', bar).innerHTML = WIN;
      [
        ['Employee Setup', PEOPLE, 'on'],
        ['Quick Notes', NOTE, ''],
        ['File Explorer', FOLDER, ''],
      ].forEach((a) => {
        const b = u.el('span', 'mw-tb ' + a[2], bar);
        u.el('i', '', b).innerHTML = a[1];
        u.el('span', '', b, a[0]);
      });
      u.el('span', 'mw-sp', bar);
      u.el('span', 'mw-tray-icons', bar).innerHTML =
        '<svg viewBox="0 0 28 28"><g fill="none" stroke="white" stroke-width="1.4"><path d="M3 4h23v16H3zM14 20v5M8 25h12M5 7h2v3H5zM5 12h2v3H5z"/></g></svg><svg viewBox="0 0 28 28"><path d="M2 10h5l6-5v18l-6-5H2z" fill="white"/><path d="M17 9q6 5 0 10M20 5q10 9 0 18M23 2q12 12 0 24" fill="none" stroke="white" stroke-width="1.4"/></svg>';
      const tray = u.el('span', 'mw-tray', bar);
      u.el('span', '', tray, '10:24 AM');
      u.el('span', '', tray, '4/22/2013');
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
