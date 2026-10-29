// Publishing studio design; defaults reproduce this scenario's scaffold.
env.widget({
  task: 'use-site-builder',
  site: 'design-use-site-builder-page-02',
  name: 'design',
  split: 'train',
  scenarios: ['page'],
  template: 'use-site-builder/studio',
  design: {
    fontFamily: 'Georgia,"Times New Roman",serif',
    fontSize: '16px',
    inset: 0,
    emptySection: 'Drag a block here',
    parts: {
      header: (base, S) => () => {
        const u = S.ctx.util;
        const head = u.el('header', 'chronicle-editor-head', S.els.app);
        const title = u.el('h1', '', head);
        u.el('b', '', title, 'Edit Page: ');
        u.el('span', '', title, 'Home Page');
        const note = document.querySelector('.ref-instruction');
        if (note) head.appendChild(note);
        const meta = u.el('div', 'chronicle-meta', head);
        u.el('span', '', meta, 'Last updated: Apr 24, 2011 10:16 AM　 |　 ');
        S.els.draft = u.el('span', 'chronicle-draft', meta, 'Unpublished changes');
        S.P.publish(head);
      },
      toolbar: (base, S) => () => {
        const tabs = S.ctx.util.el('div', 'chronicle-tabs', S.els.app);
        for (const label of ['Layout', 'SEO & Metadata', 'Social Sharing', 'Page Settings']) {
          S.ctx.util.el('span', label === 'Layout' ? 'active' : '', tabs, label);
        }
      },
      navigation: () => () => {},
      footer: (base, S) => () => {
        const result = base();
        S.els.app.querySelector('.ab-foot').hidden = true;
        return result;
      },
      library: (base, S) => () => {
        const u = S.ctx.util;
        const region = u.el('section', 'chronicle-blocks', S.els.work);
        u.el('h2', '', region, 'Add Content Blocks');
        const library = S.P.pane('library', region, 'chronicle-palette');
        for (const it of S.spec.items) {
          const block = S.P.paletteItem(library, it);
          S.P.drag(block, () => it.id, 'block');
          S.P.item(S.ctx, block, it);
        }
      },
      paletteItem: (base, S) => (library, it) => {
        const block = base(library, it);
        const symbol = block.querySelector('.ab-symbol');
        symbol.replaceChildren();
        if (it.type === 'Heading') symbol.textContent = 'Aa';
        else {
          const u = S.ctx.util;
          const svg = u.svg('svg', { viewBox:'0 0 40 40', fill:'none', stroke:'currentColor', 'stroke-width':2 }, symbol);
          const paths = {
            Text: 'M3 7h34 M3 13h26 M3 19h34 M3 25h34 M3 31h22',
            Image: 'M4 6h31v27H4z M5 30l9-13 8 10 6-7 6 10z M29 13h.1',
            Button: 'M4 7h32v26H4z M17 13l11 7-11 7z',
            Divider: 'M3 7h34v26H3z M20 7v26',
            Quote: 'M18 7C8 10 3 17 3 25c0 8 13 9 13 1 0-5-4-7-8-5 1-5 5-9 10-11z M37 7C27 10 22 17 22 25c0 8 13 9 13 1 0-5-4-7-8-5 1-5 5-9 10-11z',
          };
          u.svg('path', { d:paths[it.type] || 'M4 6h32v28H4z M4 19h32', fill: ['Image','Button','Quote'].includes(it.type) ? 'currentColor' : 'none', 'fill-rule':'evenodd' }, svg);
        }
        return block;
      },
      document: (base, S) => () => {
        const u = S.ctx.util;
        const main = u.el('section', 'chronicle-layout', S.els.work);
        u.el('h2', '', main, 'Page Layout');
        const canvas = S.P.pane('canvas', main, 'chronicle-canvas');
        const page = u.el('div', 'ab-page', canvas);
        page.style.gridTemplateColumns = 'repeat(2,minmax(0,1fr))';
        page.style.gridTemplateRows = `repeat(${Math.ceil(S.spec.goalSlots.length / 2)},minmax(66px,1fr))`;
        for (let i = 0; i < S.spec.goalSlots.length; i++) S.P.slot(page, i);
      },
      slotView: (base, S) => (page, i) => {
        const entry = base(page, i);
        entry.slot.querySelector('.ab-position').textContent = String(i + 1);
        return entry;
      },
      pageInspector: () => () => {},
      paint: (base, S) => (m) => {
        base(m);
        S.els.draft.textContent = m.committed ? 'Published' : 'Unpublished changes';
        const status = document.querySelector('.chronicle-status');
        if (status) status.textContent = m.committed ? 'Published' : 'Unpublished';
      },
    },
  },
});
