/*
 * mock-checkout / use-shop / storefront: a generic web store built around its checkout (frozen eval-only
 * replica, held out). Only the 'checkout' scenario: the other use-shop scenarios (search engine, tickets,
 * food delivery, flights) are different real-world patterns.
 *
 * Layout: a store frame (width, insets and alignment sampled from ctx.size) with a top bar (logo mark and
 * store name, a search field with an icon-only search button inside it, Shop / Orders / Track order text
 * links, a bag button with a count bubble). Each page has a title row; on cart, checkout and confirmation
 * pages it carries the step indicator "Cart > Shipping > Payment > Review" (Cart is clickable from the
 * checkout page), elsewhere a breadcrumb.
 *   shop      a filter toolbar above the list: category chips (toggle buttons) and a two-thumb price range
 *             (env.ui.slider); products as rows in a fixed pane with a thin overlay scrollbar (env.ui.listbox;
 *             spec.layout 'pane') or as a card grid that scrolls with the whole page (spec.layout 'page'; the
 *             widget is scrollable for those specs). Each product has a vertical quantity spinner (up/down
 *             arrows beside the number) and an Add button; sold-out products are disabled. On wide frames a
 *             "Your bag" mini cart column with Checkout and View bag. Skeleton rows while a search loads.
 *   product   "‹ Back to results" text link, an image block with inert thumbnails, details, a horizontal
 *             quantity stepper and Add to bag, delivery / returns notes.
 *   cart      a bag table (item, price, quantity pill, total; Remove link under the item name) beside an
 *             order-summary card: subtotal, discount, shipping and tax "calculated at checkout", total, the
 *             discount-code field + Apply, Checkout, inert express-pay buttons and trust notes.
 *   checkout  one page with numbered sections: shipping address as a radio list (saved addresses + "Ship to
 *             a new address", which reveals a 2x2 form), delivery method radio rows (inline option cards when
 *             space is short), an inert payment section (saved card, "Change") and inert express-pay buttons;
 *             the summary column (lines, subtotal, discount, shipping, tax note, total) holds Place order, or
 *             Place order sits under the sections (sampled).
 *   order     confirmation with a check mark, the order number, a details list, Continue shopping and a
 *             Cancel order link; cancel: reason radio cards + Cancel order / Keep order; track: order-number
 *             field + Track and a status timeline.
 * Fixed frames compact themselves (tighter rows, inline delivery options, fewer decorative blocks) until the
 * page fits; nothing is clipped. The whole widget renders from ctx.model; sync() repaints after kit-clock ticks
 * (search loading). The list pane mirrors its row pitch into model.pitch and text fields mirror focus into
 * model.focus, as the task plan expects. No widget-specific flags.
 */
