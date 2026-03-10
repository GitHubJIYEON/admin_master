import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type UserStatus = "활성" | "정지" | "초대 대기";
type InviteMethod = "초대" | "자체";
type MfaStatus = "설정" | "미설정";
type RoleGrade = "보안관리자" | "일반관리자" | "뷰어";

type Organization = {
    id: string;
    code: string;
    name: string;
    type: string;
};

const ORGANIZATIONS: Organization[] = [
    { id: "ORG-001", code: "100001", name: "서울시 공공데이터센터", type: "공공기관" },
    { id: "ORG-002", code: "100002", name: "한국디지털교육원", type: "교육기관" },
    { id: "ORG-003", code: "100003", name: "그로스인사이트", type: "민간기업" },
    { id: "ORG-004", code: "100004", name: "대한서비스협회", type: "협회" },
    { id: "ORG-005", code: "100005", name: "부산스마트행정원", type: "공공기관" },
];

type UserCreateForm = {
    name: string;
    email: string;
    phone: string;
    employeeId: string;
    organizationId: string;
    organizationName: string;
    organizationCode: string;
    role: RoleGrade;
    status: UserStatus;
    inviteMethod: InviteMethod;
    mfaStatus: MfaStatus;
    memo: string;
};

const INITIAL_FORM: UserCreateForm = {
    name: "",
    email: "",
    phone: "",
    employeeId: "",
    organizationId: "",
    organizationName: "",
    organizationCode: "",
    role: "일반관리자",
    status: "활성",
    inviteMethod: "초대",
    mfaStatus: "미설정",
    memo: "",
};

const SELECT_CLASS =
    "border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]";

