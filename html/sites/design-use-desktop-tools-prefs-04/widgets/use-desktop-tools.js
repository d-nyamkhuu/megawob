// Design on templates/use-desktop-tools/base.js: the base site's use-desktop-tools widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'use-desktop-tools',
  site: 'design-use-desktop-tools-prefs-04',
  name: 'design',
  split: 'train',
  scenarios: ['prefs'],
  template: 'use-desktop-tools/base',
  design: {
    parts: {
      'buildPrefs': (base, S) => function buildPrefs(ctx, main, chrome) {
        const { CARET, FILE, clamp, env, guard, hitPoint, isField, same, svg } = S;
        const { util, spec, rng } = ctx;
        const fam = env.taskDef.helpers;
        const home = util.el('div', 'at-home', main);
        util.el('h2', '', home, rng.pick(['Welcome back', 'Home', 'Good morning', 'Your workspace']));
        util.el('p', '', home, 'Pick up where you left off.');
        const recent = util.el('div', 'at-recent', home);
        const cr = rng.fork('recent');
        for (let k = 0; k < 6; k++) {
          const n = env.content.fileName ? env.content.fileName(cr) : `Document ${k + 1}.docx`;
          const d = util.el('div', '', recent);
          d.innerHTML = FILE(n, '');
          util.el('span', '', d, n);
          util.el('span', '', d, `${cr.int(1, 28)} ${cr.pick(['days', 'hours', 'minutes'])} ago`);
        }
        const dash = util.el('section', 'at-dashboard', main);
        const deskTop = util.el('div', 'at-dash-top', dash);
        const editor = util.el('div', 'at-dash-editor', deskTop);
        const tabs = util.el('div', 'at-dash-tabs', editor, 'Notes.txt　 ×　　＋');
        const format = util.el('div', 'at-dash-format', editor, 'Helvetica　⌄　　12　⌄　　B　 I　 U　　☰　☷　☷　 • •');
        util.el('div', 'at-dash-copy', editor, 'Project Notes\n--------------\n\nIdeas for Q2:\n- Update product screenshots\n- Review customer feedback\n- Plan marketing campaign\n\nMeeting notes (Apr 27):\n- Discussed roadmap\n- Agreed on next steps\n- Follow up with design team');
        util.el('div', 'at-dash-status', editor, 'Ln 1, Col 1　　 Plain Text　　 UTF-8');
        const agenda = util.el('div', 'at-dash-agenda', deskTop);
        util.el('div', 'at-dash-month', agenda, '‹　　　　　 April 2015　　　　　 ›');
        util.el('div', 'at-dash-weekdays', agenda, 'Sun　 Mon　 Tue　 Wed　 Thu　 Fri　 Sat');
        util.el('div', 'at-dash-dates', agenda, '29　30　31　 1　 2　 3　 4\n\n 5　 6　 7　 8　 9　10　11\n\n12　13　14　15　16　17　18\n\n19　20　21　22　23　24　25\n\n26　27　28　29　30　 1　 2');
        util.el('h4', '', agenda, 'Tasks');
        util.el('div', 'at-dash-tasks', agenda, '□　Write project update\n□　Review screenshots\n□　Plan marketing campaign\n□　Follow up with design team\n□　Book travel');
        const term = util.el('div', 'at-dash-terminal', dash);
        util.el('div', 'at-dash-term-tab', term, 'Terminal　 ×　　＋');
        util.el('div', 'at-dash-term-text', term, 'Last login: Mon Apr 27 09:12:34 on ttys000\nuser@mac:~$ ▋');

        // Title menu (opener 'menu').
        let appMenuPanel = null;
        let prefsItem = null;
        if (chrome.appMenu) {
          appMenuPanel = util.el('div', 'at-menu', chrome.win);
          for (const [label, kbd] of [['New window', 'Ctrl+Shift+N'], ['Open recent', ''], ['sep'], [rng.pick(['Preferences…', 'Settings…', 'Preferences']), 'Ctrl+,'], ['Keyboard shortcuts', ''], ['sep'], ['Check for updates', ''], ['About', '']]) {
            if (label === 'sep') {
              util.el('div', 'at-msep', appMenuPanel);
              continue;
            }
            const it = util.el('div', 'at-mi', appMenuPanel);
            util.el('span', '', it, label);
            if (kbd) util.el('kbd', '', it, kbd);
            if (/^(Preferences|Settings)/.test(label)) prefsItem = it;
            else it.addEventListener('click', () => { env.log('decoy', { what: 'app-menu', label }); commit({ ...ctx.model, menu: false }); });
          }
          prefsItem.addEventListener('click', () => commit(fam.pfOpen(ctx.model)));
          chrome.appMenu.addEventListener('click', () => commit({ ...ctx.model, menu: !ctx.model.menu }));
        }
        chrome.gear.addEventListener('click', () => commit(fam.pfOpen(ctx.model)));

        // The dialog.
        const modal = util.el('div', 'at-modal', chrome.win);
        const winR = chrome.win.getBoundingClientRect();
        const dlg = util.el('div', 'at-dlg', modal);
        const dw = Math.round(Math.min(700, winR.width - 50));
        const dh = Math.round(Math.min(470, winR.height - 110));
        Object.assign(dlg.style, { width: `${dw}px`, height: `${dh}px` });
        const dhd = util.el('div', 'at-dlg-h', dlg);
        util.el('h3', '', dhd, rng.pick(['Preferences', 'Settings', 'Preferences']));
        const x = util.el('button', 'at-x', dhd, '×');
        x.type = 'button';
        x.setAttribute('aria-label', 'Close');
        const side = spec.tabStyle === 'side' && dw >= 560;
        const db = util.el('div', `at-dlg-b ${side ? 'side' : 'top'}`, dlg);
        const tabsEl = util.el('div', 'at-tabs', db);
        const panes = util.el('div', 'at-panes', db);
        const ft = util.el('div', 'at-dlg-f', dlg);
        const reset = util.el('button', 'ghost', ft, rng.pick(['Restore defaults', 'Reset all', 'Help']));
        reset.type = 'button';
        reset.addEventListener('click', () => env.log('decoy', { what: 'prefs-footer', label: reset.textContent }));
        util.el('span', 'sp', ft);
        const cancel = util.el('button', 'at-btn', ft, 'Cancel');
        cancel.type = 'button';
        let apply = null;
        if (spec.apply) {
          apply = util.el('button', 'at-btn', ft, 'Apply');
          apply.type = 'button';
        }
        const save = util.el('button', 'at-btn pri', ft, spec.saveLabel);
        save.type = 'button';
        const gated = /^Save/.test(spec.saveLabel);

        const tabEls = {};
        const paneEls = {};
        const ctl = {};
        const rowEls = {};
        const ddl = util.el('div', 'at-ddl', db);
        ddl.hidden = true;
        let ddFor = null;
        const CHECK = svg('<path d="M3.5 8.5l3 3 6-7"/>', 16);

        for (const tab of spec.tabs) {
          const t = util.el('button', 'at-tab', tabsEl, tab.label);
          t.type = 'button';
          tabEls[tab.id] = t;
          t.addEventListener('click', () => commit(fam.pfTab(ctx.model, tab.id)));
          const pane = util.el('div', 'at-pane', panes);
          pane.dataset.role = 'prefs-pane';
          paneEls[tab.id] = pane;
          pane.addEventListener('scroll', () => mirror());
          for (const id of tab.ids) {
            const s = spec.settings[id];
            const row = util.el('div', 'at-set', pane);
            rowEls[id] = row;
            const lbl = util.el('div', 'lbl', row);
            util.el('b', '', lbl, s.label);
            util.el('small', '', lbl, s.desc);
            const c = { kind: s.ctl };
            if (s.ctl === 'switch' || s.ctl === 'check') {
              c.el = util.el('button', s.ctl === 'switch' ? 'at-switch' : 'at-check', row);
              c.el.type = 'button';
              c.el.setAttribute('role', s.ctl === 'switch' ? 'switch' : 'checkbox');
              c.el.setAttribute('aria-label', s.label);
              c.el.addEventListener('click', () => commit(fam.pfSet(ctx.model, spec, id, !ctx.model.draft[id])));
            } else if (s.ctl === 'seg') {
              c.el = util.el('div', 'at-seg', row);
              c.opts = {};
              for (const o of s.options) {
                const b = util.el('button', '', c.el, o);
                b.type = 'button';
                c.opts[o] = b;
                b.addEventListener('click', () => commit(fam.pfSet(ctx.model, spec, id, o)));
              }
            } else if (s.ctl === 'dropdown') {
              c.el = util.el('button', 'at-dd', row);
              c.el.type = 'button';
              c.val = util.el('span', '', c.el);
              c.el.insertAdjacentHTML('beforeend', CARET);
              c.el.addEventListener('click', () => commit(fam.pfDd(ctx.model, id)));
            } else {
              c.el = util.el('div', 'at-num', row);
              c.minus = util.el('button', '', c.el, '−');
              c.minus.type = 'button';
              c.input = util.el('input', '', c.el);
              c.input.type = 'text';
              c.input.inputMode = 'numeric';
              c.input.setAttribute('aria-label', s.label);
              c.plus = util.el('button', '', c.el, '+');
              c.plus.type = 'button';
              if (s.unit) util.el('small', '', c.el, s.unit);
              c.field = env.ui.textField(c.input, {
                value: String(ctx.model.draft[id]),
                label: id,
                accept: /[\d.-]/,
                onInput: (v) => {
                  if (v === '' || !Number.isFinite(Number(v))) return;
                  if (Number(v) === ctx.model.draft[id]) return;
                  commit(fam.pfSet(ctx.model, spec, id, Number(v)));
                },
              });
              c.minus.addEventListener('click', () => commit(fam.pfStep(ctx.model, spec, id, -1)));
              c.plus.addEventListener('click', () => commit(fam.pfStep(ctx.model, spec, id, 1)));
            }
            ctl[id] = c;
          }
        }
        ddl.addEventListener('click', (e) => {
          const o = e.target.closest('[data-v]');
          if (!o || !ddFor) return;
          commit(fam.pfSet(ctx.model, spec, ddFor, o.dataset.v));
        });
        x.addEventListener('click', () => commit(fam.pfClose(ctx.model)));
        cancel.addEventListener('click', () => commit(fam.pfClose(ctx.model)));
        if (apply) apply.addEventListener('click', () => { if (fam.pfDirty(ctx.model)) commit(fam.pfApply(ctx.model)); });
        save.addEventListener('click', () => {
          if (gated && !fam.pfDirty(ctx.model)) return;
          commit(fam.pfSave(ctx.model));
        });

        // Compact rows when the tallest tab does not fit.
        modal.hidden = false;
        for (const tab of spec.tabs) {
          paneEls[tab.id].hidden = false;
          if (paneEls[tab.id].scrollHeight > paneEls[tab.id].clientHeight + 1) dlg.classList.add('compact');
          paneEls[tab.id].hidden = true;
        }

        function paint(m) {
          modal.hidden = !m.dlg;
          if (appMenuPanel) {
            appMenuPanel.hidden = !m.menu;
            if (m.menu) chrome.appMenu.dataset.open = '';
            else delete chrome.appMenu.dataset.open;
            const br = chrome.appMenu.getBoundingClientRect();
            const wr = chrome.win.getBoundingClientRect();
            appMenuPanel.style.left = `${Math.round(br.left - wr.left)}px`;
            appMenuPanel.style.top = `${Math.round(br.bottom - wr.top + 4)}px`;
          }
          for (const tab of spec.tabs) {
            const on = tab.id === m.tab;
            if (on) tabEls[tab.id].dataset.on = '';
            else delete tabEls[tab.id].dataset.on;
            paneEls[tab.id].hidden = !on;
          }
          for (const [id, c] of Object.entries(ctl)) {
            const v = m.draft[id];
            if (c.kind === 'switch' || c.kind === 'check') {
              if (v) c.el.dataset.on = '';
              else delete c.el.dataset.on;
              c.el.setAttribute('aria-checked', v ? 'true' : 'false');
              if (c.kind === 'check') c.el.innerHTML = v ? CHECK : '';
            } else if (c.kind === 'seg') {
              for (const [o, b] of Object.entries(c.opts)) {
                if (o === v) b.dataset.on = '';
                else delete b.dataset.on;
              }
            } else if (c.kind === 'dropdown') c.val.textContent = v;
            else if (document.activeElement !== c.input && c.field.get() !== String(v)) c.field.set(String(v));
          }
          const dirty = fam.pfDirty(m);
          if (gated && !dirty) save.dataset.off = '';
          else delete save.dataset.off;
          if (apply) {
            if (!dirty) apply.dataset.off = '';
            else delete apply.dataset.off;
          }
          // Dropdown list.
          if (m.dlg && m.dd && ctl[m.dd]) {
            const id = m.dd;
            if (ddFor !== id) {
              ddFor = id;
              ddl.replaceChildren();
              for (const o of spec.settings[id].options) {
                const it = util.el('div', '', ddl, o);
                it.dataset.v = o;
              }
            }
            for (const it of ddl.children) {
              if (it.dataset.v === m.draft[id]) it.dataset.on = '';
              else delete it.dataset.on;
            }
            ddl.hidden = false;
            const br = ctl[id].el.getBoundingClientRect();
            const bb = db.getBoundingClientRect();
            const h = ddl.offsetHeight;
            const below = br.bottom - bb.top + 4;
            const top = below + h <= bb.height - 4 ? below : Math.max(4, br.top - bb.top - h - 4);
            ddl.style.top = `${Math.round(top)}px`;
            ddl.style.left = `${Math.round(clamp(br.right - bb.left - Math.max(ddl.offsetWidth, br.width), 4, bb.width - ddl.offsetWidth - 4))}px`;
            ddl.style.minWidth = `${Math.round(br.width)}px`;
          } else {
            ddl.hidden = true;
            ddFor = null;
          }
          mirror();
        }

        function mirror() {
          const m = ctx.model;
          let v = null;
          if (m.dlg) {
            const pane = paneEls[m.tab];
            const pr = pane.getBoundingClientRect();
            const ids = spec.tabs.find((t) => t.id === m.tab).ids;
            let first = -1;
            let last = -1;
            ids.forEach((id, i) => {
              const r = rowEls[id].getBoundingClientRect();
              if (r.top >= pr.top - 1 && r.bottom <= pr.bottom + 1) {
                if (first < 0) first = i;
                last = i;
              }
            });
            v = { tab: m.tab, first, last, ids: ids.length };
          }
          if (!same(v, m.view)) ctx.update({ ...m, view: v });
        }

        const commit = (m) => { const prev = ctx.model; ctx.update(m); guard(ctx, prev, m); paint(ctx.model); };
        paint(ctx.model);

        return {
          sync: paint,
          onKey(e) {
            if (e.key === 'Escape' && ctx.model.dlg && !isField(e.target)) {
              e.preventDefault();
              commit(ctx.model.dd ? { ...ctx.model, dd: null } : fam.pfClose(ctx.model));
            }
          },
          onDown(e) {
            const m = ctx.model;
            if (m.dd && !ddl.contains(e.target) && !(ctl[m.dd] && ctl[m.dd].el.contains(e.target))) {
              const inDlg = dlg.contains(e.target);
              if (!inDlg || !e.target.closest('button, input')) commit({ ...m, dd: null });
            }
            if (appMenuPanel && m.menu && !appMenuPanel.contains(e.target) && !chrome.appMenu.contains(e.target)) commit({ ...ctx.model, menu: false });
          },
          locate(t) {
            if (t.open === 'gear') return hitPoint(chrome.gear);
            if (t.open === 'menu') return hitPoint(chrome.appMenu);
            if (t.open === 'item') return appMenuPanel && !appMenuPanel.hidden ? hitPoint(prefsItem) : null;
            if (modal.hidden) return null;
            if (t.tab) return hitPoint(tabEls[t.tab]);
            if (t.pane) {
              const r = paneEls[ctx.model.tab].getBoundingClientRect();
              return [r.left + r.width / 2, r.top + r.height / 2];
            }
            if (t.footer) return hitPoint({ save, apply, cancel }[t.footer]);
            if (t.setting) {
              const c = ctl[t.setting];
              return hitPoint(c.input || c.el);
            }
            if (t.stepper) {
              const c = ctl[t.stepper[0]];
              return hitPoint(t.stepper[1] > 0 ? c.plus : c.minus);
            }
            if (t.option) {
              const [id, v] = t.option;
              const c = ctl[id];
              if (c.kind === 'seg') return hitPoint(c.opts[v]);
              if (ddl.hidden || ddFor !== id) return null;
              return hitPoint([...ddl.children].find((it) => it.dataset.v === v));
            }
            return null;
          },
        };
      },
    },
  },
});
