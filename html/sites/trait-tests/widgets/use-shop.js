env.traitTests.derive('use-shop', [
  // Flight results get a Sort by control (traits.sort); web search over a mixed catalog (traits.corpus 'any').
  { name: 'sort-any', base: 'store', scenarios: ['flight', 'search'], traits: { corpus: 'any', sort: true } },
  // Infinite-scroll results over a product catalog.
  { name: 'infinite-products', base: 'stream', traits: { infinite: true, corpus: 'products' } },
]);
