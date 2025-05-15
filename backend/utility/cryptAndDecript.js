// utility/cryptoUtils.js
const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const secretKey = process.env.TOKEN_CRYPT_SECRET_CODE; // deve essere lunga 32 byte esatti (256 bit)

function encrypt(text) {
  const iv = crypto.randomBytes(16);//initial vector 16byte che rende ogni criptazione unica
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);
  let encrypted = cipher.update(text, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(encryptedText) {
  const [ivHex, encryptedData] = encryptedText.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');
  return decrypted;
}

module.exports = { encrypt, decrypt };
