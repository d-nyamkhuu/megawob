// Publishing studio design; defaults reproduce this scenario's scaffold.
env.widget({
  task: 'use-site-builder',
  site: 'design-use-site-builder-email-05',
  name: 'design',
  split: 'train',
  scenarios: ['email'],
  template: 'use-site-builder/studio',
  design: {
    inset: 0,
    fontFamily: 'Georgia,"Times New Roman",serif',
    emptySection: 'Drag a content block here',
    parts: {
      header: (base, S) => () => {
        const head = S.ctx.util.el('header', 'ab-head cc-window-title', S.els.app);
        S.ctx.util.el('span', 'cc-title-envelope', head, '✉');
        S.ctx.util.el('strong', '', head, 'Create Email Campaign');
      },
      toolbar: () => () => {},
      navigation: () => () => {},
      footer: (base, S) => () => {
        const result = base();
        const foot = result.status.parentElement;
        foot.classList.add('cc-campaign-footer');
        S.P.publish(foot);
        return result;
      },
      composer: (base, S) => () => {
        const editor = S.ctx.util.el('section', 'cc-editor', S.els.work);
        S.els.editor = editor;
        S.P.campaignInspector();
        S.P.library();
        S.P.document();
        const preview = document.querySelector('.cc-email-preview');
        if (preview) S.els.work.appendChild(preview);
      },
      campaignInspector: (base, S) => () => {
        const fields = S.P.pane('inspector', S.els.editor, 'cc-metadata');
        S.spec.fields.forEach(def => S.P.field(fields, def, false, 'inspector'));
      },
      library: (base, S) => () => {
        const u = S.ctx.util;
        const panel = u.el('section', 'cc-block-panel', S.els.editor);
        const tabs = u.el('div', 'cc-editor-tabs', panel);
        ['Content Blocks', 'Design', 'Settings'].forEach((text, i) => u.el('span', i ? '' : 'active', tabs, text));
        const library = S.P.pane('library', panel, 'ab-library');
        S.spec.items.forEach(it => {
          const block = S.P.paletteItem(library, it);
          S.P.drag(block, () => it.id, 'block');
          S.P.item(S.ctx, block, it);
        });
        const social = u.el('div', 'cc-social-tile', library);
        u.el('div', 'cc-social-art', social, '◉  f  ♥');
        u.el('b', '', social, 'Social Links');
      },
      paletteItem: (base, S) => (library, it) => {
        const block = base(library, it);
        block.dataset.kind = it.type;
        block.style.order = ['Heading', 'Text', 'Image', 'Quote', 'Divider', 'Button'].indexOf(it.type);
        const symbol = block.querySelector('.ab-symbol');
        symbol.classList.add('cc-block-art');
        if (it.type === 'Heading' || it.type === 'Quote') {
          symbol.textContent = it.type === 'Heading' ? 'Aa' : '“';
        }
        if (it.type === 'Image') symbol.innerHTML = '<svg viewBox="0 0 76 56" aria-hidden="true"><defs><linearGradient id="cc-photo" x2="0" y2="1"><stop stop-color="#aebee5"/><stop offset="1" stop-color="#8199cd"/></linearGradient></defs><path d="M5 6H71V53H5Z" fill="url(#cc-photo)" stroke="#293f65"/><path d="M7 51L27 25 43 41 52 31 70 51" fill="#4d669e" stroke="none"/><circle cx="54" cy="20" r="6" fill="#546b9f" stroke="none"/></svg>';
        if (it.type === 'Button') symbol.innerHTML = '<svg viewBox="0 0 80 56" aria-hidden="true"><rect x="3" y="15" width="74" height="29" rx="2" fill="#497bc4" stroke="#284575"/><path d="M5 17H75" stroke="#a0bae4"/></svg>';
        if (it.type === 'Divider') symbol.innerHTML = '<svg viewBox="0 0 80 56" aria-hidden="true"><path d="M0 31H80" stroke="#263f68" stroke-width="4"/></svg>';
        return block;
      },
      document: (base, S) => () => {
        const canvas = S.P.pane('canvas', S.els.editor, 'ab-canvas');
        const page = S.ctx.util.el('div', 'ab-page email', canvas);
        page.style.gridTemplateRows = `repeat(${S.spec.goalSlots.length}, minmax(0,1fr))`;
        S.spec.goalSlots.forEach((_, i) => S.P.slot(page, i));
      },
      slotView: (base, S) => (page, i) => {
        const row = S.ctx.util.el('div', 'cc-slot-row', page);
        S.ctx.util.el('span', 'cc-slot-number', row, String(i + 1));
        return base(row, i);
      },
      paint: (base, S) => (model) => {
        base(model);
        S.els.status.textContent = model.committed ? 'Sent' : 'Unsent';
        S.els.app.classList.toggle('cc-sent', model.committed);
      },
    },
  },
});
