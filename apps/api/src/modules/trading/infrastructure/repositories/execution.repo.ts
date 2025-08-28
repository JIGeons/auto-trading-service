import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExecutionEntity } from '../orm/execution.entity';

@Injectable()
export class ExecutionRepo {
  constructor(@InjectRepository(ExecutionEntity) private readonly repo: Repository<ExecutionEntity>) {}

  async save(exec: { orderId: string; qty: number; price: number; fee: number }) {
    await this.repo.save({ orderId: exec.orderId, qty: exec.qty.toString(), price: exec.price.toString(), fee: exec.fee.toString() });
  }
}


