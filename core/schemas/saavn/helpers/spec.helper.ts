import { type ZodSchema } from "zod";
import { expect } from "vitest";
import { item } from "../../../../postman/collections/JioSaavn API (v4).postman_collection.json" assert { type: "json" };

export function expectSchema(schema: ZodSchema, data: unknown, name: string) {
  const result = schema.safeParse(data);

  if (!result.success) {
    console.error(`\n❌ Schema validation failed: ${name}`);
    console.error(result.error.issues.map((issue) => issue));
  }

  expect(result.success).toBe(true);
}

export function getPostmanResponse(group: string, request: string) {
  const res = item
    .find((i) => i.name === group)
    ?.item?.find((i) => i.name === request)?.response?.[0]?.body;

  if (!res) throw new Error(`Missing response: ${group} -> ${request}`);

  return JSON.parse(res);
}
