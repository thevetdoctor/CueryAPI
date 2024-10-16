import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  IsUUID,
} from 'sequelize-typescript';

@Table({
  tableName: 'Records',
  timestamps: true,
})
export class Record extends Model {
  @PrimaryKey
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  subscriber_id?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  subscriber_name?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  service_type?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  plan_name?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  eligibility_date?: string;
}
