import {inject} from '@loopback/core';
import {DefaultCrudRepository, Filter} from '@loopback/repository';
import {MysqlDbConnectionDataSource} from '../datasources';
import {Earnings, EarningsRelations} from '../models';

export class EarningsRepository extends DefaultCrudRepository<
  Earnings,
  typeof Earnings.prototype.admin_id,
  EarningsRelations
> {
  constructor(
    @inject('datasources.MysqlDbConnection')
    dataSource: MysqlDbConnectionDataSource,
  ) {
    super(Earnings, dataSource);
  }

  async getEarnings(
    id: number,
    type: string,
    filter?: Filter,
  ): Promise<Object[]> {
    let query = `SELECT  date, ${
      type === 'DAY' ? 'amount' : 'SUM(amount) amount'
    }  FROM earnings WHERE admin_id = ${id} `;

    if (type == 'MONTH') {
      query += ` GROUP BY YEAR(date), MONTH(date)`;
    }
    if (type == 'YEAR') {
      query += ` GROUP BY YEAR(date)`;
    }
    return this.dataSource.execute(query);
  }
}
