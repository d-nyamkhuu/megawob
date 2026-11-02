env.traitTests.derive('solve-puzzle', [
  { name: 'generate-initial', base: 'puzzle', scenarios: ['generate'], traits: { generate: { initial: true } } },
]);