(function () {
  'use strict';

  const CSS = `
  .rx-app { position: absolute; display: flex; flex-direction: column; overflow: hidden; background: var(--panel);
    border: 1px solid var(--line); border-radius: calc(var(--r) + 2px); box-shadow: 0 1px 2px rgba(0,0,0,.05); }
  .rx-app.flow { position: relative; overflow: visible; align-self: flex-start; flex: none; }
  .rx-app [hidden] { display: none !important; }
  .rx-top { flex: none; display: flex; align-items: center; gap: 18px; height: 54px; padding: 0 16px; border-bottom: 1px solid var(--line); }
  .rx-brand { display: flex; align-items: center; gap: 9px; font-family: var(--hfont); font-weight: 800; font-size: 17px; white-space: nowrap; cursor: default; }
  .rx-logo { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; background: var(--fg); color: var(--panel);
    font-size: 14px; font-weight: 900; border-radius: 50% 50% 50% 4px; }
  .rx-search { flex: 1; min-width: 140px; max-width: 420px; position: relative; display: flex; align-items: center; height: 36px;
    border: 1px solid color-mix(in srgb, var(--fg) 24%, var(--line)); border-radius: var(--r); background: var(--panel); }
  .rx-search:focus-within { border-color: var(--accent); box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 25%, transparent); }
  .rx-search input { flex: 1; min-width: 0; height: 100%; padding: 0 6px 0 12px; border: 0; outline: none; background: transparent; color: var(--fg);
    font: inherit; font-size: 14px; user-select: text; -webkit-user-select: text; }
  .rx-sbtn { flex: none; width: 36px; height: 34px; border: 0; border-left: 1px solid var(--line); background: var(--soft); color: var(--fg);
    border-radius: 0 var(--r) var(--r) 0; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0; }
  .rx-sbtn svg { width: 16px; height: 16px; }
  .rx-links { display: flex; align-items: center; gap: 4px; margin-left: auto; }
  .rx-nl { height: 32px; padding: 0 9px; border: 0; background: none; color: var(--fg); font: inherit; font-size: 13.5px; cursor: pointer;
    white-space: nowrap; text-decoration: none; border-bottom: 2px solid transparent; border-radius: 0; }
  .rx-nl:hover { text-decoration: underline; }
  .rx-nl.on { border-bottom-color: var(--accent); font-weight: 700; }
  .rx-bag { position: relative; display: flex; align-items: center; gap: 6px; height: 36px; padding: 0 8px; border: 0; background: none;
    color: var(--fg); font: inherit; font-size: 13.5px; font-weight: 600; cursor: pointer; white-space: nowrap; }
  .rx-bag svg { width: 22px; height: 22px; }
  .rx-bag.on { color: var(--accent); }
  .rx-count { position: absolute; left: 21px; top: 2px; min-width: 18px; height: 18px; padding: 0 4px; border-radius: 9px; background: var(--accent);
    color: var(--onaccent); font-size: 11px; font-weight: 800; line-height: 18px; text-align: center; }
  .rx-body { flex: 1; min-height: 0; position: relative; }
  .rx-app.flow .rx-body { flex: none; }
  .rx-page { position: absolute; inset: 0; display: flex; flex-direction: column; padding: 12px 20px 12px; overflow: hidden; }
  .rx-app.flow .rx-page { position: relative; inset: auto; overflow: visible; padding-bottom: 22px; }
  .rx-titlerow { flex: none; display: flex; align-items: center; gap: 16px; min-height: 30px; margin-bottom: 8px; }
  .rx-h { font-family: var(--hfont); font-size: 20px; font-weight: 750; white-space: nowrap; }
  .rx-steps { margin-left: auto; display: flex; align-items: center; gap: 6px; font-size: 12.5px; color: var(--muted); white-space: nowrap; }
  .rx-steps .st { display: inline-flex; align-items: center; gap: 5px; }
  .rx-steps .st i { width: 18px; height: 18px; border-radius: 50%; border: 1.5px solid currentColor; font-style: normal; font-size: 10.5px;
    font-weight: 800; display: inline-flex; align-items: center; justify-content: center; }
  .rx-steps .st.cur { color: var(--fg); font-weight: 700; }
  .rx-steps .st.cur i { background: var(--accent); border-color: var(--accent); color: var(--onaccent); }
  .rx-steps .st.done { color: var(--fg); }
  .rx-steps .st.link { cursor: pointer; text-decoration: underline; text-underline-offset: 2px; }
  .rx-steps .sep { color: var(--muted); }
  .rx-crumb { font-size: 12.5px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .rx-btn { height: 38px; padding: 0 18px; border-radius: var(--r); border: 1px solid color-mix(in srgb, var(--fg) 28%, var(--line));
    background: var(--panel); color: var(--fg); font: inherit; font-size: 14px; font-weight: 650; cursor: pointer; white-space: nowrap; }
  .rx-btn:hover { background: var(--soft); }
  .rx-btn.primary { background: var(--accent); border-color: var(--accent); color: var(--onaccent); }
  .rx-btn.primary:hover { filter: brightness(1.12); }
  .rx-btn:disabled { opacity: .4; cursor: default; filter: none; }
  .rx-btn.big { height: 46px; font-size: 15.5px; width: 100%; }
  .rx-link { border: 0; padding: 0; background: none; color: var(--fg); font: inherit; font-size: 13px; cursor: pointer; text-decoration: underline;
    text-underline-offset: 2px; white-space: nowrap; }
  .rx-link.danger { color: var(--bad); }
  .rx-link.acc { color: var(--accent); font-weight: 650; }
  .rx-banner { flex: none; display: flex; align-items: center; gap: 8px; padding: 6px 12px; margin-bottom: 8px; font-size: 13px;
    border: 1px dashed color-mix(in srgb, var(--accent) 60%, var(--line)); border-radius: var(--r); white-space: nowrap; overflow: hidden; }
  .rx-code { font-family: "DejaVu Sans Mono", "Liberation Mono", Menlo, monospace; font-weight: 700; letter-spacing: .04em;
    user-select: text; -webkit-user-select: text; }
  .rx-shop { flex: 1; min-height: 0; display: flex; gap: 18px; }
  .rx-main { flex: 1; min-width: 0; display: flex; flex-direction: column; }
  .rx-chips { flex: none; display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; }
  .rx-chip { height: 30px; padding: 0 13px; border-radius: 15px; border: 1px solid color-mix(in srgb, var(--fg) 25%, var(--line)); background: var(--panel);
    color: var(--fg); font: inherit; font-size: 13px; cursor: pointer; white-space: nowrap; }
  .rx-chip em { font-style: normal; color: var(--muted); margin-left: 5px; font-size: 12px; }
  .rx-chip[aria-checked=true] { background: var(--fg); border-color: var(--fg); color: var(--panel); }
  .rx-chip[aria-checked=true] em { color: inherit; opacity: .7; }
  .rx-chip.all { border-style: dashed; }
  .rx-tool { flex: none; display: flex; align-items: center; gap: 12px; height: 34px; margin-bottom: 8px; font-size: 13px; white-space: nowrap; }
  .rx-tool .lab { color: var(--muted); }
  .rx-range { position: relative; flex: none; width: 190px; height: 28px; cursor: pointer; touch-action: none; }
  .rx-rail, .rx-fill { position: absolute; top: 12px; height: 3px; pointer-events: none; }
  .rx-rail { left: 8px; right: 8px; background: color-mix(in srgb, var(--fg) 18%, var(--line)); }
  .rx-fill { background: var(--fg); }
  .rx-knob { position: absolute; top: 50%; width: 16px; height: 16px; margin: -8px 0 0 -8px; border-radius: 3px; background: var(--panel);
    border: 2px solid var(--fg); cursor: grab; touch-action: none; }
  .rx-rangeval { min-width: 104px; font-variant-numeric: tabular-nums; font-weight: 650; }
  .rx-count-t { margin-left: auto; color: var(--muted); overflow: hidden; text-overflow: ellipsis; }
  .rx-count-t b { color: var(--fg); }
  .rx-added { color: var(--ok); font-weight: 650; overflow: hidden; text-overflow: ellipsis; }
  .rx-pane { flex: none; position: relative; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
  .rx-list { height: 100%; overflow-y: auto; overscroll-behavior: contain; scrollbar-width: none; }
  .rx-list::-webkit-scrollbar { display: none; }
  .rx-track { position: absolute; right: 1px; top: 2px; bottom: 2px; width: 10px; cursor: pointer; touch-action: none; }
  .rx-thumb { position: absolute; left: 2px; right: 2px; border-radius: 4px; background: color-mix(in srgb, var(--fg) 32%, transparent); cursor: grab; }
  .rx-thumb:hover, .rx-thumb.drag { background: color-mix(in srgb, var(--fg) 55%, transparent); }
  .rx-track.idle { display: none; }
  .rx-row { display: flex; align-items: center; gap: 12px; padding: 0 18px 0 4px; }
  .rx-row + .rx-row { border-top: 1px solid var(--line); }
  .rx-img { flex: none; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: var(--r);
    background: hsl(var(--h) 45% 90%); color: hsl(var(--h) 45% 30%); font-weight: 800; font-size: 13px; letter-spacing: .03em; }
  html[data-rc-theme=dark] .rx-img { background: hsl(var(--h) 25% 26%); color: hsl(var(--h) 60% 82%); }
  .rx-info { flex: 1; min-width: 0; }
  .rx-name { display: block; max-width: 100%; color: var(--fg); font-weight: 650; font-size: 14px; cursor: pointer; white-space: nowrap; overflow: hidden;
    text-overflow: ellipsis; text-decoration: none; }
  .rx-name:hover { text-decoration: underline; }
  .rx-meta { font-size: 12px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .rx-stars { color: #c98a00; letter-spacing: -1px; }
  .rx-low { color: #c2560c; font-weight: 650; }
  .rx-out { color: var(--bad); font-weight: 650; }
  .rx-price { flex: none; min-width: 78px; text-align: right; font-weight: 750; font-size: 14.5px; font-variant-numeric: tabular-nums; white-space: nowrap; }
  .rx-was { display: block; font-size: 11.5px; font-weight: 400; color: var(--muted); text-decoration: line-through; }
  .rx-spin { flex: none; display: flex; align-items: stretch; height: 32px; border: 1px solid color-mix(in srgb, var(--fg) 25%, var(--line)); border-radius: var(--r); overflow: hidden; }
  .rx-spin .q { width: 30px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-variant-numeric: tabular-nums; font-size: 13.5px; }
  .rx-spin .arr { display: flex; flex-direction: column; border-left: 1px solid var(--line); }
  .rx-spin button { flex: 1; width: 22px; padding: 0; border: 0; background: var(--soft); color: var(--fg); font-size: 8px; line-height: 1; cursor: pointer; }
  .rx-spin button + button { border-top: 1px solid var(--line); }
  .rx-spin button:disabled { color: color-mix(in srgb, var(--fg) 25%, transparent); cursor: default; }
  .rx-add { flex: none; height: 32px; padding: 0 12px; font-size: 13px; }
  .rx-add.incart { box-shadow: inset 0 0 0 2px var(--ok); }
  .rx-grid { display: grid; grid-template-columns: repeat(var(--cols), minmax(0, 1fr)); gap: 16px 14px; }
  .rx-card { display: flex; flex-direction: column; gap: 5px; }
  .rx-card .rx-img { width: 100%; height: 110px; font-size: 26px; }
  .rx-card .rx-name { white-space: normal; height: 2.7em; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
  .rx-card .rx-price { text-align: left; }
  .rx-cardfoot { display: flex; align-items: center; gap: 8px; margin-top: 2px; }
  .rx-cardfoot .rx-add { flex: 1; }
  .rx-empty { margin: 36px auto; text-align: center; color: var(--muted); font-size: 14px; }
  .rx-skel { border-radius: var(--r); background: color-mix(in srgb, var(--fg) 8%, var(--panel)); }
  .rx-load { display: flex; flex-direction: column; }
  .rx-mini { flex: none; width: 236px; align-self: flex-start; display: flex; flex-direction: column; gap: 6px; padding: 12px 14px;
    background: var(--soft); border-radius: var(--r); }
  .rx-mini-h { font-weight: 750; font-size: 14px; }
  .rx-mini-l { display: flex; justify-content: space-between; gap: 8px; font-size: 12.5px; }
  .rx-mini-l span:first-child { min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .rx-mini-e { font-size: 12.5px; color: var(--muted); }
  .rx-back { align-self: flex-start; display: inline-flex; align-items: center; gap: 4px; font-size: 13.5px; }
  .rx-detail { flex: 1; min-height: 0; display: flex; gap: 26px; margin-top: 10px; }
  .rx-gal { flex: none; display: flex; flex-direction: column; gap: 8px; }
  .rx-hero { border-radius: var(--r); display: flex; align-items: center; justify-content: center; font-size: 52px; font-weight: 800;
    background: hsl(var(--h) 45% 90%); color: hsl(var(--h) 45% 30%); }
  html[data-rc-theme=dark] .rx-hero { background: hsl(var(--h) 25% 26%); color: hsl(var(--h) 60% 82%); }
  .rx-thumbs { display: flex; gap: 8px; }
  .rx-thumbs span { width: 44px; height: 44px; border-radius: var(--r); border: 1px solid var(--line); background: hsl(var(--h) 30% 94%); cursor: pointer; }
  html[data-rc-theme=dark] .rx-thumbs span { background: hsl(var(--h) 20% 22%); }
  .rx-dinfo { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
  .rx-kick { font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: .07em; }
  .rx-h1 { font-family: var(--hfont); font-size: 21px; font-weight: 750; line-height: 1.25; }
  .rx-dprice { font-size: 22px; font-weight: 800; font-variant-numeric: tabular-nums; }
  .rx-dprice .rx-was { display: inline; margin-left: 10px; font-size: 14px; }
  .rx-desc { font-size: 13.5px; line-height: 1.5; color: var(--muted); overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; }
  .rx-buy { display: flex; align-items: center; gap: 12px; margin-top: 4px; }
  .rx-buy .rx-btn { flex: 1; max-width: 300px; height: 44px; }
  .rx-pill { flex: none; display: flex; align-items: center; height: 36px; border: 1px solid color-mix(in srgb, var(--fg) 25%, var(--line)); border-radius: 18px; }
  .rx-pill button { width: 32px; height: 34px; border: 0; background: none; color: var(--fg); font: inherit; font-size: 17px; cursor: pointer; padding: 0; }
  .rx-pill button:disabled { color: color-mix(in srgb, var(--fg) 25%, transparent); cursor: default; }
  .rx-pill .q { min-width: 22px; text-align: center; font-weight: 700; font-variant-numeric: tabular-nums; }
  .rx-pill.sm { height: 30px; }
  .rx-pill.sm button { width: 28px; height: 28px; font-size: 15px; }
  .rx-ok { color: var(--ok); font-weight: 650; font-size: 13px; min-height: 19px; }
  .rx-notes { font-size: 12.5px; color: var(--muted); display: flex; flex-direction: column; gap: 2px; }
  .rx-two { flex: 1; min-height: 0; display: flex; gap: 22px; }
  .rx-col { flex: 1; min-width: 0; display: flex; flex-direction: column; min-height: 0; }
  .rx-thead { flex: none; display: flex; gap: 12px; padding: 0 2px 6px; border-bottom: 1px solid var(--fg); font-size: 11.5px; font-weight: 750;
    text-transform: uppercase; letter-spacing: .06em; color: var(--muted); }
  .rx-thead .c1 { flex: 1; }
  .rx-thead .c2 { width: 80px; text-align: right; }
  .rx-thead .c3 { width: 96px; text-align: center; }
  .rx-thead .c4 { width: 84px; text-align: right; }
  .rx-lines { flex: 1; min-height: 0; overflow-y: auto; scrollbar-width: thin; }
  .rx-line { display: flex; align-items: center; gap: 12px; padding: 10px 2px; border-bottom: 1px solid var(--line); }
  .rx-line .rx-img { width: 48px; height: 48px; }
  .rx-line .rx-info .rx-link { margin-top: 3px; font-size: 12.5px; }
  .rx-line .c2 { width: 80px; text-align: right; font-variant-numeric: tabular-nums; font-size: 13.5px; }
  .rx-line .c3 { width: 96px; display: flex; justify-content: center; }
  .rx-line .c4 { width: 84px; text-align: right; font-weight: 750; font-variant-numeric: tabular-nums; }
  .rx-side { flex: none; width: 292px; align-self: flex-start; display: flex; flex-direction: column; gap: 6px; padding: 14px 16px;
    border: 1px solid var(--line); border-radius: var(--r); background: var(--soft); }
  .rx-side-h { font-family: var(--hfont); font-weight: 750; font-size: 15.5px; margin-bottom: 2px; }
  .rx-sum { display: flex; justify-content: space-between; gap: 10px; font-size: 13.5px; font-variant-numeric: tabular-nums; }
  .rx-sum span:first-child { color: var(--muted); }
  .rx-sum span:last-child { white-space: nowrap; }
  .rx-sum.total { padding-top: 7px; margin-top: 2px; border-top: 1px solid var(--line); font-size: 16px; font-weight: 800; }
  .rx-sum.total span:first-child { color: var(--fg); }
  .rx-sum.disc span { color: var(--ok); }
  .rx-sum .note { font-size: 12px; color: var(--muted); }
  .rx-mlines { display: flex; flex-direction: column; gap: 6px; max-height: 120px; overflow-y: auto; padding-bottom: 6px; border-bottom: 1px solid var(--line); }
  .rx-ml { display: flex; align-items: center; gap: 9px; font-size: 13px; }
  .rx-ml .rx-img { position: relative; width: 36px; height: 36px; font-size: 11px; }
  .rx-ml .rx-img b { position: absolute; right: -6px; top: -6px; min-width: 17px; height: 17px; border-radius: 9px; background: var(--muted); color: var(--panel);
    font-size: 10.5px; line-height: 17px; text-align: center; }
  .rx-ml span { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .rx-ml em { font-style: normal; font-variant-numeric: tabular-nums; white-space: nowrap; }
  .rx-lab { font-size: 12px; font-weight: 650; color: var(--muted); margin-top: 4px; }
  .rx-promo { display: flex; gap: 6px; }
  .rx-input { flex: 1; min-width: 0; height: 38px; padding: 0 11px; border-radius: var(--r); border: 1px solid color-mix(in srgb, var(--fg) 26%, var(--line));
    background: var(--panel); color: var(--fg); font: inherit; font-size: 14px; outline: none; user-select: text; -webkit-user-select: text; }
  .rx-input:focus { border-color: var(--accent); box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 22%, transparent); }
  .rx-input.bad { border-color: var(--bad); }
  .rx-msg { font-size: 12.5px; min-height: 17px; }
  .rx-msg.good { color: var(--ok); }
  .rx-msg.bad { color: var(--bad); }
  .rx-express { display: flex; flex-direction: column; gap: 6px; }
  .rx-express .or { display: flex; align-items: center; gap: 8px; font-size: 11.5px; color: var(--muted); text-transform: uppercase; letter-spacing: .08em; }
  .rx-express .or::before, .rx-express .or::after { content: ""; flex: 1; height: 1px; background: var(--line); }
  .rx-xrow { display: flex; gap: 6px; }
  .rx-xbtn { flex: 1; height: 34px; border-radius: var(--r); border: 1px solid color-mix(in srgb, var(--fg) 30%, var(--line)); background: var(--panel);
    color: var(--fg); font: inherit; font-size: 13px; font-weight: 750; font-style: italic; cursor: pointer; white-space: nowrap; }
  .rx-xbtn.dark { background: var(--fg); color: var(--panel); border-color: var(--fg); }
  .rx-trust { display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 12px; color: var(--muted); text-align: center; }
  .rx-trust svg { width: 12px; height: 12px; flex: none; }
  .rx-sec { display: flex; align-items: center; gap: 9px; font-family: var(--hfont); font-size: 15px; font-weight: 750; margin: 0 0 6px; }
  .rx-sec i { width: 22px; height: 22px; border-radius: 50%; background: var(--fg); color: var(--panel); font-style: normal; font-size: 12px;
    display: inline-flex; align-items: center; justify-content: center; font-family: var(--font); }
  .rx-block { flex: none; margin-bottom: 14px; }
  .rx-radios { display: flex; flex-direction: column; border: 1px solid var(--line); border-radius: var(--r); overflow: hidden; }
  .rx-radio { display: flex; align-items: center; gap: 10px; min-height: 34px; padding: 4px 12px; font-size: 13.5px; cursor: pointer; }
  .rx-radio + .rx-radio { border-top: 1px solid var(--line); }
  .rx-radio input { flex: none; width: 16px; height: 16px; margin: 0; accent-color: var(--accent); cursor: pointer; }
  .rx-radio .t { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .rx-radio .t b { font-weight: 700; }
  .rx-radio .t small { color: var(--muted); font-size: 12px; margin-left: 6px; }
  .rx-radio .p { flex: none; font-weight: 700; font-variant-numeric: tabular-nums; }
  .rx-radio:has(input:checked) { background: color-mix(in srgb, var(--accent) 8%, var(--panel)); }
  .rx-inline { display: grid; grid-template-columns: repeat(var(--n), minmax(0, 1fr)); gap: 8px; }
  .rx-opt { display: flex; align-items: flex-start; gap: 8px; padding: 6px 10px; border: 1px solid var(--line); border-radius: var(--r); cursor: pointer;
    font-size: 12.5px; line-height: 1.3; min-width: 0; }
  .rx-opt input { flex: none; margin: 1px 0 0; width: 15px; height: 15px; accent-color: var(--accent); }
  .rx-opt span { min-width: 0; overflow: hidden; }
  .rx-opt b { display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 13px; }
  .rx-opt:has(input:checked) { border-color: var(--accent); box-shadow: inset 0 0 0 1px var(--accent); }
  .rx-form { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 12px; margin-top: 8px; }
  .rx-fl { display: flex; flex-direction: column; gap: 2px; font-size: 12px; color: var(--muted); position: relative; }
  .rx-fl i { position: absolute; right: 8px; top: 25px; font-style: normal; font-size: 11.5px; color: var(--bad); pointer-events: none; }
  .rx-fl .rx-input { height: 36px; }
  .rx-pay { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border: 1px solid var(--line); border-radius: var(--r); font-size: 13.5px; }
  .rx-card-ic { flex: none; width: 34px; height: 22px; border-radius: 4px; background: linear-gradient(135deg, var(--muted), var(--fg)); }
  .rx-pay .t { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .rx-pay .t small { color: var(--muted); margin-left: 6px; }
  .rx-blocked { font-size: 12.5px; color: var(--bad); min-height: 0; }
  .rx-main-place { margin-top: 2px; max-width: 360px; }
  .rx-tight .rx-block { margin-bottom: 8px; }
  .rx-tight .rx-radio { min-height: 29px; padding: 2px 10px; }
  .rx-tight .rx-sec { margin-bottom: 4px; font-size: 14px; }
  .rx-tight .rx-form { gap: 3px 10px; margin-top: 5px; }
  .rx-tight .rx-fl .rx-input { height: 32px; }
  .rx-tight .rx-fl i { top: 22px; }
  .rx-tight .rx-side { gap: 4px; padding: 10px 14px; }
  .rx-tight .rx-btn.big { height: 40px; }
  .rx-tight .rx-line { padding: 6px 2px; }
  .rx-conf { display: flex; align-items: center; gap: 14px; }
  .rx-tick { width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid var(--ok); color: var(--ok); font-size: 24px; }
  .rx-tick svg { width: 22px; height: 22px; }
  .rx-tick.off { border-color: var(--bad); color: var(--bad); }
  .rx-no { font-family: "DejaVu Sans Mono", "Liberation Mono", Menlo, monospace; font-weight: 800; color: var(--fg); user-select: text; -webkit-user-select: text; }
  .rx-facts { display: grid; grid-template-columns: 120px minmax(0, 1fr); gap: 7px 14px; margin: 14px 0; max-width: 660px; font-size: 13.5px;
    padding: 12px 14px; border: 1px solid var(--line); border-radius: var(--r); }
  .rx-facts dt { color: var(--muted); }
  .rx-facts dd { margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .rx-acts { display: flex; align-items: center; gap: 16px; }
  .rx-reasons { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; max-width: 640px; }
  .rx-reason { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border: 1px solid var(--line); border-radius: var(--r); font-size: 13.5px; cursor: pointer; }
  .rx-reason input { margin: 0; width: 16px; height: 16px; accent-color: var(--accent); }
  .rx-reason:has(input:checked) { border-color: var(--accent); }
  .rx-trackrow { display: flex; gap: 8px; max-width: 460px; margin: 12px 0 14px; }
  .rx-result { max-width: 560px; padding: 14px 16px; border: 1px solid var(--line); border-radius: var(--r); font-size: 13.5px; }
  .rx-result.bad { color: var(--bad); border-color: var(--bad); }
  .rx-timeline { display: flex; gap: 0; margin-top: 12px; }
  .rx-timeline span { flex: 1; position: relative; padding-top: 16px; font-size: 12px; color: var(--muted); }
  .rx-timeline span::before { content: ""; position: absolute; left: 0; right: 0; top: 5px; height: 3px; background: var(--line); }
  .rx-timeline span::after { content: ""; position: absolute; left: 0; top: 0; width: 13px; height: 13px; border-radius: 50%; background: var(--line); }
  .rx-timeline span.on { color: var(--fg); font-weight: 650; }
  .rx-timeline span.on::before, .rx-timeline span.on::after { background: var(--ok); }
  .rx-muted { color: var(--muted); font-size: 13.5px; }
  `;

  const ICON = {
    search: '<svg viewBox="0 0 16 16"><circle cx="7" cy="7" r="4.6" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M10.5 10.5L14 14" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    bag: '<svg viewBox="0 0 24 24"><path d="M5 8h14l-1 12H6z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>',
    check: '<svg viewBox="0 0 16 16"><path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    lock: '<svg viewBox="0 0 16 16"><path d="M4.5 7V5a3.5 3.5 0 0 1 7 0v2" fill="none" stroke="currentColor" stroke-width="1.6"/><rect x="2.5" y="7" width="11" height="7.5" rx="1.6" fill="currentColor"/></svg>',
  };
  const EXPRESS = [['Express Pay', ''], ['Wallet', 'dark'], ['Pay in 4', ''], ['QuickBuy', 'dark']];

  function ensureStyle() {
    if (document.getElementById('rx-style')) return;
    const s = document.createElement('style');
    s.id = 'rx-style';
    s.textContent = CSS;
    document.head.append(s);
  }

  const F = () => env.taskDef.helpers;
  let st = null;
  function where(el, what) {
    if (!el || !el.isConnected || el.closest('[hidden]')) throw new Error(`use-shop/storefront: ${what} is not shown`);
    const r = el.getBoundingClientRect();
    if (!r.width && !r.height) throw new Error(`use-shop/storefront: ${what} has no box`);
    return [r.left + r.width / 2, r.top + r.height / 2];
  }
  const btn = (util, cls, parent, text, role) => {
    const b = util.el('button', cls, parent, text);
    b.type = 'button';
    if (role) b.dataset.role = role;
    return b;
  };
  const initials = (name) => name.replace(/[^A-Za-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');

  // Width the stage can take on scrolling pages (the stage is shrink-to-fit in its row there).
  function stageWidth(ctx) {
    const stage = ctx.stage;
    const row = stage.parentElement;
    if (!row) return ctx.size.width;
    let w = row.getBoundingClientRect().width;
    for (const c of row.children) {
      if (c === stage) continue;
      const cs = getComputedStyle(c);
      if (cs.position === 'fixed' || cs.position === 'absolute' || cs.display === 'none') continue;
      w -= c.getBoundingClientRect().width + parseFloat(cs.marginLeft) + parseFloat(cs.marginRight);
    }
    return Math.max(ctx.size.width, Math.floor(w));
  }

  function trackFocus(ctx, input, name) {
    input.addEventListener('focus', () => { if (ctx.model.focus !== name) ctx.update({ ...ctx.model, focus: name }); });
    input.addEventListener('blur', () => { if (ctx.model.focus === name) ctx.update({ ...ctx.model, focus: null }); });
  }

  // ---------------------------------------------------------------- the store

  function build(ctx, flow) {
    const { util, spec } = ctx;
    const fam = F();
    const R = ctx.rng.fork('look');
    const fmt = (c) => fam.fmtMoney(c, spec.money);
    const whole = (c) => fam.fmtMoney(c, spec.money).replace(/([.,])00(?!\d)/, '');
    const commit = (m) => { ctx.update(m); paint(ctx.model); };
    const step = (s) => commit(fam.apply(ctx.model, spec, s));
    const P = (id) => spec.products[id];
    const decoy = (el, what) => el.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what }); });
    const look = {
      bagWord: R.pick(['Bag', 'Cart', '']),
      placeSide: R.bool(0.65),
      addLabel: R.pick(['Add', 'Add to bag', 'Add to cart']),
      checkoutLabel: R.pick(['Checkout', 'Proceed to checkout', 'Continue to checkout']),
      placeLabel: R.pick(['Place order', 'Place your order', 'Complete order', 'Pay now']),
      express: R.bool(0.7),
      taxNote: spec.money && spec.money.code === 'USD' ? 'Calculated at checkout' : 'Included',
      card: `${R.int(1000, 9999)}`.slice(-4),
      exp: `${String(R.int(1, 12)).padStart(2, '0')}/${R.int(27, 31)}`,
      maxW: R.pick([0, 0, 1240, 1120]),
      align: R.pick(['left', 'center', 'center', 'right']),
      padX: R.int(6, 18),
      padY: R.int(4, 12),
      rows: R.pick(['rows', 'rows']),
    };

    // ---- frame
    const W = flow ? stageWidth(ctx) : ctx.size.width;
    const H = ctx.size.height;
    let width = W - 2 * look.padX;
    if (look.maxW && width > look.maxW + 40) width = look.maxW;
    const left = look.align === 'left' ? look.padX : look.align === 'right' ? W - look.padX - width : Math.round((W - width) / 2);
    let reserve = 0;
    const sub = env.submitEl;
    if (sub && getComputedStyle(sub).position === 'fixed') {
      const a = sub.getBoundingClientRect();
      const s = ctx.stage.getBoundingClientRect();
      if (a.top < s.bottom && a.bottom > s.top) reserve = Math.max(0, Math.ceil(s.bottom - a.top) + 6 - look.padY);
    }
    const app = util.el('div', 'rx-app' + (flow ? ' flow' : ''), ctx.stage);
    app.dataset.role = 'app';
    if (flow) {
      Object.assign(app.style, { width: width + 'px', marginLeft: left + 'px', marginRight: 'auto', marginTop: look.padY + 'px',
        marginBottom: look.padY + (reserve ? reserve + 40 : 0) + 'px', minHeight: H - 2 * look.padY + 'px' });
    } else {
      Object.assign(app.style, { left: left + 'px', width: width + 'px', top: look.padY + 'px', bottom: look.padY + reserve + 'px' });
    }

    // ---- top bar
    const top = util.el('div', 'rx-top', app);
    const brand = util.el('div', 'rx-brand', top);
    util.el('span', 'rx-logo', brand, spec.store[0].toUpperCase());
    util.el('span', '', brand, spec.store);
    const sbox = util.el('div', 'rx-search', top);
    const sinput = util.el('input', '', sbox);
    Object.assign(sinput, { type: 'text', autocomplete: 'off', spellcheck: false,
      placeholder: R.pick(['Search products', `Search ${spec.store}`, 'What are you looking for?', 'Search']) });
    sinput.dataset.role = 'search-field';
    const sgo = btn(util, 'rx-sbtn', sbox, undefined, 'search-button');
    sgo.innerHTML = ICON.search;
    sgo.setAttribute('aria-label', 'Search');
    sgo.title = 'Search';
    const stf = env.ui.textField(sinput, { value: ctx.model.text, label: 'search', onInput: (v) => commit({ ...ctx.model, text: v }) });
    trackFocus(ctx, sinput, 'search');
    sgo.addEventListener('click', () => step({ click: { button: 'search' } }));
    sinput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        step({ key: 'Enter', on: 'search' });
      }
    });
    const links = util.el('div', 'rx-links', top);
    const navEls = {};
    for (const [k, label] of [['shop', R.pick(['Shop', 'Shop all', 'Products'])], ['order', R.pick(['Orders', 'My orders', 'Your orders'])],
      ['track', R.pick(['Track order', 'Order status', 'Track a package'])]]) {
      navEls[k] = btn(util, 'rx-nl', links, label, 'nav');
      navEls[k].addEventListener('click', () => step({ click: { nav: k } }));
    }
    const bag = btn(util, 'rx-bag', top, undefined, 'cart');
    bag.innerHTML = ICON.bag;
    if (look.bagWord) util.el('span', '', bag, look.bagWord);
    bag.setAttribute('aria-label', look.bagWord || 'Bag');
    const count = util.el('span', 'rx-count', bag);
    bag.addEventListener('click', () => step({ click: { nav: 'cart' } }));
    navEls.cart = bag;

    const body = util.el('div', 'rx-body', app);
    const pageEl = util.el('div', 'rx-page', body);
    if (flow) pageEl.style.minHeight = Math.max(0, H - 80) + 'px';
    let curPage = null;
    let view = null;
    let lastPainted = null;

    // ---- shared pieces
    const stars = (p) => {
      const n = Math.round(p.rating / 10);
      return '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n);
    };
    const stockText = (p) => (!p.stock ? ['rx-out', 'Sold out'] : p.stock <= 5 ? ['rx-low', `Only ${p.stock} left`] : ['', 'In stock']);
    const img = (parent, p, cls = 'rx-img') => {
      const t = util.el('div', cls, parent, initials(p.name));
      t.style.setProperty('--h', p.hue);
      return t;
    };
    // Vertical spinner: number with up/down arrows beside it.
    const spinner = (parent, value, max, onDown, onUp, role) => {
      const s = util.el('div', 'rx-spin', parent);
      const q = util.el('span', 'q', s, String(value));
      const arr = util.el('div', 'arr', s);
      const up = btn(util, '', arr, '▲', `${role}-up`);
      const dn = btn(util, '', arr, '▼', `${role}-down`);
      up.setAttribute('aria-label', 'Increase quantity');
      dn.setAttribute('aria-label', 'Decrease quantity');
      dn.addEventListener('click', () => { if (!dn.disabled) onDown(); });
      up.addEventListener('click', () => { if (!up.disabled) onUp(); });
      const set = (v, mx) => {
        q.textContent = String(v);
        dn.disabled = v <= 1;
        up.disabled = v >= mx;
      };
      set(value, max);
      return { dn, up, q, set };
    };
    // Horizontal pill stepper: − n +.
    const pill = (parent, value, onDown, onUp, role, small) => {
      const s = util.el('div', 'rx-pill' + (small ? ' sm' : ''), parent);
      const dn = btn(util, '', s, '−', `${role}-down`);
      const q = util.el('span', 'q', s, String(value));
      const up = btn(util, '', s, '+', `${role}-up`);
      dn.addEventListener('click', () => { if (!dn.disabled) onDown(); });
      up.addEventListener('click', () => { if (!up.disabled) onUp(); });
      return { dn, up, q, set(v, mx, lo = 1) { q.textContent = String(v); dn.disabled = v <= lo; up.disabled = v >= mx; } };
    };
    const STEP_NAMES = ['Cart', 'Shipping', 'Payment', 'Review'];
    function titleRow(text, stepAt, crumb) {
      const row = util.el('div', 'rx-titlerow', pageEl);
      util.el('div', 'rx-h', row, text);
      if (stepAt !== undefined && stepAt !== null) {
        const s = util.el('div', 'rx-steps', row);
        s.dataset.role = 'steps';
        STEP_NAMES.forEach((n, i) => {
          if (i) util.el('span', 'sep', s, '›');
          const cur = Array.isArray(stepAt) ? stepAt.includes(i) : i === stepAt;
          const done = Array.isArray(stepAt) ? i < stepAt[0] : i < stepAt;
          const it = util.el('span', 'st' + (cur ? ' cur' : done ? ' done' : ''), s);
          util.el('i', '', it, done ? '✓' : String(i + 1));
          util.el('span', '', it, n);
          if (i === 0 && Array.isArray(stepAt)) {
            it.classList.add('link');
            it.dataset.role = 'step-cart';
            it.addEventListener('click', () => step({ click: { nav: 'cart' } }));
          } else decoy(it, 'step');
        });
      } else if (crumb) util.el('div', 'rx-crumb', row, crumb).style.marginLeft = 'auto';
      return row;
    }
    function expressRow(parent, r) {
      const x = util.el('div', 'rx-express', parent);
      const row = util.el('div', 'rx-xrow', x);
      for (const [name, cls] of r.sample(EXPRESS, 2 + (r.bool(0.4) ? 1 : 0))) {
        const b = btn(util, 'rx-xbtn ' + cls, row, name, 'express-pay');
        decoy(b, 'express-pay');
      }
      return x;
    }
    function trust(parent, r) {
      const t = util.el('div', 'rx-trust', parent);
      t.innerHTML = ICON.lock;
      util.el('span', '', t, r.pick(['Secure checkout · Free returns within 30 days', 'Encrypted payment · 30-day returns',
        'Safe and secure payments', 'Free returns · 2-year warranty']));
      return t;
    }
    function totals(parent, t, mm, withShip) {
      const row = (cls, a, b) => {
        const d = util.el('div', 'rx-sum' + cls, parent);
        util.el('span', '', d, a);
        util.el('span', '', d, b);
        return d;
      };
      row('', 'Subtotal', fmt(t.sub));
      if (t.disc) row(' disc', `Discount (${mm.coupon})`, `−${fmt(t.disc)}`);
      if (withShip) row('', 'Shipping', t.shipping ? fmt(t.shipping) : 'Free');
      else util.el('span', 'note', row('', 'Shipping', ''), 'Calculated at next step').previousSibling.remove();
      const tax = row('', look.taxNote === 'Included' ? 'Taxes' : 'Estimated tax', '');
      tax.lastChild.textContent = look.taxNote === 'Included' ? 'Included' : withShip ? 'Added after review' : 'Calculated at checkout';
      tax.lastChild.className = 'note';
      row(' total', 'Total', fmt(t.total));
    }
    // Fixed frames: add 'rx-tight' (and hide decorative blocks) until the page content fits.
    function fit(extra = []) {
      if (flow) return;
      const over = () => pageEl.scrollHeight > pageEl.clientHeight + 1 || [...pageEl.querySelectorAll('[data-fit]')].some((el) => el.scrollHeight > el.clientHeight + 1);
      if (!over()) return;
      pageEl.classList.add('rx-tight');
      for (const el of extra) {
        if (!over()) return;
        el.hidden = true;
      }
    }

    // ---- shop page
    function shopPage(m) {
      const r = ctx.rng.fork('page/shop');
      titleRow(m.query ? 'Search results' : r.pick(['Shop all', 'All products', 'Shop']), null, `Home › ${m.query ? `Search: “${m.query}”` : 'Shop'}`);
      if (spec.coupon && spec.coupon.where === 'banner') {
        const b = util.el('div', 'rx-banner', pageEl);
        b.dataset.role = 'promo';
        b.append(r.pick(['This week only:', 'Members save more:', 'Limited time:']) + ' use code ');
        util.el('span', 'rx-code', b, spec.coupon.code);
        b.append(` for ${spec.coupon.pct}% off at checkout.`);
      }
      const shop = util.el('div', 'rx-shop', pageEl);
      const main = util.el('div', 'rx-main', shop);
      const appW = app.getBoundingClientRect().width;
      const mini = appW >= 1060 ? util.el('aside', 'rx-mini', shop) : null;
      const chips = util.el('div', 'rx-chips', main);
      chips.dataset.role = 'categories';
      const chipEls = spec.cats.map((label, ci) => {
        const c = btn(util, 'rx-chip', chips, label, 'category');
        c.setAttribute('role', 'checkbox');
        util.el('em', '', c, String(spec.products.filter((p) => p.cat === ci).length));
        return [ci, c];
      });
      const chipOf = Object.fromEntries(chipEls.map(([ci, c]) => [ci, c]));
      const cats = env.ui.choices(chipEls, { multi: true, values: m.cats, label: 'category', onChange: (vals, v) => step({ click: { cat: v } }) });
      const tool = util.el('div', 'rx-tool', main);
      util.el('span', 'lab', tool, 'Price');
      const range = util.el('div', 'rx-range', tool);
      range.dataset.role = 'price-range';
      util.el('div', 'rx-rail', range);
      const fill = util.el('div', 'rx-fill', range);
      const knobs = [0, 1].map((j) => {
        const k = util.el('div', 'rx-knob', range);
        k.dataset.role = j ? 'price-max' : 'price-min';
        return k;
      });
      const rv = util.el('span', 'rx-rangeval', tool);
      const added = util.el('span', 'rx-added', tool);
      const countT = util.el('span', 'rx-count-t', tool);
      const inset = 8;
      const frac = (v) => v / spec.sliderMax;
      const drawRange = (vals) => {
        const w = range.getBoundingClientRect().width - 2 * inset;
        Object.assign(fill.style, { left: inset + frac(vals[0]) * w + 'px', width: (frac(vals[1]) - frac(vals[0])) * w + 'px' });
        rv.textContent = `${whole(vals[0])} – ${whole(vals[1])}${vals[1] >= spec.sliderMax ? '+' : ''}`;
      };
      const slider = env.ui.slider(range, {
        label: 'price', thumbs: knobs, values: m.price.slice(), min: 0, max: spec.sliderMax, step: spec.sliderStep, inset,
        collision: 'block', keyboard: true,
        place(t, point, f) { t.style.left = inset + f * (range.getBoundingClientRect().width - 2 * inset) + 'px'; },
        onInput(vals) {
          drawRange(vals);
          commit({ ...ctx.model, price: vals.slice(), scroll: 0 });
        },
        onChange(vals) {
          if (vals[0] !== ctx.model.price[0] || vals[1] !== ctx.model.price[1]) commit({ ...ctx.model, price: vals.slice(), scroll: 0 });
        },
      });
      const items = {};
      let pane = null;
      let area = null;
      let pitch = 0;
      if (!flow) {
        pane = util.el('div', 'rx-pane', main);
        const top0 = pane.getBoundingClientRect().top;
        const bottom = pageEl.getBoundingClientRect().bottom - 12;
        pitch = Math.max(46, Math.min(r.int(62, 76), Math.floor((bottom - top0 - 2) / spec.rows)));
        pane.style.height = spec.rows * pitch + 2 + 'px';
        if (ctx.model.pitch !== pitch) ctx.update({ ...ctx.model, pitch });
      } else area = util.el('div', '', main);
      const mainW = main.getBoundingClientRect().width;
      const cols = Math.max(2, Math.min(5, Math.floor((mainW + 14) / 196)));
      let built = null;
      let lbx = null;

      function item(id, card) {
        const p = P(id);
        const el = util.el('div', card ? 'rx-card' : 'rx-row');
        el.dataset.role = 'product';
        img(el, p);
        const info = util.el('div', 'rx-info', el);
        const name = util.el('a', 'rx-name', info, p.name);
        name.title = p.name;
        name.dataset.role = 'product-link';
        name.addEventListener('click', () => step({ click: { open: id } }));
        const meta = util.el('div', 'rx-meta', info);
        util.el('span', 'rx-stars', meta, stars(p));
        meta.append(` ${(p.rating / 10).toFixed(1)} (${p.reviews}) · `);
        const [cls, txt] = stockText(p);
        util.el('span', cls, meta, txt);
        const pr = util.el('div', 'rx-price', card ? info : el, fmt(p.price));
        if (p.was) util.el('span', 'rx-was', pr, fmt(p.was));
        const foot = card ? util.el('div', 'rx-cardfoot', el) : el;
        const q = spinner(foot, fam.coQty(ctx.model, id), fam.coMaxQty(p),
          () => step({ click: { cardQty: id, dir: 'down' } }), () => step({ click: { cardQty: id, dir: 'up' } }), 'qty');
        const add = btn(util, 'rx-btn primary rx-add', foot, p.stock ? look.addLabel : 'Sold out', 'add');
        add.disabled = !p.stock;
        if (!p.stock) q.dn.disabled = q.up.disabled = true;
        add.addEventListener('click', () => { if (p.stock) step({ click: { add: id } }); });
        items[id] = { el, name, q, add, p };
        return el;
      }
      function skeleton(n, card) {
        const host = card ? util.el('div', 'rx-grid', area) : util.el('div', 'rx-load', pane);
        if (card) host.style.setProperty('--cols', cols);
        for (let i = 0; i < n; i++) {
          const row = util.el('div', card ? 'rx-card' : 'rx-row', host);
          if (!card) row.style.height = pitch + 'px';
          const im = util.el('div', 'rx-skel rx-img', row);
          im.textContent = '';
          const s = util.el('div', 'rx-skel', row);
          Object.assign(s.style, { height: '14px', width: card ? '80%' : '42%' });
          if (card) util.el('div', 'rx-skel', row).style.height = '32px';
        }
      }
      function rebuild(mm) {
        for (const k of Object.keys(items)) delete items[k];
        lbx = null;
        const loading = mm.loading > 0;
        const vis = fam.coVisible(mm, spec);
        countT.replaceChildren();
        if (loading) countT.textContent = 'Loading…';
        else {
          util.el('b', '', countT, String(vis.length));
          countT.append(vis.length === 1 ? ' product' : ' products');
        }
        if (flow) {
          area.replaceChildren();
          if (loading) return skeleton(Math.min(10, cols * 2), true);
          if (!vis.length) return void util.el('div', 'rx-empty', area, 'No products match your search and filters.');
          const grid = util.el('div', 'rx-grid', area);
          grid.style.setProperty('--cols', cols);
          for (const id of vis) grid.append(item(id, true));
          return;
        }
        pane.replaceChildren();
        if (loading) return skeleton(spec.rows, false);
        if (!vis.length) return void util.el('div', 'rx-empty', pane, 'No products match your search and filters.');
        const list = util.el('div', 'rx-list', pane);
        list.dataset.role = 'list';
        const opts = vis.map((id) => {
          const el = item(id, false);
          el.style.height = pitch + 'px';
          list.append(el);
          return [id, el];
        });
        const track = util.el('div', 'rx-track' + (vis.length <= spec.rows ? ' idle' : ''), pane);
        track.dataset.role = 'scrollbar';
        const thumb = util.el('div', 'rx-thumb', track);
        thumb.dataset.role = 'thumb';
        lbx = env.ui.listbox(list, {
          label: 'products', options: opts,
          onScroll(i) {
            const s = Math.round(i * 1000) / 1000;
            if (ctx.model.scroll !== s) ctx.update({ ...ctx.model, scroll: s });
          },
          scrollbar: { track, thumb, pad: 2, minThumb: 28, onDrag: (on) => thumb.classList.toggle('drag', on) },
        });
        lbx.set({ scroll: mm.scroll || 0 });
        lbx.list = list;
      }
      // Mini bag column.
      let miniKey = null;
      const miniGo = mini ? btn(util, 'rx-btn primary', null, look.checkoutLabel, 'checkout') : null;
      function paintMini(mm) {
        if (!mini) return;
        const key = JSON.stringify(mm.cart);
        if (key === miniKey) return;
        miniKey = key;
        mini.replaceChildren();
        util.el('div', 'rx-mini-h', mini, `Your ${(look.bagWord || 'bag').toLowerCase()} (${mm.cart.reduce((s, l) => s + l.qty, 0)})`);
        if (!mm.cart.length) util.el('div', 'rx-mini-e', mini, 'Nothing here yet.');
        for (const l of mm.cart.slice(0, 4)) {
          const d = util.el('div', 'rx-mini-l', mini);
          util.el('span', '', d, `${l.qty} × ${P(l.id).name}`);
          util.el('span', '', d, fmt(P(l.id).price * l.qty));
        }
        if (mm.cart.length > 4) util.el('div', 'rx-mini-e', mini, `+ ${mm.cart.length - 4} more`);
        const t = fam.coTotals(spec, mm.cart, mm.coupon);
        const s = util.el('div', 'rx-sum total', mini);
        util.el('span', '', s, 'Subtotal');
        util.el('span', '', s, fmt(t.sub));
        mini.append(miniGo);
        miniGo.disabled = !mm.cart.length;
        const v = btn(util, 'rx-link', mini, 'View bag', 'view-bag');
        v.style.alignSelf = 'center';
        v.addEventListener('click', () => step({ click: { nav: 'cart' } }));
      }
      if (miniGo) miniGo.addEventListener('click', () => step({ click: { checkout: true } }));
      return {
        paint(mm) {
          const key = JSON.stringify([mm.loading > 0, mm.loading > 0 ? 0 : fam.coVisible(mm, spec)]);
          if (key !== built) {
            built = key;
            rebuild(mm);
          }
          cats.set(mm.cats);
          if (!slider.active || !slider.active()) slider.set(mm.price.slice());
          drawRange(mm.price);
          const inCart = new Set(mm.cart.map((l) => l.id));
          for (const [id, it] of Object.entries(items)) {
            if (it.p.stock) it.q.set(fam.coQty(mm, +id), fam.coMaxQty(it.p));
            it.add.classList.toggle('incart', inCart.has(+id));
          }
          const a = mm.notice && mm.notice.added !== undefined ? P(mm.notice.added) : null;
          added.textContent = a ? `✓ Added to ${(look.bagWord || 'bag').toLowerCase()}` : '';
          paintMini(mm);
        },
        locate(t) {
          if (t.cat !== undefined) return where(chipOf[t.cat], `category ${t.cat}`);
          if (t.price === 'thumb') return slider.locateThumb(t.j);
          if (t.price !== undefined) return slider.locate(t.price, t.j);
          if (t.thumb) return lbx.locateThumb();
          if (t.scroll !== undefined) return lbx.locateThumbFor(t.scroll);
          if (t.pane) return where(lbx.list, 'product list');
          if (t.checkout) return where(miniGo, 'Checkout');
          const it = items[t.open !== undefined ? t.open : t.cardQty !== undefined ? t.cardQty : t.add];
          if (!it) return null;
          if (t.open !== undefined) return where(it.name, 'product link');
          if (t.cardQty !== undefined) return where(t.dir === 'up' ? it.q.up : it.q.dn, 'quantity');
          return where(it.add, 'Add');
        },
      };
    }

    // ---- product page
    function productPage(m) {
      const r = ctx.rng.fork(`page/product/${m.view}`);
      const p = P(m.view);
      const row = util.el('div', 'rx-titlerow', pageEl);
      const back = btn(util, 'rx-link rx-back', row, '‹ Back to results', 'back');
      back.addEventListener('click', () => step({ click: { back: 'shop' } }));
      util.el('div', 'rx-crumb', row, `Home › ${spec.cats[p.cat]} › ${p.name}`).style.marginLeft = 'auto';
      const det = util.el('div', 'rx-detail', pageEl);
      const gal = util.el('div', 'rx-gal', det);
      const hero = util.el('div', 'rx-hero', gal, initials(p.name));
      hero.style.setProperty('--h', p.hue);
      const avail = flow ? 360 : pageEl.getBoundingClientRect().height - 120;
      const side = Math.min(300, Math.max(140, avail - 52), Math.round(pageEl.getBoundingClientRect().width * 0.32));
      Object.assign(hero.style, { width: side + 'px', height: side + 'px' });
      const th = util.el('div', 'rx-thumbs', gal);
      for (let i = 0; i < 3; i++) {
        const s = util.el('span', '', th);
        s.style.setProperty('--h', (p.hue + 40 * i) % 360);
        decoy(s, 'gallery');
      }
      const info = util.el('div', 'rx-dinfo', det);
      util.el('div', 'rx-kick', info, spec.cats[p.cat]);
      util.el('div', 'rx-h1', info, p.name);
      const meta = util.el('div', 'rx-meta', info);
      util.el('span', 'rx-stars', meta, stars(p));
      meta.append(` ${(p.rating / 10).toFixed(1)} · ${p.reviews} reviews · ${p.sku}`);
      const pr = util.el('div', 'rx-dprice', info, fmt(p.price));
      if (p.was) util.el('span', 'rx-was', pr, fmt(p.was));
      const [cls, txt] = stockText(p);
      util.el('div', cls || 'rx-muted', info, txt);
      const groups = env.content.SENTENCE_GROUPS || {};
      const bank = (groups.product && groups.product.length ? groups.product : env.content.SENTENCES) || [];
      if (bank.length) {
        const h = fam.hash32(`${spec.salt}|${p.id}`);
        util.el('div', 'rx-desc', info, [0, 1].map((k) => bank[(h + k * 104729) % bank.length]).join(' '));
      }
      const buy = util.el('div', 'rx-buy', info);
      const q = pill(buy, fam.coQty(m, p.id), () => step({ click: { detailQty: 'down' } }), () => step({ click: { detailQty: 'up' } }), 'qty');
      const add = btn(util, 'rx-btn primary', buy, p.stock ? r.pick(['Add to bag', 'Add to cart']) : 'Out of stock', 'add');
      add.disabled = !p.stock;
      if (!p.stock) q.dn.disabled = q.up.disabled = true;
      add.addEventListener('click', () => { if (p.stock) step({ click: { addDetail: true } }); });
      const ok = util.el('div', 'rx-ok', info);
      const notes = util.el('div', 'rx-notes', info);
      for (const n of r.sample(['Free delivery on orders over 50', 'Free returns within 30 days', 'Ships in 1-2 business days',
        'Pay in 4 interest-free instalments'], 2)) util.el('span', '', notes, `· ${n}`);
      fit([notes]);
      return {
        paint(mm) {
          if (p.stock) q.set(fam.coQty(mm, p.id), fam.coMaxQty(p));
          const line = mm.cart.find((l) => l.id === p.id);
          ok.textContent = mm.notice && mm.notice.added === p.id ? `✓ Added (${line ? line.qty : 0} in your ${(look.bagWord || 'bag').toLowerCase()})`
            : line ? `${line.qty} already in your ${(look.bagWord || 'bag').toLowerCase()}` : '';
        },
        locate(t) {
          if (t.back) return where(back, 'Back to results');
          if (t.detailQty) return where(t.detailQty === 'up' ? q.up : q.dn, 'quantity');
          if (t.addDetail) return where(add, 'Add to bag');
          return null;
        },
      };
    }

    // ---- cart page
    function cartPage(m) {
      const r = ctx.rng.fork('page/cart');
      titleRow(r.pick([`Your ${(look.bagWord || 'bag').toLowerCase()}`, 'Shopping bag', 'Your cart']), 0);
      if (m.notice && m.notice.cancelled) {
        const a = util.el('div', 'rx-banner', pageEl, `Order ${m.notice.cancelled} was cancelled. Its items are back in your ${(look.bagWord || 'bag').toLowerCase()}.`);
        a.style.borderStyle = 'solid';
      }
      const two = util.el('div', 'rx-two', pageEl);
      const col = util.el('div', 'rx-col', two);
      const head = util.el('div', 'rx-thead', col);
      for (const [c, t] of [['c1', 'Item'], ['c2', 'Price'], ['c3', 'Quantity'], ['c4', 'Total']]) util.el('span', c, head, t);
      const lines = util.el('div', 'rx-lines', col);
      lines.dataset.role = 'cart';
      const cont = btn(util, 'rx-link', col, '‹ Continue shopping', 'continue');
      cont.style.cssText = 'align-self:flex-start;margin-top:10px';
      cont.addEventListener('click', () => step({ click: { nav: 'shop' } }));
      const side = util.el('aside', 'rx-side', two);
      side.dataset.fit = '1';
      util.el('div', 'rx-side-h', side, 'Order summary');
      const sums = util.el('div', '', side);
      sums.style.cssText = 'display:flex;flex-direction:column;gap:5px';
      util.el('div', 'rx-lab', side, r.pick(['Discount code', 'Promo code', 'Gift card or discount code']));
      const promo = util.el('div', 'rx-promo', side);
      const cin = util.el('input', 'rx-input', promo);
      Object.assign(cin, { type: 'text', autocomplete: 'off', spellcheck: false, placeholder: r.pick(['Enter code', 'Code', 'e.g. SAVE10']) });
      cin.dataset.role = 'coupon-field';
      const ctf = env.ui.textField(cin, { value: m.couponText, label: 'coupon', onInput: (v) => commit({ ...ctx.model, couponText: v, couponMsg: '' }) });
      trackFocus(ctx, cin, 'coupon');
      const apply = btn(util, 'rx-btn', promo, 'Apply', 'coupon-apply');
      apply.addEventListener('click', () => step({ click: { button: 'coupon' } }));
      cin.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          step({ key: 'Enter', on: 'coupon' });
        }
      });
      const msg = util.el('div', 'rx-msg', side);
      const go = btn(util, 'rx-btn primary big', side, look.checkoutLabel, 'checkout');
      go.addEventListener('click', () => step({ click: { checkout: true } }));
      const extras = [];
      if (look.express) {
        const x = expressRow(side, r);
        const or = util.el('div', 'or', null, 'or pay with');
        x.prepend(or);
        extras.push(x);
      }
      extras.unshift(trust(side, r));
      const lineEls = {};
      let removeCoupon = null;
      let built = null;
      const view = {
        paint(mm) {
          const key = JSON.stringify([mm.cart, mm.coupon, mm.couponMsg]);
          if (key === built) {
            if (cin.value !== mm.couponText) ctf.set(mm.couponText);
            return;
          }
          built = key;
          lines.replaceChildren();
          for (const k of Object.keys(lineEls)) delete lineEls[k];
          if (!mm.cart.length) util.el('div', 'rx-empty', lines, `Your ${(look.bagWord || 'bag').toLowerCase()} is empty.`);
          for (const l of mm.cart) {
            const p = P(l.id);
            const row = util.el('div', 'rx-line', lines);
            row.dataset.role = 'cart-line';
            img(row, p);
            const info = util.el('div', 'rx-info', row);
            util.el('div', 'rx-name', info, p.name).title = p.name;
            const rm = btn(util, 'rx-link', info, 'Remove', 'remove');
            rm.addEventListener('click', () => step({ click: { line: l.id, op: 'remove' } }));
            util.el('div', 'c2', row, fmt(p.price));
            const c3 = util.el('div', 'c3', row);
            const s = pill(c3, l.qty, () => step({ click: { line: l.id, op: 'dec' } }), () => step({ click: { line: l.id, op: 'inc' } }), 'line', true);
            s.set(l.qty, p.stock, 0);
            util.el('div', 'c4', row, fmt(p.price * l.qty));
            lineEls[l.id] = { inc: s.up, dec: s.dn, remove: rm };
          }
          const t = fam.coTotals(spec, mm.cart, mm.coupon);
          sums.replaceChildren();
          totals(sums, t, mm, false);
          if (cin.value !== mm.couponText) ctf.set(mm.couponText);
          msg.replaceChildren();
          msg.className = 'rx-msg';
          removeCoupon = null;
          if (mm.coupon) {
            msg.classList.add('good');
            msg.append(`✓ ${mm.coupon} applied (−${spec.coupon.pct}%) `);
            removeCoupon = btn(util, 'rx-link', msg, 'Remove', 'coupon-remove');
            removeCoupon.addEventListener('click', () => step({ click: { couponRemove: true } }));
          } else if (mm.couponMsg === 'invalid') {
            msg.classList.add('bad');
            msg.textContent = 'This code is not valid.';
          } else if (mm.couponMsg === 'empty') {
            msg.classList.add('bad');
            msg.textContent = 'Enter a code first.';
          }
          go.disabled = !mm.cart.length;
        },
        locate(t) {
          if (t.line !== undefined) {
            const els = lineEls[t.line];
            if (!els) throw new Error(`use-shop/storefront: cart line ${t.line} not shown`);
            const b = els[t.op];
            const lr = lines.getBoundingClientRect();
            const br = b.getBoundingClientRect();
            if (br.top < lr.top || br.bottom > lr.bottom) lines.scrollTop += br.top < lr.top ? br.top - lr.top - 4 : br.bottom - lr.bottom + 4;
            return where(b, `cart ${t.op}`);
          }
          if (t.field === 'coupon') return ctf.locate();
          if (t.button === 'coupon') return where(apply, 'Apply');
          if (t.couponRemove) return where(removeCoupon, 'Remove code');
          if (t.checkout) return where(go, 'Checkout');
          return null;
        },
      };
      // Fit against the fullest summary (a discount line and a message).
      view.paint({ ...m, coupon: spec.coupon ? spec.coupon.code : m.coupon, couponMsg: spec.coupon ? 'ok' : 'invalid' });
      fit(extras);
      built = null;
      return view;
    }

    // ---- checkout page
    function checkoutPage(m) {
      const r = ctx.rng.fork('page/checkout');
      titleRow(r.pick(['Checkout', 'Shipping & payment', 'Secure checkout']), [1, 2]);
      const two = util.el('div', 'rx-two', pageEl);
      const col = util.el('div', 'rx-col', two);
      col.dataset.fit = '1';
      const extras = [];
      if (look.express && r.bool(0.6)) {
        const x = expressRow(col, r);
        util.el('div', 'or', x, 'or continue below');
        x.classList.add('rx-block');
        extras.push(x);
      }
      // 1. address
      const b1 = util.el('div', 'rx-block', col);
      const h1 = util.el('div', 'rx-sec', b1);
      util.el('i', '', h1, '1');
      util.el('span', '', h1, r.pick(['Shipping address', 'Deliver to', 'Delivery address']));
      const list = util.el('div', 'rx-radios', b1);
      const addrEls = spec.saved.map((a, i) => {
        const lab = util.el('label', 'rx-radio', list);
        lab.dataset.role = 'address';
        const inp = util.el('input', '', lab);
        Object.assign(inp, { type: 'radio', name: 'rx-addr' });
        const t = util.el('span', 't', lab);
        util.el('b', '', t, a.name);
        t.append(` · ${a.line1}${a.line2 ? `, ${a.line2}` : ''}, ${fam.cityLine(a)}`);
        util.el('small', '', t, a.country);
        return [i, inp];
      });
      const nl = util.el('label', 'rx-radio', list);
      nl.dataset.role = 'address-new';
      const ninp = util.el('input', '', nl);
      Object.assign(ninp, { type: 'radio', name: 'rx-addr' });
      util.el('span', 't', nl, r.pick(['Ship to a new address', 'Use a different address', 'Add a new address']));
      addrEls.push(['new', ninp]);
      const addrLabel = Object.fromEntries(addrEls.map(([k, inp]) => [k, inp.parentElement]));
      const addrs = env.ui.choices(addrEls, { value: m.pick, label: 'address', onChange: (v) => step({ click: { addr: v } }) });
      const form = util.el('div', 'rx-form', b1);
      const LABELS = { name: 'Full name', line1: r.pick(['Street address', 'Address line 1', 'Street and number']), city: r.pick(['City', 'Town / City']),
        postcode: r.pick(['Postal code', 'Postcode', 'ZIP / Postal code']) };
      const inputs = {};
      for (const f of fam.ADDR_FIELDS) {
        const fl = util.el('label', 'rx-fl', form);
        util.el('span', '', fl, LABELS[f]);
        const inp = util.el('input', 'rx-input', fl);
        Object.assign(inp, { type: 'text', autocomplete: 'off', spellcheck: false });
        inp.dataset.role = `${f}-field`;
        const err = util.el('i', '', fl, 'Required');
        const tf = env.ui.textField(inp, { value: m.form[f], label: f, onInput: (v) => commit({ ...ctx.model, form: { ...ctx.model.form, [f]: v },
          invalid: ctx.model.invalid.filter((x) => x !== f) }) });
        inputs[f] = { inp, tf, err };
      }
      // 2. delivery
      const b2 = util.el('div', 'rx-block', col);
      const h2 = util.el('div', 'rx-sec', b2);
      util.el('i', '', h2, '2');
      util.el('span', '', h2, r.pick(['Delivery method', 'Shipping method', 'Delivery options']));
      const daysText = (s) => (s.days[1] === 0 ? 'Today' : s.days[0] === s.days[1] ? `${s.days[0]} business day${s.days[0] === 1 ? '' : 's'}` : `${s.days[0]}-${s.days[1]} business days`);
      const shipName = (s) => s.name.replace(/\s*\(.*\)$/, '');
      function shipRows(inline) {
        const host = inline ? util.el('div', 'rx-inline', b2) : util.el('div', 'rx-radios', b2);
        if (inline) host.style.setProperty('--n', spec.methods.length);
        return spec.methods.map((s) => {
          const lab = util.el('label', inline ? 'rx-opt' : 'rx-radio', host);
          lab.dataset.role = 'delivery';
          const inp = util.el('input', '', lab);
          Object.assign(inp, { type: 'radio', name: `rx-ship-${inline ? 'i' : 'r'}` });
          const t = util.el('span', inline ? '' : 't', lab);
          util.el('b', '', t, shipName(s));
          if (inline) t.append(`${s.price ? fmt(s.price) : 'Free'} · ${daysText(s)}`);
          else {
            util.el('small', '', t, daysText(s));
            util.el('span', 'p', lab, s.price ? fmt(s.price) : 'Free');
          }
          return [s.id, inp];
        });
      }
      let shipEls = shipRows(false);
      let ship = env.ui.choices(shipEls, { value: m.ship, label: 'delivery', onChange: (v) => step({ click: { ship: v } }) });
      // 3. payment (inert)
      const b3 = util.el('div', 'rx-block', col);
      const h3 = util.el('div', 'rx-sec', b3);
      util.el('i', '', h3, '3');
      util.el('span', '', h3, 'Payment');
      const pay = util.el('div', 'rx-pay', b3);
      pay.dataset.role = 'payment';
      util.el('span', 'rx-card-ic', pay);
      const pt = util.el('span', 't', pay, `Card ending in ${look.card}`);
      util.el('small', '', pt, `Expires ${look.exp}`);
      const chg = btn(util, 'rx-link', pay, 'Change', 'decoy');
      decoy(chg, 'payment-change');
      let mainPlace = null;
      let mainBlocked = null;
      if (!look.placeSide) {
        mainPlace = btn(util, 'rx-btn primary big rx-main-place', col, look.placeLabel, 'place-order');
        mainBlocked = util.el('div', 'rx-blocked', col);
      }
      const back = btn(util, 'rx-link', col, `‹ Return to ${(look.bagWord || 'bag').toLowerCase()}`, 'back');
      back.style.cssText = 'align-self:flex-start;margin-top:8px';
      back.addEventListener('click', () => step({ click: { back: 'cart' } }));
      // summary column
      const side = util.el('aside', 'rx-side', two);
      side.dataset.fit = '1';
      util.el('div', 'rx-side-h', side, 'Order summary');
      const minis = util.el('div', 'rx-mlines', side);
      const sums = util.el('div', '', side);
      sums.style.cssText = 'display:flex;flex-direction:column;gap:5px';
      let place = mainPlace;
      let blocked = mainBlocked;
      if (look.placeSide) {
        place = btn(util, 'rx-btn primary big', side, look.placeLabel, 'place-order');
        blocked = util.el('div', 'rx-blocked', side);
      }
      place.addEventListener('click', () => step({ click: { place: true } }));
      const tr = trust(side, r);
      // Fit the fullest state: the new-address form shown with errors.
      form.hidden = false;
      fit([...extras, tr, b3]);
      if (!flow && (col.scrollHeight > col.clientHeight + 1 || pageEl.scrollHeight > pageEl.clientHeight + 1)) {
        // Still too tall: delivery options side by side.
        b2.lastChild.remove();
        shipEls = shipRows(true);
        ship = env.ui.choices(shipEls, { value: m.ship, label: 'delivery', onChange: (v) => step({ click: { ship: v } }) });
      }
      const shipLabel = Object.fromEntries(shipEls.map(([id, inp]) => [id, inp.parentElement]));
      return {
        paint(mm) {
          addrs.set(mm.pick);
          form.hidden = mm.pick !== 'new';
          for (const f of fam.ADDR_FIELDS) {
            const x = inputs[f];
            if (x.inp.value !== mm.form[f]) x.tf.set(mm.form[f]);
            const bad = mm.invalid.includes(f);
            x.inp.classList.toggle('bad', bad);
            x.err.hidden = !bad;
          }
          ship.set(mm.ship);
          minis.replaceChildren();
          for (const l of mm.cart) {
            const d = util.el('div', 'rx-ml', minis);
            const im = img(d, P(l.id));
            util.el('b', '', im, String(l.qty));
            util.el('span', '', d, P(l.id).name);
            util.el('em', '', d, fmt(P(l.id).price * l.qty));
          }
          const t = fam.coTotals(spec, mm.cart, mm.coupon, mm.ship);
          sums.replaceChildren();
          totals(sums, t, mm, true);
          const live = fam.coLive(mm);
          place.disabled = !mm.cart.length || !!live;
          blocked.textContent = live ? `Order ${live.no} is still open. Cancel it before placing a new one.` : '';
        },
        locate(t) {
          if (t.back) return where(back, 'Return to bag');
          if (t.addr !== undefined) return where(addrLabel[t.addr], 'address');
          if (t.field) return inputs[t.field].tf.locate();
          if (t.ship) return where(shipLabel[t.ship], 'delivery option');
          if (t.place) return where(place, 'Place order');
          return null;
        },
      };
    }

    // ---- order (confirmation) page
    function orderPage(m) {
      const r = ctx.rng.fork('page/order');
      const o = m.orders[m.orders.length - 1];
      if (!o) {
        titleRow(r.pick(['Your orders', 'Orders']), null, 'Account › Orders');
        util.el('div', 'rx-muted', pageEl, "You haven't placed any orders yet.");
        return { paint() {}, locate() { return null; } };
      }
      titleRow(o.cancelled ? 'Order cancelled' : r.pick(['Order confirmed', 'Thank you!']), o.cancelled ? null : 4, o.cancelled ? 'Account › Orders' : null);
      const conf = util.el('div', 'rx-conf', pageEl);
      const tick = util.el('div', 'rx-tick' + (o.cancelled ? ' off' : ''), conf);
      tick.innerHTML = o.cancelled ? '×' : ICON.check;
      const txt = util.el('div', '', conf);
      const addr = typeof o.addr === 'object' ? o.addr : spec.saved[o.addr];
      util.el('div', 'rx-h1', txt, o.cancelled ? 'This order was cancelled' : `Thanks, ${String(addr.name || spec.account).split(' ')[0]}! Your order is confirmed.`);
      const nl = util.el('div', 'rx-muted', txt);
      nl.append('Order number ');
      util.el('span', 'rx-no', nl, o.no).dataset.role = 'order-number';
      const facts = util.el('dl', 'rx-facts', pageEl);
      const t = fam.coTotals(spec, o.lines, o.coupon, o.ship);
      const method = spec.methods.find((x) => x.id === o.ship);
      for (const [a, b] of [['Items', o.lines.map((l) => `${l.qty} × ${P(l.id).name}`).join(', ')], ['Ship to', fam.addrText(addr)],
        ['Delivery', method ? method.name : '—'], ['Payment', `Card ending in ${look.card}`], ['Status', o.cancelled ? 'Cancelled' : 'Processing'], ['Total', fmt(t.total)]]) {
        util.el('dt', '', facts, a);
        util.el('dd', '', facts, b).title = b;
      }
      const acts = util.el('div', 'rx-acts', pageEl);
      const cont = btn(util, 'rx-btn', acts, 'Continue shopping', 'continue');
      cont.addEventListener('click', () => step({ click: { nav: 'shop' } }));
      let cancel = null;
      if (!o.cancelled) {
        cancel = btn(util, 'rx-link danger', acts, r.pick(['Cancel order', 'Cancel this order']), 'cancel-order');
        cancel.addEventListener('click', () => step({ click: { cancelOrder: true } }));
      }
      fit([facts.lastChild, facts.lastChild && facts.lastChild.previousSibling]);
      return {
        paint() {},
        locate(t2) {
          if (t2.cancelOrder) return where(cancel, 'Cancel order');
          return null;
        },
      };
    }

    // ---- cancel-order page
    function cancelPage(m) {
      const o = fam.coLive(m) || m.orders[m.orders.length - 1];
      titleRow(`Cancel order ${o ? o.no : ''}`, null, 'Account › Orders › Cancel');
      util.el('div', 'rx-muted', pageEl, 'Why do you want to cancel? The items go back to your bag.').style.marginBottom = '12px';
      const box = util.el('div', 'rx-reasons', pageEl);
      const els = fam.REASONS.map(([k, label]) => {
        const lab = util.el('label', 'rx-reason', box);
        lab.dataset.role = 'reason';
        const inp = util.el('input', '', lab);
        Object.assign(inp, { type: 'radio', name: 'rx-reason' });
        util.el('span', '', lab, label);
        return [k, inp];
      });
      const labs = Object.fromEntries(els.map(([k, inp]) => [k, inp.parentElement]));
      const reasons = env.ui.choices(els, { value: m.reason, label: 'reason', onChange: (v) => step({ click: { reason: v } }) });
      const acts = util.el('div', 'rx-acts', pageEl);
      acts.style.marginTop = '16px';
      const keep = btn(util, 'rx-btn', acts, 'Keep my order', 'keep');
      keep.addEventListener('click', () => step({ click: { keep: true } }));
      const confirm = btn(util, 'rx-btn primary', acts, 'Cancel order', 'confirm-cancel');
      confirm.style.background = 'var(--bad)';
      confirm.style.borderColor = 'var(--bad)';
      confirm.style.color = '#fff';
      confirm.addEventListener('click', () => step({ click: { confirmCancel: true } }));
      return {
        paint(mm) {
          reasons.set(mm.reason);
          confirm.disabled = !mm.reason;
        },
        locate(t) {
          if (t.reason) return where(labs[t.reason], 'reason');
          if (t.confirmCancel) return where(confirm, 'Cancel order');
          if (t.keep) return where(keep, 'Keep order');
          return null;
        },
      };
    }

    // ---- tracking page
    function trackPage(m) {
      const r = ctx.rng.fork('page/track');
      titleRow(r.pick(['Track your order', 'Order status']), null, 'Help › Track order');
      util.el('div', 'rx-muted', pageEl, 'Enter the order number from your confirmation.');
      const row = util.el('div', 'rx-trackrow', pageEl);
      const inp = util.el('input', 'rx-input', row);
      Object.assign(inp, { type: 'text', autocomplete: 'off', spellcheck: false, placeholder: r.pick(['Order number', 'e.g. 123-4567890']) });
      inp.dataset.role = 'track-field';
      const tf = env.ui.textField(inp, { value: m.trackText, label: 'track', onInput: (v) => commit({ ...ctx.model, trackText: v }) });
      trackFocus(ctx, inp, 'track');
      const go = btn(util, 'rx-btn primary', row, r.pick(['Track', 'Find order', 'Check status']), 'track-button');
      go.addEventListener('click', () => step({ click: { button: 'track' } }));
      inp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          step({ key: 'Enter', on: 'track' });
        }
      });
      const out = util.el('div', '', pageEl);
      let shown;
      return {
        paint(mm) {
          if (inp.value !== mm.trackText) tf.set(mm.trackText);
          if (shown === mm.tracked) return;
          shown = mm.tracked;
          out.replaceChildren();
          if (mm.tracked === null) return;
          const o = mm.orders.find((x) => x.no === mm.tracked);
          const card = util.el('div', 'rx-result' + (o ? '' : ' bad'), out);
          if (!o) {
            card.textContent = 'No order found with that number. Check it and try again.';
            return;
          }
          util.el('b', '', card, `Order ${o.no}`);
          util.el('div', 'rx-muted', card, o.cancelled ? 'Cancelled' : `Processing · ${o.lines.reduce((s, l) => s + l.qty, 0)} item(s)`);
          if (!o.cancelled) {
            const tl = util.el('div', 'rx-timeline', card);
            ['Ordered', 'Packed', 'Shipped', 'Delivered'].forEach((s, i) => util.el('span', i === 0 ? 'on' : '', tl, s));
          }
        },
        locate(t) {
          if (t.field === 'track') return tf.locate();
          if (t.button === 'track') return where(go, 'Track');
          return null;
        },
      };
    }

    const PAGES = { shop: shopPage, product: productPage, cart: cartPage, checkout: checkoutPage, order: orderPage, cancel: cancelPage, track: trackPage };

    function paint(m) {
      lastPainted = m;
      if (sinput.value !== m.text) stf.set(m.text);
      const n = m.cart.reduce((s, l) => s + l.qty, 0);
      count.textContent = String(n);
      count.hidden = !n;
      for (const [k, el] of Object.entries(navEls)) el.classList.toggle('on', k === m.page || (k === 'order' && m.page === 'cancel'));
      const pageKey = m.page === 'product' ? `product:${m.view}` : m.page === 'order' ? `order:${m.orders.length}:${m.orders.map((o) => o.cancelled).join()}` : m.page;
      if (pageKey !== curPage) {
        curPage = pageKey;
        pageEl.replaceChildren();
        pageEl.classList.remove('rx-tight');
        view = PAGES[m.page](m);
        if (flow && window.scrollY) window.scrollTo(0, 0);
      }
      view.paint(m);
    }
    paint(ctx.model);
    return {
      app,
      top,
      sync(m) { if (m !== lastPainted) paint(m); },
      locate(t) {
        if (t.nav) return where(navEls[t.nav], `nav ${t.nav}`);
        if (t.field === 'search') return stf.locate();
        if (t.button === 'search') return where(sgo, 'Search');
        return view.locate(t);
      },
    };
  }

  env.widget({
    task: 'use-shop',
    site: 'mock-checkout',
    name: 'storefront',
    split: 'heldout',
    scenarios: ['checkout'],
    // Card-grid stores scroll as a whole page.
    scrollable: (spec) => spec.scenario === 'checkout' && spec.layout === 'page',

    render(ctx) {
      ensureStyle();
      const flow = ctx.spec.layout === 'page';
      const view = build(ctx, flow);
      st = { ctx, view, flow };
      return {
        anchors: [flow ? view.top : view.app],
        sync(m) { view.sync(m); },
      };
    },

    locate(t) {
      const at = st && st.view.locate(t);
      if (!at) throw new Error(`use-shop/storefront cannot locate ${JSON.stringify(t)}`);
      // Scrolling page: a target under page frame (the sticky header) is reported just off-screen on that
      // side, so the kit wheels the page to bring it to the middle first.
      if (st.flow) {
        const H = window.innerHeight;
        const hit = at[1] >= 0 && at[1] <= H ? document.elementFromPoint(at[0], at[1]) : null;
        if (hit && !st.view.app.contains(hit)) return [at[0], at[1] < H / 2 ? -40 : H + 40];
      }
      return at;
    },
  });
})();
