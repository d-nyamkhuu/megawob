"""Contract lint for sites and widgets: what the checker cannot see because it reads __env, not the page.

    python -m megawob.lint                         # static rules over every site (seconds), then `ruff check` of the Python
    python -m megawob.lint --no-ruff               # without ruff (it is skipped when ruff is not installed)
    python -m megawob.lint --site 'design-use-email-*' --verbose
    python -m megawob.lint --rule trainer-api --rule scorer-call
    python -m megawob.lint --runtime --site base --seeds 3   # also run the oracle in Chromium
    python -m megawob.lint --json /tmp/lint.json   # every finding, machine-readable
    python -m megawob.check --site <site> --lint   # the checker runs the static lint of its sites first

Static rules read every .js / .css file of a site (vendor/ excluded), the base stylesheets its CSS imports, and the
template files its widgets and site.js name (`template: '<task>/<name>'` linted as widgets, `'site/<name>'` as site
code; once per run, under the site name "templates"), with comments removed; rules about code also ignore the contents of strings, so a widget's header comment
or a label text cannot trip them:
  scorer-call     error  a widget calls the task's error() / tolerance() / isCorrect() / satisfied(): the page shows
                         the scorer's verdict (an "acceptable range", a live "within range" or "Completed" status)
  trainer-api     error  page code drives the trainer API (__env.reset / submit / finish / oracle / advance /
                         stepClock / dismissOverlay / score / status): a "Clear" button that resets the episode
  trainer-read    warn   other __env use (reading __env.done or state()): pages get what they need from ctx
  wall-time       error  Math.random, Date, performance.now, setTimeout, setInterval, requestAnimationFrame
  fragment-link   error  an <a href="#"> in a file that never calls preventDefault: following it changes the
                         page URL, and BrowserGym's validate() then ends the episode with reward 0 ("invalid url")
  network         error  an external URL in CSS (url(http...), @import of one) or fetch / XMLHttpRequest / WebSocket
  css-import      error  a CSS @import that is not `@import url("<path>");` at the top of the file naming an existing
                         file under templates/site/css/ (the shared base stylesheets; they are linted too), an import
                         cycle, or a chain deeper than MAX_CSS_IMPORT_DEPTH
  native-picker   error  <input type=date|time|color|...>: headless Chromium draws no popup a pixel agent can use
  native-select   warn   a native <select> (its option list is not drawn in headless screenshots)
  viewport-size   warn   a widget sizes from the window (innerWidth, clientWidth of the root): use ctx.size
  decoy-marker    error  a decoy marked as such in the DOM (data-role="decoy", a class, id or data name with a
                         decoy / collide / collision segment): a DOM/axtree agent skips decoys, or tells the decoy
                         that shares the end control's label from the real one, for free
  names-end       error  page copy that names the end control ("then press Submit"): its label varies and finish
                         mode has none
  capture-input   warn   a capture-phase keydown / keyup / wheel listener (the kit's input guard must see these
                         first; never stop their propagation)
  global-write    warn   page code assigns a window global (state that survives an in-place reset)
  html-interp     warn   innerHTML / insertAdjacentHTML built from spec, model or content values (no escaping)
  oracle-patch    error  page code replaces a task or scenario hook (`x.plan = ...`, also solve / error / tolerance,
                         or any env.scenariosOf() use): the oracle or scorer then differs per site; fix the task
  frame-observer error  frame code (site.js, site templates) creates a MutationObserver: it watches the widget and
                         rewrites, hides or mirrors its elements after the kit froze the layout; widget elements change
                         through the widget's design (tokens, parts)

Structure rules (a Node vm recorder loads site.js and widgets/*.js, megawob/widgetdefs.mjs, and the rules read what they
register; Python reads no definition by regex):
  widget-template   error  a design-* site's widget file registers a widget without `template:` (a design is `template` and
                         `design`; base, trait-tests and mock-* sites are exempt)
  site-template   error  a design-* site.js registers an env.site without `template:` (a design on a site template,
                         templates/site/<name>.js), unless the site is in html/sites/STANDALONE_SITE_JS.txt, the frozen list
                         of sites with a frame of their own; the list may shrink, growing it past STANDALONE_SITE_JS_MAX is an error
                         (warn: a listed site that is a design now: delete its line)
  site-dir        error  a widget or env.site whose `site` / `name` is not its directory (an embedded sub-widget, a template
                         design with `design: { widget }`, declares no site)
  widget-task     error  a widgets/<task>.js file registers a widget of another task
  widget-name       error  a widget without a name that is no template holding several widgets (warn when the template
                         did not run)
  widget-load       error  site.js or a widget file does not load in the recorder
  manifest-drift  error  manifest.json differs from the widget files: a widget missing from it, one it lists that no file
                         registers (or an embedded sub-widget), a split or site that disagrees
                         (`python -m megawob.manifests --fix` rewrites manifests from the widget files)

Runtime rules (--runtime: boots each widget for a few seeds at one viewport and follows the oracle):
  locate-mutation error  __env.oracle() (the widget's locate()) changed the DOM: the oracle reveals or moves
                         things an agent never sees (a hidden Restore button shown only for the oracle)
  oracle-offscreen error an oracle point lies outside the viewport (an agent cannot click there)
  oracle-hidden   warn   the element under an oracle press is invisible (opacity ~0 or visibility hidden)
  fragment-nav    error  a link with href "#..." or "" whose click is not prevented (navigates; see fragment-link)
  form-nav        error  a <form> whose submit event is not prevented (submitting reloads the page)

Source rule (kit and task files, not sites; runs with every full lint and `--rule util-copy`):
  util-copy       error  a task or kit file defines a function named like an env.util helper (kit/runtime/data.js:
                         clamp, cap, quote, pad, dist, lerp, listText, lev, clone, ...): destructure it from
                         env.util instead (`const { clamp } = env.util;`), or rename a local that behaves differently

A finding is allowed with a comment on its line or the line above: `// megawob-lint: allow <rule>[,<rule>] reason`
(`/* ... */` in CSS), or for a whole file with `megawob-lint: allow-file <rule>[,<rule>] reason`. Exit status
is 1 when any error-severity finding remains.
"""
from __future__ import annotations

