import { NavLink, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { INITIAL_SURVEY_TEMPLATES } from "@/pages/survey-templates-data";
import { INITIAL_SURVEY_PROJECTS } from "@/pages/survey-projects-data";

const getStatusBadgeClass = (status: string) => {
    switch (status) {
        case "활성":
            return "bg-green-100 text-green-700";
        case "비활성":
            return "bg-slate-100 text-slate-500";
        case "임시저장":
            return "bg-amber-100 text-amber-700";
        default:
            return "bg-slate-100 text-slate-500";
    }
};

export function SurveyTemplateDetailPage() {
    const { templateId } = useParams();
    const template = INITIAL_SURVEY_TEMPLATES.find((t) => t.id === templateId);
    const project = template?.projectId
        ? INITIAL_SURVEY_PROJECTS.find((p) => p.id === template.projectId)
        : null;

    if (!template) {
        return (
            <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <h1 className="text-2xl font-bold tracking-tight">설문 템플릿 상세</h1>
                <div className="rounded-lg border bg-card p-6">
                    <p className="text-muted-foreground">설문 템플릿 정보를 찾을 수 없습니다.</p>
                    <div className="mt-4">
                        <Button asChild variant="outline">
                            <NavLink to="/surveys/templates">목록으로</NavLink>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">설문 템플릿 상세</h1>
                <p className="text-muted-foreground">
                    {template.title} 템플릿의 상세 정보를 조회합니다.
                </p>
            </div>

            <div className="rounded-lg border bg-card p-6">
                <div className="grid gap-4 text-sm md:grid-cols-2">
                    <p>
                        <span className="text-muted-foreground">템플릿명: </span>
                        <span className="font-medium">{template.title}</span>
                    </p>
                    <p>
                        <span className="text-muted-foreground">설명: </span>
                        <span className="font-medium">{template.description || "-"}</span>
                    </p>
                    <p>
                        <span className="text-muted-foreground">프로젝트 고유번호: </span>
                        <span className="font-medium">
                            {project ? `${project.projectNumber} - ${project.projectName}` : "-"}
                        </span>
                    </p>
                    <p>
                        <span className="text-muted-foreground">카테고리: </span>
                        <span className="font-medium">{template.categoryName}</span>
                    </p>
                    <p>
                        <span className="text-muted-foreground">소분류: </span>
                        <span className="font-medium">{template.subCategoryName}</span>
                    </p>
                    <p>
                        <span className="text-muted-foreground">문항 수: </span>
                        <span className="font-medium">{template.questionCount}문항</span>
                    </p>
                    <p>
                        <span className="text-muted-foreground">예상 소요: </span>
                        <span className="font-medium">{template.estimatedMinutes}분</span>
                    </p>
                    <p>
                        <span className="text-muted-foreground">상태: </span>
                        <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getStatusBadgeClass(
                                template.status,
                            )}`}>
                            {template.status}
                        </span>
                    </p>
                    <p>
                        <span className="text-muted-foreground">공개 여부: </span>
                        <span className="font-medium">{template.visibility}</span>
                    </p>
                    <p>
                        <span className="text-muted-foreground">사용 횟수: </span>
                        <span className="font-medium">{template.usageCount}회</span>
                    </p>
                    <p>
                        <span className="text-muted-foreground">생성자: </span>
                        <span className="font-medium">{template.createdBy}</span>
                    </p>
                    <p>
                        <span className="text-muted-foreground">생성일: </span>
                        <span className="font-medium">{template.createdAt}</span>
                    </p>
                    <p>
                        <span className="text-muted-foreground">수정일: </span>
                        <span className="font-medium">{template.updatedAt}</span>
                    </p>
                </div>
            </div>

            <div className="flex justify-end gap-2">
                <Button
                    variant="outline"
                    type="button"
                    onClick={() => window.alert(`"${template.title}" 템플릿 미리보기입니다.`)}>
                    미리보기
                </Button>

                <Button asChild variant="outline">
                    <NavLink to="/surveys/templates">목록으로</NavLink>
                </Button>
                <Button type="submit">
                    <NavLink to={`/surveys/templates/${template.id}/edit`}>수정하기</NavLink>
                </Button>
            </div>
        </div>
    );
}
