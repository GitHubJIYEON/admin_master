import { useMemo, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type OrganizationType = "공공기관" | "교육기관" | "민간기업" | "협회";

type OrganizationRow = {
    id: string;
    organizationNumber: string;
    organizationName: string;
    organizationType: OrganizationType;
};

const ORGANIZATION_ROWS: OrganizationRow[] = [
    {
        id: "ORG-001",
        organizationNumber: "100001",
        organizationName: "서울시 공공데이터센터",
        organizationType: "공공기관",
    },
    {
        id: "ORG-002",
        organizationNumber: "100002",
        organizationName: "한국디지털교육원",
        organizationType: "교육기관",
    },
    {
        id: "ORG-003",
        organizationNumber: "100003",
        organizationName: "그로스인사이트",
        organizationType: "민간기업",
    },
    {
        id: "ORG-004",
        organizationNumber: "100004",
        organizationName: "대한서비스협회",
        organizationType: "협회",
    },
    {
        id: "ORG-005",
        organizationNumber: "100005",
        organizationName: "부산스마트행정원",
        organizationType: "공공기관",
    },
];

type ChartNodeType = "부서" | "과" | "팀";

type ChartNode = {
    id: string;
    parentId: string | null;
    name: string;
    type: ChartNodeType;
    managerName: string;
    memberCount: number;
    order: number;
};

const INITIAL_CHART_NODES: Record<string, ChartNode[]> = {
    "ORG-001": [
        {
            id: "N-001-1",
            parentId: null,
            name: "정보화기획부",
            type: "부서",
            managerName: "김민수",
            memberCount: 12,
            order: 1,
        },
        {
            id: "N-001-2",
            parentId: "N-001-1",
            name: "데이터관리과",
            type: "과",
            managerName: "이지훈",
            memberCount: 5,
            order: 1,
        },
        {
            id: "N-001-3",
            parentId: "N-001-1",
            name: "시스템운영과",
            type: "과",
            managerName: "박서연",
            memberCount: 4,
            order: 2,
        },
        {
            id: "N-001-4",
            parentId: "N-001-3",
            name: "인프라팀",
            type: "팀",
            managerName: "최현우",
            memberCount: 3,
            order: 1,
        },
        {
            id: "N-001-5",
            parentId: null,
            name: "행정지원부",
            type: "부서",
            managerName: "정다은",
            memberCount: 8,
            order: 2,
        },
        {
            id: "N-001-6",
            parentId: "N-001-5",
            name: "총무과",
            type: "과",
            managerName: "한지민",
            memberCount: 4,
            order: 1,
        },
    ],
    "ORG-002": [
        {
            id: "N-002-1",
            parentId: null,
            name: "교육운영부",
            type: "부서",
            managerName: "이서연",
            memberCount: 10,
            order: 1,
        },
        {
            id: "N-002-2",
            parentId: "N-002-1",
            name: "디지털교육과",
            type: "과",
            managerName: "김하늘",
            memberCount: 6,
            order: 1,
        },
        {
            id: "N-002-3",
            parentId: null,
            name: "연구개발부",
            type: "부서",
            managerName: "박준호",
            memberCount: 7,
            order: 2,
        },
    ],
    "ORG-003": [
        {
            id: "N-003-1",
            parentId: null,
            name: "서비스개발본부",
            type: "부서",
            managerName: "박정우",
            memberCount: 20,
            order: 1,
        },
        {
            id: "N-003-2",
            parentId: "N-003-1",
            name: "플랫폼운영팀",
            type: "팀",
            managerName: "오민준",
            memberCount: 8,
            order: 1,
        },
        {
            id: "N-003-3",
            parentId: "N-003-1",
            name: "백엔드팀",
            type: "팀",
            managerName: "윤서아",
            memberCount: 7,
            order: 2,
        },
    ],
    "ORG-004": [
        {
            id: "N-004-1",
            parentId: null,
            name: "사무국",
            type: "부서",
            managerName: "최다은",
            memberCount: 6,
            order: 1,
        },
        {
            id: "N-004-2",
            parentId: "N-004-1",
            name: "회원관리과",
            type: "과",
            managerName: "강민서",
            memberCount: 3,
            order: 1,
        },
    ],
    "ORG-005": [
        {
            id: "N-005-1",
            parentId: null,
            name: "스마트행정부",
            type: "부서",
            managerName: "정하늘",
            memberCount: 14,
            order: 1,
        },
        {
            id: "N-005-2",
            parentId: "N-005-1",
            name: "정보시스템과",
            type: "과",
            managerName: "임채원",
            memberCount: 6,
            order: 1,
        },
        {
            id: "N-005-3",
            parentId: "N-005-1",
            name: "민원서비스과",
            type: "과",
            managerName: "송유진",
            memberCount: 5,
            order: 2,
        },
    ],
};

const NODE_TYPE_BADGE: Record<ChartNodeType, string> = {
    부서: "bg-blue-100 text-blue-700",
    과: "bg-violet-100 text-violet-700",
    팀: "bg-emerald-100 text-emerald-700",
};

type ModalMode = "add" | "edit";

type NodeForm = {
    name: string;
    type: ChartNodeType;
    managerName: string;
    memberCount: number;
    parentId: string | null;
};

const EMPTY_FORM: NodeForm = {
    name: "",
    type: "부서",
    managerName: "",
    memberCount: 0,
    parentId: null,
};

const SELECT_CLASS =
    "border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]";

type ChartNodeWithChildren = ChartNode & { children: ChartNodeWithChildren[] };

function buildTree(nodes: ChartNode[]): ChartNodeWithChildren[] {
    const map = new Map<string, ChartNodeWithChildren>();
    nodes.forEach((n) => map.set(n.id, { ...n, children: [] }));

    const roots: ChartNodeWithChildren[] = [];
    map.forEach((node) => {
        if (node.parentId && map.has(node.parentId)) {
            map.get(node.parentId)!.children.push(node);
        } else {
            roots.push(node);
        }
    });

    const sortByOrder = (arr: ChartNodeWithChildren[]) => {
        arr.sort((a, b) => a.order - b.order);
        arr.forEach((n) => sortByOrder(n.children));
    };
    sortByOrder(roots);

    return roots;
}

function TreeNode({
    node,
    depth,
    onEdit,
    onDelete,
    onAddChild,
}: {
    node: ChartNodeWithChildren;
    depth: number;
    onEdit: (node: ChartNode) => void;
    onDelete: (id: string) => void;
    onAddChild: (parentId: string) => void;
}) {
    const [expanded, setExpanded] = useState(true);
    const hasChildren = node.children.length > 0;

    return (
        <li>
            <div
                className="group flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted/40"
                style={{ paddingLeft: `${depth * 20 + 8}px` }}>
                <button
                    type="button"
                    onClick={() => setExpanded((prev) => !prev)}
                    className="flex h-5 w-5 shrink-0 items-center justify-center text-muted-foreground">
                    {hasChildren ? expanded ? "▾" : "▸" : <span className="w-5" />}
                </button>
                <span
                    className={`inline-flex shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${NODE_TYPE_BADGE[node.type]}`}>
                    {node.type}
                </span>
                <span className="flex-1 font-medium">{node.name}</span>
                <span className="text-xs text-muted-foreground">
                    담당: {node.managerName} · {node.memberCount}명
                </span>
                <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                        type="button"
                        onClick={() => onAddChild(node.id)}
                        className="rounded px-1.5 py-0.5 text-xs text-blue-600 hover:bg-blue-50">
                        + 하위 추가
                    </button>
                    <button
                        type="button"
                        onClick={() => onEdit(node)}
                        className="rounded px-1.5 py-0.5 text-xs text-slate-600 hover:bg-slate-100">
                        수정
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete(node.id)}
                        className="rounded px-1.5 py-0.5 text-xs text-rose-600 hover:bg-rose-50">
                        삭제
                    </button>
                </div>
            </div>
            {hasChildren && expanded && (
                <ul>
                    {node.children.map((child) => (
                        <TreeNode
                            key={child.id}
                            node={child}
                            depth={depth + 1}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onAddChild={onAddChild}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
}

export function OrganizationChartPage() {
    const { organizationId } = useParams();
    const organization = ORGANIZATION_ROWS.find((row) => row.id === organizationId);

    const [nodes, setNodes] = useState<ChartNode[]>(
        INITIAL_CHART_NODES[organizationId ?? ""] ?? [],
    );
    const [modalMode, setModalMode] = useState<ModalMode | null>(null);
    const [editTarget, setEditTarget] = useState<ChartNode | null>(null);
    const [form, setForm] = useState<NodeForm>(EMPTY_FORM);
    const [search, setSearch] = useState("");

    const filteredNodes = useMemo(() => {
        const keyword = search.trim().toLowerCase();
        if (keyword.length === 0) return nodes;
        return nodes.filter(
            (n) =>
                n.name.toLowerCase().includes(keyword) ||
                n.managerName.toLowerCase().includes(keyword),
        );
    }, [nodes, search]);

    const tree = useMemo(
        () => buildTree(search.trim() ? filteredNodes : nodes),
        [filteredNodes, nodes, search],
    );

    const openAdd = (parentId: string | null = null) => {
        setForm({ ...EMPTY_FORM, parentId });
        setEditTarget(null);
        setModalMode("add");
    };

    const openEdit = (node: ChartNode) => {
        setForm({
            name: node.name,
            type: node.type,
            managerName: node.managerName,
            memberCount: node.memberCount,
            parentId: node.parentId,
        });
        setEditTarget(node);
        setModalMode("edit");
    };

    const handleDelete = (id: string) => {
        const hasChildren = nodes.some((n) => n.parentId === id);
        if (hasChildren) {
            window.alert(
                "하위 조직이 있는 항목은 삭제할 수 없습니다. 하위 항목을 먼저 삭제해주세요.",
            );
            return;
        }
        if (!window.confirm("해당 조직을 삭제하시겠습니까?")) return;
        setNodes((prev) => prev.filter((n) => n.id !== id));
    };

    const handleSubmit = () => {
        if (!form.name.trim() || !form.managerName.trim()) {
            window.alert("조직명과 담당자명은 필수입니다.");
            return;
        }

        if (modalMode === "add") {
            const siblings = nodes.filter((n) => n.parentId === form.parentId);
            const newNode: ChartNode = {
                id: `N-${Date.now()}`,
                parentId: form.parentId,
                name: form.name.trim(),
                type: form.type,
                managerName: form.managerName.trim(),
                memberCount: form.memberCount,
                order: siblings.length + 1,
            };
            setNodes((prev) => [...prev, newNode]);
        } else if (modalMode === "edit" && editTarget) {
            setNodes((prev) =>
                prev.map((n) =>
                    n.id === editTarget.id
                        ? {
                              ...n,
                              name: form.name.trim(),
                              type: form.type,
                              managerName: form.managerName.trim(),
                              memberCount: form.memberCount,
                          }
                        : n,
                ),
            );
        }
        setModalMode(null);
    };

    const parentOptions = useMemo(
        () => nodes.filter((n) => n.id !== editTarget?.id),
        [nodes, editTarget],
    );

    if (!organization) {
        return (
            <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <h1 className="text-2xl font-bold tracking-tight">조직도 관리</h1>
                <div className="rounded-lg border bg-card p-6 text-muted-foreground">
                    기관 정보를 찾을 수 없습니다.
                </div>
                <Button asChild variant="outline" className="w-fit">
                    <NavLink to="/organizations/list">목록으로</NavLink>
                </Button>
            </div>
        );
    }

    return (
        <>
            {modalMode && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="flex w-full max-w-md flex-col gap-4 rounded-lg border bg-card p-6 shadow-lg">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-semibold">
                                {modalMode === "add" ? "조직 추가" : "조직 수정"}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setModalMode(null)}
                                className="text-xl leading-none text-muted-foreground hover:text-foreground">
                                ✕
                            </button>
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className="flex flex-col gap-1.5 text-sm">
                                <span className="font-medium">
                                    조직명 <span className="text-rose-500">*</span>
                                </span>
                                <Input
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm((prev) => ({ ...prev, name: e.target.value }))
                                    }
                                    placeholder="예: 정보화기획부"
                                    autoFocus
                                />
                            </label>
                            <label className="flex flex-col gap-1.5 text-sm">
                                <span className="font-medium">유형</span>
                                <select
                                    value={form.type}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            type: e.target.value as ChartNodeType,
                                        }))
                                    }
                                    className={SELECT_CLASS}>
                                    <option value="부서">부서</option>
                                    <option value="과">과</option>
                                    <option value="팀">팀</option>
                                </select>
                            </label>
                            <label className="flex flex-col gap-1.5 text-sm">
                                <span className="font-medium">
                                    담당자명 <span className="text-rose-500">*</span>
                                </span>
                                <Input
                                    value={form.managerName}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            managerName: e.target.value,
                                        }))
                                    }
                                    placeholder="예: 홍길동"
                                />
                            </label>
                            <label className="flex flex-col gap-1.5 text-sm">
                                <span className="font-medium">인원 수</span>
                                <Input
                                    type="number"
                                    min={0}
                                    value={form.memberCount}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            memberCount: Number(e.target.value),
                                        }))
                                    }
                                />
                            </label>
                            {modalMode === "add" && (
                                <label className="flex flex-col gap-1.5 text-sm">
                                    <span className="font-medium">상위 조직</span>
                                    <select
                                        value={form.parentId ?? ""}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                parentId: e.target.value || null,
                                            }))
                                        }
                                        className={SELECT_CLASS}>
                                        <option value="">최상위 (없음)</option>
                                        {parentOptions.map((n) => (
                                            <option key={n.id} value={n.id}>
                                                {n.name} ({n.type})
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            )}
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => setModalMode(null)}>
                                취소
                            </Button>
                            <Button type="button" onClick={handleSubmit}>
                                {modalMode === "add" ? "추가" : "저장"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">조직도 관리</h1>
                        <p className="text-muted-foreground">
                            {organization.organizationName}의 부서·과·팀 구조를 관리합니다.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button type="button" onClick={() => openAdd(null)}>
                            + 최상위 조직 추가
                        </Button>
                        <Button asChild variant="outline" type="button">
                            <NavLink to={`/organizations/${organizationId}`}>기관 상세</NavLink>
                        </Button>
                        <Button asChild variant="outline" type="button">
                            <NavLink to="/organizations/list">목록으로</NavLink>
                        </Button>
                    </div>
                </div>

                <div className="rounded-lg border bg-card p-4">
                    <div className="mb-4 flex items-center gap-3">
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="조직명 또는 담당자명 검색"
                            className="max-w-xs"
                        />
                        <span className="text-sm text-muted-foreground">
                            총 {nodes.length}개 조직
                        </span>
                    </div>

                    {tree.length > 0 ? (
                        <ul className="rounded-md border">
                            {tree.map((node) => (
                                <TreeNode
                                    key={node.id}
                                    node={node}
                                    depth={0}
                                    onEdit={openEdit}
                                    onDelete={handleDelete}
                                    onAddChild={(parentId) => openAdd(parentId)}
                                />
                            ))}
                        </ul>
                    ) : (
                        <div className="flex h-32 items-center justify-center rounded-md border text-sm text-muted-foreground">
                            {search.trim()
                                ? "검색 결과가 없습니다."
                                : "등록된 조직이 없습니다. 최상위 조직을 추가해주세요."}
                        </div>
                    )}
                </div>

                <div className="rounded-lg border bg-card p-4">
                    <h2 className="mb-3 text-sm font-semibold text-muted-foreground">범례</h2>
                    <div className="flex flex-wrap gap-3">
                        {(Object.entries(NODE_TYPE_BADGE) as [ChartNodeType, string][]).map(
                            ([type, cls]) => (
                                <span
                                    key={type}
                                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
                                    {type}
                                </span>
                            ),
                        )}
                        <span className="text-xs text-muted-foreground">
                            · 행에 마우스를 올리면 수정/삭제/하위 추가 버튼이 표시됩니다.
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}
