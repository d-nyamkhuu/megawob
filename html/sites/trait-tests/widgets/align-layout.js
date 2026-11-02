// cell + noOverlap: the canvas widget re-registered with a 10 px grid and no-overlap planning (the traits GridStack
// declares), so the task's grid snapping and overlap-free plans are tested on a widget that does not push widgets.
env.traitTests.derive('align-layout', [
  { name: 'grid10', base: 'canvas', scenarios: ['align', 'spacing', 'mockup'], traits: { cell: 10, noOverlap: true } },
]);
