const paystack = (request) => {
    const MySecretKey = 'sk_test_7d8bd7f577d240c50cb5bb727c36b257ec1ff90f';

    const intPayment = (form, mycallback) => {
        const options = {
            url: 'https://api.paystack.co/transaction/initialize',
            headers: {
                authorization: MySecretKey,
                'content-type': 'application/json',
                'cache-control': 'no-cache'
            },
            form
        }
        const callback = (error, response, body) => {
            return mycallback(error, body);
        }
        request.post(options, callback);
    }

    const verifyPayment = (ref, mycallback) => {
        const option = {
            url: 'https://api.paystack.co/transaction/verify/'+ encodeURIComponent(ref),
            headers: {
                authorization: MySecretKey,
                'content-type': 'application/json',
                'cache-control': 'no-cache'
            }
        }
        const callback = (error, response, body) => {
            return mycallback(error, body);
        }
        request(option, callback);
    }
    return { intPayment, verifyPayment };
}

module.exports = paystack