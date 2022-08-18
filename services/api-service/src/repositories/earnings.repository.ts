import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDbConnectionDataSource} from '../datasources';
import {Earnings, EarningsRelations} from '../models';

export class EarningsRepository extends DefaultCrudRepository<
  Earnings,
  typeof Earnings.prototype.admin_id,
  EarningsRelations
> {
  constructor(
    @inject('datasources.MysqlDbConnection') dataSource: MysqlDbConnectionDataSource,
  ) {
    super(Earnings, dataSource);
  }
}
