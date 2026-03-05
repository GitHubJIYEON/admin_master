import { NavLink, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PRODUCT_ROWS, formatPrice } from "@/pages/sales-products-data";

export function SalesProductDetailPage() {
    const { productId } = useParams();
    const product = PRODUCT_ROWS.find((row) => row.id === productId);

    if (!product) {
        return (
            <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <h1 className="text-2xl font-bold tracking-tight">상품 상세</h1>
                <div className="rounded-lg border bg-card p-6">
                    <p className="text-muted-foreground">상품 정보를 찾을 수 없습니다.</p>
                    <div className="mt-4">
                        <Button asChild variant="outline">
                            <NavLink to="/sales/products">목록으로</NavLink>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">상품 상세</h1>
                <p className="text-muted-foreground">
                    {product.productName} 상품의 상세 정보를 확인합니다.
                </p>
            </div>

            <div className="rounded-lg border bg-card p-6">
                <dl className="grid gap-4 md:grid-cols-2">
                    <div>
                        <dt className="text-sm text-muted-foreground">상품코드</dt>
                        <dd className="mt-1 font-medium">{product.productCode}</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">상품명</dt>
                        <dd className="mt-1 font-medium">{product.productName}</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">카테고리</dt>
                        <dd className="mt-1 font-medium">{product.category}</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">사용여부</dt>
                        <dd className="mt-1 font-medium">{product.status}</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">판매가</dt>
                        <dd className="mt-1 font-medium">{formatPrice(product.price)}</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">수정일</dt>
                        <dd className="mt-1 font-medium">{product.updatedAt}</dd>
                    </div>
                </dl>
            </div>

            <div className="flex items-center justify-end gap-2">
                <Button asChild variant="outline">
                    <NavLink to="/sales/products">목록으로</NavLink>
                </Button>
            </div>
        </div>
    );
}
