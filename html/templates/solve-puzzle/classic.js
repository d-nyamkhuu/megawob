/*
 * solve-puzzle/classic: Scenarios arithmetic, algebra, generate, guess, odd-even, tictactoe (hot-cold is
 * solve-puzzle/hot-cold). Built from the live guess-01 widget; unused read-figure scaffold branches removed.
 * design {} reproduces arithmetic-01, algebra-01 and generate-01, and guess-05, odd-even-04 and tictactoe-02
 * apart from their reset control.
 * The widget's scenario picks the implementation (IMPL): arithmetic and algebra share the equation code.
 * Tokens: resetLabel=null (no reset; most guess, odd-even and tictactoe sites name one);
 * placeholder=null (no placeholder attribute).
 * equation: answerLabel=null uses 'x =' for algebra, '' for arithmetic.
 * generate: statusClass='' status div class (also tictactoe's turn/result line); actions=false action row flag;
 * currentLabel='Current number:', currentLabelClass='' caption.
 * guess: guessLabel='Enter your guess:' (02/10 share 'Your guess:'); historyTitle='Guess History'.
 * odd-even: numberClass='' on the number; choiceClass='control' on choices.
 * Preset: generate { statusClass: 'generate-status', actions: true } (shared by all 12 sites).
 * Shared parts: set(patch) merges and syncs; sync(model) runs painters; begin() and rendered() are hooks
 * before/after widget() (rendered is a no-op except for equation and generate); widget() builds the scenario's
 * widget; button(parent,text,key,fn,class="control") wires a registered button; input(parent,prop,
 * label="Your answer:") wires a numeric text field; resetParent() returns .bottom; reset() installs a
 * model-restoring button when resetLabel is set; grid() -> parity div (odd-even) or board div (tictactoe).
 * equation: expression() -> formatted expression; equation() -> equation div; answer() -> input;
 * answerActions(input) no-op decoration hook; widget() builds equation and answer; submitAllowed(el) -> true;
 * submitParent() -> scene; submit() moves the end control into the scene (rendered).
 * generate: widget() builds the generator; generatorBody(box) -> box is the control parent; decorated(box,main)
 * no-op after controls; value(model) no-op after display update; actionParent(box) -> box; moveSubmit(el) ->
 * true; actions() moves Generate and end control into the action row (rendered); inspector() no-op.
 * guess: range(work) writes allowed range; guessInput(work) -> field; history(work) builds remaining
 * count/history and registers its painter; historyHeading(history) adds title; widget() wires guessing.
 * odd-even: heading(grid) no-op hook (headings recur in 03/06); widget() builds parity rows.
 * tictactoe: play(index) applies one move and syncs; status() adds result painter; widget() wires the nine
 * cells, then status().
 * S: live ctx/spec/root/scene/field/refs/paints and D/P. All state is per factory. No part draws randomness.
 */
