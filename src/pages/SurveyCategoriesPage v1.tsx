import { useState } from "react";
import { ChevronDown, ChevronRight, Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    INITIAL_CATEGORIES,
    MOCK_ORGS,
    type Category,
    type CategoryStatus,
    type CategoryVisibility,
    type SubCategory,
} from "@/pages/survey-categories-data";

type CategoryFormState = {
    name: string;
    visibility: CategoryVisibility;
    allowedOrgIds: string[];
    status: CategoryStatus;
};

const DEFAULT_FORM: CategoryFormState = {
    name: "",
    visibility: "전체 공개",
    allowedOrgIds: [],
    status: "활성",
};

const SELECT_CLASS =
    "border-input h-9 rounded-md border bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]";

const StatusBadge = ({ status }: { status: CategoryStatus }) => (
    <span
        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
            status === "활성" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
        }`}>
        {status}
    </span>
);

const VisibilityBadge = ({ visibility }: { visibility: CategoryVisibility }) => (
    <span
        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
            visibility === "전체 공개" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
        }`}>
        {visibility}
    </span>
);

type DialogMode =
    | { type: "add-parent" }
    | { type: "add-child"; parentId: string }
    | { type: "edit-parent"; category: Category }
    | { type: "edit-child"; sub: SubCategory };

