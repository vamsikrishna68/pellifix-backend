import {Entity, model, property} from '@loopback/repository';

@model({name: 'earnings'})
export class Earnings extends Entity {
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
  admin_id: number;

  @property({
    type: 'date',
    required: true,
  })
  date: string;

  @property({
    type: 'number',
    required: true,
  })
  amount: number;

  constructor(data?: Partial<Earnings>) {
    super(data);
  }
}

export interface EarningsRelations {
  // describe navigational properties here
}

export type EarningsWithRelations = Earnings & EarningsRelations;
