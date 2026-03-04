import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PRODUCT_ROWS, formatPrice } from "@/pages/sales-products-data";

export function SalesProductsPage() {
    const [keyword, setKeyword] = useState("");
    const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});

    const filteredRows = useMemo(() => {
        const normalizedKeyword = keyword.trim().toLowerCase();

        if (!normalizedKeyword) {
            return PRODUCT_ROWS;
        }

        return PRODUCT_ROWS.filter((row) => {
            return (
                row.productCode.toLowerCase().includes(normalizedKeyword) ||
                row.productName.toLowerCase().includes(normalizedKeyword)
            );
        });
    }, [keyword]);

    const selectedCount = filteredRows.filter((row) => selectedIds[row.id]).length;
    const isAllChecked =
        filteredRows.length > 0 && filteredRows.every((row) => selectedIds[row.id]);

    const handleAllCheck = (checked: boolean) => {
        setSelectedIds((prev) => {
            const next = { ...prev };

            filteredRows.forEach((row) => {
                next[row.id] = checked;
            });

            return next;
        });
    };

    const handleRowCheck = (id: string, checked: boolean) => {
        setSelectedIds((prev) => ({ ...prev, [id]: checked }));
    };

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">상품관리</h1>
                    <p className="text-muted-foreground">
                        판매 상품의 사용 여부, 재고, 가격 정보를 관리합니다.
                    </p>
                </div>
                <Button asChild type="button">
                    <NavLink to="/sales/products/new">상품 등록</NavLink>
                </Button>
            </div>

            <div className="rounded-lg border bg-card p-4">
                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <Input
                        value={keyword}
                        onChange={(event) => setKeyword(event.target.value)}
                        placeholder="상품코드 또는 상품명 검색"
                        className="md:max-w-sm"
                    />
                    <p className="text-sm text-muted-foreground">
                        선택 {selectedCount}건 / 조회 {filteredRows.length}건
                    </p>
                </div>

                <div className="overflow-x-auto rounded-md border">
                    <table className="w-full min-w-[900px] border-collapse text-sm">
                        <thead className="bg-muted/50 text-foreground">
                            <tr className="border-b">
                                <th className="w-12 px-3 py-2.5 text-center font-medium">
                                    <input
                                        type="checkbox"
                                        aria-label="전체 선택"
                                        checked={isAllChecked}
                                        onChange={(event) => handleAllCheck(event.target.checked)}
                                    />
                                </th>
                                <th className="px-3 py-2.5 text-left font-medium">사용여부</th>
                                <th className="px-3 py-2.5 text-left font-medium">상품코드</th>
                                <th className="px-3 py-2.5 text-left font-medium">상품명</th>
                                <th className="px-3 py-2.5 text-left font-medium">카테고리</th>
                                <th className="px-3 py-2.5 text-left font-medium">판매가</th>
                                <th className="px-3 py-2.5 text-left font-medium">수정일</th>
                                <th className="w-28 px-3 py-2.5 text-center font-medium">
                                    상세보기
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRows.length > 0 ? (
                                filteredRows.map((row) => (
                                    <tr
                                        key={row.id}
                                        className="border-b last:border-0 hover:bg-muted/30">
                                        <td className="px-3 py-2.5 text-center">
                                            <input
                                                type="checkbox"
                                                aria-label={`${row.productName} 선택`}
                                                checked={Boolean(selectedIds[row.id])}
                                                onChange={(event) =>
                                                    handleRowCheck(row.id, event.target.checked)
                                                }
                                            />
                                        </td>
                                        <td className="px-3 py-2.5">
                                            <span
                                                className={
                                                    row.status === "사용"
                                                        ? "inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700"
                                                        : "inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600"
                                                }>
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2.5 font-mono text-xs">
                                            {row.productCode}
                                        </td>
                                        <td className="px-3 py-2.5">{row.productName}</td>
                                        <td className="px-3 py-2.5">{row.category}</td>
                                        <td className="px-3 py-2.5">{formatPrice(row.price)}</td>
                                        <td className="px-3 py-2.5">{row.updatedAt}</td>
                                        <td className="px-3 py-2.5 text-center">
                                            <Button asChild size="sm" variant="outline">
                                                <NavLink to={`/sales/products/${row.id}`}>
                                                    상세보기
                                                </NavLink>
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        className="h-24 px-3 py-2.5 text-center text-muted-foreground"
                                        colSpan={8}>
                                        검색 결과가 없습니다.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
