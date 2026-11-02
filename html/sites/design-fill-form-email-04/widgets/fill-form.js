// Patron Registration layout with a floating dropdown and catalog-style email headers.
env.widget({
  task: 'fill-form',
  site: 'design-fill-form-email-04',
  name: 'design',
  split: 'train',
  scenarios: ['email'],
  template: 'fill-form/document',
  design: {
    formTitle: 'Patron Registration',
    parts: {
      showList: () => (dd, btn, list, open) => {
        dd.classList.toggle('open', open);
        dd.classList.remove('up');
        if (!open) {
          list.style.display = 'none';
          if (list.parentElement !== dd) dd.appendChild(list);
          return;
        }
        const r = btn.getBoundingClientRect();
        const font = getComputedStyle(btn);
        document.body.appendChild(list);
        Object.assign(list.style, {
          display: 'block', position: 'fixed', left: `${r.left}px`, right: 'auto', width: `${r.width}px`,
          top: '6px', bottom: 'auto', zIndex: '100', font: font.font, fontSize: font.fontSize,
        });
        const footer = document.querySelector('.ds-footer').getBoundingClientRect();
        const limit = Math.min(window.innerHeight - 6, footer.top - 6);
        const available = limit - 6;
        if (list.offsetHeight > available) {
          list.style.fontSize = `${(parseFloat(font.fontSize) * available) / list.offsetHeight}px`;
        }
        const h = list.getBoundingClientRect().height;
        const preferred = r.bottom + 4 + h <= limit ? r.bottom + 4 : r.top - 4 - h;
        list.style.top = `${Math.max(6, Math.min(preferred, limit - h))}px`;
      },
      grid: (base) => (grid, form, pane, spec) => {
        base(grid, form, pane, spec);
        grid.classList.toggle('ff-dense', spec.fields.length > 5);
      },
      mailPlain: (base, S) => (util, pane, d) => {
        const box = base(util, pane, d);
        const oldHeader = box.querySelector('.hdr');
        const header = S.P.mailHeader(util, box, d, { cls: 'ff-catalog-header' });
        box.insertBefore(header, oldHeader);
        oldHeader.remove();
        return box;
      },
      mailClient: (base, S) => (util, pane, d, rng) => {
        const box = base(util, pane, d, rng);
        const body = box.querySelector('.ff-mailbody');
        const header = S.P.mailHeader(util, box, d, { cls: 'ff-catalog-header' });
        box.insertBefore(header, body);
        box.classList.toggle('ff-long-email', d.paragraphs.length > 4);
        return box;
      },
      arranged: () => (ctx, R) => {
        const { root, formPane } = R;
        const L = ctx.spec.layout;
        const note = document.querySelector('.ds-main > .ds-brief');
        const form = formPane.querySelector('.ff-form');
        if (note) {
          if (L.tabs) {
            note.classList.add('ds-tabs-note');
            const main = ctx.stage.parentElement;
            main.parentElement.insertBefore(note, main);
          } else form.insertBefore(note, form.querySelector('.ff-grid'));
        }
        root.style.setProperty('--ff-rows', ctx.spec.fields.length);
      },
    },
  },
});
