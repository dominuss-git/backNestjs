import { IsEmail, IsNotEmpty } from 'class-validator';

export class DepartmentDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  bossEmail: string;

  @IsNotEmpty()
  type: string;
}
