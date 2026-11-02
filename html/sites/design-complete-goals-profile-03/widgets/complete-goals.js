// Design of this site on the composition/sections template (templates/complete-goals/sections.js).
const profileUses = [['type-text', 'fields'], ['choose-option', 'widgets'], ['set-date', 'calendar'], ['set-slider', 'classic'], ['pick-color', 'rgb']];
env.widget({
  task: 'complete-goals',
  site: 'design-complete-goals-profile-03',
  name: 'design',
  split: 'train',
  scenarios: ['profile'],
  template: 'complete-goals/sections',
  design: {},
  uses: profileUses,
  traits: {
    get parts() {
      const out = {};
      for (const [task, widgetName] of profileUses) {
        const widget = env.widgetOf(task, widgetName);
        if (widget) out[task] = { widget: widgetName, scenarios: widget.scenarios || null, traits: widget.traits || {} };
      }
      return out;
    },
  },
});
