(function () {
  'use strict';
  const C = {
    'title': 'GeoTasks',
    'accent': '#1f6fdc',
    'bg': '#f4f6f9',
    'surface': '#ffffff',
    'font': '"Helvetica Neue", Helvetica, Arial, sans-serif',
  };
  env.site({
    name: 'design-click-point-bisect-10',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      let display = ctx.display || 'header';
      const viewport = (ctx.size && ctx.size.width) || document.documentElement.clientWidth;
      if (display === 'panel' && viewport < 1260) display = 'header';
      body.className = 'design gt' + (display === 'toast' ? ' has-instruction-toast' : '');
      body.classList.add('display-' + display);
      const root = document.documentElement;
      for (const [k, v] of Object.entries({
        bg: C.bg,
        panel: C.surface,
        fg: '#111',
        muted: '#555',
        line: '#cfd5dc',
        accent: C.accent,
      }))
        root.style.setProperty('--' + k, v);
      root.style.setProperty('--font', C.font);
      const shell = u.el('div', 'gt-shell', body);
      const nav = u.el('nav', 'gt-nav', shell);
      u.el('div', 'gt-brand', nav, C.title);
      for (const t of ['Home', 'Tasks', 'Reports', 'Settings']) {
        const a = u.el('a', t === 'Tasks' ? 'on' : '', nav, t);
      }
      u.el('div', 'gt-sp', nav);
      u.el('a', '', nav, 'Help');
      u.el('div', 'sep', nav);
      u.el('a', 'last', nav, 'Sign out');
      const main = u.el('div', 'gt-main', shell);
      const side = u.el('aside', 'gt-side', main);
      u.el('h4', 'side-title', side, display === 'panel' ? 'Instructions' : 'Task');
      u.el(
        'p',
        'side-copy',
        side,
        display === 'panel' ? ctx.instruction : 'Follow the instructions in the dialog and click in the diagram.',
      );
      const dlg = u.el('section', 'gt-dialog', main);
      const title = u.el('div', 'gt-title', dlg, 'Angle Bisector');
      u.el('span', '', title, 'Question 1 of 1');
      const note = u.el('section', 'gt-note task-note', dlg);
      u.el('div', 'note-label', note, '');
      u.el('div', 'instruction', note, ctx.instruction);
      if (display === 'hidden' || display === 'panel') note.hidden = true;
      const sw = u.el('div', 'gt-stage', dlg);
      const stage = u.el('main', 'stage', sw);
      stage.dataset.role = 'stage';
      const foot = u.el('footer', 'gt-foot', dlg);
      const clear = u.el('button', 'gt-btn clear', foot, 'Clear');
      clear.type = 'button';
      clear.onclick = () => {
        env.widgetDef.clear?.();
      };
      const reset = u.el('button', 'gt-btn', foot, 'Reset');
      reset.type = 'button';
      reset.onclick = () => {
        env.widgetDef.clear?.();
      };
      u.el('div', 'gt-sp', foot);
      let submit = null;
      const endR = ctx.rng.fork('chrome/end');
      const keepFooter = ctx.finish || endR.bool(0.5);
      const placement = keepFooter ? 'footer' : endR.pick(['title', 'nav']);
      const words = (ctx.content && ctx.content.END_LABELS) || [
        'Submit',
        'Done',
        'Finish',
        'Continue',
        'Save',
        'OK',
        'Confirm',
        'Apply',
        'Complete',
      ];
      const picked = keepFooter ? 'Submit' : endR.pick(words);
      const label =
        typeof picked === 'string' ? picked : (picked && (picked.label || picked.text || picked.name)) || 'Done';
      const decoyR = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && decoyR.bool(0.3)) {
        const opts = words
          .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name))
          .filter((x) => String(x).trim().toLowerCase() !== String(label).trim().toLowerCase());
        if (opts.length) collide = decoyR.pick(opts);
      }
      const endBtn = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', text);
        b.title = text;
        b.onclick = () => ctx.submit();
        return b;
      };
      if (!ctx.finish) {
        const decoy = (parent, text) => {
          const b = u.el('button', 'gt-xtra', parent, text);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.onclick = () => env.log('decoy', { label: text, collide: true });
        };
        if (placement === 'footer') {
          if (collide) decoy(foot, collide);
          submit = endBtn(foot, 'submit gt-btn primary', label);
        } else if (placement === 'title') {
          const tools = u.el('span', 'gt-title-tools', title);
          if (collide) decoy(tools, collide);
          submit = endBtn(tools, 'gt-title-submit', label);
        } else {
          const tools = u.el('div', 'gt-nav-tools', nav);
          if (collide) decoy(tools, collide);
          submit = endBtn(tools, 'gt-nav-submit', label);
        }
      }
      if (display === 'toast') {
        note.classList.add('instruction-toast');
        shell.appendChild(note);
        const x = u.el('button', 'note-close', note, '×');
        x.type = 'button';
        x.setAttribute('aria-label', 'Close');
        x.onclick = () => (note.style.visibility = 'hidden');
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const title = {
        cookie: 'Your privacy',
        toast: 'Changes saved',
        chat: 'Support',
        promo: 'Workspace update',
        banner: 'Service notice',
      }[kind];
      const text = {
        cookie: 'This application stores optional cookies.',
        toast: 'Your changes have been saved.',
        chat: 'Need a hand with this workspace?',
        promo: 'Explore the latest workspace features.',
        banner: 'You are viewing a shared workspace.',
      }[kind];
      const label = kind === 'cookie' ? 'Reject optional' : 'Close';
      u.el('h3', '', box, title);
      u.el('p', '', box, text);
      const dismiss = u.el('button', 'dismiss', box, label);
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      if (kind === 'cookie') {
        const accept = u.el('button', 'dismiss', box, 'Accept optional');
        accept.onclick = () => ctx.dismiss('accept');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  });
})();
