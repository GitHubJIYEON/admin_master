import { NavLink, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { INITIAL_STAFF_MANAGERS } from "@/pages/staff-managers-data";

export function StaffManagerDetailPage() {
  const { staffId } = useParams();
  const manager = INITIAL_STAFF_MANAGERS.find((item) => item.id === staffId);

  if (!manager) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <h1 className="text-2xl font-bold tracking-tight">직원 관리자 상세</h1>
        <div className="rounded-lg border bg-card p-6">
          <p className="text-muted-foreground">직원 관리자 정보를 찾을 수 없습니다.</p>
          <div className="mt-4">
            <Button asChild variant="outline">
              <NavLink to="/users/staff-managers">목록으로</NavLink>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">직원 관리자 상세</h1>
        <p className="text-muted-foreground">
          {manager.name} 계정의 운영 및 감사 정보를 확인합니다.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="grid gap-4 text-sm md:grid-cols-2">
          <p>
            <span className="text-muted-foreground">이름: </span>
            <span className="font-medium">{manager.name}</span>
          </p>
          <p>
            <span className="text-muted-foreground">로그인 ID: </span>
            <span className="font-medium">{manager.loginId}</span>
          </p>
          <p>
            <span className="text-muted-foreground">소속: </span>
            <span className="font-medium">{manager.team}</span>
          </p>
          <p>
            <span className="text-muted-foreground">권한그룹: </span>
            <span className="font-medium">{manager.roleGroup}</span>
          </p>
          <p>
            <span className="text-muted-foreground">상태: </span>
            <span className="font-medium">
              {manager.isLocked ? "잠금" : manager.status}
            </span>
          </p>
          <p>
            <span className="text-muted-foreground">연락처: </span>
            <span className="font-medium">{manager.contact}</span>
          </p>
          <p>
            <span className="text-muted-foreground">2FA/MFA 사용 여부: </span>
            <span className="font-medium">{manager.mfaEnabled}</span>
          </p>
          <p>
            <span className="text-muted-foreground">최종 로그인 일시: </span>
            <span className="font-medium">{manager.lastLoginAt}</span>
          </p>
          <p>
            <span className="text-muted-foreground">마지막 활동 일시: </span>
            <span className="font-medium">{manager.lastActivityAt}</span>
          </p>
          <p>
            <span className="text-muted-foreground">등록일: </span>
            <span className="font-medium">{manager.createdAt}</span>
          </p>
          <p>
            <span className="text-muted-foreground">생성자/초대자: </span>
            <span className="font-medium">{manager.createdBy}</span>
          </p>
          <p className="md:col-span-2">
            <span className="text-muted-foreground">비활성/잠금 사유: </span>
            <span className="font-medium">
              {manager.isLocked
                ? manager.lockReason ?? "-"
                : manager.status === "비활성"
                  ? manager.inactiveReason ?? "-"
                  : "-"}
            </span>
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button asChild variant="outline">
          <NavLink to="/users/staff-managers">목록으로</NavLink>
        </Button>
      </div>
    </div>
  );
}
