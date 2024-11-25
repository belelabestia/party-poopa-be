export type Request = {
  body: Record<string, unknown>,
  cookies: Record<string, string>
};

type Status = { json: (data: object) => void };
export type Response = { status: (code: number) => Status };