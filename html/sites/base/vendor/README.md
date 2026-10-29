# Vendored third-party code (base site)

Pinned releases, loaded only inside the browser page. One line per library: name, version, source URL, license.

- noUiSlider 15.8.1, https://cdn.jsdelivr.net/npm/nouislider@15.8.1/dist/ (nouislider.js, nouislider.css), MIT (LICENSE.md). Used by skins/slider.js `nouislider` (the skin's CSS repeats the structural rules; nouislider.css is not loaded).
- vanilla-picker 2.12.3, https://cdn.jsdelivr.net/npm/vanilla-picker@2.12.3/dist/vanilla-picker.js, ISC (LICENSE.md; NOTICE.txt covers the bundled @sphinxxxx/color-conversion). Used by skins/color.js `vanilla`. (Stands in for iro.js, which is MPL-2.0.)
- Cropper.js 1.6.2, https://cdn.jsdelivr.net/npm/cropperjs@1.6.2/dist/ (cropper.min.js, cropper.min.css; LICENSE from the package root), MIT (LICENSE). Used by skins/crop.js `cropper`.
- SortableJS 1.15.6, https://cdn.jsdelivr.net/npm/sortablejs@1.15.6/Sortable.min.js, MIT (LICENSE, from the package root). Used by skins/reorder.js `sortablejs` (native-DnD mode, animation 0).
- jQuery 3.7.1, https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js, MIT (LICENSE.txt). Used by skins/reorder.js `jqueryui` (jQuery UI needs it).
- jQuery UI 1.13.3, https://cdn.jsdelivr.net/npm/jquery-ui@1.13.3/dist/jquery-ui.min.js (the full bundle), MIT (LICENSE.txt). Used by skins/reorder.js `jqueryui` (sortable widget; the skin's CSS styles the helper and placeholder, no jQuery UI theme CSS is loaded).
- dragula 3.7.3, https://cdn.jsdelivr.net/npm/dragula@3.7.3/dist/ (dragula.min.js, dragula.min.css), MIT (LICENSE; NOTICE.txt has the licences of the browserify-bundled contra, atoa, ticky, crossvent, custom-event, process and timers shims). Used by skins/reorder.js `dragula` and skins/bins.js `dragula`.
- interact.js 1.10.27, https://cdn.jsdelivr.net/npm/interactjs@1.10.27/dist/interact.min.js, MIT (LICENSE). Used by skins/bins.js `interact` (draggable + dropzone) and skins/resize.js `interact` (resizable).
- GridStack 10.3.1, https://cdn.jsdelivr.net/npm/gridstack@10.3.1/dist/ (gridstack-all.js, the bundle with its own drag layer; gridstack.min.css), MIT (LICENSE). gridstack-all.js.LICENSE.txt is the file the bundle's first line refers to, from the same npm package. Used by skins/layout.js `gridstack`.

Loading: the kit loads vendor scripts for a skin through its `uses` list (a path relative to `skins/`, e.g. `uses: [['../vendor/nouislider-15.8.1/nouislider']]`), which it awaits before `render`; a site's `scripts: ['vendor/...']` does the same site-wide.

- AG Grid Community 32.0.0, https://cdn.jsdelivr.net/npm/ag-grid-community@32.0.0/ (dist/ag-grid-community.min.js UMD, styles/ag-grid.css, styles/ag-theme-quartz.css), MIT (LICENSE.txt). Used by table-ops `aggrid`; animations and deferred row rendering disabled, rowBuffer 0. Header value filters are local Community-compatible DOM controls.

React skins (reorder `pangea`, `dndkit`; slider `rcslider`, `mui`). React and ReactDOM share one folder and load first through each skin's `uses`; the libraries read `window.React` / `window.ReactDOM`.

- React 18.3.1 and ReactDOM 18.3.1, https://registry.npmjs.org/react/-/react-18.3.1.tgz (umd/react.production.min.js) and https://registry.npmjs.org/react-dom/-/react-dom-18.3.1.tgz (umd/react-dom.production.min.js), MIT (LICENSE; NOTICE.txt covers the scheduler and Modernizr code inside react-dom). Folder react-18.3.1. Used by skins/reorder-react.js and skins/slider-react.js.
- @hello-pangea/dnd 18.0.1, https://registry.npmjs.org/@hello-pangea/dnd/-/dnd-18.0.1.tgz (dist/dnd.min.js, UMD, global `ReactBeautifulDnd`), Apache-2.0 (LICENSE; NOTICE.txt has the licences of the dependencies compiled into the UMD file: redux, react-redux, use-sync-external-store, css-box-model, tiny-invariant, raf-schd and @babel/runtime). Used by skins/reorder.js `pangea` (skins/reorder-react.js).
- dnd kit: @dnd-kit/core 6.3.1, @dnd-kit/sortable 10.0.0, @dnd-kit/utilities 3.2.2 (with @dnd-kit/accessibility 3.1.1), from https://registry.npmjs.org/@dnd-kit/<pkg>/-/<pkg>-<version>.tgz, MIT (LICENSE, shared by all four packages; NOTICE.txt lists them). The packages ship no browser build: dndkit.min.js is a pre-built bundle (recipe below) that sets `window.DndKit = { core, sortable, utilities }`. Used by skins/reorder.js `dndkit` (skins/reorder-react.js).
- rc-slider 11.1.9, https://registry.npmjs.org/rc-slider/-/rc-slider-11.1.9.tgz, with its dependencies rc-util 5.44.4, classnames 2.5.1 and @babel/runtime 7.29.10 bundled in, MIT (LICENSE; NOTICE.txt has the dependencies' licences, and the bundle keeps classnames' legal comment at its end). No browser build ships: rcslider.min.js is a pre-built bundle (recipe below) that sets `window.RcSlider` (the Slider component). The skin's CSS repeats the structural rules of assets/index.css, which is not loaded. Used by skins/slider.js `rcslider` (skins/slider-react.js).
- MUI @mui/material 5.18.0, https://registry.npmjs.org/@mui/material/-/material-5.18.0.tgz (umd/material-ui.production.min.js, global `MaterialUI`, emotion included), MIT (LICENSE; NOTICE.txt has the licences of the packages compiled into the UMD file: @mui/system, utils, styled-engine and private-theming, @emotion/*, stylis, @popperjs/core, react-transition-group, hoist-non-react-statics, react-is, clsx and @babel/runtime). Used by skins/slider.js `mui` (Slider and Rating; skins/slider-react.js).

Bundle recipe (dndkit.min.js, rcslider.min.js), run outside the repo with esbuild 0.24.0 after `npm install` of the exact versions above:

    // shims/react.js         module.exports = window.React;
    // shims/react-dom.js     module.exports = window.ReactDOM;
    // dndkit-entry.js        import * as core from '@dnd-kit/core'; import * as sortable from '@dnd-kit/sortable';
    //                        import * as utilities from '@dnd-kit/utilities'; window.DndKit = { core, sortable, utilities };
    // rcslider-entry.js      import Slider from 'rc-slider'; window.RcSlider = Slider;
    npx esbuild@0.24.0 <entry>.js --bundle --format=iife --minify --target=es2019 \
      --define:process.env.NODE_ENV='"production"' --alias:react=./shims/react.js --alias:react-dom=./shims/react-dom.js \
      --legal-comments=eof --outfile=<name>.min.js
