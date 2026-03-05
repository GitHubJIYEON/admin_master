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

export function OrganizationMembersPage() {
    const { organizationId } = useParams();
    const organization = ORGANIZATION_ROWS.find((row) => row.id === organizationId);

    if (!organization) {
        return (
            <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <h1 className="text-2xl font-bold tracking-tight">구성원 관리</h1>
                <div className="rounded-lg border bg-card p-6">
                    <p className="text-muted-foreground">기관 정보를 찾을 수 없습니다.</p>
                    <div className="mt-4">
                        <Button asChild variant="outline" type="button">
                            <NavLink to="/organizations/list">목록으로</NavLink>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">구성원 관리</h1>
                    <p className="text-muted-foreground">
                        {organization.organizationName} 기관의 구성원을 관리합니다.
                    </p>
                </div>
                <Button asChild variant="outline" type="button">
                    <NavLink to={`/organizations/${organization.id}`}>기관 상세</NavLink>
                </Button>
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
                        <dt className="text-sm text-muted-foreground">기관 관리자 수</dt>
                        <dd className="mt-1 font-medium">
                            {organization.adminCount.toLocaleString("ko-KR")}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm text-muted-foreground">기관 사용자 수</dt>
                        <dd className="mt-1 font-medium">
                            {organization.userCount.toLocaleString("ko-KR")}
                        </dd>
                    </div>
                </dl>

                <div className="mt-6 rounded-md border bg-muted/20 p-4">
                    <p className="text-sm text-muted-foreground">
                        구성원 목록/등록/권한 관리는 다음 단계에서 테이블 화면으로 확장하면 됩니다.
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-end gap-2">
                <Button asChild variant="outline" type="button">
                    <NavLink to="/organizations/list">목록으로</NavLink>
                </Button>
            </div>
        </div>
    );
}
