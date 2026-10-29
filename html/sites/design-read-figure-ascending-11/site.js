(function () {
  'use strict';
  const C = {
      'site': 'design-read-figure-ascending-11',
      'task': 'read-figure',
      'scenario': 'ascending',
      'style': 'developer',
    },
    u = env.util;
  function windowControls(p) {
    const row = u.el('div', 'window-controls', p);
    for (const kind of ['min', 'max', 'close']) {
      const svg = u.svg('svg', { viewBox: '0 0 20 20' }, row);
      u.svg(
        'path',
        {
          d: kind === 'min' ? 'M2 12h16' : kind === 'max' ? 'M3 3h14v14H3z' : 'M3 3l14 14M17 3L3 17',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': 1.5,
        },
        svg,
      );
    }
  }
  env.site({
    name: C.site,
    styles: ['site.css'],
    initialOverlay: { kind: 'banner' },
    frame(ctx) {
      document.body.className = C.style + ' instruction-' + ctx.display;
      let app,
        top,
        center,
        brief,
        stage,
        foot,
        submit = null;
      const er = ctx.rng.fork('chrome/end'),
        cr = ctx.rng.fork('chrome/collide');
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
      const endPlacement = ctx.finish ? null : er.pick(['footer', 'footer', 'footer', 'header', 'link']);
      const altLabels = labels.map((x) => String(x.label || x)).filter((x) => x.toLowerCase() !== 'submit');
      const endLabel = er.pick([
        'Submit',
        'Submit',
        'Submit',
        'Submit',
        'Submit',
        'Submit',
        'Submit',
        'Submit',
        ...altLabels,
      ]);
      let collide = null;
      if (cr.bool(0.3)) {
        const opts = labels.map((x) => String(x.label || x)).filter((x) => x.toLowerCase() !== endLabel.toLowerCase());
        if (opts.length) collide = cr.pick(opts);
      }
      const decoyBtn = (parent, label, isEnd) => {
        const b = u.el('button', 'xtra-end', parent, label);
        b.type = 'button';
        b.onclick = () => env.log('decoy', isEnd ? { label, collide: true } : { label });
      };
      if (C.scenario === 'addition') {
        app = u.el('main', 'app', document.body);
        top = u.el('header', 'top', app);
        u.el('span', '', top, 'Math Practice');
        windowControls(top);
        center = u.el('div', 'center', app);
        brief = u.el('div', 'brief', center, ctx.display === 'header' ? ctx.instruction : '');
        stage = u.el('section', 'stage', center);
        foot = u.el('footer', 'bottom', app);
        const taskbar = u.el('div', 'taskbar', app);
        const win = u.svg('svg', { viewBox: '0 0 40 40' }, taskbar);
        u.svg(
          'path',
          { d: 'M2 5l16-2v16H2zM21 3l17-2v18H21zM2 22h16v16L2 36zM21 22h17v18l-17-2z', fill: '#1cb4ee' },
          win,
        );
        u.el('b', '', taskbar, 'Math Practice');
        u.el('div', 'clock', taskbar, '10:24 AM   4/16/2012');
      } else {
        const nav = u.el('nav', 'dev-nav', document.body);
        u.el('b', '', nav, '</>  DevTools');
        u.el('div', 'active', nav, '●  Tasks');
        ['Playground', 'Snippets', 'Settings'].forEach((x) => u.el('div', '', nav, x));
        u.el('div', 'online', nav, '● Online');
        app = u.el('main', 'app', document.body);
        top = u.el('header', 'top', app);
        u.el('span', '', top, '>_  Focus Task');
        u.el('small', '', top, '# ui-perceive/ascending');
        if (!ctx.finish && endPlacement === 'header') {
          const b = u.el('button', 'submit header-end', top, endLabel);
          b.type = 'button';
          b.onclick = ctx.submit;
          submit = b;
        }
        if (collide && endPlacement === 'header') decoyBtn(top, collide, true);
        center = u.el('div', 'center', app);
        brief = u.el('div', 'brief', center, ctx.display === 'header' ? ctx.instruction : '');
        stage = u.el('section', 'stage', center);
        foot = u.el('footer', 'bottom', app);
        u.el('span', 'footnote', foot, 'Select the numbers in order.');
        const notes = u.el('aside', 'dev-notes', document.body);
        u.el('b', '', notes, 'Task');
        if (ctx.display !== 'hidden') {
          u.el(
            'p',
            'instruction-side',
            notes,
            ctx.display === 'panel' ? ctx.instruction : 'Order the numbers from smallest to largest.',
          );
          u.el('p', '', notes, 'All numbers are unique. Click each number once.');
        }
        if (ctx.display === 'toast') u.el('div', 'instruction-toast-note', document.body, ctx.instruction);
        u.el('div', 'dev-version', document.body, 'v2.4.1');
      }
      if (!ctx.finish && endPlacement === 'footer') {
        submit = u.el('button', 'submit', foot, endLabel);
        submit.type = 'button';
        submit.onclick = ctx.submit;
      } else if (!ctx.finish && endPlacement === 'link') {
        const link = u.el('button', 'end-link', foot, endLabel + ' >');
        link.type = 'button';
        link.onclick = ctx.submit;
        submit = link;
      }
      if (collide && (endPlacement === 'footer' || endPlacement === 'link')) decoyBtn(foot, collide, true);
      if (ctx.finish) submit = null;
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      if (ctx.initial) {
        if (C.scenario === 'addition') {
          const ob = u.el('section', 'obstruction newsletter', document.body);
          u.el('h2', '', ob, 'Join Our Newsletter');
          u.el('p', '', ob, 'Get math tips and practice ideas right in your inbox.');
          const signup = u.el('div', 'signup', ob),
            email = u.el('input', '', signup);
          email.type = 'email';
          email.placeholder = 'Your email address';
          email.setAttribute('aria-label', 'Your email address');
          const sign = u.el('button', '', signup, 'Sign Up');
          sign.onclick = () => {
            sign.textContent = 'Thank you';
          };
          const close = u.el('button', 'obstruction-close', ob);
          close.dataset.referenceDismiss = 'true';
          close.setAttribute('aria-label', 'Close');
          const svg = u.svg('svg', { viewBox: '0 0 28 28' }, close);
          u.svg('path', { d: 'M4 4l20 20M24 4L4 24', fill: 'none', stroke: 'white', 'stroke-width': 2 }, svg);
          close.onclick = ctx.dismiss;
          return { el: ob, dismiss: close };
        } else {
          const ob = u.el('section', 'obstruction announcement', document.body),
            svg = u.svg('svg', { viewBox: '0 0 48 48', class: 'banner-icon' }, ob);
          u.svg(
            'path',
            {
              d: 'M4 18h10L33 9v30l-19-9H4zM11 30l3 12h7l-5-12M39 14l5-3M40 24h7M39 34l5 3',
              fill: 'none',
              stroke: '#b8ee99',
              'stroke-width': 3,
              'stroke-linecap': 'round',
              'stroke-linejoin': 'round',
            },
            svg,
          );
          const text = u.el('div', '', ob);
          u.el('h2', '', text, 'System Maintenance Tonight');
          u.el(
            'p',
            '',
            text,
            'Scheduled maintenance will occur today from 10:00 PM to 12:00 AM UTC. Some features may be unavailable.',
          );
          const close = u.el('button', '', ob, 'Collapse announcement  ⌃');
          close.dataset.referenceDismiss = 'true';
          close.onclick = ctx.dismiss;
          return { el: ob, dismiss: close };
        }
      }
      const el = u.el('div', 'overlay ' + ctx.kind, document.body);
      u.el(
        'span',
        '',
        el,
        {
          cookie: 'Store your preferences on this device?',
          toast: 'Workspace synced.',
          chat: 'Need help with this task?',
          promo: 'Explore more practice exercises.',
          banner: 'New practice exercises are available.',
        }[ctx.kind],
      );
      const dismiss = u.el('button', '', el, 'Dismiss');
      dismiss.onclick = ctx.dismiss;
      return { el, dismiss };
    },
  });
})();
