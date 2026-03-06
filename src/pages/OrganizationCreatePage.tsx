import { useState } from "react";
import type { FormEvent } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type UsageStatus = "사용" | "미사용";
type ContractStatus = "정상" | "만료예정" | "만료" | "중지";
type OrganizationType = "공공기관" | "교육기관" | "민간기업" | "협회";

type OrganizationCreateForm = {
    organizationNumber: string;
    organizationName: string;
    organizationType: OrganizationType;
    usageStatus: UsageStatus;
    managerName: string;
    contact: string;
    contractStatus: ContractStatus;
};

const INITIAL_FORM: OrganizationCreateForm = {
    organizationNumber: "",
    organizationName: "",
    organizationType: "공공기관",
    usageStatus: "사용",
    managerName: "",
    contact: "",
    contractStatus: "정상",
};

export function OrganizationCreatePage() {
    const navigate = useNavigate();
    const [form, setForm] = useState<OrganizationCreateForm>(INITIAL_FORM);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        window.alert("기관이 등록되었습니다.");
        navigate("/organizations/list");
    };

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">기관 등록</h1>
                <p className="text-muted-foreground">
                    신규 기관의 기본 정보와 계약 상태를 등록합니다.
                </p>
            </div>

            <form className="rounded-lg border bg-card p-6" onSubmit={handleSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                    <label className="flex flex-col gap-2 text-sm">
                        <span className="font-medium">기관번호</span>
                        <Input
                            value={form.organizationNumber}
                            onChange={(event) =>
                                setForm((prev) => ({
                                    ...prev,
                                    organizationNumber: event.target.value,
                                }))
                            }
                            placeholder="예: 100006"
                            required
                        />
                    </label>
                    <label className="flex flex-col gap-2 text-sm">
                        <span className="font-medium">기관명</span>
                        <Input
                            value={form.organizationName}
                            onChange={(event) =>
                                setForm((prev) => ({
                                    ...prev,
                                    organizationName: event.target.value,
                                }))
                            }
                            placeholder="예: 신규기관명"
                            required
                        />
                    </label>
                    <label className="flex flex-col gap-2 text-sm">
                        <span className="font-medium">기관유형</span>
                        <select
                            value={form.organizationType}
                            onChange={(event) =>
                                setForm((prev) => ({
                                    ...prev,
                                    organizationType: event.target.value as OrganizationType,
                                }))
                            }
                            className="border-input h-9 rounded-md border bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                            <option value="공공기관">공공기관</option>
                            <option value="교육기관">교육기관</option>
                            <option value="민간기업">민간기업</option>
                            <option value="협회">협회</option>
                        </select>
                    </label>
                    <label className="flex flex-col gap-2 text-sm">
                        <span className="font-medium">사용여부</span>
                        <select
                            value={form.usageStatus}
                            onChange={(event) =>
                                setForm((prev) => ({
                                    ...prev,
                                    usageStatus: event.target.value as UsageStatus,
                                }))
                            }
                            className="border-input h-9 rounded-md border bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                            <option value="사용">사용</option>
                            <option value="미사용">미사용</option>
                        </select>
                    </label>
                    <label className="flex flex-col gap-2 text-sm">
                        <span className="font-medium">관리자명</span>
                        <Input
                            value={form.managerName}
                            onChange={(event) =>
                                setForm((prev) => ({ ...prev, managerName: event.target.value }))
                            }
                            placeholder="예: 홍길동"
                            required
                        />
                    </label>
                    <label className="flex flex-col gap-2 text-sm">
                        <span className="font-medium">대표 연락처</span>
                        <Input
                            value={form.contact}
                            onChange={(event) =>
                                setForm((prev) => ({ ...prev, contact: event.target.value }))
                            }
                            placeholder="예: 02-1234-5678"
                            required
                        />
                    </label>
                    <label className="flex flex-col gap-2 text-sm md:col-span-2">
                        <span className="font-medium">계약상태</span>
                        <select
                            value={form.contractStatus}
                            onChange={(event) =>
                                setForm((prev) => ({
                                    ...prev,
                                    contractStatus: event.target.value as ContractStatus,
                                }))
                            }
                            className="border-input h-9 rounded-md border bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                            <option value="정상">정상</option>
                            <option value="만료예정">만료예정</option>
                            <option value="만료">만료</option>
                            <option value="중지">중지</option>
                        </select>
                    </label>
                </div>

                <div className="mt-6 flex items-center justify-end gap-2">
                    <Button asChild variant="outline" type="button">
                        <NavLink to="/organizations/list">취소</NavLink>
                    </Button>
                    <Button type="submit">등록</Button>
                </div>
            </form>
        </div>
    );
}
