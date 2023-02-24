import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { ScheduleModule } from '@nestjs/schedule'
import { LeadModule } from './lead/lead.module.js'
import url from 'node:url'
import { TaskModule } from './task/task.module.js'

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: url.fileURLToPath('file://' + new URL('../dist_ext/', import.meta.url).pathname),
      exclude: ['/api*'],
    }),
    ScheduleModule.forRoot(),
    LeadModule,
    TaskModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