(function () {
  'use strict';
  const TOKENS = {
    resetLabel: null,
    placeholder: null,
    answerLabel: null,
    statusClass: '',
    actions: false,
    currentLabel: 'Current number:',
    currentLabelClass: '',
    guessLabel: 'Enter your guess:',
    historyTitle: 'Guess History',
    numberClass: '',
    choiceClass: 'control',
  };
  const SCENARIOS = { generate: { statusClass: 'generate-status', actions: true } };
  const IMPL = {
    arithmetic: 'equation',
    algebra: 'equation',
    generate: 'generate',
    guess: 'guess',
    'odd-even': 'odd-even',
    tictactoe: 'tictactoe',
  };
  env.template('solve-puzzle/classic', (design, def) => {
    const V = IMPL[def.scenarios[0]];
    let D, P, ctx, s, u, f, root, scene, field, refs, paints;
    const BASE = {};
    const S = {
      get D() {
        return D;
      },
      get P() {
        return P;
      },
      get ctx() {
        return ctx;
      },
      get spec() {
        return s;
      },
      get root() {
        return root;
      },
      get scene() {
        return scene;
      },
      get field() {
        return field;
      },
      get refs() {
        return refs;
      },
      get paints() {
        return paints;
      },
    };
    BASE.set = (patch) => {
      ctx.update({ ...ctx.model, ...patch });
      P.sync(ctx.model);
    };
    BASE.sync = (m) => {
      paints.forEach((fn) => fn(m));
    };
    BASE.begin = () => {};
    BASE.button = function (p, text, key, fn, cls = 'control') {
      const e = u.el('button', cls, p, text);
      e.type = 'button';
      e.addEventListener('click', () => fn(key));
      refs.set(JSON.stringify(key), e);
      return e;
    };
    BASE.input = function (p, prop, label = 'Your answer:') {
      const row = u.el('div', 'answer', p);
      u.el('label', '', row, label);
      const e = u.el('input', '', row);
      e.type = 'text';
      e.autocomplete = 'off';
      e.inputMode = 'numeric';
      if (D.placeholder !== null) e.placeholder = D.placeholder;
      e.setAttribute('aria-label', label);
      field = env.ui.textField(e, {
        value: ctx.model[prop],
        label: 'answer',
        onInput: (v) => P.set({ [prop]: v }),
      });
      refs.set('field', e);
      paints.push((m) => field.set(m[prop]));
      return e;
    };
    BASE.resetParent = () => document.querySelector('.bottom');
    BASE.reset = () => {
      if (!D.resetLabel) return;
      const first = JSON.parse(JSON.stringify(ctx.model));
      const reset = u.el('button', 'control reference-reset', P.resetParent(), D.resetLabel);
      reset.type = 'button';
      reset.onclick = () => {
        ctx.update(JSON.parse(JSON.stringify(first)));
        P.sync(ctx.model);
      };
    };
    BASE.grid = () => u.el('div', V === 'tictactoe' ? 'ttt' : 'parity', scene);
    const widget = {};
    const rendered = {};

    // equation (arithmetic, algebra)
    BASE.expression = () => s.expr.replace(/\*/g, '×').replace(/\//g, '÷').replace(/-/g, '−');
    BASE.equation = () => u.el('div', 'equation', scene, P.expression());
    BASE.answerActions = () => {};
    BASE.answer = () => {
      const e = P.input(scene, 'answer', D.answerLabel ?? (s.scenario === 'algebra' ? 'x =' : ''));
      P.answerActions(e);
      return e;
    };
    widget.equation = () => {
      P.equation();
      P.answer();
    };
    BASE.submitAllowed = () => true;
    BASE.submitParent = () => scene;
    BASE.submit = () => {
      if (env.submitEl && P.submitAllowed(env.submitEl)) {
        P.submitParent().append(env.submitEl);
        env.submitEl.classList.add('in-scene');
      }
    };
    rendered.equation = () => P.submit();

    // generate
    BASE.value = () => {};
    BASE.generatorBody = (box) => box;
    BASE.decorated = () => {};
    widget.generate = () => {
      const box = u.el('div', 'generator', scene);
      const main = P.generatorBody(box);
      u.el('div', D.currentLabelClass, main, D.currentLabel);
      const display = u.el('div', 'readout', main);
      P.button(main, 'Generate', { button: 'generate' }, () => {
        const m = f.generate(ctx.model, s);
        ctx.update(m);
        P.sync(m);
      });
      const status = u.el('div', D.statusClass, main);
      P.decorated(box, main);
      paints.push((m) => {
        display.textContent = m.value === null ? '—' : m.value;
        P.value(m);
        status.textContent = `Generated ${m.presses} times`;
      });
    };
    BASE.actionParent = (box) => box;
    BASE.moveSubmit = () => true;
    BASE.inspector = () => {};
    BASE.actions = () => {
      if (!D.actions) return;
      const box = root.querySelector('.generator'),
        actions = u.el('div', 'generate-actions', P.actionParent(box));
      actions.append(refs.get(JSON.stringify({ button: 'generate' })));
      if (env.submitEl && P.moveSubmit(env.submitEl)) actions.append(env.submitEl);
      P.inspector();
    };
    rendered.generate = () => P.actions();

    // guess
    BASE.range = (work) => u.el('div', '', work, `Allowed numbers: ${s.lo} – ${s.hi}`);
    BASE.guessInput = (work) => P.input(work, 'text', D.guessLabel);
    BASE.historyHeading = (history) => u.el('b', '', history, D.historyTitle);
    BASE.history = (work) => {
      const remaining = u.el('div', '', work),
        history = u.el('div', 'history', scene);
      paints.push((m) => {
        remaining.textContent = `Guesses remaining: ${f.left(m, s)}`;
        history.replaceChildren();
        P.historyHeading(history);
        if (!m.guesses.length) u.el('p', '', history, 'No guesses yet.');
        m.guesses.forEach((g) => u.el('div', '', history, `${g.value}: ${g.verdict}`));
      });
    };
    widget.guess = () => {
      const work = u.el('div', 'guess-work', scene);
      P.range(work);
      const e = P.guessInput(work);
      const guess = () => {
        const m = f.makeGuess({ ...ctx.model, text: field.get() }, s);
        ctx.update(m);
        P.sync(m);
      };
      P.button(work, 'Guess', { button: 'guess' }, guess, 'control primary');
      e.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          guess();
        }
      });
      e.addEventListener('focus', () => {
        if (!ctx.model.focus) ctx.update({ ...ctx.model, focus: true });
      });
      e.addEventListener('blur', () => {
        if (ctx.model.focus) ctx.update({ ...ctx.model, focus: false });
      });
      P.history(work);
    };

    // odd-even
    BASE.heading = () => {};
    widget['odd-even'] = () => {
      const grid = P.grid();
      P.heading(grid);
      grid.style.setProperty('--n', s.numbers.length);
      s.numbers.forEach((n, i) => {
        const row = u.el('div', 'parity-row', grid);
        u.el('strong', D.numberClass, row, String(n));
        ['odd', 'even'].forEach((k) => {
          const e = P.button(
            row,
            k === 'odd' ? 'Odd' : 'Even',
            { mark: [i, k] },
            () => {
              const marks = ctx.model.marks.slice();
              marks[i] = k;
              P.set({ marks });
            },
            D.choiceClass,
          );
          paints.push((m) => e.classList.toggle('selected', m.marks[i] === k));
        });
      });
    };

    // tictactoe
    BASE.play = (i) => {
      const m = f.play(ctx.model, s, i);
      if (m !== ctx.model) {
        ctx.update(m);
        P.sync(m);
      }
    };
    BASE.status = () => {
      const status = u.el('div', D.statusClass, root);
      paints.push(
        (m) =>
          (status.textContent = m.result
            ? { win: 'You win!', draw: 'It is a draw.', loss: 'The computer wins.' }[m.result]
            : 'Your turn (X). Click a square to make your move.'),
      );
    };
    widget.tictactoe = () => {
      const grid = P.grid();
      for (let i = 0; i < 9; i++) {
        const e = P.button(grid, '', { cell: i }, () => P.play(i), 'ttt-cell');
        paints.push((m) => {
          e.textContent = m.board[i];
          e.classList.toggle('o', m.board[i] === 'O');
        });
      }
      P.status();
    };

    BASE.widget = widget[V];
    BASE.rendered = rendered[V] || (() => {});
    ({ D, P } = env.templateDesign('solve-puzzle/classic', design, def, {
      tokens: TOKENS,
      scenarios: SCENARIOS,
      base: BASE,
      state: S,
    }));
    return {
      render(next) {
        ctx = next;
        s = ctx.spec;
        u = ctx.util;
        f = env.taskDef.helpers;
        root = u.el(
          'div',
          'content ' +
            s.scenario +
            '-content' +
            (['arithmetic', 'algebra'].includes(s.scenario) ? ' equation-content' : ''),
          ctx.stage,
        );
        scene = u.el('div', 'scene', root);
        refs = new Map();
        paints = [];
        field = null;
        P.begin();
        P.widget();
        P.rendered();
        P.reset();
        P.sync(ctx.model);
        return { anchors: [root], sync: (m) => P.sync(m) };
      },
      locate(t) {
        if (t.field && field) return field.locate();
        const e = refs.get(JSON.stringify(t));
        if (!e) throw new Error('Missing target ' + JSON.stringify(t));
        return env.util.center(e);
      },
    };
  });
})();
