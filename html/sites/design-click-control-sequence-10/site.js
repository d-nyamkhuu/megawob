(function () {
  'use strict';
  // Inline artwork is painted with the frame on every reset; no image decode or load race.
  const desktopSVG =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1672 941" preserveAspectRatio="none"><defs>\n<linearGradient id="desktop-base" x1="0" y1="0" x2="1" y2=".6"><stop stop-color="#2464b5"/><stop offset=".36" stop-color="#3881d0"/><stop offset="1" stop-color="#66aff7"/></linearGradient>\n<linearGradient id="desktop-depth" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#0c459a" stop-opacity=".5"/><stop offset=".65" stop-color="#2d6ec6" stop-opacity="0"/><stop offset="1" stop-color="#1e58b0" stop-opacity=".15"/></linearGradient>\n<linearGradient id="desktop-ray" x1="0" y1="1" x2="1" y2="0"><stop stop-color="#a8deff" stop-opacity=".1"/><stop offset=".3" stop-color="#90d0ff" stop-opacity=".5"/><stop offset="1" stop-color="#a8deff" stop-opacity="0"/></linearGradient>\n<linearGradient id="desktop-wave" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#428bd9"/><stop offset=".5" stop-color="#3c86d6"/><stop offset="1" stop-color="#2264b7"/></linearGradient>\n<filter id="desktop-soft"><feGaussianBlur stdDeviation="8"/></filter>\n<filter id="desktop-haze"><feGaussianBlur stdDeviation="22"/></filter></defs>\n<path fill="url(#desktop-base)" d="M0 0h1672v941H0z"/><path fill="url(#desktop-depth)" d="M0 0h1672v941H0z"/>\n<path fill="url(#desktop-ray)" filter="url(#desktop-soft)" d="M48 941C222 824 410 691 732 545L966 553C627 748 364 856 48 941Z"/>\n<path fill="url(#desktop-ray)" filter="url(#desktop-haze)" d="M55 941C467 775 853 751 1672 916V941C1005 808 648 808 55 941Z"/>\n<path fill="url(#desktop-wave)" d="M0 941C401 887 684 780 1020 830S1444 923 1672 939V941Z"/>\n<path fill="none" stroke="#a1d7ff" stroke-opacity=".35" stroke-width="8" filter="url(#desktop-soft)" d="M54 941C448 874 703 784 1020 830S1450 924 1672 939"/>\n<path fill="url(#desktop-ray)" filter="url(#desktop-soft)" d="M108 941C349 845 499 799 739 763L850 784C587 842 425 868 108 941Z"/>\n<path fill="#a2d9fa" opacity=".1" d="M305 60 375 34h49l-80 26Zm474 0 50-26h30l-48 26Z"/>\n</svg>';
  const dockSVG =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 680 96" preserveAspectRatio="none"><defs><linearGradient id="aq-tray" x2="0" y2="1"><stop stop-color="#b2d8fa" stop-opacity=".52"/><stop offset=".7" stop-color="#c5e1f8" stop-opacity=".64"/><stop offset="1" stop-color="#dceefb" stop-opacity=".9"/></linearGradient></defs><path d="M30 2H650Q658 2 661 14L679 95H1L19 14Q22 2 30 2Z" fill="url(#aq-tray)" stroke="#d1e6fb" stroke-opacity=".75" stroke-width="2"/><path d="M17 80H664L678 95H2Z" fill="#e4f3ff" opacity=".12"/><g transform="translate(33 6) scale(.95 1.02)"><defs><linearGradient id="aq-blue" x2="0" y2="1"><stop stop-color="#d3f3ff"/><stop offset=".5" stop-color="#509ee6"/><stop offset="1" stop-color="#1760b6"/></linearGradient><linearGradient id="aq-metal" x2="1" y2="1"><stop stop-color="#fff"/><stop offset=".5" stop-color="#b6c6d4"/><stop offset="1" stop-color="#eef7ff"/></linearGradient><linearGradient id="aq-paper" x2="0" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#dadfdb"/></linearGradient><linearGradient id="aq-music" x2="1" y2="1"><stop stop-color="#c6f0ff"/><stop offset=".5" stop-color="#31a5e5"/><stop offset="1" stop-color="#6c49bd"/></linearGradient><radialGradient id="aq-lens"><stop stop-color="#72bad7"/><stop offset=".5" stop-color="#152a3c"/><stop offset=".8" stop-color="#01070d"/><stop offset="1" stop-color="#73919a"/></radialGradient><filter id="aq-s" x="-40%" y="-30%" width="180%" height="180%"><feDropShadow dx="0" dy="3" stdDeviation="2" flood-opacity=".4"/></filter><pattern id="aq-mesh" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M0 0l5 5M5 0L0 5" fill="none" stroke="#425b6b" stroke-width=".8"/></pattern></defs>\n<g opacity=".18" fill="#e5f6ff"><ellipse cx="47" cy="85" rx="28" ry="4"/><ellipse cx="134" cy="85" rx="25" ry="4"/><ellipse cx="222" cy="85" rx="25" ry="4"/><ellipse cx="312" cy="85" rx="25" ry="4"/><ellipse cx="397" cy="85" rx="25" ry="4"/><ellipse cx="484" cy="85" rx="25" ry="4"/></g>\n<g id="aq-dock-art" filter="url(#aq-s)"><g transform="translate(14 12)"><path fill="url(#aq-blue)" stroke="#d6efff" d="M0 0h58v55H0z"/><path fill="#e4f3ff" d="M30 0h28v55H27l4-18h-9Z"/><path fill="none" stroke="#0b1830" stroke-width="2" d="M12 9v9m33-9v9M31-5l-9 33h15l-3 36M9 36q20 14 41-1"/><path fill="white" opacity=".2" d="M1 1h55v20Q24 11 1 25Z"/></g>\n<g transform="translate(105 9)"><path d="m26 0 2-6 5 1 1 5" fill="url(#aq-metal)" stroke="#6c7f93"/><circle cx="30" cy="31" r="31" fill="url(#aq-metal)" stroke="#6c7f93"/><circle cx="30" cy="31" r="27" fill="#154c9a" stroke="white"/><circle cx="30" cy="31" r="25" fill="url(#aq-blue)"/><g stroke="#edf8ff"><path d="M30 7v5m0 38v5M6 31h5m38 0h5M13 14l4 4m27 26 4 4M13 48l4-4m27-26 4-4M20 9l2 4M40 9l-2 4M8 21l4 2M8 41l4-2M20 53l2-4M40 53l-2-4M52 21l-4 2M52 41l-4-2"/><path d="M30 8v46M7 31h46" opacity=".4"/></g><path d="m45 12-12 23-18 15 12-23Z" fill="#f2f3ef" stroke="#476687" stroke-width=".6"/><path d="m45 12-12 23-6-8Z" fill="#d84529"/><circle cx="30" cy="31" r="2" fill="white"/><path fill="white" opacity=".2" d="M9 19C16 2 42 3 50 18L10 34Z"/></g>\n<g transform="translate(194 10) rotate(-12 29 30)"><path fill="white" stroke="#8da9c5" stroke-width="2" stroke-dasharray="3 3" d="M0 0h53v60H0z"/><path fill="url(#aq-blue)" stroke="#e7effd" stroke-width="4" d="M5 5h43v50H5z"/><path fill="#d1d2b9" stroke="#65675a" stroke-width=".7" d="m27 33-9-6-4-15 3-5 5 13 5 7 1-14 4-7 3 5-3 18 10 13-5 3-8-8-8 9-7-2Z"/><path fill="#6e5b3b" d="m18 26 10 6 9 10-5 4-9-9-5 7-5-4 8-8Z"/><path d="m18 10 5 16m-8-12 6 13m9-15-1 15m3-12-2 14" fill="none" stroke="#66634e" stroke-width="1"/><path fill="#f4e1a1" d="m28 29 6 1 3 3-7 1Z"/><circle cx="31" cy="30" r=".8" fill="#292f2b"/></g>\n<g transform="translate(281 11) rotate(-10 28 31)"><path fill="#91795b" stroke="#594c3a" d="M0 3h53v62H0z"/><path fill="url(#aq-paper)" stroke="#b4b9b5" d="M4 5h45v55H4z"/><path fill="url(#aq-metal)" stroke="#8a8f92" d="M14 0h7q3-12 8 0h10v10H14Z"/><g stroke="#a0a7a9" stroke-width="1"><path d="M10 19h30M10 23h32M10 27h29M10 31h32M10 35h32M10 39h28M10 43h32M10 47h30M10 51h27"/></g></g>\n<g transform="translate(366 9)"><circle cx="29" cy="30" r="31" fill="url(#aq-metal)" stroke="white"/><path fill="#e5a7f0" opacity=".7" d="m29 30-27-10q6-19 24-20Z"/><path fill="#b6fcb9" opacity=".7" d="m29 30-9-29q17-6 32 9Z"/><path fill="url(#aq-music)" stroke="#276598" d="M26 7 53 2v41q0 9-12 10-12 0-9-10 2-5 12-5V14l-12 3v33q0 10-12 11-12-1-8-10 2-5 14-5Z"/></g>\n<g transform="translate(453 10)"><g transform="rotate(-14 27 25)"><path fill="white" stroke="#7f929a" stroke-width="2" d="M0 0h51v51H0z"/><path fill="#71a4bb" d="M4 4h43v43H4z"/><path fill="#62983f" d="m4 43 20-23 23 20v7H4Z"/><path fill="#f2c83c" d="M26 4h8v33h-8z"/><path fill="#fae95d" d="m5 16 35-8 4 9-36 9Z"/></g><rect x="16" y="23" width="49" height="37" rx="5" fill="url(#aq-metal)" stroke="#738290"/><path fill="#4f5a62" d="M23 19h17v8H23z"/><circle cx="42" cy="42" r="16" fill="url(#aq-metal)" stroke="#6f7782"/><circle cx="42" cy="42" r="11" fill="url(#aq-lens)"/><rect x="52" y="28" width="7" height="4" fill="white"/></g>\n<path d="M548 6v72" stroke="#7899bd"/><path d="M549 6v72" stroke="#e7f4ff"/>\n<g transform="translate(572 11)"><path d="m3 8 7 47q19 11 36 0l8-47Z" fill="url(#aq-metal)" stroke="#5a7183" stroke-width="2"/><path d="m6 12 7 39q15 8 30 0l8-39Z" fill="url(#aq-mesh)"/><ellipse cx="28" cy="8" rx="26" ry="9" fill="url(#aq-metal)" stroke="#e5f5ff" stroke-width="2"/><ellipse cx="28" cy="8" rx="21" ry="5" fill="#5a7389"/><path d="M10 56q18 9 35 0" fill="none" stroke="white" stroke-width="2"/></g></g>\n<g fill="#dbf6ff"><ellipse cx="46" cy="85" rx="6" ry="2"/><ellipse cx="395" cy="85" rx="6" ry="2"/></g></g><use href="#aq-dock-art" transform="translate(33 108) scale(.95 -.28)" opacity=".08"/></svg>';
  const cfg = { 'title': 'Button Sequence', 'theme': 'aqua', 'layout': 'aquawin' };
  env.site({
    name: 'design-click-control-sequence-10',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util,
        r = ctx.rng;
      document.body.className = 'ref ' + cfg.theme + ' ' + cfg.layout;
      const desktop = u.el('div', 'aq-desktop', document.body);
      desktop.setAttribute('aria-hidden', 'true');
      desktop.innerHTML = desktopSVG;
      const endR = r.fork('chrome/end'),
        collideR = r.fork('chrome/collide');
      const rawEnds = (ctx.content && ctx.content.END_LABELS) || [
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
      const ends = rawEnds.map((x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)));
      const endLabel = endR.pick([
        'Submit',
        'Submit',
        'Submit',
        'Submit',
        'Submit',
        'Submit',
        'Submit',
        'Submit',
        'Submit',
        ...ends.filter((x) => x !== 'Submit'),
      ]);
      const placement = ctx.finish ? null : endR.pick(['panel', 'panel', 'panel', 'panel', 'footer', 'titlebar']);
      const collide =
        !ctx.finish && collideR.bool(0.3)
          ? collideR.pick(ends.filter((x) => String(x).toLowerCase() !== String(endLabel).toLowerCase()))
          : null;
      const bar = u.el('header', 'aq-menubar', document.body);
      const apple = u.el('span', 'aq-apple', bar);
      apple.innerHTML =
        '<svg viewBox="4 2 16 21" preserveAspectRatio="none"><path d="M16.4 12.7c0-2.3 1.9-3.4 2-3.5-1.100-1.600-2.800-1.800-3.400-1.800-1.400-.1-2.800.9-3.500.9s-1.800-.8-3-.8c-1.500 0-3 .9-3.800 2.300-1.600 2.800-.4 7 1.200 9.300.8 1.100 1.700 2.400 2.900 2.300 1.200 0 1.600-.7 3-.7s1.800.7 3 .7 2-1.100 2.800-2.200c.9-1.300 1.200-2.500 1.300-2.600-.1 0-2.500-1-2.500-3.900ZM14.100 5.900c.6-.8 1.100-1.800.9-2.900-.9 0-2 .6-2.700 1.400-.6.700-1.100 1.800-1 2.800 1 .1 2.100-.5 2.800-1.300Z"/></svg>';
      u.el('b', 'aq-app', bar, 'Task Trainer');
      ['File', 'Edit', 'View', 'Window', 'Help'].forEach((s) => u.el('span', 'aq-mi', bar, s));
      u.el('span', 'aq-spacer', bar);
      const vol = u.el('span', 'aq-vol', bar);
      vol.innerHTML =
        '<svg viewBox="0 0 24 24"><path d="M3 9h4l5-4v14l-5-4H3Z" fill="#222"/><path d="M15 8q3 4 0 8 M18 6q5 6 0 12" fill="none" stroke="#222" stroke-width="1.6"/></svg>';
      u.el('span', 'aq-clock', bar, 'Mon 10:24 AM');
      const sr = u.el('span', 'aq-search', bar);
      sr.innerHTML =
        '<svg viewBox="0 0 24 24"><circle cx="10" cy="10" r="6" fill="none" stroke="#222" stroke-width="2.4"/><path d="m14.500 14.500 6 6" stroke="#222" stroke-width="2.800"/></svg>';
      const win = u.el('main', 'aq-window', document.body);
      const tb = u.el('div', 'aq-titlebar', win);
      const dots = u.el('span', 'aq-dots', tb);
      ['r', 'y', 'g'].forEach((c) => u.el('i', c, dots));
      u.el('span', 'aq-wtitle', tb, cfg.title);
      const endButton = (parent, cls, label) => {
        const b = u.el('button', cls, parent, label);
        b.type = 'button';
        b.setAttribute('aria-label', endLabel);
        b.title = endLabel;
        b.addEventListener('click', ctx.submit);
        return b;
      };
      const decoyButton = (parent, label, collides) => {
        const b = u.el('button', 'aq-xtra', parent, label);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', collides ? { label, collide: true } : { label }));
        return b;
      };
      if (collide && placement === 'titlebar') decoyButton(tb, collide, true);
      const body = u.el('div', 'aq-body', win);
      const left = u.el('section', 'aq-left', body);
      u.el('h2', 'aq-h', left, 'Task Briefing');
      const well = u.el('div', 'aq-well', left);
      const note = u.el('div', 'instruction', well, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      if (ctx.display === 'header') note.classList.add('aq-header-instruction');
      const txt = u.el('div', 'aq-text', well);
      u.el('p', '', txt, 'On the right, you’ll see several labeled buttons.');
      u.el('p', '', txt, 'Your task is to click the buttons in the exact order specified in your task.');
      u.el(
        'p',
        '',
        txt,
        ctx.finish
          ? 'After completing the sequence, finish the task.'
          : `After completing the sequence, click the ${endLabel} button.`,
      );
      const right = u.el('section', 'aq-right', body);
      u.el('h2', 'aq-h', right, 'Button Panel');
      const panel = u.el('div', 'aq-panel', right);
      const stage = u.el('div', 'stage', panel);
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'panel') submit = endButton(panel, 'submit', endLabel);
        else if (placement === 'titlebar') submit = endButton(tb, 'submit aq-title-submit', endLabel);
        else {
          const footer = u.el('div', 'aq-action-footer', win);
          if (collide) decoyButton(footer, collide, true);
          submit = endButton(footer, 'submit aq-footer-submit', endLabel);
        }
      }
      if (collide && placement !== 'titlebar' && placement !== 'footer') decoyButton(tb, collide, true);
      const dock = u.el('div', 'aq-dock', document.body);
      dock.setAttribute('aria-hidden', 'true');
      dock.innerHTML = dockSVG;
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
