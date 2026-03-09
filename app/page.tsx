import { SuperAdminLayout } from "@/layouts/SuperAdminLayout";
import { DashboardPage } from "@/dashboard/DashboardPage";

export default function Home() {
  return (
    <SuperAdminLayout>
      <DashboardPage />
    </SuperAdminLayout>
  );
}
