export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonObject
  | JsonArray;

export type JsonObject = { [key: string]: JsonValue };
export type JsonArray = JsonValue[];
export type Json = JsonObject | JsonArray;

type P = string | unknown;
type B = Json | unknown;

export type Request<Params extends P = unknown, Body extends B = unknown> = {
  params: Params extends string ? Record<Params, string> : {},
  body: Body,
  cookies: Record<string, string>
};

export type Response = {
  status: (code: number) => Response,
  json: (data: Json) => void,
  end: () => void
};
