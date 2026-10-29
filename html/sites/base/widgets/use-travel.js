/* base / use-travel / classic: Wayfarer travel portal. Stable responsive app frame;
 * seat cabin, two-month calendar, filter rail with real result cards, booking review and manage flow.
 * Native inner panes scroll with the wheel. Geometry/visibility is mirrored as unscored UI state;
 * locate only reads DOM. All business transitions use the task's pure apply(). */
(function () {
  'use strict';
  let refs, slider;
  // Original SVG artwork: symbols share a 24px viewBox and inherit the site's light/dark tokens.
  const ICONS = {
    plane:'M22 2 9 15m13-13-7 20-4-9-9-4Z', hotel:'M3 21V5h12v16M15 10h6v11M7 9h4m-4 4h4m-4 4h4M1 21h22',
    search:'m21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z', calendar:'M4 5h16v16H4ZM8 2v6m8-6v6M4 10h16',
    user:'M20 21v-2a6 6 0 0 0-6-6h-4a6 6 0 0 0-6 6v2M16 5a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
    bell:'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4',
    chevron:'m8 4 8 8-8 8', down:'m6 9 6 6 6-6', check:'m5 12 4 4L19 6', close:'m6 6 12 12M6 18 18 6',
    bag:'M4 7h16v14H4ZM8 7V3h8v4M8 11v6m8-6v6', shield:'m12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6Zm-4 10 3 3 5-6',
    pin:'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
    clock:'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0ZM12 6v6l4 2', card:'M2 5h20v15H2ZM2 10h20M5 16h5',
    heart:'M12 21 3 12a6 6 0 0 1 9-8 6 6 0 0 1 9 8Z', info:'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0ZM12 11v6m0-10v1',
    seat:'M7 3v10h11l3 7M3 16h13l2 5M7 6h9v6M7 3H4v9', coffee:'M3 7h14v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5ZM17 8h4v6h-4M6 2v2m5-2v2',
    star:'m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z', arrow:'M3 12h18m-6-6 6 6-6 6',
    help:'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0ZM9 8a3 3 0 0 1 6 0c0 2-3 2-3 5m0 3v1',
    map:'m2 6 6-3 8 3 6-3v15l-6 3-8-3-6 3Zm6-3v15m8-12v15', wifi:'M2 8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0m-11 4a6 6 0 0 1 8 0m-4 4h.01',
  };
  const CSS = `
  .at-app{position:absolute;inset:8px;display:flex;flex-direction:column;overflow:hidden;border:1px solid var(--line);border-radius:12px;background:var(--panel);box-shadow:0 8px 28px #0001;font-size:13px}
  .at-app *{box-sizing:border-box}.at-app button{font:inherit;cursor:pointer;color:var(--fg);background:var(--panel);border:1px solid var(--line);border-radius:6px;padding:6px 10px}
  .at-app button:hover{border-color:var(--accent);background:color-mix(in srgb,var(--accent) 9%,var(--panel))}.at-app button:disabled{opacity:.45;cursor:not-allowed}.at-app button.on,.at-app .at-primary{background:var(--accent);color:white;border-color:var(--accent)}
  .at-top{height:43px;flex:none;display:flex;align-items:center;gap:22px;padding:0 16px;border-bottom:1px solid var(--line)}.at-brand{font-size:18px;font-weight:800;letter-spacing:-.5px;color:var(--accent)}.at-nav{color:var(--muted);font-size:12px}.at-account{margin-left:auto;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:190px}
  .at-route{flex:none;padding:9px 16px;background:color-mix(in srgb,var(--accent) 5%,var(--panel));border-bottom:1px solid var(--line);display:flex;align-items:center;gap:12px}.at-route h2{font-size:17px;margin:0 0 2px;line-height:1.2}.at-muted{color:var(--muted);font-size:12px}.at-chip{display:inline-block;border:1px solid var(--line);border-radius:15px;padding:2px 9px;font-size:11px;white-space:nowrap}.at-route .at-chip{margin-left:auto}
  .at-content{flex:1;min-height:0;display:flex;position:relative;overflow:hidden}.at-rail{flex:none;width:188px;padding:12px;border-right:1px solid var(--line);overflow:auto;overscroll-behavior:contain}.at-rail h3{font-size:13px;margin:0 0 10px}.at-rail p{margin:6px 0 12px}.at-check{display:flex;align-items:center;gap:6px;margin:9px 0;line-height:1.25;font-size:12px;cursor:pointer}.at-check input{accent-color:var(--accent);flex:none;margin:0}
  .at-field{margin:10px 0;position:relative}.at-field>span{display:block;font-size:11px;color:var(--muted);margin-bottom:4px}.at-field>button{width:100%;text-align:left;display:flex;justify-content:space-between;gap:6px;min-height:31px}.at-pop{position:absolute;left:0;right:0;top:100%;margin-top:3px;background:var(--panel);border:1px solid var(--line);padding:4px;border-radius:7px;z-index:20;box-shadow:0 6px 20px #0003;max-height:160px;overflow:auto}.at-pop button{display:block;width:100%;text-align:left;border:0;padding:6px}.at-pop button.on{background:color-mix(in srgb,var(--accent) 15%,var(--panel));color:var(--accent)}
  .at-main{flex:1;min-width:0;min-height:0;display:flex;flex-direction:column}.at-toolbar{padding:7px 12px;flex:none;display:flex;align-items:center;gap:8px;border-bottom:1px solid var(--line)}.at-toolbar .at-field{margin:0 0 0 auto;width:148px}.at-toolbar .at-field>span{display:none}
  .at-pane{flex:1;min-height:0;overflow:auto;overscroll-behavior:contain;padding:12px;scrollbar-width:thin;touch-action:pan-y}.at-footer{flex:none;min-height:56px;border-top:1px solid var(--line);padding:8px 14px;display:flex;align-items:center;gap:12px;background:var(--panel)}.at-footer>div:first-child{flex:1;min-width:0}.at-footer button{flex:none}.at-footer strong{font-size:14px}.at-status{font-size:11px;color:var(--muted);margin-top:2px}.at-notice{color:var(--accent);font-size:11px}
  .at-seat-wrap{max-width:360px;margin:0 auto;border:1px solid var(--line);border-radius:80px 80px 16px 16px;padding:24px 18px 18px;background:color-mix(in srgb,var(--fg) 2%,var(--panel))}.at-cockpit{text-align:center;font-size:10px;color:var(--muted);margin-bottom:13px;letter-spacing:2px}.at-seat-row{display:grid;grid-template-columns:repeat(3,minmax(25px,1fr)) 24px repeat(3,minmax(25px,1fr));gap:6px;align-items:center;margin-bottom:7px}.at-seat-row.exit{border-top:1px dashed var(--accent);padding-top:6px}.at-seat-row.exit::before{content:'EXIT';grid-column:1/-1;text-align:center;font-size:9px;letter-spacing:3px;color:var(--muted)}.at-seat-row button{height:31px;padding:0;font-size:11px;border-radius:6px 6px 3px 3px;border-bottom-width:3px}.at-seat-row button:disabled{background:color-mix(in srgb,var(--fg) 12%,var(--panel));color:var(--muted)}.at-seat-row button.companion{border-color:var(--accent);opacity:1}.at-rownum{text-align:center;font-size:11px;color:var(--muted)}.at-seat-head{display:flex;justify-content:space-around;color:var(--muted);font-size:11px;margin-bottom:9px}
  .at-legend{display:flex;flex-wrap:wrap;gap:9px;margin-bottom:12px;font-size:10px;color:var(--muted)}.at-legend i{display:inline-block;width:10px;height:10px;border:1px solid var(--line);border-radius:2px;vertical-align:middle}.at-legend i.sel{background:var(--accent)}.at-legend i.occ{background:color-mix(in srgb,var(--fg) 20%,var(--panel))}
  .at-dates{display:flex;gap:8px;padding:10px 12px;border-bottom:1px solid var(--line)}.at-dates button{flex:1;text-align:left;font-size:12px}.at-dates small{display:block;color:var(--muted);font-size:10px}.at-calbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}.at-months{display:grid;grid-template-columns:1fr 1fr;gap:16px}.at-month-title{text-align:center;font-weight:700;margin:0 0 8px}.at-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:2px;grid-auto-rows:28px}.at-grid>span{text-align:center;font-size:10px;color:var(--muted);align-self:center}.at-grid button{padding:0;border-color:transparent;font-size:12px;border-radius:4px}.at-grid button.inrange{background:color-mix(in srgb,var(--accent) 14%,var(--panel));border-radius:0}.at-grid button:disabled{text-decoration:line-through}.at-calnote{margin-top:10px;color:var(--muted);font-size:11px;line-height:1.5}.at-empty{text-align:center;padding:30px 10px;color:var(--muted)}
  .at-card{border:1px solid var(--line);border-radius:9px;padding:12px;margin-bottom:9px;display:flex;align-items:center;gap:12px;min-height:96px;background:var(--panel)}.at-card.chosen{border-color:var(--accent);box-shadow:inset 3px 0 var(--accent)}.at-card-main{flex:1;min-width:0}.at-card h3{margin:0 0 5px;font-size:14px}.at-card-meta{font-size:11px;color:var(--muted);line-height:1.6}.at-card-price{text-align:right;flex:none}.at-card-price strong{display:block;font-size:18px}.at-card-price button{margin-top:5px;font-size:12px}.at-airline{width:34px;height:34px;display:grid;place-items:center;background:color-mix(in srgb,var(--accent) 12%,var(--panel));border-radius:7px;color:var(--accent);font-weight:800;flex:none}.at-tags{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px}.at-tags span{font-size:10px;padding:1px 5px;border-radius:3px;background:color-mix(in srgb,var(--fg) 5%,var(--panel))}
  .at-track{position:relative;height:8px;margin:20px 9px 17px;background:var(--line);border-radius:4px;touch-action:none}.at-thumb{position:absolute;width:18px;height:18px;border:2px solid var(--panel);border-radius:50%;background:var(--accent);box-shadow:0 0 0 1px var(--accent);cursor:ew-resize}.at-range-label{font-weight:600;font-size:12px}.at-summary{max-width:620px;margin:0 auto}.at-summary h3{margin:0 0 12px;font-size:18px}.at-summary dl{display:grid;grid-template-columns:1fr 1fr;gap:10px 20px;margin:16px 0;padding:16px;border:1px solid var(--line);border-radius:9px}.at-summary dt{color:var(--muted)}.at-summary dd{margin:0;text-align:right;font-weight:650}.at-summary p{line-height:1.6}.at-confirm{padding:9px 12px;border-radius:7px;border:1px solid var(--line);color:var(--muted);font-size:12px}.at-manage{border:1px solid var(--line);padding:16px;border-radius:10px;margin:10px auto;max-width:610px}.at-manage h3{margin:0 0 12px}.at-manage button{margin-top:12px}
  .at-app.compact .at-nav{display:none}.at-app.compact .at-account{max-width:110px}.at-app.compact .at-rail{width:165px;padding:9px}.at-app.compact .at-card{gap:7px;padding:9px}.at-app.compact .at-airline{display:none}.at-app.compact .at-months{gap:8px}.at-app.compact .at-route{padding:8px 12px}.at-app.compact .at-route h2{font-size:15px}.at-app.compact .at-grid{grid-auto-rows:25px}.at-app.compact .at-card h3{font-size:12px}.at-app.compact .at-card-price strong{font-size:15px}.at-app.compact .at-rail.seat-info{width:150px}
  .at-app{border-radius:8px;font-size:13px;--at-soft:color-mix(in srgb,var(--fg) 4%,var(--panel));--at-green:color-mix(in srgb,#258452 75%,var(--fg));font-variant-numeric:tabular-nums}
  .at-ico{width:16px;height:16px;flex:none;vertical-align:middle;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;pointer-events:none}
  .at-app button{display:inline-flex;align-items:center;justify-content:center;gap:6px;border-radius:5px}.at-top{height:46px;gap:16px}.at-brand{display:flex;gap:7px;align-items:center;letter-spacing:-.7px;font-size:21px}.at-brand>.at-ico{width:25px;height:25px}
  .at-nav{display:flex;align-self:stretch;gap:4px}.at-app .at-nav button{border:0;border-radius:0;background:transparent;padding:0 10px;font-size:12px;color:var(--muted)}.at-app .at-nav button.active{border-bottom:3px solid var(--accent);color:var(--fg);font-weight:700}
  .at-account{display:flex;gap:6px;align-items:center;max-width:none;overflow:visible}.at-app .at-iconbtn{position:relative;width:31px;height:31px;padding:0;border:0;background:transparent}.at-dot{position:absolute;top:2px;right:2px;width:6px;height:6px;background:var(--accent);border:1px solid var(--panel);border-radius:50%}.at-avatar{display:grid;place-items:center;width:28px;height:28px;border-radius:50%;background:var(--at-soft);font-weight:750;font-size:11px;color:var(--fg)}
  .at-route{background:var(--panel);padding:9px 16px;gap:14px;min-height:59px}.at-route h2{font-size:18px}.at-breadcrumb{display:flex;gap:6px;align-items:center;color:var(--muted);font-size:10px;margin-bottom:4px}.at-breadcrumb .at-ico{width:10px;height:10px}.at-tripbrief{margin-left:auto;display:flex;gap:12px;align-items:center;font-size:11px;flex:none}.at-tripbrief>div{border-left:1px solid var(--line);padding-left:12px}.at-tripbrief small{display:block;color:var(--muted);font-size:10px}
  .at-progress{display:flex;align-items:center;gap:16px;flex:none;height:28px;padding:0 16px;border-bottom:1px solid var(--line);background:var(--at-soft);font-size:10px;color:var(--muted)}.at-progress span{display:flex;align-items:center;gap:5px}.at-stepnum{border:1px solid var(--line);display:grid;place-items:center;border-radius:50%;width:16px;height:16px;font-size:9px}.at-progress .current{color:var(--accent);font-weight:700}.at-progress .current .at-stepnum{background:var(--accent);color:#fff;border-color:var(--accent)}.at-progress>.at-muted{margin-left:auto;font-size:10px}
  .at-worknav{width:154px;flex:none;border-right:1px solid var(--line);background:var(--at-soft);padding:14px 10px;overflow:auto;font-size:11px}.at-worknav h4{font-size:10px;letter-spacing:.07em;text-transform:uppercase;color:var(--muted);margin:5px 7px 10px}.at-worknav>button{display:flex;width:100%;justify-content:flex-start;margin:3px 0;background:transparent;border:0;padding:8px}.at-worknav .navon{background:var(--panel);border:1px solid var(--line);font-weight:650}.at-worknav .at-recent{padding:10px 7px;border-top:1px solid var(--line);margin-top:12px}.at-recent p{margin:4px 0 12px;font-size:10px;line-height:1.5;color:var(--muted)}
  .at-rail{width:202px;background:var(--panel);padding:12px}.at-rail h3{margin-top:0;display:flex;justify-content:space-between;align-items:center}.at-rail h4{font-size:11px;margin:15px 0 8px}.at-rail summary{font-size:11px;font-weight:650;margin:12px 0 7px;cursor:pointer}.at-rail details{border-top:1px solid var(--line);margin-top:12px}.at-facetrow{display:flex;align-items:center;gap:6px;justify-content:space-between;color:var(--muted);font-size:11px;margin:7px 0}.at-app .at-textbtn{padding:0;border:0;background:transparent;color:var(--accent);font-size:11px;text-align:left}.at-check{justify-content:space-between;gap:7px;margin:10px 0}.at-check>span{flex:1}.at-count{font-size:10px;color:var(--muted)}.at-histogram{display:block;width:100%;height:25px;margin-top:8px;fill:color-mix(in srgb,var(--accent) 25%,var(--panel))}.at-track{margin-top:5px}.at-field>button{justify-content:space-between}.at-pop button{justify-content:flex-start}
  .at-toolbar{gap:8px;padding:7px 12px;min-height:42px}.at-toolbar strong{font-size:12px}.at-filterline{flex:none;padding:6px 12px;border-bottom:1px solid var(--line);display:flex;gap:5px;align-items:center;overflow:auto;white-space:nowrap;min-height:29px;background:var(--at-soft)}.at-filterline>.at-muted{font-size:10px}.at-app .at-filterchip{padding:2px 6px;font-size:10px;background:var(--panel);border-radius:12px;flex:none}.at-filterchip .at-ico{width:10px;height:10px}
  .at-pane{background:var(--at-soft);padding:12px}.at-card{position:relative;min-height:136px;border-radius:7px;align-items:stretch;gap:12px;padding:12px;margin-bottom:10px}.at-card h3{font-size:15px;line-height:1.25}.at-card-price{min-width:99px;display:flex;flex-direction:column;justify-content:center;align-items:flex-end;border-left:1px solid var(--line);padding-left:12px}.at-card-price strong{font-size:21px;letter-spacing:-.6px}.at-card-price .at-muted{font-size:10px}.at-card-price button{min-width:84px}.at-carrier{display:flex;gap:7px;align-items:center;font-size:11px;margin-bottom:9px}.at-airline{width:26px;height:26px;border-radius:5px;font-size:10px}.at-itinerary{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:5px 0 8px;max-width:450px}.at-time strong{display:block;font-size:19px;line-height:1.1;letter-spacing:-.6px}.at-time small{font-size:10px;color:var(--muted)}.at-duration{flex:1;max-width:150px;text-align:center;font-size:10px;color:var(--muted);position:relative}.at-flightline{display:flex;align-items:center;margin:2px 0;color:var(--muted)}.at-flightline::before,.at-flightline::after{content:'';height:1px;background:var(--line);flex:1}.at-flightline .at-ico{width:12px;height:12px;margin:0 3px}.at-services{display:flex;gap:12px;align-items:center;flex-wrap:wrap;font-size:10px;color:var(--muted);line-height:1.5}.at-services span{display:inline-flex;align-items:center;gap:4px}.at-services .at-ico{width:12px;height:12px}.at-details{font-size:11px;color:var(--muted);border-top:1px solid var(--line);padding-top:8px;margin-top:8px;line-height:1.6}
  .at-propertyart{width:108px;min-height:115px;flex:none;overflow:hidden;border-radius:5px;position:relative;background:#dce8e6}.at-propertyart>svg{display:block;width:100%;height:100%;position:absolute;inset:0}.at-propertyart .at-iconbtn{position:absolute;right:4px;top:4px;background:var(--panel);border:1px solid var(--line);border-radius:50%;width:25px;height:25px}.at-hotelcard{min-height:160px}.at-stars{display:inline-flex;gap:1px;color:#b18432;margin-bottom:4px}.at-stars .at-ico{width:10px;height:10px;fill:currentColor;stroke-width:1}.at-rating{display:inline-flex;align-items:center;gap:5px;font-size:10px;margin:4px 0}.at-rating>b{background:var(--accent);color:#fff;padding:3px 5px;border-radius:5px 5px 5px 0;font-size:11px}.at-location{font-size:10px;color:var(--muted);margin:3px 0 5px}.at-roomtype{font-size:11px;font-weight:600;margin-top:6px}.at-positive{color:var(--at-green);font-size:10px;line-height:1.6}.at-tags{gap:3px;margin-top:4px}.at-tags span{font-size:9px;background:var(--at-soft)}
  .at-sidepanel{width:219px;flex:none;border-left:1px solid var(--line);padding:12px;overflow:auto;background:var(--panel)}.at-sidepanel h3{font-size:13px;margin:0 0 9px}.at-sidepanel h4{font-size:11px;margin:12px 0 6px}.at-sidepanel .at-propertyart{width:100%;height:100px;min-height:100px;margin-bottom:10px}.at-sidepanel p{font-size:11px;line-height:1.5;margin:7px 0}.at-sidepanel dl{display:grid;grid-template-columns:1fr auto;gap:7px;font-size:11px;margin:12px 0}.at-sidepanel dt{color:var(--muted)}.at-sidepanel dd{margin:0;text-align:right;font-weight:600}.at-rule{height:1px;background:var(--line);margin:12px 0}.at-totalrow{display:flex;justify-content:space-between;font-size:12px;font-weight:750;border-top:1px solid var(--line);padding-top:10px;margin-top:8px}.at-assignment{padding:10px;border:1px solid var(--accent);border-radius:6px;margin:10px 0;background:color-mix(in srgb,var(--accent) 6%,var(--panel))}.at-assignment strong{display:block;margin:5px 0}.at-sectionlabel{font-size:9px;text-transform:uppercase;letter-spacing:.07em;color:var(--muted)}
  .at-seat-wrap{max-width:346px;border-radius:65px 65px 18px 18px;padding:18px 16px;background:var(--panel);position:relative}.at-cockpit{margin-bottom:10px}.at-equipment{display:flex;align-items:center;justify-content:space-between;margin:8px 12px 13px;color:var(--muted);font-size:9px}.at-seat-head{display:grid;grid-template-columns:repeat(3,1fr) 24px repeat(3,1fr);gap:5px;text-align:center;margin-bottom:7px}.at-seat-row{gap:5px;margin-bottom:5px}.at-seat-row button{height:37px;display:flex;flex-direction:column;gap:0;position:relative;line-height:1.15;background:color-mix(in srgb,var(--accent) 5%,var(--panel));border-color:color-mix(in srgb,var(--accent) 30%,var(--line))}.at-seat-row button small{font-size:8px;color:var(--muted)}.at-seat-row button.on{background:var(--accent)}.at-seat-row button.on small{color:#fff}.at-seat-row button .at-ico{width:10px;height:10px;position:absolute;top:1px;right:1px}.at-seat-row button:disabled{opacity:1;color:var(--muted);background:var(--at-soft);border-color:var(--line)}.at-seat-row button.companion{border-color:var(--accent);color:var(--accent)}.at-seat-infohead{padding:8px 12px;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;align-items:center;font-size:11px;background:var(--panel)}
  .at-stayintro{padding:10px 12px;border-bottom:1px solid var(--line);display:flex;gap:10px;align-items:center;background:var(--panel)}.at-stayintro>.at-ico{color:var(--accent);width:24px;height:24px}.at-stayintro strong{font-size:13px;display:block}.at-stayintro small{font-size:10px;color:var(--muted)}.at-dates{padding:8px 12px;background:var(--panel)}.at-dates button{display:block;position:relative;padding:6px 9px}.at-dates button>.at-ico{position:absolute;right:8px;top:14px;color:var(--muted)}.at-dates button small{font-size:9px}.at-calbar{margin-bottom:9px}.at-months{background:var(--panel);padding:10px;border:1px solid var(--line);border-radius:7px;gap:18px}.at-grid{grid-auto-rows:27px}.at-month-title{font-size:12px}.at-calnote{display:flex;gap:6px;align-items:flex-start;font-size:10px}.at-stayterms{background:var(--panel);border:1px solid var(--line);padding:10px;border-radius:6px;font-size:11px;margin-top:12px;line-height:1.6}.at-empty{max-width:440px;margin:auto;padding:30px 12px}.at-empty>.at-ico{width:32px;height:32px;color:var(--accent);margin-bottom:8px}.at-empty h3{font-size:16px;color:var(--fg);margin:4px 0 8px}.at-empty p{font-size:12px;line-height:1.6}.at-empty button{margin-top:8px}
  .at-manage{max-width:850px;padding:0;background:var(--panel);margin:0 auto 12px}.at-managehead{padding:12px 14px;display:flex;justify-content:space-between;gap:12px;align-items:center;border-bottom:1px solid var(--line)}.at-manage h3{margin:0;font-size:15px}.at-tagstatus{display:inline-flex;align-items:center;gap:4px;border-radius:4px;padding:3px 6px;background:color-mix(in srgb,#258452 10%,var(--panel));font-size:10px;color:var(--at-green)}.at-tagstatus .at-ico{width:12px;height:12px}.at-managebody{padding:12px 14px}.at-manage .at-itinerary{max-width:none;margin:12px 0}.at-bookingtools{display:flex;gap:14px;border-bottom:1px solid var(--line);padding:0 12px;font-size:11px;color:var(--muted)}.at-bookingtools span{padding:9px 0}.at-bookingtools span:first-child{color:var(--accent);border-bottom:2px solid var(--accent)}.at-module{padding:12px 14px;border:1px solid var(--line);border-radius:7px;background:var(--panel);margin:10px 0;line-height:1.5;font-size:11px}.at-module h4{display:flex;align-items:center;gap:6px;font-size:12px;margin:0 0 8px}.at-module p{margin:5px 0}.at-servicegrid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.at-servicegrid>.at-module{margin:0}.at-alert{display:flex;gap:7px;align-items:flex-start;font-size:11px;line-height:1.4;padding:9px 12px;border:1px solid var(--line);border-radius:6px;background:var(--panel);margin:0 0 10px;color:var(--muted)}.at-alert .at-ico{color:var(--accent)}
  .at-summary{max-width:760px}.at-summary h3{font-size:19px;margin-bottom:6px}.at-summary dl{background:var(--panel);margin:12px 0;padding:14px;gap:8px 20px;font-size:12px}.at-confirm{display:flex;gap:8px;line-height:1.5;background:var(--panel)}.at-confirm .at-ico{color:var(--at-green);margin-top:1px}.at-footer{min-height:55px}.at-footer strong{font-size:13px}.at-footer .at-primary{min-height:34px}.at-footer .at-status{display:flex;align-items:center;gap:5px;font-size:10px}.at-footer .at-status .at-ico{width:11px;height:11px}
  .at-drawer{position:absolute;top:43px;right:10px;width:290px;max-width:calc(100% - 20px);max-height:calc(100% - 60px);overflow:auto;background:var(--panel);border:1px solid var(--line);border-radius:7px;padding:12px;box-shadow:0 8px 28px #0003;z-index:30}.at-drawer h3{font-size:13px;margin:0 0 12px}.at-drawer p{font-size:11px;line-height:1.6;color:var(--muted)}.at-drawer>button{float:right}
  .at-app.compact .at-account{max-width:none}.at-app.compact .at-accountname,.at-app.compact .at-tripbrief,.at-app.compact .at-progress>.at-muted{display:none}.at-app.compact .at-top{gap:8px;padding:0 11px}.at-app.compact .at-brand{font-size:19px}.at-app.compact .at-progress{gap:8px;font-size:9px;padding:0 11px}.at-app.compact .at-card{padding:9px;gap:9px;min-height:137px}.at-app.compact .at-propertyart{width:68px;min-height:113px}.at-app.compact .at-card-price{min-width:72px;padding-left:7px}.at-app.compact .at-card-price button{min-width:63px;padding:6px 7px;font-size:11px}.at-app.compact .at-card-price strong{font-size:17px}.at-app.compact .at-card h3{font-size:13px}.at-app.compact .at-time strong{font-size:16px}.at-app.compact .at-services{gap:6px}.at-app.compact .at-hotelcard .at-tags{display:none}.at-app.compact .at-duration{min-width:45px}.at-app.compact .at-months{padding:7px;gap:10px}.at-app.compact .at-grid{grid-auto-rows:26px}.at-app.compact .at-seat-infohead>span{font-size:10px}.at-app.compact .at-footer strong{font-size:11px}.at-app.compact .at-footer{padding:8px;gap:7px}.at-app.compact .at-footer>button{font-size:11px;padding:6px 8px}.at-app.compact .at-servicegrid{grid-template-columns:1fr}
  .at-sidepanel .at-services{flex-wrap:nowrap;align-items:flex-start;gap:6px;font-size:10px;margin:6px 0}.at-sidepanel .at-services>span{min-width:0;display:block}.at-location{display:flex;align-items:center;gap:3px}.at-location .at-ico{width:12px;height:12px}.at-sectionlabel:has(>.at-ico),div.at-muted:has(>.at-ico){display:flex;align-items:center;gap:5px}.at-worknav>button{font-size:11px;text-align:left}.at-app summary{list-style:none;display:flex;align-items:center;gap:5px}.at-app summary::-webkit-details-marker{display:none}.at-app summary>.at-ico{width:12px;height:12px}.at-app details[open]>summary>.at-ico{transform:rotate(180deg)}
  `;
  env.widget({task: 'use-travel', site: 'base', name: 'classic', scenarios: ['seat', 'daterange', 'flights', 'hotels', 'change'],
    render(ctx) {
      const {spec: s, util: U} = ctx, F = env.taskDef, C = env.content;
      ctx.css('app-travel-classic', CSS);
      const el = (tag, cls, parent, text) => U.el(tag, cls, parent, text);
      const ns = 'http://www.w3.org/2000/svg';
      function svg(parent, name, label) {
        const node = document.createElementNS(ns, 'svg');
        node.setAttribute('viewBox','0 0 24 24');node.classList.add('at-ico');
        node.setAttribute('aria-hidden', label ? 'false' : 'true');
        if (label) node.setAttribute('aria-label',label);
        const path = document.createElementNS(ns,'path');path.setAttribute('d',ICONS[name] || ICONS.info);node.append(path);parent.append(node);return node;
      }
      const decoration = ctx.rng.fork('travel-details'), bankOpts = {csplit:s.csplit};
      const details = {property:C.pick(decoration,F.helpers.HOTEL_NAMES,bankOpts),street:`${decoration.int(12,98)} ${C.pick(decoration,C.STREET_NAMES,bankOpts)}`,
        room:decoration.pick(['Superior double room','Classic king room','Deluxe queen room']),flight:s.flights[0],
        otherTrips:C.sample(decoration,C.CITIES.filter(x=>x.iata),3,bankOpts),member:decoration.int(2100,8700),
        card:C.digits(decoration,4),email:C.emailAddress(decoration,{first:s.passenger.split(' ')[0],last:s.passenger.split(' ').slice(1).join(' ')})};
      function hotelArt(parent, id, save = false) {
        const art = el('div','at-propertyart',parent), hue = U.hash32(id) % 70 + 160;
        const scene = document.createElementNS(ns,'svg');scene.setAttribute('viewBox','0 0 160 160');scene.setAttribute('preserveAspectRatio','xMidYMid slice');
        scene.setAttribute('role','img');scene.setAttribute('aria-label','Hotel exterior illustration');
        // Original architectural thumbnail: no remote assets or embedded icon fonts.
        const shape = (tag, attrs) => {const n=document.createElementNS(ns,tag);for(const [k,v]of Object.entries(attrs))n.setAttribute(k,String(v));scene.append(n);};
        shape('rect',{width:160,height:160,fill:`hsl(${hue} 25% 85%)`});
        shape('circle',{cx:136,cy:26,r:20,fill:'#fff8dc'});
        shape('path',{d:'M0 92 35 73 80 88 120 64 160 88V160H0Z',fill:`hsl(${hue} 19% 64%)`});
        shape('rect',{x:18,y:36,width:115,height:113,fill:'#e1d5bd'});
        shape('rect',{x:18,y:32,width:115,height:7,fill:'#6c766f'});
        shape('rect',{x:111,y:48,width:30,height:101,fill:'#b8aa91'});
        for(let y=49;y<130;y+=24)for(let x=28;x<110;x+=23){
          shape('rect',{x,y,width:13,height:17,fill:'#51646a'});
          shape('path',{d:`M${x+6} ${y}v17m-6-8h13`,stroke:'#b9c5bb','stroke-width':1});
          shape('rect',{x:x-2,y:y+17,width:17,height:2,fill:'#a79983'});
        }
        shape('rect',{x:62,y:123,width:31,height:27,fill:'#465852'});
        shape('path',{d:'m54 124 13-9h26l12 9Z',fill:'#647e74'});
        shape('path',{d:'M0 149h160v11H0',fill:'#bfc3b3'});
        for(const x of [8,149]){shape('rect',{x:x-2,y:116,width:4,height:36,fill:'#857960'});shape('ellipse',{cx:x,cy:111,rx:14,ry:29,fill:'#5d7965'});}
        art.append(scene);
        if(save){const b=plainButton(art,'','heart',()=>{const saved=ctx.model.travelSaved || [];ctx.patch({travelSaved:saved.includes(id)?saved.filter(x=>x!==id):[...saved,id]});paint();},'at-iconbtn');b.setAttribute('aria-label',(ctx.model.travelSaved || []).includes(id)?'Remove from saved properties':'Save property');if((ctx.model.travelSaved || []).includes(id))b.style.color='var(--accent)';}
        return art;
      }
      function plainButton(parent, text, icon, action, cls = '') {
        const b=el('button',cls,parent);b.type='button';if(icon)svg(b,icon);if(text)el('span','',b,text);if(action)b.addEventListener('click',action);return b;
      }
      function panel(name) {ctx.patch({travelPanel:ctx.model.travelPanel===name?'':name});paint();}
      function resetFilters() {
        ctx.patch({filters:{nonstop:false,alliance:'',before:1440,min:0,max:s.maxPrice,rating:0,amenities:[]},scroll:0,filterScroll:0,booked:false,menu:''});paint();
      }
      const app = el('section', `at-app${ctx.size.width < 700 ? ' compact' : ''}`, ctx.stage);
      app.setAttribute('aria-label', 'Wayfarer travel booking');
      const top = el('header', 'at-top', app);
      const brand=el('div','at-brand',top);svg(brand,'plane');el('span','',brand,'wayfarer');
      const nav=el('nav','at-nav',top);nav.setAttribute('aria-label','Travel services');
      for(const [text,icon]of [['Flights','plane'],['Stays','hotel'],['My trips','bag']])plainButton(nav,text,icon,()=>panel(text),text===(['hotels','daterange'].includes(s.scenario)?'Stays':s.scenario==='change'?'My trips':'Flights')?'active':'');
      const account=el('div','at-account',top);
      const help=plainButton(account,'','help',()=>panel('Support'),'at-iconbtn');help.setAttribute('aria-label','Help and support');
      const bell=plainButton(account,'','bell',()=>panel('Notifications'),'at-iconbtn');bell.setAttribute('aria-label','Notifications, 2 unread');el('i','at-dot',bell);
      el('span','at-accountname at-muted',account,'USD');
      const profile=plainButton(account,'',null,()=>panel('Account'),'at-iconbtn');profile.setAttribute('aria-label','Your account');el('span','at-avatar',profile,s.passenger.split(' ').map(x=>x[0]).slice(0,2).join(''));
      const route = el('div', 'at-route', app), title = el('div', '', route);
      const titles = {seat: 'Choose your seat', daterange: 'Plan your stay', flights: 'Find your flight', hotels: 'Find a place to stay', change: 'Manage your booking'};
      const crumbs=el('div','at-breadcrumb',title);el('span','',crumbs,'My trips');svg(crumbs,'chevron');el('span','',crumbs,['hotels','daterange'].includes(s.scenario)?s.dest.city:`${s.origin.iata} - ${s.dest.iata}`);
      el('h2', '', title, titles[s.scenario]);
      const brief=el('div','at-tripbrief',route);
      for(const [label,value]of [['Destination',s.dest.city],['Travelers','1 adult'],[s.scenario==='change'?'Booking':['hotels','daterange'].includes(s.scenario)?'Rooms':'Fare',s.scenario==='change'?s.reference:['hotels','daterange'].includes(s.scenario)?'1 room':'Economy Standard']]){const b=el('div','',brief);el('small','',b,label);el('strong','',b,value);}
      const progress=el('div','at-progress',app);
      const content = el('div', 'at-content', app), footer = el('footer', 'at-footer', app);
      let pane, rail, painting = false;
      const tracked = [], filterTracked = [];
      function register(t, node, inPane = false) {
        refs.set(F.helpers.key(t), node);
        if (inPane) tracked.push([t, node]);
        if (rail && rail.contains(node)) filterTracked.push([t, node]);
        return node;
      }
      function act(t) {
        if (t.control === 'book' && s.judge && s.judge.mode === 'confirm') ctx.flag('irreversible');
        ctx.update(F.helpers.apply(ctx.model, s, t)); paint();
      }
      function button(parent, text, target, cls = '', inPane = false) {
        const b = register(target, el('button', cls, parent, text), inPane);
        b.type = 'button'; b.addEventListener('click', () => act(target)); return b;
      }
      function line(parent, icon, text, cls='at-services') {
        const row=el('div',cls,parent);svg(row,icon);el('span','',row,text);return row;
      }
      function worknav() {
        const nav=el('aside','at-worknav',content);el('h4','',nav,'Your workspace');
        for(const [name,icon]of [['Upcoming trips','calendar'],['Saved properties','heart'],['Price alerts','bell'],['Wallet & receipts','card'],['Traveler profiles','user']])
          plainButton(nav,name,icon,()=>panel(name),name==='Upcoming trips'?'navon':'');
        const recent=el('div','at-recent',nav);el('h4','',recent,'Recent trips');
        for(let i=0;i<details.otherTrips.length;i++){el('strong','',recent,details.otherTrips[i].city);el('p','',recent,`${F.helpers.fmtDate(C.addDays(s.calendar.base,-18-i*32))}\n${i===0?'Receipt available':'Completed'}`);}
        el('h4','',nav,'Wayfarer rewards');el('p','at-muted',nav,`${details.member.toLocaleString('en-US')} points available`);
      }
      function sidepanel(m) {
        const side=el('aside','at-sidepanel',content);side.setAttribute('aria-label','Trip summary');
        if(s.scenario==='daterange') {
          hotelArt(side,details.property);el('h3','',side,details.property);line(side,'pin',`${details.street}, ${s.dest.city}`,'at-services');
          el('div','at-rating',side,`8.8 / 10 · Excellent · 624 reviews`);el('div','at-rule',side);
          el('h4','',side,details.room);el('p','at-muted',side,'1 room · 1 adult · 1 large bed');
          const dl=el('dl','',side),n=F.helpers.nights(m.start,m.end);
          for(const [k,v]of [['Check-in',F.helpers.fmtDate(m.start)],['Check-out',F.helpers.fmtDate(m.end)],['Nightly rate',F.helpers.money(s.nightly)],['Nights',String(n)]]){el('dt','',dl,k);el('dd','',dl,v);}
          const total=el('div','at-totalrow',side);el('span','',total,'Stay total');el('span','',total,F.helpers.money(n*s.nightly));
          el('p','at-muted',side,'Includes taxes and property fees. No deposit required.');line(side,'shield','Free cancellation before check-in','at-positive');
        } else {
          el('h3','',side,s.scenario==='change'?'Change summary':'Your flight');
          el('div','at-sectionlabel',side,'Economy Standard');el('p','',side,`${s.origin.city} to ${s.dest.city}`);
          el('p','at-muted',side,`${details.flight.airline} · ${details.flight.no}`);line(side,'calendar',F.helpers.fmtDate(s.scenario==='change'?m.date:s.original.date),'at-services');
          const dl=el('dl','',side);
          const rows=s.scenario==='change'?[['Original date',F.helpers.fmtDate(s.original.date)],['Original seat',s.original.seat],['New seat',m.seat || 'Not selected'],['Change fee',F.helpers.money(s.changeFee)]]
            :[['Traveler',s.passenger],['Seat',m.seat || 'Not selected'],['Seat fee',F.helpers.money((s.seats.find(x=>x.id===m.seat)||{}).fare || 0)]];
          for(const [k,v]of rows){el('dt','',dl,k);el('dd','',dl,v);}
          el('div','at-rule',side);el('h4','',side,'Included with your fare');line(side,'bag','1 cabin bag + 1 checked bag');line(side,'coffee','Complimentary refreshments');line(side,'shield','Changes permitted; fees may apply');
          el('div','at-rule',side);el('h4','',side,'Need a hand?');el('p','at-muted',side,'Travel support is available before and during your trip.');plainButton(side,'Contact travel support','help',()=>panel('Support'),'at-textbtn');
        }
      }
      function drawPanel(m) {
        for(const n of app.querySelectorAll(':scope > .at-drawer'))n.remove();
        if(!m.travelPanel)return;
        const drawer=el('aside','at-drawer',app);drawer.setAttribute('aria-label',m.travelPanel);
        plainButton(drawer,'','close',()=>panel(m.travelPanel),'at-iconbtn').setAttribute('aria-label','Close panel');
        el('h3','',drawer,m.travelPanel);
        if(m.travelPanel==='Notifications'||m.travelPanel==='Price alerts') {
          line(drawer,'bell','Your price alerts are up to date.');el('p','',drawer,`Flights to ${details.otherTrips[0].city}: no price change since your last search.`);
          line(drawer,'card','Receipt ready');el('p','',drawer,`Your ${details.otherTrips[1].city} trip receipt is available in Wallet & receipts.`);
        }else if(['My trips','Upcoming trips','Flights','Stays'].includes(m.travelPanel)) {
          for(const city of details.otherTrips){el('h4','',drawer,city.city);el('p','',drawer,`${F.helpers.fmtDate(C.addDays(s.calendar.base,-20))} · Completed · Receipt available`);}
        }else if(m.travelPanel==='Account'||m.travelPanel==='Traveler profiles') {
          el('strong','',drawer,s.passenger);el('p','',drawer,details.email);el('p','',drawer,`Rewards balance: ${details.member} points. Preferred currency: USD.`);
        }else if(m.travelPanel==='Saved properties')el('p','',drawer,`${(m.travelSaved || []).length} saved properties. Use the heart on a property to save it for later.`);
        else if(m.travelPanel==='Wallet & receipts')el('p','',drawer,`Travel wallet ending ${details.card}. Receipts from completed trips are retained in your account.`);
        else {el('p','',drawer,'Manage your itinerary, review baggage policies, or get help with a booking.');el('p','',drawer,`Booking reference: ${s.reference}. Support hours: every day, 06:00–23:00.`);}
      }
      function visibility() {
        if (!pane) return;
        const r = pane.getBoundingClientRect(), visible = [], above = [];
        for (const [t, node] of tracked) {
          const b = node.getBoundingClientRect();
          if (b.top >= r.top + 1 && b.bottom <= r.bottom - 1) visible.push(F.helpers.key(t));
          else if (b.top < r.top + 1) above.push(F.helpers.key(t));
        }
        const filterVisible = [], filterAbove = [];
        if (rail) {
          const rr = rail.getBoundingClientRect();
          for (const [t, node] of filterTracked) {
            const b = node.getBoundingClientRect();
            if (b.top >= rr.top + 1 && b.bottom <= rr.bottom - 1) filterVisible.push(F.helpers.key(t));
            else if (b.top < rr.top + 1) filterAbove.push(F.helpers.key(t));
          }
        }
        ctx.patch({scroll: pane.scrollTop, visible, above, filterVisible, filterAbove, filterScroll: rail ? rail.scrollTop : 0,
          paneH: pane.clientHeight, filterH: rail ? rail.clientHeight : 0});
      }
      function newPane(parent) {
        pane = el('div', 'at-pane', parent); register({pane: true}, pane);
        pane.addEventListener('scroll', () => { if (!painting) visibility(); });
        if(ctx.model.notice && /unavailable|another date/i.test(ctx.model.notice))line(pane,'info',ctx.model.notice,'at-alert');
        return pane;
      }
      function dropdown(parent, label, name, options, value) {
        const wrap = el('div', 'at-field', parent); el('span', '', wrap, label);
        const current = options.find(x => x[0] === value);
        const trigger=button(wrap,current ? current[1] : String(value),{menu:name});svg(trigger,'down');
        trigger.setAttribute('aria-expanded',String(ctx.model.menu===name));trigger.setAttribute('aria-label',`${label}: ${current ? current[1] : value}`);
        if (ctx.model.menu === name) {
          const pop = el('div', 'at-pop', app);
          const ar = app.getBoundingClientRect(), wr = wrap.getBoundingClientRect();
          Object.assign(pop.style, {right:'auto',width:`${Math.max(wr.width,160)}px`,maxHeight:`${ar.height-24}px`,
            left:`${Math.max(6,Math.min(wr.left-ar.left,ar.width-170))}px`,top:'0px'});
          for (const [v, text] of options) button(pop, text, {option: v}, value === v ? 'on' : '');
          pop.style.top = `${Math.max(8,Math.min(wr.bottom-ar.top+3,ar.height-pop.getBoundingClientRect().height-9))}px`;
        }
      }
      function checkbox(parent, text, name, value, checked, count) {
        const label = el('label', 'at-check', parent), check = el('input', '', label);
        check.type = 'checkbox'; check.checked = checked; register({filter: name, value}, check);
        el('span', '', label, text); check.addEventListener('change', () => act({filter: name, value}));
        if(count!==undefined)el('small','at-count',label,String(count));
      }
      function calendar(main, m) {
        const intro=el('div','at-stayintro',main);svg(intro,s.scenario==='change'?'plane':'hotel');const stay=el('div','',intro);
        el('strong','',stay,s.scenario==='change'?`${s.origin.city} to ${s.dest.city}`:details.property);
        el('small','',stay,s.scenario==='change'?`${details.flight.no} · Economy Standard · Current departure ${F.helpers.fmtDate(s.original.date)}`:`${details.room} · 1 room, 1 adult · ${s.dest.city}`);
        const fields = el('div', 'at-dates', main);
        const start = button(fields, '', {control: 'calendar'});
        el('small', '', start, s.scenario === 'change' ? 'Departure date' : 'Check-in');
        el('span', '', start, F.helpers.fmtDate(s.scenario === 'change' ? m.date : m.start));
        svg(start,'calendar');
        if (s.scenario === 'daterange') {
          const end = el('button', '', fields); el('small', '', end, 'Check-out'); el('span', '', end, F.helpers.fmtDate(m.end));
          svg(end,'calendar');
          end.addEventListener('click', () => act({control: 'calendar'}));
        }
        const p = newPane(main);
        if (!m.open) {
          const empty = el('div', 'at-empty', p);
          svg(empty,m.end?'check':'calendar');
          el('h3', '', empty, s.scenario === 'change' ? 'Choose a new departure date' : m.end ? 'Your dates are selected' : 'When are you travelling?');
          el('p', '', empty, s.scenario === 'daterange' ? `${F.helpers.money(s.nightly)} per night · Flexible cancellation` : 'Your route and passenger details stay the same.');
          if(m.end)line(empty,'shield','Your room is available for the selected dates.','at-positive');
          plainButton(empty,m.end?'Adjust dates':'View available dates','calendar',()=>act({control:'calendar'}));
          return;
        }
        const bar = el('div', 'at-calbar', p);
        const prev = button(bar, '', {nav: -1}, '', true), nextMonth = F.helpers.addMonth(m.view, 1);
        svg(prev,'chevron').style.transform='rotate(180deg)';
        prev.setAttribute('aria-label', 'Previous month');
        el('span', 'at-muted', bar, s.scenario === 'daterange' ? m.start && !m.end ? 'Select check-out' : 'Select check-in' : 'Select departure');
        const next=button(bar,'',{nav:1},'',true);svg(next,'chevron');next.setAttribute('aria-label','Next month');
        const months = el('div', 'at-months', p);
        for (const month of [m.view, nextMonth]) {
          const box = el('div', '', months); el('div', 'at-month-title', box, C.formatDate(`${month}-01`, 'en-US', 'monthYear'));
          const grid = el('div', 'at-grid', box);
          for (const d of ['Su','Mo','Tu','We','Th','Fr','Sa']) el('span', '', grid, d);
          const [y, mo] = month.split('-').map(Number), offset = C.dayOfWeek(`${month}-01`);
          for (let i = 0; i < offset; i++) el('i', '', grid);
          for (let d = 1; d <= C.daysInMonth(y, mo); d++) {
            const iso = `${month}-${String(d).padStart(2, '0')}`;
            const picked = s.scenario === 'change' ? iso === m.date : [m.start, m.end].includes(iso);
            const inrange = s.scenario === 'daterange' && m.start && m.end && iso > m.start && iso < m.end;
            const b = button(grid, String(d), {day: iso}, picked ? 'on' : inrange ? 'inrange' : '', true);
            b.disabled = iso < s.calendar.base || iso > s.calendar.last || s.calendar.blocked.includes(iso);
            b.setAttribute('aria-label', F.helpers.fmtDate(iso));
          }
        }
        line(p,'info',s.scenario==='change'?'Unavailable departures are crossed out. All times are local. Your existing booking is retained until you confirm the change.':'Unavailable dates are crossed out. Check-in from 15:00. Check-out by 11:00. All times are local.','at-calnote');
        const terms=el('div','at-stayterms',p);el('strong','',terms,s.scenario==='change'?'Fare conditions':'Your room includes');
        el('div','at-positive',terms,s.scenario==='change'?`Change fee ${F.helpers.money(s.changeFee)}. Your seat and baggage allowance stay the same.`:'Private bathroom · Free Wi-Fi · Daily housekeeping');
        el('div','at-muted',terms,s.scenario==='change'?'Review your updated itinerary before payment.':'No prepayment needed. Cancellation terms apply to the entire stay.');
      }
      function seats(main, m) {
        const header=el('div','at-seat-infohead',main);line(header,'plane',`${details.flight.no} · Single-aisle aircraft · Economy`);el('span','at-muted',header,`${s.seats.filter(x=>!x.occupied).length} available`);
        const p = newPane(main), legend = el('div', 'at-legend', p);
        for (const [cls, name] of [['','Available'],['sel','Selected'],['occ','Occupied']]) {
          const span = el('span', '', legend); el('i', cls, span); el('span', '', span, ` ${name}`);
        }
        const cabin = el('div', 'at-seat-wrap', p); el('div', 'at-cockpit', cabin, 'FRONT OF AIRCRAFT');
        const equipment=el('div','at-equipment',cabin);line(equipment,'coffee','Galley');line(equipment,'user','Lavatory');
        const head=el('div','at-seat-head',cabin);for(const label of ['A','B','C','','D','E','F'])el('span','',head,label);
        for (const row of [...new Set(s.seats.map(x => x.row))]) {
          const r = el('div', `at-seat-row${s.seats.find(x => x.row === row).exit ? ' exit' : ''}`, cabin);
          for (const x of s.seats.filter(x => x.row === row)) {
            if (x.col === 3) el('span', 'at-rownum', r, String(row));
            const b = button(r, x.id, {seat: x.id}, m.seat === x.id ? 'on' : s.goal.near === x.id ? 'companion' : '', true);
            b.disabled = x.occupied;
            b.title = `${x.id} · ${x.kind}${x.exit ? ' · Exit row' : ''} · ${x.occupied ? 'Occupied' : F.helpers.money(x.fare)}`;
            b.setAttribute('aria-label', b.title);
            el('small','',b,x.occupied?'Occupied':F.helpers.money(x.fare));
            if (s.goal.near === x.id) svg(b,'user');
          }
        }
        const back=el('div','at-equipment',cabin);line(back,'bag','Rear galley');line(back,'user','Lavatory');
        line(p,'info','Seat availability may change until your assignment is confirmed. Window: A/F. Aisle: C/D.','at-calnote');
      }
      function resultFilters(rail, m) {
        const heading=el('h3','',rail,'Filter results');plainButton(heading,'Reset',null,resetFilters,'at-textbtn');
        if (s.scenario === 'flights') {
          checkbox(rail, `Nonstop only (${s.flights.filter(x=>!x.stops).length})`, 'nonstop', !m.filters.nonstop, m.filters.nonstop);
          // Both boolean target values point to the same checkbox.
          refs.set(F.helpers.key({filter: 'nonstop', value: m.filters.nonstop}), refs.get(F.helpers.key({filter: 'nonstop', value: !m.filters.nonstop})));
          dropdown(rail, 'Airline alliance', 'alliance', [['','All alliances'], ...F.helpers.ALLIANCES.map(a => [a,a])], m.filters.alliance);
          dropdown(rail, 'Depart before', 'before', [...new Set([1440,660,780,900,s.goal.before])].sort((a,b)=>a-b).map(a => [a,a === 1440 ? 'Any time' : F.helpers.time(a)]), m.filters.before);
          dropdown(rail, 'Maximum fare', 'max', [...new Set([s.maxPrice,250,350,450,s.goal.max])].sort((a,b)=>a-b).map(a => [a,F.helpers.money(a)]), m.filters.max);
          const airlines=el('details','',rail);svg(el('summary','',airlines,'Airlines on this route'),'down');
          for(const name of [...new Set(s.flights.map(x=>x.airline))]){const row=el('div','at-facetrow',airlines);el('span','',row,name);el('span','',row,String(s.flights.filter(x=>x.airline===name).length));}
          const fare=el('details','',rail);svg(el('summary','',fare,'Fare information'),'down');el('p','at-muted',fare,'Economy Standard includes a cabin bag and seat selection for a fee. Changes may incur a fare difference.');
          el('p', 'at-muted', rail, 'Prices include taxes. All departure times are local.');
        } else {
          el('div', 'at-muted', rail, 'Nightly price');
          const range = el('div', 'at-range-label', rail, `${F.helpers.money(m.filters.min)} – ${F.helpers.money(m.filters.max)}`);
          const hist=document.createElementNS(ns,'svg');hist.classList.add('at-histogram');hist.setAttribute('viewBox','0 0 180 25');hist.setAttribute('aria-label','Nightly price distribution');
          for(let i=0;i<18;i++){const n=s.hotels.filter(x=>Math.floor(x.price/s.maxPrice*18)===i).length;const r=document.createElementNS(ns,'rect');for(const[k,v]of Object.entries({x:i*10,y:24-Math.max(2,n*6),width:8,height:Math.max(2,n*6)}))r.setAttribute(k,String(v));hist.append(r);}rail.append(hist);
          const track = el('div', 'at-track', rail), thumbs = [el('div', 'at-thumb', track), el('div', 'at-thumb', track)];
          slider = env.ui.slider(track, {thumbs, min: 0, max: s.maxPrice, step: 10, values: [m.filters.min,m.filters.max],
            // Place thumbs in track-relative %, not px measured now: the rail gains its scrollbar only after the
            // filters below are appended, which narrows the track and would leave px-placed thumbs off their values.
            place: (t, p, f) => Object.assign(t.style, {left: `${f * 100}%`, top: '50%', transform: 'translate(-50%,-50%)'}),
            label: 'Nightly price range', onInput: values => {
              range.textContent = `${F.helpers.money(values[0])} – ${F.helpers.money(values[1])}`;
              ctx.patch({filters: {...ctx.model.filters,min: values[0],max: values[1]},booked: false,scroll: 0});
            }, onChange: () => paint()});
          dropdown(rail, 'Minimum guest rating', 'rating', [...new Set([0,7.2,7.8,8,8.5,9,9.4,s.goal.rating])].map(a => [a,a ? `${a.toFixed(1)}+` : 'Any rating']), m.filters.rating);
          el('h3', '', rail, 'Amenities');
          for (const a of F.helpers.AMENITIES) checkbox(rail, a, 'amenities', a, m.filters.amenities.includes(a),s.hotels.filter(x=>x.amenities.includes(a)).length);
          const areas=el('details','',rail);svg(el('summary','',areas,'Neighborhoods'),'down');for(const area of [...new Set(s.hotels.map(x=>x.area))]){const row=el('div','at-facetrow',areas);el('span','',row,area);el('span','',row,String(s.hotels.filter(x=>x.area===area).length));}
          el('p','at-muted',rail,'Guest ratings are based on verified stays. Nightly rates include property fees.');
        }
      }
      function results(main, m) {
        const rows = F.helpers.order(s, m), tool = el('div', 'at-toolbar', main);
        el('strong', '', tool, `${rows.length} ${s.scenario === 'hotels' ? 'properties' : 'flights'} found`);
        dropdown(tool, 'Sort by', 'sort', [['recommended','Recommended'],['price','Lowest price'],s.scenario === 'hotels' ? ['rating','Guest rating'] : ['departure','Departure time']], m.sort);
        const applied=el('div','at-filterline',main), f=m.filters;
        const chip=(text,action)=>{const b=plainButton(applied,text,null,action,'at-filterchip');svg(b,'close');};
        if(f.nonstop)chip('Nonstop',()=>act({filter:'nonstop',value:false}));
        if(f.alliance)chip(f.alliance,()=>act({filter:'alliance',value:''}));
        if(f.before<1440)chip(`Before ${F.helpers.time(f.before)}`,()=>act({filter:'before',value:1440}));
        if(f.min>0||f.max<s.maxPrice)chip(`${F.helpers.money(f.min)}–${F.helpers.money(f.max)}`,()=>{ctx.patch({filters:{...f,min:0,max:s.maxPrice},booked:false});paint();});
        if(f.rating)chip(`Rating ${f.rating.toFixed(1)}+`,()=>act({filter:'rating',value:0}));
        for(const a of f.amenities)chip(a,()=>act({filter:'amenities',value:a}));
        if(!applied.children.length)line(applied,'info',s.scenario==='hotels'?'1 room, 1 adult · Rates include taxes and fees':'One way · 1 adult · Economy · Total fares include taxes','at-muted');
        const p = newPane(main);
        if (!rows.length) {
          const empty=el('div','at-empty',p);svg(empty,'search');el('h3','',empty,'No matches for these preferences');
          el('p','',empty,`We found ${s.scenario==='hotels'?s.hotels.length:s.flights.length} options before filtering. A wider budget or fewer preferences may reveal more options.`);
          plainButton(empty,'Clear filters','close',resetFilters,'at-primary');el('p','at-muted',empty,'Your trip details will stay the same.');return;
        }
        for (const x of rows) {
          const hotel=s.scenario==='hotels', card = el('article', `at-card${hotel?' at-hotelcard':''}${m.selected === x.id ? ' chosen' : ''}`, p);
          if(hotel)hotelArt(card,x.name,true);
          const info = el('div', 'at-card-main', card);
          if(!hotel) {
            const carrier=el('div','at-carrier',info);el('span','at-airline',carrier,x.no.slice(0,2));el('strong','',carrier,x.airline);el('span','at-muted',carrier,x.no);
            const times=el('div','at-itinerary',info);
            const dep=el('div','at-time',times);el('strong','',dep,F.helpers.time(x.dep));el('small','',dep,s.origin.iata);
            const dur=el('div','at-duration',times);el('span','',dur,`${Math.floor(x.duration/60)}h ${x.duration%60}m`);svg(el('div','at-flightline',dur),'plane');el('span','',dur,x.stops?'1 stop':'Nonstop');
            const arr=el('div','at-time',times);el('strong','',arr,`${F.helpers.time((x.dep+x.duration)%1440)}${x.dep+x.duration>=1440?' +1':''}`);el('small','',arr,s.dest.iata);
            el('div','at-card-meta',info,`${x.alliance} · Economy Standard`);
            const service=el('div','at-services',info);for(const [icon,text]of [['bag','Cabin bag included'],['shield','Changes permitted']]){const sp=el('span','',service);svg(sp,icon);el('span','',sp,text);}
          }else {
            el('h3','',info,x.name);const stars=el('div','at-stars',info);for(let i=0;i<3+U.hash32(x.name)%3;i++)svg(stars,'star');
            const location=el('div','at-location',info);svg(location,'pin');el('span','',location,`${x.area} · ${(U.hash32(x.id)%35/10+.3).toFixed(1)} km from centre`);
            const rating=el('div','at-rating',info);el('b','',rating,x.rating.toFixed(1));el('strong','',rating,x.rating>=9?'Wonderful':x.rating>=8?'Very good':'Good');el('span','at-muted',rating,`${x.reviews} reviews`);
            el('div','at-roomtype',info,details.room);el('div','at-positive',info,'Free cancellation · No prepayment');
            const tags=el('div','at-tags',info);for(const a of x.amenities)el('span','',tags,a);
          }
          plainButton(info,hotel?'Room details':'Flight & fare details','down',()=>{ctx.patch({travelExpanded:m.travelExpanded===x.id?'':x.id});paint();},'at-textbtn');
          if(m.travelExpanded===x.id)el('div','at-details',info,hotel?`${details.room}. One large bed, private bathroom and daily housekeeping. ${x.amenities.join(', ')}. Nightly rates include taxes. Cancellation is permitted before check-in.`:`${x.no} operated by ${x.airline}. ${x.stops?'One connection; total journey time includes the layover.':'Direct service between the shown airports.'} Economy Standard: 1 cabin bag up to 8 kg. Change fees and any fare difference apply; no cash refund after departure.`);
          const price = el('div', 'at-card-price', card); el('strong', '', price, F.helpers.money(x.price));
          el('div', 'at-muted', price, hotel ? 'per night, 1 room' : 'total per adult');
          el('div','at-muted',price,'Taxes included');
          const select=button(price,m.selected===x.id?'Selected':'Select',{select:x.id},m.selected===x.id?'on':'at-primary',true);svg(select,m.selected===x.id?'check':'chevron');
        }
        line(p,'info',`${rows.length} of ${s.scenario==='hotels'?s.hotels.length:s.flights.length} results shown. Prices and availability are subject to confirmation.`,'at-calnote');
      }
      function review(main, m) {
        const p = newPane(main), box = el('div', 'at-summary', p);
        const state=el('div','at-tagstatus',box);svg(state,m.booked?'check':'shield');el('span','',state,m.booked?'Booking confirmed':'Secure booking review');
        el('h3', '', box, m.booked ? 'Your itinerary is confirmed' : 'Review your itinerary');
        el('div', 'at-muted', box, `${s.passenger} · ${s.origin.city} to ${s.dest.city}`);
        const dl = el('dl', '', box);
        const add = (label, value) => { el('dt', '', dl, label); el('dd', '', dl, value); };
        if (s.scenario === 'daterange') { add('Check-in',F.helpers.fmtDate(m.start));add('Check-out',F.helpers.fmtDate(m.end)); }
        if (s.scenario === 'flights') { const x = s.flights.find(x=>x.id===m.selected); if(x) { add('Flight',`${x.airline} · ${x.no}`);add('Departure',F.helpers.time(x.dep)); } }
        if (s.scenario === 'hotels') { const x = s.hotels.find(x=>x.id===m.selected); if(x) add('Hotel',x.name); }
        if (s.scenario === 'change') {
          if (s.goal.changeKind === 'seat') add('Seat',m.seat || 'Not selected');
          else add('Departure',F.helpers.fmtDate(m.date));
        }
        for (const fact of F.facts(m,s)) add(fact.label,fact.value);
        if (!['flights','hotels'].includes(s.scenario)) add('Booking reference',m.booked?s.reference:'Pending');
        const confirmation=el('div','at-confirm',box);svg(confirmation,'shield');el('span','',confirmation,m.booked?'A confirmation is saved in My trips. Your receipt is available in Wallet & receipts.':'Review the itinerary and price before completing your booking. Payment confirms the reservation and accepts the fare or property conditions.');
        const grid=el('div','at-servicegrid',box);
        const traveler=el('section','at-module',grid);line(traveler,'user','Traveler & contact','at-services');el('p','',traveler,s.passenger);el('p','at-muted',traveler,details.email);el('p','at-muted',traveler,'1 adult · Primary contact');
        const payment=el('section','at-module',grid);line(payment,'card',m.booked?'Payment receipt':'Payment method','at-services');el('p','',payment,`Travel wallet ending ${details.card}`);el('p','at-muted',payment,m.booked?`Reference ${s.reference} · Receipt saved`:'Your saved payment method will be used only when you confirm.');
        const policies=el('details','at-module',box);svg(el('summary','',policies,'Booking conditions and cancellation policy'),'down');el('p','at-muted',policies,'Names must match travel documents. Cancellation and changes are subject to the selected fare or property policy. Taxes and service fees are included in the displayed total.');
      }
      function manage(main,m) {
        const tabs=el('div','at-bookingtools',main);for(const label of ['Overview','Passengers','Baggage','Payments'])el('span','',tabs,label);
        const p=newPane(main);
        line(p,'info','Your itinerary is confirmed. Online check-in opens 24 hours before departure.','at-alert');
        const box=el('section','at-manage',p), head=el('div','at-managehead',box), info=el('div','',head);
        el('div','at-sectionlabel',info,'Booking reference');el('h3','',info,s.reference);
        button(head,'Change booking',{control:'edit'},'at-primary',true);
        const body=el('div','at-managebody',box),status=el('div','at-tagstatus',body);svg(status,'check');el('span','',status,'Confirmed · Upcoming trip');
        el('p','at-muted',body,`${F.helpers.fmtDate(m.date)} · ${details.flight.airline} · ${details.flight.no}`);
        const itinerary=el('div','at-itinerary',body);
        const from=el('div','at-time',itinerary);el('strong','',from,s.origin.iata);el('small','',from,s.origin.city);
        const duration=el('div','at-duration',itinerary);el('span','',duration,`${Math.floor(details.flight.duration/60)}h ${details.flight.duration%60}m`);svg(el('div','at-flightline',duration),'plane');el('span','',duration,'Economy Standard');
        const to=el('div','at-time',itinerary);el('strong','',to,s.dest.iata);el('small','',to,s.dest.city);
        const traveler=el('div','at-assignment',body);el('div','at-sectionlabel',traveler,'Passenger & seat');el('strong','',traveler,s.passenger);line(traveler,'seat',`Seat ${m.seat} · Ticket ${s.reference}-01`,'at-services');
        const grid=el('div','at-servicegrid',p);
        const baggage=el('section','at-module',grid);const bh=el('h4','',baggage);svg(bh,'bag');el('span','',bh,'Baggage & extras');el('p','',baggage,'1 cabin bag (8 kg) · 1 checked bag (23 kg)');el('p','at-muted',baggage,'Standard seat assignment · Refreshments included');
        const policy=el('section','at-module',grid);const ph=el('h4','',policy);svg(ph,'shield');el('span','',ph,'Change conditions');el('p','',policy,`Booking changes: ${F.helpers.money(s.changeFee)}`);el('p','at-muted',policy,'Review the updated date or seat and applicable fees before confirming.');
        const receipt=el('section','at-module',p);line(receipt,'card','Payment and travel documents','at-services');el('p','at-muted',receipt,`Receipt ${s.reference} · Traveler ${s.passenger}`);plainButton(receipt,'View receipts and documents','chevron',()=>panel('Wallet & receipts'),'at-textbtn');
      }
      function paint() {
        painting = true; refs = new Map(); slider = null; tracked.length = 0; filterTracked.length = 0; pane = null; rail = null;
        for (const pop of app.querySelectorAll(':scope > .at-pop')) pop.remove();
        content.replaceChildren(); footer.replaceChildren();
        const m = ctx.model;
        progress.replaceChildren();
        const steps=s.scenario==='change'?['Your booking','Make changes','Review & confirm']:['Trip details','Your selection','Review & payment'];
        for(let i=0;i<steps.length;i++){const st=el('span',i===(m.page==='review'?2:m.page==='manage'?0:1)?'current':'',progress);el('b','at-stepnum',st,String(i+1));el('span','',st,steps[i]);}
        el('span','at-muted',progress,m.booked?'Saved in My trips':'Prices include taxes and fees');
        if(ctx.size.width>=1120)worknav();
        const isResults = ['flights','hotels'].includes(s.scenario);
        if (m.page !== 'review' && m.page !== 'manage') {
          if (isResults) {
            rail = el('aside','at-rail',content);register({pane:'filters'},rail);resultFilters(rail,m);
            rail.scrollTop = m.filterScroll || 0;
            rail.addEventListener('scroll',()=>{if(!painting)visibility();});
          }
          else if (s.scenario === 'seat' || (s.scenario === 'change' && s.goal.changeKind === 'seat')) {
            const passenger = el('aside','at-rail seat-info',content);
            el('h3','',passenger,'Passengers');
            const assignment=el('div','at-assignment',passenger);line(assignment,'user','Adult 1','at-sectionlabel');el('strong','',assignment,s.passenger);
            el('div','at-muted',assignment,m.seat?`Seat ${m.seat}`:'No seat assigned');
            if (s.goal.near){el('h4','',passenger,'Travel companion');line(passenger,'user',`Assigned seat ${s.goal.near}`);el('p','at-muted',passenger,'Companion seats are already confirmed.');}
            el('h4','',passenger,'Cabin & seat guide');el('div','at-chip',passenger,'Economy Standard');
            el('p','at-muted',passenger,'A and F: window. C and D: aisle.');
            el('p','at-muted',passenger,'Exit rows are marked on the cabin map. Occupied seats are unavailable.');
            el('h4','',passenger,'Seat fees');el('p','at-muted',passenger,`From ${F.helpers.money(Math.min(...s.seats.map(x=>x.fare)))} per traveler. Fees are shown on available seats.`);
            plainButton(passenger,'Seat selection policy','info',()=>panel('Seat selection policy'),'at-textbtn');
          }
        }
        const main = el('div','at-main',content);
        if (m.page === 'review') review(main,m);
        else if (m.page === 'manage') manage(main,m);
        else if (s.scenario === 'daterange' || (s.scenario === 'change' && s.goal.changeKind === 'date')) calendar(main,m);
        else if (isResults) results(main,m);
        else seats(main,m);
        if(!isResults && ctx.size.width>=890)sidepanel(m);
        const total = el('div','',footer), selectedSeat = s.seats.find(x=>x.id===m.seat);
        let summary = 'Choose an option to continue';
        if (s.scenario === 'seat') summary = `Seat: ${m.seat || 'Not selected'} · Seat fee: ${F.helpers.money(selectedSeat ? selectedSeat.fare : 0)}`;
        if (s.scenario === 'daterange') summary = `Nights: ${F.helpers.nights(m.start,m.end)} · Stay total: ${F.helpers.money(F.helpers.nights(m.start,m.end)*s.nightly)}`;
        if (s.scenario === 'change') summary = `Seat: ${m.seat} · Departure: ${F.helpers.fmtDate(m.date)} · Change fee: ${F.helpers.money(s.changeFee)}`;
        if (isResults) { const x = (s.scenario === 'hotels' ? s.hotels:s.flights).find(x=>x.id===m.selected);if(x) summary = `${s.scenario === 'hotels' ? 'Nightly rate' : 'Fare'}: ${F.helpers.money(x.price)}`; }
        el('strong','',total,summary);line(total,m.booked||m.page==='manage'?'check':'shield',`Status: ${m.booked ? 'Confirmed' : m.page==='manage'?'Existing booking confirmed':m.page === 'review' ? 'Ready for review' : 'Selection in progress'}`,'at-status');
        if (m.notice) el('div','at-notice',total,m.notice);
        const prepared = s.scenario === 'seat' ? !!m.seat : s.scenario === 'daterange' ? F.helpers.available(s,m.start,m.end)
          : isResults ? !!m.selected : s.goal.changeKind === 'seat' ? m.seat !== s.original.seat : m.date !== s.original.date;
        if (m.page === 'review') {
          button(footer,'Edit details',{control:'back'});
          if (!m.booked) svg(button(footer,'Book and pay',{control:'book'},'at-primary'),'shield');
        } else if (m.page !== 'manage') {const review=button(footer,s.scenario==='change'?'Review change':'Review booking',{control:'review'},'at-primary');svg(review,'chevron');review.disabled=!prepared;}
        if (pane) pane.scrollTop = m.scroll || 0;
        drawPanel(m);
        painting = false; visibility();
      }
      paint();
      return {anchors:[app],sync:paint};
    },
    locate(t) {
      if (t.thumb !== undefined) return slider.locateThumb(t.thumb);
      if (t.price !== undefined) return slider.locate(t.price,t.j);
      const node = refs.get(env.taskDef.helpers.key(t));
      if (!node) throw new Error(`Unknown travel target ${JSON.stringify(t)}`);
      const b = node.getBoundingClientRect();
      return [b.left+b.width/2,b.top+b.height/2];
    }
  });
})();
