export type PaymentStatus = "결제완료" | "결제대기" | "결제실패" | "환불";
export type PaymentMethod = "카드" | "계좌이체" | "가상계좌" | "포인트";

export type SalesRow = {
    id: string;
    orderNumber: string;
    paymentStatus: PaymentStatus;
    paymentMethod: PaymentMethod;
    orderDate: string;
    productNames: string[];
    servicePrice: number;
    startDate: string;
    expiryDate: string;
};

export const SALES_ROWS: SalesRow[] = [
    {
        id: "SALE-001",
        orderNumber: "ORD-20260301-001",
        paymentStatus: "결제완료",
        paymentMethod: "카드",
        orderDate: "2026-03-01",
        productNames: ["설문", "기본분석"],
        servicePrice: 100000,
        startDate: "2026-03-01",
        expiryDate: "2027-02-28",
    },
    {
        id: "SALE-002",
        orderNumber: "ORD-20260301-002",
        paymentStatus: "결제대기",
        paymentMethod: "가상계좌",
        orderDate: "2026-03-01",
        productNames: ["기본분석"],
        servicePrice: 100000,
        startDate: "2026-03-02",
        expiryDate: "2027-03-01",
    },
    {
        id: "SALE-003",
        orderNumber: "ORD-20260302-001",
        paymentStatus: "결제완료",
        paymentMethod: "계좌이체",
        orderDate: "2026-03-02",
        productNames: ["고급분석", "만족도 분석"],
        servicePrice: 100000,
        startDate: "2026-03-02",
        expiryDate: "2027-03-01",
    },
    {
        id: "SALE-004",
        orderNumber: "ORD-20260302-002",
        paymentStatus: "환불",
        paymentMethod: "카드",
        orderDate: "2026-03-02",
        productNames: ["만족도 분석"],
        servicePrice: 100000,
        startDate: "2026-03-02",
        expiryDate: "2027-03-01",
    },
    {
        id: "SALE-005",
        orderNumber: "ORD-20260303-001",
        paymentStatus: "결제실패",
        paymentMethod: "카드",
        orderDate: "2026-03-03",
        productNames: ["텍스트마이닝", "설문"],
        servicePrice: 100000,
        startDate: "2026-03-03",
        expiryDate: "2027-03-02",
    },
];

export function formatPrice(price: number) {
    return `${price.toLocaleString("ko-KR")}원`;
}
