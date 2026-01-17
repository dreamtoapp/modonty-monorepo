"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogEntry {
  message: string;
  level: "info" | "success" | "error";
  timestamp: string;
}

interface SeedLogViewerProps {
  logs: LogEntry[];
  onClear: () => void;
  isConnected: boolean;
}

export function SeedLogViewer({ logs, onClear, isConnected }: SeedLogViewerProps) {
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, autoScroll]);

  const getLogLevelStyle = (level: string) => {
    switch (level) {
      case "success":
        return "text-green-600 dark:text-green-400";
      case "error":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-foreground";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString();
    } catch {
      return "";
    }
  };

  const exportLogs = () => {
    const logText = logs
      .map((log) => `[${formatTimestamp(log.timestamp)}] [${log.level.toUpperCase()}] ${log.message}`)
      .join("\n");
    const blob = new Blob([logText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `seed-logs-${new Date().toISOString()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Live Logs</CardTitle>
            <CardDescription>
              Real-time output from the seeding process
              {isConnected && (
                <span className="ml-2 inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  Connected
                </span>
              )}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="auto-scroll"
                checked={autoScroll}
                onCheckedChange={(checked) => setAutoScroll(checked === true)}
              />
              <label
                htmlFor="auto-scroll"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Auto-scroll
              </label>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={exportLogs}
              disabled={logs.length === 0}
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClear}
              disabled={logs.length === 0}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div
          className="h-[400px] w-full rounded-md border p-4 overflow-y-auto bg-muted/30"
          ref={scrollAreaRef}
        >
          <div className="space-y-1 font-mono text-sm">
            {logs.length === 0 ? (
              <div className="text-muted-foreground text-center py-8">
                No logs yet. Start seeding to see live output...
              </div>
            ) : (
              logs.map((log, index) => (
                <div
                  key={index}
                  className={cn("whitespace-pre-wrap break-words", getLogLevelStyle(log.level))}
                >
                  <span className="text-muted-foreground text-xs mr-2">
                    [{formatTimestamp(log.timestamp)}]
                  </span>
                  {log.message}
                </div>
              ))
            )}
            <div ref={endRef} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
