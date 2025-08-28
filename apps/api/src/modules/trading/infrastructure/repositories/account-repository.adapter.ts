import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountRepositoryPort } from '../../domain/repositories/account-repository.port';
import { Account } from '../../domain/entities/account';
import { AccountOrmEntity } from '../orm/account.orm-entity';
import { AccountId } from '../../domain/value-objects/account-id';

@Injectable()
export class AccountRepositoryAdapter implements AccountRepositoryPort {
  constructor(
    @InjectRepository(AccountOrmEntity)
    private readonly accountRepository: Repository<AccountOrmEntity>,
  ) {}

  async save(account: Account): Promise<void> {
    const ormEntity = this.toOrmEntity(account);
    await this.accountRepository.save(ormEntity);
  }

  async findById(accountId: AccountId): Promise<Account | null> {
    const ormEntity = await this.accountRepository.findOne({
      where: { id: accountId.value },
    });
    return ormEntity ? this.toDomainEntity(ormEntity) : null;
  }

  async findByName(name: string): Promise<Account | null> {
    const ormEntity = await this.accountRepository.findOne({
      where: { name },
    });
    return ormEntity ? this.toDomainEntity(ormEntity) : null;
  }

  private toOrmEntity(account: Account): AccountOrmEntity {
    const ormEntity = new AccountOrmEntity();
    ormEntity.id = account.id.value;
    ormEntity.name = account.name;
    ormEntity.balance = account.balance;
    ormEntity.createdAt = account.createdAt;
    ormEntity.updatedAt = account.updatedAt;
    return ormEntity;
  }

  private toDomainEntity(ormEntity: AccountOrmEntity): Account {
    return Account.fromPersistence(
      new AccountId(ormEntity.id),
      ormEntity.name,
      ormEntity.balance,
      ormEntity.createdAt,
      ormEntity.updatedAt,
    );
  }
}
