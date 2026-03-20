"use client";

import { useState } from "react";
import type { SiteContent } from "@/types/site-content";
import { SitePreview } from "@/components/site/site-preview";

interface LivePreviewProps {
  content: SiteContent;
}

export function LivePreview({ content }: LivePreviewProps) {
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const viewportWidths = {
    desktop: 1440,
    tablet: 900,
    mobile: 430,
  } as const;

  return (
    <section className="min-w-0 rounded-[28px] border border-white/10 bg-[#121216] p-3 shadow-panel">
      <div className="mb-3 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Preview</p>
          <h2 className="text-lg font-semibold">Live Homepage Preview</h2>
        </div>
        <div className="flex items-center gap-2">
          {(["desktop", "tablet", "mobile"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setViewport(mode)}
              className={
                viewport === mode
                  ? "rounded-full bg-white px-3 py-1 text-xs font-medium text-black"
                  : "rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-300"
              }
            >
              {mode}
            </button>
          ))}
          <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
            Live
          </div>
        </div>
      </div>
      <div className="h-[calc(100vh-8rem)] overflow-auto rounded-[24px] border border-white/10 bg-[#0b0b0d] p-4">
        <div className="mx-auto min-w-max" style={{ width: viewportWidths[viewport] }}>
          <SitePreview content={content} />
        </div>
      </div>
    </section>
  );
}
