export type SurveyTemplateStatus = "활성" | "비활성" | "임시저장";
export type SurveyTemplateVisibility = "공개" | "비공개";

export type SurveyTemplate = {
    id: string;
    title: string;
    description: string;
    projectId?: string;
    categoryName: string;
    subCategoryName: string;
    questionCount: number;
    estimatedMinutes: number;
    status: SurveyTemplateStatus;
    visibility: SurveyTemplateVisibility;
    usageCount: number;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
};

export const INITIAL_SURVEY_TEMPLATES: SurveyTemplate[] = [
    {
        id: "TPL-001",
        title: "서비스 만족도 설문",
        projectId: "PRJ-001",
        description: "서비스 이용 후 만족도를 측정하는 기본 템플릿",
        categoryName: "만족도 조사",
        subCategoryName: "서비스 만족도",
        questionCount: 15,
        estimatedMinutes: 5,
        status: "활성",
        visibility: "공개",
        usageCount: 42,
        createdBy: "관리자",
        createdAt: "2025-01-10",
        updatedAt: "2025-02-15",
    },
    {
        id: "TPL-002",
        title: "교육 만족도 평가",
        projectId: "PRJ-002",
        description: "교육 프로그램 수료 후 만족도 조사",
        categoryName: "만족도 조사",
        subCategoryName: "교육 만족도",
        questionCount: 20,
        estimatedMinutes: 8,
        status: "활성",
        visibility: "공개",
        usageCount: 28,
        createdBy: "관리자",
        createdAt: "2025-01-15",
        updatedAt: "2025-03-01",
    },
    {
        id: "TPL-003",
        title: "조직 역량 진단 설문",
        description: "조직의 역량 수준을 진단하는 설문",
        categoryName: "진단 설문",
        subCategoryName: "조직 역량 진단",
        questionCount: 35,
        estimatedMinutes: 15,
        status: "활성",
        visibility: "비공개",
        usageCount: 12,
        createdBy: "관리자",
        createdAt: "2025-02-05",
        updatedAt: "2025-02-20",
    },
    {
        id: "TPL-004",
        title: "NPS 고객 추천 설문",
        description: "Net Promoter Score 측정용 템플릿",
        categoryName: "NPS 조사",
        subCategoryName: "-",
        questionCount: 5,
        estimatedMinutes: 2,
        status: "비활성",
        visibility: "공개",
        usageCount: 0,
        createdBy: "관리자",
        createdAt: "2025-03-01",
        updatedAt: "2025-03-01",
    },
];
