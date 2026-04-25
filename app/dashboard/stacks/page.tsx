import { listStacks } from "@/db/queries";
import StacksManager from "../StacksManager";

export default async function StacksListPage() {
  const stacks = await listStacks();
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">
      <header>
        <p className="mono-label mb-3">§ Ω · Console</p>
        <h1 className="display text-4xl md:text-5xl font-black tracking-tight leading-none">
          Stacks
        </h1>
        <p className="mt-3 text-stone-500">
          {stacks.length} {stacks.length === 1 ? "stack" : "stacks"} cadastrados.
        </p>
      </header>
      <StacksManager initialStacks={stacks} />
    </div>
  );
}
