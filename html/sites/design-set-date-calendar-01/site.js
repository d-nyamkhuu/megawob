(function () {
  'use strict';
  const icons = {
    Events: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 2v6M16 2v6M7 14h2M13 14h2M7 18h2M13 18h2"/>',
    Tasks: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="m7 12 3 3 7-8"/>',
    Contacts: '<circle cx="9" cy="7" r="4"/><path d="M2 22v-4c0-5 14-5 14 0v4M17 3c6 0 6 8 1 8M19 14c4 0 4 4 4 8"/>',
    Reports: '<path d="M3 21v-6h5v6M10 21V9h5v12M17 21V3h5v18"/>',
    Settings: '<path d="m10 2 4 0 1 4 3 1 3-1 2 4-3 3v2l3 2-2 4-4-1-3 2-1 3h-4l-1-3-3-2-3 1-2-4 3-2v-2l-3-3 2-4 3 1 3-1z"/><circle cx="12" cy="13" r="4"/>'
  };
  env.site({
    name: 'design-set-date-calendar-01', styles: ['site.css'], scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const body = u.el('div', 'ds-body', document.body);
      u.el('div', 'ds-coral-circle', body);
      u.el('div', 'ds-back-dots', body);
      u.el('div', 'ds-lilac-triangle', body);
      const zig = u.el('div', 'ds-zigzag', body);
      zig.innerHTML = '<svg viewBox="0 0 210 70"><path d="m12 54 37-37 38 37 38-37 38 37 34-36" fill="none" stroke="#ff9691" stroke-width="19" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      const win = u.el('section', 'ds-window', body);
      const sidebar = u.el('aside', 'ds-sidebar', win);
      u.el('div', 'ds-side-coral', sidebar);
      u.el('div', 'ds-brand', sidebar, 'Horizon');
      const nav = u.el('nav', 'ds-nav', sidebar);
      for (const label of Object.keys(icons)) {
        const item = u.el('button', 'ds-nav-item' + (label === 'Events' ? ' active' : ''), nav);
        item.type = 'button';
        item.innerHTML = '<svg viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + icons[label] + '</svg><span>' + label + '</span>';
      }
      u.el('div', 'ds-side-triangle', sidebar);
      u.el('div', 'ds-side-dots', sidebar);
      const content = u.el('div', 'ds-content', win);
      const heading = u.el('header', 'ds-heading', content);
      u.el('div', 'ds-eyebrow', heading, 'Create Event');
      u.el('h1', '', heading, 'Event Details');
      if (ctx.display !== 'hidden') {
        const note = u.el('aside', 'ds-note ds-note-' + ctx.display, content);
        u.el('div', 'ds-instruction', note, ctx.instruction);
      }
      const stage = u.el('main', 'ds-stage', content);
      const foot = u.el('footer', 'ds-footer', content);
      let submit = null;
      const endRng = ctx.rng.fork('chrome/end');
      const endWords = ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
        ? ctx.content.END_LABELS.map(x => typeof x === 'string' ? x : (x.label || x.text || x.name || String(x)))
        : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const endLabel = endRng.bool(0.5) ? 'Submit' : endRng.pick(endWords);
      const placement = ctx.finish ? null : endRng.pick(['footer', 'footer', 'header', 'link']);
      const collideRng = ctx.rng.fork('chrome/collide');
      const collideOptions = [...new Set(endWords)].filter(x => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
      const collide = !ctx.finish && collideOptions.length && collideRng.bool(0.3)
        ? collideRng.pick(collideOptions) : null;
      const decoy = (parent) => {
        if (!collide) return;
        const b = u.el('button', 'ds-xtra', parent, collide);
        b.type = 'button'; b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      };
      if (!ctx.finish) {
        if (placement === 'header') {
          const tools = u.el('div', 'ds-heading-tools', heading);
          decoy(foot);
          submit = u.el('button', 'ds-submit ds-submit-header', tools, endLabel);
        } else {
          if (placement === 'footer' || placement === 'link') decoy(heading);
          if (placement === 'link') {
            submit = u.el('a', 'ds-endlink', foot, endLabel + ' ›');
            submit.href = '#';
          } else {
            submit = u.el('button', 'ds-submit', foot, endLabel);
            submit.type = 'button';
          }
        }
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', endLabel);
        submit.title = endLabel;
        submit.addEventListener('click', (e) => { e.preventDefault(); ctx.submit(); });
      }
      const cancel = u.el('button', 'ds-cancel', foot, 'Cancel');
      cancel.type = 'button';
      const tasks = u.el('aside', 'ds-tasks', body);
      const titlebar = u.el('header', 'ds-task-titlebar', tasks);
      u.el('h2', '', titlebar, 'My Tasks');
      const lights = u.el('div', 'ds-lights', titlebar);
      for (let i = 0; i < 3; i++) u.el('i', '', lights);
      const taskbody = u.el('div', 'ds-task-body', tasks);
      const tabs = u.el('div', 'ds-tabs', taskbody);
      for (const label of ['To Do', 'In Progress', 'Done']) u.el('div', label === 'To Do' ? 'active' : '', tabs, label);
      for (const [label, date] of [['Prepare agenda', '07/20/2027'], ['Send invitations', '07/22/2027'], ['Book room', '07/23/2027'], ['Finalize materials', '07/27/2027']]) {
        const row = u.el('div', 'ds-task-row', taskbody);
        const check = u.el('button', 'ds-task-check', row);
        check.type = 'button'; check.setAttribute('aria-label', label);
        check.addEventListener('click', () => check.classList.toggle('checked'));
        u.el('span', 'ds-task-label', row, label);
        u.el('span', 'ds-task-date', row, date);
      }
      const add = u.el('button', 'ds-add-task', taskbody);
      add.type = 'button'; add.innerHTML = '<span>+</span> Add task';
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = { cookie: 'We use cookies to remember your preferences.', toast: 'Changes synced.', chat: 'Hello. How can we help?', promo: 'Try the new Horizon workspace.', banner: 'Scheduled maintenance tonight.' };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    }
  });
})();
