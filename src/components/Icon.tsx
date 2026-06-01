import React from "react";
import * as Icons from "lucide-react";

export function Icon({ name, ...props }: { name: string; className?: string; size?: number }) {
  const LucideIcon = Icons[name as keyof typeof Icons] as React.ElementType;
  if (!LucideIcon) return <Icons.Circle {...props} />;
  return <LucideIcon {...props} />;
}
