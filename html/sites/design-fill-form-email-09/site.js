(function () {
  'use strict';
  function icon(t) {
    const paper =
      '<path d="M5 2H16L21 7V23H5Z" fill="#f5f6fa" stroke="#536580"/><path d="M16 2V7H21M8 10H17M8 13H17M8 16H14" fill="none" stroke="#91a4bc"/>';
    const envelope =
      '<path d="M2 8L12 3L21 9V21H2Z" fill="#f2ecbe" stroke="#647089"/><path d="M2 9L11 15L21 9M2 21L9 14M21 21L14 14" fill="none" stroke="#7a8298"/>';
    let body = paper;
    if (t === 'Delete') body = '<path d="M3 3L21 22M21 3L3 22" stroke="#1e2e41" stroke-width="3"/>';
    else if (t === 'Print')
      body =
        '<path d="M6 2H18V10H6Z" fill="white" stroke="#546176"/><path d="M3 9H21V20H3Z" fill="#b6c0d2" stroke="#546176"/><path d="M7 16H18V24H7Z" fill="white" stroke="#546176"/><path d="M9 19H16M9 21H16" stroke="#758399"/><circle cx="18" cy="12" r="1" fill="#4365ad"/>';
    else if (t.includes('Reply') || t === 'Forward')
      body =
        envelope +
        '<path d="' +
        (t === 'Forward' ? 'M10 15H19V11L25 17L19 23V19H10Z' : 'M16 15H7V11L1 17L7 23V19H16Z') +
        '" fill="' +
        (t === 'Forward' ? '#54a7d6' : '#7587bb') +
        '" stroke="#3b5378"/>' +
        (t === 'Reply All' ? '<path d="M13 5L8 1L3 5" fill="none" stroke="#d779a0" stroke-width="2"/>' : '');
    else if (t === 'Move...')
      body = paper + '<path d="M12 12H20V8L25 15L20 21V17H12Z" fill="#718bb6" stroke="#465d7b"/>';
    return '<svg viewBox="0 0 26 26" aria-hidden="true">' + body + '</svg>';
  }
  const C = {
    'site': 'design-fill-form-email-09',
    'brand': 'Mail and Tasks',
    'title': 'Add Contact',
    'instruction': 'right',
    'rail': '',
    'menu': 'File|Edit|View|Tools|Actions|Help',
    'briefTitle': 'Instructions',
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
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const classic = endRng.bool(0.5);
      const placement = classic ? 'footer' : endRng.pick(['toolbar', 'link']);
      const endLabel = classic ? 'Submit' : endRng.pick(endLabels);
      const collideRng = ctx.rng.fork('chrome/collide');
      const collideLabels = endLabels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
      const collideLabel = collideRng.bool(0.3) && collideLabels.length ? collideRng.pick(collideLabels) : null;
      let toolbar = null;
      const top = u.el('header', 'ds-top', document.body);
      const brand = u.el('span', 'ds-brand', top);
      const app = u.el('span', 'qt-appicon', brand);
      app.innerHTML = icon('Reply');
      u.el('span', '', brand, C.brand);
      const win = u.el('div', 'qt-windowbuttons', top);
      ['−', '□', '×'].forEach((t) => u.el('span', '', win, t));
      if (C.menu) {
        const nav = u.el('nav', 'ds-menu', document.body);
        C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
        const tb = u.el('div', 'ds-toolbar', document.body);
        toolbar = tb;
        ['New', 'Reply', 'Reply All', 'Forward', 'Delete', 'Move...', 'Print'].forEach((t) => {
          const tool = u.el('div', 'qt-tool', tb);
          tool.innerHTML = icon(t);
          u.el('span', '', tool, t);
          if (t === 'New' || t === 'Forward') u.el('small', '', tool, '▾');
        });
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
      u.el('span', '', foot, '');
      let submit = null;
      const tools = u.el('div', 'qt-episode-tools', toolbar || foot);
      if (!ctx.finish) {
        const isLink = placement === 'link';
        submit = u.el(
          isLink ? 'a' : 'button',
          'ds-submit' + (placement === 'toolbar' ? ' qt-end-toolbar' : isLink ? ' qt-end-link' : ''),
          placement === 'toolbar' ? tools : foot,
          endLabel,
        );
        if (isLink) submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      if (collideLabel) {
        const decoy = u.el('button', 'qt-end-xtra', tools, collideLabel);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.addEventListener('click', () => env.log('decoy', { label: collideLabel, collide: true }));
      }
      if (!ctx.finish) {
        ['Clear', 'Cancel'].forEach((label) => {
          const decoy = u.el('span', 'ds-fake', foot, label);
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label }));
        });
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
