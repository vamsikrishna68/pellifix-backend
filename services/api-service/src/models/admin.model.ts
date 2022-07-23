import {Entity, model, property} from '@loopback/repository';

@model({name: 'admin'})
export class Admin extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;

  @property({
    type: 'string',
  })
  username: string;

  @property({
    type: 'string',
  })
  password: string;

  @property({
    type: 'string',
    required: true,
  })
  email_id: string;

  @property({
    type: 'string',
  })
  phone?: string;

  @property({
    type: 'string',
  })
  address?: string;

  @property({
    type: 'number',
  })
  earnings_id?: number;

  @property({
    type: 'string',
  })
  pan_card?: string;

  @property({
    type: 'string',
  })
  bank_account?: string;

  @property({
    type: 'string',
  })
  ifsc_code?: string;

  @property({
    type: 'string',
  })
  bank_name?: string;

  @property({
    type: 'string',
  })
  referral_code?: string;

  @property({
    type: 'string',
  })
  forget_hash?: string;

  @property({
    type: 'date',
  })
  created_at?: string;

  @property({
    type: 'date',
  })
  updated_at?: string;

  constructor(data?: Partial<Admin>) {
    super(data);
  }
}

export interface AdminRelations {
  // describe navigational properties here
}

export type AdminWithRelations = Admin & AdminRelations;
