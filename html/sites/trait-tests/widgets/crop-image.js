env.traitTests.derive('crop-image', [
  // Image geometry: aspect (the image's width / height; pan: the window's), placement (the part of the image the
  // target lies in) and startBox (the crop box of off starts; not marquee / pan, which start without one).
  { name: 'portrait-left', base: 'box', traits: { aspect: [0.6, 0.9], placement: 'left' } },
  { name: 'wide-top', base: 'corners', traits: { aspect: 2.4, placement: 'top' } },
  { name: 'full-start', base: 'cropper', traits: { startBox: 'full', placement: { x: 0.5, y: 0.45, w: 0.5, h: 0.55 } } },
  { name: 'center-start', base: 'corners', traits: { startBox: 'center', aspect: [1, 1.4], placement: 'center' } },
]);
