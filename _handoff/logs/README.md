# Логи

| Файл | Что это |
|---|---|
| `npm-install-initial.txt` | Хвост первого `npm install` (21.10.2026) — уже тогда 14 уязвимостей |
| `npm-audit-2026-10-22.txt` / `.json` | Полный `npm audit` на момент передачи: next 15.5.4 (critical; фикс 15.5.28 в той же ветке), nodemailer ≤10.0.5, sharp ≤0.35.5-rc.1, postcss (внутри next), deepmerge-ts (через prisma) |
| `npm-audit-2026-10-22-after-upgrade.txt` / `.json` | `npm audit` после обновления (next 15.5.28, sharp 0.35.5, nodemailer 10.2.0): 12 уязвимостей (9 high, 3 moderate), только инструменты сборки — Tailwind 3, CLI Prisma, postcss внутри Next |
| `prod-server-3100-*.output.txt` | Фоновые `npx next start -p 3100` для аудитов/экспорта. Все `✓ Ready` без ошибок; `[exited with code 1]` — результат принудительного `taskkill /F`, которым я останавливал сервер перед пересборкой. Это НЕ падение. |
| `lighthouse-run1-default-throttling.txt` | Первые прогоны Lighthouse (дефолтный 4× CPU). ВНИМАНИЕ: строка про /hy там повторяет первый прогон (lh-hy.json не перезаписался) — актуальные цифры в HANDOFF.md §8 |
| `curl-dev-check.txt` | Проверка ответа dev-сервера (200, ~12 c на первую компиляцию) |
| `dev-font-spread-error.txt` | Ошибка `Unexpected spread` в next/font и ошибка гидрации чисел — обе исправлены |
| `empty-task-output.txt` | Пустой вывод одной фоновой задачи (оставлен для полноты) |
