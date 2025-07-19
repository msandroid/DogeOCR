/**
 * 年齢確認機能のテストスクリプト
 */

const testCases = [
  {
    name: "18歳以上の成人",
    birthDate: "1990-01-01",
    expectedIsAdult: true,
    expectedAge: 34
  },
  {
    name: "18歳ちょうど（誕生日当日）",
    birthDate: "2006-01-15", // 2024年1月15日時点で18歳
    expectedIsAdult: true,
    expectedAge: 18
  },
  {
    name: "17歳の未成年",
    birthDate: "2007-01-01",
    expectedIsAdult: false,
    expectedAge: 17
  },
  {
    name: "18歳になる前日",
    birthDate: "2006-01-16", // 2024年1月15日時点で17歳
    expectedIsAdult: false,
    expectedAge: 17
  },
  {
    name: "様々な日付形式テスト1",
    birthDate: "1995/03/15",
    expectedIsAdult: true,
    expectedAge: 29
  },
  {
    name: "様々な日付形式テスト2",
    birthDate: "1995年3月15日",
    expectedIsAdult: true,
    expectedAge: 29
  },
  {
    name: "様々な日付形式テスト3",
    birthDate: "03/15/1995",
    expectedIsAdult: true,
    expectedAge: 29
  },
  {
    name: "無効な日付形式",
    birthDate: "invalid-date",
    expectedIsAdult: false,
    expectedAge: 0
  }
];

async function testAgeVerification() {
  console.log("🧪 年齢確認機能のテストを開始します...\n");

  let passedTests = 0;
  let totalTests = testCases.length;

  for (const testCase of testCases) {
    console.log(`📋 テスト: ${testCase.name}`);
    console.log(`   生年月日: ${testCase.birthDate}`);
    
    try {
      const response = await fetch("http://localhost:3000/api/id-verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentImage: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=",
          selfieImage: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=",
          userInfo: {
            birthDate: testCase.birthDate
          }
        }),
      });

      const data = await response.json();
      
      if (data.success && data.data.ageVerification) {
        const ageVerification = data.data.ageVerification;
        
        // 年齢確認結果の検証
        const isAdultMatch = ageVerification.isAdult === testCase.expectedIsAdult;
        const ageMatch = ageVerification.age === testCase.expectedAge;
        
        if (isAdultMatch && ageMatch) {
          console.log(`   ✅ 成功`);
          console.log(`      期待値: 成人=${testCase.expectedIsAdult}, 年齢=${testCase.expectedAge}`);
          console.log(`      実際値: 成人=${ageVerification.isAdult}, 年齢=${ageVerification.age}`);
          console.log(`      理由: ${ageVerification.reason}`);
          passedTests++;
        } else {
          console.log(`   ❌ 失敗`);
          console.log(`      期待値: 成人=${testCase.expectedIsAdult}, 年齢=${testCase.expectedAge}`);
          console.log(`      実際値: 成人=${ageVerification.isAdult}, 年齢=${ageVerification.age}`);
        }
      } else {
        console.log(`   ❌ API呼び出し失敗: ${data.error || "不明なエラー"}`);
      }
    } catch (error) {
      console.log(`   ❌ エラー: ${error.message}`);
    }
    
    console.log(""); // 空行
  }

  console.log(`📊 テスト結果: ${passedTests}/${totalTests} テストが成功`);
  console.log(`成功率: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  
  if (passedTests === totalTests) {
    console.log("🎉 すべてのテストが成功しました！");
  } else {
    console.log("⚠️  一部のテストが失敗しました。");
  }
}

// テスト実行
if (require.main === module) {
  testAgeVerification().catch(console.error);
}

module.exports = { testAgeVerification }; 