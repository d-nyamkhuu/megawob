(function () {
  'use strict';
  const C = {
    site: 'design-read-figure-count-10',
    task: 'read-figure',
    scenario: 'count',
    style: 'nbk',
    title: 'VISUAL SKILLS',
    menu: '',
    note: '',
    layout: 'nb',
    subtitle: '',
    aside: '',
  };
  env.site({
    name: C.site,
    styles: ['site.css', 'nb.css'],
    frame(ctx) {
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      u.el('span', '', top, C.title);
      u.el('em', '', top, 'EXERCISE 1 OF 5');
      const tabs = u.el('nav', 'tabs', document.body);
      ['Count', 'Shapes', 'Colors', 'Practice', 'Notes'].forEach((t, i) =>
        u.el('div', 'tab' + (i ? '' : ' on'), tabs, t),
      );
      const rings = u.el('div', 'rings', document.body);
      for (let i = 0; i < 9; i++) u.el('i', '', rings);
      const sw = (ctx.size && (ctx.size.width || ctx.size.w)) || window.innerWidth,
        sh = (ctx.size && (ctx.size.height || ctx.size.h)) || window.innerHeight;
      const display =
        (ctx.display === 'panel' && !(sw >= 1260 && sh >= 700)) || (ctx.display === 'toast' && sh < 700)
          ? 'header'
          : ctx.display;
      const center = u.el('div', 'center', app),
        brief = u.el('div', 'brief', center, display === 'header' ? ctx.instruction : '');
      document.body.dataset.note = display;
      if (display === 'header') {
        if (ctx.instruction.length > 48) brief.classList.add('long');
        u.el('small', 'guidance', brief, 'Look at the items below and count those that match the task.');
      }
      const stage = u.el('section', 'stage', center),
        aside = u.el('aside', 'aside', document.body);
      const labels = (ctx.content && ctx.content.END_LABELS) || [
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
      const names = labels.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name));
      const endR = ctx.rng.fork('chrome/end'),
        standard = !ctx.finish && endR.bool(0.5);
      const place = ctx.finish ? null : standard ? 'footer' : endR.pick(['header', 'footer', 'link']);
      const label = standard
        ? names.find((x) => String(x).trim().toLowerCase() === 'submit') || names[0]
        : endR.pick(names);
      let submit = null;
      const collideR = ctx.rng.fork('chrome/collide');
      let collision = null;
      if (!ctx.finish && collideR.bool(0.3)) {
        const choices = names.filter((x) => String(x).trim().toLowerCase() !== String(label).trim().toLowerCase());
        if (choices.length) collision = collideR.pick(choices);
      }
      const decoy = (parent) => {
        if (!collision) return;
        const d = u.el('button', 'xtra', parent, collision);
        d.type = 'button';
        d.addEventListener('click', () => env.log('decoy', { label: collision, collide: true }));
      };
      const end = (parent, cls, text) => {
        const b = u.el(cls === 'end-link' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (place === 'header') {
        decoy(top);
        submit = end(top, 'submit', label);
      } else decoy(top);
      if (display === 'panel') {
        u.el('b', 'panel-title', aside, 'EXERCISE NOTE');
        u.el('p', 'aside-copy', aside, ctx.instruction);
      } else if (display === 'toast') {
        const note = u.el('div', 'instruction-toast', document.body, ctx.instruction);
        note.setAttribute('role', 'note');
      }
      const footer = u.el('footer', 'bottom', app);
      if (!ctx.finish) {
        if (place === 'footer') submit = end(footer, 'submit', label);
        else if (place === 'link') submit = end(footer, 'end-link', label + ' ›');
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {
        cookie: 'This application stores preferences on your device.',
        toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?',
        promo: 'Try the new practice collection.',
        banner: 'An updated practice collection is available.',
      };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
