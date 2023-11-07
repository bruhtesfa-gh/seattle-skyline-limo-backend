import jwt, {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from "jsonwebtoken";
export async function generateToken(user: any) {
  return jwt.sign(
    {
      sub: user.id,
      exp: Math.floor(Date.now() / 1000) + 6000000 * 60,
    },
    "secret"
  );
}

export async function verifyToken(token: string) {
  return jwt.verify(token, "secret");
}
