import * as https from 'node:https'
import fs from 'node:fs'
import { CONFIG_AMO } from './server_config.js'
// import amo_token_access from './amo_token_access.json' assert { type: 'json' }
// import amo_token_refresh from './amo_token_refresh.json' assert { type: 'json' }
import { DomainSchemaT, domainUtil } from './domain.js'
import { amoApiAccessTokenDomSchema, amoContactDomSchema, AmoContactT, amoCustomFieldDomSchema, AmoCustomFieldT, amoLeadDomSchema, AmoLeadT, amoLinkDomSchema, AmoLinkT, amoStatusDomSchema, AmoStatusT, amoUserDomSchema, AmoUserT } from './db_interface.js'

type AmoTokenAccessInterfaceT = {
  expires: string
  access_token: string
}

type AmoTokenRefreshInterfaceT = {
  incorrect_token_flag: boolean
  refresh_token: string
}

const amoTokenAccessDomSchema: DomainSchemaT<AmoTokenAccessInterfaceT> = {
  expires: { type: 'string' },
  access_token: { type: 'string' },
}

const amoTokenRefreshDomSchema: DomainSchemaT<AmoTokenRefreshInterfaceT> = {
  incorrect_token_flag: { type: 'boolean' },
  refresh_token: { type: 'string' },
}

const amoTokenAccessPath = CONFIG_AMO.token_path + '/amo_token_access.json'
const amoTokenRefreshPath = CONFIG_AMO.token_path + '/amo_token_refresh.json'
const authorizationLogPath = './etc/log/authorization_log.txt'

const amoTokenAccessUntyped: unknown = JSON.parse(fs.readFileSync(amoTokenAccessPath, 'utf8'))
const amoTokenRefreshUntyped: unknown = JSON.parse(fs.readFileSync(amoTokenRefreshPath, 'utf8'))

const amo_token_access = domainUtil.typifyDocument(amoTokenAccessUntyped, amoTokenAccessDomSchema)
const amo_token_refresh = domainUtil.typifyDocument(amoTokenRefreshUntyped, amoTokenRefreshDomSchema)

