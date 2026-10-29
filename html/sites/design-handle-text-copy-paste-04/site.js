(function () {
  'use strict';
  env.site({
    name: 'design-handle-text-copy-paste-04',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref intranet board';
      const shell = u.el('main', 'shell', document.body);
      const note = u.el('div', 'instruction', shell, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      const head = u.el('header', 'head', shell);
      u.el('div', 'title', head, 'Project Notebook');
      const headTools = u.el('div', 'head-tools', head);
      u.el('div', 'date', headTools, 'Apr 23, 2025');
      const work = u.el('div', 'work', shell);
      const tabs = u.el('nav', 'tabs', work);
      ['Notes', 'Research', 'References', 'Tasks', 'Archive'].forEach((s, i) => {
        const t = u.el('div', 'tab' + (i === 0 ? ' active' : ''), tabs, '');
        u.el('span', 'tab-index', t, String(i + 1));
        u.el('span', '', t, s);
      });
      const center = u.el('section', 'center', work);
      const stage = u.el('div', 'stage', center);
      const foot = u.el('footer', 'footer', shell);
      u.el('span', 'task-count', foot, 'Task 1 of 1');
      const clear = u.el('button', 'clear', foot, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () => {
        const input = shell.querySelector('.ut-input');
        if (input) {
          input.value = '';
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.focus();
        }
      });
      let submit = null;
      if (!ctx.finish) {
        const r = ctx.rng.fork('chrome/end');
        const placements = ['footer', 'footer', 'footer', 'header', 'link'];
        const placement = r.pick(placements);
        const labels = ctx.content && ctx.content.END_LABELS;
        const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
        const label = labelOf(
          r.pick(
            Array.isArray(labels) && labels.length
              ? labels
              : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'],
          ),
        );
        const addSubmit = (parent, kind) => {
          const el = u.el(
            kind === 'link' ? 'a' : 'button',
            kind === 'link' ? 'end-link' : 'submit',
            parent,
            label + (kind === 'link' ? ' ›' : ''),
          );
          if (kind === 'link') {
            el.href = '#';
          } else el.type = 'button';
          el.setAttribute('aria-label', label);
          el.title = label;
          el.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
          return el;
        };
        const cr = ctx.rng.fork('chrome/collide');
        let collide = null;
        if (cr.bool(0.3)) {
          const pool =
            Array.isArray(labels) && labels.length
              ? labels
              : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
          const words = [
            ...new Set(pool.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase())),
          ];
          if (words.length) collide = labelOf(cr.pick(words));
        }
        if (placement === 'header') {
          if (collide) {
            const d = u.el('button', 'end-xtra', headTools, collide);
            d.type = 'button';
            d.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
          }
          submit = addSubmit(headTools, 'button');
        } else {
          if (collide) {
            const d = u.el('button', 'end-xtra', headTools, collide);
            d.type = 'button';
            d.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
          }
          submit = addSubmit(foot, placement === 'link' ? 'link' : 'button');
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
