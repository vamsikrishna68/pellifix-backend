import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDbConnectionDataSource} from '../datasources';
import {SubscriptionPrice, SubscriptionPriceRelations} from '../models';

export class SubscriptionPriceRepository extends DefaultCrudRepository<
  SubscriptionPrice,
  typeof SubscriptionPrice.prototype.pro_id,
  SubscriptionPriceRelations
> {
  constructor(
    @inject('datasources.MysqlDbConnection')
    dataSource: MysqlDbConnectionDataSource,
  ) {
    super(SubscriptionPrice, dataSource);
  }
}
