(function () {
  'use strict';
  const cfg = {
    title: 'Text Transfer Utility',
    theme: 'win92',
    layout: 'document',
    tools: 'File     Edit     Help',
    side: 'Actions:|1. Select the requested source text.|2. Copy the selected text.|3. Paste it into the "Text" field.',
  };
  env.site({
    name: 'design-handle-text-copy-paste-08',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref win92 document';
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head, cfg.title);
      const controls = u.el('span', 'window-controls', title);
      controls.innerHTML =
        '<i class="app-icon"><b></b><b></b><b></b></i><i class="minimize"></i><i class="maximize"></i><i class="close"></i>';
      const menu = u.el('nav', 'tools', shell);
      cfg.tools.split(/\s{2,}/).forEach((x) => u.el('span', 'menu-item', menu, x));
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      const note = u.el('div', 'instruction', center, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display !== 'header';
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      const stage = u.el('div', 'stage', center);
      const aside = u.el('aside', 'inspector', work);
      aside.hidden = ctx.display === 'hidden';
      u.el('strong', 'aside-title', aside, 'Instructions:');
      const sideNote = u.el('p', 'aside-instruction', aside, ctx.instruction);
      sideNote.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') sideNote.classList.add('toast-side-note');
      cfg.side
        .split('|')
        .slice(1)
        .forEach((s, i) => u.el(i === 0 ? 'strong' : 'p', i === 0 ? 'aside-title' : 'action-item', aside, s));
      const foot = u.el('footer', 'footer', shell);
      const clear = u.el('button', 'clear-button', foot, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () => {
        const input = stage.querySelector('.ut-input');
        if (input) {
          input.value = '';
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
      let submit = null;
      const er = ctx.rng.fork('chrome/end');
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
      const label = er.bool(0.5) ? 'Submit' : String(er.pick(labels));
      const placement = er.pick(['footer', 'footer', 'toolbar', 'taskbar']);
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (cr.bool(0.3)) {
        const options = labels
          .map((x) => String(typeof x === 'string' ? x : x.label || x.text || x.name))
          .filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) collide = cr.pick(options);
      }
      const decoy = (parent, text) => {
        const b = u.el('button', 'end-xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
      };
      const makeSubmit = (parent, cls) => {
        const b = u.el('button', cls, parent, label);
        b.type = 'button';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', ctx.submit);
        return b;
      };
      if (!ctx.finish) {
        if (collide) decoy(menu, collide);
        if (placement === 'footer') {
          submit = makeSubmit(foot, 'submit');
        } else if (placement === 'toolbar') {
          submit = makeSubmit(menu, 'submit toolbar-submit');
        }
      }
      const taskbar = u.el('div', 'taskbar', document.body);
      u.el('div', 'start-button', taskbar, 'Program Manager');
      u.el('div', 'task-button', taskbar, 'Text Transfer Utility');
      u.el('div', 'clock', taskbar, '10:24 AM');
      if (!ctx.finish && placement === 'taskbar') {
        submit = makeSubmit(taskbar, 'submit taskbar-submit');
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
