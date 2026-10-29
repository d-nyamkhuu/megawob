(function () {
  'use strict';
  env.site({
    name: 'design-pick-color-swatch-12',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'design aero';
      const shell = u.el('div', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const logo = u.el('div', 'logo', head);
      logo.innerHTML =
        '<svg viewBox="0 0 60 70" width="58" height="68"><defs><linearGradient id="leafshine" x1="0" y1="1" x2="1" y2="0"><stop stop-color="#168c1c"/><stop offset=".5" stop-color="#64bd16"/><stop offset="1" stop-color="#e0ef43"/></linearGradient></defs><path d="M6 58C-2 18 22 6 59 1C44 13 60 46 31 58C20 63 13 61 6 58Z" fill="url(#leafshine)"/><path d="M1 69Q23 31 53 7M13 49L10 30M21 38L39 36M27 29L25 13M34 22L47 20" stroke="#82c93d" stroke-width="1.5" fill="none"/></svg>';
      const lt = u.el('div', 'logo-text', logo);
      u.el('div', 'logo-name', lt, 'ColorMatch');
      u.el('div', 'logo-sub', lt, 'Find. Match. Create.');
      const nav = u.el('nav', 'nav', head);
      for (const label of ['Colors', 'Palettes', 'Help']) {
        const b = u.el('button', 'nav-item', nav, label);
        b.type = 'button';
        b.onclick = () => {
          env.log('menu', { label });
          env.log('decoy', { label });
        };
      }
      const intro = u.el('div', 'intro', head);
      u.el('div', 'intro-title', intro, 'Match Colors');
      u.el('div', 'intro-copy', intro, 'A simple way to compare and match colors with precision.');
      u.el('div', 'skyline', head);
      const goal = u.el('section', 'goal-card task-note', head);
      u.el('div', 'target-slot', goal);
      const display = ctx.display || 'header';
      if (display !== 'header') goal.classList.add('target-only');
      if (display !== 'hidden') {
        const note = u.el(
          'div',
          display === 'header' ? 'goal-text' : 'episode-note episode-note-' + display,
          display === 'header' ? goal : head,
        );
        if (display !== 'header') intro.hidden = true;
        u.el('div', 'goal-title', note, 'Your Goal');
        u.el('div', 'instruction', note, ctx.instruction);
      }
      const main = u.el('section', 'main-panel', shell);
      const banner = u.el('div', 'banner', main);
      u.el('div', 'leaves', banner);
      u.el('div', 'orb', banner);
      const bt = u.el('div', 'banner-text', banner);
      u.el('div', 'banner-title', bt, 'Tools are hidden to keep your focus');
      u.el('div', 'banner-copy', bt, 'Explore the color, then expand the tools to make your selection.');
      const exp = u.el('button', 'expand', bt);
      exp.type = 'button';
      exp.innerHTML =
        '<svg viewBox="0 0 20 12" width="22" height="14"><path d="M2 2l8 8 8-8" stroke="#fff" stroke-width="3" fill="none"/></svg><span>Expand tools</span>';
      exp.onclick = () => {
        main.classList.toggle('expanded');
        env.log('expand-tools', {});
      };
      const stage = u.el('main', 'stage', main);
      stage.dataset.role = 'workspace';
      // The task includes the upper Target swatch as well as the lower picker.
      // Keep the existing workspace geometry; register the whole workstation.
      const taskStage = u.el('div', 'task-stage', shell);
      taskStage.dataset.role = 'stage';
      const delta = u.el('div', 'difference-value', main, '—');
      delta.dataset.role = 'color-difference';
      delta.hidden = true;
      let submit = null;
      const er = ctx.rng.fork('chrome/end');
      const placement = er.pick(['reference', 'reference', 'header', 'link']);
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const labels = ctx.content.END_LABELS.map(labelOf);
      const label = placement === 'reference' ? 'Submit' : er.pick(labels);
      if (!ctx.finish) {
        submit = u.el(
          'button',
          'submit' + (placement === 'reference' ? '' : ' submit-' + placement),
          placement === 'header' ? head : main,
        );
        u.el('span', '', submit, label);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.onclick = () => ctx.submit();
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const options = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) {
          const text = cr.pick(options);
          const decoy = u.el('button', 'chrome-xtra', head, text);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.onclick = () => env.log('decoy', { label: text, collide: true });
        }
      }
      return { stage: taskStage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      u.el(
        'h3',
        '',
        box,
        {
          cookie: 'Console preferences',
          toast: 'Instrument notice',
          chat: 'Laboratory support',
          promo: 'Calibration reminder',
          banner: 'Workstation notice',
        }[kind],
      );
      u.el(
        'p',
        '',
        box,
        {
          cookie: 'Optional settings may be stored on this workstation.',
          toast: 'The calibration console is ready.',
          chat: 'Adjust the hue and saturation/value controls to match the target.',
          promo: 'Review the instrument profile before calibration.',
          banner: 'The instrument is operating with the Generic RGB profile.',
        }[kind],
      );
      const dismiss = u.el('button', 'dismiss', box, kind === 'cookie' ? 'Use default settings' : 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  });
})();
