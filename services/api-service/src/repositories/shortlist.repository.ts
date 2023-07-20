import {inject} from '@loopback/core';
import {DefaultCrudRepository, Filter} from '@loopback/repository';
import {MysqlDbConnectionDataSource} from '../datasources';
import {Profiles, Shortlist, ShortlistRelations} from '../models';
import {profileColumns} from '../data/sql-query';

export class ShortlistRepository extends DefaultCrudRepository<
  Shortlist,
  typeof Shortlist.prototype.id,
  ShortlistRelations
> {
  constructor(
    @inject('datasources.MysqlDbConnection')
    dataSource: MysqlDbConnectionDataSource,
  ) {
    super(Shortlist, dataSource);
  }

  async getShortlist(
    profileId: number,
    ids: number[],
    filter?: Filter,
  ): Promise<(Profiles & Shortlist)[]> {
    let query = `SELECT ${profileColumns} FROM profile p LEFT JOIN shortlist sh  ON p.id = sh.short_id WHERE sh.is_liked = 1 AND p.id IN (${ids}) AND sh.profile_id =${profileId}`;
    return this.dataSource.execute(query);
  }
}