import bisect
import importlib.util
import re
import subprocess
import sys
from collections import Counter, defaultdict
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import TextIO

from . import catalog, driver, manifests

SITES = catalog.HTML / "sites"
TEMPLATES = catalog.HTML / "templates"
CSS_BASES = TEMPLATES / "site" / "css"
MAX_CSS_IMPORT_DEPTH = 8
CSS_IMPORT = re.compile(r"""@import\s*(?:url\(\s*)?(?:"([^"]*)"|'([^']*)'|([^\s;)"']*))\s*\)?""")
TEMPLATE_REF = re.compile(r"""\btemplate\s*:\s*['"]([\w-]+/[\w-]+)['"]""")
ERROR, WARN = "error", "warn"
STANDALONE_SITE_JS = "STANDALONE_SITE_JS.txt"  # in html/sites/: one design-* site per line, # comments
STANDALONE_SITE_JS_MAX = 1159  # the list may shrink; a longer file is a lint error


@dataclass
class Finding:
    """One lint result: rule, severity, where and what."""
    rule: str
    severity: str
    site: str
    file: str  # relative to html/sites; "(runtime)" for runtime findings
    line: int
    snippet: str
    note: str = ""


# ---------------------------------------------------------------------------------------------- JS / CSS views

_REGEX_AFTER = set("(,=:[!&|?{};+-*%<>~^")
_REGEX_KEYWORDS = {"return", "typeof", "case", "do", "else", "in", "of", "new", "delete", "void", "throw",
                   "yield", "await", "instanceof"}


class _JsScanner:
    """One pass over JS source that blanks what the lint views must not see. Each token kind has a method that moves
    `i` past it; offsets and newlines are preserved in both views."""

    def __init__(self, src: str) -> None:
        self.src = src
        self.n = len(src)
        self.code, self.text = list(src), list(src)
        self.i = 0
        self.stack: list[int] = []  # brace depth at each open template ${, to find where the expression ends
        self.depth = 0
        self.last = ""  # last significant character outside strings and comments
        self.last_word = ""

    @staticmethod
    def blank(view: list[str], a: int, b: int) -> None:
        for k in range(a, b):
            if view[k] != "\n":
                view[k] = " "

    def run(self) -> tuple[str, str]:
        src, n = self.src, self.n
        while self.i < n:
            c = src[self.i]
            nxt = src[self.i + 1] if self.i + 1 < n else ""
            if c in " \t\r\n":
                self.i += 1
            elif c == "/" and nxt in ("/", "*"):
                self.comment(nxt)
            elif c in "'\"":
                self.string(c)
            elif c == "`":
                self.i, opened = self.template(self.i + 1)
                self.open_template(opened)
            elif c == "/" and (not self.last or self.last in _REGEX_AFTER or self.last_word in _REGEX_KEYWORDS):
                self.regex()
            elif c == "}" and self.close_brace():
                pass
            else:
                self.punct_or_word(c)
        return "".join(self.code), "".join(self.text)

    def comment(self, kind: str) -> None:
        src, i = self.src, self.i
        if kind == "/":
            j = src.find("\n", i)
            j = self.n if j < 0 else j
        else:
            j = src.find("*/", i + 2)
            j = self.n if j < 0 else j + 2
        self.blank(self.code, i, j)
        self.blank(self.text, i, j)
        self.i = j

    def string(self, quote: str) -> None:
        src, n = self.src, self.n
        j = self.i + 1
        while j < n and src[j] != quote and src[j] != "\n":
            j += 2 if src[j] == "\\" else 1
        self.blank(self.code, self.i + 1, min(j, n))
        self.i = j + 1
        self.last, self.last_word = quote, ""

    def template(self, start: int) -> tuple[int, bool]:
        """Scan template text from start (just after ` or }) to its end or to ${; returns (index, opened)."""
        src, n = self.src, self.n
        k = start
        while k < n:
            c = src[k]
            if c == "\\":
                k += 2
                continue
            if c == "`":
                self.blank(self.code, start, k)
                return k + 1, False
            if c == "$" and k + 1 < n and src[k + 1] == "{":
                self.blank(self.code, start, k)
                return k + 2, True
            k += 1
        self.blank(self.code, start, n)
        return n, False

    def open_template(self, opened: bool) -> None:
        if opened:
            self.stack.append(self.depth)
            self.depth += 1
        self.last, self.last_word = "`", ""

    def regex(self) -> None:
        src, n = self.src, self.n
        j, in_class = self.i + 1, False
        while j < n and src[j] != "\n":
            if src[j] == "\\":
                j += 2
                continue
            if src[j] == "[":
                in_class = True
            elif src[j] == "]":
                in_class = False
            elif src[j] == "/" and not in_class:
                break
            j += 1
        self.blank(self.code, self.i + 1, min(j, n))
        self.blank(self.text, self.i + 1, min(j, n))
        self.i = j + 1
        while self.i < n and src[self.i].isalpha():
            self.i += 1
        self.last, self.last_word = "/", ""

    def close_brace(self) -> bool:
        """A }: True when it ends a template ${ expression (the template text continues), else the depth only drops."""
        self.depth -= 1
        if self.stack and self.depth == self.stack[-1]:
            self.stack.pop()
            self.i, opened = self.template(self.i + 1)
            self.open_template(opened)
            return True
        self.last, self.last_word = "}", ""
        self.i += 1
        return True

    def punct_or_word(self, c: str) -> None:
        src, n = self.src, self.n
        if c == "{":
            self.depth += 1
        if c.isalnum() or c in "_$":
            j = self.i
            while j < n and (src[j].isalnum() or src[j] in "_$"):
                j += 1
            self.last_word, self.last = src[self.i:j], src[j - 1]
            self.i = j
            return
        self.last, self.last_word = c, ""
        self.i += 1


