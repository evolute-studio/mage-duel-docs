---
sidebar_position: 2
---

# Запуск білда

Для запуску білда треба Next.js обгортка. Треба склонувати репозиторій з веб додатком: 

https://github.com/evolute-studio/mage-duel-webgl.

## Перенесення білда
Відкрийте папку з готовим білдом, який ви зробили в попередньому кроці, виберіть і скопіюйте три папки:

- Build
- StreamingAssets
- TemplateData

Відкрийте папку `mage-duel-webgl/public` у склонованому репозиторію і видаліть папки з такими самими назвами і вставте скопійовані файли сюди. 

## Версія білда в проекті

Відкрийте файл `mage-duel-webgl/components/UnityPlayer.tsx` і знайдіть у функції **UnityPlayer** `const version = "x.y.z"` і замініть на свою версію.

Також для коректної роботи треба змінити версію Service Worker. Його можна знайти за шляхом `mage-duel-webgl/public/sw.js`. На початку файлу знайдіть `const CACHE` і змініть версію кешу на свою.

## Налаштування змінних середовища

Відкрийте файл `mage-duel-webgl/.env.local` і встановіть данні вашого серверу:
```js title="mage-duel-webgl/.env.local"
NEXT_PUBLIC_RPC="http://localhost:5050" // local or slot katana 
NEXT_PUBLIC_TORII="http://localhost:8080" // local or slot torii
NEXT_PUBLIC_SLOT_PROJECT="KATANA" // під час міграції ви можете подивить назву chain id
NEXT_PUBLIC_GAME_ADDRESS="0x04202a9fbb17db7d04a92f3182cef8dd339a7aff995a9fd5fa04afd087cb69d6" // адрес контракту 
NEXT_PUBLIC_PLAYER_PROFILE_ADDRESS="0x04a1dc47e42dd54e5fbf54d7fe016900ebcfde4df06910457f7b6e15112707f3" // адрес контракту 
NEXT_PUBLIC_WORLD_ADDRESS="0x055a227da2ac221a6311ec2df35df5c6fc25b450696f6c68bb604c8c350d59b7" // адрес світу
NEXT_PUBLIC_SLOT_DATA_VERSION=28 // при підвищенні, автоматично стирає данні клієнта в сховищі
```

## Запуск

Для початку встановіть [pnpm](https://pnpm.io/installation). Далі треба встановити залежності командою:
```bash
pnpm install
```
Після встановлення залежностей, додаток можна запустити командою:
```bash
pnpm dev
```
Далі перейдіть за локальним адресом, який вивевся в терміналі. (по дефолту https://localhost:3000)
:::note
https з'єднання потрібне для роботи [Cartridge Controller]("https://cartridge.gg/controller")
:::