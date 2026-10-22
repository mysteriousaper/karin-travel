// Same calls as src/app/admin/actions.ts (sharp) and src/lib/notify.ts (nodemailer).
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
const require = createRequire(process.cwd() + '/package.json');
const sharp = require('sharp');
const nodemailer = require('nodemailer');
const input = readFileSync('public/images/egypt-camels.jpg');
const { data, info } = await sharp(input).rotate().resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 }).toBuffer({ resolveWithObject: true });
console.log('sharp', sharp.versions?.sharp ?? '', 'webp', info.format, info.width + 'x' + info.height, Math.round(data.length / 1024) + 'KB');
const blur = await sharp(input).resize(16).blur(1.2).jpeg({ quality: 50 }).toBuffer();
console.log('blur jpeg', blur.length, 'bytes');
const t = nodemailer.createTransport({ jsonTransport: true });
const r = await t.sendMail({ from: 'site@example.com', to: 'agency@example.com', subject: 'New enquiry: test — Maldives', text: 'New enquiry · Tour\nName: Test' });
console.log('nodemailer', require('nodemailer/package.json').version, 'ok, envelope:', JSON.stringify(r.envelope));
const smtp = nodemailer.createTransport({ host: 'smtp.example.com', port: 587, secure: false, auth: { user: 'u', pass: 'p' } });
console.log('smtp transport created:', smtp.transporter.name);