def js_views(src: str) -> tuple[str, str]:
    """(code, text): both with comments and the insides of regex literals blanked; code also blanks the insides
    of strings and template text (template ${...} expressions stay code). Offsets and newlines are preserved."""
    return _JsScanner(src).run()


def css_view(src: str) -> str:
    """`src` with CSS comments and string insides blanked (offsets and newlines kept)."""
    return re.sub(r"/\*.*?\*/", lambda m: re.sub(r"[^\n]", " ", m.group(0)), src, flags=re.S)


# ---------------------------------------------------------------------------------------------- static rules

# (rule, severity, files it applies to: 'widget' | 'frame' (js, not widget) | 'js' | 'css', view: 'code' | 'text', regex,
#  note)
_TRAINER_CALLS = r"reset|submit|finish|oracle|advance|stepClock|tick|bootInfo|dismissOverlay|score|status|reanchor"
RULES = [
    ("trainer-api", ERROR, "js", "code", rf"\b__env\s*\.\s*(?:{_TRAINER_CALLS})\s*\(|\benv\s*\.\s*reset\s*\(",
     "page code drives the trainer API"),
    ("wall-time", ERROR, "js", "code",
     r"\bMath\s*\.\s*random\b|\bDate\s*\.\s*now\b|\bnew\s+Date\b|(?<![\w.$])Date\s*\(|\bperformance\s*\.\s*now\b"
     r"|(?<![\w$])(?:window\s*\.\s*)?(?:setTimeout|setInterval|requestAnimationFrame)\s*\(",
     "wall-time API (use the task tick() on the kit clock)"),
    ("network", ERROR, "js", "code", r"\bfetch\s*\(|\bXMLHttpRequest\b|\bWebSocket\b|\bEventSource\b|\bsendBeacon\b",
     "network access"),
    ("network", ERROR, "css", "text", r"url\(\s*['\"]?\s*(?:https?:)?//|@import\s*(?:url\(\s*)?['\"]?\s*(?:https?:)?//",
     "external stylesheet resource"),
    ("native-picker", ERROR, "js", "text",
     r"""type\s*=\s*\\?['"]?(?:date|time|color|datetime-local|month|week)\b"""
     r"""|\.type\s*=\s*['"](?:date|time|color|datetime-local|month|week)['"]""",
     "native date/time/color picker"),
    ("native-select", WARN, "js", "text",
     r"""<select\b|createElement\(\s*['"]select['"]|\bel\(\s*['"]select['"]|\bh\(\s*['"]select['"]""",
     "native <select>"),
    ("viewport-size", WARN, "widget", "code",
     r"(?<![\w$.])(?:window\s*\.\s*)?inner(?:Width|Height)\b|documentElement\s*\.\s*client(?:Width|Height)\b"
     r"|document\s*\.\s*body\s*\.\s*client(?:Width|Height)\b|\bscreen\s*\.\s*(?:width|height)\b",
     "sized from the window, not ctx.size"),
    ("decoy-marker", ERROR, "js", "text",
     r"""dataset\s*\.\s*(?:role\s*=\s*['"]decoy|decoy\b)|data-(?:role\s*=\s*\\?['"]?)?decoy"""
     r"""|setAttribute\(\s*['"]data-role['"]\s*,\s*['"]decoy"""
     r"""|(?:className\s*=|classList\s*\.\s*(?:add|toggle)\(|\bel\(\s*['"][\w-]+['"]\s*,)\s*['"`][^'"`]*\bdecoy\b"""
     r"""|['"`][^'"`\n]*?(?<![\w/])(?:[\w]+-)+(?:decoys?|collide|collision|colliding)\b(?!/)"""
     r"""|['"`][^'"`\n]*?(?<![\w/-])(?:decoys?|collide|collision|colliding)-[\w]""",
     "decoy marked as a decoy in the DOM"),
    ("capture-input", WARN, "js", "text",
     r"""addEventListener\(\s*['"](?:keydown|keyup|keypress|wheel)['"][^;]{0,200}?,\s*(?:true|\{[^}]*capture\s*:\s*true[^}]*\})\s*\)""",
     "capture-phase keyboard / wheel listener"),
    ("oracle-patch", ERROR, "js", "code",
     r"\benv\s*\.\s*scenariosOf\s*\(|\.\s*(?:plan|solve|error|tolerance)\s*=(?![=>])",
     "task / scenario hook replaced from page code"),
    ("frame-observer", ERROR, "frame", "code", r"\bnew\s+(?:window\s*\.\s*)?MutationObserver\b",
     "frame code watches the widget with a MutationObserver"),
    ("global-write", WARN, "js", "code",
     r"(?<![\w$.])window\s*\.\s*(?!__env\b|env\b|location\b|onerror\b|scroll)[A-Za-z_$][\w$]*\s*=(?!=)",
     "window global assigned"),
]
NAMES_END = re.compile(r"(?i)\b(?:then\s+)?(?:press|click|hit|tap|use)\s+(?:the\s+)?[\"'“‘*]*(?:submit)\b")
HTML_SINK = re.compile(r"(?:\.innerHTML\s*\+?=|\.outerHTML\s*=|insertAdjacentHTML\s*\()")
HTML_DATA = re.compile(r"\b(?:spec|model|ctx\s*\.\s*(?:spec|model)|m|item|row|it|entry|person|email|msg)\s*\.\s*"
                       r"(?:name|label|title|text|subject|body|from|to|value|desc|description|items|emails)\b")
