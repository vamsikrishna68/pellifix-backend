import {Entity, model, property} from '@loopback/repository';

@model({name: 'payment_history'})
export class PaymentHistory extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
    required: false,
  })
  id: number;

  @property({
    type: 'number',
    required: true,
  })
  profile_id: number;

  @property({
    type: 'number',
  })
  amount: number;

  @property({
    type: 'object',
    required: true,
  })
  payment_info: object;

  @property({
    type: 'object',
  })
  more_details: object;

  @property({
    type: 'date',
  })
  created_at?: string;

  constructor(data?: Partial<PaymentHistory>) {
    super(data);
  }
}

export interface PaymentHistoryRelations {
  // describe navigational properties here
}

export type PaymentHistoryWithRelations = PaymentHistory &
  PaymentHistoryRelations;
