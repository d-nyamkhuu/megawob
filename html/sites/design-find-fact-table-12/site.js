(function () {
  'use strict';
  const C = { 'site': 'design-find-fact-table-12', 'title': 'Research Records — Data Lookup' };
  const ICON_DOC =
    '<svg viewBox="0 0 44 54" width="100%" height="100%"><defs><linearGradient id="docblue" x2="0" y2="1"><stop stop-color="#49acf0"/><stop offset="1" stop-color="#289ae8"/></linearGradient></defs><path d="M4 1h24l14 14v35q0 3-3 3H4q-3 0-3-3V4q0-3 3-3" fill="url(#docblue)"/><path d="M28 1l14 14H28z" fill="#a2d6f5"/><path d="M10 23h23M10 31h23M10 39h15" stroke="#fff" stroke-width="2.5"/></svg>';
  const ICON_TASK =
    '<svg viewBox="0 0 48 60" width="100%" height="100%"><rect x="1" y="1" width="46" height="58" rx="4" fill="#219bfa" stroke="#0789ef"/><path d="M10 14h28M10 24h28M10 34h28M10 44h18" stroke="#fff" stroke-width="4"/></svg>';
  const ICON_WARN =
    '<svg viewBox="0 0 56 54" width="100%" height="100%"><defs><linearGradient id="warnorange" x2="0" y2="1"><stop stop-color="#e8b15d"/><stop offset="1" stop-color="#e99123"/></linearGradient></defs><path d="M24 4q4-6 8 0l23 44q2 5-4 5H5q-6 0-4-5z" fill="url(#warnorange)" stroke="#da942f"/><path d="M26 18h4l-1 17h-2z" fill="#fff"/><circle cx="28" cy="42" r="2.7" fill="#fff"/></svg>';
  const ICON_INFO =
    '<svg viewBox="0 0 24 24" width="100%" height="100%"><circle cx="12" cy="12" r="11" fill="#2f8be6"/><rect x="11" y="10" width="2" height="8" fill="#fff"/><rect x="11" y="6" width="2" height="2.4" fill="#fff"/></svg>';
  const KDE =
    '<svg viewBox="0 0 26 28" width="100%" height="100%"><path d="M11 3v22M12 14L22 3M13 13l10 12" stroke="#fff" stroke-width="3.7" fill="none"/><g fill="#fff"><circle cx="5" cy="7" r="2"/><circle cx="4" cy="14" r="2"/><circle cx="5" cy="21" r="2"/><path d="M8 2h3v4H8zM8 23h3v4H8z"/></g></svg>';
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    initialOverlay: { kind: 'banner' },
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const endRng = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = !endRng.bool(0.5);
      const placement = referenceEnd ? 'form' : endRng.pick(['header', 'footer']);
      const endLabel = referenceEnd ? 'Submit' : endRng.pick(endLabels);
      const collideRng = ctx.rng.fork('chrome/collide');
      const collideLabels = endLabels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
      const collideLabel = collideRng.bool(0.3) && collideLabels.length ? collideRng.pick(collideLabels) : null;
      const bar = u.el('header', 'ds-menubar', document.body);
      const k = u.el('span', 'ds-kde', bar);
      k.innerHTML = KDE;
      ['File', 'Edit', 'View', 'Tools', 'Settings', 'Help'].forEach((t) => u.el('span', 'ds-mi', bar, t));
      const tray = u.el('span', 'ds-tray', bar);
      tray.innerHTML =
        '<svg viewBox="0 0 116 24" width="116" height="24" fill="none" stroke="#163450" stroke-width="2"><path d="M2 3h18v13H2zM11 16v4M6 20h10"/><path d="M48 8h4l6-5v18l-6-5h-4z" fill="#244a6c"/><path d="M62 7q4 5 0 10M66 4q6 8 0 16"/><path d="M91 8q10-8 20 0M94 12q7-6 14 0M97 16q4-4 8 0"/><circle cx="101" cy="20" r="1" fill="#163450"/></svg>';
      u.el('span', 'ds-clock', bar, 'Tue Apr 24, 2018  10:14 AM');
      const win = u.el('div', 'ds-window', document.body);
      const tb = u.el('div', 'ds-titlebar', win);
      const ti = u.el('span', 'ds-ticon', tb);
      ti.innerHTML = ICON_DOC;
      u.el('span', 'ds-ttext', tb, C.title);
      const wb = u.el('span', 'ds-wbtn', tb);
      wb.innerHTML =
        '<i><svg viewBox="0 0 24 24"><path d="m6 6 6 6 6-6M6 12l6 6 6-6"/></svg></i><i><svg viewBox="0 0 24 24"><path d="M5 18h14"/></svg></i><i><svg viewBox="0 0 24 24"><path d="M5 5h14v14H5zM5 7h14"/></svg></i><b><svg viewBox="0 0 24 24"><path d="m5 5 14 14M5 19 19 5"/></svg></b>';
      // Keep the warning's reserved space stable when its kit-owned overlay is dismissed.
      u.el('div', 'ds-banner-slot', win);
      const card = u.el('div', 'ds-card', win);
      const head = u.el('div', 'ds-head', card);
      const hi = u.el('span', 'ds-hicon', head);
      hi.innerHTML = ICON_DOC;
      const ht = u.el('div', '', head);
      u.el('div', 'ds-h1', ht, 'Research Records');
      u.el('div', 'ds-h2', ht, 'Look up the requested information in the table below.');
      const body = u.el('div', 'ds-body', card);
      const content = u.el('div', 'ds-content', body);
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel' && document.documentElement.clientWidth >= 1180
              ? 'left'
              : 'top';
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls !== 'ds-header-note' && cls !== 'ds-toast') {
        }
        const ic = u.el('span', 'ds-iicon', b);
        ic.innerHTML = ICON_TASK;
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'top') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (mode === 'left' || mode === 'right') {
        briefing(main, 'ds-brief');
      }
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', card);
      const fi = u.el('span', 'ds-finfo', foot);
      fi.innerHTML = ICON_INFO;
      u.el(
        'span',
        'ds-ftext',
        foot,
        ctx.spec.answerBy === 'reply'
          ? 'Look up the value in the table and report it exactly as shown.'
          : 'Look up the value in the table and enter it exactly as shown.',
      );
      let submit = null;
      if (!ctx.finish) {
        submit = u.el('button', 'ds-submit', placement === 'header' ? head : foot, endLabel);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', () => ctx.submit());
      }
      if (collideLabel) {
        const decoy = u.el('button', 'ds-xtra', tb, collideLabel);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        tb.insertBefore(decoy, wb);
        decoy.addEventListener('click', () => env.log('decoy', { label: collideLabel, collide: true }));
      }
      u.el('span', 'ds-ready', foot, 'Ready');
      const tk = u.el('div', 'ds-taskbar', document.body);
      const tk1 = u.el('span', 'ds-tkde', tk);
      tk1.innerHTML = KDE;
      const t1 = u.el('span', 'ds-task active', tk);
      const t1i = u.el('i', '', t1);
      t1i.innerHTML = ICON_DOC;
      u.el('span', '', t1, C.title);
      const t2 = u.el('span', 'ds-task', tk);
      u.el('i', 'ds-folder', t2);
      u.el('span', '', t2, 'Home');
      const tktray = u.el('span', 'ds-task-tray', tk);
      tktray.innerHTML =
        '<svg viewBox="0 0 65 28"><g fill="none" stroke="currentColor" stroke-width="1.4"><path d="M7 6h16v16H7zM12 2v4M18 2v4M12 22v4M18 22v4M3 11h4M3 17h4M23 11h4M23 17h4M46 18l7-7 7 7"/></g></svg>';
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      if (ctx.initial || ctx.kind === 'banner') {
        const el = u.el('section', 'ds-banner', document.querySelector('.ds-banner-slot'));
        el.dataset.role = 'overlay';
        const bi = u.el('span', 'ds-bicon', el);
        bi.innerHTML = ICON_WARN;
        const bt = u.el('div', 'ds-btext', el);
        u.el('div', 'ds-bt1', bt, 'Unsaved layout changes');
        u.el(
          'div',
          'ds-bt2',
          bt,
          'You have unsaved changes to the layout. If you continue, your layout changes will be kept for this session but not saved permanently.',
        );
        const dismiss = u.el('button', 'ds-continue', el, 'Continue without saving');
        dismiss.type = 'button';
        dismiss.addEventListener('click', () => ctx.dismiss('continue'));
        const close = u.el('button', 'ds-bclose', el, '✕');
        close.type = 'button';
        close.setAttribute('aria-label', 'Dismiss warning');
        close.addEventListener('click', () => ctx.dismiss('close'));
        return { el, dismiss };
      }
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
