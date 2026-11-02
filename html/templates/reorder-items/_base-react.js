/* reorder-items/_base-react: reference renderer scope with its original design unit hooks.
 * Registered by reorder-items/base in the original scope order. */
(function () {
  'use strict';
  env.template('reorder-items/_base-react', () => ({
    register(env, scriptOf, __parts, __has, setScope) {
      'use strict';
      const __scope = {
        get env() { return env; },
        get scriptOf() { return scriptOf; },
        get missing() { return missing; },
        get REACT() { return REACT; },
      };
      for (const k of Object.keys(__parts)) if (k.startsWith('+4.')) {
        let v; let built = false;
        Object.defineProperty(__scope, k.slice(3), {
          get: () => (built ? v : (built = true, v = __parts[k](undefined, __scope))),
          set: (x) => { built = true; v = x; },
        });
      }
      setScope(__scope);
      const missing = __has('missing') ? __parts['missing'](undefined, __scope) : { missing: (name) => () => { throw new Error(`reorder-items/${name}: widgets/reorder-react.js did not load`); } }.missing;
      const REACT = __has('REACT') ? __parts['REACT'](undefined, __scope) : ([['../vendor/react-18.3.1/react.production.min', 'vendor'], ['../vendor/react-18.3.1/react-dom.production.min', 'vendor']]);

      env.widget({
        task: 'reorder-items', site: 'base', name: 'pangea', split: 'train',
        // No grid: @hello-pangea/dnd lists are one-dimensional.
        scenarios: ['list', 'kanban', 'move'],
        traits: { cardMeta: true, wheelPane: true },
        uses: [...REACT, ['../vendor/hello-pangea-dnd-18.0.1/dnd.min', 'vendor'], ['reorder-react']],
        render: missing('pangea'),
        locate: missing('pangea'),
      });

      env.widget({
        task: 'reorder-items', site: 'base', name: 'dndkit', split: 'train',
        scenarios: ['list', 'grid', 'kanban', 'move'],
        traits: { cardMeta: true, wheelPane: true },
        uses: [...REACT, ['../vendor/dnd-kit-6.3.1/dndkit.min', 'vendor'], ['reorder-react']],
        render: missing('dndkit'),
        locate: missing('dndkit'),
      });
    
    },
  }));
})();
