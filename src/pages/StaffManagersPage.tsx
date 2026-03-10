import { NavLink } from "react-router-dom";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    INITIAL_STAFF_MANAGERS,
    toSortableNumber,
    type RoleGroup,
    type StaffManager,
    type StaffStatus,
    type Team,
} from "@/pages/staff-managers-data";

type SortKey = "lastLoginAt" | "createdAt" | "name";
type SortDirection = "asc" | "desc";

const getStaffRoleBadgeClass = (role: RoleGroup) =>
    role === "마스터 관리자" ? "bg-blue-100 text-blue-700" : "bg-slate-900 text-white";

export function StaffManagersPage() {
    const [rows, setRows] = useState<StaffManager[]>(INITIAL_STAFF_MANAGERS);
    const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});
    const [search, setSearch] = useState("");
    const [teamFilter, setTeamFilter] = useState<Team | "전체">("전체");
    const [roleFilter, setRoleFilter] = useState<RoleGroup | "전체">("전체");
    const [statusFilter, setStatusFilter] = useState<StaffStatus | "전체">("전체");
    const [sortKey, setSortKey] = useState<SortKey>("lastLoginAt");
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

    const filteredRows = useMemo(() => {
        const normalized = search.trim().toLowerCase();
        const baseRows = rows.filter((row) => {
            const matchesSearch =
                normalized.length === 0 ||
                row.name.toLowerCase().includes(normalized) ||
                row.loginId.toLowerCase().includes(normalized) ||
                row.contact.toLowerCase().includes(normalized);
            const matchesTeam = teamFilter === "전체" || row.team === teamFilter;
            const matchesRole = roleFilter === "전체" || row.roleGroup === roleFilter;
            const matchesStatus = statusFilter === "전체" || row.status === statusFilter;

            return matchesSearch && matchesTeam && matchesRole && matchesStatus;
        });

        return [...baseRows].sort((a, b) => {
            let result = 0;
            if (sortKey === "name") {
                result = a.name.localeCompare(b.name, "ko");
            } else if (sortKey === "createdAt") {
                result = toSortableNumber(a.createdAt) - toSortableNumber(b.createdAt);
            } else {
                result = toSortableNumber(a.lastLoginAt) - toSortableNumber(b.lastLoginAt);
            }

            return sortDirection === "asc" ? result : -result;
        });
    }, [roleFilter, rows, search, sortDirection, sortKey, statusFilter, teamFilter]);

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

    const toggleStatus = (targetId: string) => {
        setRows((prev) =>
            prev.map((row) =>
                row.id === targetId
                    ? {
                          ...row,
                          status: row.status === "활성" ? "비활성" : "활성",
                          inactiveReason: row.status === "활성" ? "관리자 비활성 처리" : undefined,
                      }
                    : row,
            ),
        );
    };

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">직원 관리자 목록</h1>
                <p className="text-muted-foreground">
                    직원 관리자 계정을 조회하고 권한, 상태, 보안 설정을 관리합니다.
                </p>
            </div>

            <div className="rounded-lg border bg-card p-4">
                <div className="mb-4 grid gap-3 lg:grid-cols-[1fr_auto_auto_auto_auto_auto_auto]">
                    <Input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="이름/로그인 ID/연락처 검색"
                    />
                    <select
                        value={teamFilter}
                        onChange={(event) => setTeamFilter(event.target.value as Team | "전체")}
                        className="border-input h-9 min-w-32 rounded-md border bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                        <option value="전체">소속: 전체</option>
                        <option value="빅데이터팀">빅데이터팀</option>
                        <option value="리서치팀">리서치팀</option>
                    </select>
                    <select
                        value={roleFilter}
                        onChange={(event) =>
                            setRoleFilter(event.target.value as RoleGroup | "전체")
                        }
                        className="border-input h-9 min-w-32 rounded-md border bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                        <option value="전체">역할: 전체</option>
                        <option value="마스터 관리자">마스터 관리자</option>
                        <option value="운영 관리자">운영 관리자</option>
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(event.target.value as StaffStatus | "전체")
                        }
                        className="border-input h-9 min-w-28 rounded-md border bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                        <option value="전체">상태: 전체</option>
                        <option value="활성">활성</option>
                        <option value="비활성">비활성</option>
                    </select>
                    <select
                        value={sortKey}
                        onChange={(event) => setSortKey(event.target.value as SortKey)}
                        className="border-input h-9 min-w-32 rounded-md border bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                        <option value="lastLoginAt">정렬: 최종 로그인</option>
                        <option value="createdAt">정렬: 등록일</option>
                        <option value="name">정렬: 이름</option>
                    </select>
                    <select
                        value={sortDirection}
                        onChange={(event) => setSortDirection(event.target.value as SortDirection)}
                        className="border-input h-9 min-w-24 rounded-md border bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                        <option value="desc">내림차순</option>
                        <option value="asc">오름차순</option>
                    </select>
                </div>

                <div className="mb-3 flex items-center justify-end text-sm text-muted-foreground">
                    선택 {selectedCount}건 / 조회 {filteredRows.length}건
                </div>

                <div className="overflow-x-auto rounded-md border">
                    <table className="w-full min-w-[1400px] border-collapse text-sm">
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
                                <th className="px-3 py-2.5 text-left font-medium">이름</th>
                                <th className="px-3 py-2.5 text-left font-medium">로그인 ID</th>
                                <th className="px-3 py-2.5 text-left font-medium">소속</th>
                                <th className="px-3 py-2.5 text-left font-medium">역할/권한그룹</th>
                                <th className="px-3 py-2.5 text-center font-medium">상태</th>
                                <th className="px-3 py-2.5 text-center font-medium">
                                    최종 로그인 일시
                                </th>
                                <th className="px-3 py-2.5 text-center font-medium">등록일</th>
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
                                                aria-label={`${row.name} 선택`}
                                                checked={Boolean(selectedIds[row.id])}
                                                onChange={(event) =>
                                                    handleRowCheck(row.id, event.target.checked)
                                                }
                                            />
                                        </td>
                                        <td className="px-3 py-2.5">{row.name}</td>
                                        <td className="px-3 py-2.5 font-mono text-xs">
                                            {row.loginId}
                                        </td>
                                        <td className="px-3 py-2.5">{row.team}</td>
                                        <td className="px-3 py-2.5">
                                            <span
                                                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getStaffRoleBadgeClass(
                                                    row.roleGroup,
                                                )}`}>
                                                {row.roleGroup}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2.5 text-center">
                                            <Button
                                                size="sm"
                                                variant={
                                                    row.status === "활성" ? "default" : "secondary"
                                                }
                                                type="button"
                                                onClick={() => toggleStatus(row.id)}>
                                                {row.status}
                                            </Button>
                                        </td>
                                        <td className="px-3 py-2.5 text-center">
                                            {row.lastLoginAt}
                                        </td>
                                        <td className="px-3 py-2.5 text-center">{row.createdAt}</td>
                                        <td className="px-3 py-2.5 text-center">
                                            <Button asChild size="sm" variant="outline">
                                                <NavLink to={`/users/staff-managers/${row.id}`}>
                                                    상세 보기
                                                </NavLink>
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        className="h-24 px-3 py-2.5 text-center text-muted-foreground"
                                        colSpan={9}>
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
