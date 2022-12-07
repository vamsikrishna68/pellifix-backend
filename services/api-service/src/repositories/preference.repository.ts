import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDbConnectionDataSource} from '../datasources';
import {Preference, PreferenceRelations, Profiles} from '../models';
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

  async getDailyRecomentation(
    gender: string,
    preference: Preference,
    profile_id: number,
  ): Promise<Profiles[]> {
    let query = `SELECT ${profileColumns} FROM profile p LEFT JOIN shortlist sh  ON p.id = sh.short_id AND sh.profile_id = ${profile_id}  WHERE p.gender = '${gender}' `;
    if (preference) {
      if (preference.age) {
        const age: any = preference.age;
        query += ` AND age BETWEEN ${age.from} and ${age.to}`;
      }
      if (preference.height) {
        const height: any = preference.height;
        query += ` AND height BETWEEN ${height.from} and ${height.to}`;
      }
    }
    return this.dataSource.execute(query);
  }
}
