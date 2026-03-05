import * as React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type PaymentStatus = "결제완료" | "결제대기" | "결제실패" | "환불";
type PaymentMethod = "카드" | "계좌이체" | "가상계좌" | "포인트";

type PaymentCreateForm = {
    orderNumber: string;
    paymentStatus: PaymentStatus;
    paymentMethod: PaymentMethod;
    organizationName: string;
};

const INITIAL_FORM: PaymentCreateForm = {
    orderNumber: "",
    paymentStatus: "결제대기",
    paymentMethod: "카드",
    organizationName: "",
};

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
                            {date ? date.toLocaleDateString() : "Select date"}
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

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        window.alert(`"${form.orderNumber}" 결제가 등록되었습니다.`);
        navigate("/sales/status");
    };

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">결제 추가</h1>
                <p className="text-muted-foreground">
                    주문 및 결제 정보를 입력하고 이용 기간을 설정합니다.
                </p>
            </div>

            <form className="rounded-lg border bg-card p-4 md:p-6" onSubmit={handleSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                    <label className="flex flex-col gap-2 text-sm">
                        <span className="font-medium">주문 번호</span>
                        <Input
                            required
                            value={form.orderNumber}
                            onChange={(event) =>
                                setForm((prev) => ({ ...prev, orderNumber: event.target.value }))
                            }
                            placeholder="예: ORD-20260305-001"
                        />
                    </label>

                    <label className="flex flex-col gap-2 text-sm">
                        <span className="font-medium">기관명</span>
                        <Input
                            required
                            value={form.organizationName}
                            onChange={(event) =>
                                setForm((prev) => ({
                                    ...prev,
                                    organizationName: event.target.value,
                                }))
                            }
                            placeholder="예: 서울시 공공데이터센터"
                        />
                    </label>

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
                </div>

                <div className="mt-6 flex items-center justify-end gap-2">
                    <Button asChild variant="outline" type="button">
                        <NavLink to="/sales/status">취소</NavLink>
                    </Button>
                    <Button type="submit">저장</Button>
                </div>
            </form>
        </div>
    );
}
