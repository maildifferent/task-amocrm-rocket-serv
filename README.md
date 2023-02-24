
Инструкция по запуску:
1) Если запускаем с локальной базой данных, то в файле server_config.ts
необходимо указать её параметры.
2) Если запускаем на сайте, например, render.com
то нужно прописать в настройках на сайте process.env['DATABASE_URL']
3) В файле server_config.ts нужно прописать параметры учетной записи amoCrm.
4) В файле amo_token_refresh.json прописать refresh token из amoCrm. Флаг
incorrect_token_flag в этом файле надо указать false.
5) В файле amo_token_access.json можно прописать access token от amoCrm. Этот
шаг является необязательным, если access token не указан, либо указан неверно,
то программа сама попытается запросить новый access token при помощи refresh
token.
6) Порядок запуска обычный для шаблонов NestJS (список команд ниже).
7) Если запускаем локально, то результат можно увидеть, запустив в браузере
http://localhost:3000

Важно:
- При запуске, если таблицы уже созданы в бд, то они будут удалены. При
каждом запуске таблицы пересоздаются заново. Параметры таблиц можно
посмотреть в файле db_tabs_create.sql

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
