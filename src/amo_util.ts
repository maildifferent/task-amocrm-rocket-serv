import * as https from 'node:https'
import fs from 'node:fs'
import { CONFIG_AMO } from './server_config.js'
// import amo_token_access from './amo_token_access.json' assert { type: 'json' }
// import amo_token_refresh from './amo_token_refresh.json' assert { type: 'json' }
import { DomainSchemaT, domainUtil } from './domain.js'
import { amoApiAccessTokenDomSchema, amoContactDomSchema, AmoContactT, amoCustomFieldDomSchema, AmoCustomFieldT, amoLeadDomSchema, AmoLeadT, amoLinkDomSchema, AmoLinkT, amoStatusDomSchema, AmoStatusT, amoUserDomSchema, AmoUserT } from './db_interface.js'
import { DbUtilDomSchemaCollectionT } from './db_util.js'
import { amoToken, amoTokenSave } from './amo_token.js'

const authorizationLogPath = './etc/log/authorization_log.txt'

export const amoUtil = {
  async refreshToken() {
    const path = '/oauth2/access_token'
    const method = 'POST'
    const { client_id, client_secret, redirect_uri } = CONFIG_AMO
    const data = JSON.stringify({
      client_id, client_secret, grant_type: 'refresh_token', redirect_uri,
      refresh_token: amoToken.refresh_token
    })
    const input: Parameters<typeof sendReq>[0] = data === undefined ? { path, method } : { path, method, data }
    let parsedResult = await sendNodeHttpsRequestToAmoServer(input)
    if (parsedResult?.status === 401) {
      amoToken.incorrect_token_flag = true
      await amoTokenSave()
      throw new Error('parsedResult?.status === 401')
    }

    fs.appendFileSync(authorizationLogPath, `\n${path}\n${new Date().toISOString()}\n`, 'utf8')
    fs.appendFileSync(authorizationLogPath, JSON.stringify(parsedResult), 'utf8')
    console.log(`\nAppend to file ${authorizationLogPath} the following data:\n`, JSON.stringify(parsedResult), '\n')
    console.log(`\nResult:\n`, fs.readFileSync(authorizationLogPath, 'utf8'), '\n')

    if (!domainUtil.isDocument(parsedResult, amoApiAccessTokenDomSchema)) {
      console.error('\nRESULT OF REFRESH TOKEN REQUEST:\n', parsedResult, '\n')
      throw new Error('Incorrect result from access token refresh request.')
    }

    amoToken.expires = new Date(Date.now() + parsedResult.expires_in * 1000).toISOString()
    amoToken.incorrect_token_flag = false
    amoToken.token_type = parsedResult.token_type
    amoToken.expires_in = parsedResult.expires_in
    amoToken.access_token = parsedResult.access_token
    amoToken.refresh_token = parsedResult.refresh_token
    await amoTokenSave()
  },

  async initNewIntegration() {
    const path = '/oauth2/access_token'
    const method = 'POST'
    const { client_id, client_secret, code, redirect_uri } = CONFIG_AMO
    const data = JSON.stringify({
      client_id, client_secret, grant_type: 'authorization_code', code, redirect_uri
    })
    const result = await sendReq({ path, method, data })
    console.log('RESULT:\n', result)
  },

  async getUser(): Promise<{ responsible_user: AmoUserT[] }> {
    const responsible_user: AmoUserT[] = []
    const path = `/api/v4/users`
    const method = 'GET'

    const parsedResult = await sendReq({ path, method })
    if (parsedResult === '') return { responsible_user }
    const embedded: unknown = parsedResult?._embedded?.users
    if (!Array.isArray(embedded)) throw new Error('!Array.isArray(embedded)')
    responsible_user.push(...domainUtil.typifyDocumentArray(embedded, amoUserDomSchema))

    return { responsible_user }
  },

  async getPipeline(): Promise<{ pipeline_status: AmoStatusT[] }> {
    const pipeline_status: AmoStatusT[] = []
    // const path = `/api/v4/leads/pipelines/6428286`
    const path = `/api/v4/leads/pipelines`
    const method = 'GET'

    const parsedResult = await sendReq({ path, method })
    if (parsedResult === '') return { pipeline_status }
    const pipelines: unknown = parsedResult?._embedded?.pipelines
    if (!Array.isArray(pipelines)) throw new Error('!Array.isArray(pipelines)')

    for (const pipe of pipelines) {
      const embedded = pipe?._embedded?.statuses
      if (!Array.isArray(embedded)) throw new Error('!Array.isArray(embedded)')
      const typedResult: AmoStatusT[] = domainUtil.typifyDocumentArray(embedded, amoStatusDomSchema)
      for (const status of typedResult) {
        if (!pipeline_status.find((element) => element.id === status.id)) pipeline_status.push(status)
      }
    }

    return { pipeline_status }
  },

  async getLink(leadIds: number[]): Promise<{ entity_link: AmoLinkT[] }> {
    const entity_link: AmoLinkT[] = []
    if (leadIds.length < 1) return { entity_link }
    // const path = '/api/v4/leads/239529/links'
    // const path = '/api/v4/contacts/352919/links'
    // https://www.amocrm.ru/developers/content/crm_platform/filters-api
    // const path = `/api/v4/contacts/links?filter[entity_id][]=352919&filter[entity_id][]=2952403&filter[entity_id][]=2952471`
    let filter = ''
    if (leadIds.length > 0) filter += '?' + leadIds.map((id) => `filter[entity_id][]=${id}`).join('&')
    const path = `/api/v4/leads/links${filter}`
    const method = 'GET'

    const parsedResult = await sendReq({ path, method })
    if (parsedResult === '') return { entity_link }
    const embedded: unknown = parsedResult?._embedded?.links
    if (!Array.isArray(embedded)) throw new Error('!Array.isArray(embedded)')
    entity_link.push(...domainUtil.typifyDocumentArray(embedded, amoLinkDomSchema))

    return { entity_link }
  },

  async getContact(updatedAtFrom?: number): Promise<{
    amo_contact: AmoContactT[], contact_custom_field: AmoCustomFieldT[]
  }> {
    const amo_contact: AmoContactT[] = []
    const contact_custom_field: AmoCustomFieldT[] = []
    let path = '/api/v4/contacts'
    if (updatedAtFrom) path += `?filter[updated_at][from]=${updatedAtFrom}`
    const method = 'GET'

    const parsedResult = await sendReq({ path, method })
    if (parsedResult === '') return { amo_contact, contact_custom_field }
    const embedded: unknown = parsedResult?._embedded?.contacts
    if (!Array.isArray(embedded)) throw new Error('!Array.isArray(embedded)')

    for (const item of embedded) {
      const contact: AmoContactT = {
        id: domainUtil.typifyPrimitiveType(item?.id, amoContactDomSchema['id']),
        name: domainUtil.typifyPrimitiveType(item?.name, amoContactDomSchema['name']),
        first_name: domainUtil.typifyPrimitiveType(item?.first_name, amoContactDomSchema['first_name']),
        last_name: domainUtil.typifyPrimitiveType(item?.last_name, amoContactDomSchema['last_name']),
        responsible_user_id: domainUtil.typifyPrimitiveType(item?.responsible_user_id, amoContactDomSchema['responsible_user_id']),
        updated_at: domainUtil.typifyPrimitiveType(item?.updated_at, amoContactDomSchema['updated_at']),
      }
      amo_contact.push(contact)

      const customFVals = item?.custom_fields_values
      if (!Array.isArray(customFVals)) continue
      for (const fVal of customFVals) {
        const customField: AmoCustomFieldT = {
          zz_contact_id: contact.id,
          zz_field_code1: domainUtil.typifyPrimitiveType(fVal?.field_code, amoCustomFieldDomSchema['zz_field_code1']),
          zz_field_code2: '',
          field_name: domainUtil.typifyPrimitiveType(fVal?.field_name, amoCustomFieldDomSchema['field_name']),
          zz_values: [],
        }

        const customVals = fVal?.values
        if (!Array.isArray(customVals)) continue
        const record: Record<string, string[]> = {}
        for (const val of customVals) {
          const zz_field_code2 = domainUtil.typifyPrimitiveType<string>(val?.enum_code || '', amoCustomFieldDomSchema['zz_field_code2'])
          const value: unknown = val?.value
          if (typeof value !== 'string') throw new Error('typeof value !== string')
          if (zz_field_code2 in record) {
            record[zz_field_code2]?.push(value)
          } else {
            record[zz_field_code2] = [value]
          }
        }

        for (const [key, values] of Object.entries(record)) {
          contact_custom_field.push({
            zz_contact_id: customField.zz_contact_id,
            zz_field_code1: customField.zz_field_code1,
            zz_field_code2: key,
            field_name: customField.field_name,
            zz_values: values
          })
        }
      }
    }

    return { amo_contact, contact_custom_field }
  },

  async getLead(
    { updatedAtFrom, query }: { updatedAtFrom?: number, query?: string }
  ): Promise<{ amo_lead: AmoLeadT[] }> {
    const amo_lead: AmoLeadT[] = []
    // const path = '/api/v4/leads/239529'
    let path = '/api/v4/leads'
    const params: string[] = []
    if (query && query.length > 2) {
      const queryParams = { query }
      params.push(new URLSearchParams(queryParams).toString()) // 'param1=value1&param2=value2'
    }
    if (updatedAtFrom) params.push(`filter[updated_at][from]=${updatedAtFrom}`)
    if (params.length > 0) path += '?' + params.join('&')
    const method = 'GET'

    const parsedResult = await sendReq({ path, method })
    if (parsedResult === '') return { amo_lead }
    const embedded: unknown = parsedResult?._embedded?.leads
    if (!Array.isArray(embedded)) throw new Error('!Array.isArray(embedded)')
    amo_lead.push(...domainUtil.typifyDocumentArray(embedded, amoLeadDomSchema))

    return { amo_lead }
  },
}

