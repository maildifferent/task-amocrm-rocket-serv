import pg from 'pg'
import { CONFIG_LOCAL_DB } from './server_config.js'
import fs from 'fs'
import { DomainSchemaT, domainUtil } from './domain.js'

export const pgPool = process.env['DATABASE_URL']
  ? new pg.Pool({
    connectionString: process.env['DATABASE_URL'],
    ssl: {
      rejectUnauthorized: false
    }
  })
  : new pg.Pool({
    user: CONFIG_LOCAL_DB.db_user,
    password: CONFIG_LOCAL_DB.db_password,
    host: CONFIG_LOCAL_DB.db_host,
    port: CONFIG_LOCAL_DB.db_port,
    database: CONFIG_LOCAL_DB.db_database,
  })

pgPool.on('error', (err, client) => {
  console.error('Unexpected error on idle client.', err)
  process.exit(-1)
})


export type DbUtilDomSchemaCollectionT<TypeCollection> = {
  [key in keyof TypeCollection]: DomainSchemaT<TypeCollection[key]>
}

export type DbUtilArrayCollectionT<TypeCollection> = {
  [key in keyof TypeCollection]: TypeCollection[key][]
}

export const dbUtil = {
  async recreateTables() {
    await processSqlFile('./etc/sql/db_tabs_drop.sql')
    await processSqlFile('./etc/sql/db_tabs_create.sql')
  },

  async read<TypeCollection>(
    domSchemaCollection: DbUtilDomSchemaCollectionT<TypeCollection>
  ): Promise<DbUtilArrayCollectionT<TypeCollection>> {
    const client = await pgPool.connect()
    try {
      const partialResult: Partial<DbUtilArrayCollectionT<TypeCollection>> = {}

      for (const tableName in domSchemaCollection) {
        const domSchema = domSchemaCollection[tableName]
        const tabQueryRes = await client.query<unknown>(`SELECT * FROM ${tableName}`)
        const rows = tabQueryRes.rows
        if(!domainUtil.isDocumentArray(rows, domSchema)) throw new Error('!domainUtil.isDocumentArray(rows, domSchema)')
        partialResult[tableName] = rows
      }

      if (!isFullArraysCollection(partialResult)) throw new Error('!isFullArraysCollection(partialResult)')
      return partialResult
    } catch (error) {
      throw error
    } finally {
      client.release()
    }

    function isFullArraysCollection(
      partial: Partial<DbUtilArrayCollectionT<TypeCollection>>
    ): partial is DbUtilArrayCollectionT<TypeCollection> {
      return Object.keys(partial).length === Object.keys(domSchemaCollection).length
    }
  },

  async upsert(items: {
    tabName: string, domSchema: DomainSchemaT<Record<string, unknown>>, docs: Record<string, unknown>[]
  }[]) {
    const client = await pgPool.connect()
    try {
      for (const item of items) {
        const { tabName, domSchema, docs } = item
        if (docs.length < 1) continue

        const fields = Object.keys(domSchema)
        const fieldsKeys: string[] = []
        const fieldsOther: string[] = []
        for (const key in domSchema) {
          const domain = domSchema[key]
          domain?.key ? fieldsKeys.push(key) : fieldsOther.push(key)
        }

        // First part of the query.
        let query = `INSERT INTO ${tabName} (${fields.join(', ')})`

        // Add VALUES part of the query.
        // VALUES ($1, $2), ($3, $4)
        let counter = 1
        const queryValuesRows: string[][] = []
        for (let i = 0; i < docs.length; i++) {
          const row: string[] = []
          queryValuesRows.push(row)
          for (let j = 0; j < fields.length; j++) {
            row.push(`$${counter++}`)
          }
        }

        query += ` VALUES ${queryValuesRows
          .map((row) => '(' + row.join(', ') + ')')
          .join(', ')
          }`

        const values: unknown[] = []
        for (const doc of docs) {
          for (const field of fields) {
            values.push(doc[field])
          }
        }

        // Add CONFLICT part of the query.
        // ON CONFLICT (id) DO UPDATE SET name = excluded.name, price = excluded.price, ...
        if (fieldsOther.length < 1) {
          query += ` ON CONFLICT (${fieldsKeys.join(', ')}) DO NOTHING`
        } else {
          query += ` ON CONFLICT (${fieldsKeys.join(', ')}) DO UPDATE SET `
          query += fieldsOther.map((field) => field + '= excluded.' + field).join(', ')
        }

        // Execute query.
        try { await client.query(query, values) } catch (error) {
          console.error('\nERROR IN QUERY:\n', query)
          console.error(error)
        }
      }
    } catch (error) {
      throw error
    } finally {
      client.release()
    }
  }
}

async function processSqlFile(path: string) {
  const client = await pgPool.connect()
  try {
    const queries = fs.readFileSync(path).toString().split(';')
    for (const query of queries) {
      try { await client.query(query) } catch (error) {
        console.error('\nERROR IN QUERY:\n', query)
        console.error(error)
      }
    }
  } catch (error) {
    throw error
  } finally {
    client.release()
  }
}
