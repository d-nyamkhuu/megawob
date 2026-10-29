/* BeOS-style desktop: Image Adjuster window with the task, a Preview decoy window, seeded instruction note. */
(function () {
  'use strict';
  // Decorative crops from the accepted screenshot; interactive controls remain DOM.
  function sprite(parent, box, cls) {
    const svg = env.util.svg('svg', {viewBox: box.join(' '), class: cls, 'aria-hidden': 'true'}, parent);
    env.util.svg('image', {href: 'sites/design-set-slider-multi-12/assets/reference-sprites.webp', width: 1672, height: 941}, svg);
    return svg;
  }
  function titlebar(u, parent, text, buttons) {
    const bar = u.el('div', 'bt-title', parent);
    const ic = sprite(bar, [153, 44, 30, 32], 'bt-ticon');
    ic.setAttribute('aria-hidden', 'true');
    u.el('span', 'bt-ttext', bar, text);
    if (buttons) {
      const b = u.el('span', 'bt-tbtns', bar);
      sprite(b, [1101, 45, 29, 31], 'bt-tbtn');
      sprite(b, [1134, 45, 29, 31], 'bt-tbtn');
    }
    return bar;
  }
  function eye(u, parent) {
    sprite(parent, [1258, 218, 75, 49], 'bt-eye');
  }
  function landscape(u, parent) {
    sprite(parent, [1193, 377, 415, 254], 'bt-photo');
    return;
    const svg = env.util.svg('svg', {viewBox: '0 0 100 62', class: 'bt-photo', preserveAspectRatio: 'none', 'aria-hidden': 'true'}, parent);
    const s = env.util.svg;
    s('rect', {width: 100, height: 62, fill: '#4f86c9'}, svg);
    s('path', {d: 'M0 28 L35 22 L52 8 L62 12 L78 24 L100 26 L100 36 L0 36Z', fill: '#cfd6e0'}, svg);
    s('path', {d: 'M0 30 L100 30 L100 36 L0 36Z', fill: '#25492f'}, svg);
    s('rect', {y: 33, width: 100, height: 14, fill: '#1c3a28'}, svg);
    s('rect', {y: 47, width: 100, height: 15, fill: '#3e6a9c'}, svg);
    s('path', {d: 'M0 47 L100 47 L100 52 L0 52Z', fill: '#274d6e'}, svg);
    s('path', {d: 'M8 33 L12 12 L16 33Z M20 33 L24 16 L28 33Z M0 33 L4 18 L7 33Z', fill: '#16351f'}, svg);
  }
  function drawOverlay(ctx) {
    const u = ctx.util;
    if (ctx.initial) {
      const el = u.el('aside', 'reference-initial', document.querySelector('.bt-prev'));
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', 'Image preview');
      const dismiss = u.el('button', 'bt-bigprev', el);
      dismiss.type = 'button';
      eye(u, dismiss);
      const text = u.el('span', 'bt-bigtxt', dismiss);
      u.el('b', '', text, 'Preview');
      u.el('small', '', text, 'Click to preview changes');
      dismiss.onclick = () => ctx.dismiss('preview');
      return {el, dismiss};
    }
    const el = u.el('aside', 'bt-win survey-drawer overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const survey = ctx.kind === 'chat';
    const title = {chat: 'Feedback', cookie: 'Privacy', toast: 'Notice', promo: 'Upgrade', banner: 'System notice'}[ctx.kind];
    titlebar(u, el, title, false);
    const x = u.el('button', 'survey-x', el, '×'); x.setAttribute('aria-label', 'Close notice'); x.onclick = () => ctx.dismiss('close');
    const body = u.el('div', 'bt-dlg', el);
    if (survey) {
      u.el('p', 'survey-intro', body, 'Quick survey (2 questions)');
      u.el('div', 'survey-question', body, '1. How easy was it to find what you needed today?');
      const choices = u.el('div', 'survey-choices', body);
      ['Very easy', 'Somewhat easy', 'Neither easy nor difficult', 'Somewhat difficult', 'Very difficult'].forEach((label) => {
        const row = u.el('label', '', choices); const radio = u.el('input', '', row); radio.type = 'radio'; radio.name = 'ease'; radio.value = label; u.el('span', '', row, label);
      });
      u.el('div', 'survey-question second', body, '2. What could we improve?');
      const dropdown = u.el('div', 'survey-dropdown', body);
      const toggle = u.el('button', 'survey-select', dropdown, 'Select an option…'); toggle.type = 'button'; toggle.setAttribute('aria-expanded', 'false');
      const options = u.el('div', 'survey-options', dropdown); options.hidden = true;
      for (const label of ['Finding records', 'Image quality', 'Help and guidance']) { const b = u.el('button', '', options, label); b.type = 'button'; b.onclick = () => { toggle.textContent = label; options.hidden = true; toggle.setAttribute('aria-expanded', 'false'); }; }
      toggle.onclick = () => { options.hidden = !options.hidden; toggle.setAttribute('aria-expanded', String(!options.hidden)); };
    } else {
      u.el('p', 'survey-intro', body, {cookie: 'This app can remember your display preferences.', toast: 'The image is ready for editing.', promo: 'Discover more tools for your desktop.', banner: 'The image tools are available offline.'}[ctx.kind]);
    }
    const dismiss = u.el('button', 'primary survey-close', body, survey ? 'Close survey' : ctx.kind === 'cookie' ? 'Reject optional' : 'Dismiss'); dismiss.type = 'button'; dismiss.onclick = () => ctx.dismiss('dismiss');
    return {el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0};
  }
  env.site({name: 'design-set-slider-multi-12', styles: ['site.css'], scripts: [], initialOverlay: {kind: 'chat'},
    frame(ctx) {
      const u = ctx.util;
      // Narrow desktops keep the task note in the main window instead of squeezing a side card.
      const display = ctx.display === 'panel' && window.innerWidth < 1180 ? 'header' : ctx.display;
      document.body.className = `beos instruction-${display}`;
      // desktop icons
      const icons = u.el('div', 'bt-icons', document.body);
      const S = env.util.svg;
      const shapes = {
        Home(s) { S('path', {d: 'M4 14 h16 l4 5 h36 v34 h-56Z', fill: '#f3c64a', stroke: '#6b5210', 'stroke-width': 2}, s); },
        Applications(s) { S('circle', {cx: 32, cy: 32, r: 26, fill: '#1f6fd0', stroke: '#0a2a60', 'stroke-width': 2}, s); S('path', {d: 'M18 20 q10 -8 18 2 q-8 8 -4 16 q-10 4 -14 -18Z M40 36 q10 -2 12 8 q-8 10 -14 4Z', fill: '#4cae4c'}, s); },
        Documents(s) { S('rect', {x: 12, y: 6, width: 40, height: 52, fill: '#f4f4f8', stroke: '#334', 'stroke-width': 2}, s); S('path', {d: 'M18 18h28M18 26h28M18 34h28M18 42h20', stroke: '#2a4aa0', 'stroke-width': 3}, s); },
        Trash(s) { S('path', {d: 'M14 16 h36 l-4 42 h-28Z', fill: '#c4c8cf', stroke: '#333', 'stroke-width': 2}, s); S('path', {d: 'M10 14 h44 M26 8 h12 M24 22 v30 M32 22 v30 M40 22 v30', stroke: '#333', 'stroke-width': 2.5}, s); },
      };
      ['Home', 'Applications', 'Documents', 'Trash'].forEach((n) => {
        const it = u.el('div', 'bt-icon', icons);
        const box = {Home: [38, 35, 47, 44], Applications: [38, 146, 47, 45], Documents: [39, 264, 43, 48], Trash: [38, 382, 47, 54]}[n];
        sprite(it, box, 'bt-glyph');
        u.el('div', '', it, n);
      });
      // main window
      const win = u.el('section', 'bt-win bt-main', document.body);
      titlebar(u, win, 'Image Adjuster', true);
      const tabs = u.el('div', 'bt-tabs', win);
      ['Adjust', 'Presets', 'Info'].forEach((t, i) => u.el('span', 'bt-tab' + (i ? '' : ' on'), tabs, t));
      const note = u.el('div', 'bt-note', win);
      const instruction = u.el('div', 'instruction', note, ctx.instruction);
      if (display === 'hidden') note.hidden = true;
      if (display === 'toast') {
        const close = u.el('button', 'instruction-close', note, 'Close');
        close.onclick = () => { note.hidden = true; };
      }
      const stage = u.el('main', 'bt-stage', win); stage.dataset.role = 'stage';
      const actions = u.el('div', 'bt-actions', win);
      const reset = u.el('button', 'bt-btn reset', actions, 'Reset'); reset.type = 'button'; reset.dataset.action = 'reset';
      reset.onclick = () => env.log('decoy', {label: 'Reset'});
      const endRng = ctx.rng.fork('chrome/end');
      const labelOf = (x) => typeof x === 'string' ? x : x.label || x.text || x.name;
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = endRng.bool(0.5);
      const placement = referenceEnd ? 'footer' : endRng.pick(['toolbar', 'link']);
      const endLabel = referenceEnd ? 'Submit' : endRng.pick(endLabels);
      const tools = u.el('div', 'bt-endtools', win);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el('button', placement === 'link' ? 'bt-endlink' : 'bt-btn primary', placement === 'toolbar' ? tools : actions, endLabel);
        submit.type = 'button'; submit.dataset.role = 'submit'; submit.title = endLabel; submit.setAttribute('aria-label', endLabel);
        submit.onclick = () => ctx.submit();
      }
      const collideRng = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && collideRng.bool(0.3)) {
        const choices = [...new Set(endLabels)].filter((label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (choices.length) {
          const label = collideRng.pick(choices);
          const decoy = u.el('button', 'bt-btn bt-xtra', tools, label);
          decoy.type = 'button'; decoy.dataset.role = 'xtra';
          decoy.onclick = () => env.log('decoy', {label, collide: true});
        }
      }
      // preview window (decoy)
      const pw = u.el('section', 'bt-win bt-prev', document.body);
      titlebar(u, pw, 'Preview', true);
      const big = u.el('button', 'bt-bigprev', pw); big.type = 'button';
      big.dataset.role = 'xtra'; big.onclick = () => env.log('decoy', {label: 'Preview'});
      eye(u, big);
      const bt = u.el('span', 'bt-bigtxt', big);
      u.el('b', '', bt, 'Preview'); u.el('small', '', bt, 'Click to preview changes');
      const photo = u.el('div', 'bt-photobox', pw); landscape(u, photo);
      if (display === 'panel') {
        photo.hidden = true;
        pw.appendChild(note);
        note.classList.add('bt-panelnote');
        const caption = u.el('div', 'bt-noteheading', note, 'Adjust — Task');
        note.insertBefore(caption, instruction);
      }
      const view = u.el('fieldset', 'bt-view', pw);
      u.el('legend', '', view, 'View');
      [['Fit to window', true], ['100% (actual size)', false]].forEach(([t, on]) => {
        const l = u.el('label', '', view); const r = u.el('input', '', l); r.type = 'radio'; r.name = 'view'; r.checked = on; r.disabled = true; u.el('span', '', l, t);
      });
      // taskbar
      const bar = u.el('footer', 'bt-bar', document.body);
      const logo = u.el('span', 'bt-logo', bar);
      sprite(logo, [24, 898, 73, 37], 'bt-brand');
      const task1 = u.el('span', 'bt-task', bar); sprite(task1, [152, 904, 28, 27], 'bt-appicon'); u.el('span', '', task1, 'Image Adjuster');
      const task2 = u.el('span', 'bt-task', bar); sprite(task2, [434, 904, 28, 27], 'bt-appicon'); u.el('span', '', task2, 'Preview');
      sprite(bar, [1485, 892, 187, 49], 'bt-tray');
      return {stage, submit};
    },
    overlay: drawOverlay,
  });
})();
