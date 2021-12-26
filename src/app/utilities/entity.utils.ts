import { IEntity } from 'src/app/models/onchat.model';

export class EntityUtils {

  /**
   * 根据更新时间来排序数组:时间越早，排名越高
   * @param a
   * @param b
   */
  static sortByUpdateTime: (a: IEntity, b: IEntity) => number = (a, b) => b.updateTime - a.updateTime;

}
