import { useState } from "react";
import { ChevronDown, ChevronRight, Plus, Pencil, Trash2 } from "lucide-react";
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

type SelectedNode =
    | { type: "parent"; data: Category }
    | { type: "child"; data: SubCategory; parent: Category };

type DialogMode =
    | { type: "add-parent" }
    | { type: "add-child"; parentId: string; parentName: string }
    | { type: "edit-parent"; category: Category }
    | { type: "edit-child"; sub: SubCategory; parentName: string };

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
    "border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]";

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

export function SurveyCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
    const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>(() =>
        Object.fromEntries(INITIAL_CATEGORIES.map((c) => [c.id, true])),
    );
    const [selected, setSelected] = useState<SelectedNode | null>(null);
    const [dialogMode, setDialogMode] = useState<DialogMode | null>(null);
    const [form, setForm] = useState<CategoryFormState>(DEFAULT_FORM);
    const [deleteTarget, setDeleteTarget] = useState<{
        type: "parent" | "child";
        id: string;
        name: string;
    } | null>(null);

    const toggleExpand = (id: string) => setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));

    const selectParent = (cat: Category) => setSelected({ type: "parent", data: cat });

    const selectChild = (sub: SubCategory, parent: Category) =>
        setSelected({ type: "child", data: sub, parent });

    const syncSelected = (updatedCategories: Category[]) => {
        if (!selected) return;
        if (selected.type === "parent") {
            const updated = updatedCategories.find((c) => c.id === selected.data.id);
            setSelected(updated ? { type: "parent", data: updated } : null);
        } else {
            const parent = updatedCategories.find((c) => c.id === selected.parent.id);
            const updatedSub = parent?.children.find((s) => s.id === selected.data.id);
            if (parent && updatedSub) {
                setSelected({ type: "child", data: updatedSub, parent });
            } else {
                setSelected(null);
            }
        }
    };

    const openAddParent = () => {
        setForm(DEFAULT_FORM);
        setDialogMode({ type: "add-parent" });
    };

    const openAddChild = (cat: Category) => {
        setForm(DEFAULT_FORM);
        setExpandedIds((prev) => ({ ...prev, [cat.id]: true }));
        setDialogMode({ type: "add-child", parentId: cat.id, parentName: cat.name });
    };

    const openEditSelected = () => {
        if (!selected) return;
        if (selected.type === "parent") {
            setForm({
                name: selected.data.name,
                visibility: selected.data.visibility,
                allowedOrgIds: selected.data.allowedOrgIds,
                status: selected.data.status,
            });
            setDialogMode({ type: "edit-parent", category: selected.data });
        } else {
            setForm({
                name: selected.data.name,
                visibility: selected.data.visibility,
                allowedOrgIds: selected.data.allowedOrgIds,
                status: selected.data.status,
            });
            setDialogMode({
                type: "edit-child",
                sub: selected.data,
                parentName: selected.parent.name,
            });
        }
    };

    const openDeleteSelected = () => {
        if (!selected) return;
        setDeleteTarget({
            type: selected.type === "parent" ? "parent" : "child",
            id: selected.data.id,
            name: selected.data.name,
        });
    };

    const closeDialog = () => {
        setDialogMode(null);
        setForm(DEFAULT_FORM);
    };

    const handleSave = () => {
        if (!form.name.trim()) return;
        const today = new Date().toISOString().slice(0, 10);
        const cleanOrgIds = form.visibility === "전체 공개" ? [] : form.allowedOrgIds;

        let updated: Category[] = categories;

        if (dialogMode?.type === "add-parent") {
            const newCat: Category = {
                id: `CAT-${Date.now()}`,
                name: form.name.trim(),
                order: categories.length + 1,
                status: form.status,
                visibility: form.visibility,
                allowedOrgIds: cleanOrgIds,
                createdAt: today,
                children: [],
            };
            updated = [...categories, newCat];
            setSelected({ type: "parent", data: newCat });
        } else if (dialogMode?.type === "add-child") {
            const parent = categories.find((c) => c.id === dialogMode.parentId)!;
            const newSub: SubCategory = {
                id: `CAT-${Date.now()}`,
                parentId: dialogMode.parentId,
                name: form.name.trim(),
                order: parent.children.length + 1,
                status: form.status,
                visibility: form.visibility,
                allowedOrgIds: cleanOrgIds,
                createdAt: today,
            };
            updated = categories.map((c) =>
                c.id === dialogMode.parentId ? { ...c, children: [...c.children, newSub] } : c,
            );
            const updatedParent = updated.find((c) => c.id === dialogMode.parentId)!;
            setSelected({ type: "child", data: newSub, parent: updatedParent });
        } else if (dialogMode?.type === "edit-parent") {
            updated = categories.map((c) =>
                c.id === dialogMode.category.id
                    ? {
                          ...c,
                          name: form.name.trim(),
                          status: form.status,
                          visibility: form.visibility,
                          allowedOrgIds: cleanOrgIds,
                      }
                    : c,
            );
            syncSelected(updated);
        } else if (dialogMode?.type === "edit-child") {
            updated = categories.map((c) => ({
                ...c,
                children: c.children.map((s) =>
                    s.id === dialogMode.sub.id
                        ? {
                              ...s,
                              name: form.name.trim(),
                              status: form.status,
                              visibility: form.visibility,
                              allowedOrgIds: cleanOrgIds,
                          }
                        : s,
                ),
            }));
            syncSelected(updated);
        }

        setCategories(updated);
        closeDialog();
    };

    const handleDeleteConfirm = () => {
        if (!deleteTarget) return;
        let updated: Category[];
        if (deleteTarget.type === "parent") {
            updated = categories
                .filter((c) => c.id !== deleteTarget.id)
                .map((c, i) => ({ ...c, order: i + 1 }));
        } else {
            updated = categories.map((c) => ({
                ...c,
                children: c.children
                    .filter((s) => s.id !== deleteTarget.id)
                    .map((s, i) => ({ ...s, order: i + 1 })),
            }));
        }
        setCategories(updated);
        syncSelected(updated);
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

    const dialogTitle: Record<DialogMode["type"], string> = {
        "add-parent": "대분류 추가",
        "add-child": "소분류 추가",
        "edit-parent": "대분류 수정",
        "edit-child": "소분류 수정",
    };

    const allowedOrgNames =
        selected?.data.allowedOrgIds
            .map((id) => MOCK_ORGS.find((o) => o.id === id)?.name)
            .filter(Boolean)
            .join(", ") ?? "";

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-8">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">카테고리 관리</h1>
                    <p className="text-muted-foreground">
                        설문 템플릿의 대분류 및 소분류 카테고리를 관리합니다.
                    </p>
                </div>
                <Button type="button" onClick={openAddParent}>
                    <Plus className="size-4" />
                    카테고리 추가
                </Button>
            </div>

            <div className="flex flex-1 gap-4">
                {/* 트리 영역 */}
                <div className="w-72 shrink-0 rounded-lg border bg-card">
                    <div className="border-b px-4 py-3">
                        <p className="text-sm font-medium text-muted-foreground">카테고리 목록</p>
                    </div>
                    <div className="p-2">
                        {categories.length === 0 ? (
                            <p className="px-2 py-4 text-center text-sm text-muted-foreground">
                                등록된 카테고리가 없습니다.
                            </p>
                        ) : (
                            <ul className="flex flex-col gap-0.5">
                                {categories.map((cat, catIndex) => {
                                    const isExpanded = expandedIds[cat.id];
                                    const isParentSelected =
                                        selected?.type === "parent" && selected.data.id === cat.id;

                                    return (
                                        <li key={cat.id}>
                                            <div
                                                className={`group flex items-center gap-1 rounded-md px-2 py-1.5 ${
                                                    isParentSelected
                                                        ? "bg-primary text-primary-foreground"
                                                        : "hover:bg-muted"
                                                }`}>
                                                <button
                                                    type="button"
                                                    onClick={() => toggleExpand(cat.id)}
                                                    className="shrink-0 p-0.5">
                                                    {cat.children.length > 0 ? (
                                                        isExpanded ? (
                                                            <ChevronDown className="size-3.5" />
                                                        ) : (
                                                            <ChevronRight className="size-3.5" />
                                                        )
                                                    ) : (
                                                        <span className="size-3.5 block" />
                                                    )}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => selectParent(cat)}
                                                    className="flex flex-1 items-center gap-1.5 text-left text-sm font-medium truncate">
                                                    <span className="truncate">{cat.name}</span>
                                                    <span
                                                        className={`shrink-0 text-xs ${
                                                            isParentSelected
                                                                ? "text-primary-foreground/70"
                                                                : "text-muted-foreground"
                                                        }`}>
                                                        ({cat.children.length})
                                                    </span>
                                                </button>
                                                <div className="flex shrink-0 items-center gap-0.5 opacity-0 group-hover:opacity-100">
                                                    <button
                                                        type="button"
                                                        disabled={catIndex === 0}
                                                        onClick={() => moveParent(catIndex, "up")}
                                                        className={`rounded p-0.5 text-xs hover:bg-black/10 disabled:opacity-30 ${isParentSelected ? "text-primary-foreground" : ""}`}>
                                                        ▲
                                                    </button>
                                                    <button
                                                        type="button"
                                                        disabled={
                                                            catIndex === categories.length - 1
                                                        }
                                                        onClick={() => moveParent(catIndex, "down")}
                                                        className={`rounded p-0.5 text-xs hover:bg-black/10 disabled:opacity-30 ${isParentSelected ? "text-primary-foreground" : ""}`}>
                                                        ▼
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => openAddChild(cat)}
                                                        className={`rounded p-0.5 hover:bg-black/10 ${isParentSelected ? "text-primary-foreground" : "text-muted-foreground"}`}
                                                        title="소분류 추가">
                                                        <Plus className="size-3" />
                                                    </button>
                                                </div>
                                            </div>

                                            {isExpanded && cat.children.length > 0 && (
                                                <ul className="ml-5 mt-0.5 flex flex-col gap-0.5 border-l pl-2">
                                                    {cat.children.map((sub, subIndex) => {
                                                        const isChildSelected =
                                                            selected?.type === "child" &&
                                                            selected.data.id === sub.id;
                                                        return (
                                                            <li key={sub.id}>
                                                                <div
                                                                    className={`group flex items-center gap-1 rounded-md px-2 py-1.5 ${
                                                                        isChildSelected
                                                                            ? "bg-primary text-primary-foreground"
                                                                            : "hover:bg-muted"
                                                                    }`}>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            selectChild(sub, cat)
                                                                        }
                                                                        className="flex-1 truncate text-left text-sm">
                                                                        {sub.name}
                                                                    </button>
                                                                    <div className="flex shrink-0 items-center gap-0.5 opacity-0 group-hover:opacity-100">
                                                                        <button
                                                                            type="button"
                                                                            disabled={
                                                                                subIndex === 0
                                                                            }
                                                                            onClick={() =>
                                                                                moveChild(
                                                                                    cat.id,
                                                                                    subIndex,
                                                                                    "up",
                                                                                )
                                                                            }
                                                                            className={`rounded p-0.5 text-xs hover:bg-black/10 disabled:opacity-30 ${isChildSelected ? "text-primary-foreground" : ""}`}>
                                                                            ▲
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            disabled={
                                                                                subIndex ===
                                                                                cat.children
                                                                                    .length -
                                                                                    1
                                                                            }
                                                                            onClick={() =>
                                                                                moveChild(
                                                                                    cat.id,
                                                                                    subIndex,
                                                                                    "down",
                                                                                )
                                                                            }
                                                                            className={`rounded p-0.5 text-xs hover:bg-black/10 disabled:opacity-30 ${isChildSelected ? "text-primary-foreground" : ""}`}>
                                                                            ▼
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </div>

                {/* 상세 영역 */}
                <div className="flex-1 rounded-lg border bg-card">
                    {selected === null ? (
                        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                            왼쪽에서 카테고리를 선택하세요.
                        </div>
                    ) : (
                        <div className="flex flex-col gap-0">
                            <div className="flex items-center justify-between border-b px-6 py-4">
                                <h2 className="font-semibold">
                                    {selected.type === "parent" ? "대분류" : "소분류"} 상세
                                </h2>
                                <div className="flex gap-2">
                                    {selected.type === "parent" && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            type="button"
                                            onClick={() => openAddChild(selected.data as Category)}>
                                            <Plus className="size-3.5" />
                                            소분류 추가
                                        </Button>
                                    )}
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        type="button"
                                        onClick={openEditSelected}>
                                        <Pencil className="size-3.5" />
                                        수정
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        type="button"
                                        className="text-destructive hover:text-destructive"
                                        onClick={openDeleteSelected}>
                                        <Trash2 className="size-3.5" />
                                        삭제
                                    </Button>
                                </div>
                            </div>

                            <div className="grid gap-0 divide-y px-6">
                                <DetailRow label="카테고리명" value={selected.data.name} />
                                {selected.type === "child" && (
                                    <DetailRow label="상위 카테고리" value={selected.parent.name} />
                                )}
                                <DetailRow label="노출 순서" value={String(selected.data.order)} />
                                <DetailRow
                                    label="공개 범위"
                                    value={
                                        <VisibilityBadge visibility={selected.data.visibility} />
                                    }
                                />
                                {selected.data.visibility === "특정 기관" && (
                                    <DetailRow label="허용 기관" value={allowedOrgNames || "-"} />
                                )}
                                <DetailRow
                                    label="상태"
                                    value={<StatusBadge status={selected.data.status} />}
                                />
                                <DetailRow label="등록일" value={selected.data.createdAt} />
                                {selected.type === "parent" && (
                                    <DetailRow
                                        label="소분류 수"
                                        value={`${(selected.data as Category).children.length}개`}
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 등록/수정 다이얼로그 */}
            <Dialog open={dialogMode !== null} onOpenChange={(open) => !open && closeDialog()}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{dialogMode ? dialogTitle[dialogMode.type] : ""}</DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col gap-4 py-2">
                        {(dialogMode?.type === "add-child" ||
                            dialogMode?.type === "edit-child") && (
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium">상위 카테고리</label>
                                <p className="text-sm text-muted-foreground">
                                    {dialogMode.type === "add-child"
                                        ? dialogMode.parentName
                                        : dialogMode.parentName}
                                </p>
                            </div>
                        )}

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

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-center gap-4 py-3.5">
            <span className="w-32 shrink-0 text-sm text-muted-foreground">{label}</span>
            <span className="text-sm font-medium">{value}</span>
        </div>
    );
}
