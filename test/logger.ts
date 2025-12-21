import fs from "fs";
import { type CheckResult } from "./types";

export function logLine(line: string) {
  console.log(line);
}

export function logSection(title: string) {
  logLine("");
  logLine("=".repeat(80));
  logLine(title);
  logLine("=".repeat(80));
}

export function logResult(result: CheckResult) {
  logLine(`━━━ ${result.name} ━━━`);
  logLine("Request:");
  logLine(JSON.stringify(result.request, null, 2));

  if (result.error) {
    logLine("Error:");
    logLine(result.error);
    return;
  }

  logLine("Response:");
  logLine(JSON.stringify(result.response, null, 2));
}
