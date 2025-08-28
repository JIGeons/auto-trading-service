# engine/main.py
from fastapi import FastAPI, Header
from pydantic import BaseModel
from typing import Optional
import uuid


app = FastAPI(title="Upbit Mock Engine")


class PlaceOrderRequest(BaseModel):
	instrumentId: str
	side: str # BUY | SELL
	size: float


@app.post('/order/place')
async def place(req: PlaceOrderRequest, Idempotency_Key: Optional[str] = Header(None)):
	# 실제 Upbit 주문 대신 모의 체결 ID 반환
	oid = f"paper-{uuid.uuid4()}"
	return {"ok": True, "orderId": oid}


class CancelOrderRequest(BaseModel):
	brokerOrderId: str


@app.post('/order/cancel')
async def cancel(req: CancelOrderRequest):
	return {"ok": True}