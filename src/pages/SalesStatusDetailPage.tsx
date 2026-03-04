import { NavLink, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SALES_ROWS, formatPrice } from "@/pages/sales-status-data";

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

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">결제 상세</h1>
                <p className="text-muted-foreground">
                    {sales.orderNumber} 주문의 결제 상세 정보를 확인합니다.
                </p>
            </div>

            <div className="rounded-lg border bg-card p-6">
                <dl className="grid gap-4 md:grid-cols-2">
                    <div>
                        <dt className="text-sm text-muted-foreground">주문번호</dt>
                        <dd className="mt-1 font-medium">{sales.orderNumber}</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">결제 상태</dt>
                        <dd className="mt-1 font-medium">{sales.paymentStatus}</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">결제방법</dt>
                        <dd className="mt-1 font-medium">{sales.paymentMethod}</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">주문일</dt>
                        <dd className="mt-1 font-medium">{sales.orderDate}</dd>
                    </div>
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
                    <div>
                        <dt className="text-sm text-muted-foreground">서비스 가격</dt>
                        <dd className="mt-1 font-medium">{formatPrice(sales.servicePrice)}</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">이용기간</dt>
                        <dd className="mt-1 font-medium">
                            {sales.startDate} ~ {sales.expiryDate}
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
