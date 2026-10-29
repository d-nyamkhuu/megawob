(function () {
  'use strict';
  const cfg = { title: 'Mouse Challenge', menu: ['File', 'View', 'Help'], tools: ['Help', 'Notes', 'Settings'] };
  const END_FALLBACK = [
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
  const ICONS = {
    Help: '<svg viewBox="0 0 40 40"><defs><radialGradient id="hg" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#7fc0ff"/><stop offset="1" stop-color="#0a4fd0"/></radialGradient></defs><circle cx="20" cy="20" r="17" fill="url(#hg)" stroke="#1c3d9a" stroke-width="1.5"/><path d="M14 15.5c0-4 3-6 6.5-6s6 2 6 5.200c0 4-5.500 4.300-5.500 8" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/><circle cx="21" cy="30" r="2.600" fill="#fff"/></svg>',
    Notes:
      '<svg viewBox="0 0 40 40"><defs><linearGradient id="notePaper" x2=".8" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#c9e3ff"/></linearGradient></defs><path d="m8 7 22-3 3 3v27L9 38 6 35V9Z" fill="#b6c4d7" stroke="#30558c" stroke-width="1.4"/><path d="m9 8 21-3v27L9 36Z" fill="url(#notePaper)" stroke="#6692be"/><path d="M12 5q-3-5-3 4M17 4q-3-5-3 4M22 3q-3-5-3 4M27 2q-3-5-3 4" fill="none" stroke="#315da8" stroke-width="1.5"/><path d="m15 14 12-2m-12 7 12-2m-12 7 12-2m-12 7 9-1.5" stroke="#7aa5d3" stroke-width="1.5"/><path d="m11 14 1-.2m-1 5 1-.2m-1 5 1-.2m-1 5 1-.2" stroke="#2770c4" stroke-width="2"/></svg>',
    Settings:
      '<svg viewBox="0 0 40 40"><path d="m17 4h6l1 4 3.500 1.500 3.500-2.200 4 4-2.200 3.500 1.500 3.500 4 1v6l-4 1-1.500 3.500 2.200 3.500-4 4-3.500-2.200L24 34l-1 4h-6l-1-4-3.500-1.500-3.500 2.200-4-4 2.200-3.500L6 24l-4-1v-6l4-1 1.500-3.500L5.300 9.500l4-4 3.500 2.200L16 8Z" fill="#a9b4c6" stroke="#5d6a82" stroke-width="1.200" transform="translate(1 0) scale(.95)"/><circle cx="20" cy="20" r="7" fill="#eef2f8" stroke="#5d6a82" stroke-width="1.500"/></svg>',
  };
  env.site({
    name: 'design-click-control-hover-07',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref xp';
      const win = u.el('main', 'win', document.body);
      const tb = u.el('header', 'tb', win);
      const ico = u.el('span', 'tb-ico', tb);
      ico.innerHTML =
        '<svg viewBox="0 0 24 26"><defs><linearGradient id="appPaper" x2="1" y2="1"><stop stop-color="#fffde3"/><stop offset="1" stop-color="#a4b6cb"/></linearGradient></defs><rect x="1" y="1" width="22" height="24" rx="3" fill="url(#appPaper)" stroke="#7291b4"/><path d="m4 19 3-8 2 5-1-10 2-1 3 10-1-12 2-1 3 13 1-7 2 1v10l-4 5H9Z" fill="#decab0" stroke="#6a6c77" stroke-width=".8"/><path d="m5 9 3 4M3 13l3 2M16 3l2 3" stroke="#5e85b2"/><path d="m9 18 4 4 3-2" fill="none" stroke="#a48a6c"/></svg>';
      u.el('span', 'tb-title', tb, cfg.title);
      const ctl = u.el('span', 'tb-ctl', tb);
      ctl.innerHTML =
        '<i class="min"><b></b></i><i class="max"><b></b></i><i class="cls"><svg viewBox="0 0 16 16"><path d="m3.500 3.500 9 9M12.500 3.500l-9 9" stroke="#fff" stroke-width="2.400" stroke-linecap="round"/></svg></i>';
      const menu = u.el('nav', 'menu', win);
      cfg.menu.forEach((l) => u.el('span', '', menu, l));
      const endRng = ctx.rng.fork('chrome/end');
      const endLabels = (ctx.content && ctx.content.END_LABELS) || END_FALLBACK;
      const currentLabel = endRng.bool(0.5) ? 'Submit' : String(endRng.pick(endLabels));
      const endPlace = endRng.pick(['footer', 'footer', 'footer', 'toolbar', 'link']);
      const work = u.el('div', 'work', win);
      const left = u.el('section', 'left', work);
      const note = u.el(
        'div',
        'instruction ' + (ctx.display === 'panel' ? 'instruction-panel' : ''),
        left,
        ctx.instruction,
      );
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      const doc = u.el('section', 'doc', work);
      const group = u.el('div', 'group', doc);
      u.el('div', 'legend', group, 'Target Area');
      u.el('p', 'desc', group, 'The blue square moves around within the area below.');
      const desc2 = u.el('p', 'desc desc2', group, ctx.instruction);
      desc2.hidden = ctx.display === 'hidden';
      const stage = u.el('div', 'stage', group);
      const btns = u.el('div', 'btns', doc);
      let submit = null;
      if (!ctx.finish) {
        const parent = endPlace === 'toolbar' ? menu : btns;
        submit = u.el(
          endPlace === 'link' ? 'a' : 'button',
          endPlace === 'link' ? 'end-link' : 'submit',
          parent,
          currentLabel,
        );
        if (endPlace === 'link') {
          submit.href = '#';
          submit.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
        } else {
          submit.type = 'button';
          submit.addEventListener('click', ctx.submit);
        }
        submit.dataset.endPlacement = endPlace;
      }
      const collideRng = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && collideRng.bool(0.3)) {
        const labels = endLabels.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name)).filter(Boolean);
        const choices = labels.filter((x) => String(x) !== currentLabel);
        if (choices.length) {
          const label = String(collideRng.pick(choices));
          const d = u.el('button', 'xtra-end', menu, label);
          d.type = 'button';
          d.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        }
      }
      const rail = u.el('aside', 'tools', work);
      cfg.tools.forEach((t) => {
        const b = u.el('div', 'tool', rail);
        const i = u.el('span', 'tool-ico', b);
        i.innerHTML = ICONS[t];
        u.el('span', 'tool-lbl', b, t);
      });
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
