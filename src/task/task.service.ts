import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule'
import { util } from '../util.js'

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  // @Cron(CronExpression.EVERY_10_MINUTES)
  @Cron('0 */5 * * * *') // Every 5 mins.
  // @Cron('*/1 * * * *') // Every 1 min.
  // @Cron(CronExpression.EVERY_30_SECONDS)
  async handleCron() {
    await util.getDataDeltaAndUpdateTables()
    // this.logger.debug('Data synced (every 5 mins).')
  }
}