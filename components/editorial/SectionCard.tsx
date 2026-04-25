"use client";

import { Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type SectionCardProps = {
  title: string;
  mode?: "view" | "edit";
  onEdit?: () => void;
  onCancel?: () => void;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export default function SectionCard({
  title,
  mode,
  onEdit,
  onCancel,
  action,
  children,
  className,
}: SectionCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle>{title}</CardTitle>
        <div className="flex items-center gap-2">
          {action}
          {mode === "view" && onEdit && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="mono text-[10px] uppercase tracking-widest"
            >
              <Pencil className="h-3 w-3" /> Editar
            </Button>
          )}
          {mode === "edit" && onCancel && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="mono text-[10px] uppercase tracking-widest"
            >
              <X className="h-3 w-3" /> Cancelar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className={cn("space-y-3")}>{children}</CardContent>
    </Card>
  );
}
