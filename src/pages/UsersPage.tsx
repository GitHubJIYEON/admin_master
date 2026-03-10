import { useEffect, useMemo, useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type UserStatus = "활성" | "정지" | "탈퇴" | "초대 대기";
type InviteMethod = "초대" | "자체";
type MfaStatus = "설정" | "미설정";
type RoleGrade = "일반사용자" | "기관관리자" | "기관사용자" | "테스트사용자" | "뷰어";

type UserRow = {
    id: string;
    name: string;
    email: string;
    phoneMasked: string;
    employeeId: string;
    organization: string;
    department: string;
    division: string;
    role: RoleGrade;
    status: UserStatus;
    inviteMethod: InviteMethod;
    mfaStatus: MfaStatus;
    lastLoginAt: string;
    createdAt: string;
};

const USER_ROWS: UserRow[] = [
    {
        id: "USR-001",
        name: "김지훈",
        email: "jihun.kim@seoul.gov",
        phoneMasked: "010-****-2489",
        employeeId: "A-1024",
        organization: "서울시 공공데이터센터",
        department: "정보화기획부",
        division: "데이터관리과",
        role: "기관관리자",
        status: "활성",
        inviteMethod: "자체",
        mfaStatus: "설정",
        lastLoginAt: "2026-03-04 09:32",
        createdAt: "2025-11-12",
    },
    {
        id: "USR-002",
        name: "이서연",
        email: "seoyeon.lee@kedu.ac.kr",
        phoneMasked: "010-****-9021",
        employeeId: "B-4431",
        organization: "한국디지털교육원",
        department: "교육운영부",
        division: "디지털교육과",
        role: "일반사용자",
        status: "활성",
        inviteMethod: "초대",
        mfaStatus: "미설정",
        lastLoginAt: "2026-03-05 17:08",
        createdAt: "2025-12-02",
    },
    {
        id: "USR-003",
        name: "박정우",
        email: "jungwoo.park@growthi.co.kr",
        phoneMasked: "010-****-7710",
        employeeId: "C-7780",
        organization: "그로스인사이트",
        department: "서비스개발본부",
        division: "플랫폼운영팀",
        role: "기관사용자",
        status: "정지",
        inviteMethod: "자체",
        mfaStatus: "설정",
        lastLoginAt: "2026-02-28 11:15",
        createdAt: "2026-01-18",
    },
    {
        id: "USR-004",
        name: "최다은",
        email: "daeun.choi@ksa.or.kr",
        phoneMasked: "010-****-6638",
        employeeId: "D-1098",
        organization: "대한서비스협회",
        department: "사무국",
        division: "회원관리과",
        role: "뷰어",
        status: "탈퇴",
        inviteMethod: "초대",
        mfaStatus: "미설정",
        lastLoginAt: "2025-12-20 18:52",
        createdAt: "2025-10-21",
    },
    {
        id: "USR-005",
        name: "정하늘",
        email: "haneul.jeong@bsma.go.kr",
        phoneMasked: "010-****-1145",
        employeeId: "E-5510",
        organization: "부산스마트행정원",
        department: "스마트행정부",
        division: "정보시스템과",
        role: "테스트사용자",
        status: "활성",
        inviteMethod: "자체",
        mfaStatus: "설정",
        lastLoginAt: "2026-03-05 08:44",
        createdAt: "2025-08-30",
    },
    {
        id: "USR-006",
        name: "한민지",
        email: "minji.han@seoul.gov",
        phoneMasked: "010-****-3304",
        employeeId: "A-1099",
        organization: "서울시 공공데이터센터",
        department: "정보화기획부",
        division: "시스템운영과",
        role: "일반사용자",
        status: "초대 대기",
        inviteMethod: "초대",
        mfaStatus: "미설정",
        lastLoginAt: "-",
        createdAt: "2026-03-02",
    },
    {
        id: "USR-007",
        name: "강민수",
        email: "minsu.kang@kedu.ac.kr",
        phoneMasked: "010-****-5521",
        employeeId: "B-2201",
        organization: "한국디지털교육원",
        department: "교육운영부",
        division: "콘텐츠개발과",
        role: "기관사용자",
        status: "활성",
        inviteMethod: "자체",
        mfaStatus: "설정",
        lastLoginAt: "2026-03-06 10:22",
        createdAt: "2025-09-15",
    },
    {
        id: "USR-008",
        name: "윤서현",
        email: "seohyun.yoon@growthi.co.kr",
        phoneMasked: "010-****-8833",
        employeeId: "C-3345",
        organization: "그로스인사이트",
        department: "마케팅본부",
        division: "데이터분석팀",
        role: "기관사용자",
        status: "활성",
        inviteMethod: "초대",
        mfaStatus: "미설정",
        lastLoginAt: "2026-03-05 14:55",
        createdAt: "2026-02-01",
    },
    {
        id: "USR-009",
        name: "조현우",
        email: "hyunwoo.jo@ksa.or.kr",
        phoneMasked: "010-****-1199",
        employeeId: "D-6677",
        organization: "대한서비스협회",
        department: "사무국",
        division: "정책기획과",
        role: "기관관리자",
        status: "활성",
        inviteMethod: "자체",
        mfaStatus: "설정",
        lastLoginAt: "2026-03-06 08:10",
        createdAt: "2025-07-20",
    },
    {
        id: "USR-010",
        name: "임수빈",
        email: "subin.lim@bsma.go.kr",
        phoneMasked: "010-****-4477",
        employeeId: "E-8890",
        organization: "부산스마트행정원",
        department: "스마트행정부",
        division: "민원지원과",
        role: "일반사용자",
        status: "정지",
        inviteMethod: "자체",
        mfaStatus: "설정",
        lastLoginAt: "2026-02-15 16:30",
        createdAt: "2025-11-08",
    },
    {
        id: "USR-011",
        name: "송지아",
        email: "jia.song@seoul.gov",
        phoneMasked: "010-****-2266",
        employeeId: "A-2234",
        organization: "서울시 공공데이터센터",
        department: "정보화기획부",
        division: "데이터관리과",
        role: "뷰어",
        status: "활성",
        inviteMethod: "초대",
        mfaStatus: "미설정",
        lastLoginAt: "2026-03-04 11:45",
        createdAt: "2026-01-25",
    },
    {
        id: "USR-012",
        name: "배준호",
        email: "junho.bae@kedu.ac.kr",
        phoneMasked: "010-****-9988",
        employeeId: "B-5566",
        organization: "한국디지털교육원",
        department: "교육운영부",
        division: "디지털교육과",
        role: "테스트사용자",
        status: "활성",
        inviteMethod: "자체",
        mfaStatus: "미설정",
        lastLoginAt: "2026-03-03 09:00",
        createdAt: "2025-12-18",
    },
    {
        id: "USR-013",
        name: "오지훈",
        email: "jihun.oh@growthi.co.kr",
        phoneMasked: "010-****-3344",
        employeeId: "C-7788",
        organization: "그로스인사이트",
        department: "서비스개발본부",
        division: "QA팀",
        role: "기관사용자",
        status: "탈퇴",
        inviteMethod: "자체",
        mfaStatus: "설정",
        lastLoginAt: "2026-01-10 14:20",
        createdAt: "2025-06-12",
    },
    {
        id: "USR-014",
        name: "신유나",
        email: "yuna.shin@ksa.or.kr",
        phoneMasked: "010-****-6655",
        employeeId: "D-9900",
        organization: "대한서비스협회",
        department: "사무국",
        division: "회원관리과",
        role: "일반사용자",
        status: "활성",
        inviteMethod: "초대",
        mfaStatus: "설정",
        lastLoginAt: "2026-03-06 09:15",
        createdAt: "2025-08-05",
    },
    {
        id: "USR-015",
        name: "권도윤",
        email: "doyoon.kwon@bsma.go.kr",
        phoneMasked: "010-****-1122",
        employeeId: "E-1122",
        organization: "부산스마트행정원",
        department: "스마트행정부",
        division: "정보시스템과",
        role: "기관관리자",
        status: "활성",
        inviteMethod: "자체",
        mfaStatus: "설정",
        lastLoginAt: "2026-03-05 17:42",
        createdAt: "2025-10-01",
    },
    {
        id: "USR-016",
        name: "홍예린",
        email: "yerin.hong@seoul.gov",
        phoneMasked: "010-****-7788",
        employeeId: "A-3345",
        organization: "서울시 공공데이터센터",
        department: "정보화기획부",
        division: "데이터관리과",
        role: "기관사용자",
        status: "초대 대기",
        inviteMethod: "초대",
        mfaStatus: "미설정",
        lastLoginAt: "-",
        createdAt: "2026-03-05",
    },
];

const STATUS_OPTIONS: Array<UserStatus | "전체"> = ["전체", "활성", "정지", "탈퇴", "초대 대기"];
const ROLE_OPTIONS: Array<RoleGrade | "전체"> = [
    "전체",
    "기관관리자",
    "기관사용자",
    "테스트사용자",
    "뷰어",
];
const INVITE_OPTIONS: Array<InviteMethod | "전체"> = ["전체", "초대", "자체"];
const MFA_OPTIONS: Array<MfaStatus | "전체"> = ["전체", "설정", "미설정"];
const PERIOD_OPTIONS = [
    { value: "lastLogin", label: "최근 로그인" },
    { value: "createdAt", label: "생성일" },
];

const PERMISSIONS = {
    usersRead: true,
    usersWrite: true,
    usersDeactivate: true,
    usersRoleAssign: true,
    usersInvite: true,
    usersExport: true,
    usersMfaReset: true,
    usersAuditRead: true,
};

const PAGE_SIZE_OPTIONS = [10, 20, 50];

const getStatusBadgeClass = (status: UserStatus) => {
    if (status === "활성") {
        return "bg-emerald-100 text-emerald-700";
    }
    if (status === "정지") {
        return "bg-amber-100 text-amber-700";
    }
    if (status === "초대 대기") {
        return "bg-blue-100 text-blue-700";
    }
    return "bg-slate-100 text-slate-700";
};

const getRoleBadgeClass = (role: RoleGrade) => {
    if (role === "기관관리자") {
        return "bg-slate-900 text-white";
    }
    if (role === "기관사용자") {
        return "bg-blue-100 text-blue-700";
    }
    if (role === "테스트사용자") {
        return "bg-violet-100 text-violet-700";
    }
    if (role === "일반사용자") {
        return "bg-gray-200 text-gray-700";
    }
    if (role === "뷰어") {
        return "bg-gray-100 text-gray-700";
    }
    return "bg-slate-100 text-slate-700";
};

export function UsersPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");
    const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});
    const [viewState] = useState<"ready" | "loading" | "error">("ready");

    useEffect(() => {
        const handler = window.setTimeout(() => {
            const nextParams = new URLSearchParams(searchParams);
            if (searchInput.trim().length === 0) {
                nextParams.delete("q");
            } else {
                nextParams.set("q", searchInput.trim());
                nextParams.set("page", "1");
            }
            setSearchParams(nextParams);
        }, 300);

        return () => window.clearTimeout(handler);
    }, [searchInput, searchParams, setSearchParams]);

    const statusFilter = (searchParams.get("status") as UserStatus | "전체") ?? "전체";
    const roleFilter = (searchParams.get("role") as RoleGrade | "전체") ?? "전체";
    const orgFilter = searchParams.get("org") ?? "전체";
    const inviteFilter = (searchParams.get("invite") as InviteMethod | "전체") ?? "전체";
    const mfaFilter = (searchParams.get("mfa") as MfaStatus | "전체") ?? "전체";
    const periodType = searchParams.get("period") ?? "lastLogin";
    const sortBy = searchParams.get("sortBy") ?? "createdAt";
    const sortDir = searchParams.get("sortDir") ?? "desc";
    const page = Number(searchParams.get("page") ?? "1");
    const pageSize = Number(searchParams.get("pageSize") ?? "10");

    const organizations = useMemo(() => {
        const set = new Set(USER_ROWS.map((row) => row.organization));
        return ["전체", ...Array.from(set)];
    }, []);

    const filteredRows = useMemo(() => {
        const keyword = (searchParams.get("q") ?? "").toLowerCase();

        return USER_ROWS.filter((row) => {
            const matchesKeyword =
                keyword.length === 0 ||
                row.name.toLowerCase().includes(keyword) ||
                row.email.toLowerCase().includes(keyword) ||
                row.phoneMasked.toLowerCase().includes(keyword) ||
                row.employeeId.toLowerCase().includes(keyword);
            const matchesStatus = statusFilter === "전체" || row.status === statusFilter;
            const matchesRole = roleFilter === "전체" || row.role === roleFilter;
            const matchesOrg = orgFilter === "전체" || row.organization === orgFilter;
            const matchesInvite = inviteFilter === "전체" || row.inviteMethod === inviteFilter;
            const matchesMfa = mfaFilter === "전체" || row.mfaStatus === mfaFilter;

            return (
                matchesKeyword &&
                matchesStatus &&
                matchesRole &&
                matchesOrg &&
                matchesInvite &&
                matchesMfa
            );
        });
    }, [inviteFilter, mfaFilter, orgFilter, roleFilter, searchParams, statusFilter]);

    const sortedRows = useMemo(() => {
        const nextRows = [...filteredRows];
        nextRows.sort((a, b) => {
            const direction = sortDir === "asc" ? 1 : -1;
            const aValue = a[sortBy as keyof UserRow];
            const bValue = b[sortBy as keyof UserRow];

            if (typeof aValue === "string" && typeof bValue === "string") {
                return aValue.localeCompare(bValue) * direction;
            }
            return 0;
        });
        return nextRows;
    }, [filteredRows, sortBy, sortDir]);

    const totalCount = sortedRows.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const pagedRows = sortedRows.slice((safePage - 1) * pageSize, safePage * pageSize);

    const isAllChecked = pagedRows.length > 0 && pagedRows.every((row) => selectedIds[row.id]);
    const selectedCount = pagedRows.filter((row) => selectedIds[row.id]).length;

    const updateParams = (updates: Record<string, string | null>) => {
        const nextParams = new URLSearchParams(searchParams);
        Object.entries(updates).forEach(([key, value]) => {
            if (!value || value === "전체") {
                nextParams.delete(key);
            } else {
                nextParams.set(key, value);
            }
        });
        nextParams.set("page", "1");
        setSearchParams(nextParams);
    };

    const handleSort = (key: string) => {
        const nextDir = sortBy === key ? (sortDir === "asc" ? "desc" : "asc") : "desc";
        const nextParams = new URLSearchParams(searchParams);
        nextParams.set("sortBy", key);
        nextParams.set("sortDir", nextDir);
        setSearchParams(nextParams);
    };

    const handleAllCheck = (checked: boolean) => {
        setSelectedIds((prev) => {
            const next = { ...prev };
            pagedRows.forEach((row) => {
                next[row.id] = checked;
            });
            return next;
        });
    };

    const handleRowCheck = (id: string, checked: boolean) => {
        setSelectedIds((prev) => ({ ...prev, [id]: checked }));
    };

    if (!PERMISSIONS.usersRead) {
        return (
            <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">사용자 관리</h1>
                    <p className="text-muted-foreground">시스템 사용자를 조회하고 관리합니다.</p>
                </div>
                <div className="rounded-lg border bg-card p-6 text-center text-muted-foreground">
                    사용자 관리 권한이 없습니다.
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">사용자 목록</h1>
                    <p className="text-muted-foreground">
                        와이즈온 서비스의 사용자를 조회하고 관리합니다.
                    </p>
                </div>
                {PERMISSIONS.usersInvite && (
                    <div className="flex items-center gap-2">
                        <Button variant="outline" type="button">
                            CSV 내보내기
                        </Button>
                        <Button asChild type="button">
                            <NavLink to="/users/new">사용자 초대/추가</NavLink>
                        </Button>
                    </div>
                )}
            </div>

            <div className="grid gap-4">
                <div className="rounded-lg border bg-card p-4">
                    <div className="flex flex-col gap-3">
                        <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
                            <Input
                                value={searchInput}
                                onChange={(event) => setSearchInput(event.target.value)}
                                placeholder="이름·이메일·전화·사번 검색"
                            />
                            <div className="flex items-center gap-2">
                                <select
                                    value={statusFilter}
                                    onChange={(event) =>
                                        updateParams({ status: event.target.value })
                                    }
                                    className="border-input h-9 min-w-28 rounded-md border bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                                    {STATUS_OPTIONS.map((status) => (
                                        <option key={status} value={status}>
                                            상태: {status}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={roleFilter}
                                    onChange={(event) => updateParams({ role: event.target.value })}
                                    className="border-input h-9 min-w-28 rounded-md border bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                                    {ROLE_OPTIONS.map((role) => (
                                        <option key={role} value={role}>
                                            역할: {role}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={orgFilter}
                                    onChange={(event) => updateParams({ org: event.target.value })}
                                    className="border-input h-9 min-w-28 rounded-md border bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                                    {organizations.map((org) => (
                                        <option key={org} value={org}>
                                            조직: {org}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <select
                                    value={inviteFilter}
                                    onChange={(event) =>
                                        updateParams({ invite: event.target.value })
                                    }
                                    className="border-input h-9 min-w-24 rounded-md border bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                                    {INVITE_OPTIONS.map((invite) => (
                                        <option key={invite} value={invite}>
                                            가입: {invite}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={mfaFilter}
                                    onChange={(event) => updateParams({ mfa: event.target.value })}
                                    className="border-input h-9 min-w-24 rounded-md border bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                                    {MFA_OPTIONS.map((mfa) => (
                                        <option key={mfa} value={mfa}>
                                            MFA: {mfa}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={periodType}
                                    onChange={(event) =>
                                        updateParams({ period: event.target.value })
                                    }
                                    className="border-input h-9 min-w-28 rounded-md border bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                                    {PERIOD_OPTIONS.map((period) => (
                                        <option key={period.value} value={period.value}>
                                            기간: {period.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-sm">
                            <span className="text-muted-foreground">퀵 필터</span>
                            {["활성", "정지", "초대 대기", "MFA 미설정"].map((chip) => (
                                <button
                                    key={chip}
                                    type="button"
                                    onClick={() => {
                                        if (chip === "MFA 미설정") {
                                            updateParams({ mfa: "미설정" });
                                        } else {
                                            updateParams({ status: chip });
                                        }
                                    }}
                                    className="rounded-full border px-3 py-1 text-xs font-medium hover:bg-muted">
                                    {chip}
                                </button>
                            ))}
                            <div className="ml-auto text-muted-foreground">
                                선택 {selectedCount}건 / 조회 {totalCount}건
                            </div>
                        </div>

                        {selectedCount > 0 && (
                            <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border bg-muted/40 px-3 py-2 text-sm">
                                <span>선택 {selectedCount}건 일괄 처리</span>
                                <div className="flex flex-wrap items-center gap-2">
                                    {PERMISSIONS.usersRoleAssign && (
                                        <Button size="sm" variant="outline" type="button">
                                            역할 변경
                                        </Button>
                                    )}
                                    {PERMISSIONS.usersDeactivate && (
                                        <Button size="sm" variant="outline" type="button">
                                            일괄 정지
                                        </Button>
                                    )}
                                    {PERMISSIONS.usersExport && (
                                        <Button size="sm" variant="outline" type="button">
                                            CSV 내보내기
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {viewState === "loading" && (
                        <div className="mt-4 space-y-3">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <div
                                    key={`skeleton-${index}`}
                                    className="h-12 w-full animate-pulse rounded-md bg-muted"
                                />
                            ))}
                        </div>
                    )}

                    {viewState === "error" && (
                        <div className="mt-4 rounded-md border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                            네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
                            <div className="mt-3">
                                <Button size="sm" type="button">
                                    재시도
                                </Button>
                            </div>
                        </div>
                    )}

                    {viewState === "ready" && (
                        <div className="mt-4 overflow-x-auto rounded-md border">
                            <table className="w-full min-w-[1200px] border-collapse text-sm">
                                <thead className="bg-muted/50 text-foreground">
                                    <tr className="border-b">
                                        <th className="w-12 px-3 py-2.5 text-center font-medium">
                                            <input
                                                type="checkbox"
                                                aria-label="전체 선택"
                                                checked={isAllChecked}
                                                onChange={(event) =>
                                                    handleAllCheck(event.target.checked)
                                                }
                                            />
                                        </th>
                                        <th className="px-3 py-2.5 text-left font-medium">
                                            이름 / 이메일
                                        </th>
                                        <th className="px-3 py-2.5 text-left font-medium">
                                            소속 조직
                                        </th>
                                        <th className="px-3 py-2.5 text-center font-medium">
                                            부서
                                        </th>
                                        <th className="px-3 py-2.5 text-center font-medium">과</th>
                                        <th className="px-3 py-2.5 text-center font-medium">
                                            역할
                                        </th>
                                        <th className="px-3 py-2.5 text-center font-medium">
                                            상태
                                        </th>
                                        <th className="px-3 py-2.5 text-center font-medium">
                                            최근 로그인
                                        </th>
                                        <th className="px-3 py-2.5 text-center font-medium">
                                            생성일
                                        </th>
                                        <th className="px-3 py-2.5 text-center font-medium">
                                            상세보기
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pagedRows.length > 0 ? (
                                        pagedRows.map((row) => (
                                            <tr
                                                key={row.id}
                                                className="border-b last:border-0 hover:bg-muted/30">
                                                <td className="px-3 py-2.5 text-center">
                                                    <input
                                                        type="checkbox"
                                                        aria-label={`${row.name} 선택`}
                                                        checked={Boolean(selectedIds[row.id])}
                                                        onChange={(event) =>
                                                            handleRowCheck(
                                                                row.id,
                                                                event.target.checked,
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td className="px-3 py-2.5">
                                                    <div className="font-medium text-foreground">
                                                        {row.name}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {row.email} · {row.phoneMasked} ·{" "}
                                                        {row.employeeId}
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2.5 text-left">
                                                    {row.organization}
                                                </td>
                                                <td className="px-3 py-2.5 text-center">
                                                    {row.department || "-"}
                                                </td>
                                                <td className="px-3 py-2.5 text-center">
                                                    {row.division || "-"}
                                                </td>
                                                <td className="px-3 py-2.5 text-center">
                                                    <span
                                                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getRoleBadgeClass(
                                                            row.role,
                                                        )}`}>
                                                        {row.role}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2.5 text-center">
                                                    <span
                                                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getStatusBadgeClass(
                                                            row.status,
                                                        )}`}>
                                                        {row.status}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2.5 text-center">
                                                    {row.lastLoginAt}
                                                </td>
                                                <td className="px-3 py-2.5 text-center">
                                                    {row.createdAt}
                                                </td>
                                                <td className="px-3 py-2.5 text-center">
                                                    <Button
                                                        asChild
                                                        size="sm"
                                                        variant="outline"
                                                        type="button">
                                                        <NavLink to={`/users/${row.id}`}>
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
                                                colSpan={10}>
                                                검색 결과가 없습니다.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">정렬</span>
                            <Button
                                size="sm"
                                variant="outline"
                                type="button"
                                onClick={() => handleSort("lastLoginAt")}>
                                최근 로그인 {sortBy === "lastLoginAt" ? `(${sortDir})` : ""}
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                type="button"
                                onClick={() => handleSort("createdAt")}>
                                생성일 {sortBy === "createdAt" ? `(${sortDir})` : ""}
                            </Button>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                type="button"
                                onClick={() => {
                                    const nextParams = new URLSearchParams(searchParams);
                                    nextParams.set("page", String(Math.max(1, safePage - 1)));
                                    setSearchParams(nextParams);
                                }}>
                                이전
                            </Button>
                            <span>
                                {safePage} / {totalPages}
                            </span>
                            <Button
                                size="sm"
                                variant="outline"
                                type="button"
                                onClick={() => {
                                    const nextParams = new URLSearchParams(searchParams);
                                    nextParams.set(
                                        "page",
                                        String(Math.min(totalPages, safePage + 1)),
                                    );
                                    setSearchParams(nextParams);
                                }}>
                                다음
                            </Button>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">페이지 크기</span>
                            <select
                                value={pageSize}
                                onChange={(event) => {
                                    const nextParams = new URLSearchParams(searchParams);
                                    nextParams.set("pageSize", event.target.value);
                                    nextParams.set("page", "1");
                                    setSearchParams(nextParams);
                                }}
                                className="border-input h-9 rounded-md border bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                                {PAGE_SIZE_OPTIONS.map((size) => (
                                    <option key={size} value={size}>
                                        {size}개
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mt-3 text-xs text-muted-foreground">
                        서버 사이드 정렬/페이지네이션 기준으로 동작하며, 링크 공유 시 동일한
                        필터/검색 상태가 유지됩니다.
                    </div>
                </div>
            </div>
        </div>
    );
}
