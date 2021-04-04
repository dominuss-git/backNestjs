import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  surname: string;

  @Column()
  skils: string;

  @Column()
  addressId: string;

  @Column({ type: 'date', default: new Date(Date.now()) })
  date: Date;
}
