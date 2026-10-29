(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-identify-02',
    'task': 'read-figure',
    'scenario': 'identify',
    'style': 'm91',
    'title': 'Shape Identifier',
    'menu': '',
    'note': 'Shape Identification',
    'layout': 'brief-left',
    'subtitle': '',
    'aside': '',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + ctx.display;
      const u = ctx.util,
        win = u.el('main', 'm-win', document.body),
        tb = u.el('header', 'm-title', win);
      u.el('i', 'm-sys', tb);
      u.el('span', 'm-ttext', tb, C.title);
      const wc = u.el('div', 'm-wc', tb);
      ['min', 'max', 'close'].forEach((k) => u.el('i', 'm-wb ' + k, wc));
      const mb = u.el('nav', 'm-menu', win);
      ['File', 'Edit', 'Options', 'Help'].forEach((t) => u.el('span', t === 'Help' ? 'on' : '', mb, t));
      const endR = ctx.rng.fork('chrome/end');
      const placement = ctx.finish ? null : endR.pick(['status', 'footer', 'toolbar', 'footer', 'footer']);
      const endLabels = (ctx.content && ctx.content.END_LABELS) || [
        'Submit',
        'Done',
        'Finish',
        'Continue',
        'Save',
        'OK',
        'Confirm',
        'Apply',
      ];
      const pickedLabel = endR.pick(endLabels);
      const label = ctx.finish
        ? null
        : endR.bool(0.5)
          ? 'Submit'
          : typeof pickedLabel === 'string'
            ? pickedLabel
            : pickedLabel.label || pickedLabel.text || pickedLabel.name || String(pickedLabel);
      const dd = u.el('div', 'm-drop', win);
      ['Contents', 'Tutorial', 'About...'].forEach((t) => u.el('span', '', dd, t));
      const help = mb.querySelector('.on');
      help.tabIndex = 0;
      help.setAttribute('role', 'button');
      help.setAttribute('aria-expanded', 'true');
      const toggleHelp = () => {
        dd.hidden = !dd.hidden;
        help.setAttribute('aria-expanded', String(!dd.hidden));
      };
      help.addEventListener('click', toggleHelp);
      help.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleHelp();
        }
      });
      dd.addEventListener('click', () => {
        dd.hidden = true;
        help.setAttribute('aria-expanded', 'false');
      });
      const body = u.el('div', 'm-body', win);
      const left = u.el('div', 'm-left', body);
      if (ctx.display === 'header') {
        const p1 = u.el('section', 'm-panel m-task', left);
        u.el('h3', '', p1, 'Task');
        const tin = u.el('div', 'm-inset m-taskin', p1);
        u.el('b', '', tin, ctx.instruction);
        u.el(
          'p',
          '',
          tin,
          'Look at the figure in the box below and choose the correct name.' +
            (ctx.finish ? '' : '\nThen click ' + label + '.'),
        );
      }
      const p2 = u.el('section', 'm-panel m-fig', left);
      u.el('h3', '', p2, 'Figure and Choices');
      const fin = u.el('div', 'm-inset m-figin', p2);
      const stage = u.el('section', 'stage', fin);
      const foot = u.el('footer', 'bottom', fin);
      let submit = null;
      if (!ctx.finish && placement === 'footer') {
        submit = u.el('button', 'submit', foot, label);
        submit.type = 'button';
        submit.addEventListener('click', ctx.submit);
      }
      const right = u.el('aside', 'm-right', body);
      if (ctx.display === 'panel' || ctx.display === 'toast') {
        const note = u.el('section', 'm-panel m-note-panel ' + (ctx.display === 'toast' ? 'm-note-toast' : ''), right);
        u.el('h3', '', note, ctx.display === 'toast' ? 'Task notice' : 'Instructions');
        u.el('div', 'm-inset m-note-text', note, ctx.instruction);
      }
      const p3 = u.el('section', 'm-panel m-fb', right);
      u.el('h3', '', p3, 'Feedback');
      const fb = u.el('div', 'm-feed', p3);
      u.el('div', 'm-feedtext', fb, 'No answer yet.');
      const sb = u.el('div', 'm-sbar', fb);
      u.el('i', '', sb);
      u.el('i', '', sb);
      const st = u.el('footer', 'm-status', win);
      u.el('span', '', st, 'Ready.');
      if (!ctx.finish && placement === 'status') {
        submit = u.el('button', 'm-status-end', st, label);
        submit.type = 'button';
        submit.addEventListener('click', ctx.submit);
      }
      u.el('span', 'm-cell', st, 'INS');
      u.el('span', 'm-cell', st, '10:24 AM');
      if (!ctx.finish && placement === 'toolbar') {
        submit = u.el('button', 'm-toolbar-end', mb, label);
        submit.type = 'button';
        submit.addEventListener('click', ctx.submit);
      }
      const collideR = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && collideR.bool(0.3)) {
        const pool = endLabels
          .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))
          .filter((x) => String(x).trim().toLowerCase() !== String(label).trim().toLowerCase());
        if (pool.length) {
          const text = String(collideR.pick(pool));
          const parent = collideR.pick([mb, st]);
          const decoy = u.el('button', 'm-xtra', parent, text);
          decoy.type = 'button';
          decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
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
