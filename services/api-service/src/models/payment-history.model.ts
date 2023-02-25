import {Entity, model, property} from '@loopback/repository';

@model({name: 'payament_history'})
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
    type: 'object',
    required: true,
  })
  payment_info: object;

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
