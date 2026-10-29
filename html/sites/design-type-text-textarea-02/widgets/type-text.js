// Keep the reference form's behavior, with a newspaper layout fitted before anchoring.
env.widget({
  task: 'type-text',
  site: 'design-type-text-textarea-02',
  name: 'design',
  split: 'train',
  scenarios: ['textarea'],
  template: 'type-text/base',
  design: {
    parts: {
      stageBox: () => (ctx) => ({ ...ctx.size, host: ctx.stage }),
      ensureStyle: (base) => () => {
        base();
        if (document.getElementById('faz-form-layout')) return;
        const style = document.createElement('style');
        style.id = 'faz-form-layout';
        style.textContent = `
          .faz-form { display:block; position:relative; flex:none; box-sizing:border-box; max-width:none; margin:0; padding:var(--faz-pad) 0; border:0; border-radius:0; box-shadow:none; }
          .faz-form .faz-title { display:block; position:relative; margin:0 0 var(--faz-title-gap); padding:0 0 var(--faz-title-pad) 62px; }
          .faz-title::before { content:'2'; position:absolute; left:0; top:-1px; width:40px; height:40px; border-radius:50%; display:grid; place-items:center; background:#d20d12; color:#fff; font:bold 22px Georgia; }
          .faz-grid { display:flex; flex-direction:column; align-items:stretch; gap:var(--faz-gap); }
          .faz-field { display:flex; flex-direction:column; min-width:0; gap:var(--faz-label-gap); }
          .faz-label { display:block; }
          .faz-inwrap { position:relative; min-width:0; }
          .faz-form .faz-address { order:-1; }
          .faz-input { display:block; box-sizing:border-box; width:100%; height:var(--ft-h); margin:0; padding:5px 10px; outline:none; user-select:text; -webkit-user-select:text; caret-color:var(--accent); }
          .faz-ta .faz-input { height:var(--faz-ta); min-height:0; padding:8px 10px; resize:none; line-height:1.35; }
          .faz-ta { display:flex; flex-direction:column; }
          .faz-count { position:static; align-self:flex-start; margin-top:4px; white-space:nowrap; font-variant-numeric:tabular-nums; }
          .faz-err { height:16px; line-height:16px; margin-top:-3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color:#b32024; }
          .faz-actions { display:flex; align-items:center; min-width:0; gap:14px; margin-top:var(--faz-action-gap); }
          .faz-actions.right { flex-direction:row-reverse; }
          .faz-save { flex:none; height:var(--faz-button); padding:0 18px; border:0; cursor:pointer; color:white; }
          .faz-status { flex:1; min-width:0; font-size:13.5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color:var(--muted); }
          .faz-status.ok { color:#2b8a3e; font-weight:bold; }
          .faz-status.bad { color:#b32024; }
          .faz-input.bad { border-color:#b32024; }
          .dis-grey .faz-input:disabled { background:#eee; border-style:dashed; }
          @media(max-height:700px) { .faz-form .faz-title { padding-left:47px; } .faz-title::before { width:29px; height:29px; font-size:17px; } }
        `;
        document.head.appendChild(style);
      },
      build: (base, S) => (ctx, look) => {
        const stageStyle = getComputedStyle(ctx.stage);
        const width = Math.max(0, Math.min(ctx.size.width - 24,
          ctx.stage.clientWidth - parseFloat(stageStyle.paddingLeft) - parseFloat(stageStyle.paddingRight)));
        const height = Math.min(ctx.size.height - 16,
          ctx.stage.clientHeight - parseFloat(stageStyle.paddingTop) - parseFloat(stageStyle.paddingBottom) - 12);
        const card = base(ctx, { ...look, layout:'stacked', ruled:false, caps:false,
          underline:false, subtitle:'', vars:{ ...look.vars, '--ft-w':'100%' } });
        // Own class names avoid the imported stylesheet's fixed-size form rules.
        const classes = ['ft-grid','ft-field','ft-label','ft-inwrap','ft-input','ft-count','ft-err','ft-actions','ft-save','ft-status'];
        for (const name of classes) {
          for (const element of card.querySelectorAll(`.${name}`)) element.classList.replace(name, name.replace('ft-', 'faz-'));
        }
        card.classList.replace('ft-card','faz-form');
        card.firstElementChild.classList.add('faz-title');
        card.style.width = `${width}px`;
        for (const input of Object.values(S.st.inputs)) {
          if (input.f.type === 'textarea') {
            input.el.closest('.faz-field').classList.add('faz-address');
            input.el.parentElement.classList.replace('ta','faz-ta');
          }
        }
        // Fit the newspaper form before the template measures and freezes its anchors.
        for (let step = 0; step <= 10; step++) {
          const t = step / 10;
          const values = {
            '--faz-pad':18 - 14*t, '--faz-title-gap':18 - 13*t,
            '--faz-title-pad':11 - 7*t, '--faz-gap':14 - 10*t,
            '--faz-label-gap':6 - 3*t, '--ft-h':39 - 13*t,
            '--faz-ta':132 - 84*t, '--faz-action-gap':14 - 10*t,
            '--faz-button':38 - 12*t,
          };
          for (const [key,value] of Object.entries(values)) card.style.setProperty(key, `${value}px`);
          if (card.getBoundingClientRect().height <= height) break;
        }
        return card;
      },
      paint: (base, S) => (model) => {
        base(model);
        if (S.st.status) S.st.status.classList.replace('ft-status','faz-status');
      },
    },
  },
});
