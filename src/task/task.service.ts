import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule'
import { dataUtil } from '../data_util.js'

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  // @Cron(CronExpression.EVERY_10_MINUTES)
  @Cron('0 */5 * * * *') // Every 5 mins.
  // @Cron('*/1 * * * *') // Every 1 min.
  // @Cron(CronExpression.EVERY_30_SECONDS)
  async handleCron() {
    try {
      await dataUtil.getAllFromAmoAndUpdateTables()
      // this.logger.debug('Data synced (every 5 mins).')
    } catch (error) {
      console.error(error)
    }
  }
}