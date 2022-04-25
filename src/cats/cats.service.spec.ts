import { Test, TestingModule } from '@nestjs/testing';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';

describe('CatsService', () => {
  let service: CatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CatsService],
    }).compile();

    service = module.get<CatsService>(CatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return empty list if no cats added', async () => {
    expect(await service.findAll()).toEqual([]);
  });

  it('should return a cat on create', async () => {
    const dto: CreateCatDto = { name: 'Test' };
    expect(await service.create(dto)).toEqual({ name: 'Test' });
  });

  it('should return a list of cats', async () => {
    const dto: CreateCatDto = { name: 'Test' };
    const dto2: CreateCatDto = { name: 'Test2' };
    await service.create(dto);
    await service.create(dto2);
    expect(await service.findAll()).toEqual([
      { name: 'Test' },
      { name: 'Test2' },
    ]);
  });

  it('should get the desired cat', async () => {
    const dto: CreateCatDto = { id: 1, name: 'Test' };
    const dto2: CreateCatDto = { id: 2, name: 'Test2' };
    await service.create(dto);
    await service.create(dto2);
    expect(await service.findOne(2)).toEqual({ id: 2, name: 'Test2' });
  });

  it('should return undefined if the cat does not exist', async () => {
    const dto: CreateCatDto = { id: 1, name: 'Test' };
    await service.create(dto);
    expect(await service.findOne(2)).toEqual(undefined);
  });

  it('should update correctly', async () => {
    const dto: CreateCatDto = { id: 1, name: 'Test' };
    await service.create(dto);
    expect(await service.update(1, { name: 'Test2' })).toEqual({
      id: 1,
      name: 'Test2',
    });
  });

  it('should delete correctly', async () => {
    const dto: CreateCatDto = { id: 1, name: 'Test' };
    await service.create(dto);
    await service.remove(1);
    expect(await service.findAll()).toEqual([]);
  });
});
