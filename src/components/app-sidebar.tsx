import * as React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Building2,
    Users,
    ShoppingCart,
    ClipboardList,
    MessageSquare,
    Megaphone,
    Settings,
    ChevronsUpDown,
    ChevronRight,
    Bell,
    LogOut,
} from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

type NavLeafItem = {
    to: string;
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
};

type NavGroupItem = {
    key: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    children: NavLeafItem[];
};

function isPathActive(pathname: string, to: string) {
    return pathname === to || pathname.startsWith(`${to}/`);
}

function NavSidebarButton({
    to,
    icon: Icon,
    label,
}: {
    to: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
}) {
    const { pathname } = useLocation();
    const isActive = isPathActive(pathname, to);

    return (
        <SidebarMenuButton asChild isActive={isActive} tooltip={label}>
            <NavLink to={to}>
                <Icon className="size-4" />
                <span>{label}</span>
            </NavLink>
        </SidebarMenuButton>
    );
}

const user = {
    name: "관리자",
    email: "admin@example.com",
    avatar: "",
};

function NavUserProfile() {
    const { isMobile } = useSidebar();
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate("/login");
    };

    const handleNotifications = () => {
        console.log("알림");
    };

    return (
        <SidebarGroup>
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                                size="lg"
                                tooltip={user.name}
                                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                                <Avatar className="size-8 rounded-lg">
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                    <AvatarFallback className="rounded-lg">
                                        {user.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium group-data-[collapsible=icon]:hidden">
                                        {user.name}
                                    </span>
                                    <span className="truncate text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
                                        {user.email}
                                    </span>
                                </div>
                                <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                            side={isMobile ? "bottom" : "right"}
                            align="end"
                            sideOffset={4}>
                            <DropdownMenuGroup>
                                <DropdownMenuItem onClick={handleNotifications}>
                                    <Bell className="size-4" />
                                    <span>알림</span>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem onClick={handleLogout} variant="destructive">
                                    <LogOut className="size-4" />
                                    <span>로그아웃</span>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
    );
}

const navItems = [{ to: "/dashboard", icon: LayoutDashboard, label: "대시보드" }] as const;

const navGroups: NavGroupItem[] = [
    {
        key: "organizations",
        label: "기관 관리",
        icon: Building2,
        children: [
            { to: "/organizations/list", label: "기관 목록" },
            { to: "/organizations/new", label: "기관 등록" },
        ],
    },
    {
        key: "users",
        label: "사용자 관리",
        icon: Users,
        children: [
            { to: "/users/list", label: "사용자 목록" },
            { to: "/users/staff-managers", label: "직원 관리자 목록" },
            { to: "/users/permission-grades", label: "권한 등급 관리" },
        ],
    },
    {
        key: "sales",
        label: "판매 관리",
        icon: ShoppingCart,
        children: [
            { to: "/sales/products", label: "상품관리" },
            { to: "/sales/status", label: "판매 현황" },
        ],
    },
    {
        key: "boards",
        label: "게시판 관리",
        icon: ClipboardList,
        children: [
            {
                to: "/board/inquiries",
                label: "1:1 문의",
                icon: MessageSquare,
            },
            { to: "/board/notices", label: "공지사항", icon: Megaphone },
        ],
    },
    {
        key: "settings",
        label: "시스템 설정",
        icon: Settings,
        children: [{ to: "/settings/site-info", label: "사이트 정보" }],
    },
];

export function AppSidebar() {
    const { pathname } = useLocation();
    const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>(() =>
        Object.fromEntries(
            navGroups.map((group) => [
                group.key,
                group.children.some((item) => isPathActive(pathname, item.to)),
            ]),
        ),
    );

    React.useEffect(() => {
        setOpenGroups((prev) => {
            let changed = false;
            const next = { ...prev };

            navGroups.forEach((group) => {
                const isGroupActive = group.children.some((item) =>
                    isPathActive(pathname, item.to),
                );

                if (isGroupActive && !next[group.key]) {
                    next[group.key] = true;
                    changed = true;
                }
            });

            return changed ? next : prev;
        });
    }, [pathname]);

    const toggleGroup = (groupKey: string) => {
        setOpenGroups((prev) => ({ ...prev, [groupKey]: !prev[groupKey] }));
    };

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="border-b border-sidebar-border">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <div className="flex h-14 items-center gap-2 px-2">
                                    <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-9 items-center justify-center rounded-lg font-semibold">
                                        M
                                    </div>
                                    <span className="truncate font-semibold group-data-[collapsible=icon]:hidden">
                                        [임시] 마스터 관리자
                                    </span>
                                </div>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
                        메뉴
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map(({ to, icon: Icon, label }) => (
                                <SidebarMenuItem key={to}>
                                    <NavSidebarButton to={to} icon={Icon} label={label} />
                                </SidebarMenuItem>
                            ))}
                            {navGroups.map((group) => {
                                const isOpen = openGroups[group.key] ?? false;
                                const isGroupActive = group.children.some((item) =>
                                    isPathActive(pathname, item.to),
                                );

                                return (
                                    <SidebarMenuItem key={group.key}>
                                        <SidebarMenuButton
                                            tooltip={group.label}
                                            isActive={isGroupActive}
                                            onClick={() => toggleGroup(group.key)}>
                                            <group.icon className="size-4" />
                                            <span>{group.label}</span>
                                            <ChevronRight
                                                className={`ml-auto size-4 transition-transform group-data-[collapsible=icon]:hidden ${
                                                    isOpen ? "rotate-90" : ""
                                                }`}
                                            />
                                        </SidebarMenuButton>
                                        {isOpen && (
                                            <SidebarMenuSub>
                                                {group.children.map((item) => (
                                                    <SidebarMenuSubItem key={item.to}>
                                                        <SidebarMenuSubButton
                                                            asChild
                                                            isActive={isPathActive(
                                                                pathname,
                                                                item.to,
                                                            )}>
                                                            <NavLink to={item.to}>
                                                                {item.icon && (
                                                                    <item.icon className="size-4" />
                                                                )}
                                                                <span>{item.label}</span>
                                                            </NavLink>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                ))}
                                            </SidebarMenuSub>
                                        )}
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="border-t border-sidebar-border">
                <NavUserProfile />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
