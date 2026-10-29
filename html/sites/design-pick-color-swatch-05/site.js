(function () {
  'use strict';
  env.site({
    name: 'design-pick-color-swatch-05',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'design laboratory';
      const endRng = ctx.rng.fork('chrome/end');
      const collideRng = ctx.rng.fork('chrome/collide');
      const labels = (
        ctx.content.END_LABELS || ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
      ).map((x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)));
      const endLabel = endRng.bool(0.5)
        ? 'Submit'
        : endRng.pick(labels.filter((x) => x.trim().toLowerCase() !== 'submit'));
      const placement = endRng.pick(['footer', 'footer', 'footer', 'header', 'link', 'header']);
      const collide = collideRng.bool(0.3)
        ? collideRng.pick(labels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase()))
        : null;
      const shell = u.el('div', 'shell', document.body);
      if (ctx.finish) shell.classList.add('finish-mode');
      const title = u.el('header', 'title-bar', shell);
      u.el('div', 'app-icon', title);
      u.el('div', 'title', title, 'Color Matcher');
      const controls = u.el('div', 'window-controls', title);
      for (const [label, name] of [
        ['−', 'Minimize'],
        ['□', 'Maximize'],
        ['×', 'Close'],
      ]) {
        const b = u.el('button', 'window-button', controls, label);
        b.type = 'button';
        b.setAttribute('aria-label', name);
        b.onclick = () => env.log('window-control', { name });
      }
      const menu = u.el('nav', 'menu-bar', shell);
      const menus = u.el('div', 'menus', menu);
      for (const label of ['File', 'Edit', 'Options', 'Help']) {
        const b = u.el('button', 'menu-item', menus, label);
        b.type = 'button';
        b.onclick = () => env.log('menu', { label });
      }
      const frameEnd = (parent, cls, text, icon = false) => {
        const b = u.el('button', cls, parent, icon ? '✓' : text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', text);
        b.title = text;
        b.onclick = () => ctx.submit();
        return b;
      };
      if (collide) {
        const b = u.el('button', 'menu-item end-xtra', menus, collide);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.onclick = () => env.log('decoy', { label: collide, collide: true });
      }
      let headerSubmit = null;
      if (!ctx.finish && placement === 'header') headerSubmit = frameEnd(menu, 'end-header', endLabel);
      if (!ctx.finish && placement === 'link') headerSubmit = frameEnd(menu, 'end-link', endLabel + ' ›');
      u.el('div', 'version', menu, 'ColSys v1.3.2  │  Workstation LX-2004');
      const note = u.el('section', 'task-note', shell);
      const instruction = u.el('div', 'instruction', note, ctx.instruction);
      // Keep longer seeded instructions within the gap above the target card.
      let instructionSize = 4;
      note.style.fontSize = instructionSize + 'cqh';
      while (instruction.getBoundingClientRect().height > shell.clientHeight * 0.145 && instructionSize > 2) {
        instructionSize -= 0.1;
        note.style.fontSize = instructionSize + 'cqh';
      }
      const branding = u.el('div', 'console-brand', note);
      u.el('div', '', branding, 'Color Calibration Console');
      u.el('div', '', branding, 'Spectral Fidelity for a Brighter Tomorrow');
      if (ctx.display === 'hidden') instruction.hidden = true;
      if (ctx.display === 'panel') note.classList.add('instruction-panel');
      if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        const b = u.el('button', 'note-close', note, '×');
        b.onclick = () => {
          instruction.style.visibility = 'hidden';
          b.hidden = true;
        };
      }
      const stage = u.el('main', 'stage', shell);
      stage.dataset.role = 'stage';
      const footer = u.el('footer', 'footer', shell);
      const rackLabel = (parent, text) => {
        const label = u.el('div', 'rack-label', parent);
        u.el('span', '', label, text);
      };
      const status = u.el('section', 'status-section', footer);
      rackLabel(status, 'CALIBRATION STATUS');
      const line = u.el('div', 'status-line', status);
      u.el('span', 'status-led', line);
      u.el('span', 'status-ready', line, 'Ready');
      u.el('span', 'status-divider', line, '│');
      u.el('span', 'status-copy', line, 'Adjust hue and saturation to match the target.');
      const difference = u.el('section', 'difference-section', footer);
      rackLabel(difference, 'COLOR DIFFERENCE (ΔE₀₀)');
      const delta = u.el('div', 'difference-value', difference, '—');
      delta.dataset.role = 'color-difference';
      const profile = u.el('section', 'profile-section', footer);
      rackLabel(profile, 'INSTRUMENT PROFILE');
      u.el('div', 'profile-line', profile, 'Display : Generic RGB');
      u.el('div', 'profile-line', profile, 'White Pt: D65   Gamma: 2.2');
      const action = u.el('div', 'action-section', footer);
      let submit = headerSubmit;
      if (!ctx.finish) {
        if (placement === 'footer') {
          submit = u.el('button', 'submit', action);
          u.el('span', '', submit, endLabel);
          submit.type = 'button';
          submit.dataset.role = 'submit';
          submit.setAttribute('aria-label', endLabel);
          submit.title = endLabel;
          submit.onclick = () => ctx.submit();
        }
      }
      return { stage, submit };
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
