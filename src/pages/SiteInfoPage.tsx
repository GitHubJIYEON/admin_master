import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

type BasicInfoForm = {
    siteName: string;
    siteUrl: string;
    adminEmail: string;
    adminPhone: string;
};

type BusinessInfoForm = {
    businessNumber: string;
    companyName: string;
    postalCode: string;
    address: string;
    representativeName: string;
    businessType: string;
    businessItem: string;
    phoneNumber: string;
    faxNumber: string;
};

type DomainRow = {
    id: number;
    environment: "개발" | "운영" | "스테이징";
    siteName: string;
    domain: string;
    expiryDate: string;
};

const INITIAL_BASIC_INFO: BasicInfoForm = {
    siteName: "와이즈온",
    siteUrl: "https://wiseon.io",
    adminEmail: "wiseon@wiseinc.co.kr",
    adminPhone: "02-558-5144",
};

const INITIAL_BUSINESS_INFO: BusinessInfoForm = {
    businessNumber: "113-86-13917",
    companyName: "와이즈인컴퍼니",
    postalCode: "06229",
    address: "서울특별시 강남구 언주로 309, 기성빌딩 3층",
    representativeName: "김원표",
    businessType: "서비스업",
    businessItem: "소프트웨어 개발 및 공급",
    phoneNumber: "02-1234-5678",
    faxNumber: "02-558-5146",
};

const DOMAIN_ROWS: DomainRow[] = [
    {
        id: 1,
        environment: "운영",
        siteName: "와이즈온",
        domain: "wiseon.io",
        expiryDate: "2027-12-31",
    },
    {
        id: 2,
        environment: "운영",
        siteName: "와이즈온 - 설문",
        domain: "survey.wiseon.io",
        expiryDate: "2027-12-31",
    },
    {
        id: 3,
        environment: "운영",
        siteName: "와이즈온 - 분석",
        domain: "ananlysis.wiseon.io",
        expiryDate: "2027-12-31",
    },
    {
        id: 4,
        environment: "운영",
        siteName: "와이즈온 MASTER 관리자 사이트",
        domain: "admin.wiseon.io",
        expiryDate: "2027-12-31",
    },
    {
        id: 5,
        environment: "개발",
        siteName: "와이즈온 TENANT 관리자 사이트",
        domain: "tenant.wiseon.io",
        expiryDate: "2027-12-31",
    },
    {
        id: 6,
        environment: "개발",
        siteName: "와이즈온 - 설문",
        domain: "dev-survey.wiseon.io",
        expiryDate: "2027-12-31",
    },
    {
        id: 7,
        environment: "개발",
        siteName: "와이즈온 - 분석",
        domain: "dev-ananlysis.wiseon.io",
        expiryDate: "2027-12-31",
    },
    {
        id: 8,
        environment: "개발",
        siteName: "와이즈온 MASTER 관리자 사이트",
        domain: "dev-admin.wiseon.io",
        expiryDate: "2027-12-31",
    },
    {
        id: 9,
        environment: "개발",
        siteName: "와이즈온 TENANT 관리자 사이트",
        domain: "dev-tenant.wiseon.io",
        expiryDate: "2027-12-31",
    },
    {
        id: 10,
        environment: "스테이징",
        siteName: "텍스트마이닝",
        domain: "textmining.wiseon.io",
        expiryDate: "2027-12-31",
    },
];

