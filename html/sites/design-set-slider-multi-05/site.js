/* Dark developer image-adjust tool: narrow command rail, task note header, slider panel and preview pair. */
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const ICONS = {
    Adjust: '<rect x="4" y="4" width="20" height="20" rx="1.5"/><path d="M4 10h20M4 18h20"/>',
    Crop: '<path d="M8 3v17h17M3 8h17v17"/>',
    Filters: '<path d="M3 8h22M3 14h22M3 20h22"/><circle cx="17" cy="8" r="2.2" fill="#0f141b"/><circle cx="9" cy="14" r="2.2" fill="#0f141b"/><circle cx="18" cy="20" r="2.2" fill="#0f141b"/>',
    Layers: '<circle cx="14" cy="14" r="10"/><circle cx="14" cy="14" r="3.5"/>',
    Settings: '<circle cx="14" cy="14" r="3.5"/><path d="M11 3h6l1 3 3-1 3 4-2 3 3 2-1 5-4 0-1 4-5 1-2-3-3 1-4-3 1-4-3-2 2-5 3 0z"/>',
  };
  function icon(parent, name) {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 28 28');
    s.setAttribute('class', 'rail-ico');
    s.setAttribute('fill', 'none');
    s.setAttribute('stroke', 'currentColor');
    s.setAttribute('stroke-width', '1.8');
    s.innerHTML = ICONS[name];
    parent.append(s);
  }
  // Task text with the quoted names bold and the target numbers in the accent color.
  function fillInstruction(el, text) {
    for (const part of String(text).split(/(“[^”]*”|(?<![±\d.])-?\d+(?:\.\d+)?)/)) {
      if (!part) continue;
      if (/^“/.test(part)) { const b = document.createElement('b'); b.textContent = part; el.append(b); }
      else if (/^-?\d/.test(part)) { const n = document.createElement('span'); n.className = 'num'; n.textContent = part; el.append(n); }
      else el.append(document.createTextNode(part));
    }
  }
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('aside', 'survey-drawer overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const survey = ctx.kind === 'chat';
    const title = {chat: 'Quick feedback', cookie: 'Cookies', toast: 'Notice', promo: 'Update available', banner: 'Service notice'}[ctx.kind];
    u.el('h2', '', el, title);
    const x = u.el('button', 'survey-x', el, '×');
    x.setAttribute('aria-label', 'Close notice');
    x.onclick = () => ctx.dismiss('close');
    if (survey) {
      u.el('p', 'survey-intro', el, 'How easy was this tool to use?');
      const choices = u.el('div', 'survey-choices', el);
      ['Very easy', 'Somewhat easy', 'Neither easy nor difficult', 'Somewhat difficult', 'Very difficult'].forEach((label) => {
        const row = u.el('label', '', choices);
        const radio = u.el('input', '', row);
        radio.type = 'radio'; radio.name = 'ease'; radio.value = label;
        u.el('span', '', row, label);
      });
      u.el('div', 'survey-question', el, 'What could we improve?');
      const dropdown = u.el('div', 'survey-dropdown', el);
      const toggle = u.el('button', 'survey-select', dropdown, 'Select an option…');
      toggle.type = 'button';
      toggle.setAttribute('aria-expanded', 'false');
      const options = u.el('div', 'survey-options', dropdown);
      options.hidden = true;
      for (const label of ['Finding records', 'Image quality', 'Help and guidance']) {
        const button = u.el('button', '', options, label);
        button.type = 'button';
        button.onclick = () => {
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
      u.el('p', 'survey-intro', el, {cookie: 'This tool stores display preferences locally.', toast: 'Preview rendering is ready.', promo: 'A new filter pack is available.', banner: 'Preview runs in offline mode.'}[ctx.kind]);
    }
    const dismiss = u.el('button', 'primary survey-close', el, survey ? 'Close' : ctx.kind === 'cookie' ? 'Reject optional' : 'Dismiss');
    dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('dismiss');
    return {el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0};
  }
  env.site({name: 'design-set-slider-multi-05', styles: ['site.css'], scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => typeof x === 'string' ? x : x.label || x.text || x.name;
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = er.bool(0.5);
      const placement = referenceEnd ? 'footer' : er.pick(['header', 'link']);
      const endLabel = referenceEnd ? 'Submit' : er.pick(endLabels);
      document.body.className = `devtool instruction-${ctx.display}`;
      const rail = u.el('nav', 'cmd-rail', document.body);
      ['Adjust', 'Crop', 'Filters', 'Layers', 'Settings'].forEach((name, i) => {
        const b = u.el('div', 'rail-item' + (i === 0 ? ' active' : ''), rail);
        icon(b, name);
        u.el('span', '', b, name);
      });
      const page = u.el('div', 'page', document.body);
      const head = u.el('header', 'page-head', page);
      const ttl = u.el('div', '', head);
      u.el('h1', '', ttl, 'Image Adjustments');
      u.el('p', 'sub', ttl, 'Fine-tune the image using the sliders below.');
      const tools = u.el('div', 'header-tools', head);
      const ws = u.el('div', 'workspace', tools);
      u.el('span', '', ws, 'WORKSPACE');
      u.el('i', '', ws);
      u.el('span', 'dim', ws, '1024 × 576');

      const task = u.el('section', 'task-note', page);
      const bang = u.el('div', 'bang', task, '!');
      bang.setAttribute('aria-hidden', 'true');
      const instruction = u.el('div', 'instruction', task);
      fillInstruction(instruction, ctx.instruction);
      if (ctx.display === 'hidden') task.remove();
      if (ctx.display === 'toast') {
        const close = u.el('button', 'instruction-close', task, 'Close');
        close.onclick = () => { task.hidden = true; };
      }

      const work = u.el('div', 'work', page);
      const stage = u.el('main', 'record-stage', work);
      stage.dataset.role = 'stage';
      const prev = u.el('section', 'preview', work);
      const heads = u.el('div', 'pv-head', prev);
      u.el('span', '', heads, 'Original');
      u.el('span', '', heads, 'Adjusted (Preview)');
      const imgs = u.el('div', 'pv-imgs', prev);
      u.el('div', 'pv-img', imgs);
      u.el('div', 'pv-img adj', imgs);
      if (ctx.display === 'panel') prev.prepend(task);
      if (ctx.display === 'toast') prev.append(task);

      const foot = u.el('footer', 'page-foot', page);
      const hint = u.el('div', 'hint', foot);
      const ic = u.el('span', 'info', hint, 'i');
      ic.setAttribute('aria-hidden', 'true');
      u.el('span', '', hint, ctx.finish ? 'Adjust the sliders to match the target values.' : `Adjust the sliders to match the target values, then click ${endLabel}.`);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el('button', placement === 'link' ? 'end-link' : 'primary' + (placement === 'header' ? ' header-end' : ''), placement === 'header' ? tools : foot, endLabel);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.onclick = () => ctx.submit();
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const options = [...new Set(endLabels)].filter((label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (options.length) {
          const label = cr.pick(options);
          const decoy = u.el('button', 'chrome-xtra', tools, label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.onclick = () => env.log('decoy', {label, collide: true});
        }
      }
      return {stage, submit};
    },
    overlay: drawOverlay,
  });
})();
