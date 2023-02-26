import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module.js'
import { dbUtil } from './db_util.js'
import { CONFIG_OTHER } from './server_config.js'
import { dataDeltaUtil } from './data_delta_util.js'

async function bootstrap() {
  const logger = new Logger('bootstrap')

  try {
    debugger
    const dataDelta = await dataDeltaUtil.get()
    if (privateUtil.isEmptyArraysObject(dataDelta)) {
      logger.debug('No initial data received.')
    } else {
      logger.debug('Initial data is received.')
      await dbUtil.recreateTables()
      logger.debug('Tables recreated.')
      await dataDeltaUtil.updateTables(dataDelta)
      logger.debug('Initial data is inserted into tables.')
    }
  } catch (error) {
    logger.debug('Initialization failed.')
    console.error(error)
  }

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

const privateUtil = {
  isEmptyArraysObject(arraysObj: Record<string, unknown[]>): boolean {
    for (const array of Object.values(arraysObj)) {
      if (array.length > 0) return false
    }
    return true
  }
}
