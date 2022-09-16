import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDbConnectionDataSource} from '../datasources';
import {Shortlist, ShortlistRelations} from '../models';

export class ShortlistRepository extends DefaultCrudRepository<
  Shortlist,
  typeof Shortlist.prototype.profile_id,
  ShortlistRelations
> {
  constructor(
    @inject('datasources.MysqlDbConnection')
    dataSource: MysqlDbConnectionDataSource,
  ) {
    super(Shortlist, dataSource);
  }
}