export function SiteInfoPage() {
    const [basicInfo, setBasicInfo] = useState<BasicInfoForm>(INITIAL_BASIC_INFO);
    const [businessInfo, setBusinessInfo] = useState<BusinessInfoForm>(INITIAL_BUSINESS_INFO);
    const [domainRows, setDomainRows] = useState<DomainRow[]>(DOMAIN_ROWS);
    const [isDomainEditOpen, setIsDomainEditOpen] = useState(false);
    const [editingDomainId, setEditingDomainId] = useState<number | null>(null);
    const [domainEditForm, setDomainEditForm] = useState<{
        environment: DomainRow["environment"];
        siteName: string;
        domain: string;
        expiryDate: string;
    }>({
        environment: "운영",
        siteName: "",
        domain: "",
        expiryDate: "",
    });

    const handleOpenDomainEdit = (row: DomainRow) => {
        setEditingDomainId(row.id);
        setDomainEditForm({
            environment: row.environment,
            siteName: row.siteName,
            domain: row.domain,
            expiryDate: row.expiryDate,
        });
        setIsDomainEditOpen(true);
    };

    const handleSaveDomainEdit = () => {
        if (editingDomainId === null) {
            return;
        }

        setDomainRows((prev) =>
            prev.map((row) =>
                row.id === editingDomainId
                    ? {
                          ...row,
                          environment: domainEditForm.environment,
                          siteName: domainEditForm.siteName,
                          domain: domainEditForm.domain,
                          expiryDate: domainEditForm.expiryDate,
                      }
                    : row,
            ),
        );

        setIsDomainEditOpen(false);
    };

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">사이트 정보</h1>
                <p className="text-muted-foreground">
                    사이트 기본 정보, 도메인 정보, 사업자 정보를 관리합니다.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>기본 정보</CardTitle>
                    <CardDescription>서비스 운영을 위한 기본 정보를 설정합니다.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="siteName">사이트명</Label>
                            <Input
                                id="siteName"
                                value={basicInfo.siteName}
                                onChange={(event) =>
                                    setBasicInfo((prev) => ({
                                        ...prev,
                                        siteName: event.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="siteUrl">사이트 URL</Label>
                            <Input
                                id="siteUrl"
                                value={basicInfo.siteUrl}
                                onChange={(event) =>
                                    setBasicInfo((prev) => ({
                                        ...prev,
                                        siteUrl: event.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="adminEmail">관리자 이메일</Label>
                            <Input
                                id="adminEmail"
                                type="email"
                                value={basicInfo.adminEmail}
                                onChange={(event) =>
                                    setBasicInfo((prev) => ({
                                        ...prev,
                                        adminEmail: event.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="adminPhone">관리자 전화번호</Label>
                            <Input
                                id="adminPhone"
                                value={basicInfo.adminPhone}
                                onChange={(event) =>
                                    setBasicInfo((prev) => ({
                                        ...prev,
                                        adminPhone: event.target.value,
                                    }))
                                }
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="justify-end">
                    <Button type="button">기본 정보 저장</Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>도메인 정보</CardTitle>
                    <CardDescription>도메인 만료일을 확인하고 관리합니다.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto rounded-md border">
                        <table className="w-full min-w-[640px] border-collapse text-sm">
                            <thead className="bg-muted/50">
                                <tr className="border-b">
                                    <th className="w-16 px-3 py-2.5 text-center font-medium">
                                        번호
                                    </th>
                                    <th className="w-24 px-3 py-2.5 text-center font-medium">
                                        환경
                                    </th>
                                    <th className="px-3 py-2.5 text-left font-medium">사이트명</th>
                                    <th className="px-3 py-2.5 text-left font-medium">도메인</th>
                                    <th className="px-3 py-2.5 text-center font-medium">만료일</th>
                                    <th className="w-28 px-3 py-2.5 text-center font-medium">
                                        관리
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {domainRows.map((row) => (
                                    <tr key={row.id} className="border-b last:border-0">
                                        <td className="px-3 py-2.5 text-center">{row.id}</td>
                                        <td className="px-3 py-2.5 text-center">
                                            <Badge variant="outline">{row.environment}</Badge>
                                        </td>
                                        <td className="px-3 py-2.5">{row.siteName}</td>
                                        <td className="px-3 py-2.5 font-mono text-xs">
                                            {row.domain}
                                        </td>
                                        <td className="px-3 py-2.5 text-center">
                                            <Badge variant="secondary">{row.expiryDate}</Badge>
                                        </td>
                                        <td className="px-3 py-2.5 text-center">
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleOpenDomainEdit(row)}>
                                                수정하기
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>사업자 정보</CardTitle>
                    <CardDescription>사업자 등록 및 연락 정보를 관리합니다.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="businessNumber">사업자 등록번호</Label>
                            <Input
                                id="businessNumber"
                                value={businessInfo.businessNumber}
                                onChange={(event) =>
                                    setBusinessInfo((prev) => ({
                                        ...prev,
                                        businessNumber: event.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="companyName">상호</Label>
                            <Input
                                id="companyName"
                                value={businessInfo.companyName}
                                onChange={(event) =>
                                    setBusinessInfo((prev) => ({
                                        ...prev,
                                        companyName: event.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="postalCode">우편번호</Label>
                            <Input
                                id="postalCode"
                                value={businessInfo.postalCode}
                                onChange={(event) =>
                                    setBusinessInfo((prev) => ({
                                        ...prev,
                                        postalCode: event.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="address">주소</Label>
                            <Input
                                id="address"
                                value={businessInfo.address}
                                onChange={(event) =>
                                    setBusinessInfo((prev) => ({
                                        ...prev,
                                        address: event.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="representativeName">대표자명</Label>
                            <Input
                                id="representativeName"
                                value={businessInfo.representativeName}
                                onChange={(event) =>
                                    setBusinessInfo((prev) => ({
                                        ...prev,
                                        representativeName: event.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="businessType">업태</Label>
                            <Input
                                id="businessType"
                                value={businessInfo.businessType}
                                onChange={(event) =>
                                    setBusinessInfo((prev) => ({
                                        ...prev,
                                        businessType: event.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="businessItem">종목</Label>
                            <Input
                                id="businessItem"
                                value={businessInfo.businessItem}
                                onChange={(event) =>
                                    setBusinessInfo((prev) => ({
                                        ...prev,
                                        businessItem: event.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phoneNumber">전화번호</Label>
                            <Input
                                id="phoneNumber"
                                value={businessInfo.phoneNumber}
                                onChange={(event) =>
                                    setBusinessInfo((prev) => ({
                                        ...prev,
                                        phoneNumber: event.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="faxNumber">팩스번호</Label>
                            <Input
                                id="faxNumber"
                                value={businessInfo.faxNumber}
                                onChange={(event) =>
                                    setBusinessInfo((prev) => ({
                                        ...prev,
                                        faxNumber: event.target.value,
                                    }))
                                }
                            />
                        </div>
                    </div>
                    <Separator className="my-6" />
                    <p className="text-muted-foreground text-sm">
                        저장 버튼 클릭 시 API 연동 위치로 대체할 수 있도록 구성되어 있습니다.
                    </p>
                </CardContent>
                <CardFooter className="justify-end">
                    <Button type="button">사업자 정보 저장</Button>
                </CardFooter>
            </Card>

            <Dialog open={isDomainEditOpen} onOpenChange={setIsDomainEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>도메인 정보 수정</DialogTitle>
                        <DialogDescription>
                            선택한 도메인의 환경, 사이트명, 도메인, 만료일을 수정합니다.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="editEnvironment">환경</Label>
                            <select
                                id="editEnvironment"
                                className="border-input h-9 rounded-md border bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                value={domainEditForm.environment}
                                onChange={(event) =>
                                    setDomainEditForm((prev) => ({
                                        ...prev,
                                        environment: event.target.value as DomainRow["environment"],
                                    }))
                                }>
                                <option value="운영">운영</option>
                                <option value="스테이징">스테이징</option>
                                <option value="개발">개발</option>
                            </select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="editSiteName">사이트명</Label>
                            <Input
                                id="editSiteName"
                                value={domainEditForm.siteName}
                                onChange={(event) =>
                                    setDomainEditForm((prev) => ({
                                        ...prev,
                                        siteName: event.target.value,
                                    }))
                                }
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="editDomain">도메인</Label>
                            <Input
                                id="editDomain"
                                value={domainEditForm.domain}
                                onChange={(event) =>
                                    setDomainEditForm((prev) => ({
                                        ...prev,
                                        domain: event.target.value,
                                    }))
                                }
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="editExpiryDate">만료일</Label>
                            <Input
                                id="editExpiryDate"
                                type="date"
                                value={domainEditForm.expiryDate}
                                onChange={(event) =>
                                    setDomainEditForm((prev) => ({
                                        ...prev,
                                        expiryDate: event.target.value,
                                    }))
                                }
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDomainEditOpen(false)}>
                            취소
                        </Button>
                        <Button type="button" onClick={handleSaveDomainEdit}>
                            저장
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
