import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PositionEntity } from '../orm/position.entity';

@Injectable()
export class PositionRepo {
  constructor(@InjectRepository(PositionEntity) private readonly repo: Repository<PositionEntity>) {}

  async findOpenByAccount(_accountId: string) {
    // NOTE: MVP에서는 account 연결 미구현 → 모든 포지션 반환(추후 accountId 컬럼 추가)
    return this.repo.find();
  }
}


