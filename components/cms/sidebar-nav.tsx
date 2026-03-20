import {
  cmsPanelLabels,
  type CmsPanelKey,
  type NavigationItem,
  type SiteSectionKey,
} from "@/types/site-content";
import { cn } from "@/lib/utils";

interface SidebarNavProps {
  menuItems: NavigationItem[];
  selectedPanel: CmsPanelKey;
  onAddMenuItem: () => void;
  onSelect: (section: CmsPanelKey) => void;
}

export function SidebarNav({
  menuItems,
  selectedPanel,
  onAddMenuItem,
  onSelect,
}: SidebarNavProps) {
  const sections = Object.keys(cmsPanelLabels).filter(
    (key) => !["navigation", "design", "footer"].includes(key),
  ) as SiteSectionKey[];

  return (
    <aside className="rounded-[28px] border border-white/10 bg-[#121216]/90 p-5 text-white shadow-panel backdrop-blur">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">YCOMMA</p>
        <h1 className="mt-3 text-2xl font-semibold">CMS MVP</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Update menu items and section content, then see the result in the live preview.
        </p>
      </div>

      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onSelect("navigation")}
            className={cn(
              "text-sm font-medium transition",
              selectedPanel === "navigation" ? "text-white" : "text-zinc-400",
            )}
          >
            Site Navigation
          </button>
          <button
            type="button"
            onClick={onAddMenuItem}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-200 transition hover:bg-white/10"
          >
            + Add
          </button>
        </div>

        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <div
              key={item.id}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <p className="text-sm font-medium text-white">{item.label}</p>
              <p className="mt-1 text-xs text-zinc-400">
                {index + 1}. {item.href}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <button
          type="button"
          onClick={() => onSelect("design")}
          className={cn(
            "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition",
            selectedPanel === "design"
              ? "border-fuchsia-400 bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white"
              : "border-white/10 bg-white/5 text-zinc-200 hover:border-fuchsia-400/40 hover:bg-white/10",
          )}
        >
          <span>Design Controls</span>
          <span className="text-xs opacity-70">theme</span>
        </button>
      </div>

      <div className="mb-6">
        <button
          type="button"
          onClick={() => onSelect("footer")}
          className={cn(
            "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition",
            selectedPanel === "footer"
              ? "border-fuchsia-400 bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white"
              : "border-white/10 bg-white/5 text-zinc-200 hover:border-fuchsia-400/40 hover:bg-white/10",
          )}
        >
          <span>Footer</span>
          <span className="text-xs opacity-70">edit</span>
        </button>
      </div>

      <nav className="space-y-2">
        {sections.map((section) => (
          <button
            key={section}
            type="button"
            onClick={() => onSelect(section)}
            className={cn(
              "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition",
              selectedPanel === section
                ? "border-fuchsia-400 bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white"
                : "border-white/10 bg-white/5 text-zinc-200 hover:border-fuchsia-400/40 hover:bg-white/10",
            )}
          >
            <span>{cmsPanelLabels[section]}</span>
            <span className="text-xs opacity-70">edit</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
