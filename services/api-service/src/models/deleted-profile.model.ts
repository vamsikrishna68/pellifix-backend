import {Entity, model, property} from '@loopback/repository';

@model({name: 'deleted_profile'})
export class DeletedProfile extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;

  @property({
    type: 'object',
  })
  profile_info: object;

  @property({
    type: 'string',
  })
  reason: string;

  @property({
    type: 'string',
  })
  deleted_by: string;

  @property({
    type: 'number',
  })
  deleted_admin_id: number;

  @property({
    type: 'date',
  })
  created_at?: string;

  constructor(data?: Partial<DeletedProfile>) {
    super(data);
  }
}

export interface DeletedProfileRelations {
  // describe navigational properties here
}

export type DeletedProfileWithRelations = DeletedProfile &
  DeletedProfileRelations;
