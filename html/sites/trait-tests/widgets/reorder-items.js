env.traitTests.derive('reorder-items', [
  { name: 'staging', base: 'cards', scenarios: ['kanban'], traits: { staging: true } },
  { name: 'board-size', base: 'native', scenarios: ['kanban'], traits: { boardSize: { columns: 2, perColumn: 6 } } },
]);
