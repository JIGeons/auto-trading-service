import axios from 'axios';

export type UpbitCandle = {
  market: string;           // "KRW-BTC"
  candle_date_time_utc: string; // "2024-08-27T12:34:00"
  opening_price: number;
  high_price: number;
  low_price: number;
  trade_price: number;      // close
  candle_acc_trade_volume: number;
};

export class UpbitClient {
  private http = axios.create({
    baseURL: 'https://api.upbit.com/v1',
    timeout: 10_000,
    headers: { 'Accept': 'application/json' },
  });

  /**
   * 최근 분봉 N개 조회 (최대 200)
   */
  async getMinuteCandles(unit: number, market: string, count = 200): Promise<UpbitCandle[]> {
    // GET /v1/candles/minutes/{unit}?market=KRW-BTC&count=200
    const { data } = await this.http.get(`/candles/minutes/${unit}`, {
      params: { market, count },
      // Upbit는 최신 → 과거 순으로 반환
      // 응답 예시는 https://docs.upbit.com/reference 참고
    });
    return data as UpbitCandle[];
  }
}
