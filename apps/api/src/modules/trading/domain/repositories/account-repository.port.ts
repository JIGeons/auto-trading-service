import { Account } from '../entities/account';
import { AccountId } from '../value-objects/account-id';

export interface AccountRepositoryPort {
  save(account: Account): Promise<void>;
  findById(accountId: AccountId): Promise<Account | null>;
  findByName(name: string): Promise<Account | null>;
}
