import { NavLink, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

type UserStatus = "활성" | "정지" | "탈퇴" | "초대 대기";
type InviteMethod = "초대" | "자체";
type MfaStatus = "설정" | "미설정";
type RoleGrade = "슈퍼관리자" | "운영관리자" | "보안관리자" | "일반관리자" | "뷰어";

type UserRow = {
    id: string;
    name: string;
    email: string;
    phoneMasked: string;
    employeeId: string;
    organization: string;
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
        role: "운영관리자",
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
        role: "일반관리자",
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
        role: "보안관리자",
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
        role: "슈퍼관리자",
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
        role: "일반관리자",
        status: "초대 대기",
        inviteMethod: "초대",
        mfaStatus: "미설정",
        lastLoginAt: "-",
        createdAt: "2026-03-02",
    },
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

const getMfaBadgeClass = (status: MfaStatus) =>
    status === "설정" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700";

const getRoleBadgeClass = (role: RoleGrade) => {
    if (role === "슈퍼관리자") {
        return "bg-slate-900 text-white";
    }
    if (role === "보안관리자") {
        return "bg-violet-100 text-violet-700";
    }
    if (role === "운영관리자") {
        return "bg-blue-100 text-blue-700";
    }
    return "bg-slate-100 text-slate-700";
};

export function UserDetailPage() {
    const { userId } = useParams();
    const user = USER_ROWS.find((row) => row.id === userId);

    if (!PERMISSIONS.usersRead) {
        return (
            <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">사용자 상세</h1>
                    <p className="text-muted-foreground">
                        시스템 사용자를 조회하고 관리합니다.
                    </p>
                </div>
                <div className="rounded-lg border bg-card p-6 text-center text-muted-foreground">
                    사용자 관리 권한이 없습니다.
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">사용자 상세</h1>
                        <p className="text-muted-foreground">사용자 정보를 확인합니다.</p>
                    </div>
                    <Button asChild variant="outline" type="button">
                        <NavLink to="/users/list">목록으로</NavLink>
                    </Button>
                </div>
                <div className="rounded-lg border bg-card p-6 text-center text-muted-foreground">
                    사용자를 찾을 수 없습니다.
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">사용자 상세</h1>
                    <p className="text-muted-foreground">사용자 정보를 확인합니다.</p>
                </div>
                <Button asChild variant="outline" type="button">
                    <NavLink to="/users/list">목록으로</NavLink>
                </Button>
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="rounded-lg border bg-card p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-semibold">{user.name}</h2>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <p className="text-xs text-muted-foreground">
                                {user.phoneMasked} · {user.employeeId}
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <span
                                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getRoleBadgeClass(
                                    user.role,
                                )}`}>
                                {user.role}
                            </span>
                            <span
                                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getStatusBadgeClass(
                                    user.status,
                                )}`}>
                                {user.status}
                            </span>
                            <span
                                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getMfaBadgeClass(
                                    user.mfaStatus,
                                )}`}>
                                MFA {user.mfaStatus}
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-3 text-sm md:grid-cols-2">
                        <div className="flex items-center justify-between gap-2 rounded-md border px-3 py-2">
                            <span className="text-muted-foreground">소속 조직</span>
                            <span>{user.organization}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2 rounded-md border px-3 py-2">
                            <span className="text-muted-foreground">가입 방식</span>
                            <span>{user.inviteMethod}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2 rounded-md border px-3 py-2">
                            <span className="text-muted-foreground">최근 로그인</span>
                            <span>{user.lastLoginAt}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2 rounded-md border px-3 py-2">
                            <span className="text-muted-foreground">생성일</span>
                            <span>{user.createdAt}</span>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-2">
                        {PERMISSIONS.usersWrite && (
                            <Button variant="outline" type="button">
                                수정
                            </Button>
                        )}
                        {PERMISSIONS.usersDeactivate && (
                            <Button variant="outline" type="button">
                                {user.status === "활성" ? "정지" : "활성화"}
                            </Button>
                        )}
                        {PERMISSIONS.usersRoleAssign && (
                            <Button variant="outline" type="button">
                                역할 변경
                            </Button>
                        )}
                        {PERMISSIONS.usersWrite && (
                            <Button variant="outline" type="button">
                                비밀번호 재설정
                            </Button>
                        )}
                        {PERMISSIONS.usersMfaReset && (
                            <Button variant="outline" type="button">
                                MFA 리셋
                            </Button>
                        )}
                    </div>
                </div>

                <div className="rounded-lg border bg-card p-6">
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">보안 정책</span>
                            <span>소프트 삭제 적용</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">초대 만료</span>
                            <span>7일</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">최근 기기</span>
                            <span>3대</span>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {PERMISSIONS.usersAuditRead && (
                            <Button asChild variant="outline" size="sm">
                                <NavLink to={`/audit-logs?subject=${user.id}`}>
                                    감사 로그 보기
                                </NavLink>
                            </Button>
                        )}
                        <Button size="sm" variant="outline" type="button">
                            세션 강제 종료
                        </Button>
                        <Button size="sm" variant="outline" type="button">
                            최근 세션/기기
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
