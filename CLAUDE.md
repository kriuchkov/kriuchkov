# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Что это за репозиторий

`kriuchkov/kriuchkov` выполняет две роли одновременно:

1. **Профильный README на GitHub** — `README.md` и SVG-карточки со статистикой в `assets/` отображаются на странице профиля. Карточки перегенерируются ежедневно воркфлоу `.github/workflows/stats.yml` (запускает `scripts/generate_stats.py` и коммитит от имени `github-actions[bot]`). Тот же скрипт пишет `assets/stats.json`, из которого сайт берёт панель «gh stats». Файлы `assets/*.svg` и `assets/stats.json` руками не править.
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
| `blog` | `content/blog/**/*.md` | `date`, `description` | Раскладка `blog/YYYY/MM/slug.md` — просто соглашение; список группирует по году из `date`. `tags` — фильтр на экране writing, первый тег показывается в строке. Опционально `source` (ссылка на первоисточник) и `externalUrl`. |
| `projects` | `content/projects/*.md` | — | `sort` задаёт порядок (ASC). Имя в интерфейсе — имя файла. Первый элемент `stack` даёт фильтр по языку. `features` и `install` заполняют панель details; без `install` показывается `git clone` по `link`. Тело Markdown сейчас нигде не рендерится. |
| `ai` | `content/ai/**/*.md` | `title`, `description` | Плоский список, `tags` как у `blog` (по умолчанию `ai`). |

Добавить контент = добавить Markdown-файл с нужным frontmatter; код менять не нужно, если не меняется схема.

### Дизайн «TUI»: страницы и компоненты

Сайт оформлен как терминальное приложение: вкладки сверху, панели с заголовком на рамке, строка статуса снизу, управление с клавиатуры. Макеты лежат на холсте «tui» в claude.ai.

- `layouts/default.vue` — каркас: `TuiTabBar` (вкладки 1–4, поиск, тема, клавиши), `<main>`, `TuiStatusLine`, `TuiBottomTabs` (нижние вкладки на телефоне) и оверлеи `TuiSearch` и `TuiHelp`. Глобальные клавиши регистрируются здесь.
- `components/tui/*` — `Pane` (рамка с заголовком; пропсы `list`, `focused`, `tone`), `Writing` (общий экран для `/blog` и `/ai`), `Article` (экран чтения для постов и AI-заметок), оверлеи и части каркаса.
- Страницы: `pages/index.vue` (whoami, gh stats, проекты с превью, тексты), `pages/projects/index.vue` (список и details), `pages/blog/index.vue` и `pages/ai/index.vue` (оба рендерят `<TuiWriting>`), `pages/{blog,ai}/[...slug].vue` (рендерят `<TuiArticle>`), `error.vue` (404 с подсказками; для старых `/academy/...` отдельный текст).
- Состояние в адресе: `/projects?p=<имя>&lang=<язык>`, `/blog?src=posts&tag=<тег>`, `/ai?tag=<тег>`. Пререндер собирается без query, поэтому query применяется только после гидратации (`useHydratedFlag()` в `composables/useTui.ts`).
- `composables/useTui.ts`: строка статуса (страница описывает её через `useStatusLine(() => ({ mode, path, hints, right, progress }))`), оверлей, флаг однобуквенных клавиш, копирование с сообщением в строке статуса, переключение темы.
- `composables/useHotkeys.ts` и `plugins/hotkeys.client.ts`: один слушатель `keydown` и слои клавиш по приоритету (глобальные 0, страница 10, оверлей 100; модальный слой глушит остальные). Имена клавиш — `KeyboardEvent.key`, плюс `gg`. Клавиши не срабатывают в полях ввода и с модификаторами. Однобуквенные можно выключить в справке, выбор хранится в `localStorage`.
- `composables/useTuiIndex.ts` — общий индекс всех коллекций для поиска, 404 и счётчиков. Загружается с `await` в `app.vue` и `error.vue`, остальные берут его из кеша `useAsyncData`.
- `utils/tui.ts` — мелкие помощники (имя по пути, строка стека, счёт слов, полоски █░, вкладки `TUI_TABS`).
- `components/content/ProsePre.vue` рисует блоки кода в Markdown с подписью языка на рамке и кнопкой копирования. `ProseImg.vue` использует `<NuxtImg>` и добавляет `app.baseURL` к абсолютным путям. Картинки для Markdown лежат в `public/images/...`.
- Имена автоимпортируемых компонентов включают префикс папки: `components/tui/Pane.vue` → `<TuiPane>`.

### Общие настройки сайта

- `app.config.ts` содержит тексты профиля, SEO-ключевые слова и соцссылки; читать через `useAppConfig()`, а не хардкодить.
- Все стили TUI — в `assets/css/main.css`: цвета заданы CSS-переменными (`--bg`, `--fg`, `--accent`, `--key` и т. д.) для `html.dark` и `html.light`, классы `tui-*` описывают панели, строки, оверлеи и оформление статей (`.tui-prose`). Tailwind подключает этот файл через `tailwindcss.cssPath`; утилиты Tailwind почти не используются. Тема переключается классом (`@nuxtjs/color-mode`, `classSuffix: ''`, по умолчанию dark).
- Шрифт один — JetBrains Mono, его скачивает `@nuxt/fonts` при сборке (нужен доступ в сеть).
- Брейкпоинты: от 1100px боковая и основная колонки, ниже панели переносятся, ниже 960px оглавление статьи сворачивается в `<details>`, ниже 720px одна колонка и нижние вкладки.
- Иконки: `@nuxt/icon` подключён, но в TUI-дизайне не используется; немногие иконки на телефоне — инлайновые SVG.
- Темы подсветки синтаксиса и предзагружаемые языки заданы в `content.build.markdown.highlight` в `nuxt.config.ts` — если новый пост использует язык, который рендерится без подсветки, добавить его туда.

## Подводные камни

- `@nuxtjs/i18n` есть в зависимостях, но **не** подключён как модуль; i18n-роутинга нет.
- `dist` — симлинк на `.output/public`; оба в .gitignore.
- Для работы ESLint и TypeScript нужна папка `.nuxt/` (создаётся через `bun install` или `npx nuxt prepare`).
- Строка статуса рисуется в раскладке раньше, чем асинхронная страница успевает её заполнить на сервере. Поэтому до монтирования она показывает только режим по адресу (`modeForPath`), а данные страницы появляются после гидратации. Не убирать `useMountedFlag()` в `TuiStatusLine` и раскладке, иначе вернутся рассинхроны гидратации.
- Неизвестные адреса GitHub Pages отдаёт как `404.html`; это SPA-заглушка, и `error.vue` рендерится на клиенте. Ошибка `NUXT_E1005` в консоли на таких адресах ожидаема.
- Название бренда написано по-разному: в `app.vue` (titleTemplate) — `KRIUCKOV.COM`, в `app.config.ts` — `KRIUCHKOV.COM`, в логотипе вкладок — `kriuchkov@web`. Перед унификацией спросить.
