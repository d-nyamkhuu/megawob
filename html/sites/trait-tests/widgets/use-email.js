env.traitTests.derive('use-email', [
  // Rows and the open message show full dates ("Tue, Mar 12, 2013, 5:12 PM").
  { name: 'full-date', base: 'mail', traits: { fullDate: true } },
]);
