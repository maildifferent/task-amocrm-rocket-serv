import { Module } from '@nestjs/common'
import { TaskService } from './task.service.js'

@Module({
  providers: [TaskService],
})

export class TaskModule { }