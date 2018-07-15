import SQL from "../mysql-pool/mysql-pool"

import { Lead, LeadQueryOptions, NewLead } from "./types"

import baseDBModel from "../base-db-model/base-db-model"

export default class Leads extends baseDBModel<
  NewLead,
  Lead,
  LeadQueryOptions
> {
  constructor(sql: SQL) {
    super(sql, "leads", "lead")
  }

  public async AddLead(lead: Lead) {
    return await this.insert(lead)
  }

  public async insertLead(new_lead) {
    return this.insert(new_lead)
  }

  public async findLeads({
    condition,
    sort,
    limit,
  }: {
    condition?: LeadQueryOptions
    sort?: { sortBy: string; sortOrder: "ASC" | "DESC" }
    limit?: { start: number; offset: number }
  }): Promise<Lead[]> {
    return this.find({ condition, sort, limit })
  }

  public async findAndSort() {}

  public async getSoldLeads(user_id: number, options: LeadQueryOptions) {
    return await this.leads.getSoldLeads(user_id, options)
  }

  public async getMyLeads(user_id: number, options: LeadQueryOptions) {
    return await this.leads.getMyLeads(user_id, options)
  }

  public async getBoughtLeads(user_id: number, options: LeadQueryOptions) {
    return await this.leads.getBoughtLeads(user_id, options)
  }

  public async getLeadsNotOwnedByMe(
    user_id: number,
    options: LeadQueryOptions,
  ) {
    return await this.leads.getLeadsNotOwnedByMe(user_id, options)
  }

  async buy(lead_ids: number[], new_owner: number) {
    const lead_promises = lead_ids
      .filter(async (l_id: number) => {
        await this.update(l_id, { active: false })
      })
      .map(async (l_id: number) => {
        const lead = await this.getById(l_id)
        return Object.assign(lead, {
          id: undefined,
          bought_from: lead.owner_id,
          bought_currency: lead.currency,
          owner_id: new_owner,
        })
      })
      .map(async leadPromise => {
        const lead = await leadPromise
        const status = await this.insert(lead)
        return status
      })
    return Promise.all(lead_promises)
  }

  async getById(id: number): Promise<Lead> {
    const condition = { id }
    const [record] = await this.find({ condition })
    return record
  }

  async remove(id: number) {
    let status = await this.sql.query("DELETE FROM leads WHERE id = ?", id)
    return status.affectedRows != 0
  }
}
