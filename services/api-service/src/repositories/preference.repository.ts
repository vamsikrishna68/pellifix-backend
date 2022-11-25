import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDbConnectionDataSource} from '../datasources';
import {Preference, PreferenceRelations} from '../models';
import {profileColumns} from '../data/sql-query';

export class PreferenceRepository extends DefaultCrudRepository<
  Preference,
  typeof Preference.prototype.pro_id,
  PreferenceRelations
> {
  constructor(
    @inject('datasources.MysqlDbConnection')
    dataSource: MysqlDbConnectionDataSource,
  ) {
    super(Preference, dataSource);
  }

  async getDailyRecomentation(gender: string, filter: Preference) {
    let query = `SELECT ${profileColumns} FROM profile WHERE gender = '${gender}' `;
    if (filter) {
      if (filter.age) {
        const age: any = filter.age;
        query += ` AND age BETWEEN ${age.from} and ${age.to}`;
      }
      if (filter.height) {
        const height: any = filter.height;
        query += ` AND height BETWEEN ${height.from} and ${height.to}`;
      }
    }
  }
}
