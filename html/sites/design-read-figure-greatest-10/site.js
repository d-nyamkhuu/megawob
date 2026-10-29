(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-greatest-10',
    'task': 'read-figure',
    'scenario': 'greatest',
    'style': 'directory',
    'title': 'Amiga Workbench',
    'menu': '',
    'note': 'Answer',
    'layout': 'stagger',
    'subtitle': '',
    'aside': '',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util,
        r = ctx.rng,
        content = ctx.content || {},
        size = ctx.size || {};
      const small = (size.width || window.innerWidth) < 1150 || (size.height || window.innerHeight) < 700;
      let display = ctx.display || 'header';
      if (small && (display === 'panel' || display === 'toast')) display = 'header';
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + display;
      const app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 30, height: 30, viewBox: '0 0 30 30', class: 'title-icon' }, top);
      u.svg('rect', { x: 2, y: 2, width: 26, height: 26, fill: '#eee', stroke: '#222', 'stroke-width': 2 }, icon);
      u.svg('path', { d: 'M2 2h13v13H2zM15 15h13v13H15z', fill: '#d22' }, icon);
      u.el('span', '', top, C.title);
      u.el('span', 'workbench-clock', top, 'Mon  Apr 22 1996 10:24');
      const title = u.el('div', 'window-title', app, 'Number Card Challenge');
      const center = u.el('div', 'center', app),
        brief = u.el('div', 'brief', center, display === 'header' ? ctx.instruction : '');
      const stage = u.el('section', 'stage', center),
        aside = u.el('aside', 'aside', document.body),
        asideTitle = u.el('b', '', aside, C.note);
      if (display === 'panel') {
        const task = u.el('div', 'wb-task-panel', aside);
        u.el('strong', '', task, 'Task');
        u.el('span', '', task, ctx.instruction);
      }
      const selected = u.el('p', 'aside-copy', aside, '');
      selected.setAttribute('data-selected', 'None');
      stage.addEventListener('click', (event) => {
        const card = event.target.closest('.number-card');
        if (card) selected.setAttribute('data-selected', card.textContent.trim());
      });
      if (display === 'toast') {
        const note = u.el('div', 'wb-toast', stage, ctx.instruction);
      }
      let submit = null;
      const labels =
        Array.isArray(content.END_LABELS) && content.END_LABELS.length
          ? content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const explicitFinish = new URLSearchParams(location.search).get('finish') === '1';
      const finishMode = !!ctx.finish && explicitFinish;
      const er = r.fork('chrome/end'),
        placement = finishMode ? null : er.pick(['aside', 'aside', 'aside', 'panel-top', 'panel-link']);
      const label = labelOf(er.pick(labels));
      const addEnd = (parent, cls, text) => {
        const b = u.el('button', cls + ' submit', parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      const decoy = (parent, text, collide) => {
        const b = u.el('button', 'wb-xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', collide ? { label: text, collide: true } : { label: text }));
      };
      const collideR = r.fork('chrome/collide');
      let collide = null;
      if (collideR.bool(0.3)) {
        const choices = [
          ...new Set(labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase())),
        ];
        if (choices.length) collide = collideR.pick(choices);
      }
      if (collide) decoy(title, collide, true);
      if (!finishMode) {
        if (placement === 'aside') {
          const footer = u.el('footer', 'bottom', aside);
          submit = addEnd(footer, 'submit', label);
        } else if (placement === 'panel-top') submit = addEnd(aside, 'wb-panel-top', label);
        else submit = addEnd(aside, 'wb-panel-link', label + ' ›');
        if (!submit) {
          const footer = u.el('footer', 'bottom', aside);
          submit = addEnd(footer, 'submit', label);
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {
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
