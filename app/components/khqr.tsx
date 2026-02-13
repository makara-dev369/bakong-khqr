'use client';

import Image from 'next/image';
import { QRCodeCanvas } from 'qrcode.react';

export default function PaymentQRCode({qrValue, polling, countdown, status, data}: {qrValue: string, polling: boolean, countdown: number, status: string, data: any}) {
  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  const isSuccess = status === "Success";
  const isTimeout = status === "Payment check timed out";

  const formatDate = (timestamp: number) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  return (
    <div className="grid grid-cols-2 justify-start gap-4 bg-gray-100 p-8 rounded-2xl">
      <div className="w-[320px] rounded-2xl bg-white shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-red-600 text-white text-center py-4 font-bold text-xl">
          KHQR
        </div>

        {/* Amount */}
        <div className="px-6 py-4 text-center">
          <p className="text-sm text-gray-500">Bakong Payment</p>
          <p className="text-3xl font-bold">
            40 <span className="text-sm font-normal">KHR</span>
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed mx-6" />

        {/* QR Code */}
        <div className="flex justify-center py-6">
          <div className="relative bg-white p-3">
            <QRCodeCanvas
              value={qrValue}
              size={200}
              level="H"
              includeMargin={false}
            />

            {/* Center logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
                $
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Status Panel */}
      <div className='border border-dashed border-gray-400 rounded-2xl p-8 flex flex-col items-center justify-center'>
        
        {/* Polling Status */}
        {polling && !isSuccess && (
          <div className="text-center space-y-4">
            <div className="animate-pulse">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </div>
            <p className="text-gray-700 font-medium">Checking payment status...</p>
            <p className="text-2xl font-bold text-blue-600">
              {formatCountdown(countdown)}
            </p>
            <p className="text-sm text-gray-500">Please complete payment</p>
          </div>
        )}

        {/* Success Status */}
        {isSuccess && (
          <div className="text-center space-y-4 animate-fade-in">
            <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <Image src="/check.png" alt="success" width={60} height={60} />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">Payment Successful!</p>
              <p className="text-sm text-gray-500 mt-2">Your transaction has been completed</p>
            </div>
            {/* Transaction Details */}
            <div className="bg-white rounded-lg p-4 space-y-3 text-sm">
              <h3 className="font-semibold text-gray-800 border-b pb-2">Transaction Details</h3>
              
              <div className="flex justify-between">
                <span className="text-gray-500">Amount:</span>
                <span className="font-semibold">{data.data.amount} {data.data.currency}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">From:</span>
                <span className="font-medium text-gray-700">{data.data.fromAccountId}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">To:</span>
                <span className="font-medium text-gray-700">{data.data.toAccountId}</span>
              </div>

              {data.data.description && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Description:</span>
                  <span className="font-medium text-gray-700">{data.data.description}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-500">Created:</span>
                <span className="font-medium text-gray-700">{formatDate(data.data.createdDateMs)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Completed:</span>
                <span className="font-medium text-gray-700">{formatDate(data.data.acknowledgedDateMs)}</span>
              </div>

              <div className="pt-2 border-t">
                <div className="flex justify-between items-start">
                  <span className="text-gray-500">Transaction Hash:</span>
                  <span className="font-mono text-xs text-gray-600 break-all text-right ml-2">
                    {data.data.hash}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Timeout Status */}
        {isTimeout && (
          <div className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <p className="text-xl font-bold text-red-600">Payment Timeout</p>
              <p className="text-sm text-gray-500 mt-2">Please generate a new QR code</p>
            </div>
          </div>
        )}

        {/* Other Status */}
        {status && !isSuccess && !isTimeout && !polling && (
          <div className="text-center space-y-2">
            <p className="text-gray-600">Status: {status}</p>
          </div>
        )}

      </div>
    </div>
  );
}