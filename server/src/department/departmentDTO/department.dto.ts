import { IsNotEmpty } from 'class-validator';

export class DepDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  bossId: string;
}
