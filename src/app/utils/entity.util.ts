import { IEntity } from 'src/app/models/onchat.model';

export class EntityUtil {

  /**
   * 根据更新时间来排序数组:时间越早，排名越高
   * @param a
   * @param b
   */
  static sortByUpdateTime: (a: IEntity, b: IEntity) => number = (a, b) => b.updateTime - a.updateTime;

  /**
   * 用于提升性能
   * 一般情况下，当数组内有变更时，Angular将会对整个DOM树加以重新渲染。
   * 如果加上trackBy方法，Angular将会知道具体的变更元素，
   * 并针对性地对此特定元素进行DOM刷新，提升页面渲染性能。
   * @param index
   * @param item
   */
  static trackBy: (index: number, item: IEntity) => number = (index, item) => item.id;
}