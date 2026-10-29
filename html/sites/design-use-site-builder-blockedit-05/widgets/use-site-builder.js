// Publishing studio design; defaults reproduce this scenario's scaffold.
env.widget({
  task: 'use-site-builder',
  site: 'design-use-site-builder-blockedit-05',
  name: 'design',
  split: 'train',
  scenarios: ['blockedit'],
  template: 'use-site-builder/studio',
  design: {
    inset: 0,
    fontFamily: 'Georgia,"Times New Roman",serif',
    fontSize: '18px',
    colors: { panel: '#f9f6ee', bg: '#f9f6ee', fg: '#25232d', muted: '#625c59', line: '#d2c8ba', accent: '#730d23' },
    parts: {
      // Keep the template's context sampling, bindings, target registry and repaint.
      header: (base, S) => () => S.P.publish(S.els.app),
      publishView: (base, S) => () => S.P.ref({ publish: true }, document.querySelector('.ref-publish')),
      toolbar: () => () => {},
      navigation: () => () => {},
      layers: () => () => {},
      blockList: (base, S) => () => {
        const { util: u } = S.ctx;
        const panel = u.el('section', 'lib-blocks lib-panel', S.els.work);
        u.el('h2', 'lib-panel-heading', panel, 'Page Blocks');
        const list = S.P.pane('blocks', panel, 'lib-block-scroll');
        const columns = u.el('div', 'lib-table-head', list);
        for (const label of ['#', 'Type', 'Preview', 'Modified']) u.el('span', '', columns, label);
        const hero = u.el('div', 'lib-hero-row', list);
        u.el('span', 'lib-row-number', hero, '1');
        const caption = u.el('div', 'lib-row-caption', hero);
        u.el('strong', '', caption, 'Header');
        u.el('p', '', caption, 'Quicksilver Couriers');
        u.el('small', '', caption, 'Apr 20, 2024');
        for (const it of S.spec.items) S.P.editBlock(list, it);

        const preview = u.el('section', 'lib-preview lib-panel', S.els.work);
        u.el('h2', 'lib-panel-heading', preview, 'Page Preview');
        const page = u.el('div', 'lib-page', preview);
        const mast = u.el('div', 'lib-page-mast', page);
        u.el('span', 'lib-book-logo', mast);
        u.el('strong', '', mast, 'Rivermere Public Library');
        const nav = u.el('nav', '', mast);
        for (const label of ['Home', 'Books', 'Events', 'About']) u.el('span', '', nav, label);
        u.el('div', 'lib-hero-photo lib-photo', page);
        S.st.previewBanner = u.el('div', 'lib-preview-banner', page);
        S.st.previewBannerText = u.el('strong', '', S.st.previewBanner);
        u.el('h3', 'lib-featured-heading', page, 'Featured Books');
        const books = u.el('div', 'lib-featured-books', page);
        for (const [i, title, author] of [[0,'The River Between','Thomas Cobb'],[1,'A Field Guide to Local Wildlife','Margaret Ellis'],[2,'Stories of Home','Daniel March']]) {
          const item = u.el('article', 'lib-featured-book', books);
          const cover = u.el('div', `lib-cover lib-cover-${i}`, item);
          u.el('span', '', cover, title);
          u.el('b', 'lib-cover-flourish', cover, i === 1 ? '❧' : '✥');
          const detail = u.el('div', '', item);
          u.el('strong', '', detail, title);
          u.el('div', 'lib-author', detail, author);
          u.el('div', 'lib-learn', detail, 'Learn more  ›');
        }
        S.st.previewBody = u.el('div', 'lib-seeded-preview', page);
      },
      editBlockView: (base, S) => (list, it) => {
        const u = S.ctx.util, index = S.spec.items.indexOf(it);
        const block = S.P.ref({ block: it.id }, u.el('button', 'ab-editblock lib-block-row', list), 'blocks');
        block.type = 'button';
        u.el('span', 'lib-row-number', block, String(index + 2));
        if (it.type === 'Image') {
          const thumb = u.el('div', 'lib-thumb qs-thumb', block);
          const svg = u.svg('svg', { viewBox: '0 0 200 94', role: 'img', 'aria-label': 'Quicksilver delivery truck' }, thumb);
          u.svg('rect', { x: 0, y: 0, width: 200, height: 94, fill: '#8cc5ed' }, svg);
          u.svg('path', { d: 'M0 68h200v26H0z', fill: '#55784b' }, svg);
          u.svg('path', { d: 'M0 76h200v18H0z', fill: '#777c7c' }, svg);
          u.svg('path', { d: 'M8 65 24 43 39 64M45 64 61 32 78 64M157 64 173 38 195 64', fill: '#97a9ad' }, svg);
          u.svg('path', { d: 'M33 37h103q5 0 5 5v32H33z', fill: '#f5f5f2', stroke: '#52636b', 'stroke-width': 2 }, svg);
          u.svg('path', { d: 'M141 49h25l20 18v12h-45z', fill: '#e8ecea', stroke: '#52636b', 'stroke-width': 2 }, svg);
          u.svg('path', { d: 'M151 53h13l13 12h-26z', fill: '#9ed7f3', stroke: '#52636b', 'stroke-width': 1 }, svg);
          u.svg('circle', { cx: 66, cy: 78, r: 10, fill: '#222' }, svg);
          u.svg('circle', { cx: 66, cy: 78, r: 4, fill: '#ddd' }, svg);
          u.svg('circle', { cx: 165, cy: 78, r: 10, fill: '#222' }, svg);
          u.svg('circle', { cx: 165, cy: 78, r: 4, fill: '#ddd' }, svg);
          const logo = u.svg('text', { x: 81, y: 63, fill: '#154e91', 'font-size': 27, 'font-family': 'Georgia,serif', 'font-weight': 'bold', 'font-style': 'italic' }, svg);
          logo.textContent = 'QS';
        }
        const modifiedDate = u.el('span', 'lib-row-date', block, it.type === 'Image' ? 'Apr 24, 2024' : 'Apr 20, 2024');
        const caption = u.el('div', 'lib-row-caption', block);
        u.el('strong', '', caption, it.label);
        const copy = u.el('p', 'lib-list-copy', caption);
        const meta = u.el('small', '', caption);
        return { block, copy, meta };
      },
      blockInspector: (base, S) => () => {
        const { util: u } = S.ctx;
        const panel = u.el('section', 'lib-properties lib-panel', S.els.work);
        u.el('h2', 'lib-panel-heading', panel, 'Block Properties');
        const inspector = S.P.pane('inspector', panel, 'lib-inspector');
        u.el('label', 'lib-type-label', inspector, 'Block Type');
        S.st.blockType = u.el('div', 'lib-block-type', inspector);
        S.st.inspectName = u.el('div', 'lib-hidden', inspector);
        S.P.field(inspector, { id: 'title', label: 'Text', limit: 90 }, true, 'inspector');
        S.P.field(inspector, { id: 'url', label: 'Link URL', limit: 100 }, true, 'inspector');
        const label = u.el('div', 'ab-field lib-alignment', inspector);
        u.el('div', 'ab-fieldlabel', label, 'Alignment');
        const group = u.el('div', 'ab-segment', label);
        // Direct choices retain the template's pointer and oracle behavior.
        for (const a of ['Left', 'Center', 'Right']) {
          const b = S.P.alignmentButton(group, a);
          S.st.align[a] = b;
          b.addEventListener('click', () => S.P.edit((m) => { m.props[m.selected].align = a; }));
        }
        const padding = S.P.field(inspector, { id: 'padding', label: 'Padding (px)', limit: 2 }, true, 'inspector');
        padding.inputMode = 'numeric';
        padding.type = 'number'; padding.min = '0'; padding.max = '64';
        S.st.spacingBox = u.el('div', 'lib-hidden', inspector);
      },
      fieldView: (base, S) => (parent, def, prop) => {
        const view = base(parent, def, prop);
        if (def.id === 'title') {
          const input = S.ctx.util.el('input', 'ab-input', view.wrap);
          input.type = 'text'; input.maxLength = def.limit; input.spellcheck = false;
          input.setAttribute('aria-label', def.label);
          view.input.replaceWith(input); view.input = input;
        }
        return view;
      },
      paintBlocks: (base, S) => (m) => {
        base(m);
        const selected = S.spec.items.find((it) => it.id === m.selected);
        S.st.blockType.textContent = `${selected.type}${selected.type === 'Image' ? ' (Linked Banner)' : ''}`;
        for (const it of S.spec.items) {
          const entry = S.st.blocks[it.id];
          entry.meta.textContent = `${it.type} · ${it.type === 'Image' ? 'Linked banner' : 'Content block'}`;
        }
        const bannerItem = S.spec.items.find((it) => it.type === 'Image') || S.spec.items[0];
        const props = m.props[bannerItem.id];
        S.st.previewBannerText.textContent = props.title;
        S.st.previewBanner.title = props.url;
        S.st.previewBannerText.style.textAlign = props.align.toLowerCase();
        S.st.previewBody.textContent = S.spec.items.filter((it) => it.id !== bannerItem.id).map((it) => m.props[it.id].title).join(' · ');
      },
    },
  },
});
