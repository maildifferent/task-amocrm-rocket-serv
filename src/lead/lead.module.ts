import { Module } from '@nestjs/common'
import { LeadController } from './lead.controller.js'
import { LeadService } from './lead.service.js'

@Module({
  imports: [],
  controllers: [LeadController],
  providers: [LeadService],
})

export class LeadModule { }