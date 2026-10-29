/* Rivermere library: native HTML catalog frame, seeded task instruction and dismissible survey. */
(function () {
  'use strict';
  const assetBase =
    document.currentScript && document.currentScript.src ? new URL('.', document.currentScript.src).href : '';
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
    name: 'design-set-slider-media-02',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const endRng = ctx.rng.fork('chrome/end');
      const placement = endRng.pick(['header', 'header', 'footer', 'note']);
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
      document.body.className = `extranet instruction-${ctx.display}`;
      const artStyle = document.createElement('style');
      artStyle.textContent = `.extranet .slm-video{background-color:#000!important;background-image:url("${assetBase}assets/presenter-frame.webp")!important;background-size:auto 100%!important;background-repeat:no-repeat!important;background-position:center center!important}.extranet .cover-art{background-image:url("${assetBase}assets/city-skyline.webp")!important;background-size:cover!important;background-position:center 56%!important}`;
      document.head.append(artStyle);
      const head = u.el('header', 'masthead', document.body);
      const brand = u.el('div', 'brand', head);
      u.el('h1', '', brand, 'Horizon Systems');
      u.el('div', 'masthead-tag', brand, 'EXTRANET MEDIA LIBRARY');
      const links = u.el('nav', 'utility-links', head);
      ['People', 'Departments', 'Resources', 'Help'].forEach((x, i) => {
        if (i) u.el('span', 'separator', links, '|');
        u.el('span', '', links, x);
      });
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
      const tabs = u.el('nav', 'section-tabs', document.body);
      ['Training', 'Product Info', 'Marketing', 'Sales Tools', 'Technical', 'Company'].forEach((x) =>
        u.el('div', 'section-tab', tabs, x),
      );
      const search = u.el('div', 'search-tools', tabs);
      const input = u.el('input', '', search);
      input.value = 'Search Media Library';
      input.setAttribute('aria-label', 'Search Media Library');
      const go = u.el('button', '', search, 'Go');
      go.type = 'button';
      if (!ctx.finish && placement === 'header') submit = makeSubmit(search, 'primary header-submit', label);
      const main = u.el('div', 'extranet-main', document.body);
      const summary = u.el('section', 'record-summary', main);
      const cover = u.el('div', 'cover-art', summary);
      const details = u.el('div', 'summary-primary', summary);
      u.el('h2', 'record-title', details, ctx.spec.title || 'Horizon Product Overview');
      const meta = u.el('div', 'summary-meta', details);
      [
        ['Type:', 'Video'],
        ['Length:', '12:48'],
        ['Published:', 'Mar 10, 1999'],
        ['Category:', 'Product Info'],
        [
          'Description:',
          'An introduction to the Horizon product line, with an overview of key features and customer benefits.',
        ],
      ].forEach(([a, b]) => {
        u.el('b', '', meta, a);
        u.el('span', '', meta, b);
      });
      const meta2 = u.el('div', 'summary-secondary', summary);
      [
        ['Series:', 'Horizon Overview'],
        ['Presenter:', 'Alex Carter'],
        ['Format:', 'Windows Media (320x240)'],
        ['Size:', '56 MB'],
      ].forEach(([a, b]) => {
        u.el('b', '', meta2, a);
        u.el('span', '', meta2, b);
      });
      const instruction = u.el('div', 'instruction', details, ctx.instruction);
      if (ctx.display === 'hidden') instruction.hidden = true;
      if (ctx.display === 'toast') {
        const close = u.el('button', 'instruction-close', instruction, '×');
        close.onclick = () => {
          instruction.hidden = true;
        };
      }
      const work = u.el('div', 'work-area', main);
      const stage = u.el('main', 'record-stage', work);
      stage.dataset.role = 'stage';
      const related = u.el('section', 'related-panel', work);
      u.el('h2', '', related, 'Related Videos');
      const table = u.el('div', 'related-table', related);
      [
        ['Title', 'Length', 'Published'],
        ['Horizon Product Overview', '12:48', 'Mar 10, 1999'],
        ['Getting Started', '8:21', 'Mar 10, 1999'],
        ['Key Features', '10:15', 'Mar 12, 1999'],
        ['Technology Overview', '9:03', 'Mar 15, 1999'],
        ['Customer Success Stories', '11:26', 'Mar 18, 1999'],
        ['Sales Demo', '14:32', 'Mar 20, 1999'],
        ['Technical Deep Dive', '16:48', 'Mar 22, 1999'],
        ['Implementation Plan', '9:54', 'Mar 24, 1999'],
        ['Support and Services', '7:19', 'Mar 26, 1999'],
      ].forEach((row, i) => {
        const tr = u.el('div', i ? 'related-row' : 'related-head', table);
        row.forEach((x) => u.el('span', '', tr, x));
      });
      const footer = u.el('footer', 'bottom-dock', document.body);
      const dock = [
        ['M3 11.5 12 4l9 7.5v8a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z', 'Home'],
        ['M4 3h16v18H4z M8 3v18 M16 3v18 M4 7h4m8 0h4m-12 5h4m4 0h4m-12 5h4m4 0h4', 'Media Library'],
        ['M6 2h9l5 5v15H6z M15 2v6h5 M9 12h8m-8 3h8m-8 3h6', 'Documents'],
        [
          'M8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8m8-1a3.5 3.5 0 1 0 0-7m-15 15c0-4 2.8-6 7-6s7 2 7 6v1H1zm14-5c4-.5 8 1.2 8 5v1h-6',
          'Contacts',
        ],
        ['M4 5h16v16H4z M8 2v6m8-6v6M4 10h16m-12 4h2m3 0h2m-7 4h2m3 0h2', 'Calendar'],
        ['M12 17v-1c0-2 3-2.5 3-6a3 3 0 0 0-6 0m3 11h.01M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20', 'Support'],
      ];
      dock.forEach(([path, x], i) => {
        const item = u.el('div', i === 1 ? 'dock-item selected' : 'dock-item', footer);
        const svg = u.svg('svg', { viewBox: '0 0 24 24', class: 'dock-icon', 'aria-hidden': 'true' }, item);
        u.svg(
          'path',
          {
            d: path,
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': 2,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
          },
          svg,
        );
        u.el('span', '', item, x);
      });
      const actions = u.el('div', 'dock-actions', footer);
      if (!ctx.finish && placement === 'footer') {
        submit = makeSubmit(actions, 'primary', label);
        document.body.classList.add('dock-has-submit');
      }
      if (!ctx.finish && placement === 'note') {
        submit = u.el('a', 'footer-submit-link', actions, label);
        submit.href = '#';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.onclick = (e) => {
          e.preventDefault();
          ctx.submit();
        };
        document.body.classList.add('dock-has-submit');
      }
      if (collision) {
        const parent = placement === 'header' ? actions : head;
        const decoy = u.el('button', 'end-xtra', parent, collision);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.onclick = () => env.log('decoy', { label: collision, collide: true });
      }
      return { stage, submit };
    },
    overlay: drawOverlay,
  });
})();
