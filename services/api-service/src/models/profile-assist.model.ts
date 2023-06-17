import {Entity, model, property} from '@loopback/repository';

@model({name: 'profile_assist', settings: {strict: false}})
export class ProfileAssist extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: false,
  })
  id?: number;

  @property({
    type: 'number',
    required: true,
  })
  profile_id: number;

  @property({
    type: 'number',
    required: true,
  })
  selected_id: number;

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

  constructor(data?: Partial<ProfileAssist>) {
    super(data);
  }
}

export interface ProfileAssistRelations {
  // describe navigational properties here
}

export type ProfileAssistWithRelations = ProfileAssist & ProfileAssistRelations;
