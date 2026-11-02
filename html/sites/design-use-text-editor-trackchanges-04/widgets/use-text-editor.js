env.widget({
  task: 'use-text-editor',
  site: 'design-use-text-editor-trackchanges-04',
  name: 'design',
  split: 'train',
  scenarios: ['trackchanges'],
  traits: { doc: 'prose' },
  template: 'use-text-editor/rich',
  design: {
    marginWidth: 300,
    minPageWidth: 360,
    maxPageWidth: 1600,
    fontSizes: [22, 21, 20, 19],
    fontFamilies: ["Arial, 'Segoe UI', sans-serif", "Arial, sans-serif", "Georgia, serif"],
    lineHeight: 1.45,
    parts: {
      toolbar: (base, S) => function (ctx, look) {
        const built = base(ctx, look);
        const { bar, bFind, mode, mItems } = built;
        const P = S.P;
        const buttons = Array.from(bar.querySelectorAll('button'));
        const style = buttons[2];
        style.textContent = 'Normal⌄';
        style.disabled = false;
        const font = P.el('button', 'tr-b carbon-dd', 'Calibri⌄');
        const size = P.el('button', 'tr-b carbon-dd carbon-size', '11⌄');
        font.type = size.type = 'button';
        font.setAttribute('aria-label', 'Font family');
        size.setAttribute('aria-label', 'Font size');
        style.after(font, size);
        const pop = P.el('div', 'carbon-format-pop');
        pop.hidden = true;
        const openChoices = (anchor, values, choose) => {
          pop.replaceChildren(...values.map((value) => {
            const option = P.el('button', '', value);
            option.type = 'button';
            option.addEventListener('click', (event) => {
              event.stopPropagation();
              choose(value);
              pop.hidden = true;
            });
            return option;
          }));
          pop.style.left = `${anchor.offsetLeft}px`;
          pop.hidden = false;
        };
        style.addEventListener('click', () => openChoices(style, ['Normal', 'Heading 1', 'Heading 2'], (value) => {
          style.textContent = `${value}⌄`;
        }));
        font.addEventListener('click', () => openChoices(font, ['Calibri', 'Arial', 'Georgia'], (value) => {
          font.textContent = `${value}⌄`;
          const text = S.els && S.els.textEl;
          if (text) text.style.setProperty('--editor-font', value === 'Georgia' ? 'Georgia, serif' : 'Arial, sans-serif');
        }));
        size.addEventListener('click', () => openChoices(size, ['11', '12', '14', '18'], (value) => {
          size.textContent = `${value}⌄`;
          const text = S.els && S.els.textEl;
          if (text) text.style.setProperty('--editor-size', `${value}px`);
        }));
        bar.append(pop);
        for (const b of buttons.slice(3, 6)) b.disabled = false;
        const icons = {
          left: '<path d="M2 3h16M2 7h10M2 11h16M2 15h10"/>',
          center: '<path d="M2 3h16M5 7h10M2 11h16M5 15h10"/>',
          right: '<path d="M2 3h16M8 7h10M2 11h16M8 15h10"/>',
          justify: '<path d="M2 3h16M2 7h16M2 11h16M2 15h16"/>',
          bullets: '<circle cx="3" cy="4" r="1"/><circle cx="3" cy="9" r="1"/><circle cx="3" cy="14" r="1"/><path d="M7 4h11M7 9h11M7 14h11"/>',
          color: '<path d="M4 16 10 2l6 14M6 12h8"/>',
          highlight: '<path d="M4 14 12 3l4 3-8 11H4z"/>',
          link: '<path d="M7 6 5 6a4 4 0 0 0 0 8h4M11 6h4a4 4 0 0 1 0 8h-3M7 10h6"/>',
        };
        const tools = P.el('div', 'carbon-format-tools');
        for (const [key, label] of [['left', 'Align left'], ['center', 'Center'], ['right', 'Align right'], ['justify', 'Justify'], ['bullets', 'Bulleted list'], ['color', 'Text color'], ['highlight', 'Highlight'], ['link', 'Insert link']]) {
          const b = P.el('button', `carbon-tool carbon-${key}`);
          b.type = 'button';
          b.title = label;
          b.setAttribute('aria-label', label);
          b.setAttribute('aria-pressed', 'false');
          b.innerHTML = `<svg viewBox="0 0 20 20" aria-hidden="true">${icons[key]}</svg>`;
          b.addEventListener('click', () => {
            const on = b.getAttribute('aria-pressed') !== 'true';
            b.setAttribute('aria-pressed', String(on));
            if (key === 'left' || key === 'center' || key === 'right' || key === 'justify') {
              for (const other of tools.querySelectorAll('.carbon-left,.carbon-center,.carbon-right,.carbon-justify')) other.setAttribute('aria-pressed', String(other === b));
              const text = S.els && S.els.textEl;
              if (text) text.style.setProperty('--editor-align', key);
            }
          });
          tools.append(b);
        }
        buttons.slice(3, 6).forEach((b) => b.addEventListener('click', () => b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true'))));
        const grow = bar.querySelector('.tr-grow');
        bar.insertBefore(bFind, grow);
        bar.insertBefore(tools, bFind);
        bFind.textContent = '⌕';
        bFind.title = 'Find and replace';
        bFind.setAttribute('aria-label', 'Find and replace');
        const group = P.el('div', 'carbon-mode-tabs');
        mode.replaceWith(group);
        group.append(mode);
        for (const [key, name] of [['suggest', 'Suggesting'], ['view', 'Viewing']]) {
          const b = P.el('button', 'carbon-mode-action', name);
          b.type = 'button';
          b.dataset.mode = key;
          b.addEventListener('click', () => mItems[key].click());
          group.append(b);
        }
        return built;
      },
      shown: (base, S) => function (ctx, controls, model) {
        base(ctx, controls, model);
        controls.bar.querySelectorAll('.carbon-mode-action').forEach((button) => {
          button.classList.toggle('active', button.dataset.mode === model.mode);
        });
        controls.mode.classList.toggle('active', model.mode === 'edit');
      },
      suggestionCard: (base, S) => function (ctx, suggestion, colorOf) {
        const built = base(ctx, suggestion, colorOf);
        const card = built.card;
        const heading = card.querySelector('.hd');
        const name = heading.querySelector('.nm');
        const person = S.P.el('div', 'tr-person');
        name.replaceWith(person);
        person.append(name, S.P.el('small', 'tr-time', 'Today'));
        built.controls.accept.textContent = 'Accept';
        built.controls.reject.textContent = 'Reject';
        const excerpt = (suggestion.ins || '').trim();
        if (excerpt.length > 56) card.append(S.P.el('div', 'tr-quote', excerpt.slice(0, 145)));
        return built;
      },
    },
  },
});
