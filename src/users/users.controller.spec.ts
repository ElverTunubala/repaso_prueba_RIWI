import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Role } from '../roles/roles.enum';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpia los mocks después de cada prueba
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const createUserDto: CreateUserDto = {
        id: '1',
        role: Role.USER,
        email: 'test@example.com',
        password: 'securePassword'};
      const newUser = new UserEntity();
      mockUsersService.create.mockResolvedValue(newUser);

      const result = await controller.create(createUserDto);
      expect(result).toBe(newUser);
      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [new UserEntity(), new UserEntity()];
      mockUsersService.findAll.mockResolvedValue(users);

      const result = await controller.findAll();
      expect(result).toEqual(plainToInstance(UserEntity, users));
      expect(mockUsersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const userId = '1';
      const user = new UserEntity();
      mockUsersService.findOne.mockResolvedValue(user);

      const result = await controller.findOne(userId);
      expect(result).toBe(user);
      expect(mockUsersService.findOne).toHaveBeenCalledWith(userId);
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = '1';
      mockUsersService.findOne.mockRejectedValue(new NotFoundException(`User with ID ${userId} not found`));

      await expect(controller.findOne(userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user successfully', async () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = {
        id: userId,
        role: Role.ADMIN };
      const updatedUser = new UserEntity();
      mockUsersService.update.mockResolvedValue(updatedUser);

      const result = await controller.update(userId, updateUserDto);
      expect(result).toBe(updatedUser);
      expect(mockUsersService.update).toHaveBeenCalledWith(userId, updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove a user successfully', async () => {
      const userId = '1';
      mockUsersService.remove.mockResolvedValue(undefined);

      await controller.remove(userId);
      expect(mockUsersService.remove).toHaveBeenCalledWith(userId);
    });
  });
});