FRAGMENT_LINK = re.compile(r"""\.href\s*=\s*['"]#?['"]|href\s*=\s*\\?['"]#\\?['"]|setAttribute\(\s*['"]href['"]\s*,\s*['"]#['"]""")
ALLOW = re.compile(r"megawob-lint:\s*allow\s+([\w,-]+)")
ALLOW_FILE = re.compile(r"megawob-lint:\s*allow-file\s+([\w,-]+)")


def _scorer_patterns(code: str) -> re.Pattern:
    """error( / tolerance( / isCorrect( / satisfied( on env.taskDef, env.taskOf(...), or a name bound to either."""
    names = set(re.findall(r"(?:\b(?:const|let|var)\s+|[,(]\s*)([A-Za-z_$][\w$]*)\s*=\s*(?:window\s*\.\s*)?env\s*\.\s*"
                           r"(?:taskDef|taskOf\([^)]*\))\s*(?=[;,)\n]|$)", code))
    alias = "|".join(re.escape(n) for n in sorted(names))
    base = r"\benv\s*\.\s*(?:taskDef|taskOf\([^)]*\))"
    target = f"(?:{base}|(?<![\\w$.])(?:{alias}))" if alias else base
    return re.compile(target + r"\s*\.\s*(?:error|tolerance|isCorrect|satisfied)\s*\(")


class _Lines:
    def __init__(self, src: str) -> None:
        self.src = src
        self.starts = [0] + [m.end() for m in re.finditer("\n", src)]
        self.raw = src.split("\n")

    def line(self, off: int) -> int:
        return bisect.bisect_right(self.starts, off)

    def snippet(self, off: int, end: int) -> str:
        a = max(0, off - 50)
        s = self.src[a:min(len(self.src), end + 50)].replace("\n", " ")
        return re.sub(r"\s+", " ", s).strip()[:160]

    def allowed(self, rule: str, off: int) -> bool:
        k = self.line(off) - 1
        for line in self.raw[max(0, k - 1):k + 1]:
            for m in ALLOW.finditer(line):
                if rule in m.group(1).split(","):
                    return True
        return False


def lint_file(site: str, path: Path) -> list[Finding]:
    """The static findings of one site file."""
    in_templates = path.is_relative_to(TEMPLATES)
    rel = str(path.relative_to(catalog.HTML if in_templates else SITES))
    src = path.read_text(errors="replace")
    lines = _Lines(src)
    file_allow = {r for m in ALLOW_FILE.finditer(src) for r in m.group(1).split(",")}
    is_css = path.suffix == ".css"
    is_widget = path.parent.name == "widgets" or (in_templates and path.parent.name != "site")
    if is_css:
        views = {"text": css_view(src)}
    else:
        code, text = js_views(src)
        views = {"code": code, "text": text}
    out: list[Finding] = []

    def add(rule, severity, m_start, m_end, note):
        if rule in file_allow or lines.allowed(rule, m_start):
            return
        out.append(Finding(rule, severity, site, rel, lines.line(m_start), lines.snippet(m_start, m_end), note))

    for rule, severity, scope, view, pattern, note in RULES:
        if (scope == "css") != is_css or (scope == "widget" and not is_widget) or (scope == "frame" and is_widget):
            continue
        for m in re.finditer(pattern, views[view]):
            add(rule, severity, m.start(), m.end(), note)
    if is_css:
        for m in CSS_IMPORT.finditer(views["text"]):
            problem = _import_problem(path, views["text"], m)
            if problem:
                add("css-import", ERROR, m.start(), m.end(), problem)
        return out
    code, text = views["code"], views["text"]
    driven = {f.line for f in out if f.rule == "trainer-api"}
    for m in re.finditer(r"\b__env\b", code):
        tail = code[m.end():m.end() + 40]
        if not re.match(rf"\s*\.\s*(?:{_TRAINER_CALLS})\s*\(", tail) and lines.line(m.start()) not in driven:
            add("trainer-read", WARN, m.start(), m.end(), "page code reads __env (use ctx)")
    if is_widget:
        for m in _scorer_patterns(code).finditer(code):
            add("scorer-call", ERROR, m.start(), m.end(), "widget calls the task's error()/tolerance()/isCorrect()/satisfied()")
    if "preventDefault" not in code:
        for m in FRAGMENT_LINK.finditer(text):
            add("fragment-link", ERROR, m.start(), m.end(), "fragment link and no preventDefault in this file")
    if not is_widget:
        for m in NAMES_END.finditer(text):
            add("names-end", ERROR, m.start(), m.end(), "copy names the end control")
    for m in HTML_SINK.finditer(code):
        stmt = text[m.end():m.end() + 400].split(";", 1)[0]
        if HTML_DATA.search(stmt) and ("${" in stmt or "+" in stmt):
            add("html-interp", WARN, m.start(), m.end() + len(stmt), "HTML built from data values")
    return out


