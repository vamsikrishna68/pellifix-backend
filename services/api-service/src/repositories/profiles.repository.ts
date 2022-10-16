import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDbConnectionDataSource} from '../datasources';
import {Profiles, ProfilesRelations} from '../models';

export class ProfilesRepository extends DefaultCrudRepository<
  Profiles,
  typeof Profiles.prototype.id,
  ProfilesRelations
> {
  constructor(
    @inject('datasources.MysqlDbConnection')
    dataSource: MysqlDbConnectionDataSource,
  ) {
    super(Profiles, dataSource);
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

  async getHoroscopic(gender: string, ids: number[]): Promise<Profiles[]> {
    let query = `SELECT ${
      this.columns
    } FROM profile WHERE gender = ${gender} AND star IN (${ids.join()})`;
    return this.dataSource.execute(query);
  }
}
