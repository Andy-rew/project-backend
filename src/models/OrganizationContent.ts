import {
  Model,
  Column,
  Table,
  AllowNull,
  ForeignKey,
  PrimaryKey,
  BelongsTo,
  Unique,
} from 'sequelize-typescript';

import { DB_SCHEMA } from '../util/secrets';
import { Organization } from './Organization';
import { ContentObject } from './ContentObject';

@Table({
  comment:
    'Промежуточная таблица между организацией и контентом (новостью/событием)',
  timestamps: false,
  schema: DB_SCHEMA,
})
export class OrganizationContent extends Model<OrganizationContent> {
  @BelongsTo(() => ContentObject)
  contentObject: ContentObject;

  @BelongsTo(() => Organization)
  organization: Organization;

  @PrimaryKey
  @ForeignKey(() => ContentObject)
  @AllowNull(false)
  @Unique
  @Column
  contentObjectId: number;

  @PrimaryKey
  @ForeignKey(() => Organization)
  @AllowNull(false)
  @Column
  organizationId: number;
}
