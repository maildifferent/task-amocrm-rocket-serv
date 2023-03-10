
Инструкция по запуску:
1) Если запускаем с локальной базой данных, то в файле server_config.ts
необходимо указать её параметры.
2) Если запускаем на сайте, например, render.com
то нужно прописать в настройках на сайте process.env['DATABASE_URL']
3) В файле server_config.ts нужно прописать параметры учетной записи amoCrm.
4) В файле amo_token.json прописать refresh token из amoCrm. Флаг
incorrect_token_flag в этом файле надо указать false. Программа поменяет
его на true, если не сможет получить новый access token с этим refresh
token-ом. В этом же файле можно прописать access token от amoCrm. Этот
шаг является необязательным, если access token не указан, либо указан неверно,
то программа сама попытается запросить новый access token при помощи refresh
token.
5) Порядок запуска в VS Code обычный для шаблонов NestJS (список команд ниже).
6) Если запускаем локально, то результат можно увидеть, запустив в браузере
http://localhost:3000

Важно:
- При запуске, если таблицы уже созданы в бд, то они будут удалены. При
каждом запуске таблицы пересоздаются заново. Параметры таблиц можно
посмотреть в файле db_tabs_create.sql
- Клиентская часть в минифицированном виде находится в папке dist_ext. 
Исходники клиентской части можно посмотреть в отдельном репозитории.

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