function OrgPickerModal({
    onSelect,
    onClose,
}: {
    onSelect: (org: Organization) => void;
    onClose: () => void;
}) {
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => {
        const keyword = search.trim().toLowerCase();
        if (keyword.length === 0) return ORGANIZATIONS;
        return ORGANIZATIONS.filter(
            (org) =>
                org.name.toLowerCase().includes(keyword) ||
                org.code.toLowerCase().includes(keyword),
        );
    }, [search]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="flex w-full max-w-lg flex-col gap-4 rounded-lg border bg-card p-6 shadow-lg">
                <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold">기관 찾기</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground text-xl leading-none">
                        ✕
                    </button>
                </div>

                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="기관명 또는 기관코드 검색"
                    autoFocus
                />

                <div className="max-h-72 overflow-y-auto rounded-md border">
                    {filtered.length > 0 ? (
                        <table className="w-full border-collapse text-sm">
                            <thead className="bg-muted/50 sticky top-0">
                                <tr className="border-b">
                                    <th className="px-3 py-2 text-left font-medium">기관코드</th>
                                    <th className="px-3 py-2 text-left font-medium">기관명</th>
                                    <th className="px-3 py-2 text-left font-medium">유형</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((org) => (
                                    <tr
                                        key={org.id}
                                        onClick={() => onSelect(org)}
                                        className="cursor-pointer border-b last:border-0 hover:bg-muted/40">
                                        <td className="px-3 py-2.5 font-mono text-xs">
                                            {org.code}
                                        </td>
                                        <td className="px-3 py-2.5 font-medium">{org.name}</td>
                                        <td className="px-3 py-2.5 text-muted-foreground">
                                            {org.type}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="h-20 flex items-center justify-center text-sm text-muted-foreground">
                            검색 결과가 없습니다.
                        </div>
                    )}
                </div>

                <div className="flex justify-end">
                    <Button variant="outline" type="button" onClick={onClose}>
                        닫기
                    </Button>
                </div>
            </div>
        </div>
    );
}

export function UserCreatePage() {
    const navigate = useNavigate();
    const [form, setForm] = useState<UserCreateForm>(INITIAL_FORM);
    const [orgModalOpen, setOrgModalOpen] = useState(false);

    const setField = <K extends keyof UserCreateForm>(key: K, value: UserCreateForm[K]) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleOrgSelect = (org: Organization) => {
        setForm((prev) => ({
            ...prev,
            organizationId: org.id,
            organizationName: org.name,
            organizationCode: org.code,
        }));
        setOrgModalOpen(false);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        window.alert(`${form.name} 사용자가 등록되었습니다.`);
        navigate("/users/list");
    };

    return (
        <>
            {orgModalOpen && (
                <OrgPickerModal onSelect={handleOrgSelect} onClose={() => setOrgModalOpen(false)} />
            )}
            <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">사용자 추가</h1>
                        <p className="text-muted-foreground">
                            신규 사용자를 등록하거나 이메일 초대를 발송합니다.
                        </p>
                    </div>
                    <Button asChild variant="outline" type="button">
                        <NavLink to="/users/list">목록으로</NavLink>
                    </Button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
                    <div className="rounded-lg border bg-card p-6">
                        <h2 className="mb-4 text-base font-semibold">기본 정보</h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            <label className="flex flex-col gap-2 text-sm">
                                <span className="font-medium">
                                    이름 <span className="text-rose-500">*</span>
                                </span>
                                <Input
                                    value={form.name}
                                    onChange={(e) => setField("name", e.target.value)}
                                    placeholder="예: 홍길동"
                                    required
                                />
                            </label>

                            <label className="flex flex-col gap-2 text-sm">
                                <span className="font-medium">
                                    이메일 <span className="text-rose-500">*</span>
                                </span>
                                <Input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setField("email", e.target.value)}
                                    placeholder="예: user@example.com"
                                    required
                                />
                            </label>

                            <label className="flex flex-col gap-2 text-sm">
                                <span className="font-medium">전화번호</span>
                                <Input
                                    type="tel"
                                    value={form.phone}
                                    onChange={(e) => setField("phone", e.target.value)}
                                    placeholder="예: 010-1234-5678"
                                />
                            </label>

                            <label className="flex flex-col gap-2 text-sm">
                                <span className="font-medium">사번</span>
                                <Input
                                    value={form.employeeId}
                                    onChange={(e) => setField("employeeId", e.target.value)}
                                    placeholder="예: A-1234"
                                />
                            </label>

                            <div className="flex flex-col gap-2 text-sm md:col-span-2">
                                <span className="font-medium">
                                    소속 기관 <span className="text-rose-500">*</span>
                                </span>
                                <div className="flex items-center gap-2">
                                    <div className="flex flex-1 items-center gap-2 rounded-md border px-3 py-2 text-sm min-h-9">
                                        {form.organizationName ? (
                                            <>
                                                <span className="font-medium">
                                                    {form.organizationName}
                                                </span>
                                                <span className="font-mono text-xs text-muted-foreground">
                                                    ({form.organizationCode})
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-muted-foreground">
                                                기관을 선택해주세요
                                            </span>
                                        )}
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setOrgModalOpen(true)}>
                                        기관 찾기
                                    </Button>
                                    {form.organizationName && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    organizationId: "",
                                                    organizationName: "",
                                                    organizationCode: "",
                                                }))
                                            }>
                                            초기화
                                        </Button>
                                    )}
                                </div>
                                {/* hidden input for form validation */}
                                <input
                                    type="text"
                                    className="sr-only"
                                    value={form.organizationId}
                                    required
                                    readOnly
                                    aria-hidden="true"
                                    tabIndex={-1}
                                />
                            </div>
                        </div>

                        <h2 className="mb-4 mt-6 text-base font-semibold">권한 및 상태</h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            <label className="flex flex-col gap-2 text-sm">
                                <span className="font-medium">
                                    역할 <span className="text-rose-500">*</span>
                                </span>
                                <select
                                    value={form.role}
                                    onChange={(e) => setField("role", e.target.value as RoleGrade)}
                                    className={SELECT_CLASS}
                                    required>
                                    <option value="기관관리자">기관관리자</option>
                                    <option value="기관사용자">기관사용자</option>
                                    <option value="테스트사용자">테스트사용자</option>
                                </select>
                            </label>

                            <label className="flex flex-col gap-2 text-sm">
                                <span className="font-medium">계정 상태</span>
                                <select
                                    value={form.status}
                                    onChange={(e) =>
                                        setField("status", e.target.value as UserStatus)
                                    }
                                    className={SELECT_CLASS}>
                                    <option value="활성">활성</option>
                                    <option value="정지">정지</option>
                                    <option value="초대 대기">초대 대기</option>
                                </select>
                            </label>

                            <label className="flex flex-col gap-2 text-sm">
                                <span className="font-medium">가입 방식</span>
                                <select
                                    value={form.inviteMethod}
                                    onChange={(e) =>
                                        setField("inviteMethod", e.target.value as InviteMethod)
                                    }
                                    className={SELECT_CLASS}>
                                    <option value="초대">초대 (이메일 발송)</option>
                                    <option value="자체">자체 (직접 생성)</option>
                                </select>
                            </label>

                            <label className="flex flex-col gap-2 text-sm">
                                <span className="font-medium">MFA</span>
                                <select
                                    value={form.mfaStatus}
                                    onChange={(e) =>
                                        setField("mfaStatus", e.target.value as MfaStatus)
                                    }
                                    className={SELECT_CLASS}>
                                    <option value="미설정">미설정</option>
                                    <option value="설정">설정</option>
                                </select>
                            </label>

                            <label className="flex flex-col gap-2 text-sm md:col-span-2">
                                <span className="font-medium">메모</span>
                                <textarea
                                    value={form.memo}
                                    onChange={(e) => setField("memo", e.target.value)}
                                    placeholder="관리자 메모 (선택)"
                                    rows={3}
                                    className="border-input w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] resize-none"
                                />
                            </label>
                        </div>

                        <div className="mt-6 flex items-center justify-end gap-2">
                            <Button asChild variant="outline" type="button">
                                <NavLink to="/users/list">취소</NavLink>
                            </Button>
                            <Button type="submit">등록</Button>
                        </div>
                    </div>

                    <div className="rounded-lg border bg-card p-6">
                        <h2 className="mb-3 text-base font-semibold">안내</h2>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li className="rounded-md border bg-muted/40 px-3 py-2">
                                <span className="font-medium text-foreground">초대 방식</span>
                                <br />
                                이메일 초대 선택 시 입력한 이메일로 초대 링크가 발송됩니다. 초대
                                링크는 7일 후 만료됩니다.
                            </li>
                            <li className="rounded-md border bg-muted/40 px-3 py-2">
                                <span className="font-medium text-foreground">자체 생성 방식</span>
                                <br />
                                직접 계정을 생성하고 임시 비밀번호를 발급합니다. 최초 로그인 시
                                비밀번호 변경이 요구됩니다.
                            </li>
                            <li className="rounded-md border bg-muted/40 px-3 py-2">
                                <span className="font-medium text-foreground">역할 안내</span>
                                <br />
                                슈퍼관리자·운영관리자는 직원 관리자 메뉴에서 별도 관리합니다.
                            </li>
                            <li className="rounded-md border bg-muted/40 px-3 py-2">
                                <span className="font-medium text-foreground">개인정보 보호</span>
                                <br />
                                전화번호는 목록에서 마스킹 처리되며, 상세 페이지에서만 확인
                                가능합니다.
                            </li>
                            <li className="rounded-md border bg-muted/40 px-3 py-2">
                                <span className="font-medium text-foreground">
                                    복사/붙여넣기 문구
                                </span>
                                <br />
                                와이즈온 서비스에 이용해주셔서 감사합니다.
                                <br />
                                공유해주신 이메일 주소로 "초대 링크"를 발송하였습니다.
                                <br />
                                초대 링크는 7일 후 만료됩니다.
                                <br /> <br />
                                초대 링크: [초대 링크]
                                <br />
                                초대 링크 만료일: [초대 링크 만료일]
                            </li>
                        </ul>
                    </div>
                </form>
            </div>
        </>
    );
}
