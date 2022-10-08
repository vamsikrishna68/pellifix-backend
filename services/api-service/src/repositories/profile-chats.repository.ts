import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDbConnectionDataSource} from '../datasources';
import {ProfileChats, ProfileChatsRelations} from '../models';

export class ProfileChatsRepository extends DefaultCrudRepository<
  ProfileChats,
  typeof ProfileChats.prototype.id,
  ProfileChatsRelations
> {
  constructor(
    @inject('datasources.MysqlDbConnection') dataSource: MysqlDbConnectionDataSource,
  ) {
    super(ProfileChats, dataSource);
  }
}
