// Keep the reference controls and size the account surface from the stage's free area.
env.widget({
  task: 'type-text',
  site: 'design-type-text-sections-01',
  name: 'design',
  split: 'train',
  scenarios: ['sections'],
  template: 'type-text/base',
  design: {
    parts: {
      ensureStyle: (base, scope) => () => {
        base();
        if (document.getElementById('aero-fit-style')) return;
        const style = document.createElement('style');
        style.id = 'aero-fit-style';
        style.textContent = `
        .aero-stage.aero-stage .ft-card{position:relative;z-index:1;border:0;border-radius:0;box-shadow:none;background:transparent;color:#19365f}
        .aero-stage.aero-stage .ft-card:after{content:"";position:absolute;z-index:-1;left:14px;right:14px;top:56px;bottom:0;border:1px solid #8dcfff;border-radius:10px;background:linear-gradient(130deg,#fff 0%,#fff 80%,#fbfdff 100%);box-shadow:0 1px 3px #5b9ac222}
        .aero-stage.aero-stage .ft-tabs{position:relative;z-index:2;width:56%;height:56px;margin:0 0 0 40px;padding:0;gap:2px;border:0;align-items:stretch}
        .aero-stage.aero-stage .ft-tab{flex:1;padding:9px 12px;margin:0;border:1px solid #9ab5d4;border-bottom:0;border-radius:13px 13px 0 0;background:linear-gradient(#edf8ff,#cfe3f2);color:#092e66;font-size:23px;font-weight:400;box-shadow:inset 0 1px 2px #fff}
        .aero-stage.aero-stage .ft-tab[aria-selected="true"]{position:relative;background:linear-gradient(#fff,#fafdff);border:2px solid #66c5ff;border-bottom:0;color:#003398;font-weight:700;box-shadow:inset 0 2px 4px #d7f1ff}
        .aero-stage.aero-stage .ft-panes{position:relative;z-index:2}
        .aero-stage.aero-stage .ft-grid{display:grid;grid-template-columns:275px minmax(0,515px);gap:var(--aero-gap) 0;align-items:center}
        .aero-stage.aero-stage .ft-field{display:contents}
        .aero-stage.aero-stage .ft-label{align-self:center;padding:0 18px 0 0;font-size:23px;font-weight:700;color:#19365f;line-height:1.2}
        .aero-stage.aero-stage .ft-inwrap{width:min(100%,515px)}
        .aero-stage.aero-stage .ft-input{height:var(--aero-input-h);padding:0 14px;border:1px solid #a9bfd9;border-radius:8px;background:#fff;color:#10182c;font:400 23px Arial,sans-serif;box-shadow:inset 0 1px 2px #133b5a12}
        .aero-stage.aero-stage .ft-input:focus{border-color:#54b8f5;box-shadow:0 0 0 2px #6bc9ff55}
        .aero-stage.aero-stage .ft-err{grid-column:2;height:15px}
        .aero-stage.aero-stage .ft-actions{position:relative;z-index:3;margin:18px 0 0 335px}
        .aero-stage.aero-stage .ft-save{height:40px;padding:0 20px;border:1px solid #fff;border-radius:7px;background:linear-gradient(#9fe58e,#58bd48 55%,#238e2d);color:white;font-size:16px;box-shadow:0 2px 4px #24592b55,inset 0 1px 2px #efffea}
        .aero-stage.aero-stage .ft-status{color:#53769c}
        @media(max-width:1150px){.aero-stage.aero-stage .ft-tabs{width:68%;margin-left:22px}.aero-stage.aero-stage .ft-tab{font-size:17px}.aero-stage.aero-stage .ft-grid{grid-template-columns:220px minmax(0,1fr)}.aero-stage.aero-stage .ft-label{font-size:18px}.aero-stage.aero-stage .ft-input{font-size:18px}.aero-stage.aero-stage .ft-inwrap{max-width:480px}.aero-stage.aero-stage .ft-actions{margin-left:256px}}
        @media(max-height:700px){.aero-stage.aero-stage .ft-tabs{height:46px}.aero-stage.aero-stage .ft-card:after{top:46px}.aero-stage.aero-stage .ft-label{font-size:17px}}
        .aero-stage.aero-stage .ft-acc{position:relative;display:block;padding-top:56px;gap:0}
        .aero-stage.aero-stage .ft-acc-sec{position:static;border:0;border-radius:0}
        .aero-stage.aero-stage .ft-acc-h{position:absolute;top:0;width:31%;height:54px;padding:8px 12px;border:1px solid #9ab5d4;border-bottom:0;border-radius:13px 13px 0 0;background:linear-gradient(#edf8ff,#cfe3f2);color:#092e66;font:400 22px Arial,sans-serif;text-align:center;box-shadow:inset 0 1px 2px #fff}
        .aero-stage.aero-stage .ft-acc-sec:nth-child(1) .ft-acc-h{left:0}
        .aero-stage.aero-stage .ft-acc-sec:nth-child(2) .ft-acc-h{left:31.2%}
        .aero-stage.aero-stage .ft-acc-sec:nth-child(3) .ft-acc-h{left:62.4%}
        .aero-stage.aero-stage .ft-acc-sec:has(.ft-acc-b:not([hidden])) .ft-acc-h{border:2px solid #66c5ff;border-bottom:0;background:linear-gradient(#fff,#fafdff);color:#003398;font-weight:700}
        .aero-stage.aero-stage .ft-acc-h .chev,.aero-stage.aero-stage .ft-acc-h .cnt{display:none}
        .aero-stage.aero-stage .ft-acc-b{position:absolute;left:0;right:0;top:56px}
        .aero-stage.aero-stage .ft-grid.inline{grid-template-columns:275px minmax(0,515px);column-gap:0}
        .aero-stage.aero-stage .ft-grid.floating .ft-field{display:grid;grid-template-columns:275px minmax(0,515px);align-items:center;column-gap:0}
        .aero-stage.aero-stage .ft-grid.floating .ft-inwrap{grid-column:2;grid-row:1;width:min(100%,515px)}
        .aero-stage.aero-stage .ft-grid.floating .ft-label{position:static;grid-column:1;grid-row:1;transform:none;align-self:center;pointer-events:auto;font-size:23px;font-weight:700;color:#19365f}
        .aero-stage.aero-stage .ft-grid.floating .ft-input{height:var(--aero-input-h);padding-top:0}
        .aero-stage.aero-stage .ft-grid.floating{grid-template-columns:minmax(0,1fr)}
        .aero-stage.aero-stage .ft-grid.floating .ft-field{width:100%;grid-column:1;grid-template-columns:275px minmax(0,515px)}
        .aero-stage.aero-stage .ft-grid:not(.floating){grid-template-columns:minmax(0,1fr)}
        .aero-stage.aero-stage .ft-grid:not(.floating) .ft-field{display:grid;grid-template-columns:275px minmax(0,515px);align-items:center;width:100%;column-gap:0;position:relative}
        .aero-stage.aero-stage .ft-grid:not(.floating) .ft-label{grid-column:1;grid-row:1;text-align:left;justify-self:start;align-self:center}
        .aero-stage.aero-stage .ft-grid:not(.floating) .ft-inwrap{grid-column:2;grid-row:1;width:min(515px,calc(100vw - 720px))}
        .aero-stage.aero-stage .ft-grid.floating .ft-field{position:relative;grid-template-columns:minmax(0,1fr)}
        .aero-stage.aero-stage .ft-grid.floating .ft-inwrap{grid-column:1;grid-row:1;margin-left:275px;width:min(515px,calc(100vw - 720px))}
        .aero-stage.aero-stage .ft-grid.floating .ft-label{position:absolute;left:0;top:50%;width:255px;transform:translateY(-50%);text-align:left}
        .aero-stage.aero-stage .ft-grid.floating .ft-label{left:-275px}
        @media(max-width:1150px){.aero-stage.aero-stage .ft-acc{padding-top:46px}.aero-stage.aero-stage .ft-acc-h{height:44px;font-size:17px}.aero-stage.aero-stage .ft-acc-b{top:46px}.aero-stage.aero-stage .ft-grid.floating .ft-field{grid-template-columns:220px minmax(0,1fr)}.aero-stage.aero-stage .ft-grid.floating .ft-label{font-size:18px}}
        .aero-stage.aero-stage .ft-grid.inline .ft-label{text-align:left;justify-self:start}
        .aero-stage.aero-stage .ft-label{white-space:normal;overflow-wrap:normal;min-width:0}
        .aero-stage.aero-stage .ft-inwrap{width:min(515px,calc(100vw - 720px));max-width:none}
        .aero-stage.aero-stage .ft-input{width:100%}
        .aero-stage.aero-stage .ft-grid.floating .ft-inwrap{width:min(515px,calc(100vw - 720px))}
        .aero-stage.aero-stage .ft-card:before{content:"";position:absolute;z-index:0;right:4%;top:110px;width:24.5%;height:230px;border:2px solid #65c5ff;border-radius:17px;background:radial-gradient(ellipse at 30% 28%,#a4eaffaa,transparent 45%),radial-gradient(ellipse at 70% 60%,#0869bb 0 30%,#178add 62%,#82d8ff 100%);box-shadow:0 3px 5px #0063a655,inset 0 0 0 2px #ffffff77,inset 0 -12px 22px #003e8866}
        .aero-stage.aero-stage .ft-card:after{z-index:-1}
        @media(max-width:1150px){.aero-stage.aero-stage .ft-inwrap,.aero-stage.aero-stage .ft-grid.floating .ft-inwrap{width:min(480px,calc(100vw - 590px))}.aero-stage.aero-stage .ft-card:before{right:3%;width:26%;height:190px}}
        @media(max-width:1150px){.aero-stage.aero-stage .ft-grid:not(.floating) .ft-field,.aero-stage.aero-stage .ft-grid.floating .ft-field{grid-template-columns:220px minmax(0,1fr)}.aero-stage.aero-stage .ft-grid:not(.floating) .ft-inwrap{width:min(480px,calc(100vw - 740px))}.aero-stage.aero-stage .ft-grid.floating .ft-inwrap{margin-left:220px;width:min(480px,calc(100vw - 740px))}.aero-stage.aero-stage .ft-grid.floating .ft-label{left:-220px;width:200px}}
        .aero-stage.aero-stage .ft-actions,.aero-stage.aero-stage .ft-actions.right{justify-content:flex-start;flex-direction:row;margin:24px 0 0 335px}
        .aero-stage.aero-stage .ft-actions .ft-status{flex:0 0 auto;text-align:left}
        .aero-stage.aero-stage .ft-card:before{background:linear-gradient(90deg,#fff0a7,#d6a83f 22%,#ffeb9a 47%,#bf8b2d 75%,#ffe07a) 8% 31%/64px 48px no-repeat,radial-gradient(ellipse at 30% 28%,#a4eaffaa,transparent 45%),radial-gradient(ellipse at 70% 60%,#0869bb 0 30%,#178add 62%,#82d8ff 100%);box-shadow:0 3px 5px #0063a655,0 72px 22px -8px #49acd533,inset 0 0 0 2px #ffffff77,inset 0 -12px 22px #003e8866}
        .aero-stage.aero-stage .ft-card:before{background:url('${new URL('../assets/card-map.svg', scope.scriptOf.src).href}') center/100% 100% no-repeat,radial-gradient(ellipse at 70% 60%,#0869bb 0 30%,#178add 62%,#82d8ff 100%);}
        @media(max-width:1150px){.aero-stage.aero-stage .ft-card:before{height:160px}}
        @media(max-width:1150px){.aero-stage.aero-stage .ft-actions,.aero-stage.aero-stage .ft-actions.right{margin-left:256px}}
        .aero-stage.aero-stage .ft-card {
          display: flex; flex-direction: column; box-sizing: border-box;
          width: var(--aero-width); max-width: none; height: var(--aero-height);
          min-height: 0; margin: 0; padding: 0; overflow: visible;
        }
        .aero-stage.aero-stage .ft-tabs { flex: none; }
        .aero-stage.aero-stage .ft-panes, .aero-stage.aero-stage .ft-acc { flex: 1 1 0; min-height: 0; }
        .aero-stage.aero-stage .ft-panes, .aero-stage.aero-stage .ft-acc-b {
          padding: var(--aero-pad-y) var(--aero-pad-x) var(--aero-pad-y);
        }
        .aero-stage.aero-stage .ft-actions { flex: none; }
        `;
        document.head.append(style);
      },
      build: (base) => (ctx, look) => {
        const width = Math.max(0, ctx.size.width - 24);
        const height = Math.max(0, ctx.size.height - 16);
        const narrow = ctx.size.width <= 1150;
        const rows = Math.max(...ctx.spec.sections.map(section => section.ids.length));
        const compact = height < 440;
        const gap = compact ? 12 : narrow ? 15 : 25;
        const pad = compact ? 12 : narrow ? 26 : 32;
        const available = height - 56 - 64 - pad * 2 - gap * (rows - 1);
        const inputHeight = Math.max(28, Math.min(compact ? 36 : narrow ? 42 : 50, Math.floor(available / rows) - 12));
        Object.assign(look.vars, {
          '--aero-width': `${width}px`,
          '--aero-height': `${height}px`,
          '--aero-input-h': `${inputHeight}px`,
          '--aero-gap': `${gap}px`,
          '--aero-pad-y': `${pad}px`,
          '--aero-pad-x': narrow ? '36px' : '60px',
        });
        look.subtitle = '';
        const card = base(ctx, look);
        const title = Array.from(card.children).find(child => child.tagName === 'H2');
        if (title) title.hidden = true;
        card.style.width = `${width}px`;
        card.style.maxWidth = 'none';
        return card;
      },
      buildSections: (base) => (ctx, look, card) => {
        base(ctx, look, card);
        // The accordion measures before Save is added; let the flex area reserve its space.
        if (ctx.spec.panes !== 'tabs') {
          const accordion = card.querySelector('.ft-acc');
          accordion.style.minHeight = '0';
        }
      },
    },
  },
});
