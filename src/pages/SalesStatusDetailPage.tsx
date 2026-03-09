import { NavLink, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SALES_ROWS, formatPrice } from "@/pages/sales-status-data";

const VAT_RATE = 0.1;

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="mt-1 font-medium">{children}</dd>
        </div>
    );
}

export function SalesStatusDetailPage() {
    const { salesId } = useParams();
    const sales = SALES_ROWS.find((row) => row.id === salesId);

    if (!sales) {
        return (
            <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <h1 className="text-2xl font-bold tracking-tight">결제 상세</h1>
                <div className="rounded-lg border bg-card p-6">
                    <p className="text-muted-foreground">결제 정보를 찾을 수 없습니다.</p>
                    <div className="mt-4">
                        <Button asChild variant="outline">
                            <NavLink to="/sales/status">목록으로</NavLink>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const subtotal = Math.round(sales.finalPrice / (1 + VAT_RATE));
    const vat = sales.finalPrice - subtotal;

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">결제 상세</h1>
                <p className="text-muted-foreground">
                    {sales.orderNumber} 주문의 결제 상세 정보를 확인합니다.
                </p>
            </div>

            <div className="rounded-lg border bg-card p-6">
                <dl className="grid gap-6 md:grid-cols-2">
                    {/* 주문 번호 */}
                    <InfoRow label="주문 번호">
                        <span className="font-mono text-sm">{sales.orderNumber}</span>
                    </InfoRow>

                    {/* 기관명 */}
                    <InfoRow label="기관명">—</InfoRow>

                    {/* 결제 상태 */}
                    <InfoRow label="결제 상태">
                        <span
                            className={
                                sales.paymentStatus === "결제완료"
                                    ? "inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700"
                                    : sales.paymentStatus === "결제대기"
                                      ? "inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700"
                                      : sales.paymentStatus === "결제실패"
                                        ? "inline-flex rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700"
                                        : "inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700"
                            }>
                            {sales.paymentStatus}
                        </span>
                    </InfoRow>

                    {/* 결제 방법 */}
                    <InfoRow label="결제 방법">{sales.paymentMethod}</InfoRow>

                    {/* 주문일 */}
                    <InfoRow label="주문일">{sales.orderDate}</InfoRow>

                    {/* 이용기간 */}
                    <InfoRow label="이용기간">
                        {sales.startDate} ~ {sales.expiryDate}
                    </InfoRow>

                    {/* 상품명 */}
                    <div className="md:col-span-2">
                        <dt className="text-sm text-muted-foreground">상품명</dt>
                        <dd className="mt-2 flex flex-wrap gap-1">
                            {sales.productNames.map((product) => (
                                <Badge key={`${sales.id}-${product}`} variant="secondary">
                                    {product}
                                </Badge>
                            ))}
                        </dd>
                    </div>

                    {/* 금액 */}
                    <div className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-4 text-sm md:col-span-2">
                        <h3 className="font-semibold">결제 금액</h3>
                        <div className="space-y-1.5 border-t pt-3">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">공급가액 (VAT 제외)</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                    부가세 (VAT {VAT_RATE * 100}%)
                                </span>
                                <span>{formatPrice(vat)}</span>
                            </div>
                            <div className="flex items-center justify-between border-t pt-2 font-semibold">
                                <span>최종 금액</span>
                                <span className="text-base">{formatPrice(sales.finalPrice)}</span>
                            </div>
                        </div>
                    </div>

                    {/* 메모 */}
                    <div className="md:col-span-2">
                        <dt className="text-sm text-muted-foreground">메모</dt>
                        <dd className="mt-1 min-h-10 whitespace-pre-wrap rounded-md border bg-muted/20 px-3 py-2 text-sm">
                            {"memo" in sales && sales.memo ? String(sales.memo) : "—"}
                        </dd>
                    </div>
                </dl>
            </div>

            <div className="flex items-center justify-end gap-2">
                <Button asChild variant="outline">
                    <NavLink to="/sales/status">목록으로</NavLink>
                </Button>
                <Button asChild>
                    <NavLink to={`/sales/status/${sales.id}/edit`}>수정하기</NavLink>
                </Button>
            </div>
        </div>
    );
}
