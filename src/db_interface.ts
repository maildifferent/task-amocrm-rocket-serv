import { DomainSchemaT } from './domain.js'

export type AmoApiAccessTokenT = {
  token_type: string
  expires_in: number
  access_token: string
  refresh_token: string
}

export const amoApiAccessTokenDomSchema: DomainSchemaT<AmoApiAccessTokenT> = {
  token_type: { type: 'string' },
  expires_in: { type: 'number' },
  access_token: { type: 'string' },
  refresh_token: { type: 'string' },
}

export type AmoLeadT = {
  id: number
  name: string
  price: number
  responsible_user_id: number
  status_id: number
  pipeline_id: number
  created_at: number
}

export const amoLeadDomSchema: DomainSchemaT<AmoLeadT> = {
  id: { type: 'number', key: true },
  name: { type: 'string' },
  price: { type: 'number' },
  responsible_user_id: { type: 'number' },
  status_id: { type: 'number' },
  pipeline_id: { type: 'number' },
  created_at: { type: 'number' },
}

export type AmoLinkT = {
  entity_id: number
  entity_type: string // 'contacts'
  to_entity_id: number
  to_entity_type: string // 'leads'
}

export const amoLinkDomSchema: DomainSchemaT<AmoLinkT> = {
  entity_id: { type: 'number', key: true },
  entity_type: { type: 'string', key: true },
  to_entity_id: { type: 'number', key: true },
  to_entity_type: { type: 'string', key: true },
}

export type AmoContactT = {
  id: number
  name: string
  first_name: string
  last_name: string
  responsible_user_id: number
  updated_at: number
}

export const amoContactDomSchema: DomainSchemaT<AmoContactT> = {
  id: { type: 'number', key: true },
  name: { type: 'string' },
  first_name: { type: 'string' },
  last_name: { type: 'string' },
  responsible_user_id: { type: 'number' },
  updated_at: { type: 'number' },
}

export type AmoCustomFieldT = {
  zz_contact_id: number
  zz_field_code1: string // 'PHONE'
  zz_field_code2: string // 'WORK'
  field_name: string // 'Телефон'
  zz_values: string[]
}

export const amoCustomFieldDomSchema: DomainSchemaT<AmoCustomFieldT> = {
  zz_contact_id: { type: 'number', key: true },
  zz_field_code1: { type: 'string', key: true },
  zz_field_code2: { type: 'string', key: true },
  field_name: { type: 'string' },
  zz_values: { type: 'string[]' },
}

export type AmoStatusT = {
  id: number
  name: string
  pipeline_id: number
  color: string
}

export const amoStatusDomSchema: DomainSchemaT<AmoStatusT> = {
  id: { type: 'number', key: true },
  name: { type: 'string' },
  pipeline_id: { type: 'number' },
  color: { type: 'string' },
}

export type AmoUserT = {
  id: number
  name: string
}

export const amoUserDomSchema: DomainSchemaT<AmoUserT> = {
  id: { type: 'number', key: true },
  name: { type: 'string' },
}
