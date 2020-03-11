const request = require('request');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const sign = require('jsonwebtoken').sign;
const queryEncode = require("querystring").encode;

const GenerateCoin = {
    _requestServerUrl: 'https://api.upbit.com',
    _interval: null,
    init () {
        this._bindEvents();
    },
    _bindEvents () {
        $('#startBtn').click(this._onClickStartBtn.bind(this));
    },
    _onClickStartBtn () {
        const accessKey = $('#accessKey').val();
        const secretKey = $('#secretKey').val();

        const currency = $('#currency').val();
        const loopTime = $('#loopTime').val();

        if (!accessKey || !secretKey || !currency || !loopTime) {
            this._alert('모든 입력값을 입력해주세요.');
            return;
        }

        $('#startBtn').hide();
        const self = this;
        this._interval = setInterval(() => {
            self._requestGenerateCoinAddress(accessKey, secretKey, currency, loopTime);
        }, loopTime);
    },
    _requestGenerateCoinAddress (accessKey, secretKey, currency, loopTime) {
        const body = { currency };
        const payload = this._makePayload(body, accessKey);
        const token = sign(payload, secretKey);

        const options = {
            method: 'POST',
            url: this._requestServerUrl + '/v1/deposits/generate_coin_address',
            headers: {Authorization: `Bearer ${token}`},
            json: body
        };

        const self = this;
        request(options, (error, response, body) => {
            if (error) {
                console.error(error);
                return;
            }

            if (body.error) {
                self._showErrorMsg(body.error.message, body.error.name);
            } else if (body.success) {
                self._showInfoMsg(body.success, body.message);
            } else {
                self._showSuccessMsg(body.currency, body.deposit_address, body.secondary_address);
                clearInterval(self._interval);
                $('#startBtn').show();
            }
        });
    },
    _makePayload (body, accessKey) {
        const query = queryEncode(body);

        const hash = crypto.createHash('sha512');
        const queryHash = hash.update(query, 'utf-8').digest('hex');

        return {
            access_key: accessKey,
            nonce: uuidv4(),
            query_hash: queryHash,
            query_hash_alg: 'SHA512',
        };
    },
    _showInfoMsg (success, message) {
        const date = new Date().toLocaleString();
        const msg = `[[응답 진행중]]<br/><br/>응답시간 - ${date}<br/>success - ${success}<br/>message - ${message}`;
        $('#errorMsg').hide();
        $('#infoMsg').html(msg).show();
    },
    _showErrorMsg (errorMessage, errorName) {
        const date = new Date().toLocaleString();
        const msg = `[[응답 에러]]<br/><br/>응답시간 - ${date}<br/>error message - ${errorMessage}<br/>error name - ${errorName}`;
        $('#successMsg').hide();
        $('#errorMsg').html(msg).show();
    },
    _showSuccessMsg (currency, depositAddress, secondaryAddress) {
        const date = new Date().toLocaleString();
        let msg = `[[요청 성공]]<br/><br/>응답시간 - ${date}<br/>currency - ${currency}<br/>deposit_address - ${depositAddress}<br/>secondary_address - ${secondaryAddress}`;
        msg += '<br/><br/><br/>응답 성공으로 인해 요청 반복을 종료합니다.';
        $('#errorMsg').hide();
        $('#infoMsg').hide();
        $('#successMsg').html(msg).show();
    },
    _alert (msg) {
        $('#alertDiv').text(msg).show()
    },
    _alertClose () {
        $('#alertDiv').hide();
    }
};