// Keep the reference form bindings and oracle; size the two-column sheet in its stage.
env.widget({
  task: 'type-text',
  site: 'design-type-text-complete-02',
  name: 'design',
  split: 'train',
  scenarios: ['complete'],
  template: 'type-text/base',
  design: {parts: {
    CSS: () => `
      .ft-wrap {display:flex;flex-direction:column-reverse;align-items:stretch;gap:var(--pm-gap)}
      .ft-card {box-sizing:border-box;display:flex;flex-direction:column;flex:1;min-height:0;padding:0;border:1px solid #888;border-radius:3px;background:#eee;box-shadow:none;color:#111}
      .ft-card h2 {flex:none;box-sizing:border-box;height:var(--pm-title);margin:0;padding:4px 16px;background:linear-gradient(#ddd,#c5c5c5);border-bottom:1px solid #888;font-size:var(--pm-fs);line-height:1.2}
      .ft-grid {display:grid;flex:1;min-height:0;grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:repeat(var(--pm-rows),minmax(0,1fr));grid-auto-flow:column;column-gap:clamp(16px,3vw,48px);row-gap:var(--pm-rowgap);padding:var(--pm-pad) 16px}
      .ft-field {display:flex;flex-direction:column;gap:2px;min-width:0;min-height:0}
      .ft-label {flex:none;font-size:var(--pm-fs);font-weight:400;line-height:1.1;color:#111}
      .ft-inwrap {position:relative;min-width:0;flex:1;min-height:0;max-height:min(35px,var(--pm-input))}
      .ft-inwrap.ta {max-height:var(--pm-input)}
      .ft-input {box-sizing:border-box;display:block;width:100%;height:100%;min-height:0;margin:0;padding:2px 8px;border:1px solid #777;border-radius:0;background:#fff;color:#111;font:var(--pm-fs) Arial,sans-serif;box-shadow:inset 1px 1px 2px #bbb;outline:none;user-select:text;resize:none}
      .ft-input:focus {border-color:#2868ea}
      .ft-input:disabled {background:#ddd;color:#555}
      .ft-input.bad {border-color:#b00}
      .ft-err {flex:none;height:var(--pm-err);font-size:10px;line-height:var(--pm-err);color:#b00;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .ft-count {position:absolute;right:5px;bottom:2px;font-size:10px;color:#555}
      .ft-input.counted {padding-right:45px}
      .ft-req {color:#b00;margin-left:6px;font-weight:bold}
      .ft-opt {color:#333;font-weight:400}
      .ft-actions {display:flex;flex:none;align-items:center;gap:10px;padding:0 16px 5px;height:var(--pm-actions);box-sizing:border-box}
      .ft-actions.right {flex-direction:row-reverse}
      .ft-save {flex:none;height:100%;padding:1px 16px;border:1px solid #666;border-radius:0;background:linear-gradient(#fafafa,#ccc);box-shadow:inset 1px 1px white;color:#111;font:var(--pm-fs) Arial,sans-serif;cursor:pointer}
      .ft-status {min-width:0;font-size:12px;color:#555;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .ft-status.ok {color:#28703c}.ft-status.bad {color:#b00}
      .ft-profile {box-sizing:border-box;flex:none;height:var(--pm-profile);min-height:0;padding:0 16px 6px;border:1px solid #888;border-radius:3px;background:linear-gradient(110deg,#f7f7f7,#eee);display:grid;grid-template-columns:minmax(90px,22%) minmax(0,1fr);column-gap:16px;grid-template-rows:var(--pm-title) minmax(0,1fr)}
      .ft-profile:before {content:'Saved Contact Details';grid-column:1/-1;box-sizing:border-box;margin:0 -16px 5px;padding:4px 16px;background:linear-gradient(#ddd,#c5c5c5);border-bottom:1px solid #888;font-size:var(--pm-fs);font-weight:bold}
      .ft-profile-h {display:flex;gap:8px;align-items:center;font-size:var(--pm-fs);font-weight:bold;min-width:0}
      .ft-avatar {display:grid;place-items:center;flex:none;width:var(--pm-avatar);height:var(--pm-avatar);border:1px solid #333;background:#2868ea;color:white;font-size:24px}
      .ft-profile dl {display:grid;grid-template-columns:repeat(var(--pm-pcols),minmax(0,1fr));gap:2px 12px;margin:0;align-content:space-evenly;min-width:0;min-height:0;overflow:auto}
      .ft-profile dt {font-size:var(--pm-dt);line-height:1.1;color:#555}
      .ft-profile dd {margin:0;font-size:var(--pm-value);line-height:1.1;color:#111;overflow-wrap:anywhere}
    `,
    build: (base, S) => (ctx, look) => {
      const width = Math.max(1, ctx.size.width - 24);
      const height = Math.max(1, ctx.size.height - 16);
      const profile = ctx.spec.source === 'card';
      const rows = Math.ceil(ctx.spec.fields.length / 2);
      const compact = height < 400;
      const title = compact ? 24 : 40;
      const profileHeight = Math.min(180, Math.max(85, height * .28));
      const gap = compact ? 7 : 14;
      const actions = ctx.spec.save ? (compact ? 28 : 38) : 0;
      const rowHeight = (height - (profile ? profileHeight + gap : 0) - title - actions - 12 - (rows - 1) * 3) / rows;
      const font = Math.min(18, Math.max(12, rowHeight * .28));
      const err = ctx.spec.save ? (compact ? 10 : 14) : 0;
      const vars = {
        ...look.vars,
        '--pm-rows': rows,
        '--pm-gap': `${gap}px`,
        '--pm-rowgap': '3px',
        '--pm-pad': '5px',
        '--pm-title': `${title}px`,
        '--pm-fs': `${font}px`,
        '--pm-err': `${err}px`,
        '--pm-input': `${Math.min(78, Math.max(20, rowHeight - font * 1.1 - err - 4))}px`,
        '--pm-profile': `${profileHeight}px`,
        '--pm-actions': `${actions}px`,
        '--pm-avatar': `${compact ? 25 : 65}px`,
        '--pm-pcols': width < 650 ? 3 : 4,
        '--pm-dt': `${compact ? 9 : 11}px`,
        '--pm-value': `${compact ? 11 : 15}px`,
      };
      const card = base(ctx, {...look, layout:'columns', aside:'right', subtitle:'', caps:false, underline:false, vars});
      S.st.box.style.width = `${width}px`;
      S.st.box.style.height = `${height}px`;
      return card;
    },
  }},
});
