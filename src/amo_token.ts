import fs from 'node:fs'
import { CONFIG_AMO } from './server_config.js'
import { DomainSchemaT, domainUtil } from './domain.js'
import { tabFileStorageDomSchema, TabFileStorageRowTypeT } from './db_interface.js'
import { dbUtil, pgPool } from './db_util.js'

type AmoTokenT = {
  token_type: string
  expires_in: number
  access_token: string
  refresh_token: string
}

type AmoTokenExtendedT = AmoTokenT & {
  expires: string
  incorrect_token_flag: boolean
}

const amoTokenDomainSchema: DomainSchemaT<AmoTokenT> = {
  token_type: { type: 'string' },
  expires_in: { type: 'number' },
  access_token: { type: 'string' },
  refresh_token: { type: 'string' },
}

const amoTokenExtendedDomainSchema: DomainSchemaT<AmoTokenExtendedT> = {
  ...amoTokenDomainSchema,
  expires: { type: 'string' },
  incorrect_token_flag: { type: 'boolean' },
}

const tokenFileName = 'amo_token.json'
const amoTokenPath = CONFIG_AMO.token_path + '/' + tokenFileName

// Если запускаем программу на сайте render.com, то:
// 1) Начальный токен надо указать в параметрах на сайте, при этом путь
// к нему будет выглядеть так: /etc/secrets/amo_token.json
// 2) Далее обновления токена будут сохраняться в бд (т.е. в этом параметре
// как источник должно быть указано 'DB').

// Если запускаем локально, то и начальный токен и его обновления будут 
// храниться в файловой системе. Путь будет выглядеть так: ./etc/... И
// соответственно в этом параметре как источник должно быть указано 'FS'.

let amoTokenSource: 'FS' | 'DB' = amoTokenPath[0] === '.' ? 'FS' : 'DB'

let amoTokenUntyped: unknown = ''

try { amoTokenUntyped = fs.readFileSync(amoTokenPath, 'utf8') } catch (error) { }

if (amoTokenUntyped === '') {
  amoTokenSource = 'DB'

  const client = await pgPool.connect()
  let rows: unknown[]
  try {
    const tabQueryRes = await client.query<unknown>('SELECT * FROM file_storage WHERE file_name = $1', [tokenFileName])
    rows = tabQueryRes.rows
  } catch (error) {
    throw error
  } finally {
    client.release()
  }

  if (!domainUtil.isDocumentArray(rows, tabFileStorageDomSchema)) throw new Error('!domainUtil.isDocumentArray(rows, tabFileStorageDomSchema)')
  const row0 = rows[0]
  if (!row0) throw new Error('!row0')

  amoTokenUntyped = row0.text_content
}

if (typeof amoTokenUntyped !== 'string') throw new Error('typeof amoToken !== string')
amoTokenUntyped = JSON.parse(amoTokenUntyped)
if (!domainUtil.isDocument(amoTokenUntyped, amoTokenExtendedDomainSchema)) throw new Error('!domainUtil.isDocument(amoToken, amoTokenExtendedDomainSchema)')

export const amoToken: AmoTokenExtendedT = amoTokenUntyped

export async function amoTokenSave(): Promise<void> {
  console.log(`\nSave token:\n`, JSON.stringify(amoToken), '\n')
  if (amoTokenSource === 'FS') {
    fs.writeFileSync(amoTokenPath, JSON.stringify(amoToken), 'utf8')
    console.log(`\nResult of saving token to file ${amoTokenPath}:\n`, fs.readFileSync(amoTokenPath, 'utf8'), '\n')
  } else if (amoTokenSource === 'DB') {
    await dbUtil.upsert([{
      tabName: 'file_storage', domSchema: amoTokenExtendedDomainSchema, docs: [{ ...amoToken }]
    }])
    console.log('\nToken saved to DB.\n')
  } else {
    throw new Error('Incorrect amoTokenSource.')
  }
}
