(function () {
  'use strict';
  env.site({
    name: 'design-pick-color-hex-02',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'design notebook';
      const shell = u.el('div', 'shell', document.body);
      const title = u.el('header', 'title-bar', shell);
      const appIcon = u.el('div', 'app-icon', title);
      appIcon.innerHTML =
        '<svg viewBox="0 0 24 26" aria-hidden="true"><rect x="3" y="2" width="18" height="22" rx="3" fill="#ff955b" stroke="#ffc095"/><path d="M7 3v20M5 7h3M5 11h3M5 15h3M5 19h3M10 7h8M10 10h8M10 13h8M10 16h6" fill="none" stroke="#ffba83" stroke-width=".8"/></svg>';
      u.el('div', 'title', title, 'Color Notebook');
      const menus = u.el('nav', 'menus', title);
      for (const label of ['File', 'Edit', 'View', 'Tools', 'Help']) {
        const b = u.el('button', 'menu-item', menus, label);
        b.type = 'button';
        b.onclick = () => env.log('menu', { label });
      }
      const endRng = ctx.rng.fork('chrome/end');
      const labels = (
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
      ).map((x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)));
      const keepDefaultEnd = endRng.bool(0.5);
      const endLabel = keepDefaultEnd ? 'Submit' : endRng.pick(labels);
      const placement = keepDefaultEnd ? 'bottom' : endRng.pick(['title', 'shelf']);
      const collideRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (collideRng.bool(0.3)) {
        const candidates = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (candidates.length) collide = collideRng.pick(candidates);
      }
      const controls = u.el('div', 'window-controls', title);
      for (const [label, name] of [
        ['−', 'Minimize'],
        ['□', 'Maximize'],
        ['×', 'Close'],
      ]) {
        const b = u.el('button', 'window-button', controls, label);
        const path =
          name === 'Minimize'
            ? '<path d="M3 9h12"/>'
            : name === 'Maximize'
              ? '<rect x="4" y="4" width="11" height="11" rx=".5"/><path d="M6 2h11v11"/>'
              : '<path d="m3 3 12 12M15 3 3 15"/>';
        b.innerHTML =
          '<svg viewBox="0 0 18 18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.4">' +
          path +
          '</svg>';
        b.type = 'button';
        b.setAttribute('aria-label', name);
        b.onclick = () => env.log('window-control', { name });
      }
      const endButton = (parent, cls, text, icon) => {
        const b = u.el('button', cls, parent, icon ? '✓' : text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', text);
        b.title = text;
        b.onclick = () => ctx.submit();
        return b;
      };
      const titleTools = u.el('div', 'title-tools', title);
      if (collide) {
        const b = u.el('button', 'pq-xtra', titleTools, collide);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.onclick = () => env.log('decoy', { label: collide, collide: true });
      }
      let submit = null;
      if (!ctx.finish && placement === 'title') submit = endButton(titleTools, 'submit submit-title', endLabel);
      const tabs = u.el('div', 'tabs', shell);
      [
        ['Color', 'tab-color', 'on', 7.2],
        ['Text', 'tab-text', '', 11.4],
        ['Shapes', 'tab-shapes', '', 11.1],
        ['Image', 'tab-image', '', 11.2],
      ].forEach(([label, cls, on, w], i) => {
        const b = u.el('button', 'tab ' + cls + (on ? ' on' : ''), tabs);
        b.type = 'button';
        b.style.width = [10.1, 11.4, 11.1, 11.2][i] + '%';
        const icon = u.el('span', 'tab-ico', b);
        const art = [
          '<path fill="currentColor" d="M12 1a11 11 0 1 0 0 22h2a3 3 0 0 0 2-5c-2-2 0-4 2-4h2c5 0 3-13-8-13Z"/><g fill="#f7f5f1"><circle cx="7" cy="7" r="1.7"/><circle cx="13" cy="5" r="1.7"/><circle cx="18" cy="9" r="1.7"/><circle cx="5" cy="13" r="1.7"/></g>',
          '<path d="M4 3h16M12 3v19" fill="none" stroke="currentColor" stroke-width="2"/>',
          '<path d="M5 2h14l2 4v11l-3 4-6 2-6-2-3-4V6Z M3 15h18" fill="none" stroke="currentColor" stroke-width="1.8"/>',
          '<rect x="2" y="3" width="20" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="8" cy="8" r="1.6" fill="currentColor"/><path d="m3 18 6-6 4 4 4-6 4 7" fill="none" stroke="currentColor" stroke-width="1.8"/>',
        ];
        icon.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + art[i] + '</svg>';
        u.el('span', '', b, label);
        b.onclick = () => env.log('tab', { label });
      });
      if (!ctx.finish && placement === 'shelf') submit = endButton(tabs, 'submit submit-shelf', endLabel, true);
      u.el('h1', 'nb-head', shell, 'Pick a color');
      u.el('p', 'nb-sub', shell, 'Drag in the color area or adjust the sliders to choose a color.');
      u.el('div', 'right-rule', shell);
      let display = ctx.display || 'header';
      const size = ctx.size || { width: shell.clientWidth, height: shell.clientHeight };
      if (display === 'panel' && size.width && size.width < 1260) display = 'header';
      if (display === 'toast' && size.height && size.height < 700) display = 'header';
      const note = u.el('section', 'task-note', shell);
      const instruction = u.el('div', 'instruction', note, ctx.instruction);
      if (display === 'hidden') note.hidden = true;
      if (display === 'panel') note.classList.add('instruction-panel');
      if (display === 'toast') {
        note.classList.add('instruction-toast');
        shell.classList.add('has-instruction-toast');
        const b = u.el('button', 'note-close', note, '×');
        b.type = 'button';
        b.setAttribute('aria-label', 'Dismiss task note');
        b.onclick = () => {
          note.hidden = true;
          env.log('note-close');
        };
      }
      if (display !== 'hidden') {
        // Fit long instruction templates into the existing clear space, without moving the picker.
        const style = getComputedStyle(note);
        const room =
          shell.clientHeight * (display === 'toast' ? 0.052 : 0.105) -
          parseFloat(style.paddingTop) -
          parseFloat(style.paddingBottom) -
          2;
        let fontSize = parseFloat(getComputedStyle(instruction).fontSize);
        while (instruction.getBoundingClientRect().height > room && fontSize > 8) {
          fontSize -= 0.5;
          instruction.style.fontSize = fontSize + 'px';
        }
      }
      const stage = u.el('main', 'stage', shell);
      stage.dataset.role = 'stage';
      const delta = u.el('div', 'difference-value', shell, '');
      delta.dataset.role = 'color-difference';
      delta.hidden = true;
      if (!ctx.finish && placement === 'bottom') submit = endButton(shell, 'submit', endLabel);
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
        { cookie: 'Preferences', toast: 'Notice', chat: 'Support', promo: 'Reminder', banner: 'Notice' }[kind],
      );
      u.el(
        'p',
        '',
        box,
        {
          cookie: 'Optional settings may be stored on this computer.',
          toast: 'Color Notebook is ready.',
          chat: 'Drag in the color area or the hue strip to match the target.',
          promo: 'Review your notebook settings before continuing.',
          banner: 'Color Notebook is using the default profile.',
        }[kind],
      );
      const dismiss = u.el('button', 'dismiss', box, kind === 'cookie' ? 'Use default settings' : 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  });
})();
