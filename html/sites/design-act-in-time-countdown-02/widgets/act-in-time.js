// Keep the reference interactions; size the Carbon reservation from the free stage.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-countdown-02',
  name: 'design',
  split: 'train',
  scenarios: ['countdown'],
  template: 'act-in-time/base',
  design: {
    parts: {
      ensureStyle: (base) => () => {
        base();
        if (document.getElementById('fm-countdown-layout')) return;
        const style = document.createElement('style');
        style.id = 'fm-countdown-layout';
        style.textContent = `
          .fm-stage .fm-countdown-body .ut-hold {
            position: absolute; inset: 0; width: 100%; height: 100%;
            box-sizing: border-box; padding: var(--fm-pad) 3.4% 8px;
            display: grid;
            grid-template-rows: var(--fm-head) repeat(3, minmax(0, 1fr)) var(--fm-book) var(--fm-result);
          }
          .fm-stage .fm-countdown-body .ut-holdhead {
            display: block; position: relative; min-height: 0; padding: 0 0 0 30%;
          }
          .fm-stage .fm-countdown-body .ut-holdhead:before { height: calc(var(--fm-head) - 20px); }
          .fm-stage .fm-countdown-body .ut-holdhead h3 { font-size: var(--fm-title) !important; }
          .fm-stage .fm-countdown-body .ut-holdhead h3:after { font-size: var(--fm-subtitle) !important; }
          .fm-stage .fm-countdown-body .ut-timer { font-size: var(--fm-timer) !important; }
          .fm-stage .fm-countdown-body .ut-timer:before { font-size: var(--fm-caption) !important; }
          .fm-stage .fm-countdown-body .ut-holdbar {
            position: absolute; left: 30%; top: calc(var(--fm-pad) + var(--fm-head) - 26px);
            width: 46%; height: 12px; margin: 0;
          }
          .fm-stage .fm-countdown-body .ut-grp {
            display: grid; grid-template-columns: 56px minmax(0, 1fr);
            grid-template-rows: auto auto; align-content: center; align-items: center;
            min-height: 0; margin: 0; padding: 3px 0;
          }
          .fm-stage .fm-countdown-body .ut-grp .ut-k { margin: 0 0 6px; }
          .fm-stage .fm-countdown-body .ut-grp .ut-k:before { font-size: var(--fm-label) !important; }
          .fm-stage .fm-countdown-body .ut-chips { grid-column: 2; display: flex; flex-wrap: nowrap; gap: 10px; }
          .fm-stage .fm-countdown-body .ut-chip {
            flex: 0 1 var(--fm-option-width); min-width: 0; height: var(--fm-chip);
            padding: 0 var(--fm-chip-pad); font-size: var(--fm-option) !important;
          }
          .fm-stage .fm-countdown-body .ut-btn.primary {
            position: static; align-self: center; justify-self: center;
            width: 40%; height: var(--fm-book); font-size: var(--fm-action) !important;
          }
          .fm-stage .fm-countdown-body .ut-done { grid-row: 6; margin: 0; padding: 2px 6px; font-size: 12px; }
        `;
        document.head.append(style);
      },
      buildCountdown: (base) => (ctx, frame) => {
        frame.body.classList.add('fm-countdown-body');
        frame.body.style.setProperty('--fm-option-width', ctx.size.width * .135 + 'px');
        const scale = Math.max(.6, Math.min(1, (ctx.size.height - 260) / 380));
        const sizes = {pad:26, head:190, book:54, result:36, title:33, subtitle:22,
          timer:38, caption:18, label:23, chip:49, 'chip-pad':18, option:18, action:21};
        for (const [key, value] of Object.entries(sizes)) {
          frame.body.style.setProperty('--fm-' + key, value * scale + 'px');
        }
        const view = base(ctx, frame);
        // The base still consumes its placement draws; this design fills the frame.
        const card = frame.body.querySelector('.ut-hold');
        card.style.left = '0px';
        card.style.top = '0px';
        return view;
      },
    },
  },
});
