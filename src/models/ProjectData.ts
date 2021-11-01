import {
  Model,
  Column,
  Table,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AllowNull,
  DataType,
} from 'sequelize-typescript';

import { DB_SCHEMA } from '../util/secrets';

@Table({
  comment: 'Настройки приложения',
  schema: DB_SCHEMA,
})
export class ProjectData extends Model<ProjectData> {
  @PrimaryKey
  @AllowNull(false)
  @Column
  title!: string;

  @AllowNull(false)
  @Column(DataType.JSONB)
  data: Record<string, any>;

  @Column
  updaterId?: number;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;
}
