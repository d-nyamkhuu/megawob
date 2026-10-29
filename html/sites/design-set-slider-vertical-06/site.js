/* PhotoBright: glossy photo tools with seeded episode frame and dismissible notices. */
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
    const el = u.el('aside', 'survey-drawer overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const survey = ctx.kind === 'chat';
    const title = {
      chat: 'We value your feedback',
      cookie: 'Your privacy matters',
      toast: 'PhotoBright notice',
      promo: 'PhotoBright tips',
      banner: 'PhotoBright service notice',
    }[ctx.kind];
    u.el('h2', '', el, title);
    const x = u.el('button', 'survey-x', el, '×');
    x.setAttribute('aria-label', 'Close notice');
    x.onclick = () => ctx.dismiss('close');
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
          cookie: 'PhotoBright can remember your display preferences.',
          toast: 'Your photo is ready for editing.',
          promo: 'Explore the tools for brighter photos.',
          banner: 'Your photo tools are available offline.',
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
  env.site({
    name: 'design-set-slider-vertical-06',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const endRng = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = endRng.bool(0.5);
      const placement = referenceEnd ? 'inspector' : endRng.pick(['header', 'strip']);
      const endLabel = referenceEnd ? endLabels.find((x) => x === 'Submit') || 'Submit' : endRng.pick(endLabels);
      const collideRng = ctx.rng.fork('chrome/collide');
      const collideLabels = endLabels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
      const collide = collideRng.bool(0.3) && collideLabels.length ? collideRng.pick(collideLabels) : null;
      const endButton = (parent, cls) => {
        const button = u.el('button', cls, parent, endLabel);
        button.type = 'button';
        button.dataset.role = 'submit';
        button.title = endLabel;
        button.setAttribute('aria-label', endLabel);
        button.onclick = () => ctx.submit();
        return button;
      };
      const decoyButton = (parent, label) => {
        const button = u.el('button', 'fa-btn fa-xtra', parent, label);
        button.type = 'button';
        button.dataset.role = 'xtra';
        button.onclick = () => env.log('decoy', { label, collide: true });
      };
      const S = (tag, attrs, parent) => u.svg(tag, attrs, parent);
      document.body.className = `frutiger instruction-${ctx.display}`;
      const head = u.el('header', 'fa-header', document.body);
      const wave = S(
        'svg',
        { viewBox: '0 0 1672 80', preserveAspectRatio: 'none', class: 'fa-wave', 'aria-hidden': 'true' },
        head,
      );
      wave.innerHTML =
        '<path d="M0 0H1672V20C1430 80 1300-20 1110 18S850 85 655 33S300 25 0 42Z" fill="#fff" opacity=".22"/><path d="M500 0C720 0 850 75 1010 73S1160 4 1340 0H1672C1300-10 1240 22 1130 48S870 78 690 28Z" fill="#fff" opacity=".30"/>';
      const orb = S('svg', { viewBox: '0 0 48 48', class: 'fa-orb', 'aria-hidden': 'true' }, head);
      const defs = S('defs', {}, orb);
      const og = S('radialGradient', { id: 'orbg', cx: '48%', cy: '60%', r: '55%' }, defs);
      S('stop', { offset: '0', 'stop-color': '#1476ad' }, og);
      S('stop', { offset: '.45', 'stop-color': '#3dace3' }, og);
      S('stop', { offset: '.8', 'stop-color': '#a8e8fc' }, og);
      S('stop', { offset: '1', 'stop-color': '#55b9eb' }, og);
      const shine = S('radialGradient', { id: 'orbshine', cx: '35%', cy: '20%', r: '65%' }, defs);
      S('stop', { offset: '0', 'stop-color': 'white', 'stop-opacity': 1 }, shine);
      S('stop', { offset: '.55', 'stop-color': 'white', 'stop-opacity': 0.3 }, shine);
      S('stop', { offset: '1', 'stop-color': 'white', 'stop-opacity': 0 }, shine);
      S('circle', { cx: 24, cy: 24, r: 22, fill: 'url(#orbg)', stroke: '#d8efff', 'stroke-width': 2 }, orb);
      S('circle', { cx: 24, cy: 24, r: 20, fill: 'url(#orbshine)' }, orb);
      S(
        'path',
        { d: 'M9 33C14 47 38 46 42 24', fill: 'none', stroke: '#d6f7ff', 'stroke-width': 2, opacity: 0.7 },
        orb,
      );
      const brand = u.el('div', 'fa-brand', head);
      u.el('h1', '', brand, 'PhotoBright');
      u.el('div', 'fa-tag', brand, 'Simple Tools. Brighter Photos.');
      const links = u.el('nav', 'fa-links', head);
      ['Help', 'Settings', 'Sign Out'].forEach((t, i) => {
        if (i) u.el('i', '', links, '|');
        const a = u.el('a', '', links, t);
        a.onclick = () => env.log('decoy', { label: t });
      });
      let submit = null;
      if (!ctx.finish && placement === 'header') submit = endButton(head, 'fa-green fa-header-end');
      if (collide && placement !== 'header') decoyButton(links, collide);
      const main = u.el('div', 'fa-main', document.body);
      const work = u.el('section', 'fa-work', main);
      const instruction = u.el('div', 'instruction', work, ctx.instruction);
      if (ctx.display === 'panel') u.el('span', 'instruction-caption', instruction, 'Editing task');
      if (ctx.instruction.length > 64) instruction.classList.add('instruction-long');
      if (ctx.display === 'hidden') instruction.hidden = true;
      if (ctx.display === 'toast') {
        const close = u.el('button', 'instruction-close', instruction, 'Close');
        close.onclick = () => {
          instruction.hidden = true;
        };
      }
      const photoWrap = u.el('div', 'fa-photo-wrap', work);
      const photo = u.el('div', 'fa-photo', photoWrap);
      photo.setAttribute('role', 'img');
      photo.setAttribute('aria-label', 'Mountain lake with a wooden pier');
      const strip = u.el('div', 'fa-strip', work);
      const reset = u.el('button', 'fa-btn reset', strip);
      reset.type = 'button';
      reset.dataset.action = 'reset';
      reset.innerHTML =
        '<svg viewBox="0 0 24 24" width="26" height="26"><path d="M3 11a9 9 0 0 1 15-6M21 13a9 9 0 0 1-15 6" fill="none" stroke="#38a526" stroke-width="3"/><path d="M21 2v7h-7zM3 22v-7h7z" fill="#38a526"/></svg><span>Reset</span>';
      const orig = u.el('button', 'fa-btn', strip);
      orig.type = 'button';
      orig.innerHTML =
        '<svg viewBox="0 0 24 24" width="28" height="26"><rect x="1" y="2" width="22" height="19" rx="2" fill="#b9def4" stroke="#4279a2" stroke-width="1.4"/><circle cx="7" cy="7" r="2" fill="white"/><path d="M2 19l6-8 5 6 3-5 6 7z" fill="#fff" stroke="#5689b0"/></svg><span>Original</span>';
      const comp = u.el('button', 'fa-btn', strip);
      comp.type = 'button';
      comp.innerHTML =
        '<svg viewBox="0 0 24 24" width="28" height="26"><rect x="2" y="3" width="20" height="18" fill="#fff" stroke="#2a62a8" stroke-width="2"/><rect x="3" y="4" width="9" height="16" fill="#8fbdee"/><path d="M12 3v18" stroke="#2a62a8" stroke-width="2"/></svg><span>Compare</span>';
      orig.onclick = () => env.log('decoy', { label: 'Original' });
      comp.onclick = () => env.log('decoy', { label: 'Compare' });
      if (!ctx.finish && placement === 'strip') submit = endButton(strip, 'fa-green fa-strip-end');
      if (collide && placement === 'header') decoyButton(strip, collide);
      const insp = u.el('aside', 'fa-inspector', main);
      u.el('h2', 'fa-insp-title', insp, 'Adjustments');
      const rows = u.el('div', 'fa-static', insp);
      const icons = {
        Brightness:
          '<circle cx="16" cy="16" r="7" fill="none" stroke="#285580" stroke-width="1.4"/><path d="M16 2v5M16 25v5M2 16h5M25 16h5M6 6l4 4M22 22l4 4M26 6l-4 4M10 22l-4 4" stroke="#285580" stroke-width="1.4"/>',
        Contrast:
          '<circle cx="16" cy="16" r="14" fill="#fff" stroke="#285580" stroke-width="1.4"/><path d="M16 2a14 14 0 0 1 0 28z" fill="#285580"/>',
        Saturation:
          '<circle cx="16" cy="16" r="13" fill="#4aa8d8"/><path d="M16 16L16 3a13 13 0 0 1 11 6.5z" fill="#e8c93a"/><path d="M16 16L27 9.5a13 13 0 0 1 0 13z" fill="#e0453a"/><path d="M16 16L27 22.5A13 13 0 0 1 16 29z" fill="#a447c8"/><path d="M16 16L16 29A13 13 0 0 1 5 22.5z" fill="#3a6fd8"/><path d="M16 16L5 22.5a13 13 0 0 1 0-13z" fill="#3fbf6a"/>',
      };
      for (const name of ['Brightness', 'Contrast', 'Saturation']) {
        const row = u.el('div', 'fa-row', rows);
        const ic = S('svg', { viewBox: '0 0 32 32', class: 'fa-ico', 'aria-hidden': 'true' }, row);
        ic.innerHTML = icons[name];
        if (name === 'Saturation') ic.classList.add('fa-spectrum');
        const body = u.el('div', 'fa-row-body', row);
        u.el('div', 'fa-row-label', body, name);
        const trk = u.el('div', 'fa-mini', body);
        u.el('i', '', trk);
        u.el('div', 'fa-mini-val', row, '50');
      }
      const opw = u.el('div', 'fa-opacity', insp);
      const chk = u.el('div', 'fa-check', opw);
      const stage = u.el('main', 'record-stage', opw);
      stage.dataset.role = 'stage';
      if (!ctx.finish && placement === 'inspector') {
        const sub = u.el('div', 'fa-submit', insp);
        submit = endButton(sub, 'fa-green');
      } else insp.classList.add('fa-inspector-no-end');
      return { stage, submit };
    },
    overlay: drawOverlay,
  });
})();
