import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDbConnectionDataSource} from '../datasources';
import {Profiles, ProfilesRelations} from '../models';
import {profileColumns} from '../data/sql-query';

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

  async getHoroscopic(
    gender: string,
    ids: number[],
    profile_id: number,
  ): Promise<Profiles[]> {
    let query = `SELECT ${profileColumns} FROM profile p LEFT JOIN shortlist sh  ON p.id = sh.short_id AND sh.profile_id = ${profile_id}  WHERE gender = '${gender}' AND star IN (${ids.join()})`;
    return this.dataSource.execute(query);
  }
}
