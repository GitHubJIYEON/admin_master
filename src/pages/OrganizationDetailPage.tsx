import { NavLink, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

type UsageStatus = "사용" | "미사용";
type ContractStatus = "정상" | "만료예정" | "만료" | "중지";
type OrganizationType = "공공기관" | "교육기관" | "민간기업" | "협회";

type OrganizationRow = {
    id: string;
    organizationNumber: string;
    organizationName: string;
    organizationType: OrganizationType;
    department: string;
    division: string;
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
        department: "정보화기획부",
        division: "데이터관리과",
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
        department: "교육운영부",
        division: "디지털교육과",
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
        department: "서비스개발본부",
        division: "플랫폼운영팀",
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
        department: "사무국",
        division: "회원관리과",
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
        department: "스마트행정부",
        division: "정보시스템과",
        managerName: "정하늘",
        contact: "051-333-2211",
        registeredAt: "2025-08-30",
        contractStatus: "만료",
        usageStatus: "미사용",
        adminCount: 2,
        userCount: 56,
    },
];

export function OrganizationDetailPage() {
    const { organizationId } = useParams();
    const organization = ORGANIZATION_ROWS.find((row) => row.id === organizationId);

    if (!organization) {
        return (
            <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <h1 className="text-2xl font-bold tracking-tight">기관 상세</h1>
                <div className="rounded-lg border bg-card p-6">
                    <p className="text-muted-foreground">기관 정보를 찾을 수 없습니다.</p>
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
                <h1 className="text-2xl font-bold tracking-tight">기관 상세</h1>
                <p className="text-muted-foreground">
                    {organization.organizationName} 기관의 상세 정보를 확인합니다.
                </p>
            </div>

            <div className="rounded-lg border bg-card p-6">
                <dl className="grid gap-4 md:grid-cols-2">
                    <div>
                        <dt className="text-sm text-muted-foreground">기관번호</dt>
                        <dd className="mt-1 font-medium">{organization.organizationNumber}</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">기관명</dt>
                        <dd className="mt-1 font-medium">{organization.organizationName}</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">기관유형</dt>
                        <dd className="mt-1 font-medium">{organization.organizationType}</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">사용여부</dt>
                        <dd className="mt-1 font-medium">{organization.usageStatus}</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">부서</dt>
                        <dd className="mt-1 font-medium">{organization.department || "-"}</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">과</dt>
                        <dd className="mt-1 font-medium">{organization.division || "-"}</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">관리자명</dt>
                        <dd className="mt-1 font-medium">{organization.managerName}</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">대표 연락처</dt>
                        <dd className="mt-1 font-medium">{organization.contact}</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">등록일</dt>
                        <dd className="mt-1 font-medium">{organization.registeredAt}</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">계약상태</dt>
                        <dd className="mt-1 font-medium">{organization.contractStatus}</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">기관 관리자 수</dt>
                        <dd className="mt-1 font-medium">{organization.adminCount}</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">기관 사용자 수</dt>
                        <dd className="mt-1 font-medium">{organization.userCount}</dd>
                    </div>
                </dl>
            </div>

            <div className="flex items-center justify-end gap-2">
                <Button asChild variant="outline">
                    <NavLink to="/organizations/list">목록으로</NavLink>
                </Button>
                <Button asChild>
                    <NavLink to={`/organizations/${organization.id}/edit`}>수정하기</NavLink>
                </Button>
            </div>
        </div>
    );
}
