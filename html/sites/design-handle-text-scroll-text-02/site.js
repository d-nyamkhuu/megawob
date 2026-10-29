(function () {
  'use strict';
  env.site({
    name: 'design-handle-text-scroll-text-02',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      const endRng = ctx.rng.fork('chrome/end');
      const originalEnd = endRng.bool(0.5);
      const endLabel = originalEnd
        ? 'Submit'
        : (
            (ctx.content && ctx.content.END_LABELS) || [
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
            ]
          ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))[
            endRng.int(
              0,
              (
                (ctx.content && ctx.content.END_LABELS) || [
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
                ]
              ).length - 1,
            )
          ];
      const endPlacement = originalEnd ? 'work' : endRng.pick(['header', 'footer']);
      const collideRng = ctx.rng.fork('chrome/collide');
      const endWords = (
        (ctx.content && ctx.content.END_LABELS) || [
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
        ]
      ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
      const collideChoices = endWords.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
      const collideLabel = collideChoices.length && collideRng.bool(0.3) ? collideRng.pick(collideChoices) : null;
      document.body.className = 'ref gnome centerstage';
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head);
      title.innerHTML =
        '<span class="app-icon">✿</span><strong>Reading Task - Word Finder</strong><span class="window-controls"><i>−</i><i>□</i><i>×</i></span>';
      const menu = u.el('nav', 'menubar', shell);
      menu.innerHTML = '<span>File</span><span>Edit</span><span>View</span><span>Help</span><b>⌄</b>';
      const work = u.el('div', 'work', shell);
      const tools = u.el('aside', 'toolbox', work);
      tools.innerHTML =
        '<h2>Tools</h2><div class="tool"><i><svg viewBox="0 0 48 48"><path d="M8 5h23l9 9v28H8z" fill="#fffaf0"/><path d="M31 5v10h9" fill="#e6ddca"/><path d="m12 34 3-9L32 8l8 8-17 17-9 3z" fill="#e9ad43"/><path d="m28 12 8 8M12 34l9-3"/></svg></i><span>New Task</span></div><div class="tool"><i><svg viewBox="0 0 48 48"><path d="M4 14h15l5 5h20v22H4z" fill="#e8a543"/><path d="M4 14h15l5 5H4z" fill="#ffd17a"/><path d="M4 20h40v21H4z" fill="#e5a13d"/></svg></i><span>Open Text</span></div><div class="tool"><i><svg viewBox="0 0 48 48"><path d="M9 5h30v38H9z" fill="#f8f6ef"/><path d="M14 5h20v11H14z" fill="#6d8ba8"/><path d="M16 24h16M16 29h16M16 34h16"/></svg></i><span>Save</span></div><div class="tool"><i><svg viewBox="0 0 48 48"><path d="M13 5h22v12H13zM10 17h28a5 5 0 0 1 5 5v13h-8v8H13v-8H5V22a5 5 0 0 1 5-5z" fill="#f5f4ee"/><path d="M13 31h22v12H13zM14 5h20v12H14z" fill="#d7d8d4"/><path d="M15 34h18M15 38h18M35 22h3"/></svg></i><span>Print</span></div>';
      const center = u.el('section', 'center', work);
      u.el('div', 'panel-heading', center, 'Task');
      const note = u.el('div', 'instruction', center, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      const stage = u.el('div', 'stage', center);
      const help = u.el('aside', 'helpbox', work);
      help.innerHTML =
        '<h2>Help</h2><div class="help-item"><i>?</i><span>Instructions</span></div><div class="help-item"><i>▤</i><span>Example Task</span></div>';
      const foot = u.el('footer', 'footer', shell);
      u.el('span', 'ready', foot, 'Ready');
      u.el('span', 'status-mid', foot, 'Ln 1, Col 1');
      u.el('span', 'zoom', foot, '100%');
      let submit = null;
      if (!ctx.finish) {
        const parent = endPlacement === 'header' ? menu : endPlacement === 'footer' ? foot : work;
        const cls =
          'submit' + (endPlacement === 'footer' ? ' end-footer' : endPlacement === 'header' ? ' end-header' : '');
        submit = u.el('button', cls, parent, endLabel);
        submit.type = 'button';
        submit.setAttribute('aria-label', endLabel);
        submit.title = endLabel;
        submit.addEventListener('click', ctx.submit);
      }
      if (collideLabel) {
        const decoy = u.el('button', 'end-xtra', menu, collideLabel);
        decoy.type = 'button';
        decoy.addEventListener('click', () => env.log('decoy', { label: collideLabel, collide: true }));
      }
      if (ctx.display === 'panel' && window.innerWidth >= 1180) {
        work.classList.add('panel-display');
        note.classList.add('instruction-panel');
        help.insertBefore(note, help.children[1]);
      } else if (ctx.display === 'toast' && window.innerHeight >= 680) {
        note.classList.add('instruction-toast');
        foot.classList.add('has-toast');
        foot.insertBefore(note, foot.children[1]);
      } else if (ctx.display !== 'header' && ctx.display !== 'hidden') {
        note.dataset.display = 'header';
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
