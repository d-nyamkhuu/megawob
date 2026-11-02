/* protect-privacy/classic: actions parts; existing design parts remain overridable. */
(function () {
  'use strict';
  env.template('protect-privacy/_classic-actions', () => ({
    install(BASE, state) {
      BASE.doOp = (name, arg) => {
        const r = state.fam.op(state.spec, state.ctx.model, name, arg);
        state.ctx.update(r.model);
        state.P.draw();
        if (r.flag) state.ctx.flag(`unsafe:privacy-${state.scenario}`, r.flag);
      };
      BASE.dispatch = (k, text) => {
        const r = state.fam.route(state.spec, k, text);
        if (!r) { state.ctx.log('noop', { k }); return; }
        state.P.doOp(r[0], r[1]);
      };
      // Clicks outside any control close open menus and lists.
      BASE.closeMenus = () => {
        const m = state.ctx.model;
        if (state.scenario === 'share' && m.menu) state.P.doOp('menu', m.menu);
        else if (state.scenario === 'visibility' && m.menu) state.P.doOp('menu', state.spec.mode === 'post' ? null : m.menu);
        else if (state.scenario === 'autofill' && m.dd) state.P.doOp('close');
        else if (state.scenario === 'retention' && m.toMenu) state.P.doOp('tomenu');
      };
      // Redraw the app from the model, keeping the focused text field (and its caret).
      BASE.draw = () => {
        const a = document.activeElement;
        const keep = a && state.win.contains(a) && a.dataset && a.dataset.k && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA')
          ? { k: a.dataset.k, s: a.selectionStart, e: a.selectionEnd } : null;
        state.app.replaceChildren();
        state.permChips.replaceChildren();
        state.P.view(state.ctx.model);
        state.P.drawn(state.ctx);
        if (keep) {
          const f = state.app.querySelector(`[data-k="${CSS_ESC(keep.k)}"]`);
          if (f) { f.focus(); try { f.setSelectionRange(keep.s, keep.e); } catch (err) { /* not a text field */ } }
        }
        // Menus that would leave the window open upwards instead.
        const wr = state.win.getBoundingClientRect();
        for (const mn of state.app.querySelectorAll('.sp-menu, .sp-dd, .sp-sugs')) {
          const r = mn.getBoundingClientRect();
          if (r.bottom > wr.bottom - 4) { mn.style.top = 'auto'; mn.style.bottom = '100%'; mn.style.marginTop = '0'; mn.style.marginBottom = '2px'; }
        }
        for (const th of state.app.querySelectorAll('.sp-thread')) th.scrollTop = th.scrollHeight;
      };
      const CSS_ESC = (s) => (window.CSS && CSS.escape ? CSS.escape(s) : String(s).replace(/"/g, '\\"'));
      BASE.bind = (ctx) => {
        state.win.addEventListener('click', (e) => {
          if (env.done) return;
          const t = e.target.closest('[data-k]');
          if (!t || !state.win.contains(t)) { state.P.closeMenus(); return; }
          if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA') {
            if (state.scenario === 'autofill') state.P.dispatch(t.dataset.k);
            else if (state.scenario === 'share' && ctx.model.menu) state.P.closeMenus();
            return;
          }
          if (t.classList.contains('dis')) return;
          state.P.dispatch(t.dataset.k);
        });
        state.win.addEventListener('input', (e) => {
          const t = e.target;
          if (!t.dataset || !t.dataset.k || env.done) return;
          state.P.dispatch(t.dataset.k, t.value);
        });
        state.win.addEventListener('keydown', (e) => {
          const t = e.target;
          if (!t.dataset || !t.dataset.k) return;
          if (e.key === 'Enter' && t.dataset.k === 'share-q') { e.preventDefault(); state.P.doOp('enter'); }
          else if (e.key === 'Enter' && !e.shiftKey && t.dataset.k === 'draft' && state.spec.mode === 'chat') { e.preventDefault(); state.P.dispatch('send'); }
          else if (e.key === 'Escape') state.P.closeMenus();
        });
      };
      BASE.locate = (target) => {
        const el = state.win && state.win.querySelector(`[data-k="${window.CSS && CSS.escape ? CSS.escape(target) : target}"]`);
        const p = state.P.pointOn(el);
        if (!p) throw new Error(`protect-privacy/classic cannot locate ${JSON.stringify(target)}`);
        return p;
      };

    },
  }));
})();
