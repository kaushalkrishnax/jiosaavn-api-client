import fs from "fs";
import { runChecks } from "./runner";
import { inferSchema } from "./schema";
import { logLine, logResult, logSection } from "./logger";

const ONLY_SCHEMA = process.argv.includes("--only-schema");

async function main() {
  logLine(
    "╔════════════════════════════════════════════════════════════════════╗",
  );
  logLine(
    "║          JioSaavn API Client – Comprehensive Check                 ║",
  );
  logLine(
    "╚════════════════════════════════════════════════════════════════════╝",
  );

  const results = await runChecks();

  if (ONLY_SCHEMA) {
    const schema: Record<string, any> = {};

    for (const r of results) {
      if (r.response) {
        schema[r.name] = inferSchema(r.response);
      }
    }

    logSection("SCHEMA OUTPUT");
    const schemaOutput = JSON.stringify(schema, null, 2);
    logLine(schemaOutput);
    fs.writeFileSync("logs/test-schema.log", schemaOutput, "utf-8");
    logLine("\n✓ Schema exported to logs/test-schema.log");
    process.exit(0);
  }

  let output = "";
  for (const r of results) {
    logResult(r);
    output += `━━━ ${r.name} ━━━\n`;
    output += "Request:\n";
    output += JSON.stringify(r.request, null, 2) + "\n";
    if (r.error) {
      output += "Error:\n";
      output += r.error + "\n";
    } else {
      output += "Response:\n";
      output += JSON.stringify(r.response, null, 2) + "\n";
    }
  }

  fs.writeFileSync("logs/test-data.log", output, "utf-8");
  logLine("");
  logLine("✓ All checks completed successfully!");
  logLine("✓ Test data exported to logs/test-data.log");
}

main().catch((err) => {
  logLine("Fatal error:");
  logLine(err?.stack || String(err));
  process.exit(1);
});
