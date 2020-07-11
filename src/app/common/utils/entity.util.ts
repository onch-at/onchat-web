import { IEntity } from 'src/app/models/onchat.model';

export class EntityUtil {

    /**
     * 根据更新时间来排序数组
     * 时间越早，排名越高
     * @param entitys 
     */
    static sortByUpdateTime(entitys: IEntity[]): IEntity[] {
        return entitys.sort((a: IEntity, b: IEntity) => b.updateTime - a.updateTime);
    }
}