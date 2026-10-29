/* Image Studio: early Aqua utility window, narrow command rail, seeded task instruction. */
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  function svgIcon(parent, cls, html) {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 48 48');
    s.setAttribute('class', cls);
    s.setAttribute('aria-hidden', 'true');
    s.innerHTML =
      '<defs><linearGradient id="aqua-blue" x2="0" y2="1"><stop stop-color="#b9dfff"/><stop offset=".5" stop-color="#77b5f3"/><stop offset="1" stop-color="#397dbb"/></linearGradient><linearGradient id="aqua-metal" x2="0" y2="1"><stop stop-color="#fafcff"/><stop offset="1" stop-color="#b9cbdc"/></linearGradient></defs>' +
      html;
    parent.appendChild(s);
    return s;
  }
  const ICONS = {
    Edit: '<path d="M19 35h10l2 7H17z" fill="url(#aqua-metal)" stroke="#7f95ab"/><rect x="9" y="42" width="30" height="3" rx="1.5" fill="#eef5fb" stroke="#7f95ab"/><rect x="3" y="3" width="42" height="35" rx="3" fill="url(#aqua-metal)" stroke="#738aa1" stroke-width="1.5"/><rect x="7" y="7" width="34" height="26" fill="url(#aqua-blue)" stroke="#788fa8"/><path d="M7 30l11-12 9 8 7-11 7 15v3H7z" fill="#3b6895"/><path d="M15 21l3-3 3 4-3-1zM31 19l3-4 4 6-4-2z" fill="#eff8ff"/><circle cx="15" cy="13" r="2.5" fill="#ffffef"/><path d="M8 8h31v6C27 10 18 16 8 13z" fill="#fff" opacity=".25"/>',
    Effects:
      '<circle cx="24" cy="24" r="22" fill="url(#aqua-blue)" stroke="#5e81b0" stroke-width="1.7"/><path d="M4 31l10-13 10 10 8-13 12 17v3L24 43z" fill="#648f80"/><path d="M5 34l12-5 9 6 16-6c-3 11-12 15-19 15S8 40 5 34z" fill="#4a839c"/><path d="M9 11c8-8 22-9 29 0l-3 5c-9-5-15-2-24 2z" fill="#fff" opacity=".4"/><circle cx="33" cy="12" r="2" fill="#fff"/>',
    Adjust:
      '<path d="M13 5v32h31M5 13h32v31" fill="none" stroke="#557ba7" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><path d="M13 5v32h31M5 13h32v31" fill="none" stroke="#92bce6" stroke-width="2" stroke-linecap="round"/><path d="M17 17h15v15H17z" fill="none" stroke="#fff" stroke-width="1"/>',
    Filters:
      '<path d="M25 3c13 0 22 10 20 24S31 47 17 44 1 34 6 27s12-9 11-15S19 3 25 3z" fill="url(#aqua-blue)" stroke="#5b81ab" stroke-width="1.7"/><ellipse cx="27" cy="22" rx="5" ry="7" fill="#dbe9f1" stroke="#5b81ab"/><circle cx="26" cy="9" r="3" fill="#ffed86" stroke="#a8994f"/><circle cx="37" cy="17" r="3" fill="#ffdb61" stroke="#a8994f"/><circle cx="38" cy="29" r="3" fill="#fbed89" stroke="#a8994f"/><circle cx="29" cy="38" r="3" fill="#f2c958" stroke="#a8994f"/><circle cx="17" cy="36" r="3" fill="#fbed89" stroke="#a8994f"/><circle cx="11" cy="29" r="2.5" fill="#ffdd6c"/><path d="M20 6c8-3 18 3 20 8-9-7-18-4-20 2z" fill="#fff" opacity=".3"/>',
    Preferences:
      '<path d="M20 3h7l1 6 4 2 5-3 5 5-3 5 2 4 6 1v7l-6 1-2 4 3 5-5 5-5-3-4 2-1 5h-7l-1-5-4-2-5 3-5-5 3-5-2-4-6-1v-7l6-1 2-4-3-5 5-5 5 3 4-2z" transform="translate(1 -1) scale(.95)" fill="url(#aqua-metal)" stroke="#6b88a6" stroke-width="1.8" stroke-linejoin="round"/><circle cx="24" cy="24" r="9" fill="#dce8f5" stroke="#6b88a6" stroke-width="2"/>',
    Help: '<circle cx="24" cy="24" r="22" fill="url(#aqua-blue)" stroke="#507aae" stroke-width="1.7"/><text x="24" y="37" text-anchor="middle" font-size="37" font-weight="bold" fill="#fff" stroke="#6b91b9" stroke-width=".6" font-family="Arial,sans-serif">?</text><path d="M7 13C14 2 34 1 41 13c-12-5-21-3-34 0z" fill="#fff" opacity=".25"/>',
  };
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('aside', 'survey-drawer overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const title = {
      chat: 'We value your feedback',
      cookie: 'Your privacy matters',
      toast: 'Notice',
      promo: 'Image Studio Pro',
      banner: 'Service notice',
    }[ctx.kind];
    u.el('h2', '', el, title);
    const x = u.el('button', 'survey-x', el, '×');
    x.setAttribute('aria-label', 'Close notice');
    x.onclick = () => ctx.dismiss('close');
    if (ctx.kind === 'chat') {
      u.el('p', 'survey-intro', el, 'Quick survey (2 questions)');
      u.el('div', 'survey-question', el, '1. How easy was it to adjust your image today?');
      const choices = u.el('div', 'survey-choices', el);
      ['Very easy', 'Somewhat easy', 'Neither', 'Somewhat difficult', 'Very difficult'].forEach((label) => {
        const row = u.el('label', '', choices);
        const radio = u.el('input', '', row);
        radio.type = 'radio';
        radio.name = 'ease';
        radio.value = label;
        u.el('span', '', row, label);
      });
      u.el('div', 'survey-question second', el, '2. What could we improve?');
      const dropdown = u.el('div', 'survey-dropdown', el);
      const toggle = u.el('button', 'survey-select', dropdown, 'Select an option…');
      toggle.type = 'button';
      toggle.setAttribute('aria-expanded', 'false');
      const options = u.el('div', 'survey-options', dropdown);
      options.hidden = true;
      for (const label of ['Image quality', 'Tool layout', 'Help and guidance']) {
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
          cookie: 'This app can remember your display preferences.',
          toast: 'Your adjustments are ready to apply.',
          promo: 'Discover more filters and effects.',
          banner: 'A new version is available.',
        }[ctx.kind],
      );
    }
    const dismiss = u.el(
      'button',
      'primary survey-close',
      el,
      ctx.kind === 'chat' ? 'Close survey' : ctx.kind === 'cookie' ? 'Reject optional' : 'Dismiss',
    );
    dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('dismiss');
    return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  env.site({
    name: 'design-set-slider-horizontal-06',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const endRng = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const placement = endRng.pick(['footer', 'footer', 'header', 'link']);
      const endLabel = placement === 'footer' ? 'Submit' : endRng.pick(endLabels.filter((label) => label !== 'Submit'));
      const collideRng = ctx.rng.fork('chrome/collide');
      const collide = collideRng.bool(0.3)
        ? collideRng.pick(endLabels.filter((label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase()))
        : null;
      const decoyBtn = (parent, cls, label, collides = false) => {
        const b = u.el('button', cls, parent, label);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.onclick = () => env.log('decoy', collides ? { label, collide: true } : { label });
        return b;
      };
      document.body.className = `aqua instruction-${ctx.display}`;
      const bar = u.el('header', 'titlebar', document.body);
      const lights = u.el('div', 'lights', bar);
      u.el('i', 'l-red', lights);
      u.el('i', 'l-yel', lights);
      u.el('i', 'l-grn', lights);
      u.el('div', 'wtitle', bar, 'Image Studio');
      const search = u.el('div', 'search', bar);
      svgIcon(
        search,
        'mag',
        '<circle cx="20" cy="20" r="12" fill="none" stroke="#5a6b86" stroke-width="5"/><path d="M29 29l14 14" stroke="#5a6b86" stroke-width="6" stroke-linecap="round"/>',
      );
      u.el('span', '', search, 'Search');

      const shell = u.el('div', 'shell', document.body);
      const rail = u.el('nav', 'rail', shell);
      for (const name of ['Edit', 'Effects', 'Adjust', 'Filters', 'Preferences', 'Help']) {
        const b = u.el('div', 'rail-item' + (name === 'Edit' ? ' on' : ''), rail);
        svgIcon(b, 'ico', ICONS[name]);
        u.el('span', '', b, name);
      }

      const content = u.el('section', 'content', shell);
      const head = u.el('div', 'head', content);
      u.el('h1', '', head, 'Adjust Image');
      const headTools = u.el('div', 'head-tools', head);
      const resetAll = u.el('button', 'reset-all', headTools);
      resetAll.type = 'button';
      resetAll.dataset.action = 'reset';
      svgIcon(
        resetAll,
        'ri',
        '<path d="M38 24a14 14 0 1 1-5-10.7" fill="none" stroke="#2f6fc7" stroke-width="5"/><path d="M26 4l12 4-8 10z" fill="#2f6fc7"/>',
      );
      u.el('span', '', resetAll, 'Reset All');

      const panes = u.el('div', 'panes', content);
      const photo = u.el('div', 'photo', panes);
      const sv = document.createElementNS(NS, 'svg');
      sv.setAttribute('viewBox', '0 0 400 360');
      sv.setAttribute('preserveAspectRatio', 'xMidYMid slice');
      sv.setAttribute('class', 'scene');
      sv.setAttribute('role', 'img');
      sv.setAttribute('aria-label', 'Mountain lake photo');
      sv.innerHTML =
        '<defs><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3f86e0"/><stop offset="1" stop-color="#a9d0f5"/></linearGradient><linearGradient id="lk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5f9ad6"/><stop offset="1" stop-color="#1f5ca8"/></linearGradient></defs><rect width="400" height="360" fill="url(#sk)"/><path d="M0 190l40-25 50-10 40-35 30 20 40-25 50 30 40-15 50 25 60-10v70H0z" fill="#6b84a8"/><path d="M90 155l40-35 15 10 25-15 20 20-25 15-30-5z" fill="#f3f6fa" opacity=".9"/><path d="M0 200l60-20 80 10 120-5 140 15v20H0z" fill="#2c4a5e"/><path d="M0 205h400v10H0z" fill="#1d3a2a"/><path d="M0 200l25-30 15 20 20-35 20 40 25-30 25 35 30-25 40 30v20H0z" fill="#1f4a3a"/><path d="M215 215l15-70 10 30 10-60 12 50 10-70 12 70 10-50 12 60 12-80 12 80 12-30 14 70 12-40 12 55v10z" fill="#1f4a2c"/><path d="M250 215l30-120 20 40 15-60 25 70 20-30 30 110z" fill="#2a5a34"/><path d="M60 175l30-30 25 20-10-30 30 10 20 30z" fill="#e8eef6" opacity=".8"/><rect y="215" width="400" height="145" fill="url(#lk)"/><path d="M0 232l400-4v6L0 238z" fill="#2c5a3a" opacity=".7"/><path d="M230 235l60 90 40-70 30 100 40-120z" fill="#1f4a2c" opacity=".6"/><path d="M60 240l60 30 60-25 40 40-100 20z" fill="#d7e6f6" opacity=".5"/>';
      const lake = u.el('img', 'scene', photo);
      // Decode the photo in the paint that uses it, including the first reset.
      lake.decoding = 'sync';
      lake.loading = 'eager';
      lake.src = 'sites/design-set-slider-horizontal-06/assets/mountain-lake.webp';
      lake.alt = 'Snowy Alpine mountains and evergreen forest reflected in a blue lake';

      const controls = u.el('div', 'controls', panes);
      const tabs = u.el('div', 'tabs', controls);
      ['Basic', 'Color', 'Detail', 'Advanced'].forEach((t, i) => u.el('div', 'tab' + (i === 0 ? ' on' : ''), tabs, t));
      const stage = u.el('main', 'record-stage', controls);
      stage.dataset.role = 'stage';
      const instruction = u.el('div', 'instruction', controls, ctx.instruction);
      if (ctx.display === 'hidden') instruction.hidden = true;
      if (ctx.display === 'toast') {
        const close = u.el('button', 'instruction-close', instruction, '×');
        close.setAttribute('aria-label', 'Close instruction');
        close.onclick = () => {
          instruction.style.visibility = 'hidden';
        };
      }

      const foot = u.el('footer', 'foot', content);
      decoyBtn(foot, 'btn wide', 'Preview Original');
      let submit = null;
      const endBtn = (parent, cls) => {
        const b = u.el('button', cls, parent, endLabel);
        b.type = 'button';
        b.title = endLabel;
        b.setAttribute('aria-label', endLabel);
        b.dataset.role = 'submit';
        b.onclick = () => ctx.submit();
        return b;
      };
      if (collide) decoyBtn(headTools, 'reset-all', collide, true);
      if (!ctx.finish && placement === 'header') submit = endBtn(headTools, 'btn primary end-header');
      if (!ctx.finish && placement === 'link') submit = endBtn(foot, 'btn end-link');
      u.el('div', 'spacer', foot);
      decoyBtn(foot, 'btn', 'Cancel');
      if (!ctx.finish && placement === 'footer') submit = endBtn(foot, 'btn primary');
      return { stage, submit };
    },
    overlay: drawOverlay,
  });
})();
