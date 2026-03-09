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
    phone: string;
    employeeId: string;
    organizationName: string;
    organizationCode: string;
    department: string;
    division: string;
    role: RoleGrade;
    status: UserStatus;
    inviteMethod: InviteMethod;
    mfaStatus: MfaStatus;
    memo: string;
    lastLoginAt: string;
    createdAt: string;
};

const USER_ROWS: UserRow[] = [
    {
        id: "USR-001",
        name: "김지훈",
        email: "jihun.kim@seoul.gov",
        phone: "010-****-2489",
        employeeId: "A-1024",
        organizationName: "서울시 공공데이터센터",
        organizationCode: "100001",
        department: "정보화기획부",
        division: "데이터관리과",
        role: "운영관리자",
        status: "활성",
        inviteMethod: "자체",
        mfaStatus: "설정",
        memo: "",
        lastLoginAt: "2026-03-04 09:32",
        createdAt: "2025-11-12",
    },
    {
        id: "USR-002",
        name: "이서연",
        email: "seoyeon.lee@kedu.ac.kr",
        phone: "010-****-9021",
        employeeId: "B-4431",
        organizationName: "한국디지털교육원",
        organizationCode: "100002",
        department: "교육운영부",
        division: "디지털교육과",
        role: "일반관리자",
        status: "활성",
        inviteMethod: "초대",
        mfaStatus: "미설정",
        memo: "신규 입사자, 온보딩 중",
        lastLoginAt: "2026-03-05 17:08",
        createdAt: "2025-12-02",
    },
    {
        id: "USR-003",
        name: "박정우",
        email: "jungwoo.park@growthi.co.kr",
        phone: "010-****-7710",
        employeeId: "C-7780",
        organizationName: "그로스인사이트",
        organizationCode: "100003",
        department: "서비스개발본부",
        division: "플랫폼운영팀",
        role: "보안관리자",
        status: "정지",
        inviteMethod: "자체",
        mfaStatus: "설정",
        memo: "비정상 접근 시도로 정지 처리",
        lastLoginAt: "2026-02-28 11:15",
        createdAt: "2026-01-18",
    },
    {
        id: "USR-004",
        name: "최다은",
        email: "daeun.choi@ksa.or.kr",
        phone: "010-****-6638",
        employeeId: "D-1098",
        organizationName: "대한서비스협회",
        organizationCode: "100004",
        department: "사무국",
        division: "회원관리과",
        role: "뷰어",
        status: "탈퇴",
        inviteMethod: "초대",
        mfaStatus: "미설정",
        memo: "",
        lastLoginAt: "2025-12-20 18:52",
        createdAt: "2025-10-21",
    },
    {
        id: "USR-005",
        name: "정하늘",
        email: "haneul.jeong@bsma.go.kr",
        phone: "010-****-1145",
        employeeId: "E-5510",
        organizationName: "부산스마트행정원",
        organizationCode: "100005",
        department: "스마트행정부",
        division: "정보시스템과",
        role: "슈퍼관리자",
        status: "활성",
        inviteMethod: "자체",
        mfaStatus: "설정",
        memo: "",
        lastLoginAt: "2026-03-05 08:44",
        createdAt: "2025-08-30",
    },
    {
        id: "USR-006",
        name: "한민지",
        email: "minji.han@seoul.gov",
        phone: "010-****-3304",
        employeeId: "A-1099",
        organizationName: "서울시 공공데이터센터",
        organizationCode: "100001",
        department: "정보화기획부",
        division: "시스템운영과",
        role: "일반관리자",
        status: "초대 대기",
        inviteMethod: "초대",
        mfaStatus: "미설정",
        memo: "초대 링크 발송 완료 (2026-03-02)",
        lastLoginAt: "-",
        createdAt: "2026-03-02",
    },
];

const PERMISSIONS = {
    usersRead: true,
    usersWrite: true,
    usersDeactivate: true,
    usersRoleAssign: true,
    usersMfaReset: true,
    usersAuditRead: true,
};

const getStatusBadgeClass = (status: UserStatus) => {
    if (status === "활성") return "bg-emerald-100 text-emerald-700";
    if (status === "정지") return "bg-amber-100 text-amber-700";
    if (status === "초대 대기") return "bg-blue-100 text-blue-700";
    return "bg-slate-100 text-slate-700";
};

const getMfaBadgeClass = (status: MfaStatus) =>
    status === "설정" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700";

