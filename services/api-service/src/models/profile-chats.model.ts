import {Entity, model, property} from '@loopback/repository';

@model({name: 'profile_chats', settings: {strict: false}})
export class ProfileChats extends Entity {
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
  sender_id: number;

  @property({
    type: 'number',
    required: true,
  })
  receiver_id: number;

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

  constructor(data?: Partial<ProfileChats>) {
    super(data);
  }
}

export interface ProfileChatsRelations {
  // describe navigational properties here
}

export type ProfileChatsWithRelations = ProfileChats & ProfileChatsRelations;
