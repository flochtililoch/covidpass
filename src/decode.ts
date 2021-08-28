import {inflateRawSync} from 'zlib';

export function decodeData(data: string): Object {
    let encoded = data
        .match(/\d\d/g)
        .map(d => parseInt(d, 10) + 45)
        .map(d => String.fromCharCode(d))
        .join('');
    // Ideally, should use JWS library to extract payload
    // TODO: convert payload from string to buffer
    // jws.decode(data);
    // For now, use this workaround: https://github.com/auth0/node-jws/issues/72
    const payload = Buffer.from(encoded.split('.')[1], 'base64');
    const decoded = inflateRawSync(payload).toString();
    return JSON.parse(decoded);
}
