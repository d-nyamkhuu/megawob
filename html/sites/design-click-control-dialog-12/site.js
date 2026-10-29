(function () {
  'use strict';
  const NAV = ['Home', 'Documents', 'Users', 'Settings', 'Help'];
  const END = [
    'Submit',
    'Submit',
    'Submit',
    'Submit',
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
  const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
  env.site({
    name: 'design-click-control-dialog-12',
    styles: ['site.css'],
    initialOverlay: { kind: 'banner', p: 1, at: 0 },
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref bootstrap';
      const shell = u.el('main', 'shell', document.body);
      u.el('div', 'rightcol', shell);
      const head = u.el('header', 'head', shell);
      u.el('span', 'brand', head, 'Document Manager');
      const nav = u.el('nav', 'nav', head);
      NAV.forEach((l) => u.el('a', '', nav, l));
      const who = u.el('span', 'who', head);
      u.el('span', '', who, 'Signed in as: Alex Chen');
      u.el('i', '', who, '|');
      u.el('span', '', who, 'Sign out');
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      const stage = u.el('div', 'stage', center);
      const strip = u.el('div', 'taskbar', center);
      u.el('span', 'tri', strip);
      const tx = u.el('div', 'tb-text', strip);
      const tt = u.el('strong', '', tx, 'Task controls (collapsed)');
      u.el('span', '', tx, 'Click to show task controls and see what to do.');
      const sb = u.el('button', 'show-btn', strip, 'Show controls');
      sb.type = 'button';
      sb.addEventListener('click', () => {
        strip.classList.add('open');
        tt.textContent = 'Task controls (expanded)';
        sb.textContent = 'Controls shown';
      });
      const aside = u.el('aside', 'inspector', shell);
      const ph = u.el('div', 'pal-h', aside);
      u.el('span', '', ph, 'Notes');
      const pc = u.el('span', 'pal-c', ph);
      u.el('i', 'min', pc);
      u.el('i', 'cls', pc, '×');
      const pb = u.el('div', 'pal-b', aside);
      u.el('div', 'palette-reminder', pb, 'Follow the instructions carefully.');
      const note = u.el('div', 'instruction', pb, ctx.instruction);
      let display = ctx.display || 'header';
      note.dataset.display = display;
      aside.classList.toggle('has-instruction', display === 'panel');
      note.hidden = display === 'hidden';
      if (display === 'header') {
        note.classList.add('task-instruction');
        tx.appendChild(note);
      }
      if (display === 'toast') {
        note.classList.add('instruction-toast');
        shell.appendChild(note);
      }
      const er = ctx.rng.fork('chrome/end');
      const label = er.bool(0.5)
        ? 'Submit'
        : labelOf(
            er.pick(
              ctx.content && ctx.content.END_LABELS && ctx.content.END_LABELS.length ? ctx.content.END_LABELS : END,
            ),
          );
      const placement = ctx.rng
        .fork('chrome/end')
        .pick(['footer', 'footer', 'footer', 'footer', 'footer', 'header', 'header', 'taskbar', 'taskbar', 'taskbar']);
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      const bank = (
        ctx.content && ctx.content.END_LABELS && ctx.content.END_LABELS.length ? ctx.content.END_LABELS : END
      ).map(labelOf);
      if (cr.bool(0.3)) {
        const options = [...new Set(bank)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) collide = cr.pick(options);
      }
      const makeEnd = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.title = text;
        b.setAttribute('aria-label', text);
        b.addEventListener('click', ctx.submit);
        return b;
      };
      const decoy = (parent, text) => {
        const b = u.el('button', 'chrome-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        return b;
      };
      if (collide) decoy(strip, collide);
      const foot = u.el('footer', 'footer', shell);
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'footer') submit = makeEnd(foot, 'submit', label);
        else if (placement === 'header') submit = makeEnd(head, 'chrome-end head-end', label);
        else submit = makeEnd(strip, 'chrome-end task-end', label);
      }
      return { stage, submit };
    },
    overlay(ctx) {
      if (ctx.initial) {
        const stage = document.querySelector('.stage');
        const strip = document.querySelector('.taskbar');
        const original = strip.querySelector('.show-btn');
        const el = ctx.util.el('section', 'controls-gate', document.body);
        const r = stage.getBoundingClientRect();
        const shield = ctx.util.el('div', 'controls-shield', el);
        shield.style.cssText =
          'position:fixed;left:' + r.left + 'px;top:' + r.top + 'px;width:' + r.width + 'px;height:' + r.height + 'px';
        const b = original.getBoundingClientRect();
        const dismiss = ctx.util.el('button', 'show-btn gate-show', el, 'Show controls');
        dismiss.type = 'button';
        dismiss.style.cssText =
          'position:fixed;left:' + b.left + 'px;top:' + b.top + 'px;width:' + b.width + 'px;height:' + b.height + 'px';
        original.style.visibility = 'hidden';
        dismiss.addEventListener('click', () => {
          original.style.visibility = '';
          original.click();
          ctx.dismiss();
        });
        return { el, dismiss };
      }
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
