export type Request = {
  body: Record<string, unknown>,
  cookies: Record<string, string>
};

export type Response = {
  status: (code: number) => Response,
  json: (data: object) => void,
  end: () => void
};
