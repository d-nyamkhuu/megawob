/* Neo-brutalist stacked native windows: Visual Toolkit main window plus a smaller Reference window. */
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  function icon(parent, kind) {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 40 40');
    s.setAttribute('class', 'nav-icon');
    s.setAttribute('aria-hidden', 'true');
    const paths = {
      adjust: '<path d="M3 6h34M3 20h34M3 34h34" stroke="#111" stroke-width="5" stroke-linecap="round"/><circle cx="11" cy="6" r="5" fill="#111"/><circle cx="27" cy="20" r="5" fill="#111"/><circle cx="27" cy="34" r="5" fill="#111"/>',
      filters: '<circle cx="20" cy="20" r="18" fill="#111"/><path d="M13 8C2 14 4 30 18 33C8 25 8 15 13 8Z" fill="#e4e3de"/>',
      crop: '<path d="M10 2v28h28M2 10h28v28" fill="none" stroke="#111" stroke-width="5"/>',
      style: '<path d="M20 3C9 3 2 11 2 20s8 17 15 17c4 0 4-4 2-6-2-3 0-5 3-5h8c5 0 8-3 8-7C38 10 30 3 20 3z" fill="#111"/><circle cx="12" cy="18" r="3" fill="#fff"/><circle cx="19" cy="11" r="3" fill="#fff"/><circle cx="28" cy="13" r="3" fill="#fff"/>',
      settings: '<path d="M16 1h8l1 5 4 2 5-3 5 6-4 4 1 4 5 1v8l-5 1-2 4 3 5-6 5-4-4-4 1-1 5h-8l-1-5-4-2-5 3-5-6 4-4-1-4-5-1v-8l5-1 2-4-3-5 6-5 4 4 4-1z" transform="translate(2 0) scale(.86)" fill="#111"/><circle cx="20" cy="20" r="6" fill="currentColor"/>',
    };
    s.innerHTML = paths[kind];
    parent.append(s);
  }
  function winButtons(u, parent) {
    const box = u.el('div', 'win-btns', parent);
    u.el('span', 'wb wb-min', box);
    u.el('span', 'wb wb-max', box);
    const x = u.el('span', 'wb wb-x', box);
    x.innerHTML = '<svg viewBox="0 0 20 20"><path d="M3 3l14 14M17 3L3 17" stroke="#111" stroke-width="3"/></svg>';
  }
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('aside', 'nb-overlay overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const survey = ctx.kind === 'chat';
    const title = {chat: 'Quick survey', cookie: 'Privacy', toast: 'Notice', promo: 'Upgrade', banner: 'Service notice'}[ctx.kind];
    const bar = u.el('div', 'nb-ov-bar', el);
    u.el('span', '', bar, title);
    const x = u.el('button', 'survey-x', bar, '×');
    x.type = 'button';
    x.setAttribute('aria-label', 'Close notice');
    x.onclick = () => ctx.dismiss('close');
    const body = u.el('div', 'nb-ov-body', el);
    if (survey) {
      u.el('p', '', body, 'How easy was the toolkit to use today?');
      const choices = u.el('div', 'survey-choices', body);
      ['Very easy', 'Somewhat easy', 'Difficult'].forEach((label) => {
        const row = u.el('label', '', choices);
        const radio = u.el('input', '', row);
        radio.type = 'radio';
        radio.name = 'ease';
        radio.value = label;
        u.el('span', '', row, label);
      });
    } else {
      u.el('p', '', body, {cookie: 'This toolkit can remember your display preferences.', toast: 'Your adjustments are ready.', promo: 'Try the full toolkit.', banner: 'The toolkit is available offline.'}[ctx.kind]);
    }
    const dismiss = u.el('button', 'primary survey-close', body, survey ? 'Close survey' : ctx.kind === 'cookie' ? 'Reject optional' : 'Dismiss');
    dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('dismiss');
    return {el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0};
  }
  env.site({name: 'design-set-slider-range-06', styles: ['site.css'], scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const display = ctx.display === 'panel' && (window.innerWidth < 1260 || window.innerHeight < 700) ? 'header' : ctx.display;
      document.body.className = `nb instruction-${display}`;
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => typeof x === 'string' ? x : x.label || x.text || x.name;
      const labels = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = er.bool(0.5);
      const placement = referenceEnd ? 'footer' : er.pick(['header', 'link']);
      const endLabel = referenceEnd ? 'Submit' : er.pick(labels);
      const cr = ctx.rng.fork('chrome/collide');
      const collide = cr.bool(0.3) ? cr.pick(labels.filter((label) => label.toLowerCase() !== endLabel.toLowerCase())) : null;
      const decoyBtn = (button, collides = false) => {
        button.dataset.role = 'xtra';
        button.onclick = () => env.log('decoy', collides ? {label: button.textContent, collide: true} : {label: button.textContent});
      };
      const main = u.el('section', 'win win-main', document.body);
      const tb = u.el('header', 'titlebar', main);
      u.el('span', 'title', tb, 'VISUAL TOOLKIT');
      winButtons(u, tb);
      const body = u.el('div', 'win-body', main);
      const side = u.el('nav', 'sidebar', body);
      [['adjust', 'Adjust'], ['filters', 'Filters'], ['crop', 'Crop'], ['style', 'Style'], ['settings', 'Settings']].forEach(([k, label], i) => {
        const item = u.el('div', 'nav-item' + (i === 0 ? ' on' : ''), side);
        icon(item, k);
        u.el('span', '', item, label);
      });
      const content = u.el('div', 'content', body);
      u.el('h1', '', content, 'Image Adjustments');
      u.el('hr', '', content);
      const instruction = u.el('div', 'instruction', content, ctx.instruction);
      if (ctx.instruction.length > 75) instruction.classList.add('long');
      if (display === 'hidden') instruction.hidden = true;
      if (display === 'toast') {
        const close = u.el('button', 'instruction-close', instruction, 'Close');
        close.onclick = () => { instruction.classList.add('dismissed'); };
      }
      const stage = u.el('main', 'record-stage', content);
      stage.dataset.role = 'stage';
      const footer = u.el('footer', 'win-footer', main);
      const reset = u.el('button', 'btn btn-gray', footer, 'Reset');
      reset.type = 'button';
      reset.dataset.action = 'reset';
      decoyBtn(reset);
      u.el('span', 'spacer', footer);
      const cancel = u.el('button', 'btn btn-gray', footer, 'Cancel');
      cancel.type = 'button';
      decoyBtn(cancel);
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'header' ? tb : footer;
        submit = u.el(placement === 'link' ? 'a' : 'button', 'primary ' + (placement === 'header' ? 'end-toolbar' : placement === 'link' ? 'end-link' : 'btn btn-yellow'), parent, endLabel);
        if (placement === 'link') {
          submit.href = '#';
          footer.insertBefore(submit, reset);
        } else submit.type = 'button';
        if (placement === 'header') tb.insertBefore(submit, tb.querySelector('.win-btns'));
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.onclick = (event) => { event.preventDefault(); ctx.submit(); };
      }
      if (collide) {
        const decoy = u.el('button', 'end-xtra', tb, collide);
        decoy.type = 'button';
        tb.insertBefore(decoy, tb.querySelector('.win-btns'));
        decoyBtn(decoy, true);
      }
      // Secondary window: static guide, overlapping only the main window's frame.
      const ref = u.el('section', 'win win-ref', document.body);
      const rtb = u.el('header', 'titlebar', ref);
      u.el('span', 'title', rtb, 'REFERENCE');
      winButtons(u, rtb);
      const rb = u.el('div', 'ref-body', ref);
      u.el('h2', '', rb, 'Opacity Guide');
      u.el('hr', '', rb);
      const card = u.el('div', 'ref-card', rb);
      u.el('p', '', card, ctx.instruction);
      if (display === 'panel') card.prepend(instruction);
      const mini = u.el('div', 'mini', card);
      u.el('div', 'mini-fill', mini);
      u.el('span', 'mini-thumb a', mini);
      u.el('span', 'mini-thumb b', mini);
      const ticks = u.el('div', 'mini-ticks', card);
      for (let i = 0; i < 6; i++) u.el('i', '', ticks);
      u.el('div', 'ref-note', rb, 'Target values are within the slider range.');
      return {stage, submit};
    },
    overlay: drawOverlay,
  });
})();
