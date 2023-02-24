import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module.js'
import { dbUtil } from './db_util.js'
import { CONFIG_OTHER } from './server_config.js'
import { util } from './util.js'

async function bootstrap() {
  const logger = new Logger('bootstrap')
  await dbUtil.recreateTables()
  logger.debug('Tables recreated.')
  await util.getDataDeltaAndUpdateTables()
  logger.debug('Initial data is received and inserted into tables.')
  const app = await NestFactory.create(AppModule)
  app.enableCors({
    origin: ['*'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
  })
  await app.listen(CONFIG_OTHER.port)
  console.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap()
