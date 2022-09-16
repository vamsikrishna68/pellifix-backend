import {Entity, model, property} from '@loopback/repository';

@model({name: 'likes_dislikes'})
export class Shortlist extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: false,
    required: true,
  })
  profile_id: number;

  @property({
    type: 'number',
    required: true,
  })
  liked_id: number;

  @property({
    type: 'boolean',
    required: true,
  })
  is_liked: boolean;

  constructor(data?: Partial<Shortlist>) {
    super(data);
  }
}

export interface ShortlistRelations {
  // describe navigational properties here
}

export type ShortlistWithRelations = Shortlist & ShortlistRelations;
