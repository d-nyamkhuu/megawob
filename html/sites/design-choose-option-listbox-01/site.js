(function () {
  'use strict';
  const CALENDAR = '<svg viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 4h20v20H3zM3 10h20M8 1v7M18 1v7M7 15h12M7 20h12M10 12v10M16 12v10"/></svg>';
  env.site({
    name: 'design-choose-option-listbox-01', styles: ['site.css'], scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const endRng = ctx.rng.fork('chrome/end');
      const endLabels = ctx.content && ctx.content.END_LABELS;
      const labels = Array.isArray(endLabels) && endLabels.length ? endLabels : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const labelText = value => typeof value === 'string' ? value : value && (value.label || value.text || value.name) || String(value);
      const submitLabel = labels.map(labelText).find(x => x.trim().toLowerCase() === 'submit') || 'Submit';
      const label = endRng.bool(0.5) ? submitLabel : labelText(endRng.pick(labels));
      const placement = endRng.pick(['footer', 'footer', 'footer', 'header', 'link', 'icon']);
      const collideRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (collideRng.bool(0.3)) {
        const options = [...new Set(labels.map(labelText))].filter(x => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) collide = collideRng.pick(options);
      }
      const shell = u.el('div', 'ds-shell', document.body);
      const brief = u.el('aside', 'ds-brief', shell);
      brief.classList.add('ds-display-' + ctx.display);
      if (ctx.instruction.length > 65) brief.classList.add('ds-brief-long');
      u.el('h2', '', brief, 'Task Briefing');
      if (ctx.display !== 'hidden') {
        const taskHeading = ctx.display === 'panel' ? 'Instructions:' : ctx.display === 'toast' ? 'Task note:' : 'Your task:';
        u.el('h3', 'ds-your-task', brief, taskHeading);
        const instruction = u.el('div', 'ds-instruction', brief, ctx.instruction);
        if (ctx.display === 'toast') instruction.classList.add('ds-instruction-toast');
      }
      u.el('p', 'ds-guide', brief, 'Use the application on the right to complete the task.');
      u.el('h3', 'ds-notes-title', brief, 'Notes:');
      const notes = u.el('ul', 'ds-notes', brief);
      u.el('li', '', notes, 'Use the mouse wheel or the scrollbar to view more options if needed.');
      u.el('li', '', notes, 'Select only the requested options from the list.');
      u.el('li', '', notes, 'Leave all other settings as they are.');
      u.el('li', '', notes, ctx.finish ? 'Finish when you have made the selection.' : `Click ${label} when you have made the selection.`);
      const workspace = u.el('section', 'ds-workspace', shell);
      const top = u.el('header', 'ds-top', workspace);
      u.el('span', 'ds-app-icon', top).innerHTML = CALENDAR;
      u.el('strong', 'ds-brand', top, 'Event Planner');
      const topTools = u.el('div', 'ds-top-tools', top);
      const controls = u.el('div', 'ds-window-controls', top);
      ['−', '□', '×'].forEach(t => u.el('span', '', controls, t));
      const menu = u.el('nav', 'ds-menu', workspace);
      ['File', 'Edit', 'View', 'Help'].forEach(t => u.el('span', '', menu, t));
      const decoyBtn = (parent, text, collides) => {
        const button = u.el('button', 'ds-xtra', parent, text);
        button.type = 'button'; button.dataset.role = 'xtra';
        button.addEventListener('click', () => env.log('decoy', collides ? { label: text, collide: true } : { label: text }));
      };
      const stage = u.el('main', 'ds-stage', workspace);
      const footer = u.el('footer', 'ds-footer', workspace);
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'footer' ? footer : placement === 'header' ? topTools : menu;
        const cls = placement === 'link' ? 'ds-end-link' : placement === 'icon' ? 'ds-submit ds-submit-icon' : 'ds-submit';
        submit = u.el(placement === 'link' ? 'a' : 'button', cls, parent, placement === 'icon' ? '✓' : placement === 'link' ? `${label} ›` : label);
        if (submit.tagName === 'BUTTON') submit.type = 'button'; else submit.href = '#';
        submit.dataset.role = 'submit'; submit.setAttribute('aria-label', label); submit.title = label;
        submit.addEventListener('click', event => { event.preventDefault(); ctx.submit(); });
      }
      const cancel = u.el('button', 'ds-cancel', footer, 'Cancel'); cancel.type = 'button';
      if (collide) decoyBtn(placement === 'footer' ? footer : topTools, collide, true);
      // Fit unusually long seeded instructions before the kit measures task anchors.
      for (let pass = 0; pass < 5 && brief.scrollHeight > brief.clientHeight; pass++) {
        for (const text of brief.querySelectorAll('.ds-instruction, .ds-guide, .ds-notes')) {
          text.style.fontSize = (parseFloat(getComputedStyle(text).fontSize) * 0.92) + 'px';
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body); el.dataset.role = 'overlay';
      const texts = { cookie: 'We use cookies to remember your preferences.', toast: 'Changes synced.', chat: 'Hello. How can we help?', promo: 'Try our new workspace.', banner: 'Scheduled maintenance tonight.' };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    }
  });
})();
