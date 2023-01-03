import {inject} from '@loopback/core';
import {DefaultCrudRepository, Filter} from '@loopback/repository';
import {MysqlDbConnectionDataSource} from '../datasources';
import {Profiles, Shortlist, ShortlistRelations} from '../models';
import {profileColumns} from '../data/sql-query';

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

  async getShortlist(ids: number[], filter?: Filter): Promise<Profiles[]> {
    let query = `SELECT ${profileColumns} FROM profile p LEFT JOIN shortlist sh  ON p.id = sh.short_id WHERE p.id IN (${ids})`;
    return this.dataSource.execute(query);
  }
}
