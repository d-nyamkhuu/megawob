(function () {
  'use strict';
  const C = {
    site: 'design-act-in-time-chase-07',
    brand: 'Pointer Tracking Task  -  OS/2 Workplace Shell',
    title: 'Tracking Area',
    instruction: 'top',
    rail: '',
    menu: 'File|Edit|View|Options|Help',
    briefTitle: 'Task Overview',
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
      u.el('span', 'ds-brand', top, C.brand);
      const meta = u.el('div', 'ds-window-meta', top);
      ['−', '□', '×'].forEach((t) => {
        const b = u.el('button', '', meta, t);
        b.type = 'button';
      });
      const nav = u.el('nav', 'ds-menu', document.body);
      C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const mode = ctx.display || 'header';
      const endR = ctx.rng.fork('chrome/end');
      const placement = ctx.finish ? null : endR.pick(['footer', 'footer', 'controls', 'title']);
      const fallback = [
        'Submit',
        'Done',
        'Finish',
        'Continue',
        'Save',
        'OK',
        'Confirm',
        'Apply',
        'Complete',
        "I'm done",
      ];
      const labels = ctx.content && ctx.content.END_LABELS;
      const raw = labels && labels.length ? labels : fallback;
      const labelItem = placement ? endR.pick(raw) : 'Submit';
      const variedLabel =
        typeof labelItem === 'string' ? labelItem : labelItem.label || labelItem.text || labelItem.name || 'Submit';
      const endLabel = placement ? (endR.bool(0.5) ? 'Submit' : variedLabel) : '';
      const natural = C.instruction;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-header-note') {
          const tabs = u.el('div', 'ds-tabs', b);
          ['Task Overview', 'Session Info', 'About'].forEach((t, i) =>
            u.el('div', i ? 'ds-tab' : 'ds-tab active', tabs, t),
          );
          const box = u.el('div', 'ds-overview', b);
          const icon = u.el('div', 'ds-task-icon', box);
          icon.setAttribute('aria-hidden', 'true');
          const copy = u.el('div', 'ds-overview-copy', box);
          u.el('h2', '', copy, C.briefTitle);
          u.el('div', 'ds-instruction', copy, ctx.instruction);
        } else {
          if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle || 'Task');
          u.el('div', 'ds-instruction', b, ctx.instruction);
        }
        return b;
      }
      if (mode === 'header') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (mode === 'panel') {
        const note = briefing(main, 'ds-brief ds-episode-panel');
        note.setAttribute('aria-label', 'Task instructions');
      }
      const stage = u.el('main', 'ds-stage', main);
      u.el('div', 'ds-stage-tab', stage, 'Tracking Area');
      if (mode === 'toast') {
        const note = u.el('aside', 'ds-episode-toast', content);
        u.el('strong', '', note, 'Task Notice');
        u.el('div', 'ds-instruction', note, ctx.instruction);
      }
      const controls = u.el('div', 'ds-app-controls', content);
      ['Start', 'Pause', 'Reset'].forEach((t, i) => {
        const b = u.el('button', i === 0 ? 'disabled' : '', controls, t);
        b.type = 'button';
        if (i === 0) b.disabled = true;
      });
      const makeEnd = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'footer') submit = makeEnd(u.el('footer', 'ds-footer', content), 'ds-submit', endLabel);
        if (placement === 'controls') submit = makeEnd(controls, 'ds-submit ds-submit-controls', endLabel);
        if (placement === 'title') submit = makeEnd(top, 'ds-submit ds-submit-title', endLabel);
      }
      const collideR = ctx.rng.fork('chrome/collide');
      const collide = collideR.bool(0.3);
      if (collide && !ctx.finish) {
        const pool = raw
          .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name))
          .filter((x) => x && x.toLowerCase() !== endLabel.toLowerCase());
        if (pool.length) {
          const label = collideR.pick(pool);
          const where = collideR.pick(['controls', 'title']);
          const parent = where === 'title' ? meta : controls;
          const b = u.el('button', 'ds-xtra', parent, label);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        }
      }
      const taskbar = u.el('div', 'ds-chase-status', document.body);
      u.el('span', '', taskbar, 'OS/2');
      u.el('span', '', taskbar, '◉  Pointer Tracking Task');
      u.el('span', 'ds-clock-label', taskbar, '10:24 AM');
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
