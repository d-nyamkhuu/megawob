(function () {
  'use strict';
  const D = {
    site: 'design-use-shop-search-07',
    tokens: {
      bg: '#ffffff',
      panel: '#ffffff',
      fg: '#222a30',
      accent: '#26936f',
      font: "'Noto Sans','Segoe UI','Source Sans Pro','Helvetica Neue',Arial,sans-serif",
      line: '#e3e7ea',
      muted: '#5d666d',
    },
    rail: [
      ['Search', 'M10.5 3a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15M16 16l5 5'],
      ['Library', 'M6 2h11l3 4v16H4V4Q4 2 6 2zM15 2v5h5M8 9h3M8 13h8M8 17h6'],
      ['Saved', 'M5 3h14v18l-7-4.5L5 21z'],
      ['History', 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 7v5.5l3.5 2'],
      [
        'Settings',
        'M12 8.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zM10.5 2.5h3l.5 2.4 1.9.8 2.1-1.3 2.1 2.1-1.3 2.1.8 1.9 2.4.5v3l-2.4.5-.8 1.9 1.3 2.1-2.1 2.1-2.1-1.3-1.9.8-.5 2.4h-3l-.5-2.4-1.9-.8-2.1 1.3-2.1-2.1 1.3-2.1-.8-1.9-2.4-.5v-3l2.4-.5.8-1.9-1.3-2.1 2.1-2.1 2.1 1.3 1.9-.8z',
      ],
    ],
  };
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      for (const [k, v] of Object.entries(D.tokens)) document.documentElement.style.setProperty('--' + k, v);
      document.body.className = 'instruction-' + ctx.display;
      const shell = u.el('div', 'site-shell', document.body);
      const rail = u.el('nav', 'command-rail', shell);
      D.rail.forEach(([label, path], i) => {
        const it = u.el('div', 'rail-item' + (i === 0 ? ' on' : '') + (i === D.rail.length - 1 ? ' last' : ''), rail);
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        p.setAttribute('d', path);
        svg.append(p);
        it.append(svg);
        u.el('span', '', it, label);
      });
      const main = u.el('div', 'main-col', shell);
      const narrow = shell.getBoundingClientRect().width < 1260;
      const headerInstruction =
        ctx.display === 'header' || (narrow && (ctx.display === 'panel' || ctx.display === 'toast'));
      const er = ctx.rng.fork('chrome/end');
      const keepDefault = !ctx.finish && er.bool(0.5);
      const placement = ctx.finish ? null : keepDefault ? 'header' : er.pick(['footer', 'footer', 'link']);
      const bank =
        ctx.content && Array.isArray(ctx.content.END_LABELS)
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const textOf = (v) => (typeof v === 'string' ? v : (v && (v.label || v.text || v.name)) || String(v));
      const label = keepDefault ? 'Submit' : textOf(er.pick(bank));
      const note = headerInstruction || placement === 'header' ? u.el('section', 'task-note', main) : null;
      if (note) {
        if (headerInstruction) {
          const p = u.el('p', 'food-task', note, ctx.instruction);
          p.dataset.role = 'instruction';
        }
        let submit = null;
        if (!ctx.finish && placement === 'header') {
          submit = u.el('button', 'end-control', note, label);
          submit.type = 'button';
          submit.addEventListener('click', () => ctx.submit());
        }
      }
      if (ctx.display === 'panel' && !narrow) {
        const row = u.el('div', 'stage-region', main);
        const stage = u.el('main', 'stage', row);
        const panel = u.el('aside', 'episode-panel', row);
        u.el('div', 'episode-panel-title', panel, 'Your task');
        const p = u.el('div', 'episode-panel-text', panel, ctx.instruction);
        p.dataset.role = 'instruction';
        if (!ctx.finish && placement !== 'header') {
          const foot = u.el('footer', 'episode-footer', main);
          const submit = u.el(
            placement === 'link' ? 'a' : 'button',
            placement === 'link' ? 'end-link' : 'end-control',
            foot,
            placement === 'link' ? label + ' ›' : label,
          );
          if (placement === 'link') submit.href = '#';
          else submit.type = 'button';
          submit.dataset.role = 'submit';
          submit.setAttribute('aria-label', label);
          submit.title = label;
          submit.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
        }
        if (ctx.display === 'toast') {
          const toast = u.el('div', 'episode-toast', main, ctx.instruction);
          toast.dataset.role = 'instruction';
        }
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const options = [
            ...new Set(bank.map(textOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase())),
          ];
          if (options.length) {
            const collideLabel = textOf(cr.pick(options));
            const decoy = u.el(
              'button',
              'pq-xtra',
              placement === 'header' && note ? note : main.querySelector('.episode-footer') || main,
              collideLabel,
            );
            decoy.type = 'button';
            decoy.dataset.role = 'xtra';
            decoy.addEventListener('click', () => env.log('decoy', { label: collideLabel, collide: true }));
          }
        }
        return {
          stage,
          submit:
            placement === 'header' && !ctx.finish
              ? note.querySelector('.end-control')
              : main.querySelector('[data-role="submit"]'),
        };
      }
      const stageRegion = u.el('div', 'stage-region', main);
      const stage = u.el('main', 'stage', stageRegion);
      let submit = placement === 'header' && !ctx.finish && note ? note.querySelector('.end-control') : null;
      if (!narrow && ctx.display === 'toast') {
        const toast = u.el('div', 'episode-toast', main, ctx.instruction);
        toast.dataset.role = 'instruction';
      }
      if (!ctx.finish && placement !== 'header') {
        const foot = u.el('footer', 'episode-footer', main);
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          placement === 'link' ? 'end-link' : 'end-control',
          foot,
          placement === 'link' ? label + ' ›' : label,
        );
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const options = [
          ...new Set(bank.map(textOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase())),
        ];
        if (options.length) {
          const collideLabel = textOf(cr.pick(options));
          const parent = placement === 'header' && note ? note : main.querySelector('.episode-footer') || main;
          const decoy = u.el('button', 'pq-xtra', parent, collideLabel);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: collideLabel, collide: true }));
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const texts = {
        cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
        chat: ['Help', 'Need help with this workspace?', 'Close'],
        promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
        banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement'],
      };
      let [title, copy, label] = texts[ctx.kind];
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', title);
      u.el('h2', '', el, title);
      u.el('div', 'overlay-copy', el, copy);
      const actions = u.el('div', 'overlay-actions', el);
      if (ctx.kind === 'cookie') {
        const accept = u.el('button', '', actions, 'Accept all');
        accept.addEventListener('click', () => ctx.dismiss());
      }
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  });
})();
