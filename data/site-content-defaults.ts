import type { SiteContent } from "@/types/site-content";

export const siteContentDefaults: Pick<SiteContent, "content"> & {
  partners: Pick<SiteContent["partners"], "history">;
} = {
  partners: {
    history: [
      {
        period: "2018 ~ 2020",
        detail: '남성패션플랫폼 "하이버" 초기 서비스 런칭 및 GMV 500억 달성',
      },
      {
        period: "2020 ~ 2023",
        detail: '모빌리티 플랫폼 "오늘의카" 창업 및 한국타이어 투자 유치',
      },
      {
        period: "2021 ~ 2023",
        detail: '모빌리티 MCN "스튜디오랩타임" 창업 및 첫해 매출 10억 달성',
      },
      {
        period: "2024",
        detail: "와이콤마 창업 : 외주 클라이언트 20개 달성",
      },
      {
        period: "2024.08",
        detail: "본엔젤스 시드 투자 유치",
      },
      {
        period: "2024.10",
        detail: "슈미트 시드 투자 유치",
      },
      {
        period: "2024.11",
        detail: "팁스 선정",
      },
      {
        period: "2025.01",
        detail: '3040 공구 플랫폼 "drrip" 서비스 런칭',
      },
      {
        period: "2026.04",
        detail: '커머스운영관리솔루션 "펭귄보드" 커밍순',
      },
    ],
  },
  content: {
    items: [
      {
        title: "Content Visual 1",
        imageSrc: "/images/content/content-1.webp",
      },
      {
        title: "Content Visual 2",
        imageSrc: "/images/content/content-2.webp",
      },
    ],
  },
};
