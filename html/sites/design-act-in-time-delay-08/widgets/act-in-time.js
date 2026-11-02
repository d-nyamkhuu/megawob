// Adds a live readiness deadline and moves task buttons into the site's actions lane.
(function () {
  'use strict';

  env.widget({
    task: 'act-in-time',
    site: 'design-act-in-time-delay-08',
    name: 'design',
    split: 'train',
    scenarios: ['delay'],
    template: 'act-in-time/arena',
    design: {
      parts: {
        rendered:
          (base) =>
          (ctx, f) => {
            base(ctx, f);

            const layout = ctx.stage.closest('.rm-layout');
            const target = ctx.spec.buttons.find((b) => b.key === 'go');
            // Derive the displayed threshold through the task's existing readiness helper.
            let lo = 0;
            let hi = 1000000;
            if (env.taskDef.helpers.delayReady(ctx.spec, 0)) hi = 0;
            else {
              for (let i = 0; i < 32; i++) {
                const mid = (lo + hi) / 2;
                if (env.taskDef.helpers.delayReady(ctx.spec, mid)) hi = mid;
                else lo = mid;
              }
            }
            const action = target ? target.label : 'task buttons';
            const seconds = Math.ceil(Math.max(0, hi - 0.01) / 1000);
            const deadline = String(Math.floor(seconds / 60)).padStart(2, '0') + ':' + String(seconds % 60).padStart(2, '0');
            layout.style.setProperty('--rm-deadline', '" / ' + deadline + '"');
            layout.querySelector('.rm-summary p').textContent =
              `The ${action} ${target ? 'button' : 'buttons'} will be enabled when the task clock reaches ${deadline}.`;
            layout.querySelector('.rm-notes li').textContent =
              `The ${action} ${target ? 'button is' : 'buttons are'} disabled until the task clock reaches ${deadline}.`;

            const actions = layout.querySelector('.rm-task-actions');
            const row = ctx.stage.querySelector('.ut-row');
            if (row && actions) actions.appendChild(row);
          },
      },
    },
  });
})();
