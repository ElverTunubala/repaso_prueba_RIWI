import { IsNumber } from 'class-validator';
import { RegisterAuthDto } from 'src/auth/dto/register.dto';

export class CreateUserDto extends RegisterAuthDto {

    @IsNumber()
    public id: number;
}