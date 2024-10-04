import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/roles/roles.enum'; // Importa el enum

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // Validar que el rol está en el enum
    if (!Object.values(Role).includes(createUserDto.role)) {
      throw new NotFoundException('Role not found');
    }

    // Crear y guardar el nuevo usuario
    const newUser = this.userRepository.create({ ...createUserDto });
    return this.userRepository.save(newUser);
  }

  async findAll() {
    // Devuelve todos los usuarios
    return this.userRepository.find(); // Puedes incluir relaciones si es necesario
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({ id, ...updateUserDto });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Validar el rol si se está actualizando
    if (updateUserDto.role && !Object.values(Role).includes(updateUserDto.role)) {
      throw new NotFoundException('Role not found');
    }

    return this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}
