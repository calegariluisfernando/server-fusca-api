import { createHash } from 'crypto';

class Helpers {

    static generateMd5(text: string): string {

        return createHash('md5').update(text).digest('hex');
    }
}

export { Helpers };