async function sendReq({
  path, method, data,
}: {
  path: string, method: string, data?: string
}): Promise<any> {
  if (amoToken.incorrect_token_flag) throw new Error('amo_token_refresh.incorrect_token_flag')
  const input: Parameters<typeof sendReq>[0] = data === undefined ? { path, method } : { path, method, data }

  let parsedResult = await sendNodeHttpsRequestToAmoServer(input)
  if (parsedResult?.status !== 401) return parsedResult

  await amoUtil.refreshToken()

  parsedResult = await sendNodeHttpsRequestToAmoServer(input)
  if (parsedResult?.status !== 401) return parsedResult

  amoToken.incorrect_token_flag = true
  await amoTokenSave()
  throw new Error('After authorization error we tried to refresh token but failed. Reset incorrect_token_flag manually.')
}

async function sendNodeHttpsRequestToAmoServer(
  { path, method, data }: { path: string, method: string, data?: string }
): Promise<any> {
  const options: https.RequestOptions = {
    hostname: CONFIG_AMO.hostname,
    // port: 80,
    path,
    method,
    headers: {
      'Authorization': `Bearer ${amoToken.access_token}`,
      'Content-Type': 'application/json'
    }
  }
  if (data !== undefined && options.headers) options.headers['Content-Length'] = Buffer.byteLength(data)

  return new Promise(function (resolve, reject) {
    const req = https.request(options, (res) => {
      // console.log(`STATUS: ${res.statusCode}`)
      // console.log(`HEADERS: ${JSON.stringify(res.headers)}`)

      res.setEncoding('utf8')
      let rawData = ''

      res.on('data', (chunk) => { rawData += chunk })

      res.on('end', () => {
        try {
          // console.log('\nBODY:\n', rawData)
          if (rawData === '') return resolve('')
          const parsedData = JSON.parse(rawData)
          return resolve(parsedData)
        } catch (error) {
          console.error('\nBODY:\n', rawData)
          return reject(error)
        }
      })
    })

    req.on('error', (error) => {
      reject(error)
    })

    if (data !== undefined) req.write(data)
    req.end()
  })
}