def css_import_target(path: Path, m: re.Match) -> Path:
    """The file a site.css @import names, resolved against `path`."""
    return (path.parent / (m.group(1) or m.group(2) or m.group(3) or "")).resolve()


def _import_problem(path: Path, text: str, m: re.Match) -> str:
    """Why this @import is not allowed ('' when it is): only url("<path>"); before any rule, naming a base file."""
    if re.match(r"(?:https?:)?//", m.group(1) or m.group(2) or m.group(3) or ""):
        return ""  # the network rule reports it
    if text[:m.start()].strip() and not text[:m.start()].strip().endswith(";"):
        return "@import after other rules is ignored by browsers"
    if not re.match(r"""@import\s+url\(\s*"[^"]*"\s*\)\s*;""", text[m.start():]):
        return '@import must read @import url("<path>");'
    target = css_import_target(path, m)
    if target.parent != CSS_BASES.resolve():
        return "@import must name a base stylesheet in templates/site/css/"
    if not target.is_file():
        return f"imported file {target.name} does not exist"
    return ""


def css_import_chain(path: Path, seen: tuple = ()) -> tuple[list[Path], str]:
    """Base files a stylesheet imports, depth first, and a problem ('' when none): a cycle or too deep a chain."""
    if path in seen:
        return [], f"import cycle through {path.name}"
    if len(seen) >= MAX_CSS_IMPORT_DEPTH:
        return [], f"import chain deeper than {MAX_CSS_IMPORT_DEPTH} at {path.name}"
    found: list[Path] = []
    try:
        text = css_view(path.read_text(errors="replace"))
    except OSError:
        return [], ""
    for m in CSS_IMPORT.finditer(text):
        if _import_problem(path, text, m):
            continue
        target = css_import_target(path, m)
        sub, problem = css_import_chain(target, seen + (path,))
        if problem:
            return found, problem
        found += [target, *sub]
    return found, ""


def site_files(site: str) -> list[Path]:
    """The site's .js and .css files (vendored libraries left out), sorted."""
    root = SITES / site
    return sorted(p for p in root.rglob("*") if p.suffix in (".js", ".css") and "vendor" not in p.relative_to(root).parts)


def select_sites(patterns: list[str] | None, task: str | None) -> list[str]:
    """The site names matching the glob patterns (and with a widgets/<task>.js, when given); all without a pattern."""
    names = manifests.site_dirs(patterns)
    if task:
        names = [n for n in names if (SITES / n / "widgets" / f"{task}.js").exists()]
    return names


def standalone_site_js() -> list[str]:
    """The design-* sites whose site.js draws its own frame (html/sites/STANDALONE_SITE_JS.txt; empty when missing)."""
    path = SITES / STANDALONE_SITE_JS
    if not path.is_file():
        return []
    lines = (line.partition("#")[0].strip() for line in path.read_text().splitlines())
    return [line for line in lines if line]


def lint_standalone_list() -> list[Finding]:
    """The frozen list of standalone site.js files must not grow, and names only existing design-* sites."""
    names = standalone_site_js()
    file = f"{STANDALONE_SITE_JS}"
    out = []
    if len(names) > STANDALONE_SITE_JS_MAX:
        out.append(Finding("site-template", ERROR, "standalone-list", file, 0, f"{len(names)} sites",
                           f"the list is frozen at {STANDALONE_SITE_JS_MAX} sites: new sites must be designs on a site template"))
    existing = set(manifests.site_dirs())
    for name in names:
        if not name.startswith("design-") or name not in existing:
            out.append(Finding("site-template", ERROR, "standalone-list", file, 0, name, "not an existing design-* site"))
    return out


