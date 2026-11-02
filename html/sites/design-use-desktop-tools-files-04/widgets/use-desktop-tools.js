// Design on templates/use-desktop-tools/base.js: the base site's use-desktop-tools widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'use-desktop-tools',
  site: 'design-use-desktop-tools-files-04',
  name: 'design',
  split: 'train',
  scenarios: ['files'],
  template: 'use-desktop-tools/base',
  design: {
    parts: {
      'buildTree': (base, S) => function buildTree(ctx, main) {
        const { CHEV, FILE, FOLDER, ICON, PROJECTS, SPIN, clamp, env, guard, hitPoint, isField, same, svg } = S;
        const { util, spec, rng } = ctx;
        const fam = env.taskDef.helpers;
        const mode = spec.scenario;
        const mainR = main.getBoundingClientRect();
        const ex = util.el('div', 'at-explorer', main);
        ex.style.width = mode === 'files' ? '100%' : `${Math.round(clamp(mainR.width * 0.47, 230, 360))}px`;
        const head = util.el('div', 'at-pane-h', ex);
        util.el('span', '', head, `Explorer · ${rng.pick(PROJECTS)}`);
        const list = util.el('div', 'at-tree', ex);
        list.tabIndex = 0;
        list.dataset.role = 'tree';
        const pv = util.el('div', 'at-preview', main);
        const crumbs = util.el('div', 'at-crumbs', pv);
        const pbody = util.el('div', '', pv);
        pbody.style.cssText = 'flex: 1; min-height: 0; display: flex; flex-direction: column;';
        const toast = util.el('div', 'at-toast', main);
        toast.hidden = true;
        const toastText = util.el('span', '', toast);
        const toastUndo = util.el('button', '', toast, 'Undo');
        toastUndo.type = 'button';
        const ghost = util.el('div', 'at-ghost', main);
        ghost.hidden = true;
        const menuEl = util.el('div', 'at-menu', main);
        menuEl.hidden = true;

        // Row height: every node fits when it can (the list still scrolls when it cannot).
        const listH = list.getBoundingClientRect().height - 24;
        const want = mode === 'move' ? spec.nodes.length : Math.min(spec.nodes.length, 17);
        const rowH = Math.round(clamp(Math.floor(listH / Math.max(1, want)), 21, 27));
        list.style.setProperty('--rowh', `${rowH}px`);
        list.style.setProperty('--rowf', rowH >= 25 ? '14px' : '13px');

        const rowEls = new Map();
        let editInput = null;
        let editField = null;
        let editFor = null;
        let painting = false;
        let menuAt = null;
        let lastMenu = null;
        let ghostAt = null;
        const nameOfId = (m, id) => {
          const n = fam.live(m, spec).byId.get(id);
          return n ? n.name : '';
        };

        function makeInput(m) {
          editFor = m.edit.id;
          editInput = document.createElement('input');
          editInput.type = 'text';
          editInput.spellcheck = false;
          editInput.setAttribute('aria-label', 'name');
          editField = env.ui.textField(editInput, {
            value: m.edit.text,
            label: 'rename',
            onInput: (v) => { if (ctx.model.edit && ctx.model.edit.text !== v) ctx.update(fam.fEditText(ctx.model, v)); },
          });
          editInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              commit(fam.fCommit(ctx.model));
            } else if (e.key === 'Escape') {
              e.preventDefault();
              commit(fam.fCancel(ctx.model));
            }
          });
          editInput.addEventListener('blur', () => {
            if (painting || !ctx.model.edit || ctx.model.edit.id !== editFor) return;
            commit(fam.fCommit(ctx.model));
          });
        }

        // Rows are cached by id and only rebuilt when their content changes, so a click or double-click is never
        // split across two different elements.
        const cache = new Map();
        const flag = (el, k, on) => {
          if (on) el.dataset[k] = '';
          else delete el.dataset[k];
        };
        function paintList(m) {
          const R = fam.rows(m, spec);
          const keep = list.scrollTop;
          rowEls.clear();
          const L = fam.live(m, spec);
          if (!m.edit || m.edit.id !== editFor) {
            editInput = null;
            editField = null;
            editFor = null;
          }
          const order = [];
          for (const r of R) {
            const open = r.dir && fam.isOpen(m, r.id);
            const editing = !!(m.edit && m.edit.id === r.id);
            const sig = `${r.dir}|${r.depth}|${r.name}|${open}|${editing}`;
            let row = cache.get(r.id);
            if (!row) {
              row = util.el('div', 'at-row');
              row.dataset.id = r.id;
              cache.set(r.id, row);
            }
            if (row.dataset.sig !== sig) {
              row.dataset.sig = sig;
              row.dataset.role = r.dir ? 'folder' : 'file';
              row.style.paddingLeft = `${6 + r.depth * 18}px`;
              flag(row, 'open', open);
              row.innerHTML = r.dir ? CHEV + FOLDER(open) : '<span class="sp"></span>' + FILE(r.name);
              if (editing) {
                if (!editInput) makeInput(m);
                row.append(editInput);
              } else util.el('span', 'nm', row, r.name);
            }
            if (editing && editField.get() !== m.edit.text) editField.set(m.edit.text);
            flag(row, 'sel', m.sel === r.id || (mode === 'tree' && m.clicks.includes(r.id)));
            flag(row, 'lifted', !!(m.drag && m.drag.id === r.id));
            flag(row, 'drop', !!(m.drag && m.drag.over === r.id && r.dir && m.drag.id !== r.id));
            rowEls.set(r.id, row);
            order.push(row);
            if (open && !fam.isLoaded(m, spec, r.id)) {
              let ld = cache.get(`ld:${r.id}`);
              if (!ld) {
                ld = util.el('div', 'at-row at-loading');
                cache.set(`ld:${r.id}`, ld);
              }
              ld.style.paddingLeft = `${6 + (r.depth + 1) * 18 + 20}px`;
              const t0 = (m.loading && m.loading[r.id]) || 0;
              ld.innerHTML = SPIN(Math.round(((ctx.clock() - t0) / 125) * 45) % 360);
              util.el('span', '', ld, 'Loading…');
              order.push(ld);
            }
          }
          if (!R.length) {
            let empty = cache.get('empty');
            if (!empty) {
              empty = util.el('div', 'at-empty', null, 'This folder is empty.');
              cache.set('empty', empty);
            }
            order.push(empty);
          }
          const cur = list.children;
          if (cur.length !== order.length || order.some((el, i) => cur[i] !== el)) list.replaceChildren(...order);
          list.scrollTop = keep;
          if (editInput && document.activeElement !== editInput) {
            editInput.focus({ preventScroll: true });
            if (editInput.dataset.fresh !== '0') {
              editInput.dataset.fresh = '0';
              const v = editInput.value;
              const dot = L.byId.get(m.edit.id) && !L.byId.get(m.edit.id).dir ? v.search(/\.(tar\.gz|[A-Za-z0-9]+)$/) : -1;
              editInput.setSelectionRange(0, dot > 0 ? dot : v.length);
            }
          }
        }

        function paintMenu(m) {
          if (mode !== 'files' || m.menu === null || m.menu === undefined) {
            menuEl.hidden = true;
            lastMenu = null;
            return;
          }
          const row = rowEls.get(m.menu);
          if (lastMenu !== m.menu || menuEl.hidden) {
            lastMenu = m.menu;
            menuEl.replaceChildren();
            const n = fam.live(m, spec).byId.get(m.menu);
            const item = (act, label, kbd, off) => {
              const it = util.el('div', 'at-mi', menuEl);
              it.dataset.act = act;
              util.el('span', '', it, label);
              if (kbd) util.el('kbd', '', it, kbd);
              if (off) it.dataset.off = '';
              return it;
            };
            const sep = () => util.el('div', 'at-msep', menuEl);
            const d = spec.decoys;
            item('decoy', n && n.dir ? 'Open' : d[0] || 'Open', '');
            if (n && n.dir) item('newfolder', spec.labels.newfolder, '');
            sep();
            item('rename', spec.labels.rename, 'F2');
            item('delete', spec.labels.delete, 'Del');
            sep();
            for (const x of d.slice(1)) item('decoy', x, '');
            item('decoy', 'Paste', 'Ctrl+V', true);
            if (!(n && n.dir)) {
              sep();
              item('newfolder', spec.labels.newfolder, '');
            }
          }
          menuEl.hidden = false;
          // Position at the press point (or next to the row), kept inside the main area.
          const mr = main.getBoundingClientRect();
          let x;
          let y;
          if (menuAt && menuAt.id === m.menu) [x, y] = menuAt.at;
          else if (row) {
            const rr = row.getBoundingClientRect();
            x = Math.min(rr.right - 40, rr.left + 140) - mr.left;
            y = rr.bottom - mr.top;
          } else {
            x = 40;
            y = 40;
          }
          const w = menuEl.offsetWidth;
          const h = menuEl.offsetHeight;
          menuEl.style.left = `${Math.round(clamp(x, 4, mr.width - w - 4))}px`;
          menuEl.style.top = `${Math.round(y + h > mr.height - 4 ? Math.max(4, y - h) : y)}px`;
        }

        function paintToast(m) {
          if (mode !== 'files' || !m.undo) {
            toast.hidden = true;
            return;
          }
          toast.hidden = false;
          const u = m.undo;
          const nm = u.created ? u.created.name || 'New folder' : (spec.nodes.find((n) => n.id === u.id) || {}).name;
          toastText.textContent = spec.recoverable ? `Deleted “${nm}”` : `“${nm}” was moved to the Trash`;
          toastUndo.hidden = !spec.recoverable;
        }

        function info(p, m, id) {
          const L = fam.live(m, spec);
          const n = L.byId.get(id);
          if (!n) return;
          const path = [];
          for (let x = n; x && x.parent !== null; x = L.byId.get(x.parent)) path.unshift(L.byId.get(x.parent).name);
          crumbs.replaceChildren();
          path.forEach((s) => { util.el('span', '', crumbs, s); util.el('span', '', crumbs, '›'); });
          util.el('b', '', crumbs, n.name);
          const card = util.el('div', 'at-card', p);
          card.innerHTML = n.dir ? FOLDER(false).replace('class="ico"', '') : FILE(n.name, '');
          const txt = util.el('div', '', card);
          util.el('h3', '', txt, n.name || (m.edit && m.edit.id === id ? m.edit.text : 'New folder'));
          const h = [...n.name].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
          if (n.dir) util.el('p', '', txt, `Folder · ${(L.kids.get(id) || []).length} items`);
          else util.el('p', '', txt, `${((h % 900) / 10 + 1.2).toFixed(1)} ${h % 3 ? 'KB' : 'MB'} · modified ${1 + (h % 27)} days ago`);
          util.el('p', '', txt, `/${path.concat([n.name]).join('/')}`);
        }

        function paintPreview(m) {
          crumbs.replaceChildren();
          pbody.replaceChildren();
          if (mode === 'tree') {
            const last = m.clicks[m.clicks.length - 1];
            if (last === undefined) {
              util.el('span', '', crumbs, 'No file open');
              const e = util.el('div', 'at-empty', pbody);
              e.innerHTML = svg(ICON.files);
              util.el('div', '', e, 'Click a file in the Explorer to open it.');
              return;
            }
            if (spec.recoverable) {
              const b = util.el('button', 'at-back', pbody, '← Back');
              b.type = 'button';
              b.dataset.role = 'back';
              b.addEventListener('click', () => commit(fam.treeBack(ctx.model, spec)));
            }
            info(pbody, m, last);
            return;
          }
          const sel = m.sel !== null && m.sel !== undefined && fam.live(m, spec).byId.get(m.sel) ? m.sel : null;
          if (sel === null) util.el('span', '', crumbs, mode === 'move' ? 'Move files' : 'Nothing selected');
          else info(pbody, m, sel);
          const tips = util.el('div', 'at-tips', pbody);
          tips.textContent = mode === 'move'
            ? 'Drag a file onto a folder to move it there. Hold it over a closed folder for a moment to open that folder.'
            : 'Right-click an item for more actions. Double-click a name or press F2 to rename it.';
          if (sel === null) tips.style.marginTop = '22px';
        }

        function paintGhost(m) {
          if (mode !== 'move' || !m.drag || !ghostAt) {
            ghost.hidden = true;
            return;
          }
          ghost.hidden = false;
          ghost.innerHTML = FILE(nameOfId(m, m.drag.id));
          util.el('span', '', ghost, nameOfId(m, m.drag.id));
          const mr = main.getBoundingClientRect();
          // Above and to the right of the pointer, so the rows the drag is heading for stay visible.
          ghost.style.left = `${Math.round(ghostAt[0] - mr.left + 18)}px`;
          ghost.style.top = `${Math.round(ghostAt[1] - mr.top - 34)}px`;
        }

        function mirror() {
          const m = ctx.model;
          const lr = list.getBoundingClientRect();
          const R = fam.rows(m, spec);
          let first = -1;
          let last = -1;
          R.forEach((r, i) => {
            const el = rowEls.get(r.id);
            if (!el) return;
            const b = el.getBoundingClientRect();
            if (b.top >= lr.top - 1 && b.bottom <= lr.bottom + 1) {
              if (first < 0) first = i;
              last = i;
            }
          });
          const v = { first, last, px: rowH };
          if (!same(v, m.view)) ctx.update({ ...m, view: v });
        }

        function paint(m) {
          painting = true;
          paintList(m);
          paintMenu(m);
          paintToast(m);
          paintPreview(m);
          paintGhost(m);
          painting = false;
          mirror();
        }
        function commit(m) {
          const prev = ctx.model;
          ctx.update(m);
          guard(ctx, prev, m);
          paint(ctx.model);
        }

        list.addEventListener('scroll', () => mirror());
        list.addEventListener('click', (e) => {
          if (isField(e.target)) return;
          const row = e.target.closest('.at-row[data-id]');
          if (!row) return;
          const id = row.dataset.id;
          const m = ctx.model;
          const now = ctx.clock();
          if (mode === 'tree') {
            if (row.dataset.role === 'folder') commit({ ...fam.toggleFolder(m, spec, id, now), sel: id });
            else commit(fam.treeClickFile(m, spec, id));
          } else if (mode === 'files') commit(fam.fClick(m, spec, id, now));
          else if (row.dataset.role === 'folder') commit({ ...fam.toggleFolder(m, spec, id, now), sel: id });
          else commit({ ...m, sel: id });
        });
        list.addEventListener('dblclick', (e) => {
          if (mode !== 'files' || isField(e.target)) return;
          const row = e.target.closest('.at-row[data-id]');
          if (!row) return;
          commit(fam.fDbl(ctx.model, spec, row.dataset.id));
        });
        list.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          if (mode !== 'files' || isField(e.target)) return;
          const row = e.target.closest('.at-row[data-id]');
          if (!row) return;
          const mr = main.getBoundingClientRect();
          menuAt = { id: row.dataset.id, at: [e.clientX - mr.left + 2, e.clientY - mr.top + 2] };
          commit(fam.fMenu(ctx.model, spec, row.dataset.id));
        });
        menuEl.addEventListener('click', (e) => {
          const it = e.target.closest('.at-mi');
          if (!it || it.dataset.off !== undefined) return;
          const act = it.dataset.act;
          if (act === 'decoy') {
            env.log('decoy', { what: 'context-menu', label: it.textContent });
            commit({ ...ctx.model, menu: null });
          } else commit(fam.fPick(ctx.model, spec, act, ctx.clock()));
        });
        toastUndo.addEventListener('click', () => commit(fam.fUndo(ctx.model)));
        if (mode === 'move') {
          list.addEventListener('pointerdown', (e) => {
            if (e.button !== 0) return;
            const row = e.target.closest('.at-row[data-id]');
            if (!row || row.dataset.role !== 'file') return;
            e.preventDefault();
            ghostAt = [e.clientX, e.clientY];
            commit(fam.mvDown(ctx.model, spec, row.dataset.id, ctx.clock()));
          });
        }
        const overAt = (x, y) => {
          const hit = document.elementFromPoint(x, y);
          if (!hit) return null;
          const row = hit.closest('.at-row[data-id]');
          if (row && list.contains(row)) return row.dataset.id;
          return list.contains(hit) ? 'root' : null;
        };

        paint(ctx.model);

        return {
          sync: paint,
          onKey(e) {
            if (isField(e.target)) return;
            const m = ctx.model;
            if (mode === 'files') {
              if (!/^(F2|Delete|Backspace|Escape|Enter|ArrowUp|ArrowDown|ArrowLeft|ArrowRight|Home|End)$/.test(e.key)) return;
              e.preventDefault();
              commit(fam.fKey(m, spec, e.key, ctx.clock()));
              const r = rowEls.get(ctx.model.sel);
              if (r && /^Arrow|Home|End/.test(e.key)) r.scrollIntoView({ block: 'nearest' });
            } else if (mode === 'tree' && spec.keys) {
              if (!/^(ArrowUp|ArrowDown|ArrowLeft|ArrowRight|Home|End|Enter| )$/.test(e.key)) return;
              e.preventDefault();
              commit(fam.treeKey(m, spec, e.key, ctx.clock()));
              const r = rowEls.get(ctx.model.sel);
              if (r) r.scrollIntoView({ block: 'nearest' });
            }
          },
          onDown(e) {
            const m = ctx.model;
            if (mode === 'files' && m.menu !== null && m.menu !== undefined && e.button === 0 && !menuEl.contains(e.target)) {
              if (!list.contains(e.target)) commit({ ...m, menu: null });
            }
          },
          onMove(e) {
            const m = ctx.model;
            if (mode !== 'move' || !m.drag) return;
            ghostAt = [e.clientX, e.clientY];
            const over = overAt(e.clientX, e.clientY);
            if (over !== m.drag.over) commit(fam.mvOver(m, over, ctx.clock()));
            else paintGhost(m);
          },
          onUp(e) {
            const m = ctx.model;
            if (mode !== 'move' || !m.drag) return;
            const over = overAt(e.clientX, e.clientY);
            ghostAt = null;
            commit(fam.mvUp(m, spec, over));
          },
          locate(t) {
            const lr = list.getBoundingClientRect();
            if (t.node !== undefined) {
              const row = rowEls.get(t.node);
              if (!row) return null;
              const rr = row.getBoundingClientRect();
              if (rr.top < lr.top - 1 || rr.bottom > lr.bottom + 1) return null;
              const nm = row.querySelector('.nm') || row;
              return hitPoint(nm, [0.5, 0.25, 0.75, 0.1], [0.5]);
            }
            if (t.pane === 'tree') {
              const rows = [...rowEls.values()];
              const lastB = rows.length ? rows[rows.length - 1].getBoundingClientRect().bottom : lr.top;
              if (lr.bottom - lastB > 14) return [lr.left + lr.width / 2, (lastB + lr.bottom) / 2];
              return [lr.left + lr.width / 2, lr.top + lr.height / 2];
            }
            if (t.back) return hitPoint(pbody.querySelector('.at-back'));
            if (t.menu) return menuEl.hidden ? null : hitPoint(menuEl.querySelector(`.at-mi[data-act="${t.menu}"]`));
            if (t.edit !== undefined) return editInput && editFor === t.edit ? hitPoint(editInput) : null;
            if (t.toast) return toast.hidden ? null : hitPoint(toastUndo);
            return null;
          },
        };
      },
    },
  },
});
