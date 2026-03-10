export type SurveyProject = {
    id: string;
    projectNumber: string;
    projectName: string;
    status: "진행중" | "완료" | "대기";
};

export const INITIAL_SURVEY_PROJECTS: SurveyProject[] = [
    {
        id: "PRJ-001",
        projectNumber: "P2025-001",
        projectName: "2025년 고객 만족도 조사",
        status: "진행중",
    },
    {
        id: "PRJ-002",
        projectNumber: "P2025-002",
        projectName: "교육 효과성 평가",
        status: "진행중",
    },
    {
        id: "PRJ-003",
        projectNumber: "P2024-012",
        projectName: "연말 서비스 개선 설문",
        status: "완료",
    },
    { id: "PRJ-004", projectNumber: "P2025-003", projectName: "조직 문화 진단", status: "대기" },
];
