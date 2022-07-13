import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDbConnectionDataSource} from '../datasources';
import {Preference, PreferenceRelations} from '../models';

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

  columns = [
    'id',
    'profile_id',
    'profile_creater',
    'name',
    'marital_status',
    'body_type',
    'dob',
    'age',
    'physical_status',
    'height',
    'weight',
    'religion',
    'caste',
    'sub_caste',
    'zodiac',
    'star',
    'country',
    'city',
    'state',
    'education',
    'occupation',
    'image',
    'about_me',
    'is_membership',
    'gender',
    'profession',
  ];

  async getDailyRecomentation(gender: string, filter: Preference) {
    let query = `SELECT ${this.columns} FROM profile WHERE gender = '${gender}' `;
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
