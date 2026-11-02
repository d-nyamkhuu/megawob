// Design on wizard/stepper; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'complete-wizard',
  site: 'design-complete-wizard-application-02',
  name: 'design',
  split: 'train',
  scenarios: ['application'],
  template: 'complete-wizard/stepper',
  design: {
    title: 'Job Application',
    titleSize: '32px',
    cardRadius: '5px',
    labelWidth: '180px',
    look: {
      ind: 'circles', title: true, stepHead: true, flat: true,
      cols: 1, inline: true, width: 1200, h: 46, r: 5, pad: 28,
      gap: 16, foot: 'right',
    },
    parts: {
      style: (base) => () => {
        base();
        if (document.getElementById('qp-wizard-style')) return;
        const style = document.createElement('style');
        style.id = 'qp-wizard-style';
        style.textContent = `
          .wz-ind.circles {padding:16px 0 24px;border-bottom:1px solid var(--line);}
          .wz-ind.circles li {flex-direction:column;gap:8px;font-size:14px;}
          .wz-ind.circles .wz-dot {width:34px;height:34px;font-size:18px;background:#afb4ba;color:#fff;border-color:#afb4ba;}
          .wz-ind.circles li.cur .wz-dot {background:var(--accent);color:#fff;border-color:var(--accent);}
          .wz-ind.circles li.cur {color:var(--accent);}
          .wz-ind.circles .wz-sep {align-self:flex-start;margin-top:17px;}
        `;
        document.head.append(style);
      },
    },
  },
});
