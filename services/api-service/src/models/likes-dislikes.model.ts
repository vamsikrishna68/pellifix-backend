import {Entity, model, property} from '@loopback/repository';

@model({name: 'likes_dislikes'})
export class LikesDislikes extends Entity {
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

  constructor(data?: Partial<LikesDislikes>) {
    super(data);
  }
}

export interface LikesDislikesRelations {
  // describe navigational properties here
}

export type LikesDislikesWithRelations = LikesDislikes & LikesDislikesRelations;
