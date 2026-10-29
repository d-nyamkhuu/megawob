// Design on templates/type-text/base.js: the base site's type-text widget for this scenario, unchanged (it was
// scaffolded from it and restyled through site.css).
env.widget({
  task: 'type-text',
  site: 'design-type-text-copy-01',
  name: 'design',
  split: 'train',
  scenarios: ['copy'],
  template: 'type-text/base',
  design: {
    parts: {
      ensureStyle: (base, S) => function () {
        base();
        if (document.getElementById('ds-payment-style')) return;
        const style = document.createElement('style');
        style.id = 'ds-payment-style';
        style.textContent = ".ds-stage .ft-card{box-shadow:none;border-radius:0}.ds-stage .ft-card{position:absolute;right:0;top:35%;bottom:0;height:65%;z-index:3;width:58%;max-width:none;margin:0;padding:calc(12px * var(--ds-scale));display:flex;flex-direction:column;background:linear-gradient(#c9c9c9,#bcbcbc);border:4px ridge #eee;--ft-w:100%;--ft-h:max(26px, calc(37px * var(--ds-scale)));--ft-gap:14px;--ft-r:0;--ft-fs:17px}.ds-stage .ft-card h2{position:relative;display:block;font-size:0;flex:none;margin:-2px -2px calc(62px * var(--ds-scale));padding:calc(7px * var(--ds-scale)) 8px;background:#00b7c1;border:2px outset #ddd}.ds-stage .ft-card h2:before{content:'New Payment';font-size:max(15px, calc(20px * var(--ds-scale)))}.ds-stage .ft-card h2:after{content:'Additional Information';position:absolute;left:128px;top:calc(47px * var(--ds-scale));margin:0;padding:calc(6px * var(--ds-scale)) 12px;background:linear-gradient(#ddd,#bbb);border:2px outset #eee;font-size:max(13px, calc(16px * var(--ds-scale)));font-weight:400;color:#111}.ds-stage .ft-grid{position:relative;grid-template-columns:1fr 1fr;column-gap:14px;row-gap:calc(13px * var(--ds-scale));align-items:end;border:2px groove #eee;flex:none;padding:calc(20px * var(--ds-scale)) 18px 0;margin:0 -3px}.ds-stage .ft-grid:before{content:'Payment';position:absolute;left:10px;top:calc(-56px * var(--ds-scale));padding:calc(7px * var(--ds-scale)) 20px;background:linear-gradient(#eee,#c5c5c5);border:2px outset #eee;font-size:max(13px, calc(16px * var(--ds-scale)));font-weight:bold;color:#111}.ds-stage .ft-field:nth-child(1){grid-column:1;grid-row:1}.ds-stage .ft-field:nth-child(2){grid-column:1;grid-row:2}.ds-stage .ft-field:nth-child(3){grid-column:2;grid-row:1}.ds-stage .ft-grid.floating .ft-inwrap{display:flex;flex-direction:column-reverse;gap:4px}.ds-stage .ft-grid.floating .ft-label{position:static;transform:none;display:block;font-size:max(13px, calc(16px * var(--ds-scale)));color:#111;pointer-events:auto}.ds-stage .ft-label{font-size:max(13px, calc(16px * var(--ds-scale)));font-weight:400;margin-bottom:calc(4px * var(--ds-scale))}.ds-stage .ft-input{height:max(26px, calc(37px * var(--ds-scale)));background:#fff;color:#111;border:2px inset #eee;border-radius:0;font-size:max(14px, calc(17px * var(--ds-scale)));padding:4px 8px}.ds-stage .ft-actions{margin-top:10px}.ds-stage .ft-save{font-size:15px;background:#c8c8c8;color:#111;border:2px outset #eee;border-radius:0}.ds-stage .ft-grid .ft-wide{grid-column:1/-1}\n.ds-stage .ft-field{gap:calc(6px * var(--ds-scale));}\n\n.ds-payment-extra{flex:1;min-height:0;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:auto minmax(0,1fr);gap:calc(9px * var(--ds-scale)) 20px;padding:calc(12px * var(--ds-scale)) 18px 0;font-size:max(12px, calc(16px * var(--ds-scale)));}\n.ds-payment-meta{display:flex;flex-direction:column;gap:calc(5px * var(--ds-scale));min-height:0;}\n.ds-payment-box{background:white;border:2px inset #eee;padding:calc(5px * var(--ds-scale)) 7px;min-height:0;}\n.ds-payment-notes{grid-column:1/-1;display:flex;flex-direction:column;gap:calc(5px * var(--ds-scale));min-height:0;}\n.ds-payment-notes .ds-payment-box{flex:1;}\n";
        document.head.append(style);
      },
      build: (base, S) => function (ctx, look) {
        const card = base(ctx, { ...look, layout: 'stacked', subtitle: '' });
        card.style.setProperty('--ds-scale', Math.min(1, Math.max(0.5, (ctx.size.height * 0.65 - 30) / 400)));
        const extra = ctx.util.el('div', 'ds-payment-extra', card);
        for (const [label, value] of [['Payment Date:', '03/24/1994'], ['Method:', 'Check']]) {
          const meta = ctx.util.el('div', 'ds-payment-meta', extra);
          ctx.util.el('span', '', meta, label);
          ctx.util.el('div', 'ds-payment-box', meta, value);
        }
        const notes = ctx.util.el('div', 'ds-payment-notes', extra);
        ctx.util.el('span', '', notes, 'Notes:');
        ctx.util.el('div', 'ds-payment-box', notes);
        return card;
      },
    },
  },
});
