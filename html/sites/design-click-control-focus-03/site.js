(function () {
  'use strict';
  const cfg = {
    title: 'My Notebook',
    date: 'Tue, Apr 12, 2005',
    tabs: ['Notes', 'Tasks', 'Contacts', 'Calendar', 'Files'],
    heading: 'Project Feedback',
    hint: 'Click inside the textbox.',
  };
  env.site({
    name: 'design-click-control-focus-03',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref nb';
      const tabs = u.el('nav', 'nb-tabs', document.body);
      cfg.tabs.forEach((s, i) => u.el('div', 'nb-tab' + (i === 0 ? ' active' : ''), tabs, s));
      const rings = u.el('div', 'nb-rings', document.body);
      for (let i = 0; i < 9; i++) u.el('i', '', rings);
      const page = u.el('main', 'nb-page', document.body);
      const head = u.el('header', 'nb-head', page);
      u.el('h1', '', head, cfg.title);
      u.el('span', 'nb-date', head, cfg.date);
      const note = u.el('div', 'instruction', page);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      const ico = u.el('span', 'nb-doc', note);
      ico.innerHTML =
        '<svg viewBox="0 0 40 52"><path d="M3 2h26l8 8v40H3Z" fill="#fff" stroke="#2a4fa0" stroke-width="2.5"/><path d="M29 2v8h8" fill="#dbe8fb" stroke="#2a4fa0" stroke-width="2"/><path d="M9 18h22M9 24h22M9 30h22M9 36h22M9 42h16" stroke="#6f8fd0" stroke-width="2"/></svg>';
      u.el('span', 'nb-note-text', note, ctx.instruction);
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      if (ctx.display === 'panel') note.classList.add('instruction-panel');
      u.el('h2', 'nb-h2', page, cfg.heading);
      u.el('p', 'nb-hint', page, cfg.hint);
      const stage = u.el('div', 'stage', page);
      let submit = null;
      const foot = u.el('footer', 'nb-foot', page);
      const endR = ctx.rng.fork('chrome/end');
      const collideR = ctx.rng.fork('chrome/collide');
      const ends = (ctx.content && ctx.content.END_LABELS) || [
        'Submit',
        'Done',
        'Finish',
        'Continue',
        'Save',
        'OK',
        'Confirm',
        'Apply',
      ];
      const label = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const endLabel = endR.bool(0.5) ? 'Submit' : label(endR.pick(ends));
      const placement = endR.pick(['footer', 'footer', 'header', 'link']);
      function makeEnd(parent, kind, text) {
        const b = u.el(
          kind === 'link' ? 'a' : 'button',
          kind === 'link' ? 'nb-end-link' : 'submit nb-end-' + kind,
          parent,
          text,
        );
        if (kind === 'link') b.href = '#';
        else b.type = 'button';
        b.title = endLabel;
        b.setAttribute('aria-label', endLabel);
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      }
      if (!ctx.finish) {
        if (placement === 'footer') submit = makeEnd(foot, 'footer', endLabel);
        else if (placement === 'header') submit = makeEnd(head, 'header', endLabel);
        else submit = makeEnd(foot, 'link', endLabel);
      }
      if (collideR.bool(0.3)) {
        const pool = ends.map(label).filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (pool.length) {
          const d = u.el('button', 'nb-xtra', head, collideR.pick(pool));
          d.type = 'button';
          d.addEventListener('click', () => env.log('decoy', { label: d.textContent, collide: true }));
        }
      }
      const clear = u.el('button', 'clear-form', foot, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () =>
        stage.querySelectorAll('input,textarea').forEach((input) => (input.value = '')),
      );
      return { stage, submit };
    },
    overlay(ctx) {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong',
        '',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      ctx.util.el(
        'p',
        '',
        el,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Explore the latest tools.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
