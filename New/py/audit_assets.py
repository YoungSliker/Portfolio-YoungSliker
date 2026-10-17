"""Read legacy assets and literal HTML references; write audit data under New/data."""
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import json

ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "New" / "data"
CATEGORIES = ("AIGC", "数字体验设计", "视觉传达设计")
RESOURCE_ROOTS = (*CATEGORIES, "主界面", "Fonts")
IMAGE = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".avif"}
VIDEO = {".mp4", ".webm", ".mov", ".m4v"}


def write_json(name, value):
    (OUTPUT / name).write_text(
        json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )


def kind(path):
    ext = path.suffix.lower()
    return "image" if ext in IMAGE else "video" if ext in VIDEO else "other"


class References(HTMLParser):
    def __init__(self):
        super().__init__()
        self.local = []
        self.external = []

    def handle_starttag(self, tag, attrs):
        if tag == "base":
            return  # Base is a directory URL, not a file resource.
        for attr, value in attrs:
            if attr not in {"src", "href", "poster"} or not value:
                continue
            url = urlsplit(value)
            if url.scheme in {"http", "https"} or url.netloc:
                self.external.append({"tag": tag, "attribute": attr, "url": value})
            elif not url.scheme and url.path:
                relative = unquote(url.path).lstrip("/")
                self.local.append({"tag": tag, "attribute": attr, "path": relative,
                                   "exists": (ROOT / relative).is_file()})


