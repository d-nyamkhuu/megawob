// Keep the side-by-side spinner layout inside the widget, with both arrows
// contained in the control's height so the template's targets stay clickable.
env.widget({
  task: 'set-date',
  site: 'design-set-date-duration-03',
  name: 'design',
  split: 'train',
  scenarios: ['duration'],
  template: 'set-date/base',
  design: {
    parts: {
      ensureStyle: (base) => function () {
        base();
        if (document.getElementById('cad-duration-style')) return;
        const style = document.createElement('style');
        style.id = 'cad-duration-style';
        style.textContent = `
        .ds-stage .fd-seg {
          width: 205px; height: 76px; display: grid;
          grid-template-columns: minmax(0, 1fr) 52px;
          grid-template-rows: repeat(2, minmax(0, 1fr));
          border: 1px solid #9cabb9; background: #122234;
        }
        .ds-stage .fd-seg .fd-val {
          grid-column: 1; grid-row: 1 / span 2; height: auto;
          border: 0; justify-content: start; padding-left: 14px;
          font: 29px var(--font); color: #e7f0fa;
        }
        .ds-stage .fd-seg .fd-arr {
          grid-column: 2; height: auto; min-height: 0;
          background: #3b4a5c; color: #e2eaf4;
          border-left: 1px solid #8192a2;
        }
        .ds-stage .fd-seg .fd-arr:first-child { grid-row: 1; }
        .ds-stage .fd-seg .fd-arr:last-child { grid-row: 2; }
        @media (max-width: 1300px) {
          .ds-stage .fd-seg {
            width: 120px; height: 47px;
            grid-template-columns: minmax(0, 1fr) 32px;
          }
          .ds-stage .fd-seg .fd-val { font-size: 20px; }
        }
        `;
        document.head.append(style);
      },
    },
  },
});
