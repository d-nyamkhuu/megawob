(function () {
  'use strict';
  env.site({
    name: 'design-reorder-items-kanban-07', styles: ['site.css'], scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const endRng = ctx.rng.fork('chrome/end');
      const collideRng = ctx.rng.fork('chrome/collide');
      const endWords = (ctx.content.END_LABELS || ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'])
        .map((x) => typeof x === 'string' ? x : x && (x.label || x.text || x.name) || String(x));
      let display = ctx.display || 'header';
      if (display === 'panel' && window.innerWidth < 1260) display = 'header';
      if (display === 'toast' && (window.innerWidth < 1100 || window.innerHeight < 700)) display = 'header';
      const baseEnd = !ctx.finish && endRng.bool(0.5);
      const placement = ctx.finish ? null : baseEnd ? 'footer' : endRng.pick(['toolbar', 'link']);
      const endLabel = baseEnd ? 'Submit' : (endWords.length ? endRng.pick(endWords) : 'Done');
      let collide = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const choices = [...new Set(endWords)].filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (choices.length) collide = collideRng.pick(choices);
      }
      document.body.className = 'design notebook';
      const head = u.el('div', 'banner', document.body);
      const globe = u.el('div', 'globe', head);
      globe.setAttribute('aria-hidden', 'true');
      const brand = u.el('div', 'brand', head);
      u.el('div', 'brand-name', brand, 'Discovery Library');
      u.el('div', 'brand-sub', brand, 'EXPLORE ▸ LEARN ▸ GROW');
      const tag = u.el('div', 'tagline', head);
      tag.innerHTML = 'A Brighter<br>World of Knowledge';
      const shell = u.el('div', 'shell', document.body);
      const tabs = u.el('nav', 'notebook-tabs', shell);
      for (const name of ['Activities', 'Reference', 'Games', 'About']) {
        const tab = u.el('button', 'notebook-tab' + (name === 'Activities' ? ' active' : ''), tabs, name);
        tab.type = 'button';
        tab.onclick = () => env.log('notebook-tab', { name });
      }
      const margin = u.el('aside', 'margin', document.body);
      const page = u.el('div', 'page', shell);
      for (const corner of ['tl', 'tr', 'bl', 'br']) {
        const ornament = u.el('span', 'page-corner ' + corner, page);
        ornament.setAttribute('aria-hidden', 'true');
      }
      const note = u.el('header', 'task-note', page);
      u.el('div', 'instruction', note, ctx.instruction);
      if (display !== 'header') note.hidden = true;
      const stage = u.el('main', 'stage', page);
      stage.dataset.role = 'stage';
      const instructionsHead = u.el('h2', 'm-head', margin, 'Instructions');
      const mi = u.el('p', 'm-text', margin, ctx.instruction);
      if (display === 'hidden') { mi.hidden = true; instructionsHead.hidden = true; }
      if (display === 'panel') mi.classList.add('instruction-panel');
      if (display !== 'header' && display !== 'panel') mi.hidden = true;
      if (display === 'toast') {
        instructionsHead.hidden = true;
        const toast = u.el('div', 'instruction-toast', margin);
        u.el('div', 'toast-text', toast, ctx.instruction);
        const close = u.el('button', 'note-close', toast, '×');
        close.type = 'button'; close.setAttribute('aria-label', 'Close');
        close.onclick = () => { toast.hidden = true; };
      }
      u.el('hr', 'm-rule', margin);
      u.el('h2', 'm-head act', margin, 'Actions');
      const ol = u.el('ol', 'm-list', margin);
      for (const t of ['Drag a card from the tray.', 'Drop it into the correct column.', 'Repeat until all cards are sorted.']) u.el('li', '', ol, t);
      u.el('hr', 'm-rule', margin);
      const footer = u.el('footer', 'footer', margin);
      let submit = null;
      const makeEnd = (parent, cls, label) => {
        const b = u.el(cls === 'submit-link' ? 'a' : 'button', cls, parent, label);
        if (b.tagName === 'BUTTON') b.type = 'button'; else b.href = '#';
        b.dataset.role = 'submit'; b.setAttribute('aria-label', endLabel); b.title = endLabel;
        b.onclick = (e) => { e.preventDefault(); ctx.submit(); };
        return b;
      };
      let quickTools = null;
      if (!ctx.finish && placement === 'footer') submit = makeEnd(footer, 'submit', endLabel);
      if (!ctx.finish && placement === 'toolbar') {
        quickTools = u.el('div', 'quick-tools', document.body);
        submit = makeEnd(quickTools, 'submit toolbar-submit', endLabel);
      }
      if (!ctx.finish && placement === 'link') {
        const link = u.el('div', 'link-dock', margin);
        submit = makeEnd(link, 'submit-link', `${endLabel} ›`);
      }
      if (collide) {
        const tools = quickTools || u.el('div', 'quick-tools', document.body);
        const decoy = u.el('button', 'pqs-xtra', tools, collide);
        decoy.type = 'button'; decoy.dataset.role = 'xtra';
        decoy.onclick = () => env.log('decoy', { label: collide, collide: true });
      }
      const clear = u.el('button', 'clear', footer, 'Clear All');
      clear.type = 'button';
      clear.onclick = () => env.log('clear-all', {});
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'obstruction obstruction-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const titles = { cookie: 'Privacy notice', toast: 'Changes saved', chat: 'Help', promo: 'Notebook news', banner: 'Notice' };
      u.el('h3', '', box, titles[ctx.kind] || 'Notice');
      u.el('p', '', box, ctx.kind === 'cookie' ? 'Allow optional cookies for this page?' : 'You can close this note to return to the activity.');
      const dismiss = u.el('button', 'dismiss', box, ctx.kind === 'cookie' ? 'Reject optional' : 'Close');
      dismiss.type = 'button'; dismiss.onclick = () => ctx.dismiss('close');
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
    }
  });
})();
