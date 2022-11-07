import {Entity, model, property} from '@loopback/repository';

@model({name: 'profile_views'})
export class ProfileViews extends Entity {
  // login user viewed profile id
  @property({
    type: 'number',
    id: true,
    generated: false,
    required: true,
  })
  profile_id: number;

  // login user Id
  @property({
    type: 'number',
    required: true,
  })
  viewer_id: number;

  constructor(data?: Partial<ProfileViews>) {
    super(data);
  }
}

export interface ProfileViewsRelations {
  // describe navigational properties here
}

export type ProfileViewsWithRelations = ProfileViews & ProfileViewsRelations;
