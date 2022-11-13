import {Entity, model, property} from '@loopback/repository';

@model({name: 'preference'})
export class Preference extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: false,
    required: true,
  })
  pro_id: number;

  @property({
    type: 'object',
    jsonSchema: {
      properties: {
        from: {type: 'string'},
        to: {type: 'string'},
      },
    },
  })
  age?: object;

  @property({
    type: 'object',
    jsonSchema: {
      properties: {
        from: {type: 'string'},
        to: {type: 'string'},
      },
    },
  })
  height?: object;

  @property({
    type: 'string',
  })
  marital_status?: string;

  @property({
    type: 'string',
  })
  mother_tongue?: string;

  @property({
    type: 'string',
  })
  physical_status?: string;

  @property({
    type: 'string',
  })
  eating_habits?: string;

  @property({
    type: 'string',
  })
  drinking_habits?: string;

  @property({
    type: 'string',
  })
  smoking_habits?: string;

  @property({
    type: 'string',
  })
  religion?: string;

  @property({
    type: 'string',
  })
  cast?: string;

  @property({
    type: 'string',
  })
  dosham?: string;

  @property({
    type: 'string',
  })
  star?: string;

  @property({
    type: 'string',
  })
  education?: string;

  @property({
    type: 'string',
  })
  employed_in?: string;

  @property({
    type: 'string',
  })
  occupation?: string;

  @property({
    type: 'string',
  })
  annual_income?: string;

  @property({
    type: 'string',
  })
  location?: string;

  @property({
    type: 'string',
  })
  looking_for?: string;

  constructor(data?: Partial<Preference>) {
    super(data);
  }
}

export interface PreferenceRelations {
  // describe navigational properties here
}

export type PreferenceWithRelations = Preference & PreferenceRelations;
