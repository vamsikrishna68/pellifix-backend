import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDbConnectionDataSource} from '../datasources';
import {DeletedProfile, DeletedProfileRelations} from '../models';

export class DeletedProfileRepository extends DefaultCrudRepository<
  DeletedProfile,
  typeof DeletedProfile.prototype.id,
  DeletedProfileRelations
> {
  constructor(
    @inject('datasources.MysqlDbConnection')
    dataSource: MysqlDbConnectionDataSource,
  ) {
    super(DeletedProfile, dataSource);
  }
}
