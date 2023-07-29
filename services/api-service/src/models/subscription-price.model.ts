import {Entity, model, property} from '@loopback/repository';

enum PriceType {
  YEAR = 'YEAR',
  MONTH = 'MONTH',
  WEEK = 'WEEK',
}

@model({name: 'subscription_price', settings: {strict: false}})
export class SubscriptionPrice extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: false,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
  })
  description: string;

  @property({
    type: 'number',
    required: true,
  })
  price: number;

  @property({
    type: 'string',
  })
  type: PriceType;

  @property({
    type: 'boolean',
  })
  active: boolean;

  @property({
    type: 'date',
  })
  created_at?: string;

  @property({
    type: 'date',
  })
  updated_at?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<SubscriptionPrice>) {
    super(data);
  }
}

export interface SubscriptionPriceRelations {
  // describe navigational properties here
}

export type SubscriptionPriceWithRelations = SubscriptionPrice &
  SubscriptionPriceRelations;
