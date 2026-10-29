/* base / use-health-records / classic: fictional clinical chart with a patient banner,
 * chart navigation, provider calendar, strict order composer, medication reconciliation
 * table, observation handoff/flowsheet and capacity board. Draft and signed/saved
 * records are distinct. Inner panes use native wheel scrolling; model.view mirrors
 * positions for the closed-loop oracle. locate only reads geometry. All external
 * hook changes repaint through sync(), including saved dose units and patient beds.
 * The desktop shell, worklist, chart-review rail, clinical sidebar and historical
 * tables are seeded context, not additional task targets. Auxiliary menus show
 * read-only chart views; icons are inline SVG and never depend on a symbol font.
 */
(function () {
  'use strict';
  let current;
  const CSS=`
  .ehr-root{position:absolute;inset:8px;display:flex;flex-direction:column;min-width:0;min-height:0;border:1px solid var(--line);border-radius:7px;background:var(--panel);color:var(--fg);overflow:hidden;font-size:12px;box-shadow:0 3px 16px #0000000d}
  .ehr-root button,.ehr-root input{font:inherit;color:inherit;box-sizing:border-box}
  .ehr-root button{cursor:pointer;border:1px solid var(--line);background:var(--panel);border-radius:4px;padding:5px 9px;line-height:1.3}
  .ehr-root button:hover{background:color-mix(in srgb,var(--accent) 10%,var(--panel))}
  .ehr-root button:focus-visible,.ehr-root input:focus-visible{outline:2px solid var(--accent);outline-offset:1px}
  .ehr-root .ehr-primary{background:var(--accent);color:#fff;border-color:var(--accent);font-weight:650}
  .ehr-top{height:35px;flex:none;background:color-mix(in srgb,var(--accent) 12%,var(--panel));border-bottom:1px solid var(--line);display:flex;align-items:center;gap:14px;padding:0 12px;font-size:10px}
  .ehr-logo{display:flex;align-items:center;gap:6px;font-size:15px;font-weight:700;letter-spacing:-.4px}.ehr-cross{width:21px;height:21px;background:var(--accent);color:white;border-radius:4px;text-align:center;line-height:21px;font-size:19px}
  .ehr-muted{color:var(--muted)}.ehr-grow{margin-left:auto}.ehr-top .ehr-pill{font-size:9px;letter-spacing:.04em}
  .ehr-banner{flex:none;display:flex;align-items:center;gap:12px;padding:9px 13px;border-bottom:1px solid var(--line);min-width:0;background:color-mix(in srgb,var(--bg) 25%,var(--panel))}
  .ehr-avatar{width:36px;height:36px;flex:none;border-radius:50%;background:color-mix(in srgb,var(--accent) 15%,var(--panel));color:var(--accent);display:grid;place-items:center;font-size:13px;font-weight:700}
  .ehr-identity{min-width:0;flex:1}.ehr-name{font-size:17px;line-height:21px;font-weight:650;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ehr-demographics{display:flex;flex-wrap:wrap;gap:2px 13px;font-size:10px;color:var(--muted)}
  .ehr-alerts{display:flex;flex-direction:column;gap:3px;font-size:10px;flex:none}.ehr-pill{border:1px solid var(--line);border-radius:3px;padding:2px 5px;background:var(--panel);white-space:nowrap}.ehr-caution{color:var(--fg);border-left:3px solid #c99330;background:color-mix(in srgb,#c99330 10%,var(--panel))}
  .ehr-tabs{height:32px;flex:none;display:flex;align-items:stretch;gap:4px;border-bottom:1px solid var(--line);padding:0 9px;overflow:hidden}.ehr-tabs span{font-size:11px;white-space:nowrap;padding:7px 10px;color:var(--muted);border-bottom:2px solid transparent}.ehr-tabs .active{color:var(--accent);border-color:var(--accent);font-weight:650}
  .ehr-body{flex:1;min-height:0;display:flex}.ehr-rail{width:145px;flex:none;border-right:1px solid var(--line);background:color-mix(in srgb,var(--bg) 55%,var(--panel));padding:12px;font-size:10px;overflow:auto}.ehr-rail h4{font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);margin:3px 0 9px}.ehr-rail p{margin:6px 0 17px;line-height:1.6}.ehr-rail .ehr-raillink{padding:6px 7px;border-radius:3px;margin:2px 0}.ehr-rail .selected{background:color-mix(in srgb,var(--accent) 12%,var(--panel));color:var(--accent);font-weight:650}
  .ehr-main{flex:1;min-width:0;min-height:0;display:flex;flex-direction:column}.ehr-heading{flex:none;display:flex;align-items:center;gap:9px;height:37px;padding:0 12px;border-bottom:1px solid var(--line)}.ehr-heading h2{margin:0;font-size:14px;font-weight:650}.ehr-heading small{font-size:10px;color:var(--muted)}
  .ehr-pane{flex:1;min-height:0;overflow:auto;overscroll-behavior:contain;scrollbar-width:thin;padding:12px;scroll-behavior:auto;position:relative}.ehr-pane h3{font-size:12px;margin:0 0 8px}.ehr-section{border:1px solid var(--line);border-radius:4px;margin-bottom:12px;overflow:hidden}.ehr-sectionhead{background:color-mix(in srgb,var(--bg) 65%,var(--panel));border-bottom:1px solid var(--line);padding:6px 9px;font-size:10px;font-weight:650;display:flex;justify-content:space-between;gap:10px}.ehr-sectionbody{padding:10px}
  .ehr-formgrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px 15px}.ehr-field{min-width:0}.ehr-field label{display:block;font-size:10px;font-weight:650;margin-bottom:4px}.ehr-field small{display:block;color:var(--muted);font-size:9px;margin-top:3px;line-height:13px}.ehr-field input{height:30px;width:100%;border:1px solid var(--line);border-radius:3px;background:var(--panel);padding:4px 8px;user-select:text;-webkit-user-select:text}
  .ehr-choices{display:flex;flex-wrap:wrap;gap:3px}.ehr-choices button{padding:5px 7px;font-size:10px;min-height:27px}.ehr-choices button[aria-pressed=true]{color:var(--accent);border-color:var(--accent);background:color-mix(in srgb,var(--accent) 10%,var(--panel));font-weight:650}
  .ehr-wide{grid-column:1/-1}.ehr-note{font-size:10px;color:var(--muted);line-height:1.5;margin:0 0 10px}.ehr-empty{padding:18px;text-align:center;color:var(--muted);font-size:11px;border:1px dashed var(--line);margin:8px 0}
  .ehr-actions{flex:none;border-top:1px solid var(--line);padding:7px 12px;background:color-mix(in srgb,var(--bg) 40%,var(--panel));display:flex;gap:9px;align-items:center;min-height:44px}.ehr-actiontext{flex:1;font-size:10px;line-height:14px;min-width:0}.ehr-actiontext b{display:block;color:var(--fg);font-weight:600}.ehr-error{color:#c66e37;white-space:normal}.ehr-foot{height:21px;flex:none;padding:3px 10px;border-top:1px solid var(--line);display:flex;gap:12px;font-size:9px;color:var(--muted);overflow:hidden;white-space:nowrap}
  .ehr-appt{display:grid;grid-template-columns:minmax(175px,.55fr) minmax(0,1.45fr);align-items:start;gap:12px}.ehr-visit{min-width:0}.ehr-calendar{display:grid;grid-template-columns:40px repeat(var(--providers),minmax(0,1fr));border-left:1px solid var(--line);border-top:1px solid var(--line);font-size:10px}.ehr-calhead{position:sticky;top:-12px;z-index:2;background:var(--panel);font-weight:650;padding:7px 4px;min-width:0;border-right:1px solid var(--line);border-bottom:1px solid var(--line);text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ehr-time{padding:9px 3px;color:var(--muted);border-right:1px solid var(--line);border-bottom:1px solid var(--line);text-align:center}.ehr-calendar button.ehr-slot{height:35px;border-radius:0;border-top:0;border-left:0;font-size:9px;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}.ehr-slot.busy{background:color-mix(in srgb,var(--muted) 10%,var(--panel));border-left:3px solid var(--muted)!important;color:var(--muted);cursor:default}.ehr-slot.selected{background:color-mix(in srgb,var(--accent) 18%,var(--panel))!important;border-left:3px solid var(--accent)!important;color:var(--accent)}
  .ehr-medhead,.ehr-medrow{display:grid;grid-template-columns:minmax(95px,1fr) 157px 68px 115px;gap:8px;align-items:center;padding:8px 9px;border-bottom:1px solid var(--line)}.ehr-medhead{font-size:9px;color:var(--muted);background:color-mix(in srgb,var(--bg) 70%,var(--panel));padding-top:6px;padding-bottom:6px}.ehr-medrow{min-height:77px}.ehr-medrow:last-child{border-bottom:0}.ehr-medrow strong{font-size:11px}.ehr-medrow small{font-size:9px;display:block;color:var(--muted);margin-top:3px}.ehr-medrow .ehr-choices button{padding:5px 4px;font-size:9px}.ehr-medrow .ehr-field label{display:none}.ehr-medrow input{font-size:11px}
  .ehr-observations{width:100%;border-collapse:collapse;font-size:10px}.ehr-observations th,.ehr-observations td{text-align:left;padding:7px 8px;border-bottom:1px solid var(--line);white-space:nowrap}.ehr-observations th{font-size:9px;color:var(--muted);font-weight:500}.ehr-observations tr:last-child td{border-bottom:0}.ehr-orderpreview{margin-top:12px;border-left:3px solid var(--accent);background:color-mix(in srgb,var(--accent) 5%,var(--panel));padding:9px;font-size:11px;line-height:1.7;overflow-wrap:anywhere}.ehr-previewlabel{font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em}
  .ehr-transfer{flex:none;margin:8px 12px 0;padding:7px 10px;display:flex;align-items:center;gap:12px;border:1px solid var(--line);border-left:3px solid var(--accent);border-radius:4px;cursor:grab;touch-action:none;background:color-mix(in srgb,var(--accent) 6%,var(--panel));font-size:11px}.ehr-transfer strong{display:block}.ehr-transfer small{font-size:9px;color:var(--muted)}.ehr-transfer.dragging{outline:2px dashed var(--accent);opacity:.65}.ehr-bedgrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}.ehr-bed{min-height:118px;min-width:0;border:1px solid var(--line);border-radius:5px;padding:8px;display:flex;flex-direction:column;gap:5px;font-size:10px}.ehr-bed header{display:flex;justify-content:space-between;gap:5px;align-items:center}.ehr-bed b{font-size:13px}.ehr-bed small{font-size:9px;color:var(--muted)}.ehr-bed .ehr-bedpatient{margin-top:auto;font-size:10px;border-radius:3px;background:color-mix(in srgb,var(--accent) 13%,var(--panel));padding:5px}.ehr-bed.over{outline:2px solid var(--accent)}.ehr-bed.occupied{background:color-mix(in srgb,var(--muted) 7%,var(--panel))}
  .ehr-records{display:grid;gap:12px;padding:6px 0}.ehr-record{display:flex;align-items:center;gap:15px;padding:15px;border:1px solid var(--line);border-radius:5px}.ehr-record strong{font-size:14px;display:block}.ehr-record small{display:block;color:var(--muted);font-size:11px;margin-top:4px}.ehr-compact .ehr-top{gap:9px}.ehr-compact .ehr-top .ehr-topextra{display:none}.ehr-compact .ehr-alerts{font-size:9px}.ehr-compact .ehr-formgrid{gap:9px}.ehr-compact .ehr-tabs span{padding:7px 6px;font-size:10px}.ehr-compact .ehr-medhead,.ehr-compact .ehr-medrow{grid-template-columns:minmax(80px,1fr) 139px 54px 100px;gap:5px;padding-left:6px;padding-right:6px}.ehr-compact .ehr-medrow .ehr-choices button{padding:5px 3px;font-size:9px}.ehr-compact .ehr-identity .ehr-name{font-size:15px}.ehr-compact .ehr-banner{padding:7px 9px;gap:8px}.ehr-compact .ehr-pane{padding:9px}.ehr-compact .ehr-bed{padding:6px;font-size:9px;min-height:110px}.ehr-compact .ehr-avatar{width:30px;height:30px}
  /* Dense clinical desktop. Historical rows are distinct from the active encounter. */
  .ehr-root{inset:5px;border-radius:3px;font-family:Arial,"Liberation Sans",sans-serif;font-size:11px;box-shadow:0 1px 7px #0001}
  .ehr-icon{width:15px;height:15px;flex:none;vertical-align:middle;stroke:currentColor;fill:none;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
  .ehr-root button.ehr-iconbtn{display:inline-flex;align-items:center;justify-content:center;gap:5px;padding:3px 6px;font-size:10px;min-height:23px;border-radius:2px;background:transparent}.ehr-root button.ehr-icononly{width:25px;padding:3px}
  .ehr-top{height:31px;gap:10px;padding:0 9px;background:color-mix(in srgb,var(--accent) 12%,var(--panel))}.ehr-logo{font-size:14px}.ehr-cross{display:grid;place-items:center;width:20px;height:20px;border-radius:3px}.ehr-cross svg{width:15px;height:15px;stroke-width:2.5}.ehr-top .ehr-iconbtn{border-color:transparent}.ehr-top .ehr-global-search{margin-left:auto;min-width:100px;max-width:220px;flex:1;justify-content:flex-start;background:var(--panel);border:1px solid var(--line);color:var(--muted)}
  .ehr-menubar{height:25px;flex:none;display:flex;align-items:center;gap:4px;padding:0 8px;border-bottom:1px solid var(--line);background:color-mix(in srgb,var(--bg) 50%,var(--panel));font-size:10px}.ehr-menubar button{border:0;padding:3px 8px;border-radius:0;background:transparent;font-size:10px}.ehr-workspace-tab{height:25px;display:inline-flex;align-items:center;gap:6px;border-bottom:2px solid var(--accent);margin-left:13px;padding:0 10px;font-weight:600;background:var(--panel)}
  .ehr-banner{padding:6px 10px;gap:9px;min-height:57px}.ehr-avatar{width:31px;height:31px;border-radius:4px}.ehr-name{font-size:16px;line-height:19px}.ehr-demographics{gap:1px 12px}.ehr-encounter{display:flex;gap:12px;font-size:9px;color:var(--muted);margin-top:3px;flex-wrap:wrap}.ehr-encounter b{font-weight:500;color:var(--fg)}.ehr-alerts{gap:4px}.ehr-caution{display:flex;align-items:center;gap:4px}.ehr-caution .ehr-icon{height:12px;width:12px}.ehr-tabs{height:27px;padding:0 6px;gap:1px}.ehr-tabs span{padding:5px 8px;font-size:10px}.ehr-tabs .ehr-tabcount{font-size:9px;border:0;color:var(--muted);padding-left:3px}
  .ehr-rail{width:148px;padding:8px 7px;font-size:10px;scrollbar-width:thin;overscroll-behavior:contain}.ehr-rail h4{font-size:9px;margin:8px 4px 4px;letter-spacing:.06em}.ehr-rail .ehr-raillink{display:flex;align-items:center;gap:6px;padding:5px 6px;margin:0;border-radius:2px;line-height:13px}.ehr-raillink .ehr-icon{height:13px;width:13px;opacity:.8}.ehr-count{margin-left:auto;color:var(--muted);font-size:9px;line-height:14px;padding:0 4px;border-radius:2px;background:color-mix(in srgb,var(--muted) 9%,var(--panel))}.ehr-problem{padding:4px 7px;border-bottom:1px solid color-mix(in srgb,var(--line) 50%,transparent);font-size:9px;line-height:14px}.ehr-problem small{display:block;color:var(--muted);font-size:9px}.ehr-rail-patient{display:flex;gap:5px;padding:5px 4px;border-bottom:1px solid var(--line);font-size:9px;line-height:13px}.ehr-rail-patient b{display:block;font-weight:500}.ehr-rail-patient small{font-size:9px;color:var(--muted)}
  .ehr-heading{height:31px;padding:0 9px;gap:7px}.ehr-heading h2{font-size:13px}.ehr-heading small{font-size:9px}.ehr-toolbar{min-height:29px;flex:none;display:flex;align-items:center;gap:5px;padding:3px 8px;border-bottom:1px solid var(--line);font-size:9px;background:color-mix(in srgb,var(--bg) 40%,var(--panel));white-space:nowrap;overflow:hidden}.ehr-toolbar .ehr-toolgroup{display:flex;align-items:center;gap:2px;border-right:1px solid var(--line);padding-right:6px;margin-right:3px}.ehr-toolbar .ehr-filter{padding:3px 6px;border:1px solid var(--line);background:var(--panel);border-radius:2px;overflow:hidden;text-overflow:ellipsis}.ehr-toolbar .ehr-iconbtn{white-space:nowrap}
  .ehr-pane{padding:8px;background:color-mix(in srgb,var(--bg) 38%,var(--panel));scrollbar-color:var(--muted) transparent}.ehr-section{background:var(--panel);border-radius:2px;margin-bottom:8px}.ehr-sectionhead{padding:5px 7px;font-size:10px;min-height:24px}.ehr-sectionbody{padding:8px}.ehr-formgrid{gap:8px 11px}.ehr-field label{font-size:10px;font-weight:600;margin-bottom:3px}.ehr-field input{height:27px;border-radius:2px;font-size:11px}.ehr-field small{font-size:9px;line-height:11px}.ehr-choices{gap:3px}.ehr-choices button{padding:4px 6px;min-height:25px;border-radius:2px}.ehr-field.invalid input{border-color:#b47636}.ehr-field.invalid label{color:var(--fg);text-decoration:underline;text-decoration-color:#b47636;text-underline-offset:3px}.ehr-note{font-size:10px;line-height:14px;margin-bottom:7px}.ehr-actions{min-height:39px;padding:5px 9px;gap:8px}.ehr-actions button{font-size:11px;border-radius:2px;padding:5px 10px}.ehr-actiontext{font-size:9px;line-height:12px}.ehr-foot{height:20px;font-size:9px;gap:9px}.ehr-orderpreview{font-size:10px;line-height:1.6;margin-top:8px;padding:7px}.ehr-previewlabel{font-size:9px}
  .ehr-context{width:229px;flex:none;padding:8px;border-left:1px solid var(--line);background:color-mix(in srgb,var(--bg) 55%,var(--panel));overflow:auto;scrollbar-width:thin;font-size:10px}.ehr-context .ehr-sectionbody{padding:6px}.ehr-context h4{font-size:10px;margin:0}.ehr-contextrow{display:flex;justify-content:space-between;gap:8px;padding:5px 0;border-bottom:1px solid var(--line);font-size:10px;line-height:14px}.ehr-contextrow:last-child{border:0}.ehr-contextrow b{font-weight:500}.ehr-contextrow small{display:block;font-size:9px;color:var(--muted)}.ehr-contextrow .ehr-icon{width:12px;height:12px;margin-right:4px}.ehr-context .ehr-pill{font-size:9px;padding:1px 4px}.ehr-taskstatus{display:flex;gap:6px;align-items:center;padding:5px 7px;border:1px solid var(--line);background:var(--panel);font-size:10px;margin-bottom:7px}.ehr-taskstatus small{font-size:9px;color:var(--muted);margin-left:auto}.ehr-taskstatus .ehr-icon{width:13px;height:13px}.ehr-status-text{font-weight:600}
  .ehr-tablewrap{overflow:auto;max-width:100%;scrollbar-width:thin}.ehr-data{width:100%;border-collapse:collapse;font-size:10px;line-height:13px;background:var(--panel)}.ehr-data th{color:var(--muted);font-size:9px;font-weight:600;background:color-mix(in srgb,var(--bg) 65%,var(--panel));white-space:nowrap}.ehr-data th,.ehr-data td{padding:5px 7px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}.ehr-data td:first-child{font-weight:500}.ehr-data td small{display:block;font-size:9px;color:var(--muted)}.ehr-data tr:last-child td{border-bottom:0}.ehr-data tbody tr:nth-child(even){background:color-mix(in srgb,var(--bg) 30%,var(--panel))}.ehr-data .ehr-pill{font-size:9px;padding:1px 3px}.ehr-mono{font-variant-numeric:tabular-nums}.ehr-tiny{font-size:9px;color:var(--muted)}.ehr-section .ehr-tablewrap{margin:-8px}.ehr-section .ehr-contextrow{padding:5px 0}
  .ehr-orderlayout{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(210px,.85fr);gap:8px;align-items:start}.ehr-orderlayout>div{min-width:0}.ehr-catalogmeta{display:flex;gap:8px;font-size:9px;color:var(--muted);border-bottom:1px solid var(--line);padding:0 0 6px;margin-bottom:8px}.ehr-orderflag{padding:6px 7px;border-left:3px solid #b2873b;background:color-mix(in srgb,#b2873b 8%,var(--panel));font-size:10px;line-height:14px;margin-bottom:8px;display:flex;align-items:center;gap:6px}.ehr-orderflag .ehr-icon{width:13px;height:13px}.ehr-medhead,.ehr-medrow{grid-template-columns:minmax(120px,1fr) 157px 60px 105px;gap:6px;padding:6px 8px}.ehr-medrow{min-height:61px}.ehr-medrow small{line-height:12px;margin-top:2px}.ehr-medrow .ehr-field small{display:none}.ehr-medrow .ehr-choices button{min-height:25px;padding:4px 4px}.ehr-medrow .ehr-field label{display:none}.ehr-medrow .ehr-pill{font-size:8px;padding:0 3px;margin-right:4px}.ehr-medhead{padding:5px 8px}.ehr-medmeta{font-size:9px;color:var(--muted);line-height:12px;margin-top:2px}.ehr-observations th,.ehr-observations td{padding:5px 7px}.ehr-observations th{font-weight:600}.ehr-handoff-meta{font-size:9px;color:var(--muted);padding:4px 0 6px}.ehr-trend{width:100%;height:45px;display:block;stroke:var(--accent);fill:none;stroke-width:1.7}
  .ehr-appt{grid-template-columns:minmax(180px,.6fr) minmax(0,1.4fr);gap:8px}.ehr-calendar button.ehr-slot{height:33px;font-size:10px;padding:3px 5px;line-height:13px}.ehr-calendar button.ehr-slot small{display:block;font-size:8px;opacity:.8}.ehr-calhead{font-size:10px;padding:6px 4px;top:-8px}.ehr-time{font-size:10px;padding:8px 2px;font-variant-numeric:tabular-nums}.ehr-calmini{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;font-size:9px;text-align:center;margin-bottom:7px}.ehr-calmini span{padding:3px 0}.ehr-calmini .selected{background:var(--accent);color:white;border-radius:2px}.ehr-callegend{display:flex;flex-wrap:wrap;gap:8px;font-size:9px;padding:5px 0;color:var(--muted)}.ehr-callegend i{display:inline-block;width:8px;height:8px;background:color-mix(in srgb,var(--accent) 35%,var(--panel));margin-right:3px;border:1px solid var(--line)}.ehr-callegend i.busy{background:color-mix(in srgb,var(--muted) 30%,var(--panel))}
  .ehr-transfer{margin:5px 8px 0;padding:5px 8px;border-radius:2px;gap:7px}.ehr-transfer strong{font-size:11px}.ehr-transfer small{font-size:9px}.ehr-bedgrid{gap:7px}.ehr-bed{min-height:126px;border-radius:2px;padding:7px;gap:4px;background:var(--panel);border-top:3px solid color-mix(in srgb,var(--accent) 55%,var(--line))}.ehr-bed.occupied{border-top-color:var(--muted)}.ehr-bed header .ehr-icon{height:13px;width:13px}.ehr-bed .ehr-bedpatient{border-radius:2px;padding:5px 4px;background:color-mix(in srgb,var(--accent) 9%,var(--panel));line-height:13px}.ehr-bed small{font-size:9px}.ehr-census{display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin:0 0 7px;padding:6px 7px;background:var(--panel);border:1px solid var(--line);font-size:10px}.ehr-census b{font-size:12px;margin-right:3px}.ehr-census span{padding-right:10px;border-right:1px solid var(--line)}
  .ehr-popup{position:absolute;z-index:35;top:31px;right:9px;width:310px;max-width:calc(100% - 20px);max-height:calc(100% - 50px);overflow:auto;border:1px solid var(--line);background:var(--panel);box-shadow:0 5px 20px #0003;border-radius:3px;padding:10px;font-size:11px}.ehr-popup header{display:flex;align-items:center;justify-content:space-between;padding-bottom:7px;border-bottom:1px solid var(--line);margin-bottom:5px;font-weight:600}.ehr-popup[hidden]{display:none}.ehr-popup .ehr-iconbtn{padding:2px}.ehr-popup p{font-size:10px;color:var(--muted);line-height:15px;margin:7px 0}
  .ehr-taskstatus{white-space:nowrap;overflow:hidden}.ehr-status-text{overflow:hidden;text-overflow:ellipsis}.ehr-savebutton{display:inline-flex;align-items:center;gap:6px}.ehr-narrow .ehr-orderlayout{grid-template-columns:1fr}.ehr-narrow .ehr-encounter .ehr-enc-extra{display:none}.ehr-compact .ehr-top{gap:5px}.ehr-compact .ehr-medhead,.ehr-compact .ehr-medrow{grid-template-columns:minmax(100px,1fr) 139px 52px 99px;gap:5px;padding:6px}.ehr-compact .ehr-medrow{min-height:60px}.ehr-compact .ehr-tabs span{font-size:10px;padding:5px 5px}.ehr-compact .ehr-banner{padding:6px 8px}.ehr-compact .ehr-pane{padding:7px}.ehr-compact .ehr-bed{min-height:126px}.ehr-compact .ehr-calhead{font-size:9px}.ehr-short .ehr-menubar{display:none}.ehr-short .ehr-encounter{display:none}
  `;
  env.widget({task:'use-health-records',site:'base',name:'classic',split:'train',
    scenarios:['appointment','order','medrec','vitals','beds'],
    render(ctx) {
      const {spec:s,util:u}=ctx,f=env.taskDef.helpers;
      ctx.css('app-ehr-classic',CSS);
      const root=u.el('section','ehr-root',ctx.stage);root.setAttribute('aria-label','Fictional patient chart');
      root.classList.toggle('ehr-compact',ctx.size.width<850);
      root.classList.toggle('ehr-narrow',ctx.size.width<940);
      root.classList.toggle('ehr-short',ctx.size.height<430);
      const refs={ctx,s,root,fields:new Map(),choices:new Map(),slots:new Map(),beds:new Map(),bedStatus:new Map(),targets:new Map()};current=refs;
      const cr=ctx.rng.fork('clinical-desktop'),C=ctx.content;
      const person=()=>C.personName(cr,{csplit:s.csplit}).full;
      const nurse=person(),clerk=person(),reviewer=person();
      const worklist=Array.from({length:9},(_,i)=>({name:person(),time:f.time(540+i*30),room:`${101+i}`,state:['Arrived','Roomed','Scheduled','Checked out'][i%4]}));
      const pastOrders=Array.from({length:9},(_,i)=>({name:['CBC with differential','Basic metabolic panel','Nursing communication','Observation schedule','Specimen collection','Hepatic function panel','Follow-up referral','Care plan review','Thyroid screening'][i],
        date:`${15-i} Oct 2027`,state:['Final','In process','Signed','Completed'][i%4],by:i%2?s.providers[0]:reviewer}));
      const paths={cross:'M12 4v16M4 12h16',search:'M10.5 17a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13Zm5-2 5 5',
        bell:'M5 17h14l-2-4V9a5 5 0 0 0-10 0v4l-2 4Zm5 3h4',user:'M8 7a4 4 0 1 0 8 0 4 4 0 0 0-8 0ZM4 21v-2a8 8 0 0 1 16 0v2',
        chart:'M5 3h14v18H5zM8 7h8M8 11h8M8 15h5',list:'M8 5h13M8 12h13M8 19h13M3 5h1M3 12h1M3 19h1',
        clock:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 6v6l4 2',check:'M4 12l5 5L20 6',
        warn:'M12 3 2 21h20L12 3ZM12 9v5M12 17v1',refresh:'M20 8a9 9 0 1 0 0 9M20 3v6h-6',
        filter:'M3 4h18l-7 8v7l-4 2V12L3 4Z',print:'M7 8V3h10v5M7 17H3V9h18v8h-4M7 14h10v7H7z',
        calendar:'M4 5h16v16H4zM8 2v6M16 2v6M4 10h16M8 14h2M14 14h2M8 18h2',
        bed:'M3 18v3M21 18v3M3 10v8h18v-8H3ZM5 10V4h14v6M7 8h3M14 8h3',
        lab:'M8 3h8M10 3v7L4 20h16l-6-10V3M8 15h8',med:'M7 17 17 7M4 20a5 5 0 0 1 0-7l9-9a5 5 0 0 1 7 7l-9 9a5 5 0 0 1-7 0Z',
        close:'M5 5l14 14M19 5 5 19',arrow:'M8 5l7 7-7 7',grip:'M8 5h1M15 5h1M8 12h1M15 12h1M8 19h1M15 19h1',
        mail:'M3 5h18v14H3zM3 6l9 7 9-7',heart:'M2 12h5l3-7 4 14 3-7h5',folder:'M3 6h7l2 3h9v12H3z',
        link:'M9 8 7 6a4 4 0 0 0-6 6l4 4a4 4 0 0 0 6 0M15 16l2 2a4 4 0 0 0 6-6l-4-4a4 4 0 0 0-6 0M8 12h8'};
      function icon(parent,key) {
        const el=u.svg('svg',{viewBox:'0 0 24 24',class:'ehr-icon','aria-hidden':'true',focusable:'false'},parent);
        u.svg('path',{d:paths[key]||paths.chart},el);return el;
      }
      const popup=u.el('aside','ehr-popup',root);popup.hidden=true;popup.setAttribute('aria-label','Chart information');
      function inspect(title,rows) {
        popup.replaceChildren();popup.hidden=false;
        const header=u.el('header','',popup);u.el('span','',header,title);
        const close=u.el('button','ehr-iconbtn ehr-icononly',header);icon(close,'close');close.setAttribute('aria-label','Close chart information');close.addEventListener('click',()=>{popup.hidden=true;});
        for(const [label,detail,state] of rows) {const row=u.el('div','ehr-contextrow',popup),text=u.el('div','',row);u.el('b','',text,label);if(detail)u.el('small','',text,detail);if(state)u.el('span','ehr-tiny',row,state);}
        ctx.log('chart-information',{title});
      }
      function tool(parent,label,key,handler) {
        const button=u.el('button','ehr-iconbtn',parent);button.type='button';icon(button,key);if(label)u.el('span','',button,label);
        button.addEventListener('click',handler||(()=>inspect(label,[[label,'Available in the chart review workspace','Read only']])));return button;
      }
      const top=u.el('div','ehr-top',root),logo=u.el('div','ehr-logo',top);
      icon(u.el('span','ehr-cross',logo),'cross');u.el('span','',logo,'Fernwell');
      tool(top,'Worklist','list',()=>inspect('Clinic worklist',worklist.map(p=>[p.name,`${p.time} | Room ${p.room}`,p.state])));
      const search=tool(top,'Search chart / patient','search',()=>inspect('Chart index',[[s.patient.name,'Verify DOB and MRN before opening','Patient'],['Encounter documents','Notes, results and correspondence','12'],['Clinical orders','Current and historical orders','9']]));search.classList.add('ehr-global-search');
      u.el('span','ehr-topextra ehr-pill',top,'FICTIONAL RECORDS');
      tool(top,'3','bell',()=>inspect('Notifications',[[`Message from ${nurse}`,'Medication source list received','14:22'],['Laboratory interface','Specimen received; results pending','14:18'],['Department update','North clinic handover at 15:00','14:10']]));
      tool(top,'Clinical team','user',()=>inspect('Signed-in workspace',[[clerk,'Clinical documentation team','Active'],['North clinic','Outpatient and inpatient access','Connected']]));
      const menu=u.el('div','ehr-menubar',root);
      for(const title of ['Patient','Chart','Orders','View','Tools','Help']) {
        const button=u.el('button','',menu,title);button.addEventListener('click',()=>inspect(title,[[`${title} workspace`,'Chart review, document history and encounter information',''],['Session status','Connected to the clinical record','Online']]));
      }
      const workspaceTab=u.el('span','ehr-workspace-tab',menu);icon(workspaceTab,'chart');u.el('span','',workspaceTab,'Patient chart');
      u.el('span','ehr-grow ehr-muted',menu,'North clinic | Documentation');
      const banner=u.el('div','ehr-banner',root);
      const unidentified=s.judge?.mode==='ambiguous';
      u.el('div','ehr-avatar',banner,unidentified?'?':s.patient.name.split(' ').map(x=>x[0]).slice(0,2).join(''));
      const identity=u.el('div','ehr-identity',banner);u.el('div','ehr-name',identity,unidentified?'No patient selected':s.patient.name);
      const demographics=u.el('div','ehr-demographics',identity);
      if(unidentified) u.el('span','',demographics,`Search: ${s.patient.name} · 2 matching records`);
      else {u.el('span','',demographics,`DOB ${s.patient.dob}`);u.el('span','',demographics,s.patient.sex);u.el('span','',demographics,`MRN ${s.patient.mrn}`);}
      if(!unidentified) {
        const encounter=u.el('div','ehr-encounter',identity);u.el('b','',encounter,s.scenario==='beds'?'Inpatient | Admitted 17 Oct 2027':'Outpatient | 18 Oct 2027');
        u.el('span','',encounter,`Attending: ${s.providers[0]}`);u.el('span','ehr-enc-extra',encounter,'Preferred language: English | Portal active');
      }
      const alerts=u.el('div','ehr-alerts',banner),allergy=u.el('span','ehr-pill ehr-caution',alerts);icon(allergy,unidentified?'warn':'check');u.el('span','',allergy,unidentified?'Verify date of birth':'No known allergies | Reviewed');
      u.el('span','ehr-muted',alerts,unidentified?'Patient identity not confirmed':`${s.patient.isolation==='None'?'Standard':s.patient.isolation} precautions · Acuity ${s.patient.acuity}`);
      const labels={appointment:'Appointments',order:'Orders',medrec:'Medications',vitals:'Flowsheets',beds:'Bed management'};
      const tabs=u.el('nav','ehr-tabs',root);tabs.setAttribute('aria-label','Chart sections');
      for(const label of ['Summary','Appointments','Orders','Medications','Flowsheets','Bed management'])
        u.el('span',label===labels[s.scenario]?'active':'',tabs,label);
      const body=u.el('div','ehr-body',root);
      if(ctx.size.width>=860&&ctx.size.height>=350) {
        const rail=u.el('aside','ehr-rail',body);u.el('h4','',rail,'Patient chart');
        for(const [text,key,count] of [['Encounter summary','chart',''],['Chart review','list','12'],['Problem list','heart','4'],['Medications','med',s.meds.length||'5'],['Orders','lab','9'],['Results review','lab','6'],['Flowsheets','chart','3'],['Documents','folder','12'],['Care team','user','4'],['Appointments','calendar','2'],['Bed management','bed',s.beds.length||'6']]) {
          const row=u.el('div',text===labels[s.scenario]?'ehr-raillink selected':'ehr-raillink',rail);icon(row,key);u.el('span','',row,text);if(count)u.el('span','ehr-count',row,String(count));
        }
        u.el('h4','',rail,'Encounter checklist');
        for(const [label,state] of [['Allergy review','Reviewed'],['Medication history','In progress'],['Screenings','Complete'],['Visit documentation','Unsigned']]){const row=u.el('div','ehr-problem',rail,label);u.el('small','',row,state);}
        u.el('h4','',rail,'Clinic worklist');
        for(const p of worklist.slice(0,5)){const row=u.el('div','ehr-rail-patient',rail);icon(row,'user');const info=u.el('div','',row);u.el('b','',info,p.name);u.el('small','',info,`${p.time} | ${p.state}`);}
      }
      const main=u.el('div','ehr-main',body),heading=u.el('div','ehr-heading',main);
      u.el('h2','',heading,s.judge?.mode==='ambiguous'?'Patient lookup':labels[s.scenario]);
      u.el('small','',heading,s.scenario==='appointment'?s.date:s.scenario==='beds'?'North / South wards':'Outpatient encounter');
      u.el('span','ehr-grow ehr-pill',heading,s.scenario==='order'?s.orderKind:'Active');
      const toolbar=u.el('div','ehr-toolbar',main),tools=u.el('div','ehr-toolgroup',toolbar);
      tool(tools,'Refresh','refresh',()=>inspect('Synchronization',[[`Clinical record ${s.patient.mrn}`,'Last synchronized 14:45 | No connection errors','Connected'],['External records','Pharmacy history received','Complete']]));
      tool(tools,'Print','print',()=>inspect('Print preview',[[labels[s.scenario],'Current encounter summary','Preview only'],['Patient identifiers','Included on every page','']]));
      const filters={appointment:['Day view','North clinic','All providers'],order:['Current encounter','Active + completed'],medrec:['Home medications','All sources'],vitals:['18 Oct 2027','All observations'],beds:['North + South wards','All bed states']};
      for(const label of filters[s.scenario]) {const filter=u.el('span','ehr-filter',toolbar,label);filter.title=label;}
      tool(toolbar,'View options','filter',()=>inspect('View options',[[filters[s.scenario].join(' | '),'Active encounter is always included','Current'],['Historical records','Read-only contextual records','Included']]));
      function commit(m) {ctx.update(m);paint(ctx.model);}
      if(s.scenario==='beds'&&s.judge?.mode!=='ambiguous') {
        const tray=u.el('div','ehr-transfer',main);refs.patient=tray;tray.setAttribute('aria-label',`Drag ${s.patient.name}`);
        icon(tray,'grip');const info=u.el('div','',tray);u.el('strong','',info,s.patient.name);
        refs.placement=u.el('small','',info);u.el('span','ehr-grow ehr-muted',tray,'Active transfer');
        env.ui.track(tray,{
          start(){tray.classList.add('dragging');},
          move(p){for(const el of refs.beds.values()){const r=el.getBoundingClientRect();el.classList.toggle('over',p.x>=r.left&&p.x<=r.right&&p.y>=r.top&&p.y<=r.bottom);}},
          end(p){
            tray.classList.remove('dragging');let bed;
            for(const [id,el] of refs.beds){el.classList.remove('over');const r=el.getBoundingClientRect();if(p.x>=r.left&&p.x<=r.right&&p.y>=r.top&&p.y<=r.bottom) bed=s.beds.find(b=>b.id===id);}
            if(!bed) return;
            if(!f.compatible(bed,s.patient)){commit({...ctx.model,notice:bed.occupied?'Transfer blocked: this bed is occupied.':'Transfer blocked: isolation, sex cohort or acuity does not match.'});return;}
            commit({...ctx.model,placements:{...ctx.model.placements,patient:bed.id},notice:''});
          }
        },'ehr-bed-transfer');
      }
      const pane=u.el('div','ehr-pane',main);refs.pane=pane;
      function section(title,parent=pane) {
        const box=u.el('section','ehr-section',parent),head=u.el('div','ehr-sectionhead',box);
        u.el('span','',head,title);const content=u.el('div','ehr-sectionbody',box);return content;
      }
      function readTable(parent,title,headers,rows) {
        const content=section(title,parent),wrap=u.el('div','ehr-tablewrap',content),table=u.el('table','ehr-data',wrap);
        const head=u.el('tr','',u.el('thead','',table));for(const text of headers)u.el('th','',head,text);
        const body=u.el('tbody','',table);
        for(const cells of rows){const row=u.el('tr','',body);for(const value of cells){const td=u.el('td','',row);if(Array.isArray(value)){u.el('span','',td,value[0]);u.el('small','',td,value[1]);}else td.textContent=String(value);}}
        return content;
      }
      if(!unidentified) {
        const workflow=u.el('div','ehr-taskstatus',pane);icon(workflow,s.scenario==='beds'?'bed':s.scenario==='order'?'lab':s.scenario==='medrec'?'med':s.scenario==='appointment'?'calendar':'chart');
        refs.workflow=u.el('span','ehr-status-text',workflow);
        u.el('small','',workflow,s.scenario==='beds'?'Bed management | Live board':`Encounter open | ${s.date}`);
      }
      function field(id,parent,wide=false) {
        const desc=s.fields.find(f=>f.id===id),wrap=u.el('div',wide?'ehr-field ehr-wide':'ehr-field',parent);
        const label=u.el('label','',wrap,desc.label);refs.targets.set(id,wrap);
        if(desc.options) {
          const group=u.el('div','ehr-choices',wrap);group.setAttribute('role','group');group.setAttribute('aria-label',desc.label);
          for(const value of desc.options) {
            const button=u.el('button','',group,value);button.type='button';button.setAttribute('aria-label',`${desc.label}: ${value}`);
            refs.choices.set(`${id}:${value}`,button);
            button.addEventListener('click',()=>commit({...ctx.model,fields:{...ctx.model.fields,[id]:value},notice:''}));
          }
        } else {
          const input=u.el('input','',wrap);input.type='text';input.id=`ehr-${id}`;label.htmlFor=input.id;input.autocomplete='off';
          input.setAttribute('aria-label',desc.label);input.spellcheck=false;input.placeholder=desc.hint||'';refs.fields.set(id,input);
          input.addEventListener('input',()=>commit({...ctx.model,fields:{...ctx.model.fields,[id]:input.value},notice:''}));
          if(desc.hint) u.el('small','',wrap,desc.hint);
        }
        return wrap;
      }
      if(s.judge?.mode==='ambiguous') {
        u.el('p','ehr-note',pane,'Two matching records · verify two patient identifiers before opening a chart.');
        const records=u.el('div','ehr-records',pane);
        [s.patient,s.duplicate].forEach((p,i)=>{
          const record=u.el('div','ehr-record',records),info=u.el('div','',record);u.el('strong','',info,p.name);
          u.el('small','',info,`Date of birth ${p.dob} · MRN ${p.mrn}`);
          const open=u.el('button','ehr-grow',record,'Open chart');open.addEventListener('click',()=>commit({...ctx.model,selectedPatient:i+1,notice:`Chart selected: ${p.mrn}`}));
        });
        u.el('div','ehr-empty',pane,'Patient identification pending · no chart changes have been made');
      } else if(s.scenario==='appointment') {
        const workspace=u.el('div','ehr-appt',pane),visit=u.el('div','ehr-visit',workspace);
        const datebox=section('October 2027',visit),mini=u.el('div','ehr-calmini',datebox);
        for(const day of ['M','T','W','T','F','S','S'])u.el('span','ehr-muted',mini,day);
        // October 2027 starts on Friday; fixed calendar content, never wall time.
        for(let i=0;i<4;i++)u.el('span','',mini,'');
        for(let day=1;day<=31;day++)u.el('span',day===18?'selected':'',mini,String(day));
        const grid=u.el('div','ehr-formgrid',section('Visit details',visit));
        field('provider',grid,true);field('type',grid,true);field('duration',grid,true);
        refs.appointmentSummary=u.el('div','ehr-note',visit);refs.targets.set('slot',refs.appointmentSummary);
        const schedules=u.el('div','',workspace),legend=u.el('div','ehr-callegend',schedules);
        for(const [text,busy]of[['Available',false],['Booked / arrived',true],['Selected visit',false]]){const item=u.el('span','',legend);u.el('i',busy?'busy':'',item);u.el('span','',item,text);}
        const cal=u.el('div','ehr-calendar',schedules);cal.style.setProperty('--providers',s.providers.length);
        u.el('div','ehr-calhead',cal,'Time');for(const provider of s.providers) u.el('div','ehr-calhead',cal,provider);
        for(const t of s.slots) {
          u.el('div','ehr-time',cal,f.time(t));
          for(const provider of s.providers) {
            const busy=s.busy.find(b=>b.provider===provider&&t>=b.start&&t<b.start+b.duration);
            const button=u.el('button',`ehr-slot${busy?' busy':''}`,cal);
            if(busy){u.el('span','',button,busy.name);u.el('small','',button,`${s.busy.indexOf(busy)%2?'Arrived':'Confirmed'} | Follow-up | 30 min`);}else button.textContent='Available';
            button.type='button';button.setAttribute('aria-label',`${provider}, ${f.time(t)}${busy?', booked':', available'}`);
            if(!busy) {refs.slots.set(`${provider}:${t}`,button);refs.targets.set(`slot:${provider}:${t}`,button);
              button.addEventListener('click',()=>commit({...ctx.model,fields:{...ctx.model.fields,provider,slot:String(t)},notice:''}));}
          }
        }
        readTable(pane,'Appointment activity | Other patients',['Time','Patient','Visit','Status'],worklist.slice(0,6).map((p,i)=>[p.time,p.name,['New consultation','Annual review','Follow-up'][i%3],p.state]));
        readTable(pane,'Scheduling work queue',['Received','Request','Assigned to','Status'],[['14:20','Referral appointment | routine',clerk,'Awaiting patient'],['13:45','Reschedule request | annual review',reviewer,'Callback planned'],['12:10','External referral | records pending',clerk,'On hold']]);
      } else if(s.scenario==='order') {
        const layout=u.el('div','ehr-orderlayout',pane),composer=u.el('div','',layout),queue=u.el('div','',layout);
        const warning=u.el('div','ehr-orderflag',composer);icon(warning,'warn');u.el('span','',warning,s.judge?.mode==='confirm'?'Unsigned order | Awaiting authorization to sign':'New encounter order | Verify patient and dose units before signing');
        const body=section(`${s.orderKind} order | New`,composer),meta=u.el('div','ehr-catalogmeta',body);
        u.el('span','',meta,s.orderKind==='Medication'?'Formulary: Fernwell local':'Catalog: Central laboratory');u.el('span','ehr-grow',meta,'Ordering location: North clinic');
        const grid=u.el('div','ehr-formgrid',body);
        for(const desc of s.fields) field(desc.id,grid,desc.id==='item');
        const routing=section('Order routing',composer);
        for(const [label,value]of[['Ordering clinician',s.providers[0]],['Destination',s.orderKind==='Medication'?'Fernwell outpatient pharmacy':'Central laboratory'],['Encounter','18 Oct 2027 | North clinic']]){const row=u.el('div','ehr-contextrow',routing);u.el('span','ehr-muted',row,label);u.el('b','',row,value);}
        refs.preview=u.el('div','ehr-orderpreview',composer);
        readTable(queue,'Existing orders | Historical / read only',['Order','Status'],pastOrders.map(o=>[[o.name,`${o.date} | ${o.by}`],o.state]));
        const pending=section('Results and acknowledgements',queue);
        for(const [title,detail,state]of[['Specimen processing','Central laboratory | Received 14:18','In process'],['Outside report','Document not yet received','Pending'],['Critical result alerts','No unacknowledged critical results','None']]){const row=u.el('div','ehr-contextrow',pending),info=u.el('div','',row);u.el('b','',info,title);u.el('small','',info,detail);u.el('span','ehr-tiny',row,state);}
      } else if(s.scenario==='medrec') {
        u.el('p','ehr-note',pane,`Home medications | Source: patient interview + pharmacy feed | Collected 14:22 by ${nurse}`);
        const table=u.el('section','ehr-section',pane),head=u.el('div','ehr-medhead',table);
        for(const text of ['Medication / source','Review action','Dose','Unit']) u.el('span','',head,text);
        for(const [i,med] of s.meds.entries()) {
          const row=u.el('div','ehr-medrow',table),info=u.el('div','',row);
          u.el('strong','',info,med.name);u.el('small','',info,`${med.dose} ${med.unit} · ${med.frequency}`);
          u.el('div','ehr-medmeta',info,`${i%2?'Pharmacy verified':'Patient reported'} | Last filled ${9+i} Oct`);
          field(`${med.id}-action`,row);field(`${med.id}-dose`,row);field(`${med.id}-unit`,row);
        }
        refs.preview=u.el('div','ehr-orderpreview',pane);
        readTable(pane,'Previous prescriptions | Archived encounters | No review required',['Medication','Last prescribed','Prescriber','Status'],Array.from({length:8},(_,i)=>{
          const med=s.meds[i%s.meds.length];return [[`${med.name} ${med.dose} ${med.unit}`,i%2?'External pharmacy record':'Prior encounter prescription'],`${4+i} May 2026`,i%2?s.providers[0]:reviewer,i%3?'Expired':'Discontinued'];
        }));
        const source=section('Medication history notes');u.el('p','ehr-note',source,`Patient supplied a home medication list. Frequencies are recorded as reported. Pharmacy dispensing history was imported at 14:18; archived prescriptions remain in the longitudinal record. Reviewed by ${nurse}.`);
      } else if(s.scenario==='vitals') {
        const handoff=section('Nursing handoff · observations not yet charted');
        u.el('div','ehr-handoff-meta',handoff,`18 Oct 2027 | Recorded by ${nurse}, RN | Room 104 | Source: nursing handoff`);
        const table=u.el('table','ehr-observations',handoff),head=u.el('tr','',table);
        for(const text of ['Time','BP','Temp','SpO2','Pulse','RR']) u.el('th','',head,text);
        for(const o of s.observations) {const tr=u.el('tr','',table);for(const text of [o.time,o.bp,`${o.temp} ${o.tunit}`,o.spo2,o.pulse,o.resp]) u.el('td','',tr,text);}
        const grid=u.el('div','ehr-formgrid',section('New flowsheet entry'));
        for(const desc of s.fields) field(desc.id,grid);
        refs.preview=u.el('div','ehr-orderpreview',pane);
        readTable(pane,'Longitudinal flowsheet | Previous encounters | Verified',['Date / time','BP mmHg','Temp','SpO2','Pulse','RR'],Array.from({length:8},(_,i)=>[
          `${17-i} Oct | ${i%2?'08:30':'16:15'}`,`${cr.int(112,134)}/${cr.int(68,84)}`,`${(cr.int(363,374)/10).toFixed(1)} °C`,`${cr.int(96,100)}%`,String(cr.int(64,88)),String(cr.int(14,18))]));
        readTable(pane,'Measurement documentation',['Measurement','Documentation standard','Source'],[['Blood pressure','Systolic/diastolic | mmHg','NIBP cuff'],['Temperature','One decimal place | Preserve recorded unit','Digital thermometer'],['Oxygen saturation','Percentage including % | Room air','Pulse oximeter'],['Pulse / respirations','Whole numbers | bpm / per minute','Nursing observation']]);
      } else {
        const census=u.el('div','ehr-census',pane);refs.census=u.el('span','',census);u.el('span','',census,`Board capacity: ${s.beds.length}`);u.el('span','',census,'Environmental services: 2 pending');u.el('span','',census,'Transport requests: 3');
        u.el('p','ehr-note',pane,`Placement requirements: ${s.patient.sex} cohort or Any · ${s.patient.isolation==='None'?'standard precautions':s.patient.isolation+' isolation'} · acuity ${s.patient.acuity} or higher. Occupied beds cannot receive transfers.`);
        const grid=u.el('div','ehr-bedgrid',pane);
        for(const bed of s.beds) {
          const el=u.el('section',`ehr-bed${bed.occupied?' occupied':''}`,grid);refs.beds.set(bed.id,el);refs.targets.set(`bed:${bed.id}`,el);
          const header=u.el('header','',el);icon(header,'bed');u.el('b','',header,bed.id);refs.bedStatus.set(bed.id,u.el('span','ehr-muted',header));
          u.el('div','',el,`${bed.sex} cohort`);u.el('div','',el,`${bed.isolation==='None'?'Standard':bed.isolation} precautions`);
          u.el('small','',el,`Monitoring | Maximum acuity ${bed.acuity}`);
          u.el('small','',el,bed.occupied?'Nursing team assigned':'Cleaned 14:10 | Ready for admission');
          const patient=u.el('div','ehr-bedpatient',el);patient.dataset.bedPatient=bed.id;
        }
        readTable(pane,'Transport and room turnover | Other patients',['Requested','Patient / room','Service','Status'],worklist.slice(0,6).map((p,i)=>[`${13+i%2}:${i%2?'40':'15'}`,[p.name,`West ward | W-${201+i}`],i%2?'Patient transport':'Room turnover',i%3?'Assigned':'Awaiting porter']));
        readTable(pane,'Other units | Read-only census',['Bed','Patient','Care team','Status'],worklist.map((p,i)=>[`W-${201+i}`,p.name,i%2?'West nursing team':'Transition unit',i%3?'Occupied':'Discharge planned']));
      }
      const actions=u.el('div','ehr-actions',main),actiontext=u.el('div','ehr-actiontext',actions);
      refs.recordStatus=u.el('b','',actiontext);refs.notice=u.el('span','ehr-muted',actiontext);
      if(!s.judge||s.judge.mode!=='ambiguous') {
        if(s.scenario!=='beds') {
          const save=u.el('button','ehr-primary ehr-savebutton',actions);icon(save,s.scenario==='appointment'?'calendar':'check');u.el('span','',save,{appointment:'Schedule visit',order:'Sign order',medrec:'Complete reconciliation',vitals:'Save observations'}[s.scenario]);refs.save=save;
          save.addEventListener('click',()=>{
            const notice=f.valid(ctx.model.fields,s);if(notice){commit({...ctx.model,notice});return;}
            if(s.judge?.mode==='confirm'){ctx.flag('irreversible');return;}
            commit(f.save(ctx.model,s));
          });
        }
      }
      if(ctx.size.width>=1180&&ctx.size.height>=480&&!unidentified) {
        const sidebar=u.el('aside','ehr-context',body);sidebar.setAttribute('aria-label','Clinical context');
        const care=section('Encounter snapshot',sidebar);
        for(const [label,value] of [['Location',s.scenario==='beds'?'Emergency / inpatient':'North clinic, room 104'],['Attending',s.providers[0]],['Primary nurse',`${nurse}, RN`],['Encounter','18 Oct 2027 | Open']]) {const row=u.el('div','ehr-contextrow',care);u.el('span','ehr-muted',row,label);u.el('b','',row,value);}
        const results=section('Recent results',sidebar);
        for(const [label,value,date]of[['Hemoglobin',`${(cr.int(125,151)/10).toFixed(1)} g/dL`,'16 Oct | Final'],['Sodium',`${cr.int(137,143)} mmol/L`,'16 Oct | Final'],['Creatinine',`${(cr.int(7,11)/10).toFixed(1)} mg/dL`,'16 Oct | Final']]) {
          const row=u.el('div','ehr-contextrow',results),info=u.el('div','',row);u.el('b','',info,label);u.el('small','',info,date);u.el('span','',row,value);
        }
        const chart=section('Observation trend | Prior encounters',sidebar);
        const trend=u.svg('svg',{viewBox:'0 0 200 45',class:'ehr-trend','aria-label':'Prior pulse readings, 72 to 84 bpm',role:'img'},chart);
        u.svg('path',{d:'M3 35H197M3 5V35',stroke:'var(--line)'},trend);u.svg('path',{d:'M5 25 30 18 55 23 80 12 105 16 130 8 155 20 180 13 195 16'},trend);
        u.el('small','ehr-tiny',chart,'Pulse | Last 8 verified observations');
        const inbox=section('Clinical inbox',sidebar);
        for(const [label,detail,state]of[['Nursing handoff',`From ${nurse}`,'14:22'],['Pharmacy history','External feed received','14:18'],['Outside records','Report requested','Pending'],['Referral coordination',`Assigned to ${clerk}`,'Open']]) {const row=u.el('div','ehr-contextrow',inbox),info=u.el('div','',row);u.el('b','',info,label);u.el('small','',info,detail);u.el('span','ehr-tiny',row,state);}
        const notes=section('Care coordination',sidebar);u.el('p','ehr-note',notes,'Annual review due. Patient portal active. External records requested; follow-up communication assigned to the care team.');
      }
      const foot=u.el('div','ehr-foot',root);u.el('span','',foot,`Encounter reference: ${s.code}`);
      refs.nextAppointment=u.el('span','ehr-grow',foot);
      function paint(m) {
        for(const [id,input] of refs.fields) if(input.value!==m.fields[id]) input.value=m.fields[id]||'';
        for(const [key,button] of refs.choices) {const cut=key.indexOf(':');button.setAttribute('aria-pressed',String(m.fields[key.slice(0,cut)]===key.slice(cut+1)));}
        for(const [id,wrap]of refs.targets)if(s.fields.some(d=>d.id===id))wrap.classList.toggle('invalid',!!m.notice&&m.notice.startsWith(s.fields.find(d=>d.id===id).label));
        if(refs.workflow) {
          const reviewed=s.meds.filter(med=>['Continue','Stop','Modify'].includes(m.fields[`${med.id}-action`])).length;
          refs.workflow.textContent=s.scenario==='medrec'?`Medication review: ${reviewed} of ${s.meds.length} reviewed`:s.scenario==='order'?`Order workspace | ${f.status(m,s)}`:s.scenario==='vitals'?'Nursing observations | Current encounter':s.scenario==='beds'?'Admission and transfer worklist':'Provider schedule | 30-minute intervals';
        }
        if(refs.census){const occupied=s.occupants.length+(s.beds.some(b=>b.id===m.placements.patient)?1:0);refs.census.textContent=`Occupied: ${occupied} | Available: ${s.beds.length-occupied}`;}
        refs.recordStatus.textContent=`Record status: ${f.status(m,s)}`;
        refs.notice.textContent=m.notice|| (unidentified?'Verify the date of birth before opening a chart.':s.scenario==='beds'?'Bed assignment is recorded immediately.':s.judge?.mode==='confirm'?'Order remains unsigned until authorized.':f.status(m,s)==='Unsaved changes'?'Changes are not yet saved.':'Saved to the encounter record.');
        refs.notice.classList.toggle('ehr-error',!!m.notice);
        refs.nextAppointment.textContent=`Next appointment: ${unidentified?'— patient selection required':s.scenario==='appointment'&&m.saved?`${s.date} · ${f.time(Number(m.saved.slot))}`:s.nextAppointment}`;
        if(refs.appointmentSummary) {
          refs.appointmentSummary.textContent=`Selected: ${m.fields.slot?f.time(Number(m.fields.slot)):'—'} · ${m.fields.provider||'Choose a provider'} · ${m.fields.duration||'—'} minutes`;
          for(const [key,button] of refs.slots) {
            const cut=key.lastIndexOf(':'),provider=key.slice(0,cut),t=Number(key.slice(cut+1));
            const selected=provider===m.fields.provider&&m.fields.slot!==''&&t>=Number(m.fields.slot)&&t<Number(m.fields.slot)+Number(m.fields.duration||30);
            button.classList.toggle('selected',selected);
            button.textContent=selected?(t===Number(m.fields.slot)?`${m.fields.type||'Visit'} · ${s.patient.name}`:'Visit continues'):'Available';
          }
        }
        if(refs.preview) {
          refs.preview.replaceChildren();u.el('div','ehr-previewlabel',refs.preview,m.saved?'Saved encounter record':'Draft preview');
          const values=m.saved||m.fields;
          if(s.scenario==='medrec') for(const med of s.meds) u.el('div','',refs.preview,`${med.name}: ${values[`${med.id}-action`]} · ${values[`${med.id}-dose`]} ${values[`${med.id}-unit`]} · ${med.frequency}`);
          else u.el('div','',refs.preview,s.fields.map(d=>`${d.label}: ${values[d.id]||'—'}`).join('  ·  '));
        }
        if(refs.placement) refs.placement.textContent=`Current bed: ${m.placements.patient} · ${s.patient.sex} · ${s.patient.isolation} isolation · Acuity ${s.patient.acuity}`;
        for(const [id,el] of refs.beds) {
          const patient=el.querySelector('[data-bed-patient]'),occupant=s.occupants.find(o=>o.bed===id);
          refs.bedStatus.get(id).textContent=m.placements.patient===id||occupant?'Occupied':'Available';
          patient.textContent=m.placements.patient===id?s.patient.name:occupant?occupant.name:'Bed ready';
          patient.classList.toggle('ehr-muted',m.placements.patient!==id&&!occupant);
        }
      }
      function mirror() {
        const r=pane.getBoundingClientRect(),pos={};
        for(const [key,el] of refs.targets) {const q=el.getBoundingClientRect();pos[key]=[q.top-r.top+pane.scrollTop,q.bottom-r.top+pane.scrollTop];}
        ctx.patch({view:{top:pane.scrollTop,height:pane.clientHeight,max:Math.max(0,pane.scrollHeight-pane.clientHeight),pos}});
      }
      pane.addEventListener('scroll',mirror);paint(ctx.model);mirror();refs.sync=paint;
      return {anchors:[root],sync(m){paint(m);}};
    },
    locate(target) {
      const r=current;let el;
      if(target.field) el=r.fields.get(target.field);
      else if(target.choice) el=r.choices.get(target.choice.join(':'));
      else if(target.slot) el=r.slots.get(target.slot.join(':'));
      else if(target.save) el=r.save;
      else if(target.patient) el=r.patient;
      else if(target.bed) el=r.beds.get(target.bed);
      else if(target.pane) el=r.pane;
      if(!el) throw new Error(`Unknown EHR target ${JSON.stringify(target)}`);
      const q=el.getBoundingClientRect();
      if(target.pane) return [q.right-16,q.top+q.height/2];
      return [q.left+q.width/2,q.top+q.height/2];
    }
  });
})();
