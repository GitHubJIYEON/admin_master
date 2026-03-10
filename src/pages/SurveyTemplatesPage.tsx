import { useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { INITIAL_SURVEY_TEMPLATES, type SurveyTemplateStatus } from "@/pages/survey-templates-data";

const getStatusBadgeClass = (status: SurveyTemplateStatus) => {
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

export function SurveyTemplatesPage() {
    const navigate = useNavigate();
    const rows = INITIAL_SURVEY_TEMPLATES;
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("전체");
    const [statusFilter, setStatusFilter] = useState<SurveyTemplateStatus | "전체">("전체");

    const categories = useMemo(() => {
        const set = new Set(rows.map((r) => r.categoryName));
        return Array.from(set).sort();
    }, [rows]);

    const filteredRows = useMemo(() => {
        const normalized = search.trim().toLowerCase();
        return rows.filter((row) => {
            const matchesSearch =
                normalized.length === 0 ||
                row.title.toLowerCase().includes(normalized) ||
                row.description.toLowerCase().includes(normalized) ||
                row.categoryName.toLowerCase().includes(normalized) ||
                row.subCategoryName.toLowerCase().includes(normalized);
            const matchesCategory =
                categoryFilter === "전체" || row.categoryName === categoryFilter;
            const matchesStatus = statusFilter === "전체" || row.status === statusFilter;

            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [categoryFilter, rows, search, statusFilter]);

    const selectClass =
        "border-input h-9 min-w-28 rounded-md border bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]";

    const handlePreview = (id: string, title: string) => {
        window.alert(`"${title}" 템플릿 미리보기입니다. (ID: ${id})`);
    };

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">설문 템플릿 목록</h1>
                    <p className="text-muted-foreground">설문 템플릿을 조회하고 관리합니다.</p>
                </div>
                <Button type="button" onClick={() => navigate("/surveys/templates/new")}>
                    <Plus className="size-4" />
                    템플릿 추가
                </Button>
            </div>

            <div className="rounded-lg border bg-card p-4">
                <div className="mb-4 grid gap-3 lg:grid-cols-[1fr_auto_auto]">
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="템플릿명/설명/카테고리 검색"
                    />
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className={selectClass}>
                        <option value="전체">카테고리: 전체</option>
                        {categories.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(e.target.value as SurveyTemplateStatus | "전체")
                        }
                        className={selectClass}>
                        <option value="전체">상태: 전체</option>
                        <option value="활성">활성</option>
                        <option value="비활성">비활성</option>
                        <option value="임시저장">임시저장</option>
                    </select>
                </div>

                <div className="mb-3 flex items-center justify-end text-sm text-muted-foreground">
                    조회 {filteredRows.length}건
                </div>

                <div className="overflow-x-auto rounded-md border">
                    <table className="w-full min-w-[900px] border-collapse text-sm">
                        <thead className="bg-muted/50 text-foreground">
                            <tr className="border-b">
                                <th className="px-3 py-2.5 text-left font-medium">템플릿명</th>
                                <th className="px-3 py-2.5 text-left font-medium">카테고리</th>
                                <th className="px-3 py-2.5 text-left font-medium">소분류</th>
                                <th className="px-3 py-2.5 text-center font-medium">문항 수</th>
                                <th className="px-3 py-2.5 text-center font-medium">예상 소요</th>
                                <th className="px-3 py-2.5 text-center font-medium">사용 횟수</th>
                                <th className="px-3 py-2.5 text-center font-medium">상태</th>
                                <th className="px-3 py-2.5 text-center font-medium">생성일</th>
                                <th className="px-3 py-2.5 text-center font-medium">미리보기</th>
                                <th className="px-3 py-2.5 text-center font-medium">상세보기</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRows.length > 0 ? (
                                filteredRows.map((row) => (
                                    <tr
                                        key={row.id}
                                        className="border-b last:border-0 hover:bg-muted/30">
                                        <td className="px-3 py-2.5 font-medium">{row.title}</td>
                                        <td className="px-3 py-2.5">{row.categoryName}</td>
                                        <td className="px-3 py-2.5">{row.subCategoryName}</td>
                                        <td className="px-3 py-2.5 text-center">
                                            {row.questionCount}문항
                                        </td>
                                        <td className="px-3 py-2.5 text-center">
                                            {row.estimatedMinutes}분
                                        </td>
                                        <td className="px-3 py-2.5 text-center">
                                            {row.usageCount}회
                                        </td>
                                        <td className="px-3 py-2.5 text-center">
                                            <span
                                                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getStatusBadgeClass(
                                                    row.status,
                                                )}`}>
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2.5 text-center">{row.createdAt}</td>
                                        <td className="px-3 py-2.5 text-center">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                type="button"
                                                onClick={() => handlePreview(row.id, row.title)}>
                                                미리보기
                                            </Button>
                                        </td>
                                        <td className="px-3 py-2.5 text-center">
                                            <Button asChild size="sm" variant="outline">
                                                <NavLink to={`/surveys/templates/${row.id}`}>
                                                    상세보기
                                                </NavLink>
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={10}
                                        className="h-24 px-3 py-2.5 text-center text-muted-foreground">
                                        검색 결과가 없습니다.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
