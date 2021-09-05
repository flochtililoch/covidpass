import Cors from 'cors';
import forge from 'node-forge';

const ALLOWED_ORIGINS = [process.env.BASE_URL || 'http://localhost:3000'];

const APPLE_CA_CERTIFICATE = forge.pki.certificateFromPem(
  process.env.APPLE_WWDR_CERT_PEM ||
    `-----BEGIN CERTIFICATE-----
MIIEIjCCAwqgAwIBAgIIAd68xDltoBAwDQYJKoZIhvcNAQEFBQAwYjELMAkGA1UE
BhMCVVMxEzARBgNVBAoTCkFwcGxlIEluYy4xJjAkBgNVBAsTHUFwcGxlIENlcnRp
ZmljYXRpb24gQXV0aG9yaXR5MRYwFAYDVQQDEw1BcHBsZSBSb290IENBMB4XDTEz
MDIwNzIxNDg0N1oXDTIzMDIwNzIxNDg0N1owgZYxCzAJBgNVBAYTAlVTMRMwEQYD
VQQKDApBcHBsZSBJbmMuMSwwKgYDVQQLDCNBcHBsZSBXb3JsZHdpZGUgRGV2ZWxv
cGVyIFJlbGF0aW9uczFEMEIGA1UEAww7QXBwbGUgV29ybGR3aWRlIERldmVsb3Bl
ciBSZWxhdGlvbnMgQ2VydGlmaWNhdGlvbiBBdXRob3JpdHkwggEiMA0GCSqGSIb3
DQEBAQUAA4IBDwAwggEKAoIBAQDKOFSmy1aqyCQ5SOmM7uxfuH8mkbw0U3rOfGOA
YXdkXqUHI7Y5/lAtFVZYcC1+xG7BSoU+L/DehBqhV8mvexj/avoVEkkVCBmsqtsq
Mu2WY2hSFT2Miuy/axiV4AOsAX2XBWfODoWVN2rtCbauZ81RZJ/GXNG8V25nNYB2
NqSHgW44j9grFU57Jdhav06DwY3Sk9UacbVgnJ0zTlX5ElgMhrgWDcHld0WNUEi6
Ky3klIXh6MSdxmilsKP8Z35wugJZS3dCkTm59c3hTO/AO0iMpuUhXf1qarunFjVg
0uat80YpyejDi+l5wGphZxWy8P3laLxiX27Pmd3vG2P+kmWrAgMBAAGjgaYwgaMw
HQYDVR0OBBYEFIgnFwmpthhgi+zruvZHWcVSVKO3MA8GA1UdEwEB/wQFMAMBAf8w
HwYDVR0jBBgwFoAUK9BpR5R2Cf70a40uQKb3R01/CF4wLgYDVR0fBCcwJTAjoCGg
H4YdaHR0cDovL2NybC5hcHBsZS5jb20vcm9vdC5jcmwwDgYDVR0PAQH/BAQDAgGG
MBAGCiqGSIb3Y2QGAgEEAgUAMA0GCSqGSIb3DQEBBQUAA4IBAQBPz+9Zviz1smwv
j+4ThzLoBTWobot9yWkMudkXvHcs1Gfi/ZptOllc34MBvbKuKmFysa/Nw0Uwj6OD
Dc4dR7Txk4qjdJukw5hyhzs+r0ULklS5MruQGFNrCk4QttkdUGwhgAqJTleMa1s8
Pab93vcNIx0LSiaHP7qRkkykGRIZbVf1eliHe2iK5IaMSuviSRSqpd1VAKmuu0sw
ruGgsbwpgOYJd+W+NKIByn/c4grmO7i77LpilfMFY0GCzQ87HUyVpNur+cmV6U/k
TecmmYHpvPm0KdIBembhLoz2IYrF+Hjhga6/05Cdqa3zr/04GpZnMBxRpVzscYqC
tGwPDBUf
-----END CERTIFICATE-----`,
);

const HASHES = {
  DARK: {
    'icon.png': "9dcdd385e848610f020cf3bfc65ddc413beb5e87",
    'icon@2x.png': "4e8a383fd25dc26c686f8ac70f2a251d5bd60979",
    'logo.png': "9dcdd385e848610f020cf3bfc65ddc413beb5e87",
    'logo@2x.png': "4e8a383fd25dc26c686f8ac70f2a251d5bd60979",
  },
  LIGHT: {
    'icon.png': "8fe995e82fa5fa28178df005a1340ae52dcf60e3",
    'icon@2x.png': "28cbd85eee40f0ac79a1cfe96524a64036c9cb9e",
    'logo.png': "8fe995e82fa5fa28178df005a1340ae52dcf60e3",
    'logo@2x.png': "28cbd85eee40f0ac79a1cfe96524a64036c9cb9e"
  },
};

function initMiddleware(middleware) {
  return (req, res) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}

const cors = initMiddleware(
  Cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }
      if (ALLOWED_ORIGINS.indexOf(origin) === -1) {
        var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  }),
);

export default async function handler(req, res) {
  await cors(req, res);
  if (req.method !== 'POST') {
    res.status(405).json({});
    return;
  }

  const manifest = JSON.stringify({
    'pass.json': req.body.passJsonHash,
    ...(req.body.useBlackVersion ? HASHES.DARK : HASHES.LIGHT),
  });

  let certificate;
  let key;
  try {
    // From https://github.com/walletpass/pass-js/blob/2b6475749582ca3ea742a91466303cb0eb01a13a/src/template.ts#L249 
    certificate = forge.pki.certificateFromPem(process.env.CERT);
    if (!certificate) {
      res.status(500).send('Failed to load signing identity')
      return
    }
    const pemMessages = forge.pem.decode(process.env.CERT);
    const signerKeyMessage = pemMessages.find(message =>
      message.type.includes('KEY'),
    );
    if (signerKeyMessage) {
      key = forge.pki.decryptRsaPrivateKey(
        forge.pem.encode(signerKeyMessage),
        process.env.PASSPHRASE
      )
      if (!key) {
        console.log("Failed to decode the key.")
      }
    }
  } catch (e) {
    console.log(e)
    res.status(500).send('Failed to load signing identity')
    return
  }
  
  if (!certificate || !key) {
    res.status(500).send('Failed to load signing identity')
    return
  }

  // From https://github.com/walletpass/pass-js/blob/2b6475749582ca3ea742a91466303cb0eb01a13a/src/lib/signManifest-forge.ts#L42
  const p7 = forge.pkcs7.createSignedData();
  p7.content = manifest;
  p7.addCertificate(certificate);
  p7.addCertificate(APPLE_CA_CERTIFICATE);
  p7.addSigner({
    key: forge.pki.privateKeyToPem(key),
    certificate,
    digestAlgorithm: forge.pki.oids.sha1,
    authenticatedAttributes: [
      {
        type: forge.pki.oids.contentType,
        value: forge.pki.oids.data,
      },
      {
        type: forge.pki.oids.messageDigest,
        // value will be auto-populated at signing time
      },
      {
        type: forge.pki.oids.signingTime,
        // value will be auto-populated at signing time
        // value: new Date('2050-01-01T00:00:00Z')
      },
    ],
  });

  /**
   * Creating a detached signature because we don't need the signed content.
   */
  p7.sign({ detached: true });

  let signature = Buffer.from(forge.asn1.toDer(p7.toAsn1()).getBytes(), 'binary');

  res.status(200).send(signature)
};
