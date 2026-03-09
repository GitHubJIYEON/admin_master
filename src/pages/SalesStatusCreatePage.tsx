import * as React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PRODUCT_ROWS, formatPrice } from "@/pages/sales-products-data";

type PaymentStatus = "결제완료" | "결제대기" | "결제실패" | "환불";
type PaymentMethod = "카드" | "계좌이체" | "가상계좌" | "포인트";

type Organization = {
    id: string;
    code: string;
    name: string;
    type: string;
};

const ORGANIZATIONS: Organization[] = [
    { id: "ORG-001", code: "100001", name: "서울시 공공데이터센터", type: "공공기관" },
    { id: "ORG-002", code: "100002", name: "한국디지털교육원", type: "교육기관" },
    { id: "ORG-003", code: "100003", name: "그로스인사이트", type: "민간기업" },
    { id: "ORG-004", code: "100004", name: "대한서비스협회", type: "협회" },
    { id: "ORG-005", code: "100005", name: "부산스마트행정원", type: "공공기관" },
];

const QUANTITY_PRODUCTS = new Set(["org-admin", "org-user"]);

const VAT_RATE = 0.1;

type PaymentCreateForm = {
    orderNumber: string;
    paymentStatus: PaymentStatus;
    paymentMethod: PaymentMethod;
    organizationId: string;
    organizationName: string;
    organizationCode: string;
    productQuantities: Record<string, number>;
    totalAmount: string;
    memo: string;
};

const INITIAL_FORM: PaymentCreateForm = {
    orderNumber: "",
    paymentStatus: "결제대기",
    paymentMethod: "카드",
    organizationId: "",
    organizationName: "",
    organizationCode: "",
    productQuantities: {},
    totalAmount: "",
    memo: "",
};

