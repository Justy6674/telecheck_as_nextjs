import React from "react";
import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  height?: string;
  width?: string;
  rounded?: boolean;
}

export const LoadingSkeleton = ({ 
  className, 
  height = "h-4", 
  width = "w-full", 
  rounded = true 
}: LoadingSkeletonProps) => {
  return (
    <div 
      className={cn(
        "animate-pulse bg-muted", 
        height, 
        width, 
        rounded && "rounded",
        className
      )} 
    />
  );
};

interface CardSkeletonProps {
  className?: string;
}

export const CardSkeleton = ({ className }: CardSkeletonProps) => {
  return (
    <div className={cn("space-y-3 p-4 border rounded-lg bg-card", className)}>
      <LoadingSkeleton height="h-6" width="w-3/4" />
      <LoadingSkeleton height="h-4" width="w-full" />
      <LoadingSkeleton height="h-4" width="w-2/3" />
      <div className="flex gap-2 mt-4">
        <LoadingSkeleton height="h-8" width="w-20" />
        <LoadingSkeleton height="h-8" width="w-16" />
      </div>
    </div>
  );
};