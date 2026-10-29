(function () {
  'use strict';
  env.site({
    name: 'design-click-control-pie-02',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref fluent';
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const logo = u.el('span', 'app-logo', head);
      logo.innerHTML =
        '<svg viewBox="0 0 28 28"><defs><linearGradient id="logo-blue"><stop stop-color="#0085f3"/><stop offset="1" stop-color="#50bdff"/></linearGradient></defs><rect width="28" height="28" rx="5" fill="url(#logo-blue)"/><path d="M14 0v28M0 14h28" stroke="#d2efff" stroke-opacity=".6"/><path d="M2 15h11v12H5q-3 0-3-3Z" fill="#008cf5"/><path d="M16 2h8v10h-8Z" fill="#b5e8ff" opacity=".4"/></svg>';
      u.el('div', 'title', head, 'Skill Builder');
      const wc = u.el('span', 'window-controls', head);
      wc.innerHTML =
        '<i><svg viewBox="0 0 16 16"><path d="M3 8h10"/></svg></i><i><svg viewBox="0 0 16 16"><rect x="3" y="3" width="10" height="10" rx="1.5"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      const brief = u.el('div', 'brief', center);
      u.el('div', 'brief-step', brief, 'Task 1 of 1');
      const note = u.el('div', 'instruction', brief, ctx.instruction);
      let display = ctx.display || 'header';
      const frameSize = shell.getBoundingClientRect();
      if (display === 'panel' && (frameSize.width < 1260 || frameSize.height < 700)) display = 'header';
      if (display === 'toast' && frameSize.height < 700) display = 'header';
      note.dataset.display = display;
      note.hidden = display === 'hidden';
      if (display !== 'header') brief.hidden = true;
      u.el('div', 'brief-sub', brief, 'Click the correct item in the pie menu. Do not type anything.');
      const canvas = u.el('div', 'canvas', center);
      u.el('div', 'canvas-title', canvas, 'Canvas');
      u.el('div', 'canvas-sub', canvas, 'Right-click anywhere in the canvas to open the pie menu.');
      const stage = u.el('div', 'stage', canvas);
      const aside = u.el('aside', 'inspector', work);
      u.el('h2', '', aside, 'Your progress');
      const prog = u.el('div', 'progress', aside);
      u.el('span', 'ring', prog);
      const pt = u.el('div', '', prog);
      u.el('b', '', pt, '0 of 1');
      u.el('span', '', pt, 'tasks completed');
      u.el('hr', '', aside);
      u.el('h2', '', aside, 'Tips');
      const tip = u.el('div', 'tip', aside);
      const bulb = u.el('span', 'bulb', tip);
      bulb.innerHTML =
        '<svg viewBox="0 0 24 32"><path d="M9 25h6M10 29h4M12 2a9 9 0 0 0-5.5 16c1.3 1.2 2 3 2 5h7c0-2 .7-3.8 2-5A9 9 0 0 0 12 2Z"/><path d="M11 6c-4 1-5 5-3 7" opacity=".4"/></svg>';
      u.el('p', '', tip, 'Right-click in the canvas to open the pie menu, then click the requested item.');
      if (display === 'panel') {
        const task = u.el('section', 'episode-panel', aside);
        u.el('div', 'episode-panel-title', task, 'Task instructions');
        note.hidden = false;
        note.classList.add('instruction-panel');
        task.appendChild(note);
      }
      if (display === 'toast') {
        note.hidden = false;
        note.classList.add('instruction-toast');
        center.insertBefore(note, canvas);
      }
      const endRng = ctx.rng.fork('chrome/end'),
        labels = (ctx.content && ctx.content.END_LABELS) || [
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
      let placement = null,
        label = null;
      if (!ctx.finish) {
        if (endRng.bool(0.5)) {
          placement = 'aside';
          label = 'Submit';
        } else {
          placement = endRng.pick(['header', 'header', 'link']);
          const choices = labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== 'submit');
          label = choices.length ? endRng.pick(choices) : 'Done';
        }
      }
      const collideRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const choices = labels
          .map(labelOf)
          .filter((x) => x.trim().toLowerCase() !== String(label).trim().toLowerCase());
        if (choices.length) collide = collideRng.pick(choices);
      }
      const decoy = (parent, text) => {
        const b = u.el('button', 'end-xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
      };
      let submit = null;
      if (placement === 'header' || (collide && collideRng.bool(0.5))) {
        const tools = u.el('div', 'head-tools');
        head.insertBefore(tools, wc);
        if (collide) decoy(tools, collide);
        if (placement === 'header') {
          submit = u.el('button', 'header-submit', tools, label);
          submit.type = 'button';
          submit.setAttribute('aria-label', label);
          submit.title = label;
          submit.addEventListener('click', ctx.submit);
        }
      }
      if (collide && placement !== 'header' && !head.querySelector('.head-tools')) {
        const tools = u.el('div', 'aside-tools', aside);
        decoy(tools, collide);
      }
      if (placement === 'aside') {
        submit = u.el('button', 'submit', aside, label);
        submit.type = 'button';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', ctx.submit);
      }
      if (placement === 'link') {
        submit = u.el('button', 'submit-link', aside, label + ' ›');
        submit.type = 'button';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', ctx.submit);
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
