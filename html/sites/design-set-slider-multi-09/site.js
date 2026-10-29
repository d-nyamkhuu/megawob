/* PixelPlay Photo Studio: Memphis-style document with a margin for the task and actions. */
(function () {
  'use strict';
  const PHOTO =
    '<img src="sites/design-set-slider-multi-09/assets/coastal-preview-v2.webp" alt="Sunset over a rocky Pacific coastal cove">';
  const IC = {
    reset:
      '<svg viewBox="0 0 24 24"><path d="M4 8a8 8 0 0 1 14-3M20 16a8 8 0 0 1-14 3M4 3v5h5M20 21v-5h-5" fill="none" stroke="#14163a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    preview:
      '<svg viewBox="0 0 24 24"><rect x="3.5" y="4.5" width="17" height="15" rx="2" fill="none" stroke="#14163a" stroke-width="2"/><path d="M5 17l4.5-5 3.5 4 2.5-3 3 4" fill="none" stroke="#14163a" stroke-width="2"/><circle cx="9" cy="9" r="1.5" fill="#14163a"/></svg>',
    compare:
      '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.2" fill="none" stroke="#14163a" stroke-width="2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1" stroke="#14163a" stroke-width="2" stroke-linecap="round"/></svg>',
  };
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('aside', 'survey-drawer overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const survey = ctx.kind === 'chat';
    const title = {
      chat: 'Quick feedback',
      cookie: 'Cookies',
      toast: 'Studio notice',
      promo: 'Try PixelPlay Plus',
      banner: 'Studio notice',
    }[ctx.kind];
    u.el('h2', '', el, title);
    const x = u.el('button', 'survey-x', el, '×');
    x.setAttribute('aria-label', 'Close notice');
    x.onclick = () => ctx.dismiss('close');
    if (survey) {
      u.el('p', 'survey-intro', el, 'Quick survey (2 questions)');
      u.el('div', 'survey-question', el, '1. How easy was this tool to use?');
      const choices = u.el('div', 'survey-choices', el);
      ['Very easy', 'Somewhat easy', 'Neither easy nor difficult', 'Somewhat difficult', 'Very difficult'].forEach(
        (label) => {
          const row = u.el('label', '', choices);
          const radio = u.el('input', '', row);
          radio.type = 'radio';
          radio.name = 'ease';
          radio.value = label;
          u.el('span', '', row, label);
        },
      );
      u.el('div', 'survey-question second', el, '2. What could we improve?');
      const dropdown = u.el('div', 'survey-dropdown', el);
      const toggle = u.el('button', 'survey-select', dropdown, 'Select an option…');
      toggle.type = 'button';
      toggle.setAttribute('aria-expanded', 'false');
      const options = u.el('div', 'survey-options', dropdown);
      options.hidden = true;
      for (const label of ['Finding tools', 'Image quality', 'Help and guidance']) {
        const b = u.el('button', '', options, label);
        b.type = 'button';
        b.onclick = () => {
          toggle.textContent = label;
          options.hidden = true;
          toggle.setAttribute('aria-expanded', 'false');
        };
      }
      toggle.onclick = () => {
        options.hidden = !options.hidden;
        toggle.setAttribute('aria-expanded', String(!options.hidden));
      };
    } else {
      u.el(
        'p',
        'survey-intro',
        el,
        {
          cookie: 'This studio can remember your display preferences.',
          toast: 'Your image is ready for editing.',
          promo: 'Discover more tools for your photos.',
          banner: 'The studio is available offline.',
        }[ctx.kind],
      );
    }
    const dismiss = u.el(
      'button',
      'primary survey-close',
      el,
      survey ? 'Close survey' : ctx.kind === 'cookie' ? 'Reject optional' : 'Dismiss',
    );
    dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('dismiss');
    return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  function shape(parent, cls, html) {
    const d = document.createElement('div');
    d.className = 'pp-shape ' + cls;
    if (html) d.innerHTML = html;
    parent.appendChild(d);
    return d;
  }
  env.site({
    name: 'design-set-slider-multi-09',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const endRng = ctx.rng.fork('chrome/end');
      const referenceEnd = endRng.bool(0.5);
      const endPlacement = referenceEnd ? 'margin' : endRng.pick(['header', 'footer-link']);
      const endLabel = referenceEnd ? 'Submit' : endRng.pick(endLabels.filter((label) => label !== 'Submit'));
      document.body.className = `pp instruction-${ctx.display}`;
      const page = u.el('div', 'pp-page', document.body);
      shape(page, 'circ-coral');
      shape(page, 'circ-lilac');
      shape(page, 'tri-coral');
      shape(page, 'tri-purple');
      shape(page, 'circ-pink');
      shape(page, 'dots');
      shape(page, 'divider');
      shape(
        page,
        'squiggle',
        '<svg viewBox="0 0 160 36"><path d="M5 18 Q18 -2 31 18 T57 18 T83 18 T109 18 T135 18 Q145 7 154 23" fill="none" stroke="#cbbdf0" stroke-width="11" stroke-linecap="round"/></svg>',
      );
      shape(
        page,
        'rays',
        '<svg viewBox="0 0 100 62"><g stroke="#ff7468" stroke-width="4" stroke-linecap="round"><path d="M18 14l14 20"/><path d="M54 4v26"/><path d="M88 16l-12 18"/><path d="M2 54l22 4"/></g></svg>',
      );
      const logo = u.el('div', 'pp-logo', page);
      const word = u.el('div', 'pp-word', logo);
      u.el('span', 'a', word, 'Pixel');
      u.el('span', 'b', word, 'Play');
      u.el('div', 'pp-sub', logo, 'PHOTO STUDIO');
      shape(page, 'tri-blue');
      u.el('div', 'pp-tag', page, 'SIMPLE TOOLS. BRIGHTER IDEAS.');
      const photo = u.el('div', 'pp-photo', page);
      photo.innerHTML = PHOTO;
      u.el('h1', 'pp-h', page, 'Image Adjustments');
      u.el('p', 'pp-hsub', page, 'Fine-tune your image with the sliders below.');
      const stage = u.el('main', 'record-stage', page);
      stage.dataset.role = 'stage';
      const bar = u.el('div', 'pp-bar', page);
      const reset = u.el('button', 'pp-btn', bar);
      reset.type = 'button';
      reset.dataset.action = 'reset';
      reset.innerHTML = IC.reset + '<span>Reset</span>';
      for (const k of ['preview', 'compare']) {
        const b = u.el('button', 'pp-btn', bar);
        b.type = 'button';
        b.setAttribute('aria-disabled', 'true');
        b.innerHTML = IC[k] + '<span>' + (k === 'preview' ? 'Preview' : 'Compare') + '</span>';
        b.onclick = () => env.log('decoy', { label: k === 'preview' ? 'Preview' : 'Compare' });
      }
      // Margin notes.
      const task = u.el('aside', 'pp-task', page);
      const instruction = u.el('div', 'instruction', task);
      instruction.classList.toggle('long', String(ctx.instruction).length > 135);
      instruction.classList.toggle('very-long', String(ctx.instruction).length > 220);
      const colors = ['#2f6df0', '#ff6b6b', '#7a4be0'];
      let ci = 0;
      String(ctx.instruction)
        .split(/(“[^”]*”)/)
        .forEach((part) => {
          if (/^“[^”]*”$/.test(part)) {
            const s = u.el('span', 'q', instruction, part);
            s.style.color = colors[ci++ % 3];
          } else if (part) instruction.appendChild(document.createTextNode(part));
        });
      if (ctx.display === 'hidden') instruction.hidden = true;
      if (ctx.display === 'toast') {
        const close = u.el('button', 'instruction-close', instruction, 'Close');
        close.onclick = () => {
          instruction.hidden = true;
        };
      }
      const acts = u.el('div', 'pp-acts', page);
      u.el('div', 'pp-acth', acts, 'ACTIONS');
      [
        [
          '#cfc4ee',
          ctx.display === 'hidden'
            ? 'Adjust the sliders to match your task.'
            : 'Adjust the sliders to match the values above.',
        ],
        ['#ff6b6b', 'Preview the image as you make changes.'],
        ['#bce9e0', ctx.finish ? 'When you’re ready, finish the task.' : `When you’re ready, click ${endLabel}.`],
      ].forEach(([c, t]) => {
        const r = u.el('div', 'pp-act', acts);
        u.el('i', '', r).style.background = c;
        u.el('span', '', r, t);
      });
      let submit = null;
      if (!ctx.finish) {
        submit = u.el('button', 'primary pp-submit end-' + endPlacement, page, endLabel);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.onclick = () => ctx.submit();
      }
      const collideRng = ctx.rng.fork('chrome/collide');
      if (collideRng.bool(0.3)) {
        const labels = endLabels.filter((label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        const label = collideRng.pick(labels);
        const decoy = u.el('button', 'pp-end-xtra', page, label);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.onclick = () => env.log('decoy', { label, collide: true });
      }
      // Keep long notes and their action list separate without moving the task stage.
      const scale = page.getBoundingClientRect().width / 1672;
      const noteBottom = ctx.display === 'hidden' ? 0 : task.getBoundingClientRect().bottom;
      const actionsTop = Math.max(acts.getBoundingClientRect().top, noteBottom + 24 * scale);
      acts.style.top = actionsTop + 'px';
      const actionsBottom = (page.getBoundingClientRect().height * 690) / 941;
      if (actionsTop + acts.offsetHeight > actionsBottom) acts.classList.add('compact');
      return { stage, submit };
    },
    overlay: drawOverlay,
  });
})();
