import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PermissionGradeStatus = "활성" | "비활성";
type PermissionGradeCode =
    | "ROLE_MANAGER"
    | "ROLE_TEST"
    | "ROLE_TENANT"
    | "ROLE_MEMBER"
    | "ROLE_PERSONAL"
    | "ROLE_COMPANY_MEMBER";

type PermissionGrade = {
    id: string;
    code: PermissionGradeCode;
    name: string;
    level: number;
    description: string;
    status: PermissionGradeStatus;
};

const INITIAL_GRADES: PermissionGrade[] = [
    {
        id: "master",
        code: "ROLE_MANAGER",
        name: "마스터 관리자",
        level: 1,
        description: "시스템 전체 설정 및 모든 관리 기능 접근",
        status: "활성",
    },
    {
        id: "test",
        code: "ROLE_TEST",
        name: "테스트 계정",
        level: 99,
        description: "모든 서비스를 테스트로 테스트 해볼 수 있는 권한 계정",
        status: "비활성",
    },
    {
        id: "ops",
        code: "ROLE_TENANT",
        name: "운영 관리자",
        level: 2,
        description: "운영 기능 중심 접근(조직/사용자/판매/게시판 일부)",
        status: "활성",
    },
    {
        id: "viewer",
        code: "ROLE_MEMBER",
        name: "조회 전용",
        level: 3,
        description: "조회 권한만 부여(수정/삭제 불가)",
        status: "비활성",
    },
    {
        id: "personal-member",
        code: "ROLE_PERSONAL",
        name: "개인 회원",
        level: 4,
        description: "일반 개인 사용자의 홈페이지 회원가입 기본 등급",
        status: "활성",
    },
    {
        id: "company-member",
        code: "ROLE_COMPANY_MEMBER",
        name: "기업 회원(일반)",
        level: 5,
        description: "B2B 기관이 아닌 일반 회사 소속 회원가입 기본 등급",
        status: "활성",
    },
];

function normalizeNumber(value: string) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return null;
    return Math.trunc(parsed);
}