const getRoleBadgeClass = (role: RoleGrade) => {
    if (role === "슈퍼관리자") return "bg-slate-900 text-white";
    if (role === "보안관리자") return "bg-violet-100 text-violet-700";
    if (role === "운영관리자") return "bg-blue-100 text-blue-700";
    return "bg-slate-100 text-slate-700";
};

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm">
            <span className="shrink-0 text-muted-foreground">{label}</span>
            <span className="text-right">{children}</span>
        </div>
    );
}

export function UserDetailPage() {
    const { userId } = useParams();
    const user = USER_ROWS.find((row) => row.id === userId);

    if (!PERMISSIONS.usersRead) {
        return (
            <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">사용자 상세</h1>
                    <p className="text-muted-foreground">사용자 정보를 확인합니다.</p>
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
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
                {/* 메인 정보 */}
                <div className="flex flex-col gap-4">
                    {/* 기본 정보 */}
                    <div className="rounded-lg border bg-card p-6">
                        <div className="mb-4 flex flex-wrap items-center gap-2">
                            <h2 className="text-base font-semibold">기본 정보</h2>
                            <span
                                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getRoleBadgeClass(user.role)}`}>
                                {user.role}
                            </span>
                            <span
                                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getStatusBadgeClass(user.status)}`}>
                                {user.status}
                            </span>
                            <span
                                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getMfaBadgeClass(user.mfaStatus)}`}>
                                MFA {user.mfaStatus}
                            </span>
                        </div>
                        <div className="grid gap-3 md:grid-cols-2">
                            <InfoRow label="이름">{user.name}</InfoRow>
                            <InfoRow label="이메일">{user.email}</InfoRow>
                            <InfoRow label="전화번호">{user.phone}</InfoRow>
                            <InfoRow label="사번">{user.employeeId}</InfoRow>
                            <div className="flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm md:col-span-2">
                                <span className="shrink-0 text-muted-foreground">소속 조직</span>
                                <span className="text-right">
                                    {user.organizationName}
                                    <span className="ml-1.5 font-mono text-xs text-muted-foreground">
                                        ({user.organizationCode})
                                    </span>
                                </span>
                            </div>
                            <InfoRow label="부서">{user.department || "-"}</InfoRow>
                            <InfoRow label="과">{user.division || "-"}</InfoRow>
                        </div>
                    </div>

                    {/* 권한 및 상태 */}
                    <div className="rounded-lg border bg-card p-6">
                        <h2 className="mb-4 text-base font-semibold">권한 및 상태</h2>
                        <div className="grid gap-3 md:grid-cols-2">
                            <InfoRow label="역할">{user.role}</InfoRow>
                            <InfoRow label="계정 상태">{user.status}</InfoRow>
                            <InfoRow label="가입 방식">{user.inviteMethod}</InfoRow>
                            <InfoRow label="MFA">{user.mfaStatus}</InfoRow>
                            <InfoRow label="최근 로그인">{user.lastLoginAt}</InfoRow>
                            <InfoRow label="생성일">{user.createdAt}</InfoRow>
                        </div>
                        {user.memo && (
                            <div className="mt-3 rounded-md border px-3 py-2 text-sm">
                                <span className="text-muted-foreground">메모</span>
                                <p className="mt-1">{user.memo}</p>
                            </div>
                        )}
                    </div>

                    {/* 계정 액션 */}
                    <div className="rounded-lg border bg-card p-6">
                        <h2 className="mb-4 text-base font-semibold">계정 관리</h2>
                        <div className="flex flex-wrap gap-2">
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
                </div>

                {/* 사이드 패널 */}
                <div className="flex flex-col gap-4">
                    <div className="rounded-lg border bg-card p-6">
                        <h2 className="mb-4 text-base font-semibold">보안 정보</h2>
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
                            <Button size="sm" variant="outline" type="button">
                                세션 강제 종료
                            </Button>
                            <Button size="sm" variant="outline" type="button">
                                최근 세션/기기
                            </Button>
                        </div>
                    </div>

                    {PERMISSIONS.usersAuditRead && (
                        <div className="rounded-lg border bg-card p-6">
                            <h2 className="mb-3 text-base font-semibold">감사 로그</h2>
                            <p className="text-sm text-muted-foreground">
                                역할 변경, 정지, 초대, 비밀번호 리셋 등 이력을 확인합니다.
                            </p>
                            <div className="mt-4">
                                <Button asChild variant="outline" size="sm">
                                    <NavLink to={`/audit-logs?subject=${user.id}`}>
                                        감사 로그 보기
                                    </NavLink>
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-2 justify-end">
                {PERMISSIONS.usersWrite && <Button type="button">수정하기</Button>}
                <Button asChild variant="outline" type="button">
                    <NavLink to="/users/list">목록으로</NavLink>
                </Button>
            </div>
        </div>
    );
}
