import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersService (unit)', () => {
  let service: UsersService;

  const prismaMock = {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should create user', async () => {
    const user = { id: 1, username: 'testuser' };

    prismaMock.user.create.mockResolvedValue(user);

    const result = await service.create({
      username: 'testuser',
      password: '123456',
    });

    expect(result).toEqual(user);
    expect(prismaMock.user.create).toHaveBeenCalled();
  });

  it('should find all users', async () => {
    prismaMock.user.findMany.mockResolvedValue([]);

    const result = await service.findAll();

    expect(result).toEqual([]);
  });

  it('should find one user', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: 1 });

    const result = await service.findOne(1);

    expect(result?.id).toBe(1);
  });

  it('should update user', async () => {
    prismaMock.user.update.mockResolvedValue({ id: 1, username: 'updated' });

    const result = await service.update(1, { username: 'updated' });

    expect(result.username).toBe('updated');
  });

  it('should delete user', async () => {
    prismaMock.user.delete.mockResolvedValue({ id: 1 });

    const result = await service.remove(1);

    expect(result.id).toBe(1);
  });
});
