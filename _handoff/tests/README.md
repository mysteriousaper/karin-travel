# Проверка офлайн-копии (puppeteer-core)

Скрипты запускались из отдельной папки (не из проекта), где выполнено `npm i puppeteer-core@23.11.1`,
с системным Chrome `C:/Program Files/Google/Chrome/Application/chrome.exe`.

- `test.mjs` — открывает `Open Karin website (offline).html` с диска, проверяет: шрифты, битые картинки,
  переключение слайда, смену валюты на USD, переход по меню, смену языка, открытие тура, отправку формы
  (ожидается «Request sent» + оранжевый тост «Offline preview…»), собирает ошибки консоли/сети.
  Последний результат: все шаги успешны, **errors: 0**.
- `test2.mjs` — после фикса слайдера: все 5 фото героя загружены, клик по миниатюре «Պրահա» показывает
  `../images/prague-1.jpg`; скриншоты героя и блока How to book. **errors: 0**.

Запуск:
```
npm i puppeteer-core@23.11.1
node test.mjs
```
