env.widget({
  task: 'use-text-editor',
  site: 'design-use-text-editor-findreplace-03',
  name: 'design',
  split: 'train',
  scenarios: ['findreplace'],
  traits: { doc: 'prose' },
  template: 'use-text-editor/rich',
  design: {
    fontFamilies: ['Arial, sans-serif', 'Arial, sans-serif', 'Arial, sans-serif'],
    fontSizes: [21, 19, 17, 15],
    lineHeight: 1.5,
    minBodyHeight: 120,
    parts: {
      heading: (base, S) => (ctx) => {
        const part = base(ctx);
        part.head.classList.add('ws-editor-menu');
        S.st.wsEditorMenu = part.head;
        part.head.replaceChildren(part.saved);
        for (const label of ['File', 'Edit', 'View', 'Insert', 'Format', 'Tools', 'Table', 'Help']) {
          ctx.util.el('span', '', part.head, label);
        }
        return part;
      },
      toolbar: (base, S) => (ctx, look) => {
        // Preserve the classic look-stream draws while drawing document frame.
        look.bool(0.6);
        const order = look.bool(0.5);
        if (look.bool(0.5)) look.pick(ctx.spec.lang === 'py' ? ['README.md', 'settings.toml', 'test_util.py'] : ['README.md', 'package.json', 'util.test.js']);
        const part = base(ctx, { bool: () => order });
        part.bar.classList.add('ws-editor-ribbon');
        const control = (label, cls, key, value) => {
          const item = ctx.util.el('button', `ws-ribbon-control ${cls || ''}`, null, label);
          item.type = 'button';
          item.title = cls || label;
          const art = {
            'align-left': '<path d="M3 4h19M3 9h13M3 14h19M3 19h13"/>',
            'align-center': '<path d="M3 4h19M6 9h13M3 14h19M6 19h13"/>',
            'align-right': '<path d="M3 4h19M9 9h13M3 14h19M9 19h13"/>',
            'align-justify': '<path d="M3 4h19M3 9h19M3 14h19M3 19h19"/>',
            bullets: '<path stroke="#1462a7" stroke-width="4" d="M2 4h3M2 12h3M2 20h3"/><path d="M10 4h13M10 12h13M10 20h13"/>',
            numbering: '<path d="M10 4h13M10 12h13M10 20h13"/><path stroke="#1462a7" d="m2 2 2-1v6M2 10q5-2 1 4l-1 1h4M2 18h4l-2 2q4 2-2 3"/>',
            spacing: '<path d="M12 4h11M12 9h11M12 14h11M12 19h11"/><path fill="#1863a7" stroke="none" d="m4 0-4 6h8ZM4 24l-4-6h8Z"/>',
            indent: '<path d="M2 3h21M11 8h12M11 13h12M2 20h21"/><path fill="#1863a7" stroke="none" d="m1 7 7 5-7 5Z"/>',
            link: '<path stroke-width="3" d="m9 16-2 2a4 4 0 0 1-6-6l6-6a4 4 0 0 1 6 0m2 2 2-2a4 4 0 0 1 6 6l-6 6a4 4 0 0 1-6 0m-4-2 10-10"/>',
            picture: '<rect x="1" y="2" width="23" height="20" fill="#a9d9ed" stroke="#073149"/><circle cx="17" cy="7" r="3" fill="#ffdf42" stroke="none"/><path d="m2 20 7-10 6 7 4-5 4 8" fill="#5da54a" stroke="none"/>',
            table: '<rect x="1" y="2" width="23" height="22" fill="#fff" stroke="#12314d"/><path stroke="#174881" stroke-width="4" d="M2 6h21"/><path stroke-width="1" d="M1 12h23M1 18h23M8 8v16M16 8v16"/>',
          }[cls?.split(' ')[0]];
          if (art) item.innerHTML = `<svg viewBox="0 0 26 26" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">${art}</svg>`;
          if (key) item.addEventListener('click', () => {
            const cur = S.st.ctx.model.cur[0];
            const format = S.st.wsFormat || (S.st.wsFormat = []);
            const a = Math.min(cur.a, cur.h), b = Math.max(cur.a, cur.h);
            const previous = format.findLast(x => x.key === key && x.a === a && x.b === b);
            format.push({ a, b, key, value: previous && previous.value === value ? '' : value });
            item.classList.toggle('active', !(previous && previous.value === value));
            S.st.draw(S.st.ctx.model);
          });
          return item;
        };
        const font = control('Arial', 'font');
        const size = control('11', 'size');
        const chooser = (button, choices, key) => {
          const menu = ctx.util.el('div', 'ws-format-menu', part.bar);
          menu.hidden = true;
          for (const [name, value] of choices) {
            const item = control(name, '', key, value);
            item.addEventListener('click', () => { button.firstChild.textContent = name; menu.hidden = true; });
            menu.append(item);
          }
          button.append(ctx.util.el('span', '', null, '▾'));
          button.addEventListener('click', () => { menu.style.left = button.offsetLeft + 'px'; menu.hidden = !menu.hidden; });
          return menu;
        };
        const fontMenu = chooser(font, [['Arial', 'Arial, sans-serif'], ['Georgia', 'Georgia, serif'], ['Courier New', 'Courier New, monospace']], 'fontFamily');
        const sizeMenu = chooser(size, [['11', '21px'], ['12', '23px'], ['14', '26px'], ['18', '30px']], 'fontSize');
        const icons = [['≡', 'align-left active', 'textAlign', 'left'], ['≡', 'align-center', 'textAlign', 'center'], ['≡', 'align-right', 'textAlign', 'right'], ['▤', 'align-justify', 'textAlign', 'justify'], ['• ☰', 'bullets', 'listStyleType', 'disc'], ['1. ☰', 'numbering', 'listStyleType', 'decimal'], ['↕', 'spacing', 'lineHeight', '2'], ['⇥', 'indent', 'paddingLeft', '30px'], ['♧', 'link', 'textDecoration', 'underline'], ['▧', 'picture'], ['▦ ▾', 'table']];
        part.bFind.innerHTML = '<svg viewBox="0 0 27 27" width="27" height="27" fill="none" stroke="#06356a" stroke-width="1.4" aria-hidden="true"><circle cx="10" cy="10" r="8" fill="#f4f9ff"/><path d="m16 16 9 9" stroke-width="4"/></svg><span>Find</span><span class="ws-find-arrow">▾</span>';
        part.bFind.title = 'Find and replace';
        part.bFind.setAttribute('aria-label', 'Find and replace');
        part.bar.replaceChildren(font, size, control('B', 'bold', 'fontWeight', '700'), control('I', 'italic', 'fontStyle', 'italic'), control('U', 'underline', 'textDecoration', 'underline'), ...icons.map(args => control(...args)), part.bFind, part.mode, part.menu, fontMenu, sizeMenu);
        S.st.wsEditorMenu.append(part.bUndo, part.bRedo);
        part.mode.classList.add('ws-mode-selector');
        return part;
      },
      paragraph: (base, S) => (ctx, runs, offset, colorOf) => {
        const segments = offset === 0 ? runs : runs.flatMap(r => r.t.split(/(?<=[.!?])(?=\s)/).map(t => ({ ...r, t })));
        const part = base(ctx, segments, offset, colorOf);
        if (offset !== 0) part.p.classList.add('ws-doc-objectives');
        for (const format of S.st.wsFormat || []) {
          if (format.a === format.b || (part.end > format.a && offset < format.b)) {
            part.p.style[format.key] = format.value;
            if (format.key === 'listStyleType') part.p.style.display = format.value ? 'list-item' : '';
          }
        }
        return part;
      },
      metrics: (base) => (ctx, box, squeeze, look, controls) => {
        const result = base(ctx, box, squeeze, { pick: values => values[0] }, controls);
        controls.card.style.width = `${box.w - 12}px`;
        controls.bodyEl.style.height = '';
        controls.page.style.width = '';
        controls.page.style.height = '';
        return { ...result, bodyH: Math.max(120, box.h - 180) };
      },
      shown: (base) => (ctx, controls, model) => {
        base(ctx, controls, model);
        controls.mode.textContent = controls.mode.textContent.replace('✎ ', '').replace(' ▾', '');
        controls.card.classList.toggle('ws-find-open', !!model.find?.open);
        controls.card.classList.toggle('ws-replace-open', !!model.find?.rep);
        controls.page.classList.toggle('ws-reviewing', model.mode === 'suggest');
      },
      footer: (base) => (ctx, foot, model, suggestions) => {
        base(ctx, foot, model, suggestions);
        while (foot.children.length > 1) foot.lastChild.remove();
      },
    },
  },
});
