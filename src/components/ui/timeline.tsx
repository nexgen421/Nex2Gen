import React from "react";
import { cn } from "~/lib/utils";

interface TimelineProps {
  children: React.ReactNode;
  className?: string;
}

export const Timeline: React.FC<TimelineProps> = ({ children, className }) => (
  <ul className={cn("space-y-4", className)}>{children}</ul>
);

interface TimelineItemProps {
  children: React.ReactNode;
  className?: string;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({
  children,
  className,
}) => <li className={cn("relative pl-6", className)}>{children}</li>;

interface TimelineConnectorProps {
  className?: string;
}

export const TimelineConnector: React.FC<TimelineConnectorProps> = ({
  className,
}) => (
  <span
    className={cn("absolute -bottom-7 left-2 top-7 w-px bg-border", className)}
  />
);

interface TimelineIconProps {
  className?: string;
}

export const TimelineIcon: React.FC<TimelineIconProps> = ({ className }) => (
  <span
    className={cn(
      "absolute left-0 flex h-5 w-5 items-center justify-center rounded-full border border-border bg-background",
      className,
    )}
  />
);

interface TimelineHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const TimelineHeader: React.FC<TimelineHeaderProps> = ({
  children,
  className,
}) => <div className={cn("mb-1 flex items-center", className)}>{children}</div>;

interface TimelineTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const TimelineTitle: React.FC<TimelineTitleProps> = ({
  children,
  className,
}) => <h3 className={cn("text-sm font-medium", className)}>{children}</h3>;

interface TimelineContentProps {
  children: React.ReactNode;
  className?: string;
}

export const TimelineContent: React.FC<TimelineContentProps> = ({
  children,
  className,
}) => <div className={cn("mb-4", className)}>{children}</div>;

interface TimelineBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const TimelineBody: React.FC<TimelineBodyProps> = ({
  children,
  className,
}) => (
  <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>
);
