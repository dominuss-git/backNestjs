import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Workers {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  userId: string;

  @Column()
  departmentId: string;

  @Column({ default: Date.now().toString() })
  date: string;
}
