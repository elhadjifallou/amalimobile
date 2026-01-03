const jwt = require('jsonwebtoken');
const fs = require('fs');

// ⚠️ REMPLACE CES VALEURS PAR LES TIENNES
const TEAM_ID = '42G64GF863' ;        
const KEY_ID = 'K6J8ZSQ8B7';          // Ex: ABC1234XYZ
const CLIENT_ID = 'com.amali.service';
const KEY_FILE = './AuthKey_K6J8ZSQ8B7.p8';  // Chemin vers ton fichier .p8

// Lis la clé privée
const privateKey = fs.readFileSync(KEY_FILE, 'utf8');

// Crée le JWT
const token = jwt.sign(
  {
    iss: TEAM_ID,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 15777000, // 6 mois
    aud: 'https://appleid.apple.com',
    sub: CLIENT_ID,
  },
  privateKey,
  {
    algorithm: 'ES256',
    keyid: KEY_ID,
  }
);

console.log('✅ JWT généré :');
console.log(token);