import { AmoLeadT, AmoLinkT, AmoContactT, AmoCustomFieldT, AmoStatusT, AmoUserT } from 'src/db_interface.js'

export interface LeadReadI {
  amo_lead: AmoLeadT[]
  entity_link: AmoLinkT[]
  amo_contact: AmoContactT[]
  contact_custom_field: AmoCustomFieldT[]
  pipeline_status: AmoStatusT[]
  responsible_user: AmoUserT[]
}
