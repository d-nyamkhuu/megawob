# type-text/fields

A form card with native `<input type=text|password>` and `<textarea>` fields. The agent types given text into
labeled fields.

| Scenario | The agent |
| --- | --- |
| `single` | Types a given string into one field. |
| `transform` | Types a given string after a stated change, such as upper case or a substitution. |
| `password` | Types a password into a password field and its confirmation. |
| `login` | Types credentials and uses the in-app Sign in button. |
| `multi` | Fills three to five (or more) labeled fields from label and value pairs in another order than the form. |

The widget also keeps the `textarea`, `copy` and validation-fix paths, which use the same card.

- Fields are bound with `env.ui.textField`, which handles masks and a character counter inside the field.
- A form with an in-app save has a submit button inside the `<form>`. A click, or Enter in a one-line field, runs the
  task's `validate()`.
- Errors show in a fixed-height slot under each field and in a status line next to the button.
- The focused field is mirrored into `model.focus`.
- Long forms scroll the page.

The card uses `ft-*` classes and the site's colors: `--panel`, `--line`, `--accent`, `--muted`, `--fg` and `--bg`.
A site restyles it in `site.css`.

The header of `fields.js` lists every token and part. This file is a shorter guide.

## Looks

| Look | When | What it does |
| --- | --- | --- |
| Fixed | The default | The card comes from the tokens: one layout and fixed sizes. The card fills the stage width. No rng draws. |
| Sampled | When `sample` is set (the `password` preset) | A per-seed look: label style, widths, heights, radii, input style, card style, texts and the card position in the stage. Layouts are tried until the card fits. |

## Defaults and presets

The defaults draw `design-type-text-transform-02`. With `design: {}`, each scenario draws one existing site:

| Scenario | Site | Preset |
| --- | --- | --- |
| `transform` | `design-type-text-transform-02` | None. |
| `single` | `design-type-text-single-02` | `layout: 'stacked'`, `title: 'Your Answer'`. |
| `login` | `design-type-text-login-10` | `layout: 'stacked'`. |
| `multi` | `design-type-text-multi-01` | `title: 'Personal Information'`, `scrollable: false`, `fit: 'columns-scale'`. |
| `password` | `design-type-text-password-07` | `sample: {layout: 'try'}`, `labelWithPlaceholder: true`. |

A design replaces an object token as a whole (`sample`, `vars`). The template then fills in the nested defaults that
the design left out.

## Rules

- Unknown tokens, parts and `sample` keys throw.
- Parts are `(base, S) => replacement`. They call other parts through `P`, and may call `base(...)`.
- `S` has `st` (the page state: `ctx`, `spec`, `fam`, `host`, `card`, `inputs`, `save`, `status`, `okText`, `badText`
  and `idleText`), `ctx`, `D`, `P`, `update(patch)` (merges a patch into the model and repaints) and `paint(model)`.
- The page state stays inside each factory.
- A replaced part keeps the rng draws of the part it replaces, in order. In a design that fixes `sample.first`, the
  first layout is still drawn and discarded.
- A site's frame and styling come from its own `site.js` and `site.css`.

## Tokens

Fixed look only, unless noted:

| Token | Default | Effect |
| --- | --- | --- |
| `layout` | `'inline'` | `'stacked'`, `'inline'`, `'columns'`, `'floating'` or `'placeholder'`. |
| `disabled` | `'subtle'` | Look of disabled fields: `'subtle'` or `'grey'`. |
| `subtitle`, `hint` | `''` | A subtitle under the title, and a hint under the first password field. |
| `foot` | `false` | Login footer links: "Forgot password?" and "Need an account?". |
| `flat`, `ruled`, `caps`, `underline`, `btnRight`, `ghost` | `false` | Flat card, ruled title, uppercase labels, underlined inputs, save button on the right, ghost save button. |
| `vars` | `{}` | Replaces entries of the card's custom properties: `--ft-w`, `--ft-h`, `--ft-gap`, `--ft-pad`, `--ft-r`, `--ft-fs`, `--ft-align`. Merged over the defaults. |
| `okText` | `'Saved'` | Status after a good save. |
| `badText` | `'Please check your entries.'` | Status after a bad save. |
| `idleText` | `''` | Status before saving. |
| `title` | `''` | Text of the card's `h2`. `null` uses `spec.title`. |
| `titleHidden` | `false` | Hides the `h2`. |
| `cardWidth` | `'100%'` | Width of the card. `null` leaves it alone. |
| `fit` | `null` | `'scale'` shrinks the card with `transform: scale()` to fit the stage height. `'columns-scale'` first switches an overflowing inline grid to two columns, then scales. |

Both looks:

