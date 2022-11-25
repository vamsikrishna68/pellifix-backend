import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDbConnectionDataSource} from '../datasources';
import {PaymentPageViewed, PaymentPageViewedRelations} from '../models';
import {profileColumns} from '../data/sql-query';

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

  async profileList(): Promise<Object[]> {
    let query = `SELECT ppv.id, ppv.notified, ppv.viewed, ppv.view_count,ppv.created_at, p.id profile_id, p.name,p.mobileno, p.email_id FROM payament_page_viewed ppv JOIN profile p ON p.id = ppv.pro_id WHERE ppv.notified = 0 AND ppv.viewed = 1 AND p.is_membership = 0 ORDER BY created_at DESC`;
    return await this.dataSource.execute(query);
  }
}