def lint_structure(sites: list[str], task: str | None = None, html: Path | None = None) -> list[Finding]:
    """The structure rules over some sites: what their site.js and widget files register against the template
    rule, the directory name and the manifest."""
    defs = manifests.load_defs(sites, html)
    tasks = set(catalog.tasks())
    standalone = set(standalone_site_js())
    out: list[Finding] = []

    def add(rule, severity, site, file, line, snippet, note, fam=""):
        if not task or not fam or fam == task:
            out.append(Finding(rule, severity, site, file, line, snippet, note))

    for site in sites:
        entry = defs[site]
        if entry["error"]:
            add("widget-load", ERROR, site, f"{site}/site.js", 0, entry["error"], "site.js does not load")
        if not entry["sites"] and not entry["error"] and (SITES / site / "site.js").is_file():
            add("site-dir", ERROR, site, f"{site}/site.js", 0, "", "site.js registers no env.site")
        if site in standalone and entry["sites"] and all(d["template"] for d in entry["sites"]):
            add("site-template", WARN, site, f"{site}/site.js", 0, site,
                f"site.js is a design now: delete the site from {STANDALONE_SITE_JS}")
        for d in entry["sites"]:
            if site.startswith("design-") and not d["template"] and site not in standalone:
                add("site-template", ERROR, site, f"{site}/site.js", d["line"], f"env.site name {d['name']!r}",
                    "design-* site.js is not a design on a site template (template: 'site/<name>', design: {...}); "
                    f"{STANDALONE_SITE_JS} is frozen")
            if d["name"] != site:
                add("site-dir", ERROR, site, f"{site}/site.js", d["line"], f"env.site name {d['name']!r}",
                    f"the site declares name '{d['name']}', its directory is '{site}'")
        for file, rec in entry["files"].items():
            stem = Path(file).stem
            where = f"{site}/{file}"
            if rec["error"]:
                add("widget-load", ERROR, site, where, 0, rec["error"], "widget file does not load", stem)
            elif stem in tasks and not rec["widgets"]:
                add("widget-task", ERROR, site, where, 0, "", "widget file registers no widget", stem)
            for d in rec["widgets"]:
                label = f"{d['task']}/{d['name'] or '(unnamed)'}"
                if d["task"] != stem and stem in tasks:
                    add("widget-task", ERROR, site, where, d["line"], label,
                        f"widgets/{stem}.js registers a widget of task '{d['task']}'", stem)
                if site.startswith("design-") and not d["template"]:
                    add("widget-template", ERROR, site, where, d["line"], label,
                        "design-* widget is not a design on a template (template: '<task>/<name>', design: {...})", stem)
                if d["site"] is None:
                    if not (d["template"] and d["designWidget"]):
                        add("site-dir", ERROR, site, where, d["line"], label,
                            "widget declares no site (only a template design with design.widget embeds a sub-widget)", stem)
                elif d["site"] != site:
                    add("site-dir", ERROR, site, where, d["line"], label,
                        f"widget declares site '{d['site']}', its directory is '{site}'", stem)
                if d["name"] is None and not d["template"]:
                    add("widget-name", ERROR, site, where, d["line"], label, "widget has no name", stem)
                elif d.get("unresolved"):
                    add("widget-name", WARN, site, where, d["line"], label, d["unresolved"], stem)
                elif d["name"] is None and not d.get("names"):
                    add("widget-name", ERROR, site, where, d["line"], label, "its template returned no named widget", stem)
        for file, line, fam, note in manifests.drift(site, entry, manifests.read_manifest(site)):
            add("manifest-drift", ERROR, site, file, line, note, "manifest.json differs from the widget files", fam)
    return out


UTIL_DEFINITION = r"(?:\b(?:const|let|var)\s+{n}\s*=\s*(?:async\s*)?(?:function\b|\([^()]*\)\s*=>|[\w$]+\s*=>)|^[ \t]*function\s+{n}\s*\()"


# Former per-task copies that env.util.listText replaced: they must not come back under the old name.
RETIRED_UTIL_NAMES = {"andList"}


def util_names() -> list[str]:
    """The env.util helpers a task must not redefine: kit/runtime/data.js's exports, plus rng.js's hash32."""
    data = (catalog.HTML / "kit/runtime/data.js").read_text()
    body = re.search(r"kit\.data = \{([^}]*)\}", data).group(1)
    return sorted({n.strip() for n in body.split(",") if n.strip()} | {"hash32"} | RETIRED_UTIL_NAMES)


def lint_util_copies() -> list[Finding]:
    """util-copy: task and kit files that define a function with the name of an env.util helper."""
    names = util_names()
    pattern = re.compile("|".join(UTIL_DEFINITION.format(n=re.escape(n)) for n in names), re.M)
    owners = {catalog.HTML / "kit/runtime/data.js", catalog.HTML / "kit/runtime/rng.js"}
    out = []
    for root, site in ((catalog.HTML / "tasks", "tasks"), (catalog.HTML / "kit", "kit")):
        for path in sorted(root.rglob("*.js")):
            if path in owners:
                continue
            src = path.read_text(errors="replace")
            code = js_views(src)[0]
            lines = _Lines(src)
            for m in pattern.finditer(code):
                if lines.allowed("util-copy", m.start()):
                    continue
                name = next(n for n in names if re.match(UTIL_DEFINITION.format(n=re.escape(n)), m.group(0), re.M))
                out.append(Finding("util-copy", ERROR, site, str(path.relative_to(catalog.HTML)), lines.line(m.start()),
                                   lines.snippet(m.start(), m.end()), f"env.util has {name}: use it"))
    return out


def lint_static(sites: list[str], task: str | None = None) -> list[Finding]:
    """Findings of the static lint over the sites' files and manifests."""
    out = lint_structure(sites, task)
    templates = set()
    bases: set[Path] = set()
    for site in sites:
        for path in site_files(site):
            if task and path.parent.name == "widgets" and path.stem != task:
                continue
            out.extend(lint_file(site, path))
            if path.suffix == ".css":
                chain, problem = css_import_chain(path)
                bases.update(chain)
                if problem:
                    out.append(Finding("css-import", ERROR, site, str(path.relative_to(SITES)), 1, "@import", problem))
            if (path.parent.name == "widgets" or path.name == "site.js") and path.suffix == ".js":
                templates.update(TEMPLATE_REF.findall(path.read_text(errors="replace")))
    for name in sorted(templates):
        path = TEMPLATES / f"{name}.js"
        if path.is_file():
            out.extend(lint_file("templates", path))
    for path in sorted(bases):
        out.extend(lint_file("templates", path))
    return out


# ---------------------------------------------------------------------------------------------- runtime rules