export function SurveyCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
    const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
    const [dialogMode, setDialogMode] = useState<DialogMode | null>(null);
    const [form, setForm] = useState<CategoryFormState>(DEFAULT_FORM);
    const [deleteTarget, setDeleteTarget] = useState<{
        type: "parent" | "child";
        id: string;
        parentId?: string;
        name: string;
    } | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const openAddParent = () => {
        setForm(DEFAULT_FORM);
        setDialogMode({ type: "add-parent" });
    };

    const openAddChild = (parentId: string) => {
        setForm(DEFAULT_FORM);
        setDialogMode({ type: "add-child", parentId });
        setExpandedIds((prev) => ({ ...prev, [parentId]: true }));
    };

    const openEditParent = (category: Category) => {
        setForm({
            name: category.name,
            visibility: category.visibility,
            allowedOrgIds: category.allowedOrgIds,
            status: category.status,
        });
        setDialogMode({ type: "edit-parent", category });
    };

    const openEditChild = (sub: SubCategory) => {
        setForm({
            name: sub.name,
            visibility: sub.visibility,
            allowedOrgIds: sub.allowedOrgIds,
            status: sub.status,
        });
        setDialogMode({ type: "edit-child", sub });
    };

    const closeDialog = () => {
        setDialogMode(null);
        setForm(DEFAULT_FORM);
    };

    const handleSave = () => {
        if (!form.name.trim()) return;

        const today = new Date().toISOString().slice(0, 10);

        if (dialogMode?.type === "add-parent") {
            const newCat: Category = {
                id: `CAT-${Date.now()}`,
                name: form.name.trim(),
                order: categories.length + 1,
                status: form.status,
                visibility: form.visibility,
                allowedOrgIds: form.visibility === "전체 공개" ? [] : form.allowedOrgIds,
                createdAt: today,
                children: [],
            };
            setCategories((prev) => [...prev, newCat]);
        } else if (dialogMode?.type === "add-child") {
            const sub: SubCategory = {
                id: `CAT-${Date.now()}`,
                parentId: dialogMode.parentId,
                name: form.name.trim(),
                order:
                    (categories.find((c) => c.id === dialogMode.parentId)?.children.length ?? 0) +
                    1,
                status: form.status,
                visibility: form.visibility,
                allowedOrgIds: form.visibility === "전체 공개" ? [] : form.allowedOrgIds,
                createdAt: today,
            };
            setCategories((prev) =>
                prev.map((c) =>
                    c.id === dialogMode.parentId ? { ...c, children: [...c.children, sub] } : c,
                ),
            );
        } else if (dialogMode?.type === "edit-parent") {
            setCategories((prev) =>
                prev.map((c) =>
                    c.id === dialogMode.category.id
                        ? {
                              ...c,
                              name: form.name.trim(),
                              status: form.status,
                              visibility: form.visibility,
                              allowedOrgIds:
                                  form.visibility === "전체 공개" ? [] : form.allowedOrgIds,
                          }
                        : c,
                ),
            );
        } else if (dialogMode?.type === "edit-child") {
            setCategories((prev) =>
                prev.map((c) => ({
                    ...c,
                    children: c.children.map((s) =>
                        s.id === dialogMode.sub.id
                            ? {
                                  ...s,
                                  name: form.name.trim(),
                                  status: form.status,
                                  visibility: form.visibility,
                                  allowedOrgIds:
                                      form.visibility === "전체 공개" ? [] : form.allowedOrgIds,
                              }
                            : s,
                    ),
                })),
            );
        }

        closeDialog();
    };

    const handleDeleteConfirm = () => {
        if (!deleteTarget) return;
        if (deleteTarget.type === "parent") {
            setCategories((prev) => {
                const filtered = prev.filter((c) => c.id !== deleteTarget.id);
                return filtered.map((c, i) => ({ ...c, order: i + 1 }));
            });
        } else {
            setCategories((prev) =>
                prev.map((c) => ({
                    ...c,
                    children: c.children
                        .filter((s) => s.id !== deleteTarget.id)
                        .map((s, i) => ({ ...s, order: i + 1 })),
                })),
            );
        }
        setDeleteTarget(null);
    };

    const moveParent = (index: number, direction: "up" | "down") => {
        setCategories((prev) => {
            const next = [...prev];
            const target = direction === "up" ? index - 1 : index + 1;
            if (target < 0 || target >= next.length) return prev;
            [next[index], next[target]] = [next[target], next[index]];
            return next.map((c, i) => ({ ...c, order: i + 1 }));
        });
    };

    const moveChild = (parentId: string, index: number, direction: "up" | "down") => {
        setCategories((prev) =>
            prev.map((c) => {
                if (c.id !== parentId) return c;
                const next = [...c.children];
                const target = direction === "up" ? index - 1 : index + 1;
                if (target < 0 || target >= next.length) return c;
                [next[index], next[target]] = [next[target], next[index]];
                return { ...c, children: next.map((s, i) => ({ ...s, order: i + 1 })) };
            }),
        );
    };

    const toggleOrgSelection = (orgId: string) => {
        setForm((prev) => ({
            ...prev,
            allowedOrgIds: prev.allowedOrgIds.includes(orgId)
                ? prev.allowedOrgIds.filter((id) => id !== orgId)
                : [...prev.allowedOrgIds, orgId],
        }));
    };

    const dialogTitle = {
        "add-parent": "대분류 추가",
        "add-child": "소분류 추가",
        "edit-parent": "대분류 수정",
        "edit-child": "소분류 수정",
    }[dialogMode?.type ?? "add-parent"];

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">템플릿 카테고리 관리</h1>
                    <p className="text-muted-foreground">
                        설문 템플릿의 대분류 및 소분류 카테고리를 관리합니다.
                    </p>
                </div>
                <Button type="button" onClick={openAddParent}>
                    <Plus className="size-4" />
                    대분류 추가
                </Button>
            </div>

            <div className="rounded-lg border bg-card">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[860px] border-collapse text-sm">
                        <thead className="bg-muted/50 text-foreground">
                            <tr className="border-b">
                                <th className="w-8 px-3 py-2.5" />
                                <th className="px-3 py-2.5 text-left font-medium">카테고리명</th>
                                <th className="px-3 py-2.5 text-center font-medium">노출 순서</th>
                                <th className="px-3 py-2.5 text-center font-medium">공개 범위</th>
                                <th className="px-3 py-2.5 text-center font-medium">상태</th>
                                <th className="px-3 py-2.5 text-center font-medium">등록일</th>
                                <th className="px-3 py-2.5 text-center font-medium">관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="h-24 text-center text-muted-foreground">
                                        등록된 카테고리가 없습니다.
                                    </td>
                                </tr>
                            ) : (
                                categories.map((cat, catIndex) => (
                                    <>
                                        <tr
                                            key={cat.id}
                                            className="border-b bg-muted/20 hover:bg-muted/40">
                                            <td className="px-3 py-2.5 text-center">
                                                <GripVertical className="mx-auto size-4 text-muted-foreground" />
                                            </td>
                                            <td className="px-3 py-2.5">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleExpand(cat.id)}
                                                    className="flex items-center gap-1.5 font-medium hover:text-primary">
                                                    {cat.children.length > 0 ? (
                                                        expandedIds[cat.id] ? (
                                                            <ChevronDown className="size-4 shrink-0" />
                                                        ) : (
                                                            <ChevronRight className="size-4 shrink-0" />
                                                        )
                                                    ) : (
                                                        <span className="w-4" />
                                                    )}
                                                    {cat.name}
                                                    <span className="ml-1 text-xs text-muted-foreground">
                                                        ({cat.children.length})
                                                    </span>
                                                </button>
                                            </td>
                                            <td className="px-3 py-2.5 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <button
                                                        type="button"
                                                        disabled={catIndex === 0}
                                                        onClick={() => moveParent(catIndex, "up")}
                                                        className="rounded px-1 hover:bg-muted disabled:opacity-30">
                                                        ▲
                                                    </button>
                                                    <span className="min-w-6 text-center">
                                                        {cat.order}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        disabled={
                                                            catIndex === categories.length - 1
                                                        }
                                                        onClick={() => moveParent(catIndex, "down")}
                                                        className="rounded px-1 hover:bg-muted disabled:opacity-30">
                                                        ▼
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-3 py-2.5 text-center">
                                                <VisibilityBadge visibility={cat.visibility} />
                                            </td>
                                            <td className="px-3 py-2.5 text-center">
                                                <StatusBadge status={cat.status} />
                                            </td>
                                            <td className="px-3 py-2.5 text-center">
                                                {cat.createdAt}
                                            </td>
                                            <td className="px-3 py-2.5">
                                                <div className="flex items-center justify-center gap-1">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        type="button"
                                                        onClick={() => openAddChild(cat.id)}>
                                                        <Plus className="size-3.5" />
                                                        소분류
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        type="button"
                                                        onClick={() => openEditParent(cat)}>
                                                        <Pencil className="size-3.5" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        type="button"
                                                        className="text-destructive hover:text-destructive"
                                                        onClick={() =>
                                                            setDeleteTarget({
                                                                type: "parent",
                                                                id: cat.id,
                                                                name: cat.name,
                                                            })
                                                        }>
                                                        <Trash2 className="size-3.5" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>

                                        {expandedIds[cat.id] &&
                                            cat.children.map((sub, subIndex) => (
                                                <tr
                                                    key={sub.id}
                                                    className="border-b last:border-0 hover:bg-muted/30">
                                                    <td className="px-3 py-2.5 text-center">
                                                        <GripVertical className="mx-auto size-4 text-muted-foreground/50" />
                                                    </td>
                                                    <td className="px-3 py-2.5">
                                                        <span className="ml-8 text-muted-foreground">
                                                            └ {sub.name}
                                                        </span>
                                                    </td>
                                                    <td className="px-3 py-2.5 text-center">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <button
                                                                type="button"
                                                                disabled={subIndex === 0}
                                                                onClick={() =>
                                                                    moveChild(
                                                                        cat.id,
                                                                        subIndex,
                                                                        "up",
                                                                    )
                                                                }
                                                                className="rounded px-1 hover:bg-muted disabled:opacity-30">
                                                                ▲
                                                            </button>
                                                            <span className="min-w-6 text-center">
                                                                {sub.order}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                disabled={
                                                                    subIndex ===
                                                                    cat.children.length - 1
                                                                }
                                                                onClick={() =>
                                                                    moveChild(
                                                                        cat.id,
                                                                        subIndex,
                                                                        "down",
                                                                    )
                                                                }
                                                                className="rounded px-1 hover:bg-muted disabled:opacity-30">
                                                                ▼
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-2.5 text-center">
                                                        <VisibilityBadge
                                                            visibility={sub.visibility}
                                                        />
                                                    </td>
                                                    <td className="px-3 py-2.5 text-center">
                                                        <StatusBadge status={sub.status} />
                                                    </td>
                                                    <td className="px-3 py-2.5 text-center">
                                                        {sub.createdAt}
                                                    </td>
                                                    <td className="px-3 py-2.5">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                type="button"
                                                                onClick={() => openEditChild(sub)}>
                                                                <Pencil className="size-3.5" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                type="button"
                                                                className="text-destructive hover:text-destructive"
                                                                onClick={() =>
                                                                    setDeleteTarget({
                                                                        type: "child",
                                                                        id: sub.id,
                                                                        parentId: cat.id,
                                                                        name: sub.name,
                                                                    })
                                                                }>
                                                                <Trash2 className="size-3.5" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                    </>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 등록/수정 다이얼로그 */}
            <Dialog open={dialogMode !== null} onOpenChange={(open) => !open && closeDialog()}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{dialogTitle}</DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col gap-4 py-2">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium">카테고리명</label>
                            <Input
                                value={form.name}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, name: e.target.value }))
                                }
                                placeholder="카테고리명을 입력하세요"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium">공개 범위</label>
                            <select
                                value={form.visibility}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        visibility: e.target.value as CategoryVisibility,
                                        allowedOrgIds: [],
                                    }))
                                }
                                className={SELECT_CLASS}>
                                <option value="전체 공개">전체 공개</option>
                                <option value="특정 기관">특정 기관</option>
                            </select>
                        </div>

                        {form.visibility === "특정 기관" && (
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium">허용 기관</label>
                                <div className="rounded-md border p-3">
                                    <div className="flex max-h-40 flex-col gap-2 overflow-y-auto">
                                        {MOCK_ORGS.map((org) => (
                                            <label
                                                key={org.id}
                                                className="flex cursor-pointer items-center gap-2 text-sm">
                                                <input
                                                    type="checkbox"
                                                    checked={form.allowedOrgIds.includes(org.id)}
                                                    onChange={() => toggleOrgSelection(org.id)}
                                                />
                                                <span>{org.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                {form.allowedOrgIds.length === 0 && (
                                    <p className="text-xs text-destructive">
                                        허용할 기관을 1개 이상 선택하세요.
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium">상태</label>
                            <select
                                value={form.status}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        status: e.target.value as CategoryStatus,
                                    }))
                                }
                                className={SELECT_CLASS}>
                                <option value="활성">활성</option>
                                <option value="비활성">비활성</option>
                            </select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" type="button" onClick={closeDialog}>
                            취소
                        </Button>
                        <Button
                            type="button"
                            disabled={
                                !form.name.trim() ||
                                (form.visibility === "특정 기관" && form.allowedOrgIds.length === 0)
                            }
                            onClick={handleSave}>
                            저장
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 삭제 확인 다이얼로그 */}
            <Dialog
                open={deleteTarget !== null}
                onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>카테고리 삭제</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">{deleteTarget?.name}</span>{" "}
                        카테고리를 삭제하시겠습니까?
                        {deleteTarget?.type === "parent" && (
                            <span className="mt-1 block text-destructive">
                                하위 소분류도 함께 삭제됩니다.
                            </span>
                        )}
                    </p>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => setDeleteTarget(null)}>
                            취소
                        </Button>
                        <Button variant="destructive" type="button" onClick={handleDeleteConfirm}>
                            삭제
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
