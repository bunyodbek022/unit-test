import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('User E2E (CRUD)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userId: number;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = app.get(PrismaService);

    await app.init();

    // test DB ni tozalash
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  it('CREATE user', async () => {
    const res = await request(app.getHttpServer())
      .post('/users')
      .send({
        username: 'e2euser',
        password: '123456',
      })
      .expect(201);

    userId = res.body.id;
    expect(res.body.username).toBe('e2euser');
  });

  it('READ all users', async () => {
    const res = await request(app.getHttpServer())
      .get('/users')
      .expect(200);

    expect(res.body.length).toBe(1);
  });

  it('READ one user', async () => {
    const res = await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .expect(200);

    expect(res.body.id).toBe(userId);
  });

  it('UPDATE user', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/users/${userId}`)
      .send({ username: 'updated-user' })
      .expect(200);

    expect(res.body.username).toBe('updated-user');
  });

  it('DELETE user', async () => {
    await request(app.getHttpServer())
      .delete(`/users/${userId}`)
      .expect(200);

    const users = await prisma.user.findMany();
    expect(users.length).toBe(0);
  });
});
