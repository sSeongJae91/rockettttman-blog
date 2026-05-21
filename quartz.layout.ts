import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    Component.Comments({
      provider: 'giscus',
      options: {
        // from data-repo
        repo: 'sSeongJae91/rockettttman-blog',
        // from data-repo-id
        repoId: 'R_kgDOPhAfVQ',
        // from data-category
        category: 'Announcements',
        // from data-category-id
        categoryId: 'DIC_kwDOPhAfVc4CuYqV',
        // from data-lang
        lang: 'ko',
        mapping: "pathname",        // URL 경로 기반 (안정적)
        strict: true,              // 정확한 매칭만 허용 (안전)
        reactionsEnabled: true,    // 이모지 반응 허용 (상호작용 증대)
      }
    }),
  ],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/sSeongJae91",
      Notion: "https://www.notion.so/Jeong-SeongJae-2f58d50c71934f6d8ebfa49a4063fb3e",
      Instagram: "https://www.instagram.com/rockettttman/",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  afterBody: [
    Component.ConditionalRender({
      component: Component.RecentNotes({
        title: "최근 포스트",
        limit: 5,
        showTags: false,
        filter: (f) => {
          // index와 about 페이지는 제외
          return f.slug !== "index" && f.slug !== "about"
        },
      }),
      condition: (page) => page.fileData.slug === "index",
    }),
    // giscus 댓글은 모든 콘텐츠 페이지에 표시
    Component.Comments({
      provider: 'giscus',
      options: {
        repo: 'sSeongJae91/rockettttman-blog',
        repoId: 'R_kgDOPhAfVQ',
        category: 'Announcements',
        categoryId: 'DIC_kwDOPhAfVc4CuYqV',
        lang: 'ko',
        mapping: "pathname",
        strict: true,
        reactionsEnabled: true,
      }
    }),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  afterBody: [],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [],
}
