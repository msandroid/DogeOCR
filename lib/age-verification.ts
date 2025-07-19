/**
 * 年齢確認機能のユーティリティ関数
 */

export interface AgeVerificationResult {
  isAdult: boolean;
  age: number;
  birthDate: string;
  verificationDate: string;
  daysUntil18: number;
  reason: string;
}

/**
 * 生年月日から年齢を計算し、18歳以上かどうかを判定する
 * @param birthDateString 生年月日（YYYY-MM-DD形式）
 * @returns AgeVerificationResult
 */
export function verifyAge(birthDateString: string): AgeVerificationResult {
  try {
    const birthDate = new Date(birthDateString);
    const today = new Date();
    
    // 生年月日が有効な日付かチェック
    if (isNaN(birthDate.getTime())) {
      return {
        isAdult: false,
        age: 0,
        birthDate: birthDateString,
        verificationDate: today.toISOString().split('T')[0],
        daysUntil18: 0,
        reason: "無効な生年月日形式です"
      };
    }

    // 18歳の誕生日を計算
    const eighteenthBirthday = new Date(birthDate);
    eighteenthBirthday.setFullYear(birthDate.getFullYear() + 18);

    // 現在の日付と18歳の誕生日を比較
    const isAdult = today >= eighteenthBirthday;
    
    // 年齢を計算（正確な年齢）
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--; // まだ誕生日が来ていない場合
    }

    // 18歳になるまでの日数を計算
    let daysUntil18 = 0;
    if (!isAdult) {
      const timeDiff = eighteenthBirthday.getTime() - today.getTime();
      daysUntil18 = Math.ceil(timeDiff / (1000 * 3600 * 24));
    }

    return {
      isAdult,
      age,
      birthDate: birthDateString,
      verificationDate: today.toISOString().split('T')[0],
      daysUntil18,
      reason: isAdult ? "18歳以上の成人です" : `${daysUntil18}日後に18歳になります`
    };
  } catch (error) {
    return {
      isAdult: false,
      age: 0,
      birthDate: birthDateString,
      verificationDate: new Date().toISOString().split('T')[0],
      daysUntil18: 0,
      reason: "年齢計算中にエラーが発生しました"
    };
  }
}

/**
 * 複数の日付形式に対応した年齢確認
 * @param birthDateInput 生年月日（様々な形式に対応）
 * @returns AgeVerificationResult
 */
export function verifyAgeFlexible(birthDateInput: string): AgeVerificationResult {
  // 日付形式の正規化
  let normalizedDate = birthDateInput.trim();
  
  // 様々な日付形式に対応
  const datePatterns = [
    /^(\d{4})-(\d{1,2})-(\d{1,2})$/, // YYYY-MM-DD
    /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/, // YYYY/MM/DD
    /^(\d{4})年(\d{1,2})月(\d{1,2})日$/, // YYYY年MM月DD日
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, // MM/DD/YYYY
    /^(\d{1,2})-(\d{1,2})-(\d{4})$/, // MM-DD-YYYY
  ];

  for (const pattern of datePatterns) {
    const match = normalizedDate.match(pattern);
    if (match) {
      let year, month, day;
      
      if (pattern.source.includes('年')) {
        // YYYY年MM月DD日形式
        year = parseInt(match[1]);
        month = parseInt(match[2]);
        day = parseInt(match[3]);
      } else if (pattern.source.startsWith('^\\d{4}')) {
        // YYYY-MM-DD または YYYY/MM/DD形式
        year = parseInt(match[1]);
        month = parseInt(match[2]);
        day = parseInt(match[3]);
      } else {
        // MM/DD/YYYY または MM-DD-YYYY形式
        year = parseInt(match[3]);
        month = parseInt(match[1]);
        day = parseInt(match[2]);
      }

      // 月と日の妥当性チェック
      if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
        const normalizedDateString = `${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        return verifyAge(normalizedDateString);
      }
    }
  }

  // どの形式にもマッチしない場合
  return {
    isAdult: false,
    age: 0,
    birthDate: birthDateInput,
    verificationDate: new Date().toISOString().split('T')[0],
    daysUntil18: 0,
    reason: "認識できない日付形式です"
  };
}

/**
 * OCR結果から年齢確認を行う
 * @param ocrData OCRで抽出されたデータ
 * @returns AgeVerificationResult | null
 */
export function verifyAgeFromOCR(ocrData: any): AgeVerificationResult | null {
  const birthDate = ocrData?.birth_date || ocrData?.birthDate;
  
  if (!birthDate) {
    return null;
  }

  return verifyAgeFlexible(birthDate);
}

/**
 * 年齢確認結果を人間が読みやすい形式でフォーマット
 * @param result AgeVerificationResult
 * @returns フォーマットされた文字列
 */
export function formatAgeVerificationResult(result: AgeVerificationResult): string {
  if (result.isAdult) {
    return `✅ 成人確認完了\n年齢: ${result.age}歳\n生年月日: ${result.birthDate}\n確認日: ${result.verificationDate}`;
  } else {
    return `❌ 未成年です\n年齢: ${result.age}歳\n生年月日: ${result.birthDate}\n18歳まで: ${result.daysUntil18}日\n確認日: ${result.verificationDate}`;
  }
} 