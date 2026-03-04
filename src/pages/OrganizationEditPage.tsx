import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type UsageStatus = "사용" | "미사용";
type ContractStatus = "정상" | "만료예정" | "만료" | "중지";
type OrganizationType = "공공기관" | "교육기관" | "민간기업" | "협회";

type OrganizationRow = {
    id: string;
    organizationNumber: string;
    organizationName: string;
    organizationType: OrganizationType;
    managerName: string;
    contact: string;
    registeredAt: string;
    contractStatus: ContractStatus;
    usageStatus: UsageStatus;
    adminCount: number;
    userCount: number;
};

const ORGANIZATION_ROWS: OrganizationRow[] = [
    {
        id: "ORG-001",
        organizationNumber: "100001",
        organizationName: "서울시 공공데이터센터",
        organizationType: "공공기관",
        managerName: "김민수",
        contact: "02-1234-5678",
        registeredAt: "2025-11-10",
        contractStatus: "정상",
        usageStatus: "사용",
        adminCount: 3,
        userCount: 145,
    },
    {
        id: "ORG-002",
        organizationNumber: "100002",
        organizationName: "한국디지털교육원",
        organizationType: "교육기관",
        managerName: "이서연",
        contact: "031-456-7890",
        registeredAt: "2025-12-02",
        contractStatus: "만료예정",
        usageStatus: "사용",
        adminCount: 2,
        userCount: 78,
    },
    {
        id: "ORG-003",
        organizationNumber: "100003",
        organizationName: "그로스인사이트",
        organizationType: "민간기업",
        managerName: "박정우",
        contact: "070-8899-1122",
        registeredAt: "2026-01-18",
        contractStatus: "정상",
        usageStatus: "사용",
        adminCount: 4,
        userCount: 212,
    },
    {
        id: "ORG-004",
        organizationNumber: "100004",
        organizationName: "대한서비스협회",
        organizationType: "협회",
        managerName: "최다은",
        contact: "02-9988-3344",
        registeredAt: "2025-10-21",
        contractStatus: "중지",
        usageStatus: "미사용",
        adminCount: 1,
        userCount: 23,
    },
    {
        id: "ORG-005",
        organizationNumber: "100005",
        organizationName: "부산스마트행정원",
        organizationType: "공공기관",
        managerName: "정하늘",
        contact: "051-333-2211",
        registeredAt: "2025-08-30",
        contractStatus: "만료",
        usageStatus: "미사용",
        adminCount: 2,
        userCount: 56,
    },
];

export function OrganizationEditPage() {
    const { organizationId } = useParams();
    const navigate = useNavigate();

    const organization = useMemo(
        () => ORGANIZATION_ROWS.find((row) => row.id === organizationId),
        [organizationId],
    );

    const [form, setForm] = useState(() => ({
        usageStatus: organization?.usageStatus ?? "사용",
        organizationType: organization?.organizationType ?? "공공기관",
        organizationName: organization?.organizationName ?? "",
        managerName: organization?.managerName ?? "",
        contact: organization?.contact ?? "",
        contractStatus: organization?.contractStatus ?? "정상",
    }));

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        window.alert("기관 정보가 수정되었습니다.");
        navigate(`/organizations/${organizationId}`);
    };

    if (!organization) {
        return (
            <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <h1 className="text-2xl font-bold tracking-tight">기관 수정</h1>
                <div className="rounded-lg border bg-card p-6">
                    <p className="text-muted-foreground">수정할 기관 정보를 찾을 수 없습니다.</p>
                    <div className="mt-4">
                        <Button asChild variant="outline">
                            <NavLink to="/organizations/list">목록으로</NavLink>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">기관 수정</h1>
                <p className="text-muted-foreground">
                    {organization.organizationName} 기관의 정보를 수정합니다.
                </p>
            </div>

            <form className="rounded-lg border bg-card p-6" onSubmit={handleSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                    <label className="flex flex-col gap-2 text-sm">
                        <span className="font-medium">기관번호</span>
                        <Input value={organization.organizationNumber} disabled />
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
                    <Button asChild type="button" variant="outline">
                        <NavLink to={`/organizations/${organization.id}`}>취소</NavLink>
                    </Button>
                    <Button type="submit">저장</Button>
                </div>
            </form>
        </div>
    );
}
