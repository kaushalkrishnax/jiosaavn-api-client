export type PrimitiveSchema =
  | "string"
  | "number"
  | "boolean"
  | "null"
  | "unknown";

export interface CheckResult {
  name: string;
  request: any;
  response?: any;
  error?: string;
}

export type SchemaNode =
  | PrimitiveSchema
  | {
      __type: "array";
      items: SchemaNode[];
    }
  | {
      __type: "object";
      shape: Record<string, SchemaNode>;
    };