_OBSERVE = """() => {
  if (window.__lint) return;
  const obs = new MutationObserver(() => {});
  obs.observe(document.documentElement, {subtree: true, childList: true, attributes: true, characterData: true,
    attributeOldValue: true, characterDataOldValue: true});
  // Net changes only: a node added and removed again (a measuring probe) or an attribute set and restored
  // within one oracle() call leaves the page as it was.
  const net = (recs) => {
    const first = new Map();
    const out = [];
    const added = new Set(recs.flatMap((r) => (r.type === 'childList' ? [...r.addedNodes] : [])));
    for (const r of recs) {
      if (r.type === 'childList') {
        if ([...r.addedNodes].some((n) => n.isConnected)
          || [...r.removedNodes].some((n) => !n.isConnected && !added.has(n))) out.push(r);
        continue;
      }
      const key = r.target;
      const per = first.get(key) || new Map();
      first.set(key, per);
      const k = r.type === 'attributes' ? r.attributeName : '#text';
      if (!per.has(k)) per.set(k, r);
    }
    for (const [target, per] of first) {
      for (const [k, r] of per) {
        const now = k === '#text' ? target.data : target.getAttribute(k);
        if (now !== r.oldValue) out.push(r);
      }
    }
    return out;
  };
  const name = (n) => {
    if (!n || n.nodeType !== 1) return n && n.parentElement ? name(n.parentElement) + ' (text)' : String(n);
    const cls = typeof n.className === 'string' ? n.className.trim().split(/\\s+/).filter(Boolean).slice(0, 3) : [];
    return n.tagName.toLowerCase() + cls.map((c) => '.' + c).join('');
  };
  const say = (r) => r.type === 'attributes' ? `${name(r.target)} [${r.attributeName}]`
    : r.type === 'childList' ? `${name(r.target)} children` : `${name(r.target)} text`;
  window.__lint = {
    step() {
      obs.takeRecords();
      // Scroll offsets do not produce MutationRecords. Snapshot them as well so locate() cannot silently
      // reveal a control while returning a click, bypassing the agent's action count and task clock.
      const offsets = [...document.querySelectorAll('*')].map((el) => [el, el.scrollLeft, el.scrollTop]);
      const action = __env.oracle();
      const recs = net(obs.takeRecords());
      const scrolls = offsets.filter(([el, x, y]) => el.isConnected && (el.scrollLeft !== x || el.scrollTop !== y))
        .map(([el, x, y]) => `${name(el)} scroll ${x},${y} -> ${el.scrollLeft},${el.scrollTop}`);
      return {action, mutations: [...new Set([...recs.map(say), ...scrolls])].slice(0, 4), count: recs.length + scrolls.length};
    },
    hidden(p) {
      const e = document.elementFromPoint(p[0], p[1]);
      if (!e) return null;
      let op = 1;
      for (let n = e; n && n.nodeType === 1; n = n.parentElement) {
        const cs = getComputedStyle(n);
        if (cs.visibility === 'hidden') return name(e) + ' (visibility hidden)';
        op *= parseFloat(cs.opacity);
      }
      return op < 0.05 ? `${name(e)} (opacity ${op.toFixed(2)})` : null;
    },
    navigation() {
      const out = [];
      for (const a of document.querySelectorAll('a[href]')) {
        const h = a.getAttribute('href').trim();
        if (!(h === '' || h.startsWith('#')) || !a.isConnected) continue;
        const ok = !a.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, view: window}));
        if (!ok) out.push(['fragment-nav', `${name(a)} href="${h}" "${(a.textContent || '').trim().slice(0, 30)}"`]);
      }
      for (const f of document.querySelectorAll('form')) {
        if (!f.isConnected) continue;
        const ok = !f.dispatchEvent(new Event('submit', {bubbles: true, cancelable: true}));
        if (!ok) out.push(['form-nav', name(f)]);
      }
      return out;
    },
  };
}"""


def _points(action: dict) -> list:
    """The pointer positions of an oracle action."""
    pts = [action.get(k) for k in ("at", "from", "to") if action.get(k)]
    return pts + list(action.get("points") or [])


def lint_runtime_cells(work: list[tuple]) -> list[list[dict]]:
    """Run (widget, seeds) cells in one browser; one list of Finding dicts per cell."""
    rows = []
    with driver.browser() as browser:
        context = driver.new_context(browser)
        page = context.new_page()
        for widget, seeds in work:
            found, seen = [], set()
            rows.append(found)

            def add(rule, severity, note, seed):
                if (rule, note) in seen:
                    return
                seen.add((rule, note))
                found.append(asdict(Finding(rule, severity, widget.site, "(runtime)", 0,
                                            f"{widget.task}/{widget.name} seed {seed}", note)))

            for seed in seeds:
                try:
                    driver.boot(page, widget, seed, finishByMessage="0", judgment="off")
                    page.evaluate(_OBSERVE)
                    vw, vh = page.evaluate("() => [innerWidth, innerHeight]")
                    for _ in range(driver.budget(page)):
                        res = page.evaluate("() => __lint.step()")
                        action = res["action"]
                        if res["count"]:
                            add("locate-mutation", ERROR, "oracle()/locate() changed the DOM or scroll offsets: "
                                + ", ".join(res["mutations"]), seed)
                        if action is None:
                            break
                        for p in _points(action):
                            if not (0 <= p[0] < vw and 0 <= p[1] < vh):
                                add("oracle-offscreen", ERROR,
                                    f"{action['type']} at {round(p[0])},{round(p[1])} outside {vw}x{vh}", seed)
                        press = action.get("at") or action.get("from")
                        if press and action["type"] not in ("move", "wheel", "wait", "finish"):
                            hidden = page.evaluate("(p) => __lint.hidden(p)", press)
                            if hidden:
                                add("oracle-hidden", WARN, f"{action['type']} lands on {hidden}", seed)
                        driver.act(page, action, 4)
                    for rule, note in page.evaluate("() => __lint.navigation()"):
                        add(rule, ERROR, note, seed)
                except Exception as e:  # a page that does not boot is the checker's business; note it and go on
                    add("runtime-error", WARN, f"{type(e).__name__}: {str(e).splitlines()[0][:160]}", seed)
    return rows


