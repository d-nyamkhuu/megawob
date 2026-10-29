// Design on the shared use-dispatch operations workspace.
env.widget({
  task: 'use-dispatch',
  site: 'design-use-dispatch-reschedule-03',
  name: 'design',
  split: 'train',
  scenarios: ['reschedule'],
  template: 'use-dispatch/workspace',
  design: {
    font: 'Georgia, "Times New Roman", serif',
    panel: '#f2efe3', foreground: '#10172d', line: '#96988f', background: '#efe7cf',
    accent: '#075365', muted: '#45443e', warning: '#a34b35',
    inset: 3, cardHeight: 72, cardGap: 7, paneInset: 5, laneHeaderHeight: 70,
    parts: {
      styles(base) {
        return (ctx) => {
        base(ctx);
        ctx.css('dispatch-week-plan', `
          .ad-app { border-radius:2px !important; box-shadow:none !important; font:16px/1.22 Georgia,"Times New Roman",serif !important; }
          .ad-toolbar,.ad-nav,.ad-context,.ad-filters,.ad-rail,.ad-activity-dock,.ad-footer { display:none !important; }
          .ad-shell,.ad-work,.ad-workspace,.ad-main { min-height:0 !important; height:100% !important; }
          .ad-workspace { display:flex !important; flex-direction:column !important; }
          .ad-main:before { content:"Weekly Plan     │     All Deliveries     │     Vehicles     │     Map"; flex:none; height:38px; display:flex; align-items:center; padding:0 18px; color:#111; background:linear-gradient(#d9d6ce,#c9c6bd); border-bottom:1px solid #96988f; font:18px Georgia,"Times New Roman",serif; white-space:pre; }
          .ad-lanes { display:grid !important; grid-template-columns:minmax(0,1fr) !important; grid-template-rows:none !important; grid-auto-rows:minmax(118px,15.2vh) !important; align-content:start !important; gap:7px !important; padding:5px !important; overflow:auto !important; background:#efe7cf !important; }
          .ad-lane[aria-label="Unassigned"]:not(:has(.ad-card)) { display:none !important; }
          .ad-lane { display:flex !important; flex-direction:row !important; min-height:0 !important; border:1px solid #96988f !important; border-radius:1px !important; background:#f2efe3 !important; }
          .ad-lane-head { flex:0 0 19% !important; width:19% !important; height:auto !important; min-height:0 !important; padding:7px 10px !important; border:0 !important; border-right:1px solid #96988f !important; background:#cadff0 !important; }
          .ad-lane:nth-child(2) .ad-lane-head { background:#cadff0 !important; }
          .ad-lane:nth-child(3) .ad-lane-head { background:#cee8c7 !important; }
          .ad-lane:nth-child(4) .ad-lane-head { background:#f4e7bd !important; }
          .ad-lane:nth-child(5) .ad-lane-head { background:#efd0d1 !important; }
          .ad-lane:nth-child(6) .ad-lane-head { background:#ddd3e9 !important; }
          .ad-lane-head strong { display:block !important; color:#07156d !important; font:bold 24px/1.1 Georgia,"Times New Roman",serif !important; }
          .ad-lane-head strong svg { display:none !important; }
          .ad-lane-head .ad-meta { color:#111 !important; font:16px/1.15 Georgia,"Times New Roman",serif !important; white-space:normal !important; margin-top:2px !important; }
          .ad-lane-head .ad-load { color:#07156d !important; font:bold 18px/1.1 Georgia,"Times New Roman",serif !important; margin-top:3px !important; }
          .ad-bar { display:none !important; }
          .ad-pane { display:flex !important; flex:1 1 0 !important; min-width:0 !important; max-width:none !important; flex-direction:column !important; flex-wrap:nowrap !important; align-content:flex-start !important; align-items:stretch !important; gap:8px !important; overflow:auto !important; padding:8px 10px !important; }
          .ad-empty { display:none !important; }
          .ad-card { flex:0 0 82px !important; width:auto !important; height:82px !important; margin:0 !important; padding:9px 10px !important; border:1px solid #96988f !important; border-left:1px solid #96988f !important; border-radius:3px !important; box-shadow:inset 1px 1px #fff,1px 1px #bbb !important; background:#cadff0 !important; font:16px/1.15 Georgia,"Times New Roman",serif !important; }
          .ad-card:nth-child(even) { background:#efd9e8 !important; }
          .ad-card { padding-left:54px !important; }
          .ad-card:before { content:""; position:absolute; left:11px; top:22px; width:34px; height:31px; border:2px solid #6e5229; clip-path:polygon(50% 0,100% 22%,100% 78%,50% 100%,0 78%,0 22%); background:linear-gradient(30deg,transparent 47%,#76572e 48% 53%,transparent 54%),linear-gradient(150deg,transparent 47%,#76572e 48% 53%,transparent 54%),linear-gradient(90deg,#d4ae68,#f1d79a 48%,#c99b50); filter:drop-shadow(1px 1px 0 #776c55); }
          .ad-card[aria-label^="J2:"]:before,.ad-card[aria-label^="J4:"]:before,.ad-card[aria-label^="J5:"]:before,.ad-card[aria-label^="J8:"]:before { background:linear-gradient(30deg,transparent 47%,#76572e 48% 53%,transparent 54%),linear-gradient(150deg,transparent 47%,#76572e 48% 53%,transparent 54%),linear-gradient(90deg,#bd8e45,#f0d49a 48%,#b77d35); }
          .ad-card[aria-label^="J3:"]:before,.ad-card[aria-label^="J7:"]:before { left:14px; top:19px; width:25px; height:36px; border:2px solid #173a55; border-radius:7px/5px; clip-path:none; background:repeating-linear-gradient(to bottom,#4d91b5 0 5px,#174363 6px 8px); }
          .ad-card[aria-label^="J6:"]:before { background:linear-gradient(30deg,transparent 44%,#754a20 46% 52%,transparent 54%),linear-gradient(150deg,transparent 44%,#754a20 46% 52%,transparent 54%),linear-gradient(90deg,#a96d32,#e0b06d 48%,#98602a); }
          .ad-card-top { gap:6px !important; }
          .ad-id { color:#07156d !important; font:bold 20px Georgia,"Times New Roman",serif !important; }
          .ad-weight { color:#07156d !important; font:bold 17px Georgia,"Times New Roman",serif !important; }
          .ad-card .ad-customer { color:#111 !important; font:18px Georgia,"Times New Roman",serif !important; }
          .ad-card .ad-weight { font-size:18px !important; }
          .ad-card .ad-card-note,.ad-card .ad-state,.ad-card .ad-grip { display:none !important; }
          .ad-lane.bad { outline:0 !important; }
        `);
        };
      },
    },
  },
});
