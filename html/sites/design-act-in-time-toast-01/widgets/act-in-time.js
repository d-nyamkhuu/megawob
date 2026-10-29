// Design on templates/act-in-time/base.js: the base site's act-in-time widget for this scenario, unchanged (it was
// scaffolded from it and restyled through site.css).
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-toast-01',
  name: 'design',
  split: 'train',
  scenarios: ['toast'],
  template: 'act-in-time/base',
  design: {
    parts: {
      frame: (base) => (ctx) => {
        // Keep the template's seeded draws, status and clock, but fit the Vista
        // sub-window to the stage rather than overriding its geometry in CSS.
        const f = base(ctx);
        const { width: w, height: h } = ctx.size;
        const width = Math.round(w * (w > 1400 ? .61 : w > 1200 ? .76 : .86));
        const height = Math.round(h * (h > 600 ? .78 : .90));
        const left = Math.round((w - width) * (w > 1400 ? .423 : .5));
        const top = Math.round(h * (h > 600 ? .16 : .04));
        f.vista = { width, height: height - 32, left, top: top + 32 };
        Object.assign(f.arena.style, { left: '0px', top: '0px', width: w + 'px', height: h + 'px', border: '0', background: 'transparent', boxShadow: 'none', overflow: 'hidden' });
        Object.assign(f.body.style, { position: 'absolute', inset: '0', padding: '0', display: 'block' });
        const bar = f.arena.querySelector('.ut-bar');
        Object.assign(bar.style, { position: 'absolute', left: left + 'px', top: top + 'px', width: width + 'px', height: '34px', padding: '0 10px', borderRadius: '10px 10px 0 0', background: 'linear-gradient(#b8d9ee,#78a9d0)', border: '2px solid #416d91' });
        return f;
      },
      buildToast: (base) => (ctx, f) => {
        const task = base(ctx, f);
        const card = f.body.querySelector('.ut-verify');
        Object.assign(card.parentElement.style, { position: 'absolute', inset: '0', display: 'block' });
        const vl = card.querySelector('.ut-vl');
        const pad = card.querySelector('.ut-pad3');
        const boxes = card.querySelector('.ut-boxes');
        const [heading, via, send, , message, verify] = vl.children;
        const { width: w, height: h, left, top } = f.vista;
        const nav = Math.round(w * .24);
        const inset = w > 900 ? 28 : 20;
        const content = w - nav - 2 * inset - 4;
        const gap = 22;
        const codeW = Math.round((content - gap) * .63);
        const rightX = codeW + gap;
        const rightW = content - rightX;
        const boxTop = 90;
        const boxH = h > 420 ? 106 : 76;
        const padTop = boxTop + boxH + 16;
        const row = Math.max(18, Math.floor((h - padTop - 22 - 18) / 4));
        Object.assign(card.style, { left: left + 'px', top: top + 'px', width: w + 'px', height: h + 'px', padding: '0', display: 'block', overflow: 'hidden' });
        const sidebar = ctx.util.el('div', 'vista-account-nav', card);
        sidebar.textContent = 'Account\nSign-in & security\nPersonal info\nEmail & accounts\nPrivacy\nDevices\nSync settings';
        Object.assign(sidebar.style, { position: 'absolute', inset: '0 auto 0 0', width: nav + 'px', padding: '18px', whiteSpace: 'pre-line', lineHeight: h > 420 ? '2.65' : '2.3', fontSize: h > 420 ? '16px' : '13px', borderRight: '1px solid #c1ccd7', background: 'linear-gradient(90deg,#e8eff5,#f7f9fb)' });
        Object.assign(vl.style, { position: 'absolute', left: (nav + inset) + 'px', right: inset + 'px', top: '0', bottom: '0', width: 'auto', display: 'block' });
        heading.classList.add('vista-verify-heading');
        via.classList.add('vista-verify-destination');
        message.classList.add('vista-verify-status');
        Object.assign(heading.style, { margin: '20px 0 12px', fontSize: h > 420 ? '29px' : '23px' });
        Object.assign(via.style, { margin: '0', fontSize: h > 420 ? '16px' : '13px', lineHeight: '1.35' });
        Object.assign(boxes.style, { position: 'absolute', left: '0', top: boxTop + 'px', width: codeW + 'px', height: boxH + 'px', padding: '15px 20px', gap: '10px', alignItems: 'center' });
        for (const cell of boxes.children) {
          cell.classList.add('vista-code-cell');
          Object.assign(cell.style, { maxWidth: 'none', height: Math.min(56, boxH - 30) + 'px', borderRadius: '0', background: '#fff', font: '24px "Segoe UI",sans-serif' });
        }
        Object.assign(pad.style, { position: 'absolute', left: (nav + inset) + 'px', top: padTop + 'px', width: codeW + 'px', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gridAutoRows: row + 'px', gap: '6px 9px' });
        Object.assign(pad.children[9].style, { gridColumn: '3', gridRow: '4' });
        Object.assign(pad.children[10].style, { gridColumn: '2', gridRow: '4' });
        for (const button of pad.querySelectorAll('.ut-btn')) Object.assign(button.style, { height: 'auto', fontSize: h > 420 ? '26px' : '23px' });
        const buttonH = Math.min(48, row + 5);
        for (const button of [send, verify]) Object.assign(button.style, { position: 'absolute', left: rightX + 'px', width: rightW + 'px', height: buttonH + 'px', padding: '0 8px' });
        send.classList.add('vista-send-code');
        send.style.top = (boxTop + boxH - buttonH) + 'px';
        verify.style.top = (padTop + row + 6) + 'px';
        Object.assign(message.style, { position: 'absolute', left: rightX + 'px', top: (padTop + 2 * row + 20) + 'px', width: rightW + 'px', margin: '0', fontSize: '13px' });
        return task;
      },
    },
  },
});
