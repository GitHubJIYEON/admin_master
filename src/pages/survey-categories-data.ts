export type CategoryVisibility = "전체 공개" | "특정 기관";
export type CategoryStatus = "활성" | "비활성";

export type SubCategory = {
    id: string;
    parentId: string;
    name: string;
    order: number;
    status: CategoryStatus;
    visibility: CategoryVisibility;
    allowedOrgIds: string[];
    createdAt: string;
};

export type Category = {
    id: string;
    name: string;
    order: number;
    status: CategoryStatus;
    visibility: CategoryVisibility;
    allowedOrgIds: string[];
    createdAt: string;
    children: SubCategory[];
};

export const INITIAL_CATEGORIES: Category[] = [
    {
        id: "CAT-001",
        name: "만족도 조사",
        order: 1,
        status: "활성",
        visibility: "전체 공개",
        allowedOrgIds: [],
        createdAt: "2025-01-10",
        children: [
            {
                id: "CAT-001-1",
                parentId: "CAT-001",
                name: "서비스 만족도",
                order: 1,
                status: "활성",
                visibility: "전체 공개",
                allowedOrgIds: [],
                createdAt: "2025-01-10",
            },
            {
                id: "CAT-001-2",
                parentId: "CAT-001",
                name: "교육 만족도",
                order: 2,
                status: "활성",
                visibility: "특정 기관",
                allowedOrgIds: ["ORG-001", "ORG-002"],
                createdAt: "2025-01-15",
            },
        ],
    },
    {
        id: "CAT-002",
        name: "진단 설문",
        order: 2,
        status: "활성",
        visibility: "전체 공개",
        allowedOrgIds: [],
        createdAt: "2025-02-05",
        children: [
            {
                id: "CAT-002-1",
                parentId: "CAT-002",
                name: "조직 역량 진단",
                order: 1,
                status: "활성",
                visibility: "특정 기관",
                allowedOrgIds: ["ORG-003"],
                createdAt: "2025-02-05",
            },
            {
                id: "CAT-002-2",
                parentId: "CAT-002",
                name: "개인 역량 진단",
                order: 2,
                status: "비활성",
                visibility: "전체 공개",
                allowedOrgIds: [],
                createdAt: "2025-02-20",
            },
        ],
    },
    {
        id: "CAT-003",
        name: "NPS 조사",
        order: 3,
        status: "비활성",
        visibility: "특정 기관",
        allowedOrgIds: ["ORG-001"],
        createdAt: "2025-03-01",
        children: [],
    },
];

export const MOCK_ORGS = [
    { id: "ORG-001", name: "서울시 공공데이터센터" },
    { id: "ORG-002", name: "한국디지털교육원" },
    { id: "ORG-003", name: "부산광역시청" },
    { id: "ORG-004", name: "경기도 교육청" },
];
