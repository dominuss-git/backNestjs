import { Column, Entity, OneToOne, PrimaryGeneratedColumn, TableForeignKey } from "typeorm";
import { Adress } from '../adress/scheme/adress.entity';


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({unique: true})
  email: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  skils: string;

  @OneToOne(type => Adress, adress => adress.id)
  adress: string;
  
}