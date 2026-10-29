(function () {
  'use strict';
  const C = { site: 'design-act-in-time-popup-08' };
  const END = ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
  const DECOY = ['Help', 'Feedback', 'Preview', 'Save draft', 'Reset view', 'Share', 'Export', 'History'];
  env.site({
    name: C.site,
    initialOverlay: { kind: 'promo' },
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        root = document.documentElement;
      root.style.setProperty('--bg', '#aeb5c3');
      root.style.setProperty('--panel', '#b7bdca');
      root.style.setProperty('--fg', '#171b27');
      root.style.setProperty('--muted', '#414761');
      root.style.setProperty('--line', '#656c7c');
      root.style.setProperty('--accent', '#7771b6');
      const body = u.el('div', 'irix-desktop', document.body);
      const menu = u.el('header', 'irix-menu', body);
      u.el('b', 'irix-wordmark', menu, 'IRIX');
      ['Session', 'Applications', 'Workspace', 'Help'].forEach((x) => u.el('span', '', menu, x));
      const clock = u.el('span', 'irix-clock', menu, 'Mon Apr 21 10:14 AM  ◖))');
      const work = u.el('div', 'irix-work', body),
        win = u.el('section', 'irix-window', work),
        title = u.el('div', 'irix-window-title', win);
      u.el('span', 'irix-cube', title, '◈');
      u.el('b', '', title, 'System Access');
      const tools = u.el('div', 'irix-title-tools', title);
      u.el('span', 'irix-window-control', title, '⌑');
      const cols = u.el('div', 'irix-columns', win),
        stage = u.el('main', 'ds-stage', cols);
      const notes = u.el('aside', 'irix-notes', cols);
      const noteMode = ctx.display || 'header';
      notes.dataset.display = noteMode;
      if (noteMode === 'panel') notes.classList.add('irix-panel-note');
      const note = () => {
        const n = u.el('div', 'irix-instruction', notes, ctx.instruction);
        n.dataset.role = 'instruction';
        return n;
      };
      if (noteMode !== 'hidden' && noteMode !== 'toast') note();
      const actions = u.el('div', 'irix-actions', notes);
      if (noteMode !== 'hidden' && noteMode !== 'toast') {
        u.el('h3', '', actions, 'Actions:');
        u.el('ol', '', actions).innerHTML =
          '<li>Enter the requested username.</li><li>Enter the password.</li><li>Click the in-app login button.</li>';
      } else actions.hidden = true;
      if (noteMode === 'toast') {
        const n = note();
        n.classList.add('irix-toast');
      }
      const shelf = u.el('footer', 'irix-shelf', body),
        apps = ['Explorer', 'Files', 'Terminal', 'System', 'Print', 'Settings', 'Help'];
      apps.forEach((name, i) => {
        const a = u.el('div', 'irix-app', shelf);
        u.el('span', 'irix-app-icon irix-i' + i, a, ['◉', '▱', '▣', '✚', '▤', '⚙', '?'][i]);
        u.el('span', '', a, name);
      });
      u.el('div', 'irix-shelf-sep', shelf);
      for (let i = 1; i <= 4; i++) {
        const a = u.el('div', 'irix-workspace' + (i === 1 ? ' active' : ''), shelf);
        u.el('span', '', a, '▣');
        u.el('small', '', a, 'Workspace ' + i);
      }
      let submit = null;
      const place = ctx.finish ? null : ctx.rng.fork('chrome/end').pick(['toolbar', 'shelf', 'shelf', 'link']);
      if (!ctx.finish) {
        const sampledLabel = ctx.rng.fork('chrome/end-label').pick((ctx.content && ctx.content.END_LABELS) || END);
        const endLabel = place === 'shelf' ? 'Submit' : sampledLabel;
        const b = u.el(
          'button',
          `irix-submit irix-submit-${place}`,
          place === 'shelf' ? shelf : place === 'link' ? notes : tools,
          endLabel,
        );
        if (place === 'shelf') shelf.classList.add('irix-shelf-end');
        b.type = 'button';
        b.dataset.role = 'submit';
        b.addEventListener('click', () => ctx.submit());
        submit = b;
      }
      if (ctx.rng.fork('chrome/collide').bool(0.3)) {
        const r = ctx.rng.fork('chrome/collide-label');
        const label = r.pick(
          ((ctx.content && ctx.content.END_LABELS) || END).filter(
            (x) => String(x) !== String(submit && submit.textContent),
          ),
        );
        const d = u.el('button', 'irix-xtra', tools, label);
        d.type = 'button';
        d.dataset.role = 'xtra';
        d.addEventListener('click', () => env.log('decoy', { label, collide: true }));
      }
      const filler = ctx.rng.fork('chrome/filler');
      if (filler.bool(0.45)) {
        const d = u.el('button', 'irix-help', tools, filler.pick((ctx.content && ctx.content.DECOY_LABELS) || DECOY));
        d.type = 'button';
        d.dataset.role = 'xtra';
        d.addEventListener('click', () => env.log('decoy', { label: d.textContent }));
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el(
        'section',
        `irix-overlay irix-overlay-${ctx.kind}${ctx.initial ? ' irix-initial' : ''}`,
        document.body,
      );
      el.dataset.role = 'overlay';
      const txt = {
        cookie: 'Cookies help keep your workstation preferences.',
        toast: 'Changes saved.',
        chat: 'Workstation assistance is available.',
        promo: 'Explore the latest workstation tools.',
        banner: 'System maintenance notice.',
      };
      u.el('div', 'irix-ov-title', el, ctx.initial ? 'Tip of the Day' : 'System Notice');
      if (ctx.initial) {
        const row = u.el('div', 'irix-tip-content', el);
        u.el('span', 'irix-bulb', row, '💡');
        const copy = u.el('div', '', row);
        u.el('b', '', copy, 'Did you know?');
        u.el('div', '', copy, 'You can switch between workspaces using Ctrl + F1 … F8.');
        const tick = u.el('div', 'irix-tip-check', el);
        u.el('span', '', tick, '☑');
        u.el('span', '', tick, 'Show tips at startup');
      } else u.el('div', '', el, txt[ctx.kind] || txt.toast);
      const b = u.el('button', '', el, 'Close');
      b.type = 'button';
      b.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss: b, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
