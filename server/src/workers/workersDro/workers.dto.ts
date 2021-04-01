import { IsNotEmpty } from 'class-validator';

export class WorkersDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  departmentId: string;
}
