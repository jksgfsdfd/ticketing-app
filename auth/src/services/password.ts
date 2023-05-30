import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const asyncScrypt = promisify(scrypt);

export class Password {
  static async toHash(password: string): Promise<string> {
    const salt = randomBytes(8).toString("hex");
    const hashed = (await asyncScrypt(password, salt, 64)) as Buffer;
    return `${hashed.toString("hex")}.${salt}`;
  }

  static async compare(
    inputPassword: string,
    storedPassword: string
  ): Promise<boolean> {
    const [hashedPassword, salt] = storedPassword.split(".");

    const currentHashed = (await asyncScrypt(
      inputPassword,
      salt,
      64
    )) as Buffer;
    if (currentHashed.toString("hex") == hashedPassword) {
      return true;
    } else {
      return false;
    }
  }
}
