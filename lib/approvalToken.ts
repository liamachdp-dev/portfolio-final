import crypto from "crypto";

export function signAction(id: string, status: string) {
  return crypto
    .createHmac("sha256", process.env.APPROVAL_SECRET!)
    .update(`${id}:${status}`)
    .digest("hex");
}

export function verifyAction(id: string, status: string, token: string) {
  try {
    const expected = signAction(id, status);
    const a = Buffer.from(expected);
    const b = Buffer.from(token);
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}