export function UsersPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">사용자 관리</h1>
        <p className="text-muted-foreground">
          시스템 사용자를 조회하고 관리합니다.
        </p>
      </div>
      <div className="rounded-lg border p-6">
        {/* 사용자 목록 영역 - 추후 테이블 컴포넌트 추가 */}
        <p className="text-muted-foreground">사용자 목록이 여기에 표시됩니다.</p>
      </div>
    </div>
  );
}
