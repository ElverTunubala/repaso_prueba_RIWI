
import { Role } from 'src/roles/roles.enum';
import {Entity,Column,PrimaryGeneratedColumn} from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;
  
    @Column()
    password: string;
    
    @Column({type: 'enum',enum: Role})
    role: Role;
}