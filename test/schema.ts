import type { SchemaNode } from "./types";

export const DIG_LIMIT = 10;

function primitive(value: unknown) {
  if (value === null) return "null";
  if (value === undefined) return "unknown";

  const t = typeof value;
  if (t === "string") return "string";
  if (t === "number") return "number";
  if (t === "boolean") return "boolean";

  return "unknown";
}

function dedupeSchemas(nodes: SchemaNode[]) {
  const map = new Map();
  for (const n of nodes) {
    map.set(JSON.stringify(n), n);
  }
  return [...map.values()];
}

export function inferSchema(value: unknown, depth = 0): SchemaNode {
  if (depth >= DIG_LIMIT) {
    return "unknown";
  }

  if (value === null || value === undefined) {
    return primitive(value);
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return { __type: "array", items: ["unknown"] };
    }

    const itemSchemas = dedupeSchemas(
      value.map((v) => inferSchema(v, depth + 1))
    );

    return {
      __type: "array",
      items: itemSchemas,
    };
  }

  if (typeof value === "object") {
    const shape: any = {};

    for (const [key, val] of Object.entries(value)) {
      shape[key] = inferSchema(val, depth + 1);
    }

    return {
      __type: "object",
      shape,
    };
  }

  return primitive(value);
}
