import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
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

export function OrganizationsPage() {
    const [keyword, setKeyword] = useState("");
    const [usageFilter, setUsageFilter] = useState<UsageStatus | "전체">("전체");
    const [typeFilter, setTypeFilter] = useState<OrganizationType | "전체">("전체");
    const [contractFilter, setContractFilter] = useState<ContractStatus | "전체">("전체");
    const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});

    const filteredRows = useMemo(() => {
        const normalizedKeyword = keyword.trim().toLowerCase();

        return ORGANIZATION_ROWS.filter((row) => {
            const matchesKeyword =
                normalizedKeyword.length === 0 ||
                row.organizationNumber.toLowerCase().includes(normalizedKeyword) ||
                row.organizationName.toLowerCase().includes(normalizedKeyword);
            const matchesUsage = usageFilter === "전체" || row.usageStatus === usageFilter;
            const matchesType = typeFilter === "전체" || row.organizationType === typeFilter;
            const matchesContract =
                contractFilter === "전체" || row.contractStatus === contractFilter;

            return matchesKeyword && matchesUsage && matchesType && matchesContract;
        });
    }, [contractFilter, keyword, typeFilter, usageFilter]);

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
                    <h1 className="text-2xl font-bold tracking-tight">기관 관리</h1>
                    <p className="text-muted-foreground">
                        등록된 기관을 검색하고 계약/운영 상태를 관리합니다.
                    </p>
                </div>
                <Button asChild type="button">
                    <NavLink to="/organizations/new">기관 등록</NavLink>
                </Button>
            </div>

            <div className="rounded-lg border bg-card p-4">
                <div className="mb-4 grid gap-3 lg:grid-cols-[1fr_auto_auto_auto_auto]">
                    <Input
                        value={keyword}
                        onChange={(event) => setKeyword(event.target.value)}
                        placeholder="기관번호 또는 기관명 검색"
                    />
                    <select
                        value={usageFilter}
                        onChange={(event) =>
                            setUsageFilter(event.target.value as UsageStatus | "전체")
                        }
                        className="border-input h-9 min-w-32 rounded-md border bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                        <option value="전체">사용여부: 전체</option>
                        <option value="사용">사용</option>
                        <option value="미사용">미사용</option>
                    </select>
                    <select
                        value={typeFilter}
                        onChange={(event) =>
                            setTypeFilter(event.target.value as OrganizationType | "전체")
                        }
                        className="border-input h-9 min-w-36 rounded-md border bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                        <option value="전체">기관유형: 전체</option>
                        <option value="공공기관">공공기관</option>
                        <option value="교육기관">교육기관</option>
                        <option value="민간기업">민간기업</option>
                        <option value="협회">협회</option>
                    </select>
                    <select
                        value={contractFilter}
                        onChange={(event) =>
                            setContractFilter(event.target.value as ContractStatus | "전체")
                        }
                        className="border-input h-9 min-w-36 rounded-md border bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                        <option value="전체">계약상태: 전체</option>
                        <option value="정상">정상</option>
                        <option value="만료예정">만료예정</option>
                        <option value="만료">만료</option>
                        <option value="중지">중지</option>
                    </select>
                    <div className="flex items-center justify-end text-sm text-muted-foreground">
                        선택 {selectedCount}건 / 조회 {filteredRows.length}건
                    </div>
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
                                <th className="px-3 py-2.5 text-left font-medium">기관번호</th>
                                <th className="px-3 py-2.5 text-center font-medium">기관명</th>
                                <th className="px-3 py-2.5 text-center font-medium">기관유형</th>
                                <th className="px-3 py-2.5 text-center font-medium">관리자명</th>
                                <th className="px-3 py-2.5 text-center font-medium">대표 연락처</th>
                                <th className="px-3 py-2.5 text-center font-medium">등록일</th>
                                <th className="px-3 py-2.5 text-center font-medium">계약상태</th>
                                <th className="px-3 py-2.5 text-right font-medium">
                                    기관 관리자 수
                                </th>
                                <th className="px-3 py-2.5 text-right font-medium">
                                    기관 사용자 수
                                </th>
                                <th className="px-3 py-2.5 text-center font-medium">상세보기</th>
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
                                                aria-label={`${row.organizationName} 선택`}
                                                checked={Boolean(selectedIds[row.id])}
                                                onChange={(event) =>
                                                    handleRowCheck(row.id, event.target.checked)
                                                }
                                            />
                                        </td>
                                        <td className="px-3 py-2.5 font-mono text-xs">
                                            {row.organizationNumber}
                                        </td>
                                        <td className="px-3 py-2.5 text-center">
                                            {row.organizationName}
                                        </td>
                                        <td className="px-3 py-2.5 text-center">
                                            {row.organizationType}
                                        </td>
                                        <td className="px-3 py-2.5 text-center">
                                            {row.managerName}
                                        </td>
                                        <td className="px-3 py-2.5 text-center">{row.contact}</td>
                                        <td className="px-3 py-2.5 text-center">
                                            {row.registeredAt}
                                        </td>
                                        <td className="px-3 py-2.5 text-center">
                                            <span
                                                className={
                                                    row.contractStatus === "정상"
                                                        ? "inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700"
                                                        : row.contractStatus === "만료예정"
                                                          ? "inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700"
                                                          : row.contractStatus === "만료"
                                                            ? "inline-flex rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700"
                                                            : "inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700"
                                                }>
                                                {row.contractStatus}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2.5 text-center">
                                            {row.adminCount.toLocaleString("ko-KR")}
                                        </td>
                                        <td className="px-3 py-2.5 text-center">
                                            {row.userCount.toLocaleString("ko-KR")}
                                        </td>
                                        <td className="px-3 py-2.5 text-center">
                                            <Button
                                                asChild
                                                size="sm"
                                                variant="outline"
                                                type="button">
                                                <NavLink to={`/organizations/${row.id}`}>
                                                    상세
                                                </NavLink>
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        className="h-24 px-3 py-2.5 text-center text-muted-foreground"
                                        colSpan={10}>
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
