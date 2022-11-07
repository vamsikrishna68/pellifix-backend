import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDbConnectionDataSource} from '../datasources';
import {ProfileMessages, ProfileMessagesRelations} from '../models';

export class ProfileMessagesRepository extends DefaultCrudRepository<
  ProfileMessages,
  typeof ProfileMessages.prototype.id,
  ProfileMessagesRelations
> {
  constructor(
    @inject('datasources.MysqlDbConnection') dataSource: MysqlDbConnectionDataSource,
  ) {
    super(ProfileMessages, dataSource);
  }
}