export function PermissionGradesPage() {
    const [rows, setRows] = useState<PermissionGrade[]>(INITIAL_GRADES);
    const [search, setSearch] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formCode, setFormCode] = useState<PermissionGradeCode>("ROLE_MANAGER");
    const [formName, setFormName] = useState("");
    const [formLevel, setFormLevel] = useState<string>("");
    const [formDescription, setFormDescription] = useState("");

    const filteredRows = useMemo(() => {
        const normalized = search.trim().toLowerCase();
        if (normalized.length === 0) return rows;

        return rows.filter((row) => {
            return (
                row.code.toLowerCase().includes(normalized) ||
                row.name.toLowerCase().includes(normalized) ||
                row.description.toLowerCase().includes(normalized) ||
                String(row.level).includes(normalized)
            );
        });
    }, [rows, search]);

    const resetForm = () => {
        setEditingId(null);
        setFormCode("ROLE_MANAGER");
        setFormName("");
        setFormLevel("");
        setFormDescription("");
    };

    const startCreate = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const startEdit = (target: PermissionGrade) => {
        setEditingId(target.id);
        setFormCode(target.code);
        setFormName(target.name);
        setFormLevel(String(target.level));
        setFormDescription(target.description);
        setIsModalOpen(true);
    };

    const toggleStatus = (id: string) => {
        setRows((prev) =>
            prev.map((row) =>
                row.id === id ? { ...row, status: row.status === "활성" ? "비활성" : "활성" } : row,
            ),
        );
    };

    const upsertRow = () => {
        const code = formCode;
        const name = formName.trim();
        const level = normalizeNumber(formLevel.trim());
        const description = formDescription.trim();

        if (name.length === 0) {
            window.alert("등급명을 입력해주세요.");
            return;
        }
        if (level === null) {
            window.alert("레벨은 숫자로 입력해주세요.");
            return;
        }

        const duplicatedCode = rows.some((row) => row.code === code && row.id !== editingId);
        if (duplicatedCode) {
            window.alert("동일한 등급코드가 이미 존재합니다. 다른 등급코드를 선택해주세요.");
            return;
        }

        const duplicatedLevel = rows.some((row) => row.level === level && row.id !== editingId);
        if (duplicatedLevel) {
            window.alert("동일한 레벨의 등급이 이미 존재합니다. 다른 레벨을 입력해주세요.");
            return;
        }

        if (editingId) {
            setRows((prev) =>
                prev.map((row) =>
                    row.id === editingId
                        ? {
                              ...row,
                              code,
                              name,
                              level,
                              description: description || row.description,
                          }
                        : row,
                ),
            );
            setIsModalOpen(false);
            resetForm();
            return;
        }

        const id = `grade_${Date.now()}`;
        setRows((prev) => [
            { id, code, name, level, description: description || "-", status: "활성" },
            ...prev,
        ]);
        setIsModalOpen(false);
        resetForm();
    };

    const cancelEdit = () => {
        setIsModalOpen(false);
        resetForm();
    };

    const isEditing = editingId !== null;

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">권한 등급 관리</h1>
                <p className="text-muted-foreground">
                    사용자/직원 계정에 적용할 권한 등급(역할)을 생성하고 상태를 관리합니다.
                </p>
            </div>
            <div className="flex items-center justify-end gap-2">
                <Button type="button" variant="default" onClick={startCreate}>
                    등급 생성
                </Button>
            </div>

            <div className="rounded-lg border bg-card p-4">
                <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-1 items-center gap-2">
                        <Input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="등급명/설명/레벨 검색"
                        />
                    </div>
                </div>

                <Dialog
                    open={isModalOpen}
                    onOpenChange={(open) => {
                        setIsModalOpen(open);
                        if (!open) resetForm();
                    }}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{isEditing ? "등급 수정" : "등급 생성"}</DialogTitle>
                            <DialogDescription>
                                등급 레벨은 숫자가 낮을수록 상위 권한으로 가정합니다.
                            </DialogDescription>
                        </DialogHeader>

                        <form
                            className="grid gap-4"
                            onSubmit={(event) => {
                                event.preventDefault();
                                upsertRow();
                            }}>
                            <div className="grid gap-2">
                                <Label htmlFor="grade-code">등급코드</Label>
                                <select
                                    id="grade-code"
                                    value={formCode}
                                    onChange={(event) =>
                                        setFormCode(event.target.value as PermissionGradeCode)
                                    }
                                    className="border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                                    <option value="ROLE_MANAGER">ROLE_MANAGER</option>
                                    <option value="ROLE_TEST">ROLE_TEST</option>
                                    <option value="ROLE_TENANT">ROLE_TENANT</option>
                                    <option value="ROLE_MEMBER">ROLE_MEMBER</option>
                                    <option value="ROLE_PERSONAL">ROLE_PERSONAL</option>
                                    <option value="ROLE_COMPANY_MEMBER">ROLE_COMPANY_MEMBER</option>
                                </select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="grade-name">등급명</Label>
                                <Input
                                    id="grade-name"
                                    value={formName}
                                    onChange={(event) => setFormName(event.target.value)}
                                    placeholder="예: 운영 관리자"
                                    autoFocus
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="grade-level">등급레벨</Label>
                                <Input
                                    id="grade-level"
                                    value={formLevel}
                                    onChange={(event) => setFormLevel(event.target.value)}
                                    placeholder="숫자 (예: 50)"
                                    inputMode="numeric"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="grade-description">설명</Label>
                                <Input
                                    id="grade-description"
                                    value={formDescription}
                                    onChange={(event) => setFormDescription(event.target.value)}
                                    placeholder="예: 운영 기능 중심 접근"
                                />
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={cancelEdit}>
                                    취소
                                </Button>
                                <Button type="submit">{isEditing ? "저장" : "생성"}</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <div className="overflow-x-auto rounded-md border">
                    <table className="w-full min-w-[900px] border-collapse text-sm">
                        <thead className="bg-muted/50 text-foreground">
                            <tr className="border-b">
                                <th className="px-3 py-2.5 text-center font-medium">등급레벨</th>
                                <th className="px-3 py-2.5 text-left font-medium">등급코드</th>
                                <th className="px-3 py-2.5 text-left font-medium">등급명</th>
                                <th className="px-3 py-2.5 text-left font-medium">설명</th>
                                <th className="px-3 py-2.5 text-center font-medium">상태</th>
                                <th className="px-3 py-2.5 text-center font-medium">수정</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRows.length > 0 ? (
                                filteredRows
                                    .slice()
                                    .sort((a, b) => a.level - b.level)
                                    .map((row) => (
                                        <tr
                                            key={row.id}
                                            className="border-b last:border-0 hover:bg-muted/30">
                                            <td className="px-3 py-2.5 text-center font-mono text-xs">
                                                {row.level}
                                            </td>
                                            <td className="px-3 py-2.5 font-mono text-xs">
                                                {row.code}
                                            </td>
                                            <td className="px-3 py-2.5">{row.name}</td>
                                            <td className="px-3 py-2.5 text-muted-foreground">
                                                {row.description}
                                            </td>
                                            <td className="px-3 py-2.5 text-center">
                                                <Button
                                                    size="sm"
                                                    variant={
                                                        row.status === "활성"
                                                            ? "default"
                                                            : "secondary"
                                                    }
                                                    type="button"
                                                    onClick={() => toggleStatus(row.id)}>
                                                    {row.status}
                                                </Button>
                                            </td>
                                            <td className="px-3 py-2.5 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        type="button"
                                                        onClick={() => startEdit(row)}>
                                                        수정
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                            ) : (
                                <tr>
                                    <td
                                        className="h-24 px-3 py-2.5 text-center text-muted-foreground"
                                        colSpan={5}>
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
