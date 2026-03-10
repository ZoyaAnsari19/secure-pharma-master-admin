"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const SideDrawer = DialogPrimitive.Root;
const SideDrawerTrigger = DialogPrimitive.Trigger;
const SideDrawerPortal = DialogPrimitive.Portal;
const SideDrawerClose = DialogPrimitive.Close;

const SideDrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-40 bg-black/30 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
SideDrawerOverlay.displayName = DialogPrimitive.Overlay.displayName;

const SideDrawerContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { showClose?: boolean }
>(({ className, children, showClose = true, ...props }, ref) => (
  <SideDrawerPortal>
    <SideDrawerOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-md flex-col border-l border-gray-100 bg-white p-6 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
        className
      )}
      {...props}
    >
      {showClose && (
        <SideDrawerClose asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 h-8 w-8 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </SideDrawerClose>
      )}
      {children}
    </DialogPrimitive.Content>
  </SideDrawerPortal>
));
SideDrawerContent.displayName = DialogPrimitive.Content.displayName;

const SideDrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "mb-4 flex flex-col space-y-1.5 border-b border-gray-100 pb-4 text-left",
      className
    )}
    {...props}
  />
);

const SideDrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "mt-6 flex flex-col-reverse gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between",
      className
    )}
    {...props}
  />
);

const SideDrawerTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-gray-900", className)}
    {...props}
  />
));
SideDrawerTitle.displayName = DialogPrimitive.Title.displayName;

const SideDrawerDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-gray-500", className)}
    {...props}
  />
));
SideDrawerDescription.displayName = DialogPrimitive.Description.displayName;

export {
  SideDrawer,
  SideDrawerPortal,
  SideDrawerOverlay,
  SideDrawerTrigger,
  SideDrawerClose,
  SideDrawerContent,
  SideDrawerHeader,
  SideDrawerFooter,
  SideDrawerTitle,
  SideDrawerDescription,
};

