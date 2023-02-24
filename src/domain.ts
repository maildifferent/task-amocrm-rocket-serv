
type PrimitivesT = string | number | boolean | bigint
  | string[] | number[] | bigint[]

type DomainT<PrimitiveType> = Readonly<{
  type
  : PrimitivesT extends PrimitiveType ? 'string[]' | 'number[]' | 'bigint[]' | 'string' | 'number' | 'boolean' | 'bigint'
  : object extends PrimitiveType ? never

  : string[] extends PrimitiveType ? 'string[]'
  : number[] extends PrimitiveType ? 'number[]'
  : bigint[] extends PrimitiveType ? 'bigint[]'

  : string extends PrimitiveType ? 'string'
  : number extends PrimitiveType ? 'number'
  : boolean extends PrimitiveType ? 'boolean'
  : bigint extends PrimitiveType ? 'bigint'

  : never,
  key?: true
}>

export type DomainSchemaT<Document> = {
  [key in keyof Document]: DomainT<Document[key]>
}

export const domainUtil = Object.freeze({
  isPrimitiveType<PrimitiveType>(
    something: unknown,
    domain: DomainT<PrimitiveType>
  ): something is PrimitiveType {
    if (typeof something === 'number' && isNaN(something)) return false
    const isArray = domain.type.endsWith('[]')
    const type = isArray ? domain.type.slice(0, -2) : domain.type
    if (isArray) {
      if (!Array.isArray(something)) return false
      return something.every((value) => typeof value === type)
    } else {
      return (typeof something === type)
    }
  },

  typifyPrimitiveType<PrimitiveType>(
    something: unknown,
    domain: DomainT<PrimitiveType>
  ): PrimitiveType {
    if (!domainUtil.isPrimitiveType<PrimitiveType>(something, domain)) throw new Error('!domainUtil.isPrimitiveType<PrimitiveType>(something, domain)')
    return something
  },

  isDocument<Document>(
    something: unknown,
    domainSchema: DomainSchemaT<Document>
  ): something is Document {
    if (typeof something !== 'object' || !something) return false
    for (const key in domainSchema) {
      const prop: unknown = something[key as keyof typeof something]
      const domain = domainSchema[key]
      if (!domainUtil.isPrimitiveType(prop, domain)) return false
    }
    if (Object.keys(something).length !== Object.keys(domainSchema).length) return false
    return true
  },

  typifyDocument<Document>(
    something: unknown,
    domainSchema: DomainSchemaT<Document>
  ): Document {
    if (typeof something !== 'object' || !something) throw new Error('typeof something !== object || !something')
    const result: Partial<Document> = {}
    for (const key in domainSchema) {
      const prop: unknown = something[key as keyof typeof something]
      const domain = domainSchema[key]
      if (!domainUtil.isPrimitiveType(prop, domain)) throw new Error('!domainUtil.isPrimitiveType(prop, domain)')
      result[key] = prop
    }
    if (!domainUtil.isFullDocument(result, domainSchema)) throw new Error('!domainUtil.isFullDocument(result, domainSchema)')
    return result
  },

  isDocumentArray<Document>(
    something: unknown,
    domainSchema: DomainSchemaT<Document>
  ): something is Document[] {
    if (!Array.isArray(something)) return false
    return something.every((value) => domainUtil.isDocument(value, domainSchema))
  },

  typifyDocumentArray<Document>(
    something: unknown,
    domainSchema: DomainSchemaT<Document>
  ): Document[] {
    const result: Document[] = []
    if (!Array.isArray(something)) throw new Error('!Array.isArray(something)')
    for (const item of something) result.push(domainUtil.typifyDocument(item, domainSchema))
    return result
  },

  isFullDocument<Document>(
    partial: Partial<Document>,
    domainSchema: DomainSchemaT<Document>
  ): partial is Document {
    return Object.keys(partial).length === Object.keys(domainSchema).length
  },
} as const);

////////////////////////////////////////////////////////////////////////////////
// Some tests.
////////////////////////////////////////////////////////////////////////////////
() => {
  type DocumentTestT = {
    str: string
    num: number
    bln: boolean
    bnt: bigint
    // obj: object
    // nul: null
    strA: string[]
    numA: number[]
    bntA: bigint[]
  }
  const domSchemaTest: DomainSchemaT<DocumentTestT> = {
    str: { type: 'string' },
    num: { type: 'number' },
    bln: { type: 'boolean' },
    bnt: { type: 'bigint' },
    // obj: { type: '' },
    // nul: { type: '' },
    strA: { type: 'string[]' },
    numA: { type: 'number[]' },
    bntA: { type: 'bigint[]' },
  }
  let test: unknown
  if (domainUtil.isDocument(test, domSchemaTest)) { test } // typeof test === DocumentTestT
}

() => {
  const testStrDomain: DomainT<string> = { type: 'string', }
  let test: unknown
  if (domainUtil.isPrimitiveType<string>(test, testStrDomain)) { test } // typeof test === string
}
