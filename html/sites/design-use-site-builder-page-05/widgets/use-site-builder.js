// Page builder: palette above the two-column draft; template owns all task edits.
env.widget({
  task: 'use-site-builder',
  site: 'design-use-site-builder-page-05',
  name: 'design',
  split: 'train',
  scenarios: ['page'],
  template: 'use-site-builder/studio',
  design: {
    inset: 0, emptySection: 'Add a block here', fontFamily: 'Arial,sans-serif',
    parts: {
      header: (base, S) => () => {
        const u = S.ctx.util;
        const titlebar = document.querySelector('.pb-titlebar');
        u.el('span', 'pb-count', titlebar, S.spec.goalSlots.length + ' blocks');
        const tools = titlebar.parentElement.querySelector(':scope > .ref-tools');
        if (tools) titlebar.appendChild(tools);
        const controls = u.el('div', 'pb-publishing', titlebar);
        S.P.publish(controls);
      },
      toolbar: () => () => {},
      navigation: () => () => {},
      workspace: (base, S) => () => S.ctx.util.el('div', 'pb-work', S.els.app),
      footer: (base, S) => () => {
        const foot = base();
        S.st.saved.parentElement.hidden = true;
        return foot;
      },
      composer: (base, S) => () => { S.P.library(); S.P.document(); },
      library: (base, S) => () => {
        const u = S.ctx.util;
        let parent = S.els.work;
        const note = document.querySelector('.pb-help > .ref-panel');
        if (note) {
          parent = u.el('div', 'pb-palette-region', S.els.work);
          parent.appendChild(note);
          document.body.classList.remove('pb-has-note');
        }
        const panel = u.el('section', 'pb-palette-panel', parent);
        u.el('h2', 'pb-panel-title', panel, 'Block Palette');
        const library = S.P.pane('library', panel, 'pb-card-grid');
        for (const it of S.spec.items) {
          const card = S.P.paletteItem(library, it);
          S.P.drag(card, () => it.id, 'block');
          S.P.item(S.ctx, card, it);
        }
      },
      paletteItem: (base, S) => (library, it) => {
        const u = S.ctx.util;
        const card = S.P.ref({ palette: it.id }, u.el('div', 'pb-card', library), 'library');
        card.setAttribute('aria-label', 'Drag ' + it.label);
        card.dataset.kind = it.type.toLowerCase();
        const glyphs = {Text:'T', Heading:'H', Quote:'❝', Divider:'―', Image:'▧', Button:'▭', Spacer:'↕', Columns:'Ⅱ'};
        const symbol = u.el('span', 'pb-card-symbol', card, it.type === 'Quote' ? '' : glyphs[it.type] || 'T');
        const quoteIcon = parent => {
          const svg = u.svg('svg', { viewBox:'0 0 32 32', fill:'currentColor', 'aria-hidden':'true' }, parent);
          u.svg('path', { d:'M13 5C6 6 3 11 3 19v6c0 2 1 3 3 3h4c2 0 3-1 3-3v-7c0-2-1-3-3-3H8c0-4 2-6 5-7zm16 0c-7 1-10 6-10 14v6c0 2 1 3 3 3h4c2 0 3-1 3-3v-7c0-2-1-3-3-3h-2c0-4 2-6 5-7z' }, svg);
        };
        if (it.type === 'Quote') quoteIcon(symbol);
        const caption = u.el('div', 'pb-card-caption', card);
        u.el('strong', '', caption, it.label);
        const descriptions = { Text:'Rich text content', Heading: 'Large page heading', Quote:'Featured quote', Divider:'Horizontal rule', Image:'Image content', Button:'Call to action', Spacer:'Vertical spacing', Columns:'Column layout' };
        u.el('span', '', caption, descriptions[it.type] || 'Content block');
        const preview = u.el('div', 'pb-card-preview', card);
        if (it.type === 'Quote') quoteIcon(u.el('span', 'pb-preview-quote', preview));
        for (let i = 0; i < 4; i++) u.el('i', '', preview);
        return card;
      },
      document: (base, S) => () => {
        const u = S.ctx.util;
        const panel = u.el('section', 'pb-draft-panel', S.els.work);
        const head = u.el('div', 'pb-draft-head', panel);
        u.el('h2', 'pb-panel-title', head, 'Page Draft');
        u.el('span', 'pb-grid-label', head, '▦  ' + Math.ceil(S.spec.goalSlots.length / 2) + ' rows × 2 columns');
        const canvas = S.P.pane('canvas', panel, 'pb-draft-canvas');
        const page = u.el('div', 'pb-slot-grid', canvas);
        page.style.gridTemplateRows = 'repeat(' + Math.ceil(S.spec.goalSlots.length / 2) + ', minmax(0, 1fr))';
        for (let i = 0; i < S.spec.goalSlots.length; i++) S.P.slot(page, i);
      },
      slotView: (base, S) => (page, i) => {
        const entry = base(page, i);
        S.ctx.util.el('span', 'pb-slot-plus', entry.slot, '+');
        return entry;
      },
    },
  },
});
