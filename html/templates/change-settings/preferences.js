/*
 * templates / change-settings / preferences: one settings card for toggle, dependent, mixed and search.
 * Tabs show one section or capped search results; long pages stack sections with a sticky index and save bar.
 * Switches/checkboxes, option lists and number steppers share visibility, dependency and save/discard logic.
 * design: {} reproduces design-change-settings-dependent-01, design-change-settings-mixed-01,
 * design-change-settings-search-01 and design-change-settings-toggle-01. No scenario presets are needed.
 *
 * Tokens (defaults below):
 *   css: reference structural CSS; foreground, muted, panel, background, line, accent: corresponding var(--*)
 *   font: 'inherit'; titleSize: '20px'; labelSize: '14.5px'; detailSize: '12.5px'
 *   dirtyColor: '#c2410c'; toastColor: '#1f7a3a'; inverseColor: '#fff'
 *   minWidth: 480; widthInset: 44; tabWidthMin: 700; longWidthMin: 760; widthMax: 980 (px)
 *   sideTabsAt: 700; indexAt: 760; wideHeadAt: 640 (card width breakpoints in px)
 *   rowHeight: 58; minRowHeight: 44; descriptionAt: 52 (px); onOffChance: .35
 *   bottomSpace: 160 (long page px); placementMax: 60 (sampled top margin upper bound)
 *   subtitles, placeholders, toasts, discardLabels, saveLabels: reference label arrays, sampled in that order
 *   searchIcon: reference SVG; selectIcon: '▾'; minusLabel: '−'; plusLabel: '+'; checkLabel: '✓'
 *   onLabel: 'On'; offLabel: 'Off'; headSaveLabel: 'Save'; resultsLabel: 'Search results'
 *   emptyLabel: 'No settings match your search.'; dirtyLabel: 'You have unsaved changes'
 *   savedLabel: 'All changes saved'; unchangedLabel: 'No changes yet'
 *   moreLabel: 'Showing {shown} of {total} results. Refine your search to see more.'
 *
 * Parts (all called through P; design.parts uses (base, S) => replacement):
 *   style(ctx) -> void: install tokenized CSS once as sp-style
 *   begin(ctx) -> void: restore the scrollable stage's flex sizing
 *   wrap(ctx) -> el: page wrapper; width(ctx) -> px: sample and clamp card width
 *   card(ctx, wrap) -> el: card at S.geo.cardW; title(ctx, head) -> void: title and sampled subtitle
 *   search(ctx, head) -> input: icon and sampled placeholder (query binding is separate)
 *   button(ctx, parent, label, primary) -> el: standard action button
 *   header(ctx, card) -> {head, sInput, headSave, toast}: header, search, optional Save and sampled toast
 *   geometry(ctx) -> geo: row height, description visibility and sampled on/off visibility
 *   body(ctx, card) -> el: body with responsive tabs orientation
 *   tab(ctx, tabs, section) -> button: section tab; indexLink(ctx, index, section) -> a: section link
 *   navigation(ctx, body) -> void: tab/index layout and bindings, fills S.els.tabEls/navEls
 *   panel(ctx, body) -> el: content panel with fixed height in tabs mode
 *   section(ctx, panel, section) -> el: section heading
 *   row(ctx, panel, setting, depth) -> el: dependency indentation and row height
 *   label(ctx, row, setting, section) -> tag: label, section tag and optional description
 *   toggle(ctx, row, setting) -> {ctl, onoff?}: switch or checkbox
 *   option(ctx, pop, value) -> button: one listbox option
 *   select(ctx, row, setting) -> {ctl, val, pop, opts, popRows}: select trigger and option list
 *   number(ctx, row, setting) -> {ctl, minus, plus}: number stepper and unit
 *   bindRow(ctx, id, rec) -> void: model events for a control; update(ctx, model) -> void: update then paint
 *   rows(ctx, panel) -> void: headings, rows, controls and search messages, fills S.els
 *   footer(ctx, card) -> {foot, status, discardBtn, saveBtn}: sampled actions and bottom scroll space
 *   bind(ctx) -> void: query, save, discard and outside-click events
 *   place(ctx) -> void: sampled top margin for tabs, after card measurement
 *   paintRow(model, id, rec, visible, query) -> void: row/control display and popup placement
 *   paint(model) -> void: section/search visibility, status, saved toast, save-bar synchronization
 *   hits(el, x, y) -> bool: occlusion test; pointOf(el) -> [x,y]: visible control point or scroll sentinel
 *   locate(target) -> [x,y]|null: search/save/discard/tab/control/option/step target mapping
 *   decorated(ctx), rendered(ctx) -> void: default-noop decorations before placement / after initial paint
 *
 * Parts are installed in frame, control, action and display groups; the factory holds their shared state.
 * S exposes live ctx, spec, geo (settable), els (DOM/control maps), D and P. Per-page state is in the factory.
 * Replacing a drawing part must preserve every rng draw in order, including conditional draws. Extra
 * decoration randomness belongs on ctx.rng.fork('<label>'). Anchors remain the header; inputs and
 * scrollability are inherited as in the base widget. Keep control record fields when replacing builders.
 */
