// Registered definitions of sites and widgets, read the way html/kit/README.md, "Auditing kit usage", says:
// load each site.js and widgets/*.js in a Node vm context whose `env` records what env.site(), env.widget() and
// env.trait-tests.derive() receive, and whose other globals are permissive stubs. Text search misses spreads, loops
// and defaults (a composite site registers its embedded widgets in a `for` loop). No browser, no kit.
//
//   echo '["base", "design-sort-into-bins-collect-01"]' | node megawob/widgetdefs.mjs <html root>   # JSON on stdout
//
// Output: { <site>: { dir, sites: [def], files: { "widgets/<file>.js": { widgets: [def], error } }, error } } where def
// is { task, site, name, split, scenarios, template, designSkin, line, names, unresolved }: the fields the
// structure rules (megawob/manifests.py, megawob/lint.py) compare. A widget with a template and no name (the
// base site's: the template registers every sub-widget it holds) is resolved by running the template's make():
// `names` lists the sub-widgets it returns, `unresolved` says why when that fails. Used by megawob.manifests.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { pathToFileURL } from 'node:url';

const root = path.resolve(process.argv[2]);
const wanted = JSON.parse(fs.readFileSync(0, 'utf8'));

// Anything: every property is itself, calling or constructing it returns itself.
const anything = new Proxy(function () {}, {
  get: (t, k) => (k === Symbol.toPrimitive ? () => 0 : k === 'then' || k === Symbol.iterator ? undefined
    : k === 'length' ? 0 : anything),
  apply: () => anything,
  construct: () => anything,
  set: () => true,
});
// An object that keeps what it was given and answers `anything` for the rest.
const permissive = (obj) => new Proxy(obj, {
  get: (t, k) => (k in t ? t[k] : k === Symbol.toPrimitive ? () => 0 : k === 'then' ? undefined : anything),
  set: (t, k, v) => { t[k] = v; return true; },
});

const location = { search: '', hash: '', href: pathToFileURL(root).href + '/play.html', origin: 'file://', pathname: '/play.html' };
const sandbox = { console: { log() {}, warn() {}, error() {} }, URL, URLSearchParams, location };
const context = vm.createContext(sandbox);
const templates = {};
const templateUses = {};
const templateLibs = {};

// Same layering as env.templateDesign in kit/env.js, enough to let a template's make() run.
function templateDesign(name, design, def, { tokens, scenarios = {}, base, state }) {
  const D = { ...tokens };
  const P = { ...base };
  const only = (def.scenarios || []).length === 1 ? def.scenarios[0] : null;
  for (const layer of [(only && scenarios[only]) || {}, design || {}]) {
    const { parts = {}, ...set } = layer;
    Object.assign(D, set);
    for (const [k, wrap] of Object.entries(parts)) if (k in base) P[k] = wrap(P[k], state);
  }
  return { D, P };
}

function makeEnv(rec) {
  const line = (file) => {
    const m = new RegExp(`${file.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:(\\d+)`).exec(new Error().stack || '');
    return m ? Number(m[1]) : 0;
  };
  const text = (v) => (typeof v === 'string' ? v : null);
  const info = (d, at) => ({
    task: text(d.task), site: text(d.site), name: text(d.name), split: text(d.split),
    scenarios: Array.isArray(d.scenarios) ? d.scenarios : null, template: text(d.template),
    designWidget: d.design && typeof d.design === 'object' ? text(d.design.widget) : null, line: at, _def: d,
  });
  const base = {
    site(def) { rec.sites.push(info(def, line(rec.file))); },
    widget(def) { rec.widgets.push(info(def, line(rec.file))); },
    template(name, make, opts = {}) { templates[name] = make; templateUses[name] = (opts && opts.uses) || []; },
    templateLib(name) {
      if (!Object.hasOwn(templateLibs, name)) templateLibs[name] = templates[name]();
      return templateLibs[name];
    },
    templateDesign,
    traitTests: {
      derive(task, entries) {
        for (const e of entries) {
          rec.widgets.push({ task, site: 'trait-tests', name: e.name, split: 'test', scenarios: e.scenarios || null,
            template: null, designWidget: null, line: line(rec.file), derived: true });
        }
      },
    },
  };
  return permissive(base);
}

const sharedEnv = makeEnv({ sites: [], widgets: [], file: '' }); // for template files: their registrations are not ours

function run(file, rec, env) {
  const src = fs.readFileSync(file, 'utf8');
  const window = permissive({ env, location });
  const document = permissive({ currentScript: { src: pathToFileURL(file).href } });
  for (let tries = 0; tries < 60; tries++) {
    rec.sites.length = rec.widgets.length = 0;
    let fn;
    try {
      fn = vm.compileFunction(src, ['env', 'window', 'document'], { filename: file, parsingContext: context });
    } catch (e) {
      return `${e.name}: ${e.message}`;
    }
    try {
      fn(env, window, document);
      return null;
    } catch (e) {
      const m = /^([\w$]+) is not defined$/.exec(e && e.message);
      if (m && !(m[1] in sandbox)) { sandbox[m[1]] = anything; continue; }
      return `${e && e.name}: ${e && e.message}`;
    }
  }
  return 'too many undefined globals';
}

// Load templates/<name>.js once, and the shared template files it uses (as kit/env.js _template does).
function loadTemplate(name) {
  if (!templates[name]) {
    const file = path.join(root, 'templates', `${name}.js`);
    const err = run(file, { sites: [], widgets: [], file }, sharedEnv);
    if (err) return err;
  }
  if (!templates[name]) return 'registers no env.template';
  for (const lib of templateUses[name] || []) {
    const err = loadTemplate(lib);
    if (err) return `${lib}: ${err}`;
  }
  return null;
}

// The template's make() for a widget def with a template and no name: the sub-widgets it returns.
function resolve(widget, site) {
  try {
    const err = loadTemplate(widget.template);
    if (err) return { unresolved: `template ${widget.template}: ${err}` };
    const def = widget._def;
    const { design, ...own } = def;
    const made = templates[widget.template](design || {}, def);
    const list = Array.isArray(made) ? made : [{ ...made, ...own }];
    const names = list.map((d) => ({ name: typeof d.name === 'string' ? d.name : null,
      scenarios: Array.isArray(d.scenarios) ? d.scenarios : null }));
    return { names };
  } catch (e) {
    return { unresolved: `template ${widget.template}: ${e && e.name}: ${e && e.message}` };
  }
}

const out = {};
for (const site of wanted) {
  const dir = path.join(root, 'sites', site);
  const entry = { dir: site, sites: [], files: {}, error: null };
  out[site] = entry;
  const siteJs = path.join(dir, 'site.js');
  if (fs.existsSync(siteJs)) {
    const rec = { sites: [], widgets: [], file: siteJs };
    entry.error = run(siteJs, rec, makeEnv(rec));
    entry.sites = rec.sites.map(({ _def, ...d }) => d);
  }
  const widgetsDir = path.join(dir, 'widgets');
  if (!fs.existsSync(widgetsDir)) continue;
  for (const f of fs.readdirSync(widgetsDir).filter((n) => n.endsWith('.js')).sort()) {
    const file = path.join(widgetsDir, f);
    const rec = { sites: [], widgets: [], file };
    const error = run(file, rec, makeEnv(rec));
    const widgets = rec.widgets.map((s) => {
      const { _def, ...d } = s;
      return s.template && s.name == null && _def ? { ...d, ...resolve(s, site) } : d;
    });
    entry.files[`widgets/${f}`] = { widgets, error };
  }
}
process.stdout.write(JSON.stringify(out));
