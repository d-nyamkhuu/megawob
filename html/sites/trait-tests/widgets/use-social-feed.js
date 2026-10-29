env.traitTests.derive('use-social-feed', [
  // One fully loaded home timeline: no tabs, quotes or Share goals.
  { name: 'simple-feed', base: 'feed', traits: { simpleFeed: true } },
]);
