import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../roles/roles.enum';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<UserEntity>;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    preload: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpia los mocks después de cada prueba
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const createUserDto: CreateUserDto = {
        id:'1',
        role: Role.USER,
        email: 'test@example.com',
        password: 'securePassword',
      };
      const savedUser = new UserEntity();
      
      mockUserRepository.create.mockReturnValue(savedUser);
      mockUserRepository.save.mockResolvedValue(savedUser);

      const result = await service.create(createUserDto);
      expect(result).toBe(savedUser);
      expect(mockUserRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(mockUserRepository.save).toHaveBeenCalledWith(savedUser);
    });

    it('should throw NotFoundException if role is invalid', async () => {
      const createUserDto: CreateUserDto = {
        id: '1',
        role: 'invalid_role' as Role,
        email: 'invalid-email',
        password: 'securePassword'};

      await expect(service.create(createUserDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on save error', async () => {
      const createUserDto: CreateUserDto = {
        id: '1',
        role: Role.USER,
        email: 'test@example.com',
        password: '1234' };
      const errorMessage = 'Error saving user';

      mockUserRepository.create.mockReturnValue({});
      mockUserRepository.save.mockRejectedValue(new Error(errorMessage));

      await expect(service.create(createUserDto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [new UserEntity(), new UserEntity()];
      mockUserRepository.find.mockResolvedValue(users);

      const result = await service.findAll();
      expect(result).toBe(users);
      expect(mockUserRepository.find).toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException on find error', async () => {
      const errorMessage = 'Error finding users';
      mockUserRepository.find.mockRejectedValue(new Error(errorMessage));

      await expect(service.findAll()).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const userId = '1';
      const user = new UserEntity();
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.findOne(userId);
      expect(result).toBe(user);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = '1';
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(userId)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on findOne error', async () => {
      const userId = '1';
      const errorMessage = 'Error finding user';
      mockUserRepository.findOne.mockRejectedValue(new Error(errorMessage));

      await expect(service.findOne(userId)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('update', () => {
    it('should update a user successfully', async () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = {
        id: '1',
        role: Role.ADMIN };
      const user = new UserEntity();
      mockUserRepository.preload.mockResolvedValue(user);
      mockUserRepository.save.mockResolvedValue(user);

      const result = await service.update(userId, updateUserDto);
      expect(result).toBe(user);
      expect(mockUserRepository.preload).toHaveBeenCalledWith({ id: userId, ...updateUserDto });
      expect(mockUserRepository.save).toHaveBeenCalledWith(user);
    });

    it('should throw NotFoundException if user not found on update', async () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = { role: Role.ADMIN }; // otros campos
      mockUserRepository.preload.mockResolvedValue(null);

      await expect(service.update(userId, updateUserDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on update error', async () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = { role: Role.ADMIN }; // otros campos
      const errorMessage = 'Error updating user';
      mockUserRepository.preload.mockResolvedValue(new UserEntity());
      mockUserRepository.save.mockRejectedValue(new Error(errorMessage));

      await expect(service.update(userId, updateUserDto)).rejects.toThrow(InternalServerErrorException);
    });
    it('should throw NotFoundException if role is invalid during update', async () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = { role: 'invalid_role' as Role }; // Rol no válido
      mockUserRepository.preload.mockResolvedValue(new UserEntity());
  
      await expect(service.update(userId, updateUserDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a user successfully', async () => {
      const userId = '1';
      const user = new UserEntity();
      mockUserRepository.findOne.mockResolvedValue(user);
      mockUserRepository.remove.mockResolvedValue(undefined);

      await service.remove(userId);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
      expect(mockUserRepository.remove).toHaveBeenCalledWith(user);
    });

    it('should throw InternalServerErrorException on remove error', async () => {
      const userId = '1';
      const errorMessage = 'Error removing user';
      mockUserRepository.findOne.mockResolvedValue(new UserEntity());
      mockUserRepository.remove.mockRejectedValue(new Error(errorMessage));

      await expect(service.remove(userId)).rejects.toThrow(InternalServerErrorException);
    });
  });
});
