# Third-party material

megawob's own code and its image assets are MIT-licensed (see [`LICENSE`](LICENSE)). The material below is not
covered by that licence: each item keeps its own, and its licence text ships next to it. Nothing here is loaded over
the network; the libraries are vendored, pinned releases that run inside the browser page only.

## Vendored libraries

All 15 live in [`html/sites/base/vendor/`](html/sites/base/vendor/), one folder per library and version,
with the licence file inside. [`html/sites/base/vendor/README.md`](html/sites/base/vendor/README.md) records
the source URL of every file, which widget uses it and how the two pre-built bundles were made.

| # | Library | Version | Licence | Copyright holder | Folder |
|---|---|---|---|---|---|
| 1 | [noUiSlider](https://github.com/leongersen/noUiSlider) | 15.8.1 | MIT | Léon Gersen | `nouislider-15.8.1/` |
| 2 | [vanilla-picker](https://github.com/Sphinxxxx/vanilla-picker) | 2.12.3 | ISC | Andreas Borgen, Adam Brooks | `vanilla-picker-2.12.3/` |
| 3 | [Cropper.js](https://github.com/fengyuanchen/cropperjs) | 1.6.2 | MIT | Chen Fengyuan | `cropperjs-1.6.2/` |
| 4 | [SortableJS](https://github.com/SortableJS/Sortable) | 1.15.6 | MIT | All contributors to Sortable | `sortablejs-1.15.6/` |
| 5 | [jQuery](https://jquery.com/) | 3.7.1 | MIT | OpenJS Foundation and other contributors | `jquery-3.7.1/` |
| 6 | [jQuery UI](https://jqueryui.com/) | 1.13.3 | MIT | OpenJS Foundation and other contributors | `jquery-ui-1.13.3/` |
| 7 | [dragula](https://github.com/bevacqua/dragula) | 3.7.3 | MIT | Nicolas Bevacqua | `dragula-3.7.3/` |
| 8 | [interact.js](https://github.com/taye/interact.js) | 1.10.27 | MIT | Taye Adeyemi | `interactjs-1.10.27/` |
| 9 | [GridStack](https://github.com/gridstack/gridstack.js) | 10.3.1 | MIT | Alain Dumesny, Pavel Reznikov, Dylan Weiss | `gridstack-10.3.1/` |
| 10 | [AG Grid Community](https://github.com/ag-grid/ag-grid) | 32.0.0 | MIT | AG Grid Ltd | `ag-grid-community-32.0.0/` |
| 11 | [React](https://github.com/facebook/react) and ReactDOM | 18.3.1 | MIT | Facebook, Inc. and its affiliates | `react-18.3.1/` |
| 12 | [@hello-pangea/dnd](https://github.com/hello-pangea/dnd) | 18.0.1 | Apache-2.0 | Gabriel Santerre; Atlassian Pty Ltd | `hello-pangea-dnd-18.0.1/` |
| 13 | [dnd kit](https://github.com/clauderic/dnd-kit) (`@dnd-kit/core` 6.3.1, `sortable` 10.0.0, `utilities` 3.2.2, `accessibility` 3.1.1), bundled | 6.3.1 | MIT | Claudéric Demers | `dnd-kit-6.3.1/` |
| 14 | [rc-slider](https://github.com/react-component/slider), bundled with rc-util 5.44.4, classnames 2.5.1 and @babel/runtime 7.29.10 | 11.1.9 | MIT | Alipay.com | `rc-slider-11.1.9/` |
| 15 | [MUI Material](https://github.com/mui/material-ui) (`@mui/material`) | 5.18.0 | MIT | Call-Em-All (MUI) | `mui-material-5.18.0/` |

Notes:

- Items 13 and 14 ship no browser build upstream. `dndkit.min.js` and `rcslider.min.js` are bundles made with
  esbuild 0.24.0 from the exact npm versions listed; the recipe is in the vendor README. The licences of the
  dependencies compiled into the bundles (dnd kit, rc-slider) and into the other pre-built files (MUI, @hello-pangea/dnd,
  dragula, vanilla-picker, react-dom) are in a `NOTICE.txt` next to each; GridStack's `gridstack-all.js.LICENSE.txt` ships
  next to its bundle.
- vanilla-picker stands in for iro.js, which is MPL-2.0 and is not used.
- Only the base site loads vendored libraries (through a widget's `uses` list); the `design-*` sites use the
  kit's own primitives.

## Fonts

Bundled in the `assets/` folder of the sites that use them, each with its licence text:

| Font | Licence | Copyright | Licence file |
|---|---|---|---|
| Lato (regular, bold, black) | SIL Open Font License 1.1 | Łukasz Dziedzic (tyPoland) | `lato-license.txt` |
| Oswald | SIL Open Font License 1.1 | The Oswald Project Authors | `Oswald-OFL.txt` |

Both fonts are unmodified. Find the copies with `git ls-files | grep -E 'Oswald|lato-'`.

## Image assets

The images in `html/sites/*/assets/` (illustrations, photographs, logos, avatars, backgrounds) were generated with image models for this project. They depict imagined
applications and people. They are released under the same MIT licence as the
code. Where a site keeps the prompt that produced an asset, it sits next to it in `assets/`.

## Runtime dependencies

Python dependencies (BrowserGym, Playwright, Pillow, NumPy, OpenEnv, ...) are not redistributed; they are installed
by `pip` under their own licences. The Docker image in [`server/Dockerfile`](server/Dockerfile) installs system
fonts from Debian packages (Liberation, DejaVu, URW base35, Comic Neue, Noto Color Emoji, Unifont, WenQuanYi
Micro Hei) under their own licences. The original MiniWoB++ tasks, served only by the Docker image, are downloaded from the
upstream MiniWoB++ project at build time and keep its licence.
