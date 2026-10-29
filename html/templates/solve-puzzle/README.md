# solve-puzzle templates

Two templates. The agent solves a small puzzle by typing or clicking.

| Template | Scenarios | What the page shows |
| --- | --- | --- |
| `solve-puzzle/classic` | `arithmetic`, `algebra`, `generate`, `guess`, `odd-even`, `tictactoe` | The widget of the scenario: a sum, an equation, a number generator, a guessing game, parity buttons or a board. |
| `solve-puzzle/hot-cold` | `hot-cold` | A board where each click reports a temperature band and whether it is warmer or colder. |

In `classic` the scenario picks the implementation. `arithmetic` and `algebra` share the equation code.

The widgets draw no random numbers, except `hot-cold`, whose look and board draws are kept in their original order.

With `design: {}`, `classic` draws these sites, apart from their reset control (`resetLabel` defaults to `null`):

| Scenario | Site |
| --- | --- |
| `arithmetic` | `design-solve-puzzle-arithmetic-01` |
| `algebra` | `design-solve-puzzle-algebra-01` |
| `generate` | `design-solve-puzzle-generate-01` |
| `guess` | `design-solve-puzzle-guess-05` |
| `odd-even` | `design-solve-puzzle-odd-even-04` |
| `tictactoe` | `design-solve-puzzle-tictactoe-02` |

`hot-cold` draws `design-solve-puzzle-hot-cold-02`. The header of each `.js` file lists every token and part. This
file is a shorter guide.

## Rules

- Parts are `(base, S) => replacement`. Every call goes through `P`.
- `S` exposes live `ctx`, `spec`, `root`, `scene`, `field`, `refs`, `paints`, `D` and `P` in `classic`. All state is
  per factory.
- A replaced part in `hot-cold` keeps the original look and board draws, in order.
- The original style text is kept intact.
- Widget identity and traits stay in the widget registration of the site.

## classic

### Tokens

Shared:

| Token | Default | Effect |
| --- | --- | --- |
| `resetLabel` | `null` | Text of a reset button that restores the model. `null` adds none. |
| `placeholder` | `null` | Placeholder attribute of the field. `null` sets none. |

By scenario:

| Token | Default | Effect |
| --- | --- | --- |
| `answerLabel` | `null` | `arithmetic`, `algebra`: label of the answer. `null` uses `x =` for algebra and nothing for arithmetic. |
| `statusClass` | `''` | `generate`, `tictactoe`: class of the status div (also the turn and result line). |
| `actions` | `false` | `generate`: puts the Generate and end controls in an action row. |
| `currentLabel` | `'Current number:'` | `generate`: caption of the current number. |
| `currentLabelClass` | `''` | `generate`: class of that caption. |
| `guessLabel` | `'Enter your guess:'` | `guess`: label of the guess field. |
| `historyTitle` | `'Guess History'` | `guess`: title of the history. |
| `numberClass` | `''` | `odd-even`: extra class on the number. |
| `choiceClass` | `'control'` | `odd-even`: class of the choice buttons. |

The `generate` preset sets `statusClass: 'generate-status'` and `actions: true`. The other scenarios have no preset.

### Shared parts

| Part | Result and default behavior |
| --- | --- |
| `set(patch)` | Merges the patch into the model and syncs. |
| `sync(model)` | Runs the painters. |
| `begin()` | A hook before `widget()`. No-op. |
| `rendered()` | A hook after `widget()`. No-op, except for `equation` and `generate`. |
| `widget()` | Builds the widget of the scenario. |
| `button(parent, text, key, fn, class = 'control')` | Wires a registered button. |
| `input(parent, prop, label = 'Your answer:')` | Wires a numeric text field. |
| `resetParent()` | The element that holds the reset button: `.bottom`. |
| `reset()` | Installs a model-restoring button when `resetLabel` is set. |
| `grid()` | The parity div (`odd-even`) or the board div (`tictactoe`). |

### Parts by scenario

arithmetic and algebra:

