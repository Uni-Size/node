import { describe, expect, it } from "vitest";
import { suggestedPurchaseQuantity } from "./orders";

describe("발주 제안 수량", () => {
  it("가용재고와 미입고 발주를 한 번씩만 차감한다", () => {
    expect(suggestedPurchaseQuantity(6, 2, 0)).toBe(4);
    expect(suggestedPurchaseQuantity(6, 2, 1)).toBe(3);
  });
  it("초과 재고가 있으면 0이다", () => expect(suggestedPurchaseQuantity(3, 5, 1)).toBe(0));
});
