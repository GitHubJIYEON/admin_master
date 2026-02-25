export function SystemSettingsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">시스템 설정</h1>
        <p className="text-muted-foreground">
          시스템 전반의 설정을 관리합니다.
        </p>
      </div>
      <div className="rounded-lg border p-6">
        {/* 설정 영역 - 추후 설정 폼 추가 */}
        <p className="text-muted-foreground">
          시스템 설정 항목이 여기에 표시됩니다.
        </p>
      </div>
    </div>
  );
}
