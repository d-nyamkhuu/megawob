/* use-desktop-tools/_workspace-terminal: terminal prompt and transcript.
 * install(S, BASE) installs the existing design parts and returns the builder; S keeps the live
 * tokens and resolved parts. Each build owns its rendering, painting and input state.
 */
(function () {
  'use strict';
  function install(S, BASE) {
    // ================================================================ terminal

    // Parts of the shell pane, called with X = { ctx, util, spec, fam, main, term, tabs, sc, lines, prompt, ps, input,
    // line(cls, text), psHtml(cwd), field, shown, paint(m) } (set in this order, as far as the part runs):
    BASE.termSetup = () => {}; // before anything is built
    BASE.termTabs = (X) => {
      X.util.el('span', 'on', X.tabs, 'bash');
      X.util.el('span', '', X.tabs, S.D.host);
    };
    BASE.termScroller = () => {}; // after the scrolling output (X.sc) is built
    BASE.termInput = () => {}; // after the command line input is set up
    BASE.termPs = (X, cwd) => `<span class="at-ps">${S.D.host}</span>:<span class="at-pc">${cwd ? '~/' + cwd : '~'}</span>$`;
    BASE.termReady = () => {}; // after psHtml and line() exist, before the text field is made
    BASE.termWelcome = (X, m) => {
      const { spec } = X;
      X.line('dim', 'Welcome! Type help for a list of available commands.');
      X.line('dim', `Last login: ${spec.login}`);
      if (S.D.welcomeFiles) {
        X.line('out', 'Available files in this workspace:');
        for (const f of spec.files) X.line('out', '~/' + f);
      }
    };
    BASE.termEnter = () => {}; // on Enter, before the command runs
    BASE.termPaintStart = () => {}; // start of paint(m)
    BASE.termPaintEnd = () => {}; // before the output scrolls to the prompt
    BASE.termScroll = (X) => { X.sc.scrollTop = X.sc.scrollHeight; };

    function buildTerminal(ctx, main) {
      return build(ctx, main, S);
    }
    return buildTerminal;
  }
  function paint(state, m) {
    state.P.termPaintStart(state.X, m);
    const key = `${m.history.length}/${m.cleared}`;
    if (key !== state.X.shown) {
      state.X.shown = key;
      state.lines.replaceChildren();
      if (m.cleared === 0) state.P.termWelcome(state.X, m);
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
    if (state.D.focusLine && m.line) state.input.focus({ preventScroll: true });
    state.P.termPaintEnd(state.X, m);
    state.P.termScroll(state.X, m);
  }

  function buildTerminal(state) {
    ({ util: state.util, spec: state.spec } = state.ctx);
    state.fam = env.taskDef.helpers;
    state.X = { ctx: state.ctx, util: state.util, spec: state.spec, fam: state.fam, main: state.main, shown: null };
    state.P.termSetup(state.X);
    state.X.term = state.util.el('div', 'at-term', state.main);
    state.X.tabs = state.util.el('div', 'at-term-tabs', state.X.term);
    state.P.termTabs(state.X);
    state.sc = state.X.sc = state.util.el('div', 'at-tscroll', state.X.term);
    state.P.termScroller(state.X);
    state.lines = state.X.lines = state.util.el('div', state.D.linesClass, state.sc);
    state.prompt = state.X.prompt = state.util.el('div', 'at-prompt', state.sc);
    state.ps = state.X.ps = state.util.el('span', state.D.psClass, state.prompt);
    state.input = state.X.input = state.util.el('input', '', state.prompt);
    state.input.type = 'text';
    state.input.spellcheck = false;
    state.input.autocomplete = 'off';
    if (state.D.placeholder !== null) state.input.placeholder = state.D.placeholder;
    state.input.setAttribute('aria-label', 'command line');
    state.P.termInput(state.X);
    state.psHtml = state.X.psHtml = (cwd) => state.P.termPs(state.X, cwd);
    state.line = state.X.line = (cls, text) => state.util.el('div', 'at-tl ' + cls, state.lines, text);
    state.P.termReady(state.X);
    state.field = state.X.field = env.ui.textField(state.input, {
      value: state.ctx.model.line,
      label: 'command',
      onInput: (v) => { if (v !== state.ctx.model.line) state.ctx.update({ ...state.ctx.model, line: v }); },
    });
    state.input.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      state.P.termEnter(state.X);
      const m = state.fam.run(state.ctx.model, state.spec, state.input.value);
      env.log('command', { cmd: state.input.value });
      state.ctx.update(m);
      state.paint(m);
    });
    state.sc.addEventListener('click', () => { if (document.activeElement !== state.input) state.input.focus({ preventScroll: true }); });
    state.X.paint = state.paint;
    state.paint(state.ctx.model);
  }

  function handlers(state) {
    return {
      sync: state.paint,
      locate(t) {
        if (t.prompt) return state.field.locate();
        return null;
      },
    };
  }

  function build(ctx, main, scope) {
    const state = {
      ctx, main, P: scope.P, D: scope.D,
    };
    state.paint = (m) => paint(state, m);
    buildTerminal(state);
    return handlers(state);
  }
  env.template('use-desktop-tools/_workspace-terminal', () => ({ install }));
})();
