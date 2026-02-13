import { BakongKHQR, khqrData, IndividualInfo, MerchantInfo, SourceInfo } from "bakong-khqr";


// @ts-ignore
const individualInfo = new IndividualInfo(
    "hongchray_song@aclb",
    "Bakong Payment",
    "PHNOM PENH",
);
const BAKONG_API_URL = "https://api-bakong.nbc.gov.kh";
const API_CHECK_PAYMENT_URL =  BAKONG_API_URL + "/v1/check_transaction_by_md5";
const BAKONG_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiYjFkZjU2Mjg0OGMxNDUwOSJ9LCJpYXQiOjE3NzA4NjI2NDIsImV4cCI6MTc3ODYzODY0Mn0.4o2XqxTBN54lstJcxMkIeyiTtRdgzBTVMojlWpCFW_Y"

export { individualInfo, BakongKHQR ,API_CHECK_PAYMENT_URL,BAKONG_TOKEN};    