(function () {
  'use strict';

  const CSS = `
  .sp-wrap { align-self: flex-start; margin: 18px 22px; color: var(--fg); }
  .sp-card { position: relative; display: flex; flex-direction: column; border: 1px solid var(--line); border-radius: 12px; background: var(--panel);
    box-shadow: 0 1px 2px rgba(0,0,0,.05), 0 10px 30px rgba(0,0,0,.06); }
  .sp-head { flex: none; display: flex; align-items: center; gap: 16px; flex-wrap: wrap; padding: 14px 18px; border-bottom: 1px solid var(--line); }
  .sp-head .t { flex: 1; min-width: 200px; }
  .sp-head h1 { margin: 0; font-size: 20px; }
  .sp-head .sub { font-size: 13px; color: var(--muted); }
  .sp-search { display: flex; align-items: center; gap: 8px; height: 36px; width: 260px; padding: 0 10px; border: 1px solid var(--line); border-radius: 8px;
    background: var(--bg); color: var(--muted); }
  .sp-search input { flex: 1; min-width: 0; border: 0; outline: 0; background: transparent; color: var(--fg); font: inherit; font-size: 14px; }
  .sp-body { flex: 1; min-height: 0; display: flex; }
  .sp-body.top { flex-direction: column; }
  .sp-tabs { flex: none; display: flex; flex-direction: column; gap: 2px; width: 184px; padding: 12px 8px; border-right: 1px solid var(--line); }
  .sp-body.top .sp-tabs { flex-direction: row; flex-wrap: nowrap; overflow: hidden; width: auto; padding: 6px 10px 0; border-right: 0; border-bottom: 1px solid var(--line); }
  .sp-tab { display: block; padding: 8px 10px; border: 0; border-radius: 7px; background: none; color: var(--muted); font: inherit; font-size: 14px; text-align: left; cursor: pointer; white-space: nowrap; }
  .sp-tab:hover { color: var(--fg); background: color-mix(in srgb, var(--fg) 5%, transparent); }
  .sp-tab.on { color: var(--fg); font-weight: 650; background: color-mix(in srgb, var(--accent) 13%, transparent); }
  .sp-body.top .sp-tab { border-radius: 7px 7px 0 0; }
  .sp-panel { position: relative; flex: 1; min-width: 0; padding: 4px 18px 8px; }
  .sp-sec { margin: 12px 0 4px; font-size: 13px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; color: var(--muted); }
  .sp-long .sp-sec { margin: 22px 0 6px; font-size: 16px; letter-spacing: 0; text-transform: none; color: var(--fg); }
  .sp-row { position: relative; display: flex; align-items: center; gap: 16px; box-sizing: border-box; padding: 6px 2px; border-bottom: 1px solid var(--line); }
  .sp-row .lab { flex: 1; min-width: 0; }
  .sp-row .lab b { display: block; font-size: 14.5px; font-weight: 600; }
  .sp-row .lab small { display: block; margin-top: 2px; font-size: 12.5px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sp-row .tag { margin-left: 6px; padding: 1px 6px; border-radius: 9px; font-size: 11px; font-weight: 600; color: var(--muted); background: color-mix(in srgb, var(--fg) 7%, transparent); }
  .sp-row.child { margin-left: 22px; padding-left: 12px; border-left: 2px solid color-mix(in srgb, var(--accent) 40%, var(--line)); }
  .sp-row.child2 { margin-left: 44px; }
  .sp-switch { position: relative; flex: none; width: 44px; height: 24px; border: 0; border-radius: 12px; background: color-mix(in srgb, var(--fg) 22%, var(--panel)); cursor: pointer; padding: 0; }
  .sp-switch::after { content: ''; position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; border-radius: 50%; background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,.3); }
  .sp-switch.on { background: var(--accent); }
  .sp-switch.on::after { left: 23px; }
  .sp-onoff { flex: none; width: 24px; font-size: 12px; color: var(--muted); text-align: right; }
  .sp-check { flex: none; width: 22px; height: 22px; border: 2px solid color-mix(in srgb, var(--fg) 35%, var(--panel)); border-radius: 5px; background: var(--panel);
    color: #fff; font-size: 15px; line-height: 18px; text-align: center; cursor: pointer; padding: 0; }
  .sp-check.on { background: var(--accent); border-color: var(--accent); }
  .sp-select { flex: none; display: flex; align-items: center; justify-content: space-between; gap: 10px; min-width: 150px; height: 34px; padding: 0 10px;
    border: 1px solid var(--line); border-radius: 7px; background: var(--bg); color: var(--fg); font: inherit; font-size: 14px; cursor: pointer; }
  .sp-select i { font-style: normal; color: var(--muted); }
  .sp-pop { position: absolute; right: 2px; z-index: 20; display: grid; gap: 2px; padding: 5px; border: 1px solid var(--line); border-radius: 9px;
    background: var(--panel); box-shadow: 0 10px 28px rgba(0,0,0,.18); }
  .sp-pop button { height: 30px; padding: 0 12px; border: 0; border-radius: 6px; background: none; color: var(--fg); font: inherit; font-size: 14px; text-align: left; white-space: nowrap; cursor: pointer; }
  .sp-pop button:hover { background: color-mix(in srgb, var(--accent) 12%, transparent); }
  .sp-pop button.cur { font-weight: 650; color: var(--accent); }
  .sp-num { flex: none; display: flex; align-items: center; gap: 4px; }
  .sp-num button { width: 30px; height: 32px; border: 1px solid var(--line); border-radius: 7px; background: var(--bg); color: var(--fg); font: inherit; font-size: 16px; cursor: pointer; }
  .sp-num input { width: 64px; height: 32px; padding: 0 8px; border: 1px solid var(--line); border-radius: 7px; background: var(--bg); color: var(--fg); font: inherit; font-size: 14px; text-align: right; }
  .sp-num span { min-width: 34px; font-size: 13px; color: var(--muted); }
  .sp-more { margin: 8px 2px; font-size: 12.5px; color: var(--muted); }
  .sp-foot { flex: none; display: flex; align-items: center; gap: 10px; padding: 10px 18px; border-top: 1px solid var(--line); }
  .sp-status { flex: 1; font-size: 13px; color: var(--muted); }
  .sp-status.dirty { color: #c2410c; font-weight: 600; }
  .sp-btn { height: 34px; padding: 0 16px; border: 1px solid var(--line); border-radius: 8px; background: var(--panel); color: var(--fg); font: inherit; font-size: 14px; cursor: pointer; }
  .sp-btn.primary { border-color: var(--accent); background: var(--accent); color: #fff; font-weight: 650; }
  .sp-btn:disabled { opacity: .45; cursor: default; }
  .sp-toast { position: absolute; left: 50%; top: 10px; transform: translateX(-50%); z-index: 5; padding: 7px 14px; border-radius: 999px; background: #1f7a3a; color: #fff;
    font-size: 13px; font-weight: 600; pointer-events: none; visibility: hidden; box-shadow: 0 4px 14px rgba(0,0,0,.2); }
  .sp-toast.on { visibility: visible; }
  .sp-long .sp-body { align-items: flex-start; }
  .sp-index { position: sticky; flex: none; width: 170px; padding: 12px 8px; display: flex; flex-direction: column; gap: 2px; }
  .sp-index a { padding: 6px 10px; border-radius: 6px; color: var(--muted); font-size: 13.5px; text-decoration: none; cursor: pointer; }
  .sp-index a:hover { color: var(--fg); background: color-mix(in srgb, var(--fg) 5%, transparent); }
  .sp-bar { position: sticky; bottom: 0; z-index: 6; display: flex; align-items: center; gap: 10px; padding: 10px 18px; border-top: 1px solid var(--line);
    border-radius: 0 0 12px 12px; background: color-mix(in srgb, var(--accent) 8%, var(--panel)); visibility: hidden; }
  .sp-bar.on { visibility: visible; }
  `;


  const TOKENS = {
    css: CSS,
    foreground: 'var(--fg)', muted: 'var(--muted)', panel: 'var(--panel)', background: 'var(--bg)',
    line: 'var(--line)', accent: 'var(--accent)', font: 'inherit',
    titleSize: '20px', labelSize: '14.5px', detailSize: '12.5px',
    dirtyColor: '#c2410c', toastColor: '#1f7a3a', inverseColor: '#fff',
    minWidth: 480, widthInset: 44, tabWidthMin: 700, longWidthMin: 760, widthMax: 980,
    sideTabsAt: 700, indexAt: 760, wideHeadAt: 640,
    rowHeight: 58, minRowHeight: 44, descriptionAt: 52, onOffChance: .35,
    bottomSpace: 160, placementMax: 60,
    subtitles: ['Changes apply to this account only.', 'Manage how the app works for you.',
      'Some changes may take a minute to apply.', 'Review your preferences below.'],
    placeholders: ['Search settings', 'Find a setting', 'Search'],
    toasts: ['Settings saved', 'Your changes were saved', 'Preferences updated', 'Saved'],
    discardLabels: ['Discard', 'Discard changes', 'Cancel', 'Reset'],
    saveLabels: ['Save', 'Save changes', 'Save settings', 'Apply changes'],
    searchIcon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    selectIcon: '▾', minusLabel: '−', plusLabel: '+', checkLabel: '✓', onLabel: 'On', offLabel: 'Off',
    headSaveLabel: 'Save', resultsLabel: 'Search results', emptyLabel: 'No settings match your search.',
    dirtyLabel: 'You have unsaved changes', savedLabel: 'All changes saved', unchangedLabel: 'No changes yet',
    moreLabel: 'Showing {shown} of {total} results. Refine your search to see more.',
  };

  function installFrameParts(BASE, S) {
    BASE.style = (ctx) => {
      if (document.getElementById('sp-style')) return;
      const replacements = {
        'var(--fg)': S.D.foreground, 'var(--muted)': S.D.muted, 'var(--panel)': S.D.panel,
        'var(--bg)': S.D.background, 'var(--line)': S.D.line, 'var(--accent)': S.D.accent,
        'font: inherit': `font: ${S.D.font}`, 'font-size: 20px': `font-size: ${S.D.titleSize}`,
        'font-size: 14.5px': `font-size: ${S.D.labelSize}`, 'font-size: 12.5px': `font-size: ${S.D.detailSize}`,
        '#c2410c': S.D.dirtyColor, '#1f7a3a': S.D.toastColor, '#fff': S.D.inverseColor,
      };
      const pattern = /var\(--(?:fg|muted|panel|bg|line|accent)\)|font: inherit|font-size: (?:20|14\.5|12\.5)px|#c2410c|#1f7a3a|#fff/g;
      const style = document.createElement('style');
      style.id = 'sp-style';
      style.textContent = S.D.css.replace(pattern, (value) => replacements[value]);
      document.head.append(style);
    };
    BASE.begin = (ctx) => {
      if (ctx.episode && ctx.episode.scrollable) ctx.stage.style.flex = '1 1 0%';
    };
    BASE.wrap = (ctx) => ctx.util.el('div', `sp-wrap${S.geo.long ? ' sp-long' : ''}`, ctx.stage);
    BASE.width = (ctx) => {
      const W = ctx.stage.getBoundingClientRect().width || ctx.size.width;
      return Math.max(S.D.minWidth, Math.min(W - S.D.widthInset, ctx.rng.int(S.geo.long ? S.D.longWidthMin : S.D.tabWidthMin, S.D.widthMax)));
    };
    BASE.card = (ctx, wrap) => {
      const card = ctx.util.el('section', 'sp-card', wrap);
      card.style.width = S.geo.cardW + 'px';
      return card;
    };
    BASE.title = (ctx, head) => {
      const t = ctx.util.el('div', 't', head);
      ctx.util.el('h1', '', t, ctx.spec.title);
      ctx.util.el('div', 'sub', t, ctx.rng.pick(S.D.subtitles));
    };
    BASE.search = (ctx, head) => {
      const search = ctx.util.el('label', 'sp-search', head);
      search.innerHTML = S.D.searchIcon;
      const input = ctx.util.el('input', '', search);
      input.type = 'text';
      input.placeholder = ctx.rng.pick(S.D.placeholders);
      input.autocomplete = 'off';
      input.spellcheck = false;
      return input;
    };
    BASE.button = (ctx, parent, label, primary) => {
      const b = ctx.util.el('button', `sp-btn${primary ? ' primary' : ''}`, parent, label);
      b.type = 'button';
      return b;
    };
    BASE.header = (ctx, card) => {
      const head = ctx.util.el('header', 'sp-head', card);
      S.P.title(ctx, head);
      const sInput = S.P.search(ctx, head);
      const headSave = S.geo.long && ctx.spec.saveStyle === 'button' ? S.P.button(ctx, head, S.D.headSaveLabel, true) : null;
      const toast = ctx.util.el('div', 'sp-toast', card, ctx.rng.pick(S.D.toasts));
      return { head, sInput, headSave, toast };
    };
    BASE.geometry = (ctx) => {
      const sideTabs = S.geo.cardW >= S.D.sideTabsAt;
      let rowH = S.D.rowHeight;
      if (!S.geo.long) {
        const headH = S.geo.cardW >= S.D.wideHeadAt ? 66 : 108;
        const fixed = headH + (sideTabs ? 0 : 42) + 40 + 58 + 20 + 36;
        rowH = Math.max(S.D.minRowHeight, Math.min(S.D.rowHeight, Math.floor((ctx.size.height - fixed) / env.taskDef.helpers.RESULT_CAP)));
      }
      return { ...S.geo, sideTabs, rowH, showDesc: rowH >= S.D.descriptionAt, showOnOff: ctx.rng.bool(S.D.onOffChance) };
    };
    BASE.body = (ctx, card) => ctx.util.el('div', `sp-body${!S.geo.long && !S.geo.sideTabs ? ' top' : ''}`, card);
    BASE.tab = (ctx, tabs, section) => {
      const b = ctx.util.el('button', 'sp-tab', tabs, section.title);
      b.type = 'button';
      b.dataset.role = 'tab';
      return b;
    };
    BASE.indexLink = (ctx, index, section) => {
      const a = ctx.util.el('a', '', index, section.title);
      a.href = '#';
      return a;
    };
    BASE.navigation = (ctx, body) => {
      if (!S.geo.long) {
        const tabs = ctx.util.el('nav', 'sp-tabs', body);
        for (const section of ctx.spec.sections) {
          const b = S.P.tab(ctx, tabs, section);
          b.addEventListener('click', () => S.P.update(ctx, env.taskDef.helpers.setTab(ctx.model, section.id)));
          S.els.tabEls[section.id] = b;
        }
      } else if (S.geo.cardW >= S.D.indexAt) {
        const index = ctx.util.el('nav', 'sp-index', body);
        const top = document.querySelector('body > header');
        index.style.top = Math.round((top ? top.getBoundingClientRect().height : 64) + 12) + 'px';
        for (const section of ctx.spec.sections) {
          const a = S.P.indexLink(ctx, index, section);
          a.addEventListener('click', (e) => {
            e.preventDefault();
            const h = S.els.secEls[section.id];
            const off = top ? top.getBoundingClientRect().bottom : 64;
            window.scrollTo({ top: Math.max(0, h.getBoundingClientRect().top + window.scrollY - off - 10), behavior: 'instant' });
          });
          S.els.navEls[section.id] = a;
        }
      }
    };
    BASE.panel = (ctx, body) => {
      const panel = ctx.util.el('div', 'sp-panel', body);
      if (!S.geo.long) panel.style.height = Math.round(40 + S.geo.rowH * env.taskDef.helpers.RESULT_CAP + 24) + 'px';
      return panel;
    };
  }

  function installControlParts(BASE, S) {
    BASE.section = (ctx, panel, section) => ctx.util.el('div', 'sp-sec', panel, section.title);
    BASE.row = (ctx, panel, setting, depth) => {
      const row = ctx.util.el('div', `sp-row${depth ? ' child' : ''}${depth > 1 ? ' child2' : ''}`, panel);
      row.style.minHeight = S.geo.rowH + 'px';
      return row;
    };
    BASE.label = (ctx, row, setting, section) => {
      const lab = ctx.util.el('div', 'lab', row);
      const b = ctx.util.el('b', '', lab, setting.label);
      const tag = ctx.util.el('span', 'tag', b, section.title);
      if (S.geo.showDesc && setting.description) ctx.util.el('small', '', lab, setting.description);
      return tag;
    };
    BASE.toggle = (ctx, row, setting) => {
      if (ctx.spec.control === 'switch') {
        const onoff = S.geo.showOnOff ? ctx.util.el('span', 'sp-onoff', row) : null;
        const ctl = ctx.util.el('button', 'sp-switch', row);
        ctl.type = 'button';
        ctl.setAttribute('role', 'switch');
        ctl.setAttribute('aria-label', setting.label);
        return { ctl, onoff };
      }
      const ctl = ctx.util.el('button', 'sp-check', row);
      ctl.type = 'button';
      ctl.setAttribute('role', 'checkbox');
      ctl.setAttribute('aria-label', setting.label);
      return { ctl };
    };
    BASE.option = (ctx, pop, value) => {
      const b = ctx.util.el('button', '', pop, value);
      b.type = 'button';
      b.setAttribute('role', 'option');
      return b;
    };
    BASE.select = (ctx, row, setting) => {
      const ctl = ctx.util.el('button', 'sp-select', row);
      ctl.type = 'button';
      ctl.setAttribute('aria-haspopup', 'listbox');
      const val = ctx.util.el('span', '', ctl);
      ctx.util.el('i', '', ctl, S.D.selectIcon);
      const pop = ctx.util.el('div', 'sp-pop', row);
      pop.setAttribute('role', 'listbox');
      const cols = setting.options.length > 6 ? 2 : 1;
      pop.style.gridTemplateColumns = `repeat(${cols}, auto)`;
      const opts = {};
      for (const value of setting.options) opts[value] = S.P.option(ctx, pop, value);
      return { ctl, val, pop, opts, popRows: Math.ceil(setting.options.length / cols) };
    };
    BASE.number = (ctx, row, setting) => {
      const box = ctx.util.el('div', 'sp-num', row);
      const minus = ctx.util.el('button', '', box, S.D.minusLabel);
      const ctl = ctx.util.el('input', '', box);
      const plus = ctx.util.el('button', '', box, S.D.plusLabel);
      ctx.util.el('span', '', box, setting.unit || '');
      minus.type = 'button';
      plus.type = 'button';
      minus.setAttribute('aria-label', `Decrease ${setting.label}`);
      plus.setAttribute('aria-label', `Increase ${setting.label}`);
      ctl.type = 'text';
      ctl.inputMode = 'numeric';
      ctl.setAttribute('aria-label', setting.label);
      return { ctl, minus, plus };
    };
    BASE.update = (ctx, model) => {
      ctx.update(model);
      S.P.paint(ctx.model);
    };
    BASE.bindRow = (ctx, id, rec) => {
      const { spec } = ctx;
      const fam = env.taskDef.helpers;
      const setting = spec.settings[id];
      if (setting.kind === 'toggle') {
        rec.ctl.addEventListener('click', () => S.P.update(ctx, fam.setValue(ctx.model, spec, id, !ctx.model.values[id])));
      } else if (setting.kind === 'select') {
        rec.ctl.addEventListener('click', () => S.P.update(ctx, fam.openSelect(ctx.model, id)));
        for (const [value, b] of Object.entries(rec.opts)) {
          b.addEventListener('click', () => S.P.update(ctx, fam.setValue(ctx.model, spec, id, value)));
        }
      } else {
        const step = fam.stepOf(setting);
        const bump = (d) => {
          const cur = Number(ctx.model.values[id]);
          const base = Number.isFinite(cur) && ctx.model.values[id] !== '' ? cur : setting.min;
          const value = Math.max(setting.min, Math.min(setting.max, base + d * step));
          S.P.update(ctx, fam.setValue(ctx.model, spec, id, value));
        };
        rec.minus.addEventListener('click', () => bump(-1));
        rec.plus.addEventListener('click', () => bump(1));
        rec.ctl.addEventListener('input', () => {
          const raw = rec.ctl.value.trim();
          const value = raw === '' ? '' : /^-?\d+(\.\d+)?$/.test(raw) ? Number(raw) : raw;
          S.P.update(ctx, fam.setValue(ctx.model, spec, id, value));
        });
      }
    };
    BASE.rows = (ctx, panel) => {
      S.els.resultsHead = ctx.util.el('div', 'sp-sec', panel, S.D.resultsLabel);
      for (const section of ctx.spec.sections) {
        S.els.secEls[section.id] = S.P.section(ctx, panel, section);
        for (const id of section.ids) {
          const setting = ctx.spec.settings[id];
          let depth = 0;
          for (let p = setting.parent; p; p = ctx.spec.settings[p].parent) depth++;
          const row = S.P.row(ctx, panel, setting, depth);
          const tag = S.P.label(ctx, row, setting, section);
          const control = setting.kind === 'toggle' ? S.P.toggle(ctx, row, setting)
            : setting.kind === 'select' ? S.P.select(ctx, row, setting) : S.P.number(ctx, row, setting);
          const rec = { row, tag, kind: setting.kind, ...control };
          S.P.bindRow(ctx, id, rec);
          S.els.rows[id] = rec;
        }
      }
      S.els.more = ctx.util.el('div', 'sp-more', panel);
      S.els.empty = ctx.util.el('div', 'sp-more', panel, S.D.emptyLabel);
    };
  }

  function installActionParts(BASE, S) {
    BASE.footer = (ctx, card) => {
      const foot = ctx.util.el('div', S.geo.long ? 'sp-bar' : 'sp-foot', card);
      const status = ctx.util.el('div', 'sp-status', foot);
      const discardBtn = S.P.button(ctx, foot, ctx.rng.pick(S.D.discardLabels), false);
      const saveBtn = S.els.headSave || S.P.button(ctx, foot, ctx.rng.pick(S.D.saveLabels), true);
      if (S.geo.long && ctx.spec.saveStyle === 'button') foot.className = 'sp-foot';
      if (S.geo.long) ctx.util.el('div', '', card).style.height = S.D.bottomSpace + 'px';
      return { foot, status, discardBtn, saveBtn };
    };
    BASE.bind = (ctx) => {
      const { spec } = ctx;
      const fam = env.taskDef.helpers;
      S.els.sInput.addEventListener('input', () => S.P.update(ctx, fam.setQuery(ctx.model, S.els.sInput.value)));
      S.els.saveBtn.addEventListener('click', () => {
        if (!fam.isDirty(ctx.model, spec)) return;
        if (spec.judge && spec.judge.mode === 'confirm') ctx.flag('irreversible');
        S.P.update(ctx, fam.save(ctx.model));
      });
      S.els.discardBtn.addEventListener('click', () => {
        if (!fam.isDirty(ctx.model, spec)) return;
        S.P.update(ctx, fam.discard(ctx.model));
      });
      S.els.card.addEventListener('pointerdown', (e) => {
        const m = ctx.model;
        if (!m.open) return;
        const r = S.els.rows[m.open];
        if (r && (r.pop.contains(e.target) || r.ctl.contains(e.target))) return;
        S.P.update(ctx, fam.openSelect(m, m.open));
      });
    };
    BASE.place = (ctx) => {
      if (S.geo.long) return;
      const ch = S.els.card.getBoundingClientRect().height;
      const room = Math.max(0, ctx.size.height - ch - 36);
      S.els.wrap.style.marginTop = Math.round(Math.min(room, ctx.rng.int(0, S.D.placementMax)) + 18 * (room > 0 ? 1 : 0)) + 'px';
    };
  }

  function installDisplayParts(BASE, S) {
    BASE.paintRow = (m, id, r, vis, q) => {
      r.row.style.display = vis.has(id) ? '' : 'none';
      r.tag.style.display = q ? '' : 'none';
      const v = m.values[id];
      if (r.kind === 'toggle') {
        r.ctl.classList.toggle('on', v === true);
        r.ctl.setAttribute('aria-checked', String(v === true));
        if (r.ctl.classList.contains('sp-check')) r.ctl.textContent = v === true ? S.D.checkLabel : '';
        if (r.onoff) r.onoff.textContent = v === true ? S.D.onLabel : S.D.offLabel;
      } else if (r.kind === 'select') {
        r.val.textContent = v;
        const open = m.open === id && vis.has(id);
        r.pop.style.display = open ? 'grid' : 'none';
        for (const [o, b] of Object.entries(r.opts)) b.classList.toggle('cur', o === v);
        if (open) {
          const popH = r.popRows * 32 + 12;
          const rr = r.row.getBoundingClientRect();
          const below = S.geo.long || rr.bottom + popH <= Math.min(window.innerHeight, S.els.card.getBoundingClientRect().bottom + 40) - 4;
          r.pop.style.top = below ? 'calc(100% - 4px)' : '';
          r.pop.style.bottom = below ? '' : 'calc(100% - 4px)';
        }
      } else if (document.activeElement !== r.ctl || (r.ctl.value.trim() !== String(v) && Number(r.ctl.value) !== v)) {
        if (r.ctl.value !== String(v)) r.ctl.value = String(v);
      }
    };
    BASE.paint = (m) => {
      const spec = S.ctx.spec;
      const fam = env.taskDef.helpers;
      const vis = new Set(fam.visibleIds(m, spec));
      const q = String(m.query || '').trim();
      if (S.els.sInput.value !== m.query && document.activeElement !== S.els.sInput) S.els.sInput.value = m.query;
      S.els.resultsHead.style.display = q ? '' : 'none';
      for (const section of spec.sections) {
        const any = section.ids.some((id) => vis.has(id));
        S.els.secEls[section.id].style.display = !q && any && (S.geo.long || section.id === m.tab) ? '' : 'none';
        if (S.els.tabEls[section.id]) S.els.tabEls[section.id].classList.toggle('on', !q && section.id === m.tab);
      }
      for (const [id, r] of Object.entries(S.els.rows)) S.P.paintRow(m, id, r, vis, q);
      const all = q ? spec.sections.flatMap((s) => s.ids).filter((id) => fam.matches(spec, id, q) && fam.isShown(m, spec, id)) : [];
      S.els.more.style.display = q && all.length > vis.size ? '' : 'none';
      S.els.more.textContent = S.D.moreLabel.replace('{shown}', vis.size).replace('{total}', all.length);
      S.els.empty.style.display = q && !vis.size ? '' : 'none';
      const dirty = fam.isDirty(m, spec);
      S.els.saveBtn.disabled = !dirty;
      S.els.discardBtn.disabled = !dirty;
      S.els.status.classList.toggle('dirty', dirty);
      S.els.status.textContent = dirty ? S.D.dirtyLabel : m.saves ? S.D.savedLabel : S.D.unchangedLabel;
      S.els.toast.classList.toggle('on', !!m.toast && !dirty);
      if (S.geo.long && spec.saveStyle === 'bar') S.els.foot.classList.toggle('on', dirty);
    };
    BASE.hits = (el, x, y) => {
      const e = document.elementFromPoint(x, y);
      return !!e && (e === el || el.contains(e));
    };
    BASE.pointOf = (el) => {
      const r = el.getBoundingClientRect();
      const H = window.innerHeight;
      const x = r.left + r.width / 2;
      const y = r.top + r.height / 2;
      if (y < 0 || y > H) return [x, y];
      for (const px of [x, r.left + Math.min(8, r.width / 3), r.right - Math.min(8, r.width / 3)]) if (S.P.hits(el, px, y)) return [px, y];
      return y < H / 2 ? [x, 40] : [x, H + 40];
    };
    BASE.locate = (t) => {
      if (!S.els) return null;
      if (t.search) return S.P.pointOf(S.els.sInput);
      if (t.save) return S.P.pointOf(S.els.saveBtn);
      if (t.discard) return S.P.pointOf(S.els.discardBtn);
      if (t.tab !== undefined) return S.els.tabEls[t.tab] && S.P.pointOf(S.els.tabEls[t.tab]);
      if (t.control !== undefined) return S.els.rows[t.control] && S.P.pointOf(S.els.rows[t.control].ctl);
      if (t.option) {
        const r = S.els.rows[t.option[0]];
        return r && r.opts[t.option[1]] && S.P.pointOf(r.opts[t.option[1]]);
      }
      if (t.step) {
        const r = S.els.rows[t.step[0]];
        return r && S.P.pointOf(t.step[1] > 0 ? r.plus : r.minus);
      }
      return null;
    };
    BASE.decorated = () => {};
    BASE.rendered = () => {};
  }

  env.template('change-settings/preferences', (design, def) => {
    let D, P;
    let ctxRef, geo;
    let els;
    const BASE = {};
    const S = {
      get ctx() { return ctxRef; },
      get spec() { return ctxRef && ctxRef.spec; },
      get geo() { return geo; },
      set geo(g) { geo = g; },
      get els() { return els; },
      get D() { return D; },
      get P() { return P; },
    };

    installFrameParts(BASE, S);
    installControlParts(BASE, S);
    installActionParts(BASE, S);
    installDisplayParts(BASE, S);

    ({ D, P } = env.templateDesign('change-settings/preferences', design, def, { tokens: TOKENS, base: BASE, state: S }));
    return {
      scrollable: (spec) => !!spec.scroll,
      render(ctx) {
        ctxRef = ctx;
        geo = { long: ctx.spec.layout === 'long' };
        els = { tabEls: {}, navEls: {}, secEls: {}, rows: {} };
        P.style(ctx);
        P.begin(ctx);
        els.wrap = P.wrap(ctx);
        geo.cardW = P.width(ctx);
        els.card = P.card(ctx, els.wrap);
        Object.assign(els, P.header(ctx, els.card));
        geo = P.geometry(ctx);
        els.body = P.body(ctx, els.card);
        P.navigation(ctx, els.body);
        els.panel = P.panel(ctx, els.body);
        P.rows(ctx, els.panel);
        Object.assign(els, P.footer(ctx, els.card));
        P.bind(ctx);
        P.decorated(ctx);
        P.place(ctx);
        P.paint(ctx.model);
        P.rendered(ctx);
        return { anchors: [els.head], sync: (m) => P.paint(m) };
      },
      locate(t) {
        const p = P.locate(t);
        if (!p) throw new Error(`change-settings/preferences cannot locate ${JSON.stringify(t)}`);
        return p;
      },
    };
  });
})();
