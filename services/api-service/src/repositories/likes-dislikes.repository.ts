import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDbConnectionDataSource} from '../datasources';
import {LikesDislikes, LikesDislikesRelations} from '../models';

export class LikesDislikesRepository extends DefaultCrudRepository<
  LikesDislikes,
  typeof LikesDislikes.prototype.profile_id,
  LikesDislikesRelations
> {
  constructor(
    @inject('datasources.MysqlDbConnection')
    dataSource: MysqlDbConnectionDataSource,
  ) {
    super(LikesDislikes, dataSource);
  }
}
