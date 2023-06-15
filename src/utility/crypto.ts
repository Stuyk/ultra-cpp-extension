import * as crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const iv = crypto.randomBytes(16);

export function encrypt(data: string | Object, password: string): string {
    const passwordHash = sha256(password, 'base64');
    const dataString = typeof data === 'string' ? data : JSON.stringify(data);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(passwordHash), iv);
    let encrypted = cipher.update(dataString);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + '$' + encrypted.toString('hex');
}

export function decrypt<T = string>(data: string, password: string, fromJSON = false): T {
    if (!data.includes('$')) {
        throw new Error(`Could not decrypt data`);
    }

    const [ivHex, encryptedDataHex] = data.split('$');
    const passwordHash = sha256(password, 'base64');
    const iv = Buffer.from(ivHex, 'hex');
    const encryptedText = Buffer.from(encryptedDataHex, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(passwordHash), iv);

    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    if (fromJSON) {
        return JSON.parse(decrypted.toString());
    }

    return decrypted.toString() as T;
}

export function sha256(data: string, format: 'hex' | 'base64'): string {
    const hash = crypto.createHash('sha256');
    hash.update(data);

    if (format === 'hex') {
        return hash.digest(format);
    }

    return hash.digest(format).substring(0, 32);
}
