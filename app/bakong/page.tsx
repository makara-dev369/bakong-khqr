"use client"
import { useState, useEffect, useRef } from "react";
import PaymentQRCode from "../components/khqr";

export default function BakongPage() {
    const [qr, setQr] = useState("");
    const [md5, setMd5] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const [polling, setPolling] = useState(false);
    const [countdown, setCountdown] = useState(300);
    const [payment, setPayment] = useState<any>(null);
    const pollingIntervalRef =
    useRef<ReturnType<typeof setInterval> | null>(null);

    const countdownIntervalRef =
    useRef<ReturnType<typeof setInterval> | null>(null);

  const generateQR = async () => {
    setStatus("");
    setPayment(null);
    setLoading(true);
    const res = await fetch("/api/bakong", {
      method: "POST",
    });
    const data = await res.json();
    
    setTimeout(() => {
      setQr(data.qr);
      setMd5(data.md5);
      setLoading(false);
      startPolling(data.md5);
    }, 1000);
    
    return data;
  }

  const checkPaymentStatus = async (md5Value: string) => {
    // Use parameter instead of state
    const md5ToUse = md5Value || md5;
    if (!md5ToUse) return null;
    
    const res = await fetch("/api/bakong", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ md5: md5ToUse }),
    });
    const data = await res.json();
    if (data.data.responseMessage === "Success" ) {
        setStatus(data.data.responseMessage);
        setPayment(data.data);
        stopPolling();
    }
    
    return data;
  }

  const startPolling = (md5Value: string) => {
    setPolling(true);
    setCountdown(300);
    checkPaymentStatus(md5Value);
    
    pollingIntervalRef.current = setInterval(() => {
      checkPaymentStatus(md5Value);
    }, 3000); 

    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          stopPolling();
          setStatus("Payment check timed out");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  const stopPolling = () => {
    setPolling(false);
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  }

  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-5">
      <h1 className="text-3xl font-bold mb-5">Payment with Bakong</h1>
      
      <button onClick={generateQR} disabled={loading} className="bg-gray-500 text-white px-4 py-2 rounded-md">
        {loading ? "Loading" : "Generate QR"}
      </button>
      
      {loading && <p>Loading...</p>}
      
      {qr && (
        <div className="mt-5">
          <p className="text-center">Scan the QR code with your Bakong app to pay</p>
          <PaymentQRCode qrValue={qr} polling={polling} countdown={countdown} status={status} data={payment} />
        </div>
      )}
    </div>
  )
}