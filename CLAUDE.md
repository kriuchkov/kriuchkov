# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Что это за репозиторий

`kriuchkov/kriuchkov` выполняет две роли одновременно:

1. **Профильный README на GitHub** — `README.md` и SVG-карточки со статистикой в `assets/` отображаются на странице профиля. Карточки перегенерируются ежедневно воркфлоу `.github/workflows/stats.yml` (запускает `scripts/generate_stats.py` и коммитит от имени `github-actions[bot]`). Файлы `assets/*.svg` руками не править.
2. **Персональный сайт (kriuchkov.com)** — статический сайт на Nuxt 4, деплоится на GitHub Pages воркфлоу `.github/workflows/deploy.yml` при каждом пуше в `master`.

## Команды

Пакетный менеджер в CI — Bun (`bun.lock` — источник истины; `package-lock.json` остался от старой настройки и не актуален). Nuxt 4.6 требует Node `^22.21.0 || ^24.11.0 || >=26`; на более старом Node сборка работает, но с предупреждением. В CI Node 24 задаётся в `deploy.yml`.

```bash
bun install          # через postinstall также выполняет `nuxt prepare` (создаёт .nuxt/)
bun run dev          # дев-сервер с HMR
bun run generate     # статическая сборка в .output/public — именно её деплоит CI
bun run build        # SSR-сборка (для деплоя не используется)
bun run preview      # отдать последнюю сборку
npx eslint .         # линт (конфиг берётся из @nuxt/eslint через .nuxt/eslint.config.mjs)
npx vue-tsc --noEmit # проверка типов; также выполняется при сборке, т.к. включён typescript.typeCheck
```

Тестов нет. `@nuxt/test-utils` установлен, но ни одного теста в репозитории не существует.

Перегенерировать карточки статистики локально (нужен GitHub-токен в окружении):

```bash
GITHUB_TOKEN=... python3 scripts/generate_stats.py
```

## Архитектура сайта

Контент-ориентированное приложение на Nuxt 4: `@nuxt/content` v3 превращает Markdown из `content/` в типизированные коллекции; страницы запрашивают их через `queryCollection()` и рендерят тело через `<ContentRenderer>`. Всё пререндерится (`nitro.static: true`, пресет `github_pages`).

### Коллекции (`content.config.ts`)

| Коллекция | Источник | Обязательный frontmatter | Примечания |
|---|---|---|---|
| `blog` | `content/blog/**/*.md` | `date`, `description` | Раскладка `blog/YYYY/MM/slug.md` — просто соглашение; сайдбар группирует по `date`. Опционально `source` (ссылка на внешний первоисточник). |
| `projects` | `content/projects/*.md` | — | `sort` задаёт порядок (ASC). `image`, `link`, `license`, `stack` опциональны. |
| `ai` | `content/ai/**/*.md` | `title`, `description` | Плоский список. |

Добавить контент = добавить Markdown-файл с нужным frontmatter; код менять не нужно, если не меняется схема.

### Страницы → секции → UI-компоненты

- `pages/index.vue` забирает последние элементы из всех трёх коллекций и передаёт их в `components/sections/*` (Hero, FeaturedProjects, AiSection, LatestPosts).
- `components/ui/*` — общие примитивы в стиле «терминал/киберпанк» (`TerminalSectionHeader`, `TerminalPostCard`, `ProjectCard`, `FloatingToc`, `ContentHash`, `ThemeToggle`, …). У каждого раздела свой акцентный цвет (blog = pink, projects = green/blue, ai = purple), передаётся пропом `color` — при добавлении страниц сохранять это соответствие.
- `components/content/ProseImg.vue` переопределяет рендер Markdown-`<img>`: использует `<NuxtImg>` и добавляет `app.baseURL` к абсолютным путям. Картинки для Markdown лежат в `public/images/...`.
- Имена автоимпортируемых компонентов включают префикс папки: `components/sections/HeroSection.vue` → `<SectionsHeroSection>`, `components/ui/ProjectCard.vue` → `<UiProjectCard>`, `components/app/Header.vue` → `<AppHeader>`.

### Общие настройки сайта

- `app.config.ts` содержит тексты профиля, SEO-ключевые слова и соцссылки; читать через `useAppConfig()`, а не хардкодить.
- Тёмная тема — по классу (`@nuxtjs/color-mode`, `classSuffix: ''`, по умолчанию dark). Tailwind настроен в `tailwind.config.ts` с `@tailwindcss/typography`; оформление prose на страницах статей задаётся inline через модификаторы `prose-*` в шаблонах.
- Иконки: `@nuxt/icon`, на сервере бандлятся `heroicons`, `heroicons-outline`, `heroicons-solid`, `simple-icons`; использовать `<Icon name="heroicons:...">`.
- Темы подсветки синтаксиса и предзагружаемые языки заданы в `content.build.markdown.highlight` в `nuxt.config.ts` — если новый пост использует язык, который рендерится без подсветки, добавить его туда.

## Подводные камни

- `@nuxtjs/i18n` есть в зависимостях, но **не** подключён как модуль; i18n-роутинга нет.
- `dist` — симлинк на `.output/public`; оба в .gitignore.
- Для работы ESLint и TypeScript нужна папка `.nuxt/` (создаётся через `bun install` или `npx nuxt prepare`).
- Название бренда написано по-разному: в `app.vue` (titleTemplate) и в футере `layouts/default.vue` — `KRIUCKOV`, а в `app.config.ts` — `KRIUCHKOV.COM`. Перед унификацией спросить.
