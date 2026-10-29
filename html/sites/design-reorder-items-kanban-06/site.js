(function () {
  'use strict';
  const documentIcon =
    '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M2 2h27v27H2z" fill="#ddd" stroke="#222"/><path d="M4 4h23v23H4z" fill="#fff" stroke="#234cb7" stroke-width="2"/><path d="M5 5h21v4H5z" fill="#2455bd"/><path d="M7 12h17M7 15h10M7 18h16M7 22h11M7 25h16" stroke="#777"/><path d="M21 10h4v4h-4z" fill="#2695ce"/><path d="M17 16h8v6h-8z" fill="#d92918"/><path d="M18 18h5v3h-5z" fill="#eece4e"/><path d="M24 20h4v4h-4z" fill="#336dd6"/></svg>';
  const appIcon =
    '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M3 2h23l4 5v23H3z" fill="#fff" stroke="#222"/><path d="M5 4h20v4H5z" fill="#285cc6"/><path d="M7 12h19M7 15h12M7 18h17M7 22h11M7 25h13" stroke="#777"/><path d="M21 16h8v9h-8z" fill="#ddd" stroke="#444"/><path d="M23 19h4v4h-4z" fill="#e33"/><path d="M26 2v6h4" fill="none" stroke="#222"/></svg>';
  const flowerIcon =
    '<svg viewBox="0 0 42 38" aria-hidden="true"><path d="M1 1h40v36H1z" fill="#aaa" stroke="#444"/><g stroke="#333" stroke-width=".8"><path d="M20 18C5 7 8 3 18 10C23-6 28 2 24 13C42 6 40 15 27 19C43 22 36 29 25 24C28 41 20 37 20 26C6 37 5 28 14 23C-1 22 3 14 16 17z" fill="#eac600"/><path d="M17 18L12 8L17 6L22 18L23 7L28 8L25 19L35 14L37 19L26 22L34 28L30 33L23 24L20 34L16 34L18 23L6 28L4 24L16 20L5 15L9 11z" fill="#1579dc"/><path d="M18 19L16 9L21 8L22 19L30 12L33 16L25 22L29 32L24 33L21 24L11 29L9 25z" fill="#1ac12c"/><path d="M20 18h5v8h-5z" fill="#ec2525"/></g></svg>';
  env.site({
    name: 'design-reorder-items-kanban-06',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const endRng = ctx.rng.fork('chrome/end');
      const collideRng = ctx.rng.fork('chrome/collide');
      const endLabels = (ctx.content && ctx.content.END_LABELS) || [
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
      const labelOf = (value) =>
        typeof value === 'string' ? value : (value && (value.label || value.text || value.name)) || String(value);
      let placement = ctx.finish ? null : endRng.pick(['footer', 'header', 'footer', 'link', 'footer', 'icon']);
      const alternatives = endLabels.filter((v) => labelOf(v).toLowerCase() !== 'submit').map(labelOf);
      const sampledEndLabel = endRng.pick(alternatives.flatMap((label) => ['Submit', label]));
      const endLabel = placement === 'footer' ? 'Submit' : sampledEndLabel;
      let collide = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const choices = [...new Set(endLabels.map(labelOf))].filter(
          (v) => v.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
        );
        if (choices.length) collide = labelOf(collideRng.pick(choices));
      }
      document.body.className = 'design riscos';
      const shell = u.el('div', 'shell', document.body);
      const tb = u.el('div', 'titlebar', shell);
      u.el('span', 'tb-icon', tb).innerHTML = documentIcon;
      u.el('span', 'tb-title', tb, 'Card Sort');
      const closeGadget = u.el('span', 'tb-close', tb, '×');
      const page = u.el('div', 'page', shell);
      // Side notes and status notices reserve their own space; neither covers the board.
      const roomy = document.documentElement.clientWidth >= 1260;
      const tall = document.documentElement.clientHeight >= 700;
      let display = ctx.display;
      if ((display === 'panel' && !roomy) || (display === 'toast' && !tall)) display = 'header';
      page.classList.add('display-' + display);
      const note = u.el(display === 'panel' ? 'aside' : 'header', 'task-note', page);
      u.el('div', 'instruction', note, ctx.instruction);
      if (display === 'hidden') note.hidden = true;
      if (display === 'panel') {
        note.classList.add('instruction-panel');
        u.el('div', 'note-title', note, 'Instructions');
      }
      if (display === 'toast') {
        note.classList.add('instruction-toast');
        const close = u.el('button', 'note-close', note, '×');
        close.type = 'button';
        close.onclick = () => {
          note.style.visibility = 'hidden';
        };
      }
      const stage = u.el('main', 'stage', page);
      stage.dataset.role = 'stage';
      const footer = u.el('footer', 'footer', page);
      let submit = null;
      const decoyBtn = (parent, text, collides) => {
        const b = u.el('button', collides ? 'chrome-xtra pq-xtra' : 'chrome-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.onclick = () => env.log('decoy', collides ? { label: text, collide: true } : { label: text });
        return b;
      };
      const endBtn = (parent, cls, text, ariaText) => {
        const b = u.el(cls === 'submit-link' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', ariaText || endLabel);
        b.title = ariaText || endLabel;
        b.onclick = (e) => {
          e.preventDefault();
          ctx.submit();
        };
        return b;
      };
      if (!ctx.finish) {
        const clr = u.el('button', 'clearall', footer);
        u.el('span', 'control-caption', clr, 'Clear All');
        clr.type = 'button';
        clr.onclick = () => env.log('clear-all', {});
        if (placement === 'footer') submit = endBtn(footer, 'submit', endLabel);
        if (placement === 'link') submit = endBtn(footer, 'submit-link', `${endLabel} ›`);
        if (placement === 'icon') submit = endBtn(footer, 'submit icon-submit', '✓');
        if (collide) decoyBtn(footer, collide, true);
        if (placement === 'header') {
          submit = endBtn(tb, 'submit header-submit', endLabel);
          tb.insertBefore(submit, closeGadget);
        }
      }
      const bar = u.el('div', 'iconbar', shell);
      const a = u.el('div', 'ib-item ib-os', bar);
      u.el('span', 'ib-ico star', a).innerHTML = flowerIcon;
      u.el('span', '', a, 'RISC OS');
      const b = u.el('div', 'ib-item ib-app', bar);
      u.el('span', 'ib-ico doc', b).innerHTML = appIcon;
      u.el('span', '', b, 'Card Sort');
      u.el('div', 'ib-fill', bar);
      const clock = u.el('div', 'ib-clock', bar);
      u.el('span', 'clock-caption', clock, '10:24');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'obstruction obstruction-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const titles = {
        cookie: 'Privacy notice',
        toast: 'Changes saved',
        chat: 'Help',
        promo: 'Notebook news',
        banner: 'Notice',
      };
      u.el('h3', '', box, titles[ctx.kind] || 'Notice');
      u.el(
        'p',
        '',
        box,
        ctx.kind === 'cookie'
          ? 'Allow optional cookies for this page?'
          : 'You can close this note to return to the activity.',
      );
      const dismiss = u.el('button', 'dismiss', box, ctx.kind === 'cookie' ? 'Reject optional' : 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
    },
  });
})();
