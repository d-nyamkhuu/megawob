(function () {
  'use strict';
  env.site({
    name: 'design-handle-text-spinner-07',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref kinetic';
      const shell = u.el('main', 'shell', document.body);
      const ribbon = u.el('header', 'ribbon', shell);
      const brand = u.el('div', 'brand', ribbon);
      u.el('strong', 'brand-name', brand, 'TypeLab');
      u.el('span', 'brand-tag', brand, 'EXPERIMENTAL\nTYPOGRAPHY TOOL');
      const group = (name, content) => {
        const g = u.el('section', 'tool-group', ribbon);
        u.el('span', 'group-label', g, name);
        const c = u.el('div', 'group-controls', g);
        content(c);
      };
      group('Font', (c) => {
        const s = u.el('div', 'fake-select', c, 'Inter');
        s.innerHTML = 'Inter <b>⌄</b>';
      });
      group('Style', (c) => {
        ['B', 'I', 'U'].forEach((v, i) => u.el('div', 'style-key k' + i, c, v));
      });
      group('Alignment', (c) => {
        ['☰', '☷', '☰'].forEach((v, i) => u.el('div', 'align-key a' + i, c, v));
      });
      group('Color', (c) => {
        const x = u.el('div', 'swatch-control', c);
        u.el('i', 'swatch paper', x);
        u.el('span', '', x, '#F1F5F9');
        u.el('b', '', x, '⌄');
      });
      group('Background', (c) => {
        const x = u.el('div', 'swatch-control', c);
        u.el('i', 'swatch ink', x);
        u.el('span', '', x, '#0F172A');
        u.el('b', '', x, '⌄');
      });
      const more = u.el('button', 'more-tools', ribbon, '☷　More Tools　⌄');
      more.type = 'button';
      more.addEventListener('click', () => env.log('decoy', { label: 'More Tools' }));
      const work = u.el('main', 'work', shell);
      const instruction = u.el('div', 'instruction', work, ctx.instruction);
      instruction.dataset.display = ctx.display;
      instruction.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') instruction.classList.add('instruction-toast');
      const label = u.el('div', 'task-label', work);
      u.el('span', '', label, 'TASK');
      u.el('i', '', label);
      const stage = u.el('section', 'stage', work);
      const foot = u.el('footer', 'footer', shell);
      const status = u.el('div', 'status', foot);
      u.el('i', 'ready-dot', status);
      u.el('span', 'ready-text', status, 'Ready');
      [
        ['Font:', 'Inter'],
        ['Size:', '14 pt'],
        ['Color:', '#F1F5F9'],
        ['Background:', '#0F172A'],
      ].forEach((pair) => {
        const x = u.el('span', 'status-item', status);
        u.el('b', '', x, pair[0]);
        u.el('span', '', x, pair[1]);
      });
      const actions = u.el('div', 'footer-actions', foot);
      const reset = u.el('button', 'reset', actions, '⟳　Reset');
      reset.type = 'button';
      reset.addEventListener('click', () => env.log('decoy', { label: 'Reset' }));
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endWords = ctx.content.END_LABELS.map(labelOf);
      const er = ctx.rng.fork('chrome/end');
      const placement = er.bool(0.5) ? 'reference' : er.pick(['ribbon', 'link']);
      const endLabel = placement === 'reference' ? 'Submit' : er.pick(endWords);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el('button', 'submit end-' + placement, placement === 'ribbon' ? ribbon : actions, endLabel);
        submit.type = 'button';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', ctx.submit);
        if (placement === 'ribbon') more.hidden = true;
        if (placement === 'link') actions.insertBefore(submit, reset);
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const options = endWords.filter((word) => word.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (options.length) {
          const label = cr.pick(options);
          const decoy = u.el('button', 'end-xtra', actions, label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
          foot.classList.add('has-xtra');
        }
      }
      // Keep long seeded instructions inside their reserved region, clear of the spinner.
      if (ctx.display !== 'hidden') {
        for (let i = 0; i < 8 && instruction.scrollHeight > instruction.clientHeight + 1; i++) {
          const size = parseFloat(getComputedStyle(instruction).fontSize);
          instruction.style.fontSize = size * 0.9 + 'px';
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong',
        '',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      ctx.util.el(
        'p',
        '',
        el,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Explore the latest tools.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
