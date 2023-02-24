
// Для запуска, например, на сайте render.com
// нужно прописать в настройках на сайте process.env['DATABASE_URL']
export const CONFIG_LOCAL_DB = Object.freeze({
  db_user: 'postgres',
  db_password: '12345678',
  db_host: 'localhost',
  db_port: 5432,
  db_database: 'taskamocrm',
} as const)

export const CONFIG_AMO = Object.freeze({
  hostname: 'maildifferent2.amocrm.ru',
  client_id: '405977bc-10a0-40ca-8bb2-8333f586bdc4',
  client_secret: 'WL9ujQ1qP67mCZJZKVpmSxsXm2t2IKLeImsEna8uiOW4uM3tss9u4JPDuw81nSOc',
  code: 'def502003d5b37aa2792dd187622495117c91e9c9400426c35f7c97f5beb879f5740c0a207eba8a6e78fc5995c20b1ebce86c85835559a979638b4524d0a62873e5a230a5f4fd88bdfcf9f02bb8371c088246b99b3504df4d035179c0a000de0ad26432f6bf6b90d4ee8ef0124f89ba836c5a7b768808d687a5df93dec135870eb6eaab908ec600b692f1ab98a2488696ea398b19859ad31c6cc10072c07034df439bdbfe23bcc11ef5da58de4212596b414ef215f0cd3dc54f38f2b3541f5661fef2a87eed591ac91b88d927d021a61bf97e9224152d0d8fe0133c7bb64bed599ef556998e48d9268a8dc7eec457e696b77fbac30a5a7bfc4749da7e7ca793a8c0c3d6e507336adb724373404d3eb0120e17070443a0eb5672e7f88e474894297e6e4b3a6bab0ea6a1f322e38a5a6423214b875e3df8b71c6f1c10045044b231ad618983246fbf4a7d1c8783539a5a27d86054b288a3c0ff2fc05665716f1f0ee8ed70562bfc0de57ed3ad7f60c6173cd2020dc707912698393b88e4085fbe7bf6c81612be7752f8313eed3998a11b9125d6174a1e8a361283f7ae2f8eff061ad94973156d06e792b1bec210f92ab50fcae0994960477ce17bd7b097e90fd1b9a4ea98feaa7b95a43483dded7bed71346cc3d7a654f7d37ef5189c12d25f09f0089b02ebe5826dfa10a',
  redirect_uri: 'https://task-amocrm-rocket.onrender.com/',
} as const)

export const CONFIG_OTHER = Object.freeze({
  port: process.env['PORT'] || 3000
})
