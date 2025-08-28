import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAccountQuery } from '../queries/GetAccount.query';
import { Account } from '../../domain/entities/account';
import type { AccountRepositoryPort } from '../../domain/repositories/account-repository.port';
import { AccountId } from '../../domain/value-objects/account-id';
import { Inject } from '@nestjs/common';

@QueryHandler(GetAccountQuery)
export class GetAccountHandler implements IQueryHandler<GetAccountQuery> {
  constructor(
    @Inject('AccountRepositoryPort')
    private readonly accountRepository: AccountRepositoryPort
  ) {}

  async execute(query: GetAccountQuery): Promise<Account | null> {
    const accountId = new AccountId(query.accountId);
    return this.accountRepository.findById(accountId);
  }
}