function OrgPickerModal({
    onSelect,
    onClose,
}: {
    onSelect: (org: Organization) => void;
    onClose: () => void;
}) {
    const [search, setSearch] = React.useState("");

    const filtered = React.useMemo(() => {
        const keyword = search.trim().toLowerCase();
        if (keyword.length === 0) return ORGANIZATIONS;
        return ORGANIZATIONS.filter(
            (org) =>
                org.name.toLowerCase().includes(keyword) ||
                org.code.toLowerCase().includes(keyword),
        );
    }, [search]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="flex w-full max-w-lg flex-col gap-4 rounded-lg border bg-card p-6 shadow-lg">
                <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold">기관 찾기</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-xl leading-none text-muted-foreground hover:text-foreground">
                        ✕
                    </button>
                </div>
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="기관명 또는 기관코드 검색"
                    autoFocus
                />
                <div className="max-h-72 overflow-y-auto rounded-md border">
                    {filtered.length > 0 ? (
                        <table className="w-full border-collapse text-sm">
                            <thead className="sticky top-0 bg-muted/50">
                                <tr className="border-b">
                                    <th className="px-3 py-2 text-left font-medium">기관코드</th>
                                    <th className="px-3 py-2 text-left font-medium">기관명</th>
                                    <th className="px-3 py-2 text-left font-medium">유형</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((org) => (
                                    <tr
                                        key={org.id}
                                        onClick={() => onSelect(org)}
                                        className="cursor-pointer border-b last:border-0 hover:bg-muted/40">
                                        <td className="px-3 py-2.5 font-mono text-xs">
                                            {org.code}
                                        </td>
                                        <td className="px-3 py-2.5 font-medium">{org.name}</td>
                                        <td className="px-3 py-2.5 text-muted-foreground">
                                            {org.type}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="flex h-20 items-center justify-center text-sm text-muted-foreground">
                            검색 결과가 없습니다.
                        </div>
                    )}
                </div>
                <div className="flex justify-end">
                    <Button variant="outline" type="button" onClick={onClose}>
                        닫기
                    </Button>
                </div>
            </div>
        </div>
    );
}

function DatePickerSimple({
    label,
    id,
    date,
    setDate,
}: {
    label: string;
    id: string;
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
}) {
    const [open, setOpen] = React.useState(false);

    return (
        <Field>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger
                    render={
                        <Button variant="outline" id={id} className="justify-start font-normal">
                            {date ? date.toLocaleDateString() : "날짜 선택"}
                        </Button>
                    }
                />
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        defaultMonth={date}
                        captionLayout="dropdown"
                        onSelect={(selectedDate) => {
                            setDate(selectedDate);
                            setOpen(false);
                        }}
                    />
                </PopoverContent>
            </Popover>
        </Field>
    );
}

export function SalesStatusCreatePage() {
    const navigate = useNavigate();
    const [form, setForm] = React.useState<PaymentCreateForm>(INITIAL_FORM);
    const [startDate, setStartDate] = React.useState<Date | undefined>(undefined);
    const [expiryDate, setExpiryDate] = React.useState<Date | undefined>(undefined);
    const [orgModalOpen, setOrgModalOpen] = React.useState(false);

    const handleOrgSelect = (org: Organization) => {
        setForm((prev) => ({
            ...prev,
            organizationId: org.id,
            organizationName: org.name,
            organizationCode: org.code,
        }));
        setOrgModalOpen(false);
    };

    const totalAmount = Number(form.totalAmount) || 0;
    const subtotal = Math.round(totalAmount / (1 + VAT_RATE));
    const vat = totalAmount - subtotal;

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        window.alert(`"${form.orderNumber}" 결제가 등록되었습니다.`);
        navigate("/sales/status");
    };

    return (
        <>
            {orgModalOpen && (
                <OrgPickerModal onSelect={handleOrgSelect} onClose={() => setOrgModalOpen(false)} />
            )}
            <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">결제 추가</h1>
                    <p className="text-muted-foreground">
                        주문 및 결제 정보를 입력하고 이용 기간을 설정합니다.
                    </p>
                </div>

                <form className="rounded-lg border bg-card p-4 md:p-6" onSubmit={handleSubmit}>
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* 주문 번호 */}
                        <label className="flex flex-col gap-2 text-sm">
                            <span className="font-medium">
                                주문 번호 <span className="text-rose-500">*</span>
                            </span>
                            <Input
                                required
                                value={form.orderNumber}
                                onChange={(event) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        orderNumber: event.target.value,
                                    }))
                                }
                                placeholder="예: ORD-20260305-001"
                            />
                        </label>

                        {/* 기관명 */}
                        <div className="flex flex-col gap-2 text-sm">
                            <span className="font-medium">
                                기관명 <span className="text-rose-500">*</span>
                            </span>
                            <div className="flex items-center gap-2">
                                <div className="flex min-h-9 flex-1 items-center gap-2 rounded-md border px-3 py-2 text-sm">
                                    {form.organizationName ? (
                                        <>
                                            <span className="font-medium">
                                                {form.organizationName}
                                            </span>
                                            <span className="font-mono text-xs text-muted-foreground">
                                                ({form.organizationCode})
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-muted-foreground">
                                            기관을 선택해주세요
                                        </span>
                                    )}
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOrgModalOpen(true)}>
                                    기관 찾기
                                </Button>
                                {form.organizationName && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            setForm((prev) => ({
                                                ...prev,
                                                organizationId: "",
                                                organizationName: "",
                                                organizationCode: "",
                                            }))
                                        }>
                                        초기화
                                    </Button>
                                )}
                            </div>
                            <input
                                type="text"
                                className="sr-only"
                                value={form.organizationId}
                                required
                                readOnly
                                aria-hidden="true"
                                tabIndex={-1}
                            />
                        </div>

                        {/* 결제 상태 */}
                        <label className="flex flex-col gap-2 text-sm">
                            <span className="font-medium">결제 상태</span>
                            <select
                                value={form.paymentStatus}
                                onChange={(event) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        paymentStatus: event.target.value as PaymentStatus,
                                    }))
                                }
                                className="border-input h-9 rounded-md border bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                                <option value="결제완료">결제완료</option>
                                <option value="결제대기">결제대기</option>
                                <option value="결제실패">결제실패</option>
                                <option value="환불">환불</option>
                            </select>
                        </label>

                        {/* 결제 방법 */}
                        <label className="flex flex-col gap-2 text-sm">
                            <span className="font-medium">결제 방법</span>
                            <select
                                value={form.paymentMethod}
                                onChange={(event) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        paymentMethod: event.target.value as PaymentMethod,
                                    }))
                                }
                                className="border-input h-9 rounded-md border bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                                <option value="카드">카드</option>
                                <option value="계좌이체">계좌이체</option>
                                <option value="가상계좌">가상계좌</option>
                                <option value="포인트">포인트</option>
                            </select>
                        </label>

                        {/* 상품 선택 */}
                        <div className="flex flex-col gap-2 text-sm md:col-span-2">
                            <span className="font-medium">
                                상품명 <span className="text-rose-500">*</span>
                            </span>
                            <div className="rounded-md border">
                                <table className="w-full border-collapse text-sm">
                                    <thead className="bg-muted/50">
                                        <tr className="border-b">
                                            <th className="w-10 px-3 py-2 text-center font-medium">
                                                선택
                                            </th>
                                            <th className="px-3 py-2 text-left font-medium">
                                                상품명
                                            </th>
                                            <th className="px-3 py-2 text-left font-medium">
                                                상품코드
                                            </th>
                                            <th className="w-36 px-3 py-2 text-center font-medium">
                                                수량
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {PRODUCT_ROWS.filter((p) => p.status === "사용").map(
                                            (product) => {
                                                const isChecked =
                                                    product.id in form.productQuantities;
                                                const qty = form.productQuantities[product.id] ?? 1;
                                                const hasQty = QUANTITY_PRODUCTS.has(product.id);

                                                return (
                                                    <tr
                                                        key={product.id}
                                                        className="border-b last:border-0 hover:bg-muted/30">
                                                        <td className="px-3 py-2.5 text-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={isChecked}
                                                                onChange={(e) => {
                                                                    setForm((prev) => {
                                                                        const next = {
                                                                            ...prev.productQuantities,
                                                                        };
                                                                        if (e.target.checked) {
                                                                            next[product.id] = 1;
                                                                        } else {
                                                                            delete next[product.id];
                                                                        }
                                                                        return {
                                                                            ...prev,
                                                                            productQuantities: next,
                                                                        };
                                                                    });
                                                                }}
                                                                className="h-4 w-4"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2.5 font-medium">
                                                            {product.productName}
                                                        </td>
                                                        <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground">
                                                            {product.productCode}
                                                        </td>
                                                        <td className="px-3 py-2.5 text-center">
                                                            {hasQty ? (
                                                                <div className="flex items-center justify-center gap-1">
                                                                    <button
                                                                        type="button"
                                                                        disabled={!isChecked}
                                                                        onClick={() =>
                                                                            setForm((prev) => ({
                                                                                ...prev,
                                                                                productQuantities: {
                                                                                    ...prev.productQuantities,
                                                                                    [product.id]:
                                                                                        Math.max(
                                                                                            1,
                                                                                            qty - 1,
                                                                                        ),
                                                                                },
                                                                            }))
                                                                        }
                                                                        className="flex h-6 w-6 items-center justify-center rounded border text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30">
                                                                        −
                                                                    </button>
                                                                    <input
                                                                        type="number"
                                                                        min={1}
                                                                        disabled={!isChecked}
                                                                        value={isChecked ? qty : ""}
                                                                        onChange={(e) => {
                                                                            const val = Math.max(
                                                                                1,
                                                                                Number(
                                                                                    e.target.value,
                                                                                ) || 1,
                                                                            );
                                                                            setForm((prev) => ({
                                                                                ...prev,
                                                                                productQuantities: {
                                                                                    ...prev.productQuantities,
                                                                                    [product.id]:
                                                                                        val,
                                                                                },
                                                                            }));
                                                                        }}
                                                                        placeholder="-"
                                                                        className="border-input h-7 w-14 rounded-md border bg-transparent px-2 text-center text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-30"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        disabled={!isChecked}
                                                                        onClick={() =>
                                                                            setForm((prev) => ({
                                                                                ...prev,
                                                                                productQuantities: {
                                                                                    ...prev.productQuantities,
                                                                                    [product.id]:
                                                                                        qty + 1,
                                                                                },
                                                                            }))
                                                                        }
                                                                        className="flex h-6 w-6 items-center justify-center rounded border text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30">
                                                                        +
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <span className="text-xs text-muted-foreground">
                                                                    —
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            },
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <input
                                type="text"
                                className="sr-only"
                                value={Object.keys(form.productQuantities).join(",")}
                                required
                                readOnly
                                aria-hidden="true"
                                tabIndex={-1}
                            />
                        </div>

                        {/* 시작일 / 만료일 */}
                        <DatePickerSimple
                            label="시작일"
                            id="startDate"
                            date={startDate}
                            setDate={setStartDate}
                        />
                        <DatePickerSimple
                            label="만료일"
                            id="expiryDate"
                            date={expiryDate}
                            setDate={setExpiryDate}
                        />

                        <div className="flex flex-col gap-4 rounded-lg border bg-muted/30 p-4 text-sm md:col-span-2">
                            <h3 className="font-semibold">
                                공급가액을 작성하여 자동 기입 or 최종 급액을 입력하여 자동 기입
                            </h3>

                            {/* 금액 입력 */}
                            <h3 className="font-semibold">결제 금액</h3>

                            <div className="space-y-1.5 border-t pt-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                        공급가액 (VAT 제외)
                                    </span>
                                    <span>{totalAmount > 0 ? formatPrice(subtotal) : "—"}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                        부가세 (VAT {VAT_RATE * 100}%)
                                    </span>
                                    <span>{totalAmount > 0 ? formatPrice(vat) : "—"}</span>
                                </div>
                                <div className="flex items-center justify-between border-t pt-2 font-semibold">
                                    <span className="text-muted-foreground">
                                        최종 금액 (VAT 포함){" "}
                                        <span className="text-rose-500">*</span>
                                    </span>
                                    <label className="flex flex-col gap-1.5">
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="number"
                                                min={0}
                                                value={form.totalAmount}
                                                onChange={(e) =>
                                                    setForm((prev) => ({
                                                        ...prev,
                                                        totalAmount: e.target.value,
                                                    }))
                                                }
                                                placeholder="예: 110000"
                                                required
                                                className="max-w-xs"
                                            />
                                            <span className="text-muted-foreground">원</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* 메모 */}
                        <label className="flex flex-col gap-2 text-sm md:col-span-2">
                            <span className="font-medium">메모</span>
                            <textarea
                                value={form.memo}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, memo: e.target.value }))
                                }
                                placeholder="관리자 메모 (선택)"
                                rows={3}
                                className="border-input w-full resize-none rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                            />
                        </label>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-2">
                        <Button asChild variant="outline" type="button">
                            <NavLink to="/sales/status">취소</NavLink>
                        </Button>
                        <Button type="submit">저장</Button>
                    </div>
                </form>
            </div>
        </>
    );
}
