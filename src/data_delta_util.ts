import { amoUtil } from './amo_util.js'
import { amoContactDomSchema, AmoContactT, amoCustomFieldDomSchema, AmoCustomFieldT, amoLeadDomSchema, AmoLeadT, amoLinkDomSchema, AmoLinkT, amoStatusDomSchema, AmoStatusT, amoUserDomSchema, AmoUserT } from './db_interface.js'
import { dbUtil } from './db_util.js'

type DataDeltaI = {
  contacts: AmoContactT[]
  customFields: AmoCustomFieldT[]
  leads: AmoLeadT[]
  links: AmoLinkT[]
  statuses: AmoStatusT[]
  users: AmoUserT[]
}

let lastSyncTimer = 0

export const dataDeltaUtil = {
  async get(): Promise<DataDeltaI> {
    const startTimer = Date.now()
    const lastSyncSecs = Math.floor(lastSyncTimer / 1000)
    const { contacts, customFields } = await amoUtil.getContact(lastSyncSecs)
    const { leads } = await amoUtil.getLead({ updatedAtFrom: lastSyncSecs })
    const { links } = await amoUtil.getLink(leads.map((lead) => lead.id))
    const { statuses } = await amoUtil.getPipeline()
    const { users } = await amoUtil.getUser()
    lastSyncTimer = startTimer
    return { contacts, customFields, leads, links, statuses, users }
  },

  async updateTables(dataDelta: DataDeltaI): Promise<void> {
    await dbUtil.upsert([
      { tabName: 'amo_contact', domSchema: amoContactDomSchema, docs: dataDelta.contacts },
      { tabName: 'contact_custom_field', domSchema: amoCustomFieldDomSchema, docs: dataDelta.customFields },
      { tabName: 'amo_lead', domSchema: amoLeadDomSchema, docs: dataDelta.leads },
      { tabName: 'entity_link', domSchema: amoLinkDomSchema, docs: dataDelta.links },
      { tabName: 'pipeline_status', domSchema: amoStatusDomSchema, docs: dataDelta.statuses },
      { tabName: 'responsible_user', domSchema: amoUserDomSchema, docs: dataDelta.users },
    ])
  },

  async getAndUpdateTables() {
    const dataDelta = await dataDeltaUtil.get()
    await dataDeltaUtil.updateTables(dataDelta)
  },
}
