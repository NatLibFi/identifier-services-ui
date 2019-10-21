/**
 *
 * @licstart  The following is the entire license notice for the JavaScript code in this file.
 *
 * UI microservice of Identifier Services
 *
 * Copyright (C) 2019 University Of Helsinki (The National Library Of Finland)
 *
 * This file is part of identifier-services-ui
 *
 * identifier-services-ui program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * identifier-services-ui is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @licend  The above is the entire license notice
 * for the JavaScript code in this file.
 *
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import validateContentType from '@natlibfi/express-validate-content-type';
import parse from 'url-parse';
import {HTTP_PORT, SMTP_URL, API_URL, SYSTEM_USERNAME, SYSTEM_PASSWORD, PRIVATE_KEY_URL, NOTIFICATION_URL} from './config';
import * as frontendConfig from './frontEndConfig';
import fetch from 'node-fetch';
import base64 from 'base-64';
import svgCaptcha from 'svg-captcha';
import uuidv4 from 'uuid/v4';
import fs from 'fs';
import * as jwtEncrypt from 'jwt-token-encrypt';
function bodyParse() {
	validateContentType({
		type: ['application/json']
	});
	return bodyParser.json({
		type: ['application/json']
	});
}

const app = express();
app.use(cors());
app.use(bodyParse());

process.on('SIGINT', () => {
	process.exit(-1);
});

app.use(express.static(path.resolve(__dirname, 'public')));

app.post('/message', (req, res) => {
	async function main() {
		const parseUrl = parse(SMTP_URL, true);
		const emailcontent = `
			<h3>Contact Details</h3>
			<ul>
				<li>Name: ${req.body.name}</li>
				<li>Email: ${req.body.email}</li>
			</ul>
			<h3>Message</h3>
			<p>${req.body.description}</p>
		`;

		let transporter = nodemailer.createTransport({
			host: parseUrl.hostname,
			port: parseUrl.port,
			secure: false
		});

		await transporter.sendMail({
			from: 'test@test.com',
			to: 'sanjogstha7@gmail.com',
			replyTo: 'test@test.com',
			subject: 'New Message',
			text: 'hello World!!',
			html: emailcontent
		});
		res.send('Message Sent');
	}

	main().catch(console.error);
});

let captchaList = [];
let captcha;

app.get('/captcha', (req, res) => {
	captcha = svgCaptcha.create({
		size: 6,
		noise: 4
	});
	captcha.id = uuidv4();
	const {text, ...captchaWithoutText} = captcha;
	res.type('svg');
	captchaList.push(captcha);

	res.json(captchaWithoutText);
});

app.post('/captcha', (req, res) => {
	// eslint-disable-next-line no-unused-expressions
	captchaList.some(item => (item.id === req.body.id) && item.text === req.body.captchaInput) ?
		(res.send(true) && captchaList.map((item, i) => (item.text === req.body.captchaInput) &&
		captchaList.splice(i, 1))) : res.send(false) && captchaList.map((item, i) => (item.id === req.body.id) &&
		captchaList.splice(i, 1));
});

app.post('/auth', async (req, res) => {
	const API_URL = req.body.API_URL;
	const result = await fetch(`${API_URL}/auth`, {
		method: 'POST',
		headers: {
			Authorization: 'Basic ' + base64.encode(req.body.username + ':' + req.body.password)
		}
	});
	const token = result.headers.get('Token');
	res.cookie('login-cookie', token, {maxAge: 300000, secure: false});
	res.status(200).json(token);
});

app.post('/requests/publishers', async (req, res) => {
	const systemToken = await systemAuth();
	const response = await fetch(`${API_URL}/requests/publishers`, {
		method: 'POST',
		headers: {
			Authorization: 'Bearer ' + systemToken,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(req.body)
	});
	res.status(response.status).json();
});

app.post('/requests/publications/isbn-ismn', async (req, res) => {
	const systemToken = await systemAuth();
	const response = await fetch(`${API_URL}/requests/publications/isbn-ismn`, {
		method: 'POST',
		headers: {
			Authorization: 'Bearer ' + systemToken,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(req.body)
	});
	res.status(response.status).json();
});

app.post('/requests/publications/issn', async (req, res) => {
	const systemToken = await systemAuth();
	const response = await fetch(`${API_URL}/requests/publications/issn`, {
		method: 'POST',
		headers: {
			Authorization: 'Bearer ' + systemToken,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(req.body)
	});
	res.status(response.status).json();
});

async function systemAuth() {
	const result = await fetch(`${API_URL}/auth`, {
		method: 'POST',
		headers: {
			Authorization: 'Basic ' + base64.encode(SYSTEM_USERNAME + ':' + SYSTEM_PASSWORD)
		}
	});
	return result.headers.get('Token');
}

app.get('/notification', (req, res) => {
	const data = fs.readFileSync(`${NOTIFICATION_URL}`, 'utf8');
	res.json(data);
});

app.get('/logOut', (req, res) => {
	res.clearCookie('login-cookie');
	res.send('cookie cleared');
});

app.post('/passwordreset', async (req, res) => {
	const systemToken = await systemAuth();
	const response = await fetch(`${API_URL}/users/${req.body.email}/password`, {
		method: 'POST',
		headers: {
			Authorization: 'Bearer ' + systemToken,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(req.body)
	});
	const result = await response.json();
	res.json({status: result});
});

app.get('/users/passwordReset/:token', async (req, res) => {
	const response = fs.readFileSync(`${PRIVATE_KEY_URL}`, 'utf-8');
	const encryptionKey = JSON.parse(response);
	const token = req.params.token;

	const decrypted = jwtEncrypt.readJWT(token, encryptionKey[0]);
	if (Date.now() <= decrypted.exp * 1000) {
		// Const readResponse = fs.readFileSync(`${PASSPORT_LOCAL}`, 'utf-8');
		// const passportLocalList = JSON.parse(readResponse);
		// const passportLocal = passportLocalList.filter(passport => passport.id === decrypted.data.email);
		// const result = await fetch(`${API_URL}/auth`, {
		// 	method: 'POST',
		// 	headers: {
		// 		Authorization: 'Basic ' + base64.encode(passportLocal[0].id + ':' + passportLocal[0].password)
		// 	}
		// });
		// const token = result.headers.get('Token');
		// res.cookie('login-cookie', token, {maxAge: 300000, secure: false});
		res.sendFile(path.join(__dirname, 'public/index.html'));
	} else {
		res.send('Link Expired !!!');
	}
});

app.get('/conf', (_req, res) => {
	res.json(frontendConfig);
});

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(HTTP_PORT, () => console.log('info', `Application Started on PORT ${HTTP_PORT}`));

