import { amoUtil } from './amo_util.js'
import { amoContactDomSchema, amoCustomFieldDomSchema, amoLeadDomSchema, amoLinkDomSchema, amoStatusDomSchema, amoUserDomSchema } from './db_interface.js'
import { dbUtil } from './db_util.js'

export const util = {
  async getDataDeltaAndUpdateTables() {
    const { contacts, customFields, leads, links, statuses, users } = await amoUtil.getDataDelta()
    await dbUtil.upsert([
      { tabName: 'amo_contact', domSchema: amoContactDomSchema, docs: contacts },
      { tabName: 'contact_custom_field', domSchema: amoCustomFieldDomSchema, docs: customFields },
      { tabName: 'amo_lead', domSchema: amoLeadDomSchema, docs: leads },
      { tabName: 'entity_link', domSchema: amoLinkDomSchema, docs: links },
      { tabName: 'pipeline_status', domSchema: amoStatusDomSchema, docs: statuses },
      { tabName: 'responsible_user', domSchema: amoUserDomSchema, docs: users },
    ])
  },
}
