(function () {
  'use strict';
  const C = { 'site': 'design-type-text-single-12' };
  const APPLE =
    '<svg width="24" height="26" viewBox="0 0 18 20"><defs><linearGradient id="appleBlue" x2="0" y2="1"><stop stop-color="#09398c"/><stop offset=".65" stop-color="#1678ef"/><stop offset="1" stop-color="#76bcff"/></linearGradient></defs><path d="M9 5c1-2 2-3 4-3 0 2-1 3-4 3zM9 6c-2-1-6 0-6 5s3 8 5 8c1 0 1-.5 2-.5s1 .5 2 .5c2 0 4-3 4-5-2-1-3-4 0-6-1-2-4-3-7-2z" fill="url(#appleBlue)" stroke="#1c56ad" stroke-width=".4"/></svg>';
  const INFO =
    '<svg width="40" height="40" viewBox="0 0 40 40"><defs><radialGradient id="ig" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#8fd0ff"/><stop offset="1" stop-color="#1366d6"/></radialGradient></defs><circle cx="20" cy="20" r="18" fill="url(#ig)" stroke="#0b4aa8" stroke-width="2"/><circle cx="20" cy="11" r="2.6" fill="#fff"/><rect x="17.5" y="16" width="5" height="14" rx="1.5" fill="#fff"/></svg>';
  const WARN =
    '<svg width="84" height="84" viewBox="0 0 84 84"><defs><linearGradient id="warningGold" x2="0" y2="1"><stop stop-color="#ffda49"/><stop offset="1" stop-color="#f4bd16"/></linearGradient></defs><path d="M36 8 Q42 -1 48 8 L81 70 Q86 80 76 80 H8 Q-2 80 3 70 Z" fill="url(#warningGold)" stroke="#c69b28" stroke-width="1.5"/><path d="M36 25 Q42 17 48 25 L46 51 Q42 59 38 51 Z" fill="#161300"/><circle cx="42" cy="66" r="5.4" fill="#161300"/></svg>';
  function lights(parent, u) {
    const l = u.el('span', 'ds-lights', parent);
    ['r', 'y', 'g'].forEach((c) => u.el('i', 'ds-l ds-l-' + c, l));
    return l;
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
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = er.bool(0.5);
      const placement = referenceEnd ? 'footer' : er.pick(['toolbar', 'link']);
      const endLabel = referenceEnd ? 'Submit' : er.pick(endLabels);
      const cr = ctx.rng.fork('chrome/collide');
      const alternatives = endLabels.filter((label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase());
      const collide = cr.bool(0.3) && alternatives.length ? cr.pick(alternatives) : null;
      const decoyBtn = (parent, label, collides = false) => {
        const b = u.el('button', 'ds-btn', parent, label);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', collides ? { label, collide: true } : { label }));
        return b;
      };
      const bar = u.el('header', 'ds-menubar', document.body);
      u.el('span', 'ds-apple', bar).innerHTML = APPLE;
      u.el('b', '', bar, 'Document Editor');
      ['File', 'Edit', 'Format', 'Window', 'Help'].forEach((t) => u.el('span', '', bar, t));
      const ic = u.el('span', 'ds-icons', bar);
      ic.innerHTML =
        '<svg width="26" height="18" viewBox="0 0 26 18"><path d="M2 6h4l5-4v14l-5-4H2z" fill="#222"/><path d="M14 6q3 3 0 6M17 4q5 5 0 10" fill="none" stroke="#222" stroke-width="1.6"/></svg><svg width="30" height="16" viewBox="0 0 30 16"><rect x="1" y="2" width="24" height="12" rx="3" fill="none" stroke="#222" stroke-width="1.6"/><rect x="3.5" y="4.5" width="19" height="7" fill="#222"/><rect x="26" y="6" width="3" height="4" fill="#222"/></svg>';
      u.el('span', 'ds-clock', bar, 'Mon Apr 16  10:24 AM');
      u.el('span', 'ds-search', bar).innerHTML =
        '<svg width="20" height="20" viewBox="0 0 20 20"><circle cx="8" cy="8" r="5.5" fill="none" stroke="#222" stroke-width="2"/><path d="M12 12l6 6" stroke="#222" stroke-width="2.4"/></svg>';
      const win = u.el('div', 'ds-win', document.body);
      const tb = u.el('div', 'ds-titlebar', win);
      lights(tb, u);
      u.el('span', 'ds-wtitle', tb, 'Document Editor');
      const mode = ctx.display === 'panel' && win.getBoundingClientRect().width < 1240 ? 'header' : ctx.display;
      let note = null;
      if (mode !== 'hidden') {
        note = u.el('aside', 'ds-info ds-info-' + mode, win);
        u.el('span', 'ds-info-ic', note).innerHTML = INFO;
        u.el('div', 'ds-instruction', note, ctx.instruction);
      }
      let boardHost = win;
      if (mode === 'panel') {
        boardHost = u.el('div', 'ds-panel-layout', win);
        boardHost.append(note);
      }
      const board = u.el('div', 'ds-board', boardHost);
      const head = u.el('div', 'ds-bhead', board);
      u.el('h1', '', head, 'Create Note');
      u.el('span', '', head, 'Untitled Note');
      const r1 = u.el('div', 'ds-row', board);
      u.el('label', '', r1, 'Title:');
      u.el('div', 'ds-fake', r1, 'Project Notes');
      const stage = u.el('main', 'ds-stage', board);
      const r3 = u.el('div', 'ds-row ds-cat', board);
      u.el('label', '', r3, 'Category:');
      const sel = u.el('div', 'ds-fake ds-sel', r3, 'General');
      u.el('i', '', sel);
      const r4 = u.el('div', 'ds-row ds-notes', board);
      u.el('label', '', r4, 'Notes:');
      const notes = u.el('div', 'ds-fake ds-ta', r4, 'Add any additional notes here...');
      const scroll = u.el('span', 'ds-scroll', notes);
      u.el('i', 'ds-scroll-up', scroll);
      u.el('i', 'ds-scroll-down', scroll);
      const foot = u.el('footer', 'ds-footer', win);
      decoyBtn(foot, 'Clear');
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'toolbar' ? tb : foot;
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          placement === 'link'
            ? 'ds-endlink'
            : 'ds-btn ds-primary ds-submit' + (placement === 'toolbar' ? ' ds-toolbar-end' : ''),
          parent,
          endLabel,
        );
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      // Keep the reference's primary end control at the right edge of the footer.
      if (submit && placement === 'footer') submit.remove();
      u.el('span', 'ds-sp', foot);
      if (collide) decoyBtn(foot, collide, true);
      decoyBtn(foot, 'Save Draft');
      if (submit && placement === 'footer') foot.append(submit);
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const t = u.el('div', 'ds-dtitle', el);
      lights(t, u);
      u.el('span', '', t, ctx.kind === 'banner' ? 'Unsaved Changes' : 'Notice');
      const body = u.el('div', 'ds-dbody', el);
      u.el('span', 'ds-warn', body).innerHTML = WARN;
      const tx = u.el('div', 'ds-dtext', body);
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
      };
      let dismiss;
      if (ctx.kind === 'banner') {
        u.el('b', '', tx, 'Unsaved layout changes.');
        const warning = u.el('p', '', tx, 'You have uncommitted layout changes.');
        u.el('br', '', warning);
        warning.append(document.createTextNode('Do you want to continue without saving?'));
        u.el('p', 'ds-dmuted', tx, 'Your note content will be preserved.');
        const row = u.el('div', 'ds-dbtns', el);
        const c = u.el('button', 'ds-btn', row, 'Cancel');
        c.type = 'button';
        c.addEventListener('click', () => ctx.dismiss('close'));
        dismiss = u.el('button', 'ds-btn ds-primary', row, 'Continue without saving');
        dismiss.type = 'button';
      } else {
        u.el('p', '', tx, texts[ctx.kind] || '');
        const row = u.el('div', 'ds-dbtns', el);
        dismiss = u.el('button', 'ds-btn ds-primary', row, 'Close');
        dismiss.type = 'button';
      }
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
