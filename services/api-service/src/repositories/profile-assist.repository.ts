import {inject} from '@loopback/core';
import {DefaultCrudRepository, Filter} from '@loopback/repository';
import {MysqlDbConnectionDataSource} from '../datasources';
import {ProfileAssist, ProfileAssistRelations, Profiles} from '../models';
import {profileColumns} from '../data/sql-query';

export class ProfileAssistRepository extends DefaultCrudRepository<
  ProfileAssist,
  typeof ProfileAssist.prototype.id,
  ProfileAssistRelations
> {
  constructor(
    @inject('datasources.MysqlDbConnection')
    dataSource: MysqlDbConnectionDataSource,
  ) {
    super(ProfileAssist, dataSource);
  }

  async getProfileAssist(ids: number[], filter?: Filter): Promise<Profiles[]> {
    let query = `SELECT ${profileColumns} FROM profile p LEFT JOIN shortlist sh  ON p.id = sh.short_id WHERE p.id IN (${ids})`;
    return this.dataSource.execute(query);
  }
}
