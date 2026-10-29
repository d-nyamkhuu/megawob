// Design on use-data-grid/grid; defaults reproduce the scaffolded base widget.
env.widget({
  task: 'use-data-grid',
  site: 'design-use-data-grid-virtual-04',
  name: 'design',
  split: 'train',
  scenarios: ['virtual'],
  template: 'use-data-grid/grid',
  design: {
    font: '14px/1.4 Arial,sans-serif',
    parts: {
      fit(base, S) {
        return () => {
          base();
          S.cardW = S.W;
          S.cardH = S.H;
          S.left = 0;
          S.top = 0;
          S.rowH = Math.max(26, Math.min(41, Math.floor((S.H - 162) / 15)));
        };
      },
      column(base, S) {
        return (c) => {
          base(c);
          const p = S.parts[c.id];
          const filter = p.funnel || p.dots;
          filter.classList.add('ticket-filter');
          filter.innerHTML = '<span>All</span><i></i>';
          filter.setAttribute('aria-label', p.funnel ? `Filter ${c.label}` : `${c.label} column options`);
        };
      },
      toolbar(base, S) {
        return () => {
          base();
          const actionbar = document.querySelector('.ref-actionbar');
          const search = document.querySelector('.ref-ticket-search');
          if (!actionbar || !search) return;
          if (S.input) {
            search.lastElementChild.remove();
            search.appendChild(S.input);
          }
          S.selBar.classList.add('ref-live-selection');
          actionbar.insertBefore(S.selBar, search);
          actionbar.insertBefore(S.undoBtn, search);
          actionbar.insertBefore(S.chips, search);
          actionbar.insertBefore(S.clearAll, search);
        };
      },
      drawTools(base, S) {
        return (m) => {
          base(m);
          document.querySelector('.ref-actionbar')?.classList.toggle('has-selection', m.selected.length > 0);
        };
      },
      drawHeader(base, S) {
        return (m) => {
          base(m);
          // Give the subject the broad reading column seen in the split view.
          const weights = { subject: 1.65, contact: 1.05, owner: .95, priority: .75, status: .85 };
          const sum = S.spec.cols.reduce((n, c) => n + m.widths[c.id] * (weights[c.id] || .85), 0);
          const available = S.cardW - S.hcb.offsetWidth - 4;
          for (const c of S.spec.cols) {
            S.hcells[c.id].style.width = (available * m.widths[c.id] * (weights[c.id] || .85) / sum) + 'px';
          }
        };
      },
      cell(base, S) {
        return (row, r, id, m) => {
          const cell = base(row, r, id, m);
          cell.style.width = S.hcells[id].style.width;
          return cell;
        };
      },
      drawRows(base, S) {
        return (m) => {
          if (!S.virtual) return base(m);
          // The visual window follows the available tablet space. The task's
          // virtualTop, edit state, selection and scroll handlers stay intact.
          S.drawing = true;
          const scrollTop = S.body.scrollTop;
          const headerH = S.hrow.offsetHeight;
          S.paneHeight = Math.max(100, S.H - headerH - 75);
          // Include the partial bottom row so the last record remains reachable
          // when the scroll limit falls between row boundaries.
          const count = Math.max(6, Math.ceil(S.paneHeight / S.rowH));
          const top = m.virtualTop || 0;
          const all = S.fam.helpers.visibleRows(m, S.spec);
          const rows = all.slice(top, top + count);
          S.body.replaceChildren();
          S.P.el('div', '', S.body).style.height = top * S.rowH + 'px';
          const selected = new Set(m.selected);
          for (const row of rows) S.P.row(row, m, selected);
          // The task advances a six-record logical window. Let that window
          // reach the final records even when this design shows a taller pane.
          const tail = Math.max(0, S.paneHeight - (m.windowSize || 6) * S.rowH);
          S.P.el('div', '', S.body).style.height = (Math.max(0, all.length - top - rows.length) * S.rowH + tail) + 'px';
          S.body.style.height = S.paneHeight + 'px';
          S.body.scrollTop = Math.floor(scrollTop / S.rowH) === top ? scrollTop : top * S.rowH;
          S.grid.style.height = headerH + S.paneHeight + 'px';
          S.drawing = false;
          S.P.mirrorScreenRows();
          S.P.rendered(S.ctx);
        };
      },
      drawFoot(base, S) {
        return (m) => {
          base(m);
          if (S.virtual) {
            const total = S.fam.helpers.visibleRows(m, S.spec).length;
            const first = m.virtualTop || 0;
            const count = Math.floor(S.paneHeight / S.rowH);
            S.info.textContent = `Showing ${first + 1}–${Math.min(total, first + count)} of ${total} tickets`;
            S.rpp.textContent = `Visible rows: ${count}`;
            const current = Math.floor(first / count);
            const pages = Math.ceil(total / count);
            const scrollButton = (label, destination, disabled, selected) => {
              const button = S.P.el('button', 'to-pg' + (selected ? ' cur' : ''), S.pagerWrap, label);
              button.type = 'button';
              button.disabled = disabled;
              button.setAttribute('aria-label', `Scroll to records ${destination * count + 1} onward`);
              button.addEventListener('click', () => {
                S.body.scrollTop = destination * count * S.rowH;
                S.body.dispatchEvent(new Event('scroll'));
              });
            };
            scrollButton('‹', Math.max(0, current - 1), current === 0, false);
            for (let p = 0; p < pages; p++) scrollButton(String(p + 1), p, false, p === current);
            scrollButton('›', Math.min(pages - 1, current + 1), current >= pages - 1, false);
          }
        };
      },
      decorate() { return () => {}; },
      cellContent(base, S) {
        return (cell, row, id, m, text) => {
          base(cell, row, id, m, text);
          if (id === S.spec.statusCol && cell.firstElementChild) cell.firstElementChild.dataset.status = String(text).toLowerCase();
          if (id === 'priority') {
            cell.firstElementChild.classList.add('ticket-priority', String(text).toLowerCase());
          }
        };
      },
      rendered(base, S) {
        return function (ctx) {
          base(ctx);
          const inspector = document.querySelector('.ref-ticket-inspector');
          const active = inspector && inspector.dataset.row;
          const first = [...ctx.stage.querySelectorAll('.to-row')].find(row => row.dataset.id === active) || ctx.stage.querySelector('.to-row');
          if (!inspector || !first) return;
          const cells = [...first.querySelectorAll('.to-c')].map((cell) => cell.querySelector('.to-edit')?.value || cell.innerText.trim());
          if (cells.length < 6) return;
          const values = [cells[0], cells[2], cells[1], cells[3], cells[5], cells[4]];
          const targets = [...inspector.querySelectorAll('.ref-ticket-properties .ref-property-value')];
          values.forEach((value, index) => {
            if (targets[index]) {
              targets[index].textContent = value;
              targets[index].classList.toggle('ref-status-dot', index === 4);
              targets[index].classList.toggle('ref-priority-dot', index === 5);
            }
          });
          const description = inspector.querySelector('.ref-ticket-description');
          if (description) description.textContent = description.textContent.replace(/Thank you,\n[\s\S]*$/, `Thank you,\n${cells[1]}`);
        };
      },
    },
  },
});
