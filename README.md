# YCOMMA CMS MVP

YCOMMA 기업 홈페이지 콘텐츠를 관리하기 위한 자체 CMS MVP 1단계 프로젝트입니다.

## 제안 폴더 구조

```text
.
|-- app
|   |-- globals.css
|   |-- layout.tsx
|   `-- page.tsx
|-- components
|   |-- cms
|   |   |-- cms-shell.tsx
|   |   |-- editor-panel.tsx
|   |   |-- live-preview.tsx
|   |   `-- sidebar-nav.tsx
|   `-- site
|       `-- site-preview.tsx
|-- data
|   `-- site-content.ts
|-- lib
|   `-- utils.ts
|-- types
|   `-- site-content.ts
|-- components.json
|-- next.config.ts
|-- package.json
|-- postcss.config.js
|-- tailwind.config.ts
`-- tsconfig.json
```

## 포함 범위

- Next.js App Router 기반 프로젝트 뼈대
- TypeScript 타입 정의
- Tailwind CSS 설정
- shadcn/ui 호환 `components.json` 및 `lib/utils.ts`
- 좌측 메뉴 / 중앙 편집 폼 / 우측 실시간 미리보기 3단 레이아웃
- `Hero`, `Solutions`, `Products`, `Metrics`, `Case Study`, `Partners`, `About` 더미 콘텐츠

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 아래 주소를 열면 됩니다.

```text
http://localhost:3000
```

## 다음 추천 단계

1. 실제 shadcn/ui 컴포넌트 초기화 및 `button`, `card`, `textarea` 도입
2. 섹션별 JSON 저장/불러오기 기능 추가
3. 이미지 업로드와 미리보기 연결
4. Supabase 또는 파일 기반 저장소 연결
