import { Injectable } from '@nestjs/common'
import { AmoContactT, AmoCustomFieldT, AmoLeadT, AmoLinkT, AmoStatusT, AmoUserT } from '../db_interface.js'
import { pgPool } from '../db_util.js'
import { LeadReadI } from './interface/lead.read.interface.js'

@Injectable()
export class LeadService {
  async read(): Promise<LeadReadI> {
    const client = await pgPool.connect()
    
    try {
      const amo_lead = await client.query<AmoLeadT>('SELECT * FROM amo_lead')
      const entity_link = await client.query<AmoLinkT>('SELECT * FROM entity_link')
      const amo_contact = await client.query<AmoContactT>('SELECT * FROM amo_contact')
      const contact_custom_field = await client.query<AmoCustomFieldT>('SELECT * FROM contact_custom_field')
      const pipeline_status = await client.query<AmoStatusT>('SELECT * FROM pipeline_status')
      const responsible_user = await client.query<AmoUserT>('SELECT * FROM responsible_user')
      
      return {
        amo_lead: amo_lead.rows,
        entity_link: entity_link.rows,
        amo_contact: amo_contact.rows,
        contact_custom_field: contact_custom_field.rows,
        pipeline_status: pipeline_status.rows,
        responsible_user: responsible_user.rows
      }
    } catch (error) {
      console.log(error)
      throw error
    } finally {
      client.release()
    }
  }
}