| Part | Result and default behavior |
| --- | --- |
| `expression()` | The formatted expression. |
| `equation()` | The equation div. |
| `answer()` | The input. |
| `answerActions(input)` | A decoration hook for extra actions such as clear, hint or a calculator. No-op. |
| `submitAllowed(el)` | True. Return a predicate to gate the move of the end control. |
| `submitParent()` | The scene. |
| `submit()` | Moves the end control into the scene, in `rendered`. |

generate:

| Part | Result and default behavior |
| --- | --- |
| `generatorBody(box)` | The control parent. Default: `box`. |
| `decorated(box, main)` | Runs after the controls. No-op. |
| `value(model)` | Runs after the display updates. No-op. |
| `actionParent(box)` | The parent of the action row. Default: `box`. |
| `moveSubmit(el)` | True. Return a predicate to gate the move of the end control. |
| `actions()` | Moves Generate and the end control into the action row, in `rendered`. |
| `inspector()` | No-op. |

guess:

| Part | Result and default behavior |
| --- | --- |
| `range(work)` | Writes the allowed range. |
| `guessInput(work)` | The guess field. |
| `history(work)` | Builds the remaining count and the history, and registers the painter. |
| `historyHeading(history)` | Adds the title. |

odd-even and tictactoe:

| Part | Result and default behavior |
| --- | --- |
| `heading(grid)` | `odd-even`: a heading hook. No-op. |
| `play(index)` | `tictactoe`: applies one move and syncs. |
| `status()` | `tictactoe`: adds the result painter. |

`widget()` wires the nine cells and then calls `status()` for `tictactoe`.

## hot-cold

| Token | Default | Effect |
| --- | --- | --- |
| `colors` | `{hot: '#e03131', warm: '#f08c00', cold: '#1c7ed6', ice: '#66d9e8'}` | Feedback palette. |
| `minHeight` | `-Infinity` | Smallest board height. No clamp by default. |
| `minWidth` | `-Infinity` | Smallest board width. No clamp by default. |

`hot-cold` has no preset.

`S` has `st` (the live widgets, geometry and look), `ctx`, `D`, `P`, `ARROW_UP` and `ARROW_DOWN`.

| Part | Result and default behavior |
| --- | --- |
| `usable(ctx)` | The stage box that avoids the end control. |
| `build(ctx, box, squeeze)` | The puzzle card. |
| `clearStage(stage)` | Clears the stage children. |
| `fit(ctx, avail)` | `{bw, bh, side}`: the board size, with the original width draw. |
| `board(ctx, body, avail)` | Builds and wires the board. |
| `svgAttrs(bw, bh)` | The attributes of the SVG. |
| `prepared(ctx, geo)` | Runs before the board is wired. No-op. |
| `rect(board)` | The border rectangle used to map input. |
| `scale(geo)` | `{sx, sy, width, height}` from the sampled dimensions. Replace it to scale from live geometry. |
| `marker(probe)` | The SVG string for one numbered probe. |
| `panel(model, last, geo)` | Runs before feedback. No-op. |
| `trend(last)` | Writes the arrow markup. |
| `status(model, last)` | Writes the remaining clicks. Wrap it to mirror the feedback into the frame. |

A `probe` has `u`, `v`, `i`, `fb`, `x`, `y`, `lastOne`, `ps`, `sx`, `sy`, `width` and `height`.

## Common changes

- A different answer label or placeholder: `answerLabel`, `placeholder`, `guessLabel`.
- Extra actions next to the answer: `answerActions`.
- A reset button: `resetLabel`, and `resetParent` to move it.
- A different guess history or range display: `range`, `history`, `historyTitle`, `historyHeading`.
- A generator with a different shell: `generatorBody`, `decorated`, `actionParent`.
- A different tic-tac-toe panel: `grid`, `status`. Reuse `play` for extra buttons.
- A different parity heading or classes: `heading`, `numberClass`, `choiceClass`, `grid`.
- A board that never shrinks below a size: `minHeight`, `minWidth`.
- Different probe markers or feedback: `marker`, `panel`, `trend`, `status`, `svgAttrs`.
- Scaling probes from the live board: `prepared`, `scale`.

Verify a change to these templates as `templates/README.md` ("Changing a template") describes: golden snapshots of
the sites built on them before and after, the checker and the lint.
