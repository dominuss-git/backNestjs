import { IsEmail, IsNotEmpty } from 'class-validator';

export class DepartamentDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  bossEmail: string;

  @IsNotEmpty()
  type: string;
}
