/* Rivermere library: native HTML catalog frame, seeded task instruction and dismissible survey. */
(function () {
  'use strict';
  function books(parent) {
    const svg = env.util.svg('svg', { viewBox: '0 0 100 100', class: 'books', 'aria-hidden': 'true' }, parent);
    const u = env.util;
    u.svg('ellipse', { cx: 50, cy: 86, rx: 44, ry: 7, fill: '#c9c4b7' }, svg);
    for (const [x, y, w, h, color, angle] of [
      [12, 17, 14, 68, '#c1a17d', 8],
      [31, 13, 16, 74, '#be986d', 1],
      [47, 9, 19, 79, '#994527', 0],
      [67, 17, 22, 68, '#954c32', -2],
    ]) {
      const g = u.svg('g', { transform: `rotate(${angle} ${x + w / 2} ${y + h})` }, svg);
      u.svg(
        'path',
        { d: `M${x} ${y}l6 -3h${w}v${h}l-6 3h-${w}Z`, fill: color, stroke: '#50392b', 'stroke-width': 1.4 },
        g,
      );
      u.svg(
        'path',
        {
          d: `M${x} ${y}h${w}v${h}M${x + w} ${y}l6 -3M${x + 3} ${y + 6}h${w - 6}M${x + 3} ${y + 11}h${w - 6}M${x + 3} ${y + h - 8}h${w - 6}`,
          fill: 'none',
          stroke: '#513b2c',
        },
        g,
      );
      u.svg(
        'path',
        { d: `M${x + 4} ${y + 18}h${w - 8}M${x + 4} ${y + 21}h${w - 8}`, stroke: '#dabf96', fill: 'none' },
        g,
      );
    }
  }
  function drawOverlay(ctx) {
    const u = ctx.util;
    if (document.body.classList.contains('mixer-app')) {
      const el = u.el('aside', 'mixer-overlay overlay-' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      const dismiss = (reason) => {
        ctx.dismiss(reason);
      };
      const titles = {
        chat: 'Mixer support',
        cookie: 'Privacy preferences',
        toast: 'Audio Mixer',
        promo: 'Studio update',
        banner: 'System notice',
      };
      const copy = {
        chat: 'Need help balancing your channels? Support is available from your audio team.',
        cookie: 'This application stores only local mixer preferences.',
        toast: 'Your mixer settings are ready.',
        promo: 'Explore the latest tools for your audio workspace.',
        banner: 'Audio Mixer is running normally.',
      };
      u.el('h2', '', el, titles[ctx.kind] || 'Audio Mixer');
      const x = u.el('button', 'mixer-overlay-x', el, '×');
      x.type = 'button';
      x.setAttribute('aria-label', 'Close');
      x.onclick = () => dismiss('close');
      u.el('p', '', el, copy[ctx.kind] || '');
      const b = u.el('button', 'mixer-overlay-dismiss', el, ctx.kind === 'cookie' ? 'Dismiss optional' : 'Close');
      b.type = 'button';
      b.onclick = () => dismiss('dismiss');
      Object.assign(el.style, {
        position: 'fixed',
        zIndex: '40',
        right: '24px',
        bottom: '24px',
        width: '320px',
        padding: '20px',
        boxSizing: 'border-box',
        border: '1px solid #554765',
        borderRadius: '6px',
        background: '#292338',
        color: '#e9e4f2',
        boxShadow: '0 12px 36px #09070d99',
        font: '14px/1.4 Arial,sans-serif',
      });
      if (ctx.kind === 'banner')
        Object.assign(el.style, {
          left: '0',
          right: '0',
          top: '44px',
          bottom: 'auto',
          width: '100%',
          borderRadius: '0',
          padding: '12px 24px',
        });
      if (ctx.kind === 'toast') Object.assign(el.style, { width: '300px', bottom: '30px' });
      Object.assign(x.style, {
        position: 'absolute',
        right: '10px',
        top: '8px',
        border: '0',
        background: 'transparent',
        color: '#e9e4f2',
        font: '22px Arial,sans-serif',
      });
      Object.assign(b.style, {
        marginTop: '14px',
        padding: '6px 14px',
        border: '1px solid #675b79',
        borderRadius: '4px',
        background: '#393047',
        color: '#f1edf7',
        font: '14px Arial,sans-serif',
      });
      return { el, dismiss: b, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
    }
    const el = u.el('aside', 'survey-drawer overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const dismiss = (reason) => {
      if (ctx.initial) {
        document.body.classList.add('survey-closed');
        env.reanchor();
        env.log('reference-obstruction-dismiss', { reason });
      }
      ctx.dismiss(reason);
    };
    const survey = ctx.kind === 'chat';
    const title = {
      chat: 'We value your feedback',
      cookie: 'Your privacy matters',
      toast: 'Catalog notice',
      promo: 'Support your library',
      banner: 'Library service notice',
    }[ctx.kind];
    u.el('h2', '', el, title);
    const x = u.el('button', 'survey-x', el, '×');
    x.setAttribute('aria-label', 'Close notice');
    x.onclick = () => dismiss('close');
    if (survey) {
      u.el('p', 'survey-intro', el, 'Quick survey (2 questions)');
      u.el('hr', '', el);
      const q1 = u.el('div', 'survey-question', el, '1. How easy was it to find what you needed today?');
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
      for (const label of ['Finding records', 'Image quality', 'Help and guidance']) {
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
          cookie: 'This local catalog can remember your display preferences.',
          toast: 'The record is ready for editing.',
          promo: 'Discover the library’s growing digital archive.',
          banner: 'The digital catalog is available offline.',
        }[ctx.kind],
      );
    }
    const closeButton = u.el(
      'button',
      'primary survey-close',
      el,
      survey ? 'Close survey' : ctx.kind === 'cookie' ? 'Reject optional' : 'Dismiss',
    );
    closeButton.type = 'button';
    closeButton.onclick = () => dismiss('dismiss');
    return { el, dismiss: closeButton, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  env.site({
    name: 'design-set-slider-mixer-01',
    styles: ['site.css', 'mixer.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const endRng = ctx.rng.fork('chrome/end');
      const placement = endRng.pick(['header', 'header', 'footer', 'link']);
      const endLabels = ctx.content && ctx.content.END_LABELS;
      const endLabel = endRng.pick(
        Array.isArray(endLabels) && endLabels.length
          ? endLabels
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"],
      );
      const label =
        typeof endLabel === 'string' ? endLabel : endLabel.label || endLabel.text || endLabel.name || String(endLabel);
      const collideRng = ctx.rng.fork('chrome/collide');
      const collisionPool = (
        Array.isArray(endLabels) && endLabels.length
          ? endLabels
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"]
      )
        .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))
        .filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
      const collision = collideRng.bool(0.3) && collisionPool.length ? collideRng.pick(collisionPool) : null;
      let presentation = ctx.display;
      if (presentation === 'panel' && window.innerWidth < 1260) presentation = 'header';
      if (presentation === 'toast' && window.innerHeight < 700) presentation = 'header';
      document.body.className = `mixer-app instruction-${presentation}`;
      const head = u.el('header', 'mixer-header', document.body);
      u.el('span', 'app-mark', head, '≋');
      u.el('div', 'app-title', head, 'Audio Mixer');
      const windowButtons = u.el('div', 'window-buttons', head);
      u.el('span', 'window-min', windowButtons, '−');
      u.el('span', 'window-max', windowButtons, '□');
      u.el('span', 'window-close', windowButtons, '×');
      const controls = u.el('div', 'mixer-controls', head);
      let submit = null;
      const makeSubmit = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.onclick = () => ctx.submit();
        return b;
      };
      const body = u.el('div', 'mixer-body', document.body);
      if (presentation === 'header') u.el('div', 'instruction mixer-instruction', body, ctx.instruction);
      if (presentation === 'panel') {
        const panel = u.el('aside', 'instruction-panel', body);
        u.el('b', '', panel, 'Task');
        u.el('div', '', panel, ctx.instruction);
      }
      const stage = u.el('main', 'mixer-stage', body);
      stage.dataset.role = 'stage';
      stage.dataset.presentation = presentation;
      if (presentation === 'toast')
        u.el('div', 'instruction mixer-instruction instruction-toast', body, ctx.instruction);
      const footer = u.el('footer', 'mixer-footer', document.body);
      u.el('div', 'mixer-status', footer, '5 channels active');
      const footerControls = u.el('div', 'mixer-footer-controls', footer);
      if (!ctx.finish && placement === 'header') submit = makeSubmit(controls, 'primary header-submit', label);
      if (!ctx.finish && placement === 'footer') submit = makeSubmit(footerControls, 'primary', label);
      if (!ctx.finish && placement === 'link') {
        submit = u.el('a', 'footer-submit-link', footerControls, label);
        submit.href = '#';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.onclick = (e) => {
          e.preventDefault();
          ctx.submit();
        };
      }
      if (collision) {
        const decoy = u.el('button', 'end-xtra', controls, collision);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.onclick = () => env.log('decoy', { label: collision, collide: true });
      }
      return { stage, submit };
    },
    overlay: drawOverlay,
  });
})();
