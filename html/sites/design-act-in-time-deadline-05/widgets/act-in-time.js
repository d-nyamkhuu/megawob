// Keep the reference task and sampling; present its frame inside the recipe sheet.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-deadline-05',
  name: 'design',
  split: 'train',
  scenarios: ['deadline'],
  template: 'act-in-time/base',
  design: {
    parts: {
      frame: (base) => (ctx) => {
        // Retain the template's complete sampling sequence and frame anchors.
        const frame = base(ctx);
        const copy = document.querySelector('.sm-recipe-copy');
        copy.appendChild(ctx.stage);
        ctx.stage.classList.add('sm-task-inset');
        frame.arena.classList.add('sm-task-arena');
        return frame;
      },
      buildDeadline: (base, S) => (ctx, frame) => {
        const view = base(ctx, frame);
        const card = frame.body.querySelector('.ut-dl');
        const waiting = ctx.util.el('div', 'sm-waiting', card);
        waiting.innerHTML = '<div class="sm-waiting-title">Today’s recipe card will be available soon!</div><div class="sm-waiting-body"><svg class="sm-clock-face" viewBox="0 0 100 100" aria-hidden="true"><defs><radialGradient id="clock-paper"><stop stop-color="#fffdf4"/><stop offset="1" stop-color="#e5d9b3"/></radialGradient><linearGradient id="clock-gold" x2="1" y2="1"><stop stop-color="#ffdb75"/><stop offset=".45" stop-color="#ad621a"/><stop offset=".7" stop-color="#e9b94e"/><stop offset="1" stop-color="#6f4014"/></linearGradient></defs><circle cx="50" cy="51" r="45" fill="#826329" opacity=".25"/><circle cx="50" cy="48" r="44" fill="url(#clock-gold)" stroke="#8a4f14" stroke-width="1.5"/><circle cx="50" cy="48" r="38" fill="url(#clock-paper)" stroke="#6b4a23"/><circle cx="50" cy="48" r="35" fill="none" stroke="#d7caa6"/><g font-family="Georgia,serif" font-size="8" fill="#292119" text-anchor="middle"><text x="50" y="20">12</text><text x="80" y="51">3</text><text x="50" y="82">6</text><text x="20" y="51">9</text></g><path d="M50 24v4M73 27l-3 3M75 48h4M73 72l-3-3M50 73v4M27 72l3-3M25 48h-4M27 27l3 3" stroke="#493c2a"/><path d="M50 48 34 34M50 48 49 24" stroke="#2f2721" stroke-width="2.5" stroke-linecap="round"/><path d="M50 48 61 61" stroke="#9b2021" stroke-width="1.6"/><circle cx="50" cy="48" r="3" fill="#a42e25"/></svg><p>Check back at<br><strong>10:00 AM</strong><br><small>to save this recipe card.</small></p></div>';
        const sync = (model) => {
          view.sync(model);
          const ready = S.env.taskDef.helpers.deadlineReady(ctx.spec, model.t);
          card.classList.toggle('sm-pending', !ready);
          waiting.hidden = ready;
        };
        return { ...view, sync };
      },
    },
  },
});
