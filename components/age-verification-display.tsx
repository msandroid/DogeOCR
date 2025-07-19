import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface AgeVerificationData {
  isAdult: boolean;
  age: number;
  birthDate: string;
  verificationDate: string;
  daysUntil18: number;
  reason: string;
}

interface AgeVerificationDisplayProps {
  ageVerification: AgeVerificationData;
  className?: string;
}

export function AgeVerificationDisplay({ ageVerification, className }: AgeVerificationDisplayProps) {
  const { isAdult, age, birthDate, verificationDate, daysUntil18, reason } = ageVerification;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isAdult ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
          年齢確認結果
          <Badge variant={isAdult ? "default" : "destructive"}>
            {isAdult ? "成人" : "未成年"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">年齢:</span>
            <span className="ml-2">{age}歳</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">生年月日:</span>
            <span className="ml-2">{birthDate}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">確認日:</span>
            <span className="ml-2">{verificationDate}</span>
          </div>
          {!isAdult && (
            <div>
              <span className="font-medium text-gray-600">18歳まで:</span>
              <span className="ml-2">{daysUntil18}日</span>
            </div>
          )}
        </div>
        
        <div className="mt-4 p-3 rounded-lg bg-gray-50">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5" />
            <div className="text-sm text-gray-700">
              <span className="font-medium">判定理由:</span>
              <span className="ml-2">{reason}</span>
            </div>
          </div>
        </div>

        {!isAdult && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200">
            <div className="flex items-start gap-2">
              <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
              <div className="text-sm text-red-700">
                <span className="font-medium">注意:</span>
                <span className="ml-2">
                  未成年のため、KYC認証は完了できません。18歳になってから再度お試しください。
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 