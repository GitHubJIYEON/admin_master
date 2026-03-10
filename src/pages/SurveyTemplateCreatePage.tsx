import { useState, useMemo } from "react";
import type { FormEvent } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { INITIAL_CATEGORIES } from "@/pages/survey-categories-data";
import { INITIAL_SURVEY_PROJECTS } from "@/pages/survey-projects-data";
import type {
    SurveyTemplateStatus,
    SurveyTemplateVisibility,
} from "@/pages/survey-templates-data";

type FormState = {
    title: string;
    description: string;
    projectId: string;
    categoryName: string;
    subCategoryName: string;
    questionCount: string;
    estimatedMinutes: string;
    status: SurveyTemplateStatus;
    visibility: SurveyTemplateVisibility;
};

const INITIAL_FORM: FormState = {
    title: "",
    description: "",
    projectId: "",
    categoryName: "",
    subCategoryName: "",
    questionCount: "",
    estimatedMinutes: "",
    status: "활성",
    visibility: "공개",
};

const SELECT_CLASS =
    "border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]";

export function SurveyTemplateCreatePage() {
    const navigate = useNavigate();
    const [form, setForm] = useState<FormState>(INITIAL_FORM);

    const subCategories = useMemo(() => {
        const cat = INITIAL_CATEGORIES.find((c) => c.name === form.categoryName);
        return cat?.children ?? [];
    }, [form.categoryName]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const questionCount = parseInt(form.questionCount, 10);
        const estimatedMinutes = parseInt(form.estimatedMinutes, 10);
        if (isNaN(questionCount) || questionCount < 1) {
            window.alert("문항 수는 1 이상의 숫자를 입력하세요.");
            return;
        }
        if (isNaN(estimatedMinutes) || estimatedMinutes < 1) {
            window.alert("예상 소요 시간은 1 이상의 숫자를 입력하세요.");
            return;
        }
        if (!form.categoryName) {
            window.alert("카테고리를 선택하세요.");
            return;
        }
        window.alert("템플릿이 등록되었습니다.");
        navigate("/surveys/templates");
    };

    const handleCategoryChange = (value: string) => {
        setForm((prev) => ({
            ...prev,
            categoryName: value,
            subCategoryName: "",
        }));
    };

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">템플릿 생성</h1>
                <p className="text-muted-foreground">
                    새 설문 템플릿을 작성하고 등록합니다.
                </p>
            </div>

            <form className="rounded-lg border bg-card p-6" onSubmit={handleSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                    <label className="flex flex-col gap-2 text-sm md:col-span-2">
                        <span className="font-medium">템플릿명</span>
                        <Input
                            value={form.title}
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, title: e.target.value }))
                            }
                            placeholder="템플릿명을 입력하세요"
                            required
                        />
                    </label>

                    <label className="flex flex-col gap-2 text-sm md:col-span-2">
                        <span className="font-medium">설명</span>
                        <Input
                            value={form.description}
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, description: e.target.value }))
                            }
                            placeholder="템플릿 설명을 입력하세요"
                        />
                    </label>

                    <label className="flex flex-col gap-2 text-sm">
                        <span className="font-medium">프로젝트 고유번호</span>
                        <select
                            value={form.projectId}
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, projectId: e.target.value }))
                            }
                            className={SELECT_CLASS}>
                            <option value="">선택하세요</option>
                            {INITIAL_SURVEY_PROJECTS.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.projectNumber} - {p.projectName}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="flex flex-col gap-2 text-sm">
                        <span className="font-medium">카테고리</span>
                        <select
                            value={form.categoryName}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            className={SELECT_CLASS}
                            required>
                            <option value="">선택하세요</option>
                            {INITIAL_CATEGORIES.filter((c) => c.status === "활성").map(
                                (c) => (
                                    <option key={c.id} value={c.name}>
                                        {c.name}
                                    </option>
                                ),
                            )}
                        </select>
                    </label>

                    <label className="flex flex-col gap-2 text-sm">
                        <span className="font-medium">소분류</span>
                        <select
                            value={form.subCategoryName}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    subCategoryName: e.target.value,
                                }))
                            }
                            className={SELECT_CLASS}>
                            <option value="">선택하세요</option>
                            <option value="-">-</option>
                            {subCategories
                                .filter((s) => s.status === "활성")
                                .map((s) => (
                                    <option key={s.id} value={s.name}>
                                        {s.name}
                                    </option>
                                ))}
                        </select>
                    </label>

                    <label className="flex flex-col gap-2 text-sm">
                        <span className="font-medium">문항 수</span>
                        <Input
                            type="number"
                            min={1}
                            value={form.questionCount}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    questionCount: e.target.value,
                                }))
                            }
                            placeholder="예: 15"
                            required
                        />
                    </label>

                    <label className="flex flex-col gap-2 text-sm">
                        <span className="font-medium">예상 소요 (분)</span>
                        <Input
                            type="number"
                            min={1}
                            value={form.estimatedMinutes}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    estimatedMinutes: e.target.value,
                                }))
                            }
                            placeholder="예: 5"
                            required
                        />
                    </label>

                    <label className="flex flex-col gap-2 text-sm">
                        <span className="font-medium">상태</span>
                        <select
                            value={form.status}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    status: e.target.value as SurveyTemplateStatus,
                                }))
                            }
                            className={SELECT_CLASS}>
                            <option value="활성">활성</option>
                            <option value="비활성">비활성</option>
                            <option value="임시저장">임시저장</option>
                        </select>
                    </label>

                    <label className="flex flex-col gap-2 text-sm">
                        <span className="font-medium">공개 여부</span>
                        <select
                            value={form.visibility}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    visibility: e.target.value as SurveyTemplateVisibility,
                                }))
                            }
                            className={SELECT_CLASS}>
                            <option value="공개">공개</option>
                            <option value="비공개">비공개</option>
                        </select>
                    </label>
                </div>

                <div className="mt-6 flex items-center justify-end gap-2">
                    <Button asChild variant="outline" type="button">
                        <NavLink to="/surveys/templates">취소</NavLink>
                    </Button>
                    <Button type="submit">등록</Button>
                </div>
            </form>
        </div>
    );
}
