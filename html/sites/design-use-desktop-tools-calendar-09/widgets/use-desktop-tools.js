// IRIX calendar design: adds the classic toolbar and event inspector controls to the shared workspace widget.
(function () {
  'use strict';

  env.widget({
    task: 'use-desktop-tools',
    site: 'design-use-desktop-tools-calendar-09',
    name: 'design',
    split: 'train',
    scenarios: ['calendar'],
    traits: { selectors: true },
    template: 'use-desktop-tools/workspace',
    design: {
      agendaHidden: true,
      formAlways: true,
      formTitle: 'Title:',
      namePlaceholder: '',
      createLabel: 'Create event',
      cancelLabel: 'Clear',
      calTime12: false,
      calNavText: false,
      calRowCount: 26,
      calEventPanel: false,
      calSelectedAgenda: false,
      parts: {
        calHead: (base, S) => (C) => {
          const { util, spec, head, cal } = C;
          const shelf = util.el('div', 'irix-shelf');
          const tools = [
            ['New Event', '<rect x="4" y="4" width="24" height="24" fill="#c9caf0" stroke="#2a2a5a" stroke-width="2"/>'],
            ['Day', '', 1], ['Week', ''], ['Month', ''], ['Today', ''], ['|'], ['Previous', '<path d="M3 16l12-11v7h14v8H15v7z" fill="#6a68c8" stroke="#2a2a5a" stroke-width="1.5"/>'],
            ['Next', '<path d="M29 16L17 5v7H3v8h14v7z" fill="#6a68c8" stroke="#2a2a5a" stroke-width="1.5"/>'], ['|'], ['Go to Date', ''],
          ];
          for (const [label, icon, on] of tools) {
            if (label === '|') { util.el('i', 'sepv', shelf); continue; }
            const button = util.el('span', 'tool' + (on ? ' on' : ''), shelf);
            let art = icon;
            if (['New Event', 'Day', 'Week', 'Month', 'Today', 'Go to Date'].includes(label)) {
              art = '<rect x="3" y="3" width="27" height="27" fill="#444264" stroke="#25243c"/><path d="M3 30V3h27" fill="none" stroke="#eeecff"/><rect x="6" y="6" width="21" height="21" fill="url(#face)" stroke="#171631"/><path d="M7 26V7h19" stroke="#cbc9f2" fill="none"/>';
              if (['Day', 'Week', 'Month'].includes(label)) {
                const n = label === 'Day' ? 4 : 5;
                for (let y = 0; y < 5; y++) for (let x = 0; x < n; x++) art += `<rect x="${8 + x * 18 / n}" y="${8 + y * 3.5}" width="${18 / n - 1.1}" height="2.5" fill="#deddf0" stroke="#24233b" stroke-width=".5"/>`;
              } else if (label === 'Today') art += '<rect x="9" y="8" width="15" height="17" fill="#c7c7d9" stroke="#27263e"/><path d="M9 12h15M13 13v11M14 15h8M14 18h8M14 21h8" stroke="#48475f"/><path d="M9 10h15" stroke="#927792" stroke-width="2"/>';
              else if (label === 'Go to Date') art += '<rect x="7" y="11" width="19" height="15" fill="#e3e2eb"/><path d="M10 4v6M23 4v6" stroke="#22213e" stroke-width="2"/><text x="16.5" y="24" font-size="14" text-anchor="middle" fill="#14142a" font-family="Arial">15</text>';
            }
            util.el('span', 'ic', button).innerHTML = `<svg viewBox="0 0 32 32" width="100%" height="100%"><defs><linearGradient id="face" x2="1" y2="1"><stop stop-color="#a6a2db"/><stop offset="1" stop-color="#66629a"/></linearGradient></defs>${art}<path d="M4 15l11-10" fill="none" stroke="#d8d6ee" opacity="${label === 'Previous' ? 1 : 0}"/></svg>`;
            util.el('span', '', button, label);
          }
          cal.insertBefore(shelf, head);
          util.el('span', 'today', head, 'Today');
          const previous = util.el('span', 'nav', head);
          previous.innerHTML = S.svg('<path d="M11 3.5v9L4.5 8z" fill="currentColor"/>', 16);
          const next = util.el('span', 'nav', head);
          next.innerHTML = S.svg('<path d="M5 3.5v9L11.5 8z" fill="currentColor"/>', 16);
          util.el('h3', '', head, spec.day);
          util.el('span', 'chip', head, 'Day');
        },
        calSideBuilt: (base) => (C) => {
          C.util.el('span', 'inspector-window-marker', C.side);
        },
        calRows: () => (C, avail) => {
          const rowH = Math.max(12, Math.floor(avail / 26));
          return { rowH, rows: Math.floor(avail / rowH) };
        },
        calFormFields: (base) => (C) => {
          const { util, ctx, fam, N, side, form, name, spec, tl } = C;
          const x = C.x = {};
          name.placeholder = '';
          const startBlock = util.el('div', 'inspector-start', form);
          util.el('label', '', startBlock, 'Start time:');
          const startRow = util.el('div', 'inspector-start-row', startBlock);
          util.el('div', 'inspector-value date-value', startRow, spec.day);
          x.startValue = util.el('button', 'inspector-value time-value', startRow, '—');
          x.startValue.type = 'button';
          x.startValue.setAttribute('aria-label', 'Start time');
          const durationRow = util.el('div', 'inspector-duration', form);
          util.el('label', '', durationRow, 'Duration:');
          x.durationValue = util.el('button', 'inspector-value duration-value', durationRow, '—');
          x.durationValue.type = 'button';
          x.durationValue.setAttribute('aria-label', 'Duration');
          x.selectorMenu = util.el('div', 'inspector-selector-menu', side);
          x.selectorMenu.hidden = true;
          x.selectOptions = new Map();
          const locationRow = util.el('label', 'inspector-location', form);
          util.el('span', '', locationRow, 'Location:');
          util.el('input', '', locationRow).type = 'text';
          const notesBlock = util.el('label', 'inspector-notes', form);
          util.el('span', '', notesBlock, 'Notes:');
          util.el('textarea', '', notesBlock);
          const notesScroll = util.el('span', 'inspector-notes-scroll', notesBlock);
          notesScroll.setAttribute('aria-hidden', 'true');
          for (const [which, control] of [['start', x.startValue], ['dur', x.durationValue]]) {
            control.addEventListener('click', () => C.commit(fam.calendarDd(ctx.model, which)));
          }
          x.paintSelectors = (m) => {
            const open = m.dd;
            x.startValue.disabled = x.durationValue.disabled = false;
            x.startValue.setAttribute('aria-expanded', String(open === 'start'));
            x.durationValue.setAttribute('aria-expanded', String(open === 'dur'));
            x.selectorMenu.hidden = !open;
            x.selectorMenu.replaceChildren();
            x.selectOptions.clear();
            if (!open) return;
            const control = open === 'start' ? x.startValue : x.durationValue;
            const r = control.getBoundingClientRect();
            const sr = side.getBoundingClientRect();
            const menuHeight = Math.ceil(N / 4) * 24 + 11;
            x.selectorMenu.style.top = `${Math.min(r.bottom - sr.top + 3, sr.height - menuHeight - 8)}px`;
            for (let v = open === 'start' ? 0 : 1; v < (open === 'start' ? N : N + 1); v++) {
              const which = open;
              const option = util.el('button', '', x.selectorMenu, which === 'start' ? tl(v) : `${v * 30} min`);
              option.type = 'button';
              x.selectOptions.set(v, option);
              option.addEventListener('click', () => C.commit(fam.calendarSelect(ctx.model, which, v)));
            }
          };
        },
        calActions: (base) => (C) => {
          base(C);
          // The template's Create and Clear handlers are the same task actions as the original widget.
        },
        calPaintEvent: (base) => (C, m) => {
          base(C, m);
          const e = m.event;
          if (e) {
            C.x.startValue.textContent = C.tl(e.start);
            C.x.durationValue.textContent = `${e.dur * 30} min`;
          }
        },
        calPaintForm: (base, S) => (C, m) => {
          base(C, m);
          C.x.paintSelectors(m);
          C.name.readOnly = !m.form;
          C.create.disabled = !m.form;
          C.cancel.disabled = !m.form;
          if (!m.event) {
            C.x.startValue.textContent = '—';
            C.x.durationValue.textContent = '—';
          }
        },
        calLocate: (base, S) => (C, t) => {
          if (t.select) return S.hitPoint(t.select === 'start' ? C.x.startValue : C.x.durationValue);
          if (t.option) return S.hitPoint(C.x.selectOptions.get(Number(t.option[1])));
          return base(C, t);
        },
      },
    },
  });
})();
