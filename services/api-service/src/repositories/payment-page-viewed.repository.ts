import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDbConnectionDataSource} from '../datasources';
import {PaymentPageViewed, PaymentPageViewedRelations} from '../models';

export class PaymentPageViewedRepository extends DefaultCrudRepository<
  PaymentPageViewed,
  typeof PaymentPageViewed.prototype.id,
  PaymentPageViewedRelations
> {
  constructor(
    @inject('datasources.MysqlDbConnection')
    dataSource: MysqlDbConnectionDataSource,
  ) {
    super(PaymentPageViewed, dataSource);
  }
}
