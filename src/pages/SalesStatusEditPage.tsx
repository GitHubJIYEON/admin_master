import * as React from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SALES_ROWS, type PaymentMethod, type PaymentStatus } from "@/pages/sales-status-data";

type PaymentEditForm = {
  orderNumber: string;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  organizationName: string;
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

function parseDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return undefined;
  return new Date(year, month - 1, day);
}

export function SalesStatusEditPage() {
  const navigate = useNavigate();
  const { salesId } = useParams();
  const sales = SALES_ROWS.find((row) => row.id === salesId);

  const [form, setForm] = React.useState<PaymentEditForm>(() => ({
    orderNumber: sales?.orderNumber ?? "",
    paymentStatus: sales?.paymentStatus ?? "결제대기",
    paymentMethod: sales?.paymentMethod ?? "카드",
    organizationName: "",
  }));
  const [startDate, setStartDate] = React.useState<Date | undefined>(() =>
    sales ? parseDate(sales.startDate) : undefined
  );
  const [expiryDate, setExpiryDate] = React.useState<Date | undefined>(() =>
    sales ? parseDate(sales.expiryDate) : undefined
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!sales) return;
    window.alert(`"${form.orderNumber}" 결제 정보를 수정했습니다.`);
    navigate(`/sales/status/${sales.id}`);
  };

  if (!sales) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <h1 className="text-2xl font-bold tracking-tight">결제 수정</h1>
        <div className="rounded-lg border bg-card p-6">
          <p className="text-muted-foreground">수정할 결제 정보를 찾을 수 없습니다.</p>
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
        <h1 className="text-2xl font-bold tracking-tight">결제 수정</h1>
        <p className="text-muted-foreground">
          {sales.orderNumber} 주문의 결제 정보를 수정합니다.
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
            />
          </label>

          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium">기관명</span>
            <Input
              value={form.organizationName}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, organizationName: event.target.value }))
              }
              placeholder="기관명을 입력하세요"
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
              className="border-input h-9 rounded-md border bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
            >
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
              className="border-input h-9 rounded-md border bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
            >
              <option value="카드">카드</option>
              <option value="계좌이체">계좌이체</option>
              <option value="가상계좌">가상계좌</option>
              <option value="포인트">포인트</option>
            </select>
          </label>

          <DatePickerSimple
            label="시작일"
            id="editStartDate"
            date={startDate}
            setDate={setStartDate}
          />
          <DatePickerSimple
            label="만료일"
            id="editExpiryDate"
            date={expiryDate}
            setDate={setExpiryDate}
          />
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <Button asChild variant="outline" type="button">
            <NavLink to={`/sales/status/${sales.id}`}>취소</NavLink>
          </Button>
          <Button type="submit">저장</Button>
        </div>
      </form>
    </div>
  );
}
