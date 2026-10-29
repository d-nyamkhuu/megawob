// Design on the shared pan-map/city template.
env.widget({
  task: 'pan-map',
  site: 'design-pan-map-zoomto-02',
  name: 'design',
  split: 'train',
  scenarios: ['zoomto'],
  traits: { zoom: 'both' },
  template: 'pan-map/city',
  design: {
    parts: {
      editorWorld(base, S) { return function (ctx, port, W, H) {
        const out = base(ctx, port, W, H);
        const NS = 'http://www.w3.org/2000/svg';
        const s = ctx.spec, cx = s.world.W / 2, cy = s.world.H / 2;
        const art = document.createElementNS(NS, 'image');
        const cartography = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><defs><pattern id="blocks" width="62" height="48" patternUnits="userSpaceOnUse"><path d="M62 0H0V48" fill="none" stroke="#fffaf0" stroke-width="3"/><path d="M16 0V48M0 13H62" fill="none" stroke="#d8d0bd" stroke-width="1"/></pattern></defs><g opacity=".82"><path d="M0 0H1200V800H0Z" fill="#e9e2d1"/><path d="M0 0H1200V800H0Z" fill="url(#blocks)"/><path d="M-20 80 C110 120 100 235 245 270 S365 335 430 405 S590 462 680 520 S870 570 930 640 S1090 700 1220 735 L1220 800 L-20 800Z" fill="#83bdd9" stroke="#f3ebdd" stroke-width="12"/><path d="M-10 620 C90 570 170 565 255 595 C320 620 342 690 390 720 L-10 810Z" fill="#83bdd9" stroke="#f3ebdd" stroke-width="10"/><path d="M820 0 Q780 80 835 150 T900 260 Q930 320 1010 345 L1200 365 L1200 0Z" fill="#b9cc92" stroke="#d6dfb5" stroke-width="8"/><path d="M510 515 Q590 455 670 500 T795 585 Q760 655 690 665 T540 625Z" fill="#b9cc92" stroke="#d6dfb5" stroke-width="8"/><path d="M30 410 Q120 360 210 390 T385 455 M340 0 Q315 90 355 165 T400 285 M580 0 Q550 95 595 175 T630 320 M1030 400 Q990 475 1035 545 T1090 680 M70 540 Q180 490 270 520 T425 595" fill="none" stroke="#fffaf0" stroke-width="7"/><path d="M0 170 Q150 145 290 185 T560 205 T830 190 T1200 230 M0 310 Q145 285 280 330 T565 345 T850 325 T1200 370 M0 455 Q130 425 280 470 T570 485 T860 470 T1200 510 M0 575 Q130 555 285 600 T575 615 T860 595 T1200 650 M100 0 Q75 130 110 260 T115 530 T150 800 M240 0 Q205 135 245 270 T250 540 T290 800 M465 0 Q430 140 470 275 T480 540 T520 800 M710 0 Q680 130 720 265 T730 545 T770 800 M940 0 Q910 145 950 280 T965 540 T1000 800 M1110 0 Q1080 130 1125 270 T1130 560 T1170 800" fill="none" stroke="#fffaf0" stroke-width="4"/><path d="M0 395 C155 385 245 405 360 415 S565 400 650 380 S800 360 920 385 S1080 415 1200 400 M450 800 C480 680 520 560 555 450 S610 260 640 0" fill="none" stroke="#f7cd75" stroke-width="16"/><path d="M0 395 C155 385 245 405 360 415 S565 400 650 380 S800 360 920 385 S1080 415 1200 400 M450 800 C480 680 520 560 555 450 S610 260 640 0" fill="none" stroke="#fff7df" stroke-width="3"/><g fill="#51485a" font-family="Georgia,serif" font-size="24" text-anchor="middle" opacity=".84"><text x="230" y="260">Westbrook District</text><text x="570" y="290">Downtown District</text><text x="930" y="255">Northside District</text><text x="1030" y="540">Eastwood District</text></g><g fill="#315d7d" font-family="Georgia,serif" font-size="21" font-style="italic" letter-spacing="3"><text x="55" y="120">Riverton Bay</text><text x="790" y="720">Riverton River</text></g></g></svg>`;
        art.setAttribute('href', `data:image/svg+xml,${encodeURIComponent(cartography)}`);
        art.setAttribute('x', cx - 1050); art.setAttribute('y', cy - 700);
        art.setAttribute('width', 3000); art.setAttribute('height', 2000);
        art.setAttribute('preserveAspectRatio', 'none');
        out.world.insertBefore(art, out.world.firstChild);
        return out;
      }; },
      editorPin(base, S) { return function (ctx, labels, p, i) {
        const pin = base(ctx, labels, p, i);
        const dot = pin.querySelector('.mp-dot');
        const kind = `${p.kind || p.type || ''} ${p.name || ''}`.toLowerCase();
        const glyph = /park|garden/.test(kind) ? '♣' : /school|college/.test(kind) ? '◆' : /hospital|medical/.test(kind) ? '✚' : /marina|harbor/.test(kind) ? '⚓' : /market|shop|store/.test(kind) ? '▣' : /station|transit/.test(kind) ? '▤' : /library|book/.test(kind) ? '▤' : /community|center/.test(kind) ? '♟' : /theatre|comedy|arts/.test(kind) ? '⚑' : /golf|sports|stadium/.test(kind) ? '◉' : /lodge|hotel|inn/.test(kind) ? '⌂' : '⌂';
        dot.textContent = glyph;
        pin.classList.add('atlas-place');
        return pin;
      }; },
    },
  },
});
