import {Entity, model, property} from '@loopback/repository';

@model({name: 'payament_page_viewed'})
export class PaymentPageViewed extends Entity {
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
  pro_id: number;

  @property({
    type: 'number',
    required: true,
  })
  view_count: number;

  @property({
    type: 'boolean',
    required: true,
  })
  viewed: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  notified: boolean;

  @property({
    type: 'date',
  })
  created_at?: string;

  @property({
    type: 'date',
  })
  updated_at?: string;

  constructor(data?: Partial<PaymentPageViewed>) {
    super(data);
  }
}

export interface PaymentPageViewedRelations {
  // describe navigational properties here
}

export type PaymentPageViewedWithRelations = PaymentPageViewed &
  PaymentPageViewedRelations;
