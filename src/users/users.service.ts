import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from '../roles/roles.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto):Promise<UserEntity> {
    try {
      // Validar que el rol está en el enum
      if (!Object.values(Role).includes(createUserDto.role)) {
        throw new NotFoundException('Role not found');
      }
      const newUser = this.userRepository.create({ ...createUserDto });
      return await this.userRepository.save(newUser);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Lanza la excepción de rol no encontrado
     }
    throw new InternalServerErrorException('Error creating user', error.message);
      
    }
  }

  async findAll(): Promise<UserEntity[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Error finding users', error.message);
    }
  }

  async findOne(id: string): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error finding user', error.message);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto):Promise<UserEntity> {
    try {
      const user = await this.userRepository.preload({ id, ...updateUserDto });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // Validar el rol si se está actualizando
      if (updateUserDto.role && !Object.values(Role).includes(updateUserDto.role)) {
        throw new NotFoundException('Role not found');
      }

      return await this.userRepository.save(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating user', error.message);
    }
  }

  async remove(id: string): Promise<void> {// void es Para métodos que no devuelven datos
    try {
      const user = await this.findOne(id);
      await this.userRepository.remove(user);
    } catch (error) {
      throw new InternalServerErrorException('Error removing user', error.message);
    }
  }
}
