import { Injectable } from '@nestjs/common'
import { DataDeltaI, dataUtil } from '../data_util.js'
import { AmoContactT, AmoCustomFieldT, AmoLeadT, AmoLinkT, AmoStatusT, AmoUserT } from '../db_interface.js'

@Injectable()
export class LeadService {
  async read(): Promise<DataDeltaI> {
    return dataUtil.readAllFromDb()
  }
}