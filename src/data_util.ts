import { amoUtil } from './amo_util.js'
import { amoContactDomSchema, AmoContactT, amoCustomFieldDomSchema, AmoCustomFieldT, amoLeadDomSchema, AmoLeadT, amoLinkDomSchema, AmoLinkT, amoStatusDomSchema, AmoStatusT, amoUserDomSchema, AmoUserT } from './db_interface.js'
import { dbUtil, DbUtilArrayCollectionT, DbUtilDomSchemaCollectionT } from './db_util.js'

type TypeCollectionT = {
  amo_lead: AmoLeadT
  entity_link: AmoLinkT
  amo_contact: AmoContactT
  contact_custom_field: AmoCustomFieldT
  pipeline_status: AmoStatusT
  responsible_user: AmoUserT
}

export type DataDeltaI = DbUtilArrayCollectionT<TypeCollectionT>
// {
//   amo_contact: AmoContactT[]
//   contact_custom_field: AmoCustomFieldT[]
//   amo_lead: AmoLeadT[]
//   entity_link: AmoLinkT[]
//   pipeline_status: AmoStatusT[]
//   responsible_user: AmoUserT[]
// }

const domSchemaCollection: DbUtilDomSchemaCollectionT<TypeCollectionT> = {
  amo_lead: amoLeadDomSchema,
  entity_link: amoLinkDomSchema,
  amo_contact: amoContactDomSchema,
  contact_custom_field: amoCustomFieldDomSchema,
  pipeline_status: amoStatusDomSchema,
  responsible_user: amoUserDomSchema,
}

let lastSyncTimer = 0

export const dataUtil = {
  async getAllFromAmo(): Promise<DataDeltaI> {
    const startTimer = Date.now()
    const lastSyncSecs = Math.floor(lastSyncTimer / 1000)
    const { amo_contact, contact_custom_field } = await amoUtil.getContact(lastSyncSecs)
    const { amo_lead } = await amoUtil.getLead({ updatedAtFrom: lastSyncSecs })
    const { entity_link } = await amoUtil.getLink(amo_lead.map((lead) => lead.id))
    const { pipeline_status } = await amoUtil.getPipeline()
    const { responsible_user } = await amoUtil.getUser()
    lastSyncTimer = startTimer
    return { amo_contact, contact_custom_field, amo_lead, entity_link, pipeline_status, responsible_user }
  },

  async readAllFromDb(): Promise<DataDeltaI> {
    return dbUtil.read(domSchemaCollection)
  },

  async updateTables(dataDelta: DataDeltaI): Promise<void> {
    await dbUtil.upsert([
      { tabName: 'amo_contact', domSchema: amoContactDomSchema, docs: dataDelta.amo_contact },
      { tabName: 'contact_custom_field', domSchema: amoCustomFieldDomSchema, docs: dataDelta.contact_custom_field },
      { tabName: 'amo_lead', domSchema: amoLeadDomSchema, docs: dataDelta.amo_lead },
      { tabName: 'entity_link', domSchema: amoLinkDomSchema, docs: dataDelta.entity_link },
      { tabName: 'pipeline_status', domSchema: amoStatusDomSchema, docs: dataDelta.pipeline_status },
      { tabName: 'responsible_user', domSchema: amoUserDomSchema, docs: dataDelta.responsible_user },
    ])
  },

  async getAllFromAmoAndUpdateTables(): Promise<void> {
    const dataDelta = await dataUtil.getAllFromAmo()
    await dataUtil.updateTables(dataDelta)
  },
}
