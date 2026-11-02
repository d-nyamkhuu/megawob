/* use-desktop-tools/_base-terminal: terminal prompt and transcript.
 * build(ctx, main, frame?, scope) owns one render's state; scope supplies the base template's
 * overridable units. Named setup, painting and input helpers keep their original statement order.
 */
(function () {
  'use strict';
  function paint(state, m) {
    const key = `${m.history.length}/${m.cleared}`;
    if (key !== state.shown) {
      state.shown = key;
      state.lines.replaceChildren();
      if (m.cleared === 0) {
        state.line('dim', 'Welcome! Type help for a list of available commands.');
        state.line('dim', `Last login: ${state.spec.login}`);
      }
      for (const h of m.history.slice(m.cleared)) {
        const l = state.line('', '');
        l.innerHTML = state.psHtml(h.cwd) + ' ';
        l.append(h.cmd);
        for (const o of h.out) {
          const err = /^[a-z]+: /.test(o) && /(cannot|No such|not |missing|denied|too many|Is a|nothing)/.test(o);
          state.line(err ? 'err' : /^(moved|restored) /.test(o) ? 'ok' : 'out', o);
        }
      }
    }
    state.ps.innerHTML = state.psHtml(m.cwd);
    if (state.field.get() !== m.line) state.field.set(m.line);
    state.sc.scrollTop = state.sc.scrollHeight;
  }

  function buildTerminal(state) {
    ({ util: state.util, spec: state.spec } = state.ctx);
    state.fam = state.env.taskDef.helpers;
    state.term = state.util.el('div', 'at-term', state.main);
    state.tabs = state.util.el('div', 'at-term-tabs', state.term);
    state.util.el('span', 'on', state.tabs, 'bash');
    state.util.el('span', '', state.tabs, 'user@workspace');
    state.sc = state.util.el('div', 'at-tscroll', state.term);
    state.lines = state.util.el('div', '', state.sc);
    state.prompt = state.util.el('div', 'at-prompt', state.sc);
    state.ps = state.util.el('span', '', state.prompt);
    state.input = state.util.el('input', '', state.prompt);
    state.input.type = 'text';
    state.input.spellcheck = false;
    state.input.autocomplete = 'off';
    state.input.setAttribute('aria-label', 'command line');
    state.psHtml = (cwd) => `<span class="at-ps">user@workspace</span>:<span class="at-pc">${cwd ? '~/' + cwd : '~'}</span>$`;
    state.line = (cls, text) => state.util.el('div', 'at-tl ' + cls, state.lines, text);
    state.field = state.env.ui.textField(state.input, {
      value: state.ctx.model.line,
      label: 'command',
      onInput: (v) => { if (v !== state.ctx.model.line) state.ctx.update({ ...state.ctx.model, line: v }); },
    });
    state.runLine = () => {
      const m = state.fam.run(state.ctx.model, state.spec, state.input.value);
      state.env.log('command', { cmd: state.input.value });
      const prev = state.ctx.model;
      state.ctx.update(m);
      state.guard(state.ctx, prev, m);
      state.paint(m);
    };
    state.input.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      state.runLine();
    });
    state.sc.addEventListener('click', () => { if (document.activeElement !== state.input) state.input.focus({ preventScroll: true }); });
    state.shown = null;
    state.paint(state.ctx.model);
  }

  function handlers(state) {
    return {
      sync: state.paint,
      // A dismissed overlay (promo modal, cookie banner) takes the focus with it: the key then lands on <body>.
      // The shell keeps listening like a real terminal window: Enter with nothing focused goes to the prompt.
      onKey(e) {
        if (e.key !== 'Enter' || !state.input.isConnected) return;
        const ae = document.activeElement;
        if (ae && ae !== document.body && ae !== document.documentElement) return;
        e.preventDefault();
        state.input.focus({ preventScroll: true });
        state.runLine();
      },
      locate(t) {
        if (t.prompt) return state.field.locate();
        return null;
      },
    };
  }

  function build(ctx, main, scope) {
    const state = {
      ctx, main, env: scope.env, guard: scope.guard,
    };
    state.paint = (m) => paint(state, m);
    buildTerminal(state);
    return handlers(state);
  }
  env.template('use-desktop-tools/_base-terminal', () => ({ build }));
})();
