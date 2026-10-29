(function () {
  'use strict';
  const C = {
    'site': 'design-set-date-range-06',
    'brand': 'Event Planner',
    'instruction': 'top',
    'rail': '',
    'menu': 'Plan|Organize|Coordinate',
    'tabs': 'Overview|Events|Contacts|Reports',
    'events': [
      ['Aug 10, 2023', 'Team Meeting', 'Conference Room', 'Confirmed'],
      ['Aug 18, 2023', 'Project Review', 'Main Office', 'Tentative'],
      ['Aug 25, 2023', 'Client Workshop', 'East Hall', 'Confirmed'],
      ['Sep 12, 2023', 'Strategy Session', 'Conference Room', 'Planned'],
    ],
    'details': [
      ['Event:', 'Project Review'],
      ['Date:', 'Aug 18, 2023'],
      ['Location:', 'Main Office'],
      ['Attendees:', '8'],
      ['Notes:', 'Discuss project milestones and next steps.'],
    ],
    'briefTitle': 'Your Task',
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
      const logo = u.el('span', 'ds-logo', top);
      for (let i = 0; i < 9; i++) u.el('i', i % 4 === 0 ? 'd' : '', logo);
      u.el('span', 'ds-brand', top, C.brand);
      const nav = u.el('nav', 'ds-menu', top);
      C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      const tabs = u.el('div', 'ds-tabs', top);
      C.tabs.split('|').forEach((t, i) => u.el('span', i === 0 ? 'on' : '', tabs, t));
      const over = u.el('section', 'ds-over', document.body);
      const up = u.el('div', 'ds-up', over);
      u.el('h3', '', up, 'Upcoming Events');
      const tb = u.el('table', '', up);
      const hr = u.el('tr', '', tb);
      ['Date', 'Event', 'Location', 'Status'].forEach((t) => u.el('th', '', hr, t));
      C.events.forEach((r) => {
        const tr = u.el('tr', '', tb);
        r.forEach((t, i) => {
          const td = u.el('td', i === 3 ? 'st-' + t.toLowerCase() : '', tr, t);
        });
      });
      const qd = u.el('div', 'ds-qd', over);
      u.el('h3', '', qd, 'Quick Details');
      const qb = u.el('dl', '', qd);
      C.details.forEach((r) => {
        u.el('dt', '', qb, r[0]);
        u.el('dd', '', qb, r[1]);
      });
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
      const sched = u.el('div', 'ds-sched', content);
      u.el('h2', '', sched, 'Schedule a New Event');
      const steps = u.el('div', 'ds-steps', sched);
      ['Date & Time', 'Event Details', 'Confirmation'].forEach((t, i) => u.el('span', i === 0 ? 'on' : '', steps, t));
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
      const clr = u.el('button', 'ds-clear', foot, 'Clear');
      clr.type = 'button';
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endWords = ctx.content.END_LABELS.map(labelOf);
      const er = ctx.rng.fork('chrome/end');
      const placement = er.pick(['footer', 'toolbar', 'footer', 'link']);
      const classic = placement === 'footer';
      const endLabel = classic ? 'Submit' : er.pick(endWords.filter((x) => x !== 'Submit'));
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'toolbar' ? u.el('div', 'ds-end-tools', sched) : foot;
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          placement === 'link' ? 'ds-endlink' : 'ds-submit',
          parent,
          endLabel,
        );
        if (submit.tagName === 'BUTTON') submit.type = 'button';
        else submit.href = '#';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const label = cr.pick(endWords.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase()));
        const decoy = u.el('button', 'ds-xtra', qd, label);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
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
