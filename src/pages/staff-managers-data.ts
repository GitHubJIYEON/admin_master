export type StaffStatus = "활성" | "비활성";
export type Team = "빅데이터팀" | "리서치팀";
export type RoleGroup = "마스터 관리자" | "운영 관리자";
export type MfaStatus = "사용" | "미사용";

export type StaffManager = {
    id: string;
    name: string;
    loginId: string;
    team: Team;
    roleGroup: RoleGroup;
    status: StaffStatus;
    contact: string;
    mfaEnabled: MfaStatus;
    lastLoginAt: string;
    lastActivityAt: string;
    createdAt: string;
    createdBy: string;
    isLocked: boolean;
    lockReason?: string;
    inactiveReason?: string;
};

export const INITIAL_STAFF_MANAGERS: StaffManager[] = [
    {
        id: "MGR-001",
        name: "이지연",
        loginId: "wise_jiyeon",
        team: "빅데이터팀",
        roleGroup: "마스터 관리자",
        status: "활성",
        contact: "010-1234-5678",
        mfaEnabled: "사용",
        lastLoginAt: "2026-03-04 09:12",
        lastActivityAt: "2026-03-04 10:03",
        createdAt: "2025-11-03",
        createdBy: "super.admin",
        isLocked: false,
    },
    {
        id: "MGR-002",
        name: "전인표",
        loginId: "wise_inpyo",
        team: "빅데이터팀",
        roleGroup: "마스터 관리자",
        status: "활성",
        contact: "010-2233-4455",
        mfaEnabled: "미사용",
        lastLoginAt: "2026-03-03 18:24",
        lastActivityAt: "2026-03-03 18:40",
        createdAt: "2025-12-18",
        createdBy: "jhoon.kim",
        isLocked: false,
    },
    {
        id: "MGR-003",
        name: "정채은",
        loginId: "wise_chaeun",
        team: "빅데이터팀",
        roleGroup: "마스터 관리자",
        status: "활성",
        contact: "010-3344-5566",
        mfaEnabled: "사용",
        lastLoginAt: "2026-02-27 13:09",
        lastActivityAt: "2026-02-27 13:40",
        createdAt: "2025-09-22",
        createdBy: "super.admin",
        isLocked: false,
        inactiveReason: "휴직",
    },
    {
        id: "MGR-004",
        name: "함상준",
        loginId: "wise_sangjun",
        team: "빅데이터팀",
        roleGroup: "마스터 관리자",
        status: "활성",
        contact: "010-7788-9900",
        mfaEnabled: "사용",
        lastLoginAt: "2026-03-04 08:01",
        lastActivityAt: "2026-03-04 09:35",
        createdAt: "2025-10-10",
        createdBy: "super.admin",
        isLocked: true,
        lockReason: "비정상 로그인 시도 5회",
    },
    {
        id: "MGR-005",
        name: "정서영",
        loginId: "wise_seo",
        team: "빅데이터팀",
        roleGroup: "마스터 관리자",
        status: "활성",
        contact: "010-1234-5678",
        mfaEnabled: "사용",
        lastLoginAt: "2026-03-04 09:12",
        lastActivityAt: "2026-03-04 10:03",
        createdAt: "2025-11-03",
        createdBy: "super.admin",
        isLocked: false,
    },
    {
        id: "MGR-006",
        name: "안세훈",
        loginId: "wise_sehun",
        team: "리서치팀",
        roleGroup: "운영 관리자",
        status: "활성",
        contact: "010-1234-5678",
        mfaEnabled: "사용",
        lastLoginAt: "2026-03-04 09:12",
        lastActivityAt: "2026-03-04 10:03",
        createdAt: "2025-11-03",
        createdBy: "super.admin",
        isLocked: false,
    },
];

export function toSortableNumber(value: string) {
    return Number(value.replaceAll("-", "").replaceAll(":", "").replaceAll(" ", ""));
}
