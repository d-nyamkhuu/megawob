(function () {
  'use strict';
  const IC = {
    mail: '<svg viewBox="0 0 48 48"><path d="M6 11h36v26H6z" fill="#fff"/><path d="m6 12 18 14 18-14M6 37l13-13m23 13L29 24" fill="none" stroke="#f9585f" stroke-width="2.6"/></svg>',
    min: '<svg viewBox="0 0 16 16"><path d="M3 8h10"/></svg>',
    max: '<svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg>',
    close: '<svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg>',
    gear: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.2"/><path d="M12 2.5l1.6 2.6 3-.7.6 3 3 .9-.8 3 2 2.3-2.2 2.1.5 3-3 .6-1.3 2.8-2.8-1.3-2.8 1.3-1.3-2.8-3-.6.5-3-2.2-2.1 2-2.3-.8-3 3-.9.6-3 3 .7z"/></svg>',
    chev: '<svg viewBox="0 0 16 16"><path d="m4 6 4 4 4-4"/></svg>',
    b: '<svg viewBox="0 0 24 24"><path d="M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z"/></svg>',
    i: '<svg viewBox="0 0 24 24"><path d="M10 5h8M6 19h8M14 5l-4 14"/></svg>',
    u: '<svg viewBox="0 0 24 24"><path d="M7 4v7a5 5 0 0 0 10 0V4M5 20h14"/></svg>',
    ul: '<svg viewBox="0 0 24 24"><path d="M9 6h11M9 12h11M9 18h11M4 6h1M4 12h1M4 18h1"/></svg>',
    link: '<svg viewBox="0 0 24 24"><path d="M10 8H7a4 4 0 0 0 0 8h3M14 8h3a4 4 0 0 1 0 8h-3M8 12h8"/></svg>',
    clip: '<svg viewBox="0 0 24 24"><path d="M16 7v9a4 4 0 0 1-8 0V6a2.5 2.5 0 0 1 5 0v10a1 1 0 0 1-2 0V8"/></svg>',
    smile:
      '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M8.5 14a4 4 0 0 0 7 0M9 9.5v1M15 9.5v1"/></svg>',
    img: '<svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="14" rx="1.5"/><path d="m5 17 5-5 3 3 2-2 4 4M9 9.5h.1"/></svg>',
  };
  env.site({
    name: 'design-click-control-button-09',
    styles: ['site.css', 'r9.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'r9';
      const shell = u.el('main', 'r9-shell', document.body);
      const head = u.el('header', 'r9-head', shell);
      const logo = u.el('span', 'r9-logo', head);
      logo.innerHTML = IC.mail;
      const note = u.el('div', 'instruction r9-instr', head, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      const wc = u.el('span', 'r9-wc', head);
      wc.innerHTML = '<i>' + IC.min + '</i><i>' + IC.max + '</i><i>' + IC.close + '</i>';
      const endRng = ctx.rng.fork('chrome/end');
      const endPool = (ctx.content && ctx.content.END_LABELS) || [
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
      const endText = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
      const common = endRng.bool(0.5);
      const endLabel = common ? 'Submit' : endText(endRng.pick(endPool));
      const endPlace = common ? 'footer' : endRng.pick(['header', 'toolbar', 'toolbar', 'footer']);
      const collideRng = ctx.rng.fork('chrome/collide');
      let collision = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const options = [
          ...new Set(endPool.map(endText).filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase())),
        ];
        if (options.length) {
          const places = ['header', 'toolbar', 'footer'].filter((x) => x !== endPlace);
          collision = { label: collideRng.pick(options), place: collideRng.pick(places) };
        }
      }
      const endButton = (parent, cls, label) => {
        const b = u.el('button', cls, parent, label);
        b.type = 'button';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', ctx.submit);
        return b;
      };
      const decoyButton = (parent, label) => {
        const b = u.el('button', 'r9-xtra', parent, label);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        return b;
      };
      let submit = null;
      if (!ctx.finish && endPlace === 'header') submit = endButton(head, 'r9-end-header', endLabel);
      if (collision && collision.place === 'header') decoyButton(head, collision.label);
      const mid = u.el('section', 'r9-mid', shell);
      u.el('h2', 'r9-title', mid, 'New Message');
      const to = u.el('div', 'r9-row r9-to', mid);
      u.el('label', '', to, 'To');
      const tof = u.el('div', 'r9-field', to);
      const chip = u.el('span', 'r9-chip', tof);
      u.el('span', '', chip, 'team@greenfieldco.com');
      const x = u.el('i', '', chip);
      x.innerHTML = IC.close;
      const cc = u.el('span', 'r9-cc', to);
      u.el('span', '', cc, 'Cc');
      u.el('span', '', cc, 'Bcc');
      const sj = u.el('div', 'r9-row r9-sj', mid);
      u.el('label', '', sj, 'Subject');
      u.el('div', 'r9-field', sj, 'Project update');
      const comp = u.el('div', 'r9-compose', mid);
      const body = u.el('div', 'r9-body', comp);
      const msg = u.el('div', 'r9-msg', body);
      [
        'Hi team,',
        '',
        'Here’s a quick update on the project. Let me know if you have any questions.',
        '',
        'Best,',
        'Alex',
      ].forEach((t) => u.el('div', '', msg, t || ' '));
      const stage = u.el('div', 'stage r9-stage', comp);
      const tb = u.el('div', 'r9-tb', comp);
      const font = u.el('span', 'r9-font', tb);
      u.el('span', '', font, 'Sans Serif');
      const ch = u.el('i', '', font);
      ch.innerHTML = IC.chev;
      [['b'], ['i'], ['u'], ['|'], ['ul'], ['ul'], ['|'], ['link'], ['clip'], ['smile'], ['img']].forEach(([k]) => {
        if (k === '|') {
          u.el('span', 'r9-sep', tb);
          return;
        }
        const t = u.el('i', 'r9-ic r9-ic-' + k, tb);
        t.innerHTML = IC[k];
      });
      if (!ctx.finish && endPlace === 'toolbar') submit = endButton(tb, 'r9-end-toolbar', endLabel);
      if (collision && collision.place === 'toolbar') decoyButton(tb, collision.label);
      const foot = u.el('footer', 'r9-foot', shell);
      const set = u.el('span', 'r9-settings', foot);
      const reset = u.el('button', 'reset-task r9-reset', set);
      reset.type = 'button';
      reset.title = 'Settings';
      reset.setAttribute('aria-label', 'Settings');
      reset.innerHTML = IC.gear;
      u.el('span', '', set, 'Settings');
      if (!ctx.finish && endPlace === 'footer') submit = endButton(foot, 'submit r9-submit', endLabel);
      if (collision && collision.place === 'footer') decoyButton(foot, collision.label);
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
