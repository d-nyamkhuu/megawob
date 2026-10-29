// Design on templates/use-email/base.js: the base site's use-email widget for this scenario, unchanged.
// Restyle it in site.css, set the template's tokens and replace the parts the design draws differently
// (design: { parts: { name: (base, S) => replacement } }; templates/README.md).
let kineticSelectAll = null;
env.widget({
  task: 'use-email',
  site: 'design-use-email-search-05',
  name: 'design',
  split: 'train',
  scenarios: ['search'],
  template: 'use-email/base',
  design: {
    parts: {
      CSS: () => env.templateLib('use-email/_base-style').CSS,
      mailBlank: () => () => 'No message selected',
      mailTopActions: (base, S) => (ctx, nodes) => {
        kineticSelectAll = null;
        const state = { app: nodes.app, panel: document.querySelector('.ref-panel'), note: document.querySelector('.ref-note') };
        const bar = document.querySelector('.mail-commandbar');
        if (bar) {
          bar.replaceChildren(nodes.newBtn);
          const selected = () => ctx.model.checked.length ? ctx.model.checked : ctx.model.open !== null && ctx.model.open !== undefined ? [ctx.model.open] : [];
          const add = (icon, label, action) => {
            const b = nodes.button('mail-tool', icon, '', bar, label);
            nodes.on(b, () => selected().length ? action(selected()) : {});
            return b;
          };
          add(S.I.trash, 'Delete', (ids) => ({ move: [ids, 'trash'] }));
          add(S.I.unread, 'Mark unread', (ids) => ({ mark: [ids, true] }));
          add('<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 9 9 2h7v7l-7 8-7-7Z"/><circle cx="13.5" cy="5.5" r=".7"/></svg>', 'Move to', () => ({ menu: ctx.model.menu === 'move' ? null : 'move' }));
          const more = nodes.button('mail-tool', '<svg viewBox="0 0 20 20" fill="currentColor"><circle cx="4" cy="10" r="1.3"/><circle cx="10" cy="10" r="1.3"/><circle cx="16" cy="10" r="1.3"/></svg>', '', bar, 'More');
          const menu = ctx.util.el('div', 'mail-overflow', bar);
          menu.hidden = true;
          more.addEventListener('click', (ev) => { ev.stopPropagation(); menu.hidden = !menu.hidden; });
          for (const [label, action] of [['Mark as important', (ids) => ({ flag: [ids[0], 'important'] })], ['Star', (ids) => ({ flag: [ids[0], 'star'] })], ['Mark unread', (ids) => ({ mark: [ids, true] })]]) {
            const item = nodes.button('', '', label, menu);
            nodes.on(item, () => { menu.hidden = true; const ids = selected(); return ids.length ? action(ids) : {}; });
          }
        }
        return state;
      },
      mailPaintTop: () => (ctx, state, model) => {
        const app = state.app;
        const head = app.querySelector('.am-lhead');
        if (head) {
          let count = head.querySelector('.mail-count');
          if (!count) count = ctx.util.el('div', 'mail-count', head);
          count.textContent = env.taskDef.helpers.listOrder(model, ctx.spec).length + ' messages';
          head.classList.toggle('has-selection', model.checked.length > 0);
          const search = app.querySelector('.am-search');
          if (search && search.parentNode !== head) head.append(search);
          if (search) search.querySelector('input').placeholder = 'Search mail';
        }
        const read = app.querySelector('.am-read');
        const blank = read && read.querySelector('.am-blank');
        if (blank && !blank.querySelector('.kinetic-empty-title')) {
          blank.replaceChildren();
          ctx.util.el('h1', 'kinetic-empty-title', blank, 'No message selected');
          ctx.util.el('p', 'kinetic-empty-guidance', blank, 'Select an email to view its contents and details.');
          const props = ctx.util.el('section', 'kinetic-properties', blank);
          ctx.util.el('h2', '', props, 'Message properties');
          const dl = ctx.util.el('dl', '', props);
          for (const label of ['From', 'To', 'Subject', 'Date', 'Labels', 'Importance', 'Attachments']) {
            ctx.util.el('dt', '', dl, label);
            ctx.util.el('dd', '', dl, '—');
          }
        }
        if (read && state.panel) read.prepend(state.panel);
        if (read && state.note) read.append(state.note);
        const list = app.querySelector('.am-list');
        const track = app.querySelector('.am-track');
        if (list && track) track.classList.toggle('kinetic-no-scroll', list.scrollHeight <= list.clientHeight + 1);
      },
      mailSidebar: () => (ctx, side) => {
        const heading = side.querySelector('.am-flabel');
        if (heading) {
          let builtins = 0;
          for (const child of side.children) { if (child === heading) break; if (child.classList.contains('am-folder')) builtins++; }
          const row = Math.max(36, Math.min(50, ctx.size.width * 0.03));
          side.style.setProperty('--label-gap', (24 + Math.max(0, 8 - builtins) * row) + 'px');
          heading.textContent = 'Labels';
        }
        const colors = ['#1352be', '#14a676', '#f78927', '#7133e8'];
        [...side.querySelectorAll('.am-dot')].forEach((dot, index) => { dot.style.background = colors[index % colors.length]; });
        return null;
      },
      mailListHeading: () => (ctx, lb) => {
        if (!kineticSelectAll) kineticSelectAll = ctx.stage.querySelector('.am-lhead .cbw');
        const h = ctx.util.el('div', 'kinetic-tablehead', lb);
        if (kineticSelectAll) h.append(kineticSelectAll);
        else ctx.util.el('span', '', h);
        ctx.util.el('span', '', h, 'From');
        ctx.util.el('span', '', h, 'Subject');
        ctx.util.el('span', 'date', h, 'Date');
      },
      mailGeometry: (base) => (ctx, ads) => {
        const g = base(ctx, ads);
        const W = ctx.size.width, H = ctx.size.height;
        const sideW = Math.round(W * 0.153);
        const listW = Math.round(W * 0.561);
        return { ...g, appW: W, appH: H, left: 0, top: 0, rail: false, sideW, stack: false, adCol: false,
          bannerH: 0, sponsorK: 0, chromeH: 132, listW, readW: W - sideW - listW, rowH: Math.max(26, Math.min(33, W * 0.0196)),
          rowKind: 'compact' };
      },
    },
  },
});
