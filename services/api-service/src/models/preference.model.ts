import {Entity, model, property} from '@loopback/repository';

@model()
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
    type: 'array',
    itemType: 'string',
  })
  marital_status?: string[];

  @property({
    type: 'array',
    itemType: 'string',
  })
  mother_tongue?: string[];

  @property({
    type: 'string',
  })
  physical_status?: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  eating_habits?: string[];

  @property({
    type: 'array',
    itemType: 'string',
  })
  drinking_habits?: string[];

  @property({
    type: 'array',
    itemType: 'string',
  })
  smoking_habits?: string[];

  @property({
    type: 'string',
  })
  religion?: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  cast?: string[];

  @property({
    type: 'array',
    itemType: 'string',
  })
  dosham?: string[];

  @property({
    type: 'array',
    itemType: 'string',
  })
  star?: string[];

  @property({
    type: 'array',
    itemType: 'string',
  })
  education?: string[];

  @property({
    type: 'array',
    itemType: 'string',
  })
  employed_in?: string[];

  @property({
    type: 'array',
    itemType: 'string',
  })
  occupation?: string[];

  @property({
    type: 'string',
  })
  annual_income?: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  location?: string[];

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