def lint_runtime(sites: list[str], task: str | None, seeds: list[int], jobs: int) -> list[Finding]:
    """Findings of following the oracle on the sites' widgets in Chromium (--runtime)."""
    keep = set(sites)
    cells = [(s, seeds) for s in catalog.widgets(task, include_test=True) if s.site in keep]
    if not cells:
        return []
    rows = driver.run_pool(lint_runtime_cells, cells, jobs)
    return [Finding(**r) for found in rows for r in found]


# ---------------------------------------------------------------------------------------------- report

def report(findings: list[Finding], verbose: bool = False, limit: int = 3, out: TextIO = sys.stdout) -> int:
    """Print a summary by rule (and examples or every finding); returns the number of error findings."""
    by_rule: dict[str, list[Finding]] = defaultdict(list)
    for f in findings:
        by_rule[f.rule].append(f)
    order = sorted(by_rule, key=lambda r: (by_rule[r][0].severity != ERROR, r))
    print(f"{'rule':<18} {'severity':<8} {'sites':>6} {'hits':>6}", file=out)
    for rule in order:
        fs = by_rule[rule]
        print(f"{rule:<18} {fs[0].severity:<8} {len({f.site for f in fs}):>6} {len(fs):>6}", file=out)
    for rule in order:
        fs = by_rule[rule]
        print(f"\n{rule} ({fs[0].severity}): {fs[0].note if fs[0].file != '(runtime)' else ''}".rstrip(": "), file=out)
        per_site = Counter(f.site for f in fs)
        if verbose:
            shown = fs
        else:  # the first finding of the sites with the most hits
            first = {}
            for f in fs:
                first.setdefault(f.site, f)
            shown = [first[s] for s, _ in per_site.most_common(limit)]
        for f in shown:
            where = f"{f.file}:{f.line}" if f.line else f"{f.site} {f.snippet}"
            text = f.note if f.file == "(runtime)" else f.snippet
            print(f"  {where}  {text}", file=out)
        if not verbose and len(per_site) > len(shown):
            print(f"  ... {len(per_site) - len(shown)} more sites (--verbose lists every finding)", file=out)
    errors = sum(f.severity == ERROR for f in findings)
    print(f"\n{len(findings)} findings, {errors} errors, in {len({f.site for f in findings})} sites", file=out)
    return errors


def run_ruff(required: bool) -> int:
    """`ruff check` of the Python files (config in pyproject.toml): its exit status. A missing ruff is skipped
    with a note, unless required (--ruff)."""
    if importlib.util.find_spec("ruff") is None:
        if required:
            sys.exit("ruff is not installed (pip install -e '.[dev]')")
        print("ruff is not installed: skipped `ruff check` (pip install -e '.[dev]')")
        return 0
    root = Path(__file__).resolve().parent.parent
    return subprocess.run([sys.executable, "-m", "ruff", "check", str(root)], check=False).returncode


def main() -> None:
    """Command line: lint the selected sites; exit 1 on errors."""
    parser = driver.parser(__doc__)
    parser.add_argument("--site", action="append", help="site name or glob (repeatable); default every site")
    parser.add_argument("--task", help="only widgets of this task (and the site files of sites that have one)")
    parser.add_argument("--rule", action="append", help="only these rules (repeatable)")
    parser.add_argument("--errors", action="store_true", help="only error-severity findings")
    parser.add_argument("--runtime", action="store_true", help="also boot every widget and follow the oracle")
    parser.add_argument("--seeds", type=int, default=2, help="runtime seeds per widget (default 2)")
    driver.add_jobs(parser)
    parser.add_argument("--verbose", action="store_true", help="list every finding, not a few sites per rule")
    parser.add_argument("--json", type=Path, help="write every finding here")
    parser.add_argument("--ruff", action="store_true", help="also run `ruff check` (the default for a full lint)")
    parser.add_argument("--no-ruff", action="store_true", help="skip `ruff check`")
    args = parser.parse_args()

    sites = select_sites(args.site, args.task)
    if not sites:
        sys.exit("no sites match")
    findings = lint_static(sites, args.task) + lint_util_copies() + lint_standalone_list()
    if args.runtime:
        findings += lint_runtime(sites, args.task, list(range(args.seeds)), args.jobs)
    if args.rule:
        findings = [f for f in findings if f.rule in args.rule]
    if args.errors:
        findings = [f for f in findings if f.severity == ERROR]
    if args.json:
        driver.write_json(args.json, [asdict(f) for f in findings])
    errors = report(findings, args.verbose)
    if not args.no_ruff and (args.ruff or not (args.site or args.task or args.rule)):
        errors += run_ruff(args.ruff)
    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()
