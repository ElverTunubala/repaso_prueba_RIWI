import { IsNumber } from 'class-validator';
import { RegisterAuthDto } from '../../auth/dto/register.dto';

export class CreateUserDto extends RegisterAuthDto {
    @IsNumber()
    public id: string;
}