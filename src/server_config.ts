
// Этот конфиг заполняется для локального запуска, например из VS Code, с
// локальной бд. Для запуска, например, на сайте render.com вместо этого
// нужно прописать в настройках на сайте process.env['DATABASE_URL']
export const CONFIG_LOCAL_DB = Object.freeze({
  db_user: 'postgres',
  db_password: '12345678',
  db_host: 'localhost',
  db_port: 5432,
  db_database: 'taskamocrm',
} as const)

interface ConfigAmoI {
  hostname: string
  // Взять с сайта amocrm.ru: ID интеграции.
  client_id: string
  // Взять с сайта amocrm.ru: Секретный ключ.
  client_secret: string
  // Взять с сайта amocrm.ru: Код авторизации (действителен 20 минут).
  code: string
  // Взять с сайта amocrm.ru: Ссылка для перенаправления.
  redirect_uri: string
  // Путь к папке, где хранятся файлы с access и refresh токенами.
  token_path: string
}

// Для того, чтобы отдельно запускать сервер из среды разработки и из других
// сред, можно указать разные параметры интеграций (описание параметров
// указано выше в interface ConfigAmoI):
export const CONFIG_AMO: ConfigAmoI = process.env['IS_PRODUCTION'] 
// Интеграция для среды, где указан process.env['IS_PRODUCTION'].
? Object.freeze({
  hostname: 'maildifferent2.amocrm.ru',
  client_id: '96af5226-efc1-4416-addd-0daba978649c',
  client_secret: 'OYViFBKEw0eRzME7tGCGQ13YkwWUxWTeeJF5jH5ZYELOFfJmier4LbsYb1UPwNFf',
  code: 'def502005dd89c962f0b48aeb0cc84c27da78ad4861124c7f0095148ddc3133dfc259f8ab7bb13a5910e2710a472c1c19c14fa37eda356ff8be2a594ae5a22add8f83ec01d27bc6dd6e10de51797c863a120105953b44d7727b60195bbf280960faf0785e4aff78f9c89922da8b54346d28f2564fe600e06663a0c6867f8bef4c098b9396eec6276b583bd730447df01043b88fa1f8e5bd00b3a39a868555bf8c41cf03f055f401d36f990cad27d71ea2e8ac91aa415c384d7ba1380a4f8da68da28f7dd0c75fc5e99f970822fa99b324f81c91cc6b9c684edf4b4ea73638812c70da8c4b13f8af68e11e631445f9a940d2e0a7f2af89f4e70069c6edf4b798af5a0116ffd68f53697f19fd237efe17d42a29c9aafc16255dbf0ba82442e4253e0d6c586ebf5c7c1b2245aab6edbbcb4b645372b55013b30f4f1206433993ca0d1e6eb4b6154ae56369c2fc226e7e12bbd4321e6f4ce59e04be8521f0644c4a5aa80585ed017bbaf40a9b48f907887a587f59028c4e14d7eab30fc4588f7d3cffd7b93872b792563dc4cc6ffaff5923a1a44b3a66c4e38554296c63c60c840acf8e6306335b1a6d0f101d0ffe51a9a959d89cc6f571b8edbe11e4e623b0f4e9b9db063ac1a7157bcbc6675bd3b816078af8406c51a14363f4aeb096d6e7e870567681590be9ec06c40597c5142',
  redirect_uri: 'https://task-amocrm-rocket-serv.onrender.com',
  token_path: '/etc/secrets',
} as const)
// Для локального запуска, например, из VS Code, надо заполнить только эту
// часть конфига.
: Object.freeze({
  hostname: 'maildifferent2.amocrm.ru',
  client_id: '5066b2c0-8266-4a39-b916-e083831b8d4d',
  client_secret: 'cI4P3RVnypj3Vtvj1xQ7NSGlqNxqwufu6LdLiTiVCFUwPPagmSxTdkJwbCINOgSr',
  code: 'def50200340c22a5e0e5592151de4fc6518b61dad1952951637929e0b0a436ea19c16bfd25cafd61452e95e61af4bece18008b969281ce12d5131f5cea71f54b11675438654c20c26aa0e97bfe2ad55dc60f14a911ec9d11b6e108295ac7d340fa22e427401fce1b39201a90b40ee60a57947fe1617bbb0b540131b9bc8d1eb0b913d59d8fc7f9a845b030b777b69fe82eb8919e7700acfc298e62872d90a0599c177ffc335c7e966db42149363daa9af5808eaf3d17c9ece102e18fe57b64a93c8bf916fa2b235e8c83d896afae09570b1a8703eb53937006a9f090c7a0b02692db4affc3e4584a617ac5029d268daf43477e440c035bc2b31c132b53e3872f9773219d0ca39b1db551c47349946cc89c2284f4915a09b34bd7927aa7393c03493d811d9d6ea89dc5bdeb80f9df9efb8be879e2fde1db248adf9b98d5e141950df1418a2a02f8b5498be7e94f677d309fdeb7ccf0789cc4a76f8312f79f5d54f6dd974b136dff5c62841ad08d17ece7305d73e640da688b100ad116d1daf63a29a105ee10f6006cc03043f8191a7325151c2f02536f9113f6089835769768773ddb24ec848e40dd372310191573239760259c0f33ef0a4a24d970b7742caa62866c5096d72590e81dfb0cd0d8a33a409ef626d01d348b4c4def6fe355dff88cbff265b9ce6fcf838e97f6af17',
  redirect_uri: 'https://task-amocrm-rocket-serv.onrender.com',
  token_path: './etc/secrets_dev',
} as const)

export const CONFIG_OTHER = Object.freeze({
  port: process.env['PORT'] || 3000
})
