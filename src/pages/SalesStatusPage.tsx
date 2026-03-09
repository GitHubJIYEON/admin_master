import { NavLink } from "react-router-dom";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SALES_ROWS, formatPrice } from "@/pages/sales-status-data";

export function SalesStatusPage() {
    const [keyword, setKeyword] = useState("");
    const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});

    const filteredRows = useMemo(() => {
        const normalizedKeyword = keyword.trim().toLowerCase();
        if (!normalizedKeyword) return SALES_ROWS;

        return SALES_ROWS.filter((row) => {
            return (
                row.orderNumber.toLowerCase().includes(normalizedKeyword) ||
                row.organizationName.toLowerCase().includes(normalizedKeyword) ||
                row.productNames.some((product) =>
                    product.toLowerCase().includes(normalizedKeyword),
                )
            );
        });
    }, [keyword]);

    const isAllChecked =
        filteredRows.length > 0 && filteredRows.every((row) => selectedIds[row.id]);
    const selectedCount = filteredRows.filter((row) => selectedIds[row.id]).length;

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
                    <h1 className="text-2xl font-bold tracking-tight">판매 현황</h1>
                    <p className="text-muted-foreground">
                        주문 및 결제 상태를 조회하고 서비스 이용 기간을 확인합니다.
                    </p>
                </div>
                <Button asChild type="button">
                    <NavLink to="/sales/status/new">결제 추가</NavLink>
                </Button>
            </div>

            <div className="rounded-lg border bg-card p-4">
                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <Input
                        value={keyword}
                        onChange={(event) => setKeyword(event.target.value)}
                        placeholder="주문번호, 기관명 또는 상품명 검색"
                        className="md:max-w-sm"
                    />
                    <p className="text-sm text-muted-foreground">
                        선택 {selectedCount}건 / 조회 {filteredRows.length}건
                    </p>
                </div>

                <div className="overflow-x-auto rounded-md border">
                    <table className="w-full min-w-[1200px] border-collapse text-sm">
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
                                <th className="w-16 px-3 py-2.5 text-center font-medium">번호</th>
                                <th className="px-3 py-2.5 text-left font-medium">주문번호</th>
                                <th className="px-3 py-2.5 text-left font-medium">기관명</th>
                                <th className="px-3 py-2.5 text-center font-medium">결제 상태</th>
                                <th className="px-3 py-2.5 text-center font-medium">결제방법</th>
                                <th className="px-3 py-2.5 text-center font-medium">주문일</th>
                                <th className="px-3 py-2.5 text-left font-medium">상품명</th>
                                <th className="px-3 py-2.5 text-right font-medium">최종 금액</th>
                                <th className="px-3 py-2.5 text-center font-medium">시작일</th>
                                <th className="px-3 py-2.5 text-center font-medium">만료일</th>
                                <th className="w-28 px-3 py-2.5 text-center font-medium">
                                    상세보기
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRows.length > 0 ? (
                                filteredRows.map((row, index) => (
                                    <tr
                                        key={row.id}
                                        className="border-b last:border-0 hover:bg-muted/30">
                                        <td className="px-3 py-2.5 text-center">
                                            <input
                                                type="checkbox"
                                                aria-label={`${row.orderNumber} 선택`}
                                                checked={Boolean(selectedIds[row.id])}
                                                onChange={(event) =>
                                                    handleRowCheck(row.id, event.target.checked)
                                                }
                                            />
                                        </td>
                                        <td className="px-3 py-2.5 text-center">{index + 1}</td>
                                        <td className="px-3 py-2.5 font-mono text-xs">
                                            {row.orderNumber}
                                        </td>
                                        <td className="px-3 py-2.5">{row.organizationName}</td>
                                        <td className="px-3 py-2.5 text-center">
                                            <span
                                                className={
                                                    row.paymentStatus === "결제완료"
                                                        ? "inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700"
                                                        : row.paymentStatus === "결제대기"
                                                          ? "inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700"
                                                          : row.paymentStatus === "결제실패"
                                                            ? "inline-flex rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700"
                                                            : "inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700"
                                                }>
                                                {row.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2.5 text-center">
                                            {row.paymentMethod}
                                        </td>
                                        <td className="px-3 py-2.5 text-center">{row.orderDate}</td>
                                        <td className="px-3 py-2.5">
                                            <div className="flex flex-wrap gap-1">
                                                {row.productNames.map((product) => (
                                                    <Badge
                                                        key={`${row.id}-${product}`}
                                                        variant="secondary">
                                                        {product}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-3 py-2.5 text-right">
                                            {formatPrice(row.finalPrice)}
                                        </td>
                                        <td className="px-3 py-2.5 text-center">{row.startDate}</td>
                                        <td className="px-3 py-2.5 text-center">
                                            {row.expiryDate}
                                        </td>
                                        <td className="px-3 py-2.5 text-center">
                                            <Button asChild size="sm" variant="outline">
                                                <NavLink to={`/sales/status/${row.id}`}>
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
                                        colSpan={12}>
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
