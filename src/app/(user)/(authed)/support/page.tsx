import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import SupportTable from "./_SupportTable";
import RaiseAQueryDialog from "./_RaiseAQueryDialog";
import { getServerAuthSession } from "~/server/auth";
import { Heading } from "~/components/ui/heading";

const SupportPage = async () => {
  const session = await getServerAuthSession();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading level={2}>Support Centre</Heading>
        <RaiseAQueryDialog />
      </div>

      <Tabs defaultValue="open">
        <TabsList>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>

        <TabsContent value="open">
          <SupportTable session={session} variant="OPEN" />
        </TabsContent>
        <TabsContent value="resolved">
          <SupportTable session={session} variant="RESOLVED" />
        </TabsContent>
        <TabsContent value="closed">
          <SupportTable session={session} variant="CLOSED" />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default SupportPage;
