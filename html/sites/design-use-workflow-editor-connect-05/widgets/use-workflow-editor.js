// Design on use-workflow-editor/editor. Palette and node decoration are widget-owned so
// frame never changes the task DOM after rendering.
const relayIcon = body => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
const relayIcons = {
  Webhook: relayIcon('<path d="M13 2 7 13h5l-1 9 7-12h-5l1-8z" fill="currentColor" stroke="none"/>'),
  Schedule: relayIcon('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v5M17 2v5M3 9h18"/>'),
  'Manual trigger': relayIcon('<path d="M5 2v19l5-5 4 6 3-2-4-6 7-1z" fill="currentColor" stroke="none"/>'),
  'App event': relayIcon('<path d="m4 7 8-4 8 4-8 4-8-4zm0 5 8 4 8-4M4 17l8 4 8-4"/>'),
  'Send email': relayIcon('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>'),
  Database: relayIcon('<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0"/>'),
  Transform: relayIcon('<path d="M5 2h10l4 4v16H5zM15 2v5h4M8 11h8M8 15h8M8 19h6"/>'),
  'Data mapper': relayIcon('<rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>'),
  API: relayIcon('<circle cx="5" cy="12" r="2.5"/><circle cx="18" cy="5" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m7 11 8-5M7 13l8 5"/>'),
  'Send response': relayIcon('<path d="M6 17h12l-2-3V9a4 4 0 0 0-8 0v5zM10 20h4"/>'),
  Condition: relayIcon('<path d="M3 4h18l-7 8v6l-4 3v-9z"/>'),
  Delay: relayIcon('<circle cx="12" cy="12" r="9"/><path d="M12 5v7l5 3"/>'),
  Split: relayIcon('<path d="M12 21V4m0 0-4 4m4-4 4 4M12 13H6l-3-3m9 3h6l3-3"/>'),
  Merge: relayIcon('<path d="M12 3v17m0 0-4-4m4 4 4-4M3 6l3 3h6m9-3-3 3h-6"/>'),
};
const relaySections = [
  ['Triggers',[['Webhook','Webhook','purple'],['Schedule','Schedule','green'],['Manual trigger','Manual trigger','blue'],['App event','App event','pink']]],
  ['Actions',[['Send message','Send email','blue'],['Create record','Database','orange'],['Transform','Transform','purple'],['Data mapper','Data mapper','green'],['API','API','purple'],['Send response','Send response','red']]],
  ['Flow',[['Filter','Condition','blue'],['Delay','Delay','blue'],['Split','Split','slate'],['Merge','Merge','slate']]],
];
const relayType = {
  Webhook:['Webhook','purple'], Filter:['Condition','blue'], Condition:['Condition','blue'],
  Transform:['Transform','purple'], 'Send message':['Send email','blue'],
  'Send email':['Send email','blue'], 'Create record':['Database','orange'],
  Database:['Database','orange'], Delay:['Delay','blue'], API:['API','purple'],
  Schedule:['Schedule','green'], 'Data mapper':['Data mapper','green'],
};
const relayDecorateNode = (card, type) => {
  const [name, color] = relayType[type] || ['Transform','slate'];
  card.classList.add('rb-' + (color === 'slate' ? 'gray' : color));
  const symbol = card.querySelector('.af-nodehead .af-symbol');
  if (symbol) symbol.innerHTML = relayIcons[name];
};
env.widget({
  task: 'use-workflow-editor',
  site: 'design-use-workflow-editor-connect-05',
  name: 'design',
  split: 'train',
  scenarios: ['connect'],
  template: 'use-workflow-editor/editor',
  design: {
    parts: {
      paletteFrame: (base, S) => ctx => {
        base(ctx);
        const {palette, list} = S.els;
        palette.classList.add('rb-components');
        const title = ctx.util.el('div','rb-components-title',palette,'Components');
        palette.prepend(title);
        const groups = ctx.util.el('div','rb-component-groups',list);
        const slots = new Map();
        for (const [heading, items] of relaySections) {
          const section = ctx.util.el('section','rb-comp-section',groups);
          const h = ctx.util.el('button','rb-comp-heading',section);
          h.type = 'button'; h.setAttribute('aria-expanded','true');
          ctx.util.el('span','rb-comp-chevron',h,'▾');
          ctx.util.el('strong','',h,heading);
          ctx.util.el('span','rb-comp-collapse',h,'⌄');
          const rows = ctx.util.el('div','rb-comp-list',section);
          h.addEventListener('click', () => {
            const expanded = h.getAttribute('aria-expanded') === 'true';
            h.setAttribute('aria-expanded',String(!expanded));
            rows.hidden = expanded;
          });
          for (const [key, name, color] of items) {
            const row = ctx.util.el('div','rb-comp-row',rows);
            const symbol = ctx.util.el('span','rb-comp-icon ' + color,row);
            symbol.innerHTML = relayIcons[name] || relayIcons.Transform;
            ctx.util.el('span','',row,name);
            slots.set(key, row);
          }
        }
        list._relaySlots = slots;
      },
      component: (base, S) => (ctx, list, type, i) => {
        const tile = base(ctx, list, type, i);
        const slot = list._relaySlots?.get(type);
        if (slot) {
          const name = relayType[type]?.[0] || type;
          const color = relayType[type]?.[1] || 'slate';
          tile.classList.add('rb-comp-row');
          const symbol = tile.querySelector('.af-symbol');
          symbol.className = 'af-symbol rb-comp-icon ' + color;
          symbol.innerHTML = relayIcons[name] || relayIcons.Transform;
          tile.querySelector('span:last-child').textContent = name;
          slot.replaceWith(tile);
        }
        return tile;
      },
      node: (base, S) => (ctx, layer, n) => {
        const card = base(ctx, layer, n);
        relayDecorateNode(card, n.type);
        return card;
      },
      referenceNode: (base, S) => (ctx, layer, n) => {
        const card = base(ctx, layer, n);
        relayDecorateNode(card, n.type);
        return card;
      },
    },
  },
});
