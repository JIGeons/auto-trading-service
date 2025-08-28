export class GetCandlesQuery {
  constructor(
    public readonly instrumentId: string,
    public readonly tf: string,
    public readonly from: Date,
    public readonly to: Date,
  ) {}
}
