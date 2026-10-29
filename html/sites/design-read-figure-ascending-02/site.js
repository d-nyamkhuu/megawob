(function () {
  'use strict';
  const C = { site: 'design-read-figure-ascending-02', task: 'read-figure', scenario: 'ascending' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = 'os2-workplace instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 28, height: 28, viewBox: '0 0 28 28', class: 'title-icon' }, top);
      u.svg('circle', { cx: 14, cy: 14, r: 11, fill: '#b9d9ff', stroke: '#102c54', 'stroke-width': 1.5 }, icon);
      u.svg('path', { d: 'M14 4 8 13l5 2-2 8 9-12-5-1z', fill: '#663e92', stroke: '#24123a', 'stroke-width': 1 }, icon);
      u.el('span', 'window-title', top, 'OS/2 Workplace Shell - Number Order');
      const wc = u.el('div', 'native-window-controls', top);
      [
        ['min', 'M3 12h14'],
        ['max', 'M4 4h12v12H4z'],
        ['close', 'M4 4l12 12M16 4 4 16'],
      ].forEach(([kind, d]) => {
        const box = u.el('span', 'window-control ' + kind, wc),
          svg = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20' }, box);
        u.svg('path', { d, fill: 'none', stroke: '#111', 'stroke-width': 2 }, svg);
      });
      const menu = u.el('nav', 'menu', app);
      ['File', 'Edit', 'View', 'Tools', 'Help'].forEach((x) => u.el('span', 'menu-item', menu, x));
      const endRng = ctx.rng.fork('chrome/end'),
        collideRng = ctx.rng.fork('chrome/collide');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = endRng.bool(0.5),
        placement = referenceEnd ? 'notebook' : endRng.pick(['toolbar', 'status']);
      const endLabel = referenceEnd ? 'Submit' : endRng.pick(endLabels);
      const tools = u.el('div', 'chrome-tools', menu);
      const work = u.el('div', 'workarea', app),
        center = u.el('section', 'center', work),
        brief = u.el('div', 'brief', center, ctx.display === 'hidden' ? '' : ctx.instruction),
        stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', work),
        tabs = u.el('div', 'tabs', aside);
      [
        ['Instructions', true],
        ['Details', false],
        ['Notes', false],
      ].forEach(([x, on]) => u.el('div', 'tab' + (on ? ' active' : ''), tabs, x));
      const page = u.el('div', 'instruction-page', aside);
      u.el('b', 'aside-title', page, ctx.display === 'hidden' ? 'Workspace' : ctx.instruction);
      const completion = ctx.finish
        ? 'Finish this exercise when all numbers are selected.'
        : 'When you are finished, click ' + endLabel + '.';
      u.el(
        'p',
        'aside-copy',
        page,
        ctx.display === 'hidden'
          ? 'Number Order\nWorkplace Shell exercise'
          : 'Select the numbers in ascending order.\nEach number can be clicked only once.\nAll numbers must be selected.\n' +
              completion,
      );
      if (ctx.display === 'toast') {
        page.prepend(brief);
        brief.classList.add('instruction-notification');
      }
      u.el('hr', '', page);
      u.el('b', 'progress-title', page, 'Progress');
      const track = u.el('div', 'progress-track', page),
        fill = u.el('div', 'progress-fill', track);
      fill.dataset.progress = 'fill';
      const progress = u.el('div', 'progress-text', page, '0 of 11 selected');
      progress.dataset.progress = 'text';
      let selectedCount = 0;
      stage.addEventListener('click', (event) => {
        if (!event.target.closest('.number-tile')) return;
        selectedCount = Math.min(11, selectedCount + 1);
        progress.textContent = selectedCount + ' of 11 selected';
        fill.style.width = (selectedCount / 11) * 100 + '%';
      });
      let submit = null;
      if (!ctx.finish) {
        submit = u.el('button', 'submit', placement === 'toolbar' ? tools : page, endLabel);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', ctx.submit);
        if (placement !== 'notebook') submit.classList.add('chrome-end', placement + '-end');
      }
      const footer = u.el('footer', 'bottom', app);
      u.el('span', 'ready', footer, 'Ready');
      const dates = u.el('div', 'system-info', footer);
      u.el('span', 'date', dates, 'Mar 10, 1994');
      u.el('span', 'time', dates, '10:24 AM');
      if (submit && placement === 'status') footer.insertBefore(submit, dates);
      if (collideRng.bool(0.3)) {
        const options = endLabels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (options.length) {
          const label = collideRng.pick(options),
            decoy = u.el('button', 'chrome-xtra', tools, label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body),
        messages = {
          cookie: 'This application stores preferences on your device.',
          toast: 'Your workspace has been synced.',
          chat: 'Need help with this exercise?',
          promo: 'Try the new practice collection.',
          banner: 'An updated practice collection is available.',
        };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
