/* sort-into-bins/_assets: shape and file artwork shared by the board templates. Factories keep each scope's tables independent. */
(function () {
  'use strict';
  env.template('sort-into-bins/_assets', () => ({
    shapes: (overrides = {}) => ({
      circle: '<circle cx="50" cy="50" r="44"/>',
      square: '<rect x="8" y="8" width="84" height="84" rx="7"/>',
      triangle: '<polygon points="50,5 95,90 5,90" stroke-linejoin="round"/>',
      diamond: '<polygon points="50,3 97,50 50,97 3,50" stroke-linejoin="round"/>',
      hexagon: '<polygon points="27,7 73,7 96,50 73,93 27,93 4,50" stroke-linejoin="round"/>',
      star: (() => {
        const pts = [];
        for (let i = 0; i < 10; i++) {
          const r = i % 2 ? 21 : 48;
          const a = -Math.PI / 2 + (i * Math.PI) / 5;
          pts.push(`${(50 + r * Math.cos(a)).toFixed(1)},${(53 + r * Math.sin(a)).toFixed(1)}`);
        }
        return `<polygon points="${pts.join(' ')}" stroke-linejoin="round"/>`;
      })(),
      ...overrides,
    }),
    folderSvg: (c) => `<svg viewBox="0 0 64 50"><path d="M3 8a4 4 0 0 1 4-4h16l6 6h28a4 4 0 0 1 4 4v30a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z" fill="${c}"/><path d="M3 16h58v28a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z" fill="${c}" opacity=".75"/></svg>`,
    trashSvg: '<svg viewBox="0 0 64 64"><path d="M14 18h36l-3 40a4 4 0 0 1-4 4H21a4 4 0 0 1-4-4z" fill="#8d99a6"/><rect x="10" y="10" width="44" height="7" rx="2" fill="#6b7785"/><rect x="25" y="4" width="14" height="6" rx="2" fill="#6b7785"/><path d="M25 26v28M32 26v28M39 26v28" stroke="#5a6572" stroke-width="3"/></svg>',
    colors: () => ({ image: '#2f9e44', document: '#1c7ed6', spreadsheet: '#2b8a3e', presentation: '#e8590c', audio: '#ae3ec9',
      video: '#c2255c', archive: '#795548', text: '#495057', data: '#0c8599', design: '#7048e8', web: '#f08c00' }),
    fileSvg: (KIND_COLOR) => (kind, ext) => `<svg viewBox="0 0 48 60"><path d="M4 4a3 3 0 0 1 3-3h24l13 13v42a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z" fill="#fff" stroke="#adb5bd"/>` +
      `<path d="M31 1v10a3 3 0 0 0 3 3h10" fill="#e9ecef" stroke="#adb5bd"/><rect x="2" y="34" width="36" height="16" rx="3" fill="${KIND_COLOR[kind] || '#495057'}"/>` +
      `<text x="20" y="46" font-size="10" font-family="sans-serif" font-weight="700" fill="#fff" text-anchor="middle">${ext.toUpperCase().slice(0, 4)}</text></svg>`,
  }));
})();