export const amoUtil = {
  async refreshToken() {
    const path = '/oauth2/access_token'
    const method = 'POST'
    const { client_id, client_secret, redirect_uri } = CONFIG_AMO
    const data = JSON.stringify({
      client_id, client_secret, grant_type: 'refresh_token', redirect_uri,
      refresh_token: amo_token_refresh.refresh_token
    })
    const input: Parameters<typeof sendReq>[0] = data === undefined ? { path, method } : { path, method, data }
    let parsedResult = await sendNodeHttpsRequestToAmoServer(input)
    if (parsedResult?.status === 401) throw new Error('parsedResult?.status === 401')

    fs.appendFileSync(authorizationLogPath, `\n${path}\n${new Date().toISOString()}\n`, 'utf8')
    fs.appendFileSync(authorizationLogPath, JSON.stringify(parsedResult), 'utf8')
    console.log(`\nAppend to file ${authorizationLogPath} the following data:\n`, JSON.stringify(parsedResult))
    console.log(`Result:\n`, fs.readFileSync(authorizationLogPath, 'utf8'))

    if (!domainUtil.isDocument(parsedResult, amoApiAccessTokenDomSchema)) {
      console.error('\nRESULT OF REFRESH TOKEN REQUEST:\n', parsedResult)
      throw new Error('Incorrect result from access token refresh request.')
    }

    amo_token_access.access_token = parsedResult.access_token
    amo_token_access.expires = new Date(Date.now() + parsedResult.expires_in * 1000).toISOString()
    amo_token_refresh.refresh_token = parsedResult.refresh_token

    fs.writeFileSync(amoTokenAccessPath, JSON.stringify(amo_token_access), 'utf8')
    console.log(`\nWrite to file ${amoTokenAccessPath} the following data:\n`, JSON.stringify(amo_token_access))
    console.log(`Result:\n`, fs.readFileSync(amoTokenAccessPath, 'utf8'))
    fs.writeFileSync(amoTokenRefreshPath, JSON.stringify(amo_token_refresh), 'utf8')
    console.log(`\nWrite to file ${amoTokenRefreshPath} the following data:\n`, JSON.stringify(amo_token_refresh))
    console.log(`Result:\n`, fs.readFileSync(amoTokenRefreshPath, 'utf8'))
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

  async getUser(): Promise<{ users: AmoUserT[] }> {
    const users: AmoUserT[] = []
    const path = `/api/v4/users`
    const method = 'GET'

    const parsedResult = await sendReq({ path, method })
    if (parsedResult === '') return { users }
    const embedded: unknown = parsedResult?._embedded?.users
    if (!Array.isArray(embedded)) throw new Error('!Array.isArray(embedded)')
    users.push(...domainUtil.typifyDocumentArray(embedded, amoUserDomSchema))

    return { users }
  },

  async getPipeline(): Promise<{ statuses: AmoStatusT[] }> {
    const statuses: AmoStatusT[] = []
    // const path = `/api/v4/leads/pipelines/6428286`
    const path = `/api/v4/leads/pipelines`
    const method = 'GET'

    const parsedResult = await sendReq({ path, method })
    if (parsedResult === '') return { statuses }
    const pipelines: unknown = parsedResult?._embedded?.pipelines
    if (!Array.isArray(pipelines)) throw new Error('!Array.isArray(pipelines)')

    for (const pipe of pipelines) {
      const embedded = pipe?._embedded?.statuses
      if (!Array.isArray(embedded)) throw new Error('!Array.isArray(embedded)')
      const typedResult: AmoStatusT[] = domainUtil.typifyDocumentArray(embedded, amoStatusDomSchema)
      for (const status of typedResult) {
        if (!statuses.find((element) => element.id === status.id)) statuses.push(status)
      }
    }

    return { statuses }
  },

  async getLink(leadIds: number[]): Promise<{ links: AmoLinkT[] }> {
    const links: AmoLinkT[] = []
    if (leadIds.length < 1) return { links }
    // const path = '/api/v4/leads/239529/links'
    // const path = '/api/v4/contacts/352919/links'
    // https://www.amocrm.ru/developers/content/crm_platform/filters-api
    // const path = `/api/v4/contacts/links?filter[entity_id][]=352919&filter[entity_id][]=2952403&filter[entity_id][]=2952471`
    let filter = ''
    if (leadIds.length > 0) filter += '?' + leadIds.map((id) => `filter[entity_id][]=${id}`).join('&')
    const path = `/api/v4/leads/links${filter}`
    const method = 'GET'

    const parsedResult = await sendReq({ path, method })
    if (parsedResult === '') return { links }
    const embedded: unknown = parsedResult?._embedded?.links
    if (!Array.isArray(embedded)) throw new Error('!Array.isArray(embedded)')
    links.push(...domainUtil.typifyDocumentArray(embedded, amoLinkDomSchema))

    return { links }
  },

  async getContact(updatedAtFrom?: number): Promise<{ contacts: AmoContactT[], customFields: AmoCustomFieldT[] }> {
    const contacts: AmoContactT[] = []
    const customFields: AmoCustomFieldT[] = []
    let path = '/api/v4/contacts'
    if (updatedAtFrom) path += `?filter[updated_at][from]=${updatedAtFrom}`
    const method = 'GET'

    const parsedResult = await sendReq({ path, method })
    if (parsedResult === '') return { contacts, customFields }
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
      contacts.push(contact)

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
          customFields.push({
            zz_contact_id: customField.zz_contact_id,
            zz_field_code1: customField.zz_field_code1,
            zz_field_code2: key,
            field_name: customField.field_name,
            zz_values: values
          })
        }
      }
    }

    return { contacts, customFields }
  },

  async getLead(
    { updatedAtFrom, query }: { updatedAtFrom?: number, query?: string }
  ): Promise<{ leads: AmoLeadT[] }> {
    const leads: AmoLeadT[] = []
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
    if (parsedResult === '') return { leads }
    const embedded: unknown = parsedResult?._embedded?.leads
    if (!Array.isArray(embedded)) throw new Error('!Array.isArray(embedded)')
    leads.push(...domainUtil.typifyDocumentArray(embedded, amoLeadDomSchema))

    return { leads }
  },
}

async function sendReq({
  path, method, data,
}: {
  path: string, method: string, data?: string
}): Promise<any> {
  if (amo_token_refresh.incorrect_token_flag) throw new Error('amo_token_refresh.incorrect_token_flag')
  const input: Parameters<typeof sendReq>[0] = data === undefined ? { path, method } : { path, method, data }

  let parsedResult = await sendNodeHttpsRequestToAmoServer(input)
  if (parsedResult?.status !== 401) return parsedResult

  await amoUtil.refreshToken()

  parsedResult = await sendNodeHttpsRequestToAmoServer(input)
  if (parsedResult?.status !== 401) return parsedResult

  amo_token_refresh.incorrect_token_flag = true
  fs.writeFileSync(amoTokenRefreshPath, JSON.stringify(amo_token_refresh), 'utf8')
  console.log(`\nWrite to file ${amoTokenRefreshPath} the following data:\n`, JSON.stringify(amo_token_refresh))
  console.log(`Result:\n`, fs.readFileSync(amoTokenRefreshPath, 'utf8'))
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
      'Authorization': `Bearer ${amo_token_access.access_token}`,
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
