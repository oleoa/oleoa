import { notFound } from "next/navigation";
import {
  getClientById,
  listProjectsByClientId,
} from "@/db/queries";

import ClientHeader from "./ClientHeader";
import ClientGeneralEditor from "./ClientGeneralEditor";
import ClientProjectsList from "./ClientProjectsList";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [client, projects] = await Promise.all([
    getClientById(id),
    listProjectsByClientId(id),
  ]);
  if (!client) notFound();

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      <ClientHeader client={client} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ClientGeneralEditor client={client} />
        </div>
        <div>
          <ClientProjectsList projects={projects} />
        </div>
      </div>
    </div>
  );
}
