// Publishing studio design; defaults reproduce this scenario's scaffold.
env.widget({
  task: 'use-site-builder',
  site: 'design-use-site-builder-blockedit-04',
  name: 'design',
  split: 'train',
  scenarios: ['blockedit'],
  template: 'use-site-builder/studio',
  design: {
    inset: 0,
    fontSize: '15px',
    parts: {
      // Keep the studio's bindings and context draws; supply this editor's native panes.
      header: (base, S) => () => {
        const slot = document.querySelector('.gnome-publish-slot');
        slot.replaceChildren();
        S.P.publish(slot);
      },
      toolbar: () => () => {},
      navigation: () => () => {},
      footer: (base, S) => () => {
        const result = base();
        S.els.app.querySelector('.ab-foot').hidden = true;
        return result;
      },
      blockedit: (base, S) => () => {
        S.P.blockList();
        S.P.blockInspector();
        const u = S.ctx.util;
        const preview = u.el('section', 'reef-preview', S.els.work);
        const head = u.el('div', 'reef-pane-heading', preview);
        u.el('h2', '', head, 'Live Preview');
        const devices = u.el('div', 'reef-devices', head);
        for (const [icon, label] of [['desktop', 'Desktop'], ['pages', 'Tablet'], ['phone', 'Mobile']]) {
          const b = S.P.iconButton(devices, icon, label);
          if (label === 'Tablet') b.querySelector('path').setAttribute('d', 'M4 3h16v18H4zM4 18h16M11 20h2');
          if (label === 'Desktop') b.classList.add('on');
        }
        const page = u.el('div', 'reef-webpage', preview);
        const nav = u.el('div', 'reef-webnav', page);
        const brand = u.el('strong', '', nav, 'Coral Reef Dive Center');
        brand.insertAdjacentHTML('afterbegin', document.querySelector('.gnome-coral').innerHTML);
        const links = u.el('div', '', nav);
        for (const name of ['Home', 'Dive Trips', 'About', 'Contact']) u.el('span', '', links, name);
        const hero = u.el('div', 'reef-hero reef-photo', page);
        u.el('h1', '', hero, 'Discover a Brighter Underwater World');
        u.el('p', '', hero, 'Guided dives, healthy reefs, stronger oceans.');
        u.el('span', 'reef-plan', hero, 'Plan Your Dive');
        const turtle = u.el('div', 'reef-turtle reef-photo', page);
        S.st.previewCopy = u.el('h2', '', turtle, 'Explore Our Dive Trips');
        const text = u.el('div', 'reef-intro', page);
        u.el('h3', '', text, 'Small Groups. Big Experiences.');
        u.el('p', '', text, "Join our expert guides for unforgettable dives at some of the world's most vibrant reefs. We focus on safety, education and ocean conservation.");
        u.el('div', 'reef-bottom reef-photo', page);
      },
      blockList: (base, S) => () => {
        const u = S.ctx.util;
        const main = u.el('section', 'reef-blocks', S.els.work);
        u.el('h2', 'reef-pane-heading', main, 'Page Blocks');
        const list = S.P.pane('blocks', main, 'reef-blocklist');
        for (const it of S.spec.items) S.P.editBlock(list, it);
      },
      editBlockView: (base, S) => (list, it) => {
        const u = S.ctx.util;
        const block = S.P.ref({block: it.id}, u.el('button', 'ab-editblock reef-block-row', list), 'blocks');
        block.type = 'button';
        u.el('span', 'reef-block-number', block, String(S.spec.items.indexOf(it) + 1));
        const picture = u.el('span', 'reef-block-thumb', block);
        if (/Image/.test(it.label)) picture.classList.add('reef-photo', 'reef-thumb-image');
        else picture.innerHTML = '<i></i><i></i><i></i>';
        const words = u.el('span', 'reef-block-words', block);
        u.el('strong', '', words, it.label);
        u.el('span', 'reef-block-type', words, it.label.replace(/\s+\d+$/, ''));
        const copy = u.el('p', 'reef-bound-copy', words), meta = u.el('small', 'reef-bound-meta', words);
        return {block, copy, meta};
      },
      blockInspector: (base, S) => () => {
        base();
        const u = S.ctx.util;
        const inspector = S.st.panes.inspector;
        inspector.classList.add('reef-properties');
        inspector.querySelector('.ab-tabs').remove();
        const heading = u.el('div', 'reef-pane-heading', null);
        u.el('h2', '', heading, 'Block Properties');
        S.st.selectedType = u.el('span', 'reef-property-type', heading);
        inspector.prepend(heading);
        const image = u.el('div', 'reef-image-control', null);
        u.el('div', 'reef-inspector-photo reef-photo', image);
        const change = u.el('button', 'reef-change-image', image);
        change.type = 'button';
        S.P.icon(change, 'image');
        u.el('span', '', change, 'Change Image');
        change.addEventListener('click', () => env.log('decoy', {label: 'Change Image'}));
        heading.after(image);
        const pad = inspector.querySelector('[aria-label="Padding"]');
        const arrows = u.el('span', 'reef-number-arrows', pad.parentElement);
        arrows.textContent = '▴\n▾';
        u.el('span', 'reef-px', pad.parentElement, 'px');
      },
      fieldView: (base, S) => (parent, def, prop) => {
        const u = S.ctx.util;
        const wrap = u.el('label', 'ab-field reef-field', parent);
        u.el('span', 'ab-fieldlabel', wrap, def.label);
        const input = u.el('input', 'ab-input', wrap);
        input.type = 'text';
        input.setAttribute('aria-label', def.label);
        input.maxLength = def.limit;
        input.spellcheck = false;
        const out = u.el('output', 'ab-counter', wrap);
        return {wrap, input, out};
      },
      alignmentButton: (base, S) => (group, a) => {
        const b = base(group, a);
        b.textContent = '';
        b.title = a;
        b.setAttribute('aria-label', a);
        b.classList.add('reef-align', 'reef-align-' + a.toLowerCase());
        const svg = S.ctx.util.svg('svg', {viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.7}, b);
        const paths = {Left: 'M3 5h18M3 10h12M3 15h18M3 20h9', Center: 'M3 5h18M6 10h12M3 15h18M8 20h8', Right: 'M3 5h18M9 10h12M3 15h18M12 20h9'};
        S.ctx.util.svg('path', {d: paths[a]}, svg);
        return b;
      },
      paintBlocks: (base, S) => (m) => {
        base(m);
        const item = S.spec.items.find(it => it.id === m.selected);
        S.st.selectedType.textContent = item.label.replace(/\s+\d+$/, '') + ' Block';
        document.querySelector('.gnome-draft-status span:last-child').textContent = m.committed ? 'Published' : 'Draft (unpublished)';
        if (S.st.previewCopy) S.st.previewCopy.textContent = m.props[S.spec.items.find(it => /Image/.test(it.label))?.id || m.selected].title;
      },
      rendered: (base, S) => (ctx) => {
        base(ctx);
        S.els.app.classList.add('reef-editor');
      },
    },
  },
});