| Token | Default | Effect |
| --- | --- | --- |
| `optional` | `true` | Adds "(optional)" after the label of a blank field. |
| `scrollable` | `true` | Lets the page scroll for long forms. |
| `errIn` | `'field'` | Where the error slot goes: `'field'` (the field wrapper) or `'box'` (inside the input wrapper). |
| `label` | `null` | Text of every label. `null` uses the field label, "(optional)" and `labelSuffix`. |
| `labelSuffix` | `''` | Appended to a label, after "(optional)". |
| `labelWithPlaceholder` | `false` | Draws the label above the input in the placeholder layout too. |
| `floating` | `true` | `false` never uses a floating label. A floating layout then draws labels above. |
| `gridClass` | `null` | Class of the field grid, instead of the one from the layout. |
| `placeholderLayout` | `'label'` | In the placeholder layout the placeholder is `'label'` (the label text), `''` (empty) or `null` (as in any layout). |
| `placeholderField` | `true` | A field's own placeholder: `true` shows it, `false` hides it, a string shows that instead. |
| `placeholderAlways` | `null` | A string: every input gets this placeholder. |
| `emptyClass` | `null` | A class toggled on each input wrapper while its field is empty. |
| `sample` | `null` | `{}` selects the sampled look. See below. |

`sample` takes `{layout, first, margin, growShort}`, merged over these defaults:

| Key | Default | Effect |
| --- | --- | --- |
| `layout` | `'stacked'` | `'stacked'`: every try is stacked. `'try'`: the layout of the try. A layout name: always that one. |
| `first` | `null` | A layout name that replaces the sampled first choice. The rng still draws it. |
| `margin` | `24` | Pixels kept free beside the card when fitting it. |
| `growShort` | `true` | A stage under 240 px high measures the window below it. |

A design's `sample` replaces the preset's `sample` as a whole.

## Parts

Card and fields:

| Part | Result and default behavior |
| --- | --- |
| `ensureStyle()` | Installs the shared `ft-style` stylesheet once. |
| `begin(ctx)` | Render start. The page state exists and `st.host` is the stage. May change `st.host` and add state to `st`. |
| `fixedCard(ctx)` | The fixed look: build, title, decorate, width, fit, finish. Returns the card. |
| `sampledCard(ctx)` | The sampled look. Returns the card. |
| `look(ctx)` | The fixed look object, from the tokens. |
| `build(ctx, look)` | Builds the card in `st.host`. Sets `st.card`, `st.inputs`, `st.save` and `st.status`. |
| `heading(ctx, card)` | The `h2`. Default: `spec.title`. |
| `field(ctx, look, f, i, grid)` | Builds one field. Its record `e` is `{f, i, ta, id, wrap, floating, text, label, box, el, counter, err}`. |
| `labelText(f, look)` | The label text of a field. |
| `labelClass(text, look)` | The class of a label above the input. |
| `labelAbove(look, floating)`, `labelInside(look, floating)` | True where the label is drawn. |
| `makeBox(e)` | The input wrapper (`ft-inwrap`). |
| `placeholder(f, text, look, floating)` | The placeholder string, or `undefined` for none. |
| `bindFocus(ctx, f, el)` | Mirrors the focus into `model.focus`. |

Hooks. All do nothing by default:

| Part | Runs |
| --- | --- |
| `beforeFields(ctx, grid, look)` | Before the first field. |
| `fieldDone(ctx, e, look)` | After each field is built. |
| `afterFields(ctx, grid, look)` | After all fields. |
| `saveButton(ctx, btn, row, card)` | After the save button and status line exist. |
| `decorate(ctx, card)` | Fixed look: after the title, before the width. |
| `finish(ctx, card)` | Fixed look: after the fit. Sampled look: after the card is placed. |
| `painted(m)` | After the page is painted for model `m`. |
| `settle(ctx, size)` | Sampled look: after the layout is chosen, before the card is placed. |

Fitting, painting and targets:

| Part | Result and default behavior |
| --- | --- |
| `fit(ctx, card)` | Fixed look: fits the card to the stage. Default: the `fit` token. |
| `anchors(ctx, card)` | `[el]`: the anchors of the render. Default: the card. |
| `stageBox(ctx)` | `{width, height, host}`: the stage box of the sampled look. |
| `paintInput(x, id, m)` | Paints one input after the model changed. Default: `emptyClass`. |
| `clear()` | Empties the enabled fields. A site's Clear button calls `env.widgetDef.clear()`. |
| `locate(t)` | The viewport point `[x, y]` of a plan target. |

## Common changes

- A title, layout or fixed label: `title`, `layout`, `label`, `labelSuffix`, `optional`.
- Field sizes: `vars`.
- A placeholder rule: `placeholderField`, `placeholderLayout`, `placeholderAlways`.
- Label text per field: `labelText`, `labelClass`.
- Decoration around the card: `decorate`, `beforeFields`, `afterFields`, `finish`.
- Where errors go: `errIn`.
- A sign-in button docked outside the card: `saveButton`.
- A different fit: `fit`, or replace the `fit` part.
- A collapsed panel or extra anchors: `begin`, `anchors` and `locate`.
- A sampled look for password forms: `sample`, with `settle` and `stageBox`.
- A Clear button: call `env.widgetDef.clear()` from the site.

Verify a change to the template as `templates/README.md` ("Changing a template") describes: golden snapshots of the
sites built on it before and after, the checker and the lint.
