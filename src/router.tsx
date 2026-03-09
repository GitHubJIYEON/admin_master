import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { DashboardPage } from "@/pages/DashboardPage";
import { OrganizationsPage } from "@/pages/OrganizationsPage";
import { OrganizationDetailPage } from "@/pages/OrganizationDetailPage";
import { OrganizationEditPage } from "@/pages/OrganizationEditPage";
import { OrganizationCreatePage } from "@/pages/OrganizationCreatePage";
import { OrganizationMembersPage } from "@/pages/OrganizationMembersPage";
import { OrganizationChartPage } from "@/pages/OrganizationChartPage";
import { UsersPage } from "@/pages/UsersPage";
import { UserDetailPage } from "@/pages/UserDetailPage";
import { UserCreatePage } from "@/pages/UserCreatePage";
import { StaffManagersPage } from "@/pages/StaffManagersPage";
import { StaffManagerDetailPage } from "@/pages/StaffManagerDetailPage";
import { PermissionGradesPage } from "@/pages/PermissionGradesPage.tsx";
import { SiteInfoPage } from "@/pages/SiteInfoPage";
import { PlaceholderPage } from "@/pages/PlaceholderPage";
import { SalesProductsPage } from "@/pages/SalesProductsPage";
import { SalesProductsCreatePage } from "@/pages/SalesProductsCreatePage";
import { SalesProductDetailPage } from "@/pages/SalesProductDetailPage";
import { SalesStatusPage } from "@/pages/SalesStatusPage";
import { SalesStatusDetailPage } from "@/pages/SalesStatusDetailPage";
import { SalesStatusCreatePage } from "@/pages/SalesStatusCreatePage";
import { SalesStatusEditPage } from "@/pages/SalesStatusEditPage";
import { LoginPage } from "@/pages/LoginPage";

export const router = createBrowserRouter([
    { path: "/login", element: <LoginPage /> },
    {
        path: "/",
        element: <AppLayout />,
        children: [
            { index: true, element: <Navigate to="/dashboard" replace /> },
            { path: "dashboard", element: <DashboardPage /> },
            { path: "organizations", element: <Navigate to="/organizations/list" replace /> },
            { path: "organizations/list", element: <OrganizationsPage /> },
            { path: "organizations/:organizationId", element: <OrganizationDetailPage /> },
            {
                path: "organizations/:organizationId/members",
                element: <OrganizationMembersPage />,
            },
            {
                path: "organizations/:organizationId/chart",
                element: <OrganizationChartPage />,
            },
            {
                path: "organizations/:organizationId/edit",
                element: <OrganizationEditPage />,
            },
            {
                path: "organizations/new",
                element: <OrganizationCreatePage />,
            },
            { path: "users", element: <Navigate to="/users/list" replace /> },
            { path: "users/list", element: <UsersPage /> },
            { path: "users/new", element: <UserCreatePage /> },
            { path: "users/:userId", element: <UserDetailPage /> },
            { path: "users/staff-managers", element: <StaffManagersPage /> },
            { path: "users/staff-managers/:staffId", element: <StaffManagerDetailPage /> },
            { path: "users/permission-grades", element: <PermissionGradesPage /> },
            {
                path: "sales/products",
                element: <SalesProductsPage />,
            },
            {
                path: "sales/products/new",
                element: <SalesProductsCreatePage />,
            },
            {
                path: "sales/products/:productId",
                element: <SalesProductDetailPage />,
            },
            {
                path: "sales/status",
                element: <SalesStatusPage />,
            },
            {
                path: "sales/status/new",
                element: <SalesStatusCreatePage />,
            },
            {
                path: "sales/status/:salesId",
                element: <SalesStatusDetailPage />,
            },
            {
                path: "sales/status/:salesId/edit",
                element: <SalesStatusEditPage />,
            },
            {
                path: "board/inquiries",
                element: (
                    <PlaceholderPage
                        title="1:1 문의"
                        description="고객 문의 내역을 조회하고 답변을 관리합니다."
                    />
                ),
            },
            {
                path: "board/notices",
                element: (
                    <PlaceholderPage
                        title="공지사항"
                        description="공지사항을 작성하고 게시 상태를 관리합니다."
                    />
                ),
            },
            { path: "settings", element: <Navigate to="/settings/site-info" replace /> },
            { path: "settings/site-info", element: <SiteInfoPage /> },
        ],
    },
    { path: "*", element: <Navigate to="/dashboard" replace /> },
]);
