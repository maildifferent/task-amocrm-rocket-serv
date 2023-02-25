import { Body, Query, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { LeadService } from './lead.service.js'
import { LeadReadI } from './interface/lead.read.interface.js'
import { amoUtil } from '../amo_util.js'

@Controller({ path: 'api/lead' })
export class LeadController {
  constructor(private readonly leadService: LeadService) { }

  @Get()
  async read(@Query() q: { query: unknown }): Promise<{ leadIds: number[] } | LeadReadI> {
    try {
      if (q.query !== undefined) {
        let query = ''
        if (typeof q.query === 'string') query = q.query
        const { leads } = await amoUtil.getLeadQuery(query)
        const leadIds = leads.map((lead) => lead.id)
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
    return { status: 'Bad request.' }
  }
}