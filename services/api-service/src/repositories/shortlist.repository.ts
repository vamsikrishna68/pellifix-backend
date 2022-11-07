import {inject} from '@loopback/core';
import {DefaultCrudRepository, Filter} from '@loopback/repository';
import {MysqlDbConnectionDataSource} from '../datasources';
import {Profiles, Shortlist, ShortlistRelations} from '../models';
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
    'smoking_habit',
    'drinking_habit',
    'eating_habit',
    'salary',
    'height',
    'weight',
    'religion',
    'caste',
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
    'family_status',
    'gender',
    'profession',
    'family_type',
  ];

  async getShortlist(ids: number[], filter?: Filter): Promise<Profiles[]> {
    let query = `SELECT ${this.columns} FROM profile WHERE id IN (${ids})`;
    return this.dataSource.execute(query);
  }
}
