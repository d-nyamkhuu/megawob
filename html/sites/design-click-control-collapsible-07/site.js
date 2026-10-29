(function () {
  'use strict';
  const cfg = {
    'title': 'Learnbase',
    'theme': 'flash',
    'layout': 'palette',
    'tools': 'Home         Activities         Resources         Help',
    'rail': 'Getting Started|Learning Modules|Practice|My Progress|Settings',
    'side': 'Quick Notes|Follow the instructions and click the link.',
  };
  env.site({
    name: 'design-click-control-collapsible-07',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref forum split';
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      u.el('div', 'title', head, 'Project Library');
      const acct = u.el('div', 'acct', head);
      acct.innerHTML = '<a>Help</a><i>|</i><a>My Account</a><i>|</i><a>Sign Out</a>';
      const ov = u.el('section', 'overview', shell);
      const l = u.el('div', 'ov-l', ov);
      u.el('h2', '', l, 'Riverdale Community Project');
      [
        ['Project ID:', 'RCP-1042'],
        ['Status:', 'In Progress'],
        ['Owner:', 'Taylor Kim'],
        ['Last Updated:', 'Apr 12, 2003'],
      ].forEach((r) => {
        const d = u.el('div', 'ov-row', l);
        u.el('b', '', d, r[0]);
        u.el('span', '', d, r[1]);
      });
      const r = u.el('div', 'ov-r', ov);
      u.el('h3', '', r, 'Project Summary');
      u.el(
        'p',
        '',
        r,
        'The Riverdale Community Project aims to improve local parks, expand volunteer opportunities, and provide resources for neighborhood initiatives. This page contains key project information, links, and notes for team members.',
      );
      const taskbar = u.el('div', 'taskbar', shell);
      u.el('span', 'taskbar-label', taskbar, 'Your Task');
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      const display = ctx.display || 'header';
      const note = u.el('div', 'instruction', center, ctx.instruction);
      note.dataset.display = display;
      note.hidden = display === 'hidden';
      if (display === 'panel') {
        const panel = u.el('aside', 'task-panel', work);
        u.el('h3', '', panel, 'Your Task');
        u.el('p', '', panel, ctx.instruction);
        note.hidden = true;
      }
      if (display === 'toast') {
        const toast = u.el('div', 'task-toast', center, ctx.instruction);
        note.hidden = true;
      }
      const stage = u.el('div', 'stage', center);
      const foot = u.el('footer', 'footer', shell);
      if (ctx.finish) u.el('span', 'footer-status', foot, 'Project records are up to date.');
      const er = ctx.rng.fork('chrome/end');
      const baseline = !ctx.finish && er.bool(0.5);
      const placements = ['taskbar', 'footer', 'link'];
      const placement = ctx.finish ? null : baseline ? 'footer' : er.pick(placements);
      const ends = (ctx.content && ctx.content.END_LABELS) || [
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
      const label = baseline ? 'Submit' : String(er.pick(ends));
      let submit = null;
      const decoyBtn = (parent, text, collide) => {
        const b = u.el('button', 'xtra-btn', parent, text);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', collide ? { label: text, collide: true } : { label: text }));
        return b;
      };
      if (!ctx.finish) {
        const rs = u.el('button', 'reset', foot, 'Reset');
        rs.type = 'button';
        rs.addEventListener('click', () => env.log('decoy', { label: 'Reset' }));
        const end = (parent, cls, text) => {
          const b = u.el(cls === 'end-link' ? 'a' : 'button', cls, parent, text);
          if (b.tagName === 'BUTTON') b.type = 'button';
          else b.href = '#';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
          return b;
        };
        if (placement === 'footer') submit = end(foot, 'submit', label);
        else if (placement === 'taskbar') submit = end(taskbar, 'submit taskbar-end', label);
        else submit = end(foot, 'end-link', label + ' ›');
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const pool = ends
            .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))
            .filter((x) => String(x).toLowerCase() !== label.toLowerCase());
          if (pool.length) decoyBtn(placement === 'footer' ? taskbar : foot, String(cr.pick(pool)), true);
        }
      }
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
