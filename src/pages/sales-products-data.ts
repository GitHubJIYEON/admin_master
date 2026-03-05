export type ProductStatus = "사용" | "미사용";

export type ProductRow = {
    id: string;
    status: ProductStatus;
    productCode: string;
    productName: string;
    category: string;
    price: number;
    updatedAt: string;
};

export const PRODUCT_ROWS: ProductRow[] = [
    {
        id: "survey-basix",
        status: "사용",
        productCode: "SURVEY",
        productName: "설문",
        category: "설문",
        price: 100000,
        updatedAt: "2026-03-01",
    },
    {
        id: "analysis-basic",
        status: "사용",
        productCode: "ANALYSIS-BASIC",
        productName: "기본분석",
        category: "분석",
        price: 100000,
        updatedAt: "2026-03-01",
    },
    {
        id: "analysis-advanced",
        status: "사용",
        productCode: "ANALYSIS-ADVANCED",
        productName: "고급분석",
        category: "분석",
        price: 100000,
        updatedAt: "2026-03-01",
    },
    {
        id: "satisfaction-analysis",
        status: "사용",
        productCode: "ANALYSIS-SATISFACTION",
        productName: "만족도 분석",
        category: "분석",
        price: 100000,
        updatedAt: "2026-03-02",
    },
    {
        id: "survey-satisfaction",
        status: "미사용",
        productCode: "SURVEY-SATISFACTION",
        productName: "설문 만족도 분석",
        category: "설문",
        price: 100000,
        updatedAt: "2026-03-02",
    },
    {
        id: "text-mining",
        status: "미사용",
        productCode: "TEXT-MINING",
        productName: "텍스트마이닝",
        category: "서비스",
        price: 100000,
        updatedAt: "2026-03-02",
    },
];

export function formatPrice(price: number) {
    return `${price.toLocaleString("ko-KR")}원`;
}
