import React, {
  type ForwardRefExoticComponent,
  type RefAttributes,
} from "react";
import SupportTable from "./_SupportTable";
import { getServerAuthSession } from "~/server/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { BookOpen, CheckCircle, type LucideProps, XCircle } from "lucide-react";
import { api } from "~/trpc/server";

const DashboardCard = ({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  color: string;
}) => (
  <div className="group relative overflow-hidden rounded-lg bg-white p-4 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95">
    <div className="flex items-center gap-4">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full ${color} bg-opacity-20 transition-all duration-300 group-hover:bg-opacity-100`}
      >
        <Icon
          className={`h-6 w-6 ${color} transition-all duration-300 group-hover:text-white`}
        />
      </div>
      <div className="flex flex-col">
        <h4 className="text-sm font-medium text-gray-500">{title}</h4>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-0 transition-opacity duration-300 group-hover:opacity-10"></div>
  </div>
);

const page = async () => {
  const session = await getServerAuthSession();
  const dashboardData = await api.support.getAdminDashboardData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold">Support Dashboard</h1>
        <p className="text-gray-500">
          View and manage support tickets from your users.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Tickets Open"
          value={dashboardData.openTickets}
          icon={BookOpen}
          color="text-yellow-500"
        />
        <DashboardCard
          title="Tickets Resolved"
          value={dashboardData.resolvedTickets}
          icon={CheckCircle}
          color="text-green-500"
        />
        <DashboardCard
          title="Tickets Closed"
          value={dashboardData.closedTickets}
          icon={XCircle}
          color="text-red-500"
        />
      </div>

      <Tabs defaultValue="OPEN" className="w-full">
        <TabsList>
          <TabsTrigger value="OPEN">Open</TabsTrigger>
          <TabsTrigger value="RESOLVED">Resolved</TabsTrigger>
          <TabsTrigger value="CLOSED">Closed</TabsTrigger>
        </TabsList>
        <TabsContent value="OPEN">
          <SupportTable session={session} type="OPEN" />
        </TabsContent>
        <TabsContent value="RESOLVED">
          <SupportTable session={session} type="RESOLVED" />
        </TabsContent>
        <TabsContent value="CLOSED">
          <SupportTable session={session} type="CLOSED" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
