"use client";

import { useEffect, useState } from "react";
import { EditorPanel } from "@/components/cms/editor-panel";
import { LivePreview } from "@/components/cms/live-preview";
import { SidebarNav } from "@/components/cms/sidebar-nav";
import { initialSiteContent } from "@/data/site-content";
import {
  loadStoredSiteContent,
  saveSiteContent,
} from "@/lib/site-content-storage";
import type {
  CmsPanelKey,
  NavigationItem,
  SiteContent,
} from "@/types/site-content";

export function CmsShell() {
  const [selectedPanel, setSelectedPanel] = useState<CmsPanelKey>("navigation");
  const [content, setContent] = useState<SiteContent>(initialSiteContent);
  const [saveStatus, setSaveStatus] = useState("Loading saved content...");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const stored = loadStoredSiteContent();
    setContent(stored);
    setSaveStatus("Loaded saved content");
    setHasUnsavedChanges(false);
    void syncContentToSource(stored, "Loaded saved content");
  }, []);

  const updateContent = (next: SiteContent) => {
    setContent(next);
    setHasUnsavedChanges(true);
    setSaveStatus("Unsaved changes");
  };

  const saveChanges = async () => {
    setSaveStatus("Saving locally...");
    saveSiteContent(content);
    setHasUnsavedChanges(false);
    await syncContentToSource(content, "Saved locally");
  };

  const updateNavigationItem = (
    id: string,
    patch: Partial<NavigationItem>,
  ) => {
    updateContent({
      ...content,
      navigation: {
        ...content.navigation,
        items: content.navigation.items.map((item) =>
          item.id === id ? { ...item, ...patch } : item,
        ),
      },
    });
  };

  const addNavigationItem = () => {
    const nextItem: NavigationItem = {
      id: createCmsId("nav"),
      label: "New Menu",
      href: "#new-section",
    };

    updateContent({
      ...content,
      navigation: {
        ...content.navigation,
        items: [...content.navigation.items, nextItem],
      },
    });
    setSelectedPanel("navigation");
  };

  const moveNavigationItem = (id: string, direction: "up" | "down") => {
    const items = [...content.navigation.items];
    const index = items.findIndex((item) => item.id === id);

    if (index === -1) {
      return;
    }

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) {
      return;
    }

    [items[index], items[targetIndex]] = [items[targetIndex], items[index]];

    updateContent({
      ...content,
      navigation: { ...content.navigation, items },
    });
  };

  const removeNavigationItem = (id: string) => {
    updateContent({
      ...content,
      navigation: {
        ...content.navigation,
        items: content.navigation.items.filter((item) => item.id !== id),
      },
    });
  };

  const syncContentToSource = async (
    nextContent: SiteContent,
    successPrefix: string,
  ) => {
    setIsSyncing(true);

    try {
      const response = await fetch("/api/persist-site-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: nextContent }),
      });

      if (!response.ok) {
        throw new Error("Source sync failed");
      }

      setSaveStatus(`${successPrefix} + synced to source`);
    } catch {
      setSaveStatus(`${successPrefix} (source sync failed)`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1960px] gap-4 lg:grid-cols-[250px_minmax(360px,0.8fr)_minmax(920px,1.9fr)]">
        <div className="contents">
          <SidebarNav
            menuItems={content.navigation.items}
            selectedPanel={selectedPanel}
            onAddMenuItem={addNavigationItem}
            onSelect={setSelectedPanel}
          />
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              <span>{saveStatus}</span>
              <button
                type="button"
                onClick={saveChanges}
                disabled={!hasUnsavedChanges || isSyncing}
                className="rounded-full bg-emerald-400 px-4 py-2 text-xs font-semibold text-emerald-950 disabled:cursor-not-allowed disabled:bg-emerald-400/40 disabled:text-emerald-100"
              >
                {isSyncing ? "Syncing..." : "Save"}
              </button>
            </div>
            <EditorPanel
              content={content}
              selectedPanel={selectedPanel}
              onChange={updateContent}
              onAddMenuItem={addNavigationItem}
              onMoveMenuItem={moveNavigationItem}
              onRemoveMenuItem={removeNavigationItem}
              onUpdateMenuItem={updateNavigationItem}
            />
          </div>
          <LivePreview content={content} />
        </div>
      </div>
    </main>
  );
}

function createCmsId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
