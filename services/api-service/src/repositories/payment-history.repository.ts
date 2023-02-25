import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDbConnectionDataSource} from '../datasources';
import {PaymentHistory, PaymentHistoryRelations} from '../models';

export class PaymentHistoryRepository extends DefaultCrudRepository<
  PaymentHistory,
  typeof PaymentHistory.prototype.id,
  PaymentHistoryRelations
> {
  constructor(
    @inject('datasources.MysqlDbConnection')
    dataSource: MysqlDbConnectionDataSource,
  ) {
    super(PaymentHistory, dataSource);
  }
}
