// Design of this site on the fill-form/document template (templates/fill-form/document.js): a docked desktop
// mail window above the form, with a status note, a memo field with its own scrollbar, a popup menu that
// escapes the pane, and a font fitted for the lower dock.
(function () {
  'use strict';

  function desktopScrollbar(util, parent, content) {
    const rail = util.el('div', 'qt-scrollbar', parent);
    const up = util.el('button', '', rail, '▴');
    up.type = 'button'; up.setAttribute('aria-label', 'Scroll up');
    util.el('div', 'qt-scrolltrack', rail);
    const down = util.el('button', '', rail, '▾');
    down.type = 'button'; down.setAttribute('aria-label', 'Scroll down');
    up.addEventListener('click', () => { content.scrollTop -= 100; });
    down.addEventListener('click', () => { content.scrollTop += 100; });
  }

  // Allocate space once, before anchors are registered. Long instructions and
  // seeded field counts must not clip the final control in the lower dock.
  function fitDockedForm(root, docPane, formPane, tabbed) {
    const form = formPane.querySelector('.ff-form');
    const grid = form.querySelector('.ff-grid');
    const required = () => {
      const rows = Array.from(grid.children);
      const gap = parseFloat(getComputedStyle(grid).rowGap) || 0;
      return rows.reduce((sum, row) => sum + row.getBoundingClientRect().height, 0) + gap * Math.max(0, rows.length - 1);
    };
    const available = () => {
      const css = getComputedStyle(form);
      return form.clientHeight - parseFloat(css.paddingTop) - parseFloat(css.paddingBottom);
    };
    const expandDock = () => {
      const shortage = required() - available();
      if (shortage <= 0 || tabbed) return;
      const header = docPane.querySelector('.qt-mailheader');
      const minimum = (header ? header.getBoundingClientRect().height : 84) + 48;
      docPane.style.setProperty('flex-basis', `${Math.max(minimum, docPane.getBoundingClientRect().height - shortage - 6)}px`, 'important');
    };
    expandDock();
    if (required() > available()) {
      grid.style.setProperty('gap', '2px', 'important');
      form.style.setProperty('padding-top', '14px', 'important');
      form.style.setProperty('padding-bottom', '8px', 'important');
      for (const field of grid.querySelectorAll('.ff-input,.ff-ddbtn')) {
        field.style.setProperty('height', '20px', 'important');
        field.style.setProperty('font-size', '12px', 'important');
      }
      for (const label of grid.querySelectorAll('.ff-label')) label.style.setProperty('font-size', '12px', 'important');
      expandDock();
    }
  }

  env.widget({
    task: 'fill-form',
    site: 'design-fill-form-email-09',
    name: 'design',
    split: 'train',
    scenarios: ['email'],
    template: 'fill-form/document',
    design: {
      formTitle: 'New Contact',
      tabsGrid: '1fr',
      parts: {
        // Desktop popup menus float outside the docked pane's clipping rectangle.
        // Keep every option clickable, including a country menu taller than its pane.
        showList: () => (dd, btn, list, open) => {
          dd.classList.toggle('open', open);
          if (!open) return;
          dd.classList.remove('up');
          const r = btn.getBoundingClientRect();
          const toolbar = document.querySelector('.ds-toolbar');
          const footer = document.querySelector('.ds-footer');
          const ceiling = toolbar ? toolbar.getBoundingClientRect().bottom + 4 : 6;
          const floor = footer ? footer.getBoundingClientRect().top - 6 : document.documentElement.clientHeight - 6;
          const room = floor - ceiling;
          list.style.position = 'fixed';
          list.style.left = `${r.left}px`;
          list.style.right = 'auto';
          list.style.width = `${r.width}px`;
          list.style.bottom = 'auto';
          list.style.top = `${ceiling}px`;
          if (list.offsetHeight > room) {
            const rows = Array.from(list.children);
            const rowHeight = Math.floor((room - 12) / Math.max(1, rows.length));
            for (const row of rows) {
              row.style.fontSize = `${Math.min(16, Math.max(10, rowHeight - 4))}px`;
              row.style.lineHeight = `${rowHeight}px`;
              row.style.padding = '0 8px';
            }
          }
          const h = list.offsetHeight;
          const below = r.bottom + 4;
          const above = r.top - h - 4;
          list.style.top = `${Math.max(ceiling, Math.min(floor - h, below + h <= floor ? below : above))}px`;
        },
        formEnd: (base, S) => (form) => {
          const util = S.ctx.util;
          const notes = util.el('fieldset', 'qt-notes', form);
          util.el('legend', '', notes, 'Notes (optional)');
          const memo = util.el('textarea', '', notes);
          memo.setAttribute('aria-label', 'Notes (optional)');
          memo.spellcheck = false;
          desktopScrollbar(util, notes, memo);
        },
        // Preserve the original style-dependent draw while rendering desktop mail frame.
        renderEmail: (base, S) => (util, pane, d, rng) => {
          if (d.style !== 'plain') S.P.mailTools(rng);
          const box = util.el('div', 'ff-mail qt-mail', pane);
          S.P.mailHeader(util, box, d, { cls: 'qt-mailheader' });
          const body = util.el('div', 'ff-mailbody', box);
          util.el('p', '', body, d.greeting);
          for (const p of d.paragraphs) util.el('p', '', body, p);
          util.el('p', 'sig', body, d.signature.join('\n'));
          desktopScrollbar(util, box, body);
          const grip = util.el('div', 'qt-splitter', pane);
          grip.setAttribute('aria-hidden', 'true');
          return box;
        },
        panes: () => (ctx, R) => {
          const note = ctx.stage.parentElement.querySelector('.ds-brief');
          if (note) R.root.append(note);
        },
        fit: () => (ctx, R) => {
          R.root.style.fontSize = '18px';
          fitDockedForm(R.root, R.docPane, R.formPane, ctx.spec.layout.tabs);
        },
      },
    },
  });
})();
