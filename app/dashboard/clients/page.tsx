import { listClientsWithProjects } from "@/db/queries";
import ClientsManager from "../ClientsManager";

export default async function ClientsListPage() {
  const clients = await listClientsWithProjects();
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">
      <header>
        <p className="mono-label mb-3">§ Ω · Console</p>
        <h1 className="display text-4xl md:text-5xl font-black tracking-tight leading-none">
          Clientes
        </h1>
        <p className="mt-3 text-stone-500">
          {clients.length} {clients.length === 1 ? "cliente" : "clientes"} cadastrados.
        </p>
      </header>
      <ClientsManager initialClients={clients} />
    </div>
  );
}
