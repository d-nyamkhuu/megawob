/* scroll-page/_longform-assets: unchanged structural CSS and default design tokens for longform. */
(function () {
  'use strict';

  const CSS = `
  .ps-wrap { align-self: flex-start; margin: 22px 26px 0; color: var(--fg); user-select: text; -webkit-user-select: text; }
  .ps-wrap.docs { display: grid; grid-template-columns: 196px minmax(0, 1fr); column-gap: 36px; }
  .ps-wrap.rail { display: grid; grid-template-columns: minmax(0, 1fr) 230px; column-gap: 34px; }
  .ps-side { position: sticky; align-self: start; font-size: 13.5px; }
  .ps-side h4, .ps-rail h4 { margin: 4px 0 10px; font-size: 11.5px; letter-spacing: .07em; text-transform: uppercase; color: var(--muted); }
  .ps-side a { display: block; padding: 5px 0 5px 10px; border-left: 2px solid var(--line); color: var(--muted); text-decoration: none; cursor: pointer; }
  .ps-side a:hover { color: var(--fg); border-left-color: var(--accent); }
  .ps-rail { align-self: start; padding: 16px 18px; border: 1px solid var(--line); border-radius: 10px; background: var(--panel); font-size: 13.5px; }
  .ps-rail span { display: block; padding: 6px 0; color: var(--muted); border-bottom: 1px dashed var(--line); }
  .ps-main { min-width: 0; }
  .ps-head { padding-bottom: 14px; border-bottom: 1px solid var(--line); }
  .ps-crumbs { font-size: 13px; color: var(--muted); }
  .ps-crumbs b { color: var(--accent); font-weight: 600; }
  .ps-title { margin: 8px 0 6px; font-size: 30px; line-height: 1.18; letter-spacing: -.01em; }
  .ps-title.serif { font-family: Georgia, "Times New Roman", "Liberation Serif", serif; font-size: 33px; }
  .ps-meta { font-size: 13.5px; color: var(--muted); }
  .ps-tools { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
  .ps-tool { padding: 6px 12px; border: 1px solid var(--line); border-radius: 999px; background: var(--panel); color: var(--fg); font: inherit; font-size: 13.5px; cursor: pointer; }
  .ps-tool:hover { border-color: var(--accent); }
  .ps-card { margin: 18px 0 4px; padding: 14px 16px; border: 1px solid var(--line); border-radius: 10px; background: var(--panel); }
  .ps-card label { display: block; font-size: 13px; font-weight: 650; margin-bottom: 6px; }
  .ps-card .row { display: flex; gap: 8px; align-items: center; }
  .ps-input { flex: 1; min-width: 0; max-width: 340px; height: 36px; padding: 0 10px; border: 1px solid var(--line); border-radius: 7px; background: var(--bg); color: var(--fg); font: inherit; font-size: 15px; }
  .ps-input:focus { outline: 2px solid color-mix(in srgb, var(--accent) 50%, transparent); border-color: var(--accent); }
  .ps-inert { padding: 8px 14px; border: 0; border-radius: 7px; background: color-mix(in srgb, var(--fg) 9%, var(--panel)); color: var(--fg); font: inherit; font-size: 14px; cursor: pointer; }
  .ps-code { font-family: ui-monospace, Menlo, Consolas, "DejaVu Sans Mono", monospace; font-size: 14.5px; padding: 1px 6px; border-radius: 5px; background: color-mix(in srgb, var(--accent) 10%, var(--panel)); }
  .ps-toc { margin: 16px 0 0; padding: 12px 16px; border-left: 3px solid var(--accent); background: color-mix(in srgb, var(--fg) 3%, var(--panel)); font-size: 14px; }
  .ps-toc b { display: block; margin-bottom: 6px; font-size: 12px; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }
  .ps-toc a { display: inline-block; margin: 2px 14px 2px 0; color: var(--accent); text-decoration: none; cursor: pointer; }
  .ps-toc a:hover { text-decoration: underline; }
  .ps-fig { margin: 18px 0 0; border-radius: 10px; display: flex; align-items: flex-end; padding: 12px 14px; font-size: 12.5px; color: var(--muted);
    background: linear-gradient(135deg, color-mix(in srgb, var(--accent) 18%, var(--panel)), color-mix(in srgb, var(--fg) 8%, var(--panel))); }
  .ps-intro { margin: 18px 0 0; padding: 16px 18px; border: 1px solid var(--line); border-radius: 10px; background: var(--panel); font-size: 15px; line-height: 1.55; }
  .ps-sec { padding: 22px 0 8px; }
  .ps-sec h2 { margin: 0 0 10px; font-size: 21px; line-height: 1.25; }
  .ps-sec p { margin: 0 0 12px; line-height: 1.62; font-size: 15.5px; }
  .ps-link { color: var(--accent); text-decoration: underline; text-underline-offset: 2px; cursor: pointer; }
  .ps-acts { display: flex; flex-wrap: wrap; gap: 10px 18px; align-items: center; margin: 4px 0 6px; }
  .ps-btn { padding: 7px 14px; border: 1px solid var(--accent); border-radius: 7px; background: transparent; color: var(--accent); font: inherit; font-size: 14px; font-weight: 600; cursor: pointer; }
  .ps-btn:hover { background: color-mix(in srgb, var(--accent) 10%, transparent); }
  .ps-done { outline: 2px solid color-mix(in srgb, var(--accent) 55%, transparent); outline-offset: 3px; border-radius: 4px; }
  .ps-ok { display: none; margin-left: 4px; font-size: 13px; color: #2b8a3e; font-weight: 600; }
  .ps-ok.on { display: inline; }
  .ps-faq h2 { margin: 0 0 12px; font-size: 21px; }
  .ps-item { border-top: 1px solid var(--line); }
  .ps-item:last-child { border-bottom: 1px solid var(--line); }
  .ps-q { display: flex; align-items: center; gap: 10px; width: 100%; padding: 13px 4px; border: 0; background: none; color: var(--fg); font: inherit; font-size: 15.5px; font-weight: 600; text-align: left; cursor: pointer; }
  .ps-q i { flex: none; width: 18px; color: var(--muted); font-style: normal; transition: none; }
  .ps-a { display: none; padding: 0 4px 12px 32px; }
  .ps-item.open .ps-a { display: block; }
  .ps-a p { margin: 0 0 8px; line-height: 1.55; font-size: 15px; }
  .ps-pane { position: relative; display: flex; margin: 10px 0 8px; border: 1px solid var(--line); border-radius: 9px; background: var(--panel); overflow: hidden; }
  .ps-pane > .ps-list { flex: 1; min-width: 0; overflow-y: auto; overscroll-behavior: contain; scrollbar-width: none; }
  .ps-list::-webkit-scrollbar { display: none; }
  .ps-track { position: relative; flex: none; width: 13px; border-left: 1px solid var(--line); background: color-mix(in srgb, var(--fg) 3%, var(--panel)); touch-action: none; }
  .ps-thumb { position: absolute; left: 2px; right: 2px; border-radius: 6px; background: color-mix(in srgb, var(--fg) 28%, var(--panel)); cursor: grab; touch-action: none; }
  .ps-thumb:hover { background: color-mix(in srgb, var(--fg) 45%, var(--panel)); }
  .ps-row { display: flex; align-items: center; gap: 12px; box-sizing: border-box; padding: 0 12px; border-bottom: 1px solid var(--line); }
  .ps-row .t { flex: none; font-weight: 650; font-size: 14.5px; }
  .ps-row .m { flex: 1; min-width: 0; color: var(--muted); font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ps-row .ps-btn { padding: 4px 10px; font-size: 13px; }
  .ps-group { box-sizing: border-box; padding: 8px 10px 10px; border-bottom: 1px solid var(--line); }
  .ps-group h5 { margin: 0 0 6px; font-size: 13px; letter-spacing: .03em; color: var(--muted); }
  .ps-group .ps-pane { margin: 0; }
  .ps-pane.ps-hbox { flex-direction: column; }
  .ps-pane.ps-hbox > .ps-list { flex: none; overflow-x: auto; overflow-y: hidden; display: flex; overscroll-behavior-y: auto; }
  .ps-hbox > .ps-track { width: auto; height: 13px; border-left: 0; border-top: 1px solid var(--line); }
  .ps-hbox .ps-thumb { left: auto; right: auto; top: 2px; bottom: 2px; }
  .ps-hcard { flex: none; box-sizing: border-box; display: flex; flex-direction: column; gap: 6px; padding: 12px 14px; border-right: 1px solid var(--line); }
  .ps-hcard .t { font-weight: 650; font-size: 15px; }
  .ps-hcard .m { color: var(--muted); font-size: 12.5px; flex: 1; overflow: hidden; }
  .ps-hcard .ps-btn { padding: 4px 10px; font-size: 13px; align-self: flex-start; }
  .ps-hcard .acts { display: flex; flex-wrap: wrap; gap: 6px; }
  .ps-pane.ps-car > .ps-list { flex: none; width: 100%; overflow-x: auto; overflow-y: hidden; display: flex; scroll-snap-type: x mandatory; overscroll-behavior-y: auto; }
  .ps-slide { flex: none; box-sizing: border-box; scroll-snap-align: start; display: flex; flex-direction: column; gap: 8px; padding: 18px 62px 30px; user-select: none; -webkit-user-select: none; }
  .ps-slide .t { font-size: 22px; font-weight: 650; }
  .ps-slide .m { color: var(--muted); font-size: 14px; flex: 1; }
  .ps-slide .acts { display: flex; gap: 10px; }
  .ps-arrow { position: absolute; top: 50%; width: 38px; height: 38px; margin-top: -19px; border-radius: 50%; border: 1px solid var(--line); background: var(--bg); color: var(--fg); font-size: 18px; cursor: pointer; z-index: 2; box-shadow: 0 2px 8px rgba(0,0,0,.14); }
  .ps-arrow.prev { left: 10px; }
  .ps-arrow.next { right: 10px; }
  .ps-dots { position: absolute; left: 0; right: 0; bottom: 9px; display: flex; justify-content: center; gap: 7px; pointer-events: none; z-index: 2; }
  .ps-dots i { width: 8px; height: 8px; border-radius: 50%; background: color-mix(in srgb, var(--fg) 22%, var(--panel)); }
  .ps-dots i.on { background: var(--accent); }
  .ps-shead { position: sticky; top: 0; z-index: 3; box-sizing: border-box; display: flex; align-items: center; gap: 12px; padding: 0 12px; background: var(--panel); border-bottom: 2px solid var(--line); box-shadow: 0 3px 8px rgba(0,0,0,.12); font-size: 12.5px; letter-spacing: .05em; text-transform: uppercase; color: var(--muted); font-weight: 650; }
  .ps-shead b { color: var(--fg); letter-spacing: 0; text-transform: none; font-size: 14.5px; margin-right: auto; }
  .ps-sent { display: flex; align-items: center; justify-content: center; box-sizing: border-box; color: var(--muted); font-size: 13.5px; }
  .ps-sib { display: flex; flex-wrap: wrap; gap: 14px; margin: 10px 0 8px; }
  .ps-sibcol { flex: 1 1 300px; min-width: 0; }
  .ps-sibcol .ps-pane { margin: 4px 0 0; }
  .ps-sibcol h3 { margin: 0 0 2px; font-size: 16px; }
  .ps-sib .ps-row .t { flex: 1 1 auto; min-width: 0; font-size: 13.5px; line-height: 1.25; }
  .ps-sib .ps-row .m { display: none; }
  .ps-sib .ps-row .ps-btn { flex: none; }
  .ps-help { display: flex; gap: 10px; align-items: center; margin-top: 26px; padding: 14px 0; border-top: 1px solid var(--line); font-size: 14px; color: var(--muted); }
  .ps-bottomtools { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; padding: 10px 0; font-size: 13.5px; color: var(--muted); }
  .ps-totop-inline { display: inline-block; margin: 10px 0; color: var(--accent); cursor: pointer; text-decoration: none; font-size: 14px; }
  .ps-foot { margin-top: 18px; padding: 22px 0 240px; border-top: 1px solid var(--line); font-size: 12.5px; color: var(--muted); }
  .ps-foot span { margin-right: 16px; }
  .ps-float { position: fixed; right: 24px; bottom: 86px; z-index: 22; width: 44px; height: 44px; border-radius: 50%; border: 1px solid var(--line);
    background: var(--panel); color: var(--fg); font-size: 18px; cursor: pointer; box-shadow: 0 4px 14px rgba(0,0,0,.18); visibility: hidden; }
  .ps-float.on { visibility: visible; }
  .ps-away { position: fixed; inset: 0; z-index: 25; display: none; padding: 120px 26px 40px; background: var(--bg); overflow: hidden; }
  .ps-away.on { display: block; }
  .ps-away .card { max-width: 640px; margin: 0 auto; padding: 22px 26px; border: 1px solid var(--line); border-radius: 12px; background: var(--panel); }
  .ps-away h2 { margin: 14px 0 8px; font-size: 24px; }
  .ps-away p { color: var(--muted); line-height: 1.55; }
  .ps-back { padding: 7px 14px; border: 1px solid var(--line); border-radius: 7px; background: var(--panel); color: var(--fg); font: inherit; font-size: 14px; cursor: pointer; }
  `;

  const TOKENS = {
    css: CSS,
    foreground: 'var(--fg)',
    muted: 'var(--muted)',
    accent: 'var(--accent)',
    panel: 'var(--panel)',
    background: 'var(--bg)',
    line: 'var(--line)',
    fontFamily: null,
    titleSize: 30,
    serifTitleSize: 33,
    sectionTitleSize: 21,
    bodySize: 15.5,
    radius: 10,
    columnWidth: [640, 860],
    minimumWidth: 420,
    widthInset: 52,
    docsWidth: 196,
    docsGap: 36,
    railWidth: 230,
    railGap: 34,
    rowHeight: [42, 50],
    siblingRows: [4, 5],
    verticalRows: [4, 6],
    cardWidth: [150, 190],
    cardHeight: [112, 130],
    slideHeight: [160, 190],
    groupHeight: [250, 290],
    groupInset: [30, 50],
    figureHeight: [180, 280],
    thumbMinimum: 24,
    openedText: '✓ Opened',
    contentsLabels: ['On this page', 'Contents', 'Jump to'],
    railLabels: ['Related', 'Popular now', 'More to explore', 'You may also like'],
    faqLabels: ['Frequently asked questions', 'FAQ', 'Common questions', 'Questions and answers'],
    inlinePrefixes: ['More: ', '', '→ ', 'Next step: '],
    helpLabels: ['Was this page helpful?', 'Did this answer your question?', 'Was this article useful?'],
    feedbackLabels: ['Yes', 'No'],
    bottomLabels: ['Share or save:', 'Before you go:', 'Tools:'],
    footerLabels: ['© Example Media', 'Privacy', 'Accessibility', 'Sitemap', 'Contact'],
    topText: '↑ Back to top',
    topLabel: 'Back to top',
    topIcon: '↑',
    loadingText: '⟳ Loading more…',
  };

  env.template('scroll-page/_longform-assets', () => ({ TOKENS }));
})();
