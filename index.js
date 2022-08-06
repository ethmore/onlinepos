const express = require('express');
const app = express();
const cors = require("cors")
const path = require('path');

app.use(express.json());
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

const port = 3000;

var Iyzipay = require('iyzipay');
const { resolve } = require('path');
const { rejects } = require('assert');

var iyzipay = new Iyzipay({
    apiKey: 'sandbox-YRwKlL0HkpRi9zqQbAdoiCp8rgxzUsU3',
    secretKey: 'sandbox-frqtNgiAOIIzR8Y7hmcpDK2FAUaozgBj',
    uri: 'https://sandbox-api.iyzipay.com'
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/views/main.html'));
});

app.get("/success", async (req, res) => {
    res.sendFile(path.join(__dirname + '/public/views/success.html'));
})

var str = ""

app.post("/buy", async (req, res) => {
    const { name, surname, email, phoneNumber, cardHolderName, cardNumber, cvv, month, year, threeds } = req.body;
    var countryphoneNumber = '+90' + phoneNumber

    if (threeds === true) {
        var request = {
            locale: Iyzipay.LOCALE.TR, //not necessary
            conversationId: '123456789',//not necessary
            price: '1',
            paidPrice: '1.2',
            currency: Iyzipay.CURRENCY.TRY,
            installment: '1',
            basketId: 'B67832',//not necessary
            paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,//not necessary
            paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,//not necessary
            callbackUrl: 'http://localhost:3000/callback',
            paymentCard: {
                cardHolderName: cardHolderName,
                cardNumber: cardNumber,
                expireMonth: month,
                expireYear: year,
                cvc: cvv,
                registerCard: '0'
            },
            buyer: {
                id: 'BY789',
                name: name,
                surname: surname,
                gsmNumber: countryphoneNumber,//not necessary
                email: email,
                identityNumber: '74300864791',
                registrationAddress: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
                ip: '85.34.78.112',
                city: 'Istanbul',
                country: 'Turkey',
            },
            shippingAddress: {
                contactName: 'Jane Doe',
                city: 'Istanbul',
                country: 'Turkey',
                address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
            },
            billingAddress: {
                contactName: 'Jane Doe',
                city: 'Istanbul',
                country: 'Turkey',
                address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
            },
            basketItems:
            [
                {
                    id: 'BI101',
                    name: 'Binocular',
                    category1: 'Collectibles',
                    itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
                    price: '0.3'
                },
                {
                    id: 'BI102',
                    name: 'Game code',
                    category1: 'Game',
                    itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
                    price: '0.5'
                },
                {
                    id: 'BI103',
                    name: 'Usb',
                    category1: 'Electronics',
                    itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
                    price: '0.2'
                }
            ]
        };

        try {
            iyzipay.threedsInitialize.create(request, function (err, result) {
                console.log(err, result);
                if (result.status === "success") {
                    var b64string = result.threeDSHtmlContent;
                    var buf = Buffer.from(b64string, 'base64'); // Ta-da
                    str = buf.toString('utf-8');

                    res.json({ html: str })
                } else {
                    res.json({ message: result.errorMessage })
                }
            });
        } catch (error) {
            console.log(error)
        }
    } else {
        console.log("wOut3DS")
        console.log(name, surname, email, phoneNumber, cardHolderName, cardNumber, cvv, month, year, threeds)

        var request = {
            locale: Iyzipay.LOCALE.TR, //not necessary
            conversationId: '123456789',//not necessary
            price: '1',
            paidPrice: '1.2',
            currency: Iyzipay.CURRENCY.TRY,
            installment: '1',
            basketId: 'B67832',//not necessary
            paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,//not necessary
            paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,//not necessary
            paymentCard: {
                cardHolderName: cardHolderName,
                cardNumber: cardNumber,
                expireMonth: month,
                expireYear: year,
                cvc: cvv,
                registerCard: '0'
            },
            buyer: {
                id: 'BY789',
                name: name,
                surname: surname,
                gsmNumber: countryphoneNumber,//not necessary
                email: email,
                identityNumber: '74300864791',
                registrationAddress: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
                ip: '85.34.78.112',
                city: 'Istanbul',
                country: 'Turkey',
            },
            shippingAddress: {
                contactName: 'Jane Doe',
                city: 'Istanbul',
                country: 'Turkey',
                address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
            },
            billingAddress: {
                contactName: 'Jane Doe',
                city: 'Istanbul',
                country: 'Turkey',
                address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
            },
            basketItems: 
            [
                {
                    id: 'BI101',
                    name: 'Binocular',
                    category1: 'Collectibles',
                    itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
                    price: '0.3'
                },
                {
                    id: 'BI102',
                    name: 'Game code',
                    category1: 'Game',
                    itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
                    price: '0.5'
                },
                {
                    id: 'BI103',
                    name: 'Usb',
                    category1: 'Electronics',
                    itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
                    price: '0.2'
                }
            ]
        };

        try {
            iyzipay.payment.create(request, function (err, result) {
                console.log(err, result);
                if (result.status === "success") {
                    res.json({ message: "Odeme Basarili" })
                } else {
                    res.json({ message: result.errorMessage })
                }
            });
        } catch (error) {
            console.log(error)
        }
    }

})



app.get('/3ds', (req, res) => {
    res.send(str)
})

app.post("/callback", async (req, res) => {
    console.log(req.body)
    if (req.body.status === "success") {
        iyzipay.threedsPayment.create({
            // conversationId: '123456789',
            // locale: Iyzipay.LOCALE.TR,
            paymentId: req.body.paymentId,
            conversationData: req.body.conversationData
        }, function (err, result) {
            console.log(err, result);
            if (result.status === "success") {
                str = ''
                res.sendFile(path.join(__dirname + '/public/views/success.html'));

            } else {
                str = ''
                res.sendFile(path.join(__dirname + '/public/views/fail.html'));
            }
        });
    } else {
        console.log(req.errorMessage)
        res.sendFile(path.join(__dirname + '/public/views/fail.html'));
    }

})

app.post("/binReq", async (req, res) => {
    const { cardNumber } = req.body
    const firstSixStr = String(cardNumber).slice(0, 6);
    const firstSixNum = Number(firstSixStr);

    iyzipay.binNumber.retrieve({
        // locale: Iyzipay.LOCALE.TR,
        // conversationId: '123456789',
        binNumber: firstSixNum
    }, function (err, result) {
        console.log("binRetreive")
        console.log(err, result);
    });

    iyzipay.installmentInfo.retrieve({
        // locale: Iyzipay.LOCALE.TR,
        // conversationId: '123456789',
        binNumber: firstSixNum,
        price: '100'
    }, function (err, result) {
        console.log("installmentInfo")
        console.log(err, result);
    });
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});