def main():
    OUTPUT.mkdir(exist_ok=True)
    assets = []
    for category in RESOURCE_ROOTS:
        for path in sorted((ROOT / category).rglob("*")):
            if path.is_file():
                assets.append({"category": category, "path": path.relative_to(ROOT).as_posix(),
                               "extension": path.suffix.lower(), "kind": kind(path),
                               "bytes": path.stat().st_size})
    write_json("existing-assets.json", [a for a in assets if a["category"] in CATEGORIES])
    write_json("shared-assets.json", [a for a in assets if a["category"] not in CATEGORIES])
    parser = References()
    parser.feed((ROOT / "index.html").read_text(encoding="utf-8"))
    write_json("legacy-html-references.json", {"local": parser.local, "external": parser.external})
    summary = {}
    for category in RESOURCE_ROOTS:
        group = [a for a in assets if a["category"] == category]
        summary[category] = {"files": len(group), "bytes": sum(a["bytes"] for a in group),
                             "kinds": dict(Counter(a["kind"] for a in group))}
    summary["largestFiles"] = sorted(assets, key=lambda a: a["bytes"], reverse=True)[:15]
    summary["missingLiteralHtmlReferences"] = [r for r in parser.local if not r["exists"]]
    summary["scope"] = "Local files and literal index.html src/href/poster only; no runtime or remote checks."
    write_json("audit-summary.json", summary)

    # Existing gallery is a JSON assignment; parse data without executing legacy JS.
    source = (ROOT / "js/gallery-data-742.js").read_text(encoding="utf-8")
    gallery, _ = json.JSONDecoder().raw_decode(source.split("=", 1)[1].lstrip())
    catalog = []

    def add(title, category, evidence, state="asset-only", legacy_id=None):
        catalog.append({"title": title, "category": category, "evidence": evidence,
                        "evidenceStatus": state, "legacyId": legacy_id, "year": None,
                        "responsibilities": [], "reviewStatus": "needs-review"})

    for title, folder, legacy_id in [("绥远方志", "绥远方志", "suiyuan"),
                                    ("矿山*生态", "矿山生态", "mine-eco"),
                                    ("微元灵溯", "微元灵溯", "weiyuan")]:
        add(title, "AIGC", f"AIGC/{folder}", "legacy-detail", legacy_id)
    for path in sorted((ROOT / "AIGC/背景").iterdir()):
        if path.is_dir() and path.name != "网页预览":
            add(path.name, "AIGC / 实验候选", path.relative_to(ROOT).as_posix())
    for work in gallery:
        add(work["title"], "数字体验 / 新媒体艺术", "js/gallery-data-742.js",
            "legacy-gallery", work["id"])
    for path in sorted((ROOT / "数字体验设计/APP设计").iterdir()):
        if path.is_dir() and not path.name.startswith("体验预览"):
            add(path.name, "数字体验 / APP", path.relative_to(ROOT).as_posix(), "asset-and-ui")
    for path in sorted((ROOT / "视觉传达设计/品牌设计").iterdir()):
        if path.is_dir():
            add(path.name, "视觉传达 / 品牌", path.relative_to(ROOT).as_posix())
    # Group numbered panels and alternate image encodings; grouping needs editorial review.
    import re
    for folder, category in [("版面设计", "视觉传达 / 版面候选"), ("LOGO设计", "视觉传达 / LOGO候选")]:
        groups = {}
        for path in sorted((ROOT / "视觉传达设计" / folder).iterdir()):
            if path.is_file() and path.suffix.lower() in IMAGE | VIDEO:
                title = re.sub(r"\d+$", "", path.stem)
                groups.setdefault(title, []).append(path.relative_to(ROOT).as_posix())
        for title, paths in groups.items():
            add(title, category, paths)
    add("哈尼卡日历设计", "视觉传达 / 分类待核对", "视觉传达设计/哈尼卡日历设计")
    write_json("work-candidates.json", catalog)
    embedded = {}
    for filename in ("drift-735.js", "visual-menu-813.js"):
        text = (ROOT / "js" / filename).read_text(encoding="utf-8")
        literal = text.split("JSON.parse(`", 1)[1].split("`)", 1)[0]
        # These bundles escape JSON backslashes once more inside JS template literals.
        literal = literal.replace("\\\\", "\\").replace("\\`", "`").replace("\\$", "$")
        entries = json.loads(literal)
        embedded[filename] = [
            {k: v for k, v in item.items() if k in
             {"title", "date", "kind", "intro", "full", "original", "coverSource", "description"}}
            for item in entries
        ]
    write_json("legacy-embedded-catalogs.json", embedded)
    lines = ["# 作品名称与来源", "", "自动生成的审计索引。展示条目不等于独立项目；日期是旧站记录，尚未核实完成日期含义。", "",
             "## 三个主要案例", "", "绥远方志 / 矿山*生态 / 微元灵溯。见 index.html 与各详情脚本。", "",
             "## AIGC 实验：js/drift-735.js", "", "| 标题 | 旧站日期 |", "|---|---|"]
    for item in embedded["drift-735.js"]:
        lines.append(f"| {item['title']} | {item.get('date', '待核对')} |")
    lines.extend(["", "## 新媒体：js/gallery-data-742.js", "", "| 旧 ID | 标题 |", "|---|---|"])
    for item in gallery:
        lines.append(f"| {item['id']} | {item['title']} |")
    lines.extend(["", "## APP：目录与 js/app-card-790.js", "", "学伴 / 颜茶阁 / 助残帮。", "",
                  "## 视觉传达：js/visual-menu-813.js", "", "保留重复标题及索引，方便后续合并多画面项目。", "",
                  "| 旧数组索引 | 标题 | 类型 |", "|---|---|---|"])
    for index, item in enumerate(embedded["visual-menu-813.js"]):
        lines.append(f"| {index} | {item['title']} | {item.get('kind', '')} |")
    lines.extend(["", "## 文件与目录候选（含与上表重叠项）", "", "| 分类 | 名称 | 证据 |", "|---|---|---|"])
    for item in catalog:
        evidence = item["evidence"]
        if isinstance(evidence, list):
            evidence = "；".join(evidence)
        lines.append(f"| {item['category']} | {item['title']} | {evidence} |")
    (ROOT / "New/docs/work-index.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(json.dumps({"resourceFiles": len(assets), "candidateEntries": len(catalog),
                      "missingLiteralHtmlReferences": len(summary["missingLiteralHtmlReferences"]),
                      "categories": {k: v for k, v in summary.items() if k in RESOURCE_ROOTS}},
                     ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
