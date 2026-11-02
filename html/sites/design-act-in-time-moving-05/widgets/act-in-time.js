// Site design on the shared act-in-time/arena template.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-moving-05',
  name: 'design',
  split: 'train',
  scenarios: ['moving'],
  template: 'act-in-time/arena',
  design: {
    parts: {
      metrics: (base) => (ctx, side) => {
        const state = base(ctx, side);
        const { util, spec } = ctx;
        const fam = env.taskDef;
        const brief = ctx.stage.parentElement.querySelector('.ds-brief');
        let metricTargets = null,
          metricTime = null,
          metricScore = null;
        let lastTargetTime = 0;
        for (let t = 0; t <= 120000; t += 250) {
          if (spec.items.some((item, i) => item.target && fam.helpers.itemPos(spec, i, t))) lastTargetTime = t;
        }
        if (brief) {
          const instruction = brief.querySelector('.ds-instruction');
          if (instruction) {
            const words = instruction.textContent;
            const match = new RegExp(`\\b${spec.color.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}\\b`, 'i');
            const found = words.match(match);
            if (found) {
              const parts = words.split(match);
              instruction.textContent = '';
              instruction.append(document.createTextNode(parts[0]));
              const emphasis = util.el('span', 'ds-target-word', instruction, found[0]);
              emphasis.setAttribute('aria-label', found[0]);
              instruction.append(document.createTextNode(parts.slice(1).join(found[0])));
            }
          }
          const metrics = util.el('div', 'ds-metrics', brief);
          const card = (label) => {
            const el = util.el('div', 'ds-metric', metrics);
            util.el('div', 'ds-metric-label', el, label);
            return util.el('div', 'ds-metric-value', el);
          };
          metricTargets = card('Targets to click');
          const swatch = util.el('i', 'ds-metric-swatch', metricTargets);
          swatch.style.background = spec.colors[spec.color];
          metricTargets.append(document.createTextNode(' '));
          const count = util.el('span', '', metricTargets);
          metricTargets = count;
          metricTime = card('Time remaining');
          metricScore = card('Score');
        }

        return { ...state, metricTargets, metricTime, metricScore, lastTargetTime };
      },
      metricsSync: (base) => (ctx, f, metrics, m) => {
        base(ctx, f, metrics, m);
        const { spec } = ctx;
        const { metricTargets, metricTime, metricScore, lastTargetTime } = metrics;
        const got = m.hits.filter((i) => spec.items[i].target).length;
        if (metricTargets) metricTargets.textContent = String(Math.max(0, spec.nTargets - got));
        if (metricTime) {
          const left = Math.max(0, Math.ceil((lastTargetTime - m.t) / 1000));
          metricTime.textContent = `${String(Math.floor(left / 60)).padStart(2, '0')}:${String(left % 60).padStart(2, '0')}`;
        }
        if (metricScore) metricScore.textContent = String(got);
      },
    },
  },
});
