import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDbConnectionDataSource} from '../datasources';
import {Profiles, ProfilesRelations} from '../models';
import {profileColumns} from '../data/sql-query';
import {CustomeFilter} from '../types';

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
    filter: CustomeFilter,
  ): Promise<Profiles[]> {
    let query = `SELECT ${profileColumns} FROM profile p LEFT JOIN shortlist sh  ON p.id = sh.short_id AND sh.profile_id = ${profile_id}  WHERE gender = '${gender}' AND star IN (${ids.join()})`;
    if (filter && filter.limit && filter.skip) {
      query += ` LIMIT ${filter.skip},${filter.limit}`;
    }
    return this.dataSource.execute(query);
  }

  async getHoroscopicCount(
    gender: string,
    ids: number[],
    profile_id: number,
  ): Promise<Profiles[]> {
    let query = `SELECT count(*) count FROM profile p LEFT JOIN shortlist sh  ON p.id = sh.short_id AND sh.profile_id = ${profile_id}  WHERE gender = '${gender}' AND star IN (${ids.join()})`;
    const result: any = await this.dataSource.execute(query);
    return result[0] && result[0].count ? result[0].count : 0;
  }
}
