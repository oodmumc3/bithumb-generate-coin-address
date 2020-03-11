const request = require('request');
const uuidv4 = require("uuid/v4");
const crypto = require('crypto');
const sign = require('jsonwebtoken').sign;
const queryEncode = require("querystring").encode;

const access_key = 'zwcixauY0mZIcPM5nFLwGZ5l3uYtn46pZZzoP5sG';
const secret_key = 'NeBtmaASWUAB8DyQZKxFE7RTWeOmiZnPtzedQSn1';
const server_url = 'https://api.upbit.com';

const body = {
    currency: 'HBAR'
};

const query = queryEncode(body);

const hash = crypto.createHash('sha512');
const queryHash = hash.update(query, 'utf-8').digest('hex');

const payload = {
    access_key: access_key,
    nonce: uuidv4(),
    query_hash: queryHash,
    query_hash_alg: 'SHA512',
};

const token = sign(payload, secret_key);

const options = {
    method: "POST",
    url: server_url + "/v1/deposits/generate_coin_address",
    headers: {Authorization: `Bearer ${token}`},
    json: body
};

request(options, (error, response, body) => {
    if (error) throw new Error(error);
    console.log(body)
});