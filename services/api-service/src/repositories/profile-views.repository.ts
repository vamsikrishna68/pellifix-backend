import {inject} from '@loopback/core';
import {DefaultCrudRepository, Filter} from '@loopback/repository';
import {MysqlDbConnectionDataSource} from '../datasources';
import {Profiles, ProfileViews, ProfileViewsRelations} from '../models';
import {profileColumns} from '../data/sql-query';

export class ProfileViewsRepository extends DefaultCrudRepository<
  ProfileViews,
  typeof ProfileViews.prototype.profile_id,
  ProfileViewsRelations
> {
  constructor(
    @inject('datasources.MysqlDbConnection')
    dataSource: MysqlDbConnectionDataSource,
  ) {
    super(ProfileViews, dataSource);
  }

  async getProfileViews(ids: number[], filter?: Filter): Promise<Profiles[]> {
    let query = `SELECT ${profileColumns} FROM profile WHERE id IN (${ids})`;
    return this.dataSource.execute(query);
  }
}
