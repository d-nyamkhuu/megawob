(function () {
  'use strict';
  env.site({
    name: 'design-pick-color-swatch-01',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'design laboratory';
      const shell = u.el('div', 'shell', document.body);
      const title = u.el('header', 'title-bar', shell);
      u.el('div', 'app-icon', title, 'ℒ');
      u.el('div', 'title', title, 'Chromatic Laboratory');
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
      for (const label of ['File', 'Tools', 'Calibration', 'Help']) {
        const b = u.el('button', 'menu-item', menus, label);
        b.type = 'button';
        b.onclick = () => env.log('menu', { label });
      }
      u.el('div', 'version', menu, 'ColSys v1.3.2  │  Workstation LX-2004');
      const note = u.el('section', 'task-note', shell);
      const instruction = u.el('div', 'instruction', note, ctx.instruction);
      const branding = u.el('div', 'console-brand', note);
      u.el('div', '', branding, 'Color Calibration Console');
      u.el('div', '', branding, 'Spectral Fidelity for a Brighter Tomorrow');
      const roomy = window.innerWidth >= 1260;
      let display = ctx.display || 'header';
      if ((display === 'panel' && !roomy) || (display === 'toast' && window.innerHeight < 700)) display = 'header';
      note.dataset.instruction = display;
      if (display === 'hidden') instruction.hidden = true;
      if (display === 'panel') {
        note.classList.add('instruction-panel');
        instruction.textContent = '';
        u.el('div', 'instruction-heading', instruction, 'Calibration task');
        u.el('div', 'instruction-copy', instruction, ctx.instruction);
      }
      if (display === 'toast') {
        note.classList.add('instruction-toast');
        const b = u.el('button', 'note-close', note, '×');
        b.type = 'button';
        b.setAttribute('aria-label', 'Close notice');
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
      let submit = null;
      let placement = null,
        label = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const common = er.bool(0.5);
        placement = common ? 'footer' : er.pick(['menu', 'link']);
        const labels = ctx.content && ctx.content.END_LABELS;
        const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        const options =
          Array.isArray(labels) && labels.length
            ? labels
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
        const standard = options.find((x) => labelOf(x).trim().toLowerCase() === 'submit') || options[0];
        label = labelOf(common ? standard : er.pick(options));
      }
      const collideRng = ctx.rng.fork('chrome/collide');
      const endWords = ctx.content && ctx.content.END_LABELS;
      const wordLabel = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      let collide = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const pool =
          Array.isArray(endWords) && endWords.length
            ? endWords.map(wordLabel)
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
        const candidates = [...new Set(pool)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (candidates.length) collide = collideRng.pick(candidates);
      }
      const endButton = (parent, cls, text, link) => {
        const b = u.el(link ? 'a' : 'button', cls, parent, text);
        if (link) b.href = '#';
        else b.type = 'button';
        b.dataset.role = 'submit';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.onclick = (e) => {
          e.preventDefault();
          ctx.submit();
        };
        return b;
      };
      const decoyButton = (parent) => {
        if (!collide) return;
        const b = u.el('button', 'end-xtra', parent, collide);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.onclick = () => env.log('decoy', { label: collide, collide: true });
      };
      const menuTools = u.el('div', 'menu-end-controls', menu);
      if (collide) decoyButton(menuTools);
      if (placement === 'menu') submit = endButton(menuTools, 'menu-submit', label, false);
      if (!ctx.finish && placement === 'footer') {
        submit = endButton(action, 'submit', label, false);
      } else if (!ctx.finish && placement === 'link') {
        action.classList.add('action-link-mode');
        submit = endButton(action, 'footer-end-link', label + ' ›', true);
      } else action.classList.add('action-empty');
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
