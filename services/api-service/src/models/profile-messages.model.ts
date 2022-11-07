import {Entity, model, property} from '@loopback/repository';

@model({name: 'profile_messages', settings: {strict: false}})
export class ProfileMessages extends Entity {
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
  chat_id: number;

  @property({
    type: 'number',
    required: true,
  })
  profile_id: number;

  @property({
    type: 'string',
    required: true,
  })
  message: string;

  @property({
    type: 'number',
  })
  sort?: number;

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

  constructor(data?: Partial<ProfileMessages>) {
    super(data);
  }
}

export interface ProfileMessagesRelations {
  // describe navigational properties here
}

export type ProfileMessagesWithRelations = ProfileMessages &
  ProfileMessagesRelations;
