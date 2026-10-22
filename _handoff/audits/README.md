# Аудиты Lighthouse

Файлы `lh-cal-*.json` — Lighthouse 12.8.2, мобильный профиль, `--throttling.cpuSlowdownMultiplier=2`
(калибровка под слабый CPU этой машины: benchmarkIndex ~600–850), прод-сборка на http://localhost:3100,
этап 6 (финальный перед добавлением валют/шрифтов). Открыть: https://googlechrome.github.io/lighthouse/viewer/ → перетащить JSON.

| Файл | Perf | A11y | BP | SEO | LCP |
|---|---|---|---|---|---|
| lh-cal-hy.json | 86 | 100 | 100 | 100 | 3.7 s |
| lh-cal-en-tours.json | 84 | 100 | 100 | 100 | 3.9 s |
| lh-cal-en-contacts.json | 90 | 100 | 100 | 100 | 3.2 s |
| lh-cal-ru-services.json | 87 | 100 | 100 | 100 | 3.4 s |
| lh-cal-en-tours-maldives.json | 85 | 100 | 100 | 100 | 3.6 s |

Этап 7 (22.10.2026, Next 15.5.28, только главная, тот же калиброванный режим; SEO 92 — артефакт canonical на :3000):

| Файл | Perf | A11y | BP | SEO | LCP | Прим. |
|---|---|---|---|---|---|---|
| lh-cal-hy-after-upgrade.json | 74 | 100 | 100 | 92 | 6.1 s | слайды грузились сразу после первого фото (регрессия) |
| lh-cal-hy-after-upgrade-fix1.json | 81 | 100 | 100 | 92 | 4.5 s | после переноса догрузки слайдов |
| lh-cal-hy-after-upgrade-fix2.json | 84 | 100 | 100 | 92 | 4.3 s | повторный прогон |

`trace/` — прогон /en/tours с `--save-assets`: `r-0.trace.json` (Chrome trace, открыть в DevTools → Performance),
`r-0.devtoolslog.json`, `r.json`. По трейсу: один Layout ~406 ms на 434 объектах, ImageDecodeTask ~318 ms.

Полная история цифр (включая дефолтный троттлинг и desktop 98) — HANDOFF.md §8.
