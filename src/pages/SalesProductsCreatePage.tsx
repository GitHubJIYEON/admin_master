import { type FormEvent, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ProductFormState = {
    productCode: string;
    productName: string;
    category: string;
    price: string;
    stock: string;
    startDate: string;
    expiryDate: string;
    description: string;
};

const INITIAL_FORM: ProductFormState = {
    productCode: "",
    productName: "",
    category: "",
    price: "",
    stock: "",
    startDate: "",
    expiryDate: "",
    description: "",
};

export function SalesProductsCreatePage() {
    const navigate = useNavigate();
    const [form, setForm] = useState<ProductFormState>(INITIAL_FORM);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // API 연동 전까지는 등록 동작만 시뮬레이션하고 목록으로 복귀합니다.
        window.alert(`"${form.productName}" 상품이 등록되었습니다.`);
        navigate("/sales/products");
    };

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">상품 등록</h1>
                <p className="text-muted-foreground">신규 판매 상품 정보를 입력하고 저장합니다.</p>
            </div>

            <form className="rounded-lg border bg-card p-4 md:p-6" onSubmit={handleSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                    <label className="flex flex-col gap-2 text-sm">
                        <span className="font-medium">상품코드</span>
                        <Input
                            required
                            value={form.productCode}
                            onChange={(event) =>
                                setForm((prev) => ({ ...prev, productCode: event.target.value }))
                            }
                            placeholder="예: PRD-5001"
                        />
                    </label>

                    <label className="flex flex-col gap-2 text-sm">
                        <span className="font-medium">상품명</span>
                        <Input
                            required
                            value={form.productName}
                            onChange={(event) =>
                                setForm((prev) => ({ ...prev, productName: event.target.value }))
                            }
                            placeholder="예: 프리미엄 멤버십 6개월"
                        />
                    </label>

                    <label className="flex flex-col gap-2 text-sm">
                        <span className="font-medium">카테고리</span>
                        <Input
                            required
                            value={form.category}
                            onChange={(event) =>
                                setForm((prev) => ({ ...prev, category: event.target.value }))
                            }
                            placeholder="예: 멤버십"
                        />
                    </label>

                    <label className="flex flex-col gap-2 text-sm">
                        <span className="font-medium">판매가(원)</span>
                        <Input
                            required
                            type="number"
                            min={0}
                            value={form.price}
                            onChange={(event) =>
                                setForm((prev) => ({ ...prev, price: event.target.value }))
                            }
                            placeholder="예: 59000"
                        />
                    </label>

                    <label className="flex flex-col gap-2 text-sm">
                        <span className="font-medium">시작일</span>
                        <Input
                            required
                            type="date"
                            value={form.startDate}
                            onChange={(event) =>
                                setForm((prev) => ({ ...prev, startDate: event.target.value }))
                            }
                        />
                    </label>

                    <label className="flex flex-col gap-2 text-sm">
                        <span className="font-medium">만료일</span>
                        <Input
                            required
                            type="date"
                            value={form.expiryDate}
                            min={form.startDate || undefined}
                            onChange={(event) =>
                                setForm((prev) => ({ ...prev, expiryDate: event.target.value }))
                            }
                        />
                    </label>

                    <label className="flex flex-col gap-2 text-sm">
                        <span className="font-medium">재고</span>
                        <Input
                            required
                            type="number"
                            min={0}
                            value={form.stock}
                            onChange={(event) =>
                                setForm((prev) => ({ ...prev, stock: event.target.value }))
                            }
                            placeholder="예: 100"
                        />
                    </label>
                </div>

                <label className="mt-4 flex flex-col gap-2 text-sm">
                    <span className="font-medium">상품 설명</span>
                    <textarea
                        value={form.description}
                        onChange={(event) =>
                            setForm((prev) => ({ ...prev, description: event.target.value }))
                        }
                        rows={4}
                        placeholder="상품 상세 설명을 입력하세요."
                        className="border-input rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                    />
                </label>

                <div className="mt-6 flex items-center justify-end gap-2">
                    <Button asChild type="button" variant="outline">
                        <NavLink to="/sales/products">목록으로</NavLink>
                    </Button>
                    <Button type="submit">저장</Button>
                </div>
            </form>
        </div>
    );
}
