export function OrganizationsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">기관 관리</h1>
        <p className="text-muted-foreground">
          등록된 기관을 조회하고 관리합니다.
        </p>
      </div>
      <div className="rounded-lg border p-6">
        {/* 기관 목록 영역 - 추후 테이블 컴포넌트 추가 */}
        <p className="text-muted-foreground">기관 목록이 여기에 표시됩니다.</p>
      </div>
    </div>
  );
}
