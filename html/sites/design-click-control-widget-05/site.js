(function () {
  'use strict';
  const cfg = {
    'title': 'Feedback Form',
    'theme': 'metro',
    'layout': 'frame',
    'obstacle': 'Welcome!',
    'copy': 'This short tour will show you around the interface.',
    'dismiss': 'Skip tour',
  };
  env.site({
    name: 'design-click-control-widget-05',
    styles: ['site.css', 'metro.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref ' + cfg.theme + ' ' + cfg.layout;
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const tb = u.el('div', 'title', head);
      const logo = u.el('span', 'wlogo', tb);
      logo.innerHTML =
        '<svg viewBox="0 0 16 16"><path d="M1 2.4 6.6 1.6v5.2H1ZM7.4 1.5 15 .4v6.4H7.4ZM1 7.6h5.6v5.2L1 12ZM7.4 7.6H15v6.4l-7.6-1.1Z"/></svg>';
      u.el('span', 'ttext', tb, cfg.title);
      const wc = u.el('span', 'window-controls', tb);
      wc.innerHTML =
        '<i><svg viewBox="0 0 16 16"><path d="M3 8.5h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3.5 3.5h9v9h-9Z"/></svg></i><i class="close"><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      const mb = u.el('nav', 'menubar', head);
      ['File', 'Edit', 'View', 'Help'].forEach((s) => u.el('span', '', mb, s));
      const work = u.el('div', 'work', shell);
      const panel = u.el('section', 'panel', work);
      const banner = u.el('div', 'banner', panel);
      u.el('span', '', banner, 'User Feedback');
      const privacy = u.el('button', 'privacy', panel, 'View our privacy policy');
      privacy.type = 'button';
      privacy.addEventListener('click', () => env.log('decoy', { label: 'View our privacy policy' }));
      const body = u.el('div', 'pbody', panel);
      const note = u.el('div', 'instruction', body, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'panel') note.classList.add('instruction-panel');
      if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
      }
      u.el('div', 'lead', body, 'Please complete the form below.');
      const stage = u.el('div', 'stage', body);
      const foot = u.el('footer', 'footer', shell);
      const tray = u.el('span', 'tray', foot);
      tray.innerHTML =
        '<svg class="winkey" viewBox="0 0 16 16"><path d="M0 2.3 6.5 1.4v5.8H0ZM7.3 1.3 16 0v7.2H7.3ZM0 8h6.5v5.8L0 12.9ZM7.3 8H16v8l-8.7-1.2Z"/></svg>';
      const sys = u.el('span', 'sysicons', foot);
      sys.innerHTML =
        '<svg viewBox="0 0 16 16"><path d="m3 11 5-5 5 5"/></svg><svg viewBox="0 0 16 16"><path d="M2 6h3l4-3v10l-4-3H2ZM11 5.5a3.5 3.5 0 0 1 0 5M13 3.5a6.5 6.5 0 0 1 0 9"/></svg><svg viewBox="0 0 16 16"><path d="M2 3h12v8H2ZM6 14h4M8 11v3"/></svg>';
      const clock = u.el('span', 'clock', foot);
      u.el('span', '', clock, '10:24 AM');
      u.el('span', '', clock, '4/12/2012');
      const er = ctx.rng.fork('chrome/end');
      const cr = ctx.rng.fork('chrome/collide');
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
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const keep = er.bool(0.5);
      const placement = keep ? 'panel' : er.pick(['toolbar', 'link', 'panel']);
      const label = keep ? 'Submit' : labelOf(er.pick(labels));
      let collide = null;
      if (cr.bool(0.3)) {
        const options = [...new Set(labels.map(labelOf))].filter(
          (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
        );
        if (options.length) collide = { label: cr.pick(options) };
      }
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'toolbar' ? mb : placement === 'link' ? body : panel;
        const cls =
          placement === 'toolbar'
            ? 'submit metro-toolbar-submit'
            : placement === 'link'
              ? 'submit metro-link-submit'
              : 'submit';
        submit = u.el('button', cls, parent, label);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', ctx.submit);
      }
      if (collide) {
        const d = u.el('button', 'metro-xtra metro-toolbar-xtra', mb, collide.label);
        d.type = 'button';
        d.dataset.role = 'xtra';
        d.addEventListener('click', () => env.log('decoy', { label: collide.label, collide: true }));
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
