import { Body, Query, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { LeadService } from './lead.service.js'
import { amoUtil } from '../amo_util.js'
import { DataDeltaI } from '../data_util.js'

@Controller({ path: 'api/lead' })
export class LeadController {
  constructor(private readonly leadService: LeadService) { }

  @Get()
  async read(@Query() q: { query: unknown }): Promise<{ leadIds: number[] } | DataDeltaI> {
    try {
      if (q.query !== undefined) {
        let query = ''
        if (typeof q.query === 'string') query = q.query
        const { amo_lead } = await amoUtil.getLead({ query })
        const leadIds = amo_lead.map((lead) => lead.id)
        return { leadIds }
      } else {
        return await this.leadService.read()
      }
    } catch (error) {
      console.error(error)
    }
  }

  @Get('*')
  badRequest() {
    return { statusText: 'Bad request.' }
  }
}