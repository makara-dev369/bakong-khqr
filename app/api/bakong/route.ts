
import {  individualInfo ,BakongKHQR ,API_CHECK_PAYMENT_URL,BAKONG_TOKEN} from "../../lip/bakong";
import  { khqrData } from "bakong-khqr";
export async function POST(req: Request) {
    const optionalData = {
        // @ts-ignore
        currency: khqrData.currency.usd,
        amount: 0.01,
        billNumber: `TXN-${Date.now()}`,
        mobileNumber: "855976168988",
        storeLabel: "Bakong Payment",
        terminalLabel: "BakongPaymentAdmin",
        expirationTimestamp: Date.now() + 1 * 60 * 1000,
        merchantCategoryCode: "5999",
    };
    const info = {...individualInfo, ...optionalData};
    const KHQR = new BakongKHQR();
    const individual = await KHQR.generateIndividual(info); 
    // @ts-ignore
    const qr = individual?.data?.qr;
    // @ts-ignore
    const md5 = individual?.data?.md5;  
    return Response.json({
        qr:  qr,
        md5: md5,
    });
}

export async function PUT(req: Request) {
    const { md5 } = await req.json();
    if (!md5) {
        return Response.json({ error: "MD5 parameter is required" }, { status: 400 });
    }
    const fetchOptions = {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + BAKONG_TOKEN,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ md5: md5 }),
    };
    const res = await fetch(API_CHECK_PAYMENT_URL, fetchOptions);
    const data = await res.json();
    return Response.json({
       data,
    });
}