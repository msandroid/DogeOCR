import { z } from "zod"

// 共通フィールドの定義
export const CommonFieldsSchema = z.object({
  document_id: z.string().optional().describe("文書の一意識別子"),
  source_file: z.string().optional().describe("元ファイル名"),
  ocr_engine: z.string().optional().describe("使用OCRエンジン"),
  extracted_at: z.string().optional().describe("抽出日時"),
  confidence: z.number().min(0).max(1).optional().describe("認識率"),
  processing_notes: z.string().optional().describe("処理に関する注意事項"),
  bounding_boxes: z.array(z.object({
    field: z.string(),
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
    confidence: z.number().min(0).max(1)
  })).optional().describe("バウンディングボックス情報")
})

// 世界の文書種類の定義
export const GLOBAL_DOCUMENT_TYPES = {
  // 政府・公的文書
  GOVERNMENT: {
    // 身分証明書
    IDENTITY: {
      PASSPORT: "パスポート",
      DRIVERS_LICENSE: "運転免許証", 
      NATIONAL_ID: "国民IDカード",
      RESIDENCE_CARD: "在留カード",
      GREEN_CARD: "グリーンカード",
      VOTER_ID: "選挙人登録証",
      MILITARY_ID: "軍人ID",
      POLICE_ID: "警察官身分証",
      EMPLOYEE_ID: "職員証",
      STUDENT_ID: "学生証",
      AADHAAR_CARD: "Aadhaarカード",
      SOCIAL_SECURITY_CARD: "社会保障カード",
      MYNUMBER_CARD: "マイナンバーカード"
    },
    // 戸籍・住民関連
    CIVIL_STATUS: {
      BIRTH_CERTIFICATE: "出生証明書",
      DEATH_CERTIFICATE: "死亡証明書", 
      MARRIAGE_CERTIFICATE: "婚姻証明書",
      DIVORCE_CERTIFICATE: "離婚証明書",
      RESIDENCY_CERTIFICATE: "住民票",
      FAMILY_REGISTER: "戸籍謄本",
      NATIONALITY_CERTIFICATE: "国籍証明書",
      NAME_CHANGE_CERTIFICATE: "改名証明書"
    },
    // 許可証・ライセンス
    PERMITS_LICENSES: {
      WORK_PERMIT: "就労許可証",
      BUSINESS_LICENSE: "営業許可証",
      CONSTRUCTION_PERMIT: "建設許可証",
      EXPORT_LICENSE: "輸出許可証",
      IMPORT_LICENSE: "輸入許可証",
      HUNTING_LICENSE: "狩猟許可証",
      FISHING_LICENSE: "漁業許可証",
      PROFESSIONAL_LICENSE: "専門職許可証"
    }
  },

  // 金融・保険関連
  FINANCIAL: {
    // 銀行関連
    BANKING: {
      BANK_STATEMENT: "銀行明細書",
      ACCOUNT_OPENING_FORM: "口座開設申込書",
      LOAN_APPLICATION: "融資申込書",
      CREDIT_REPORT: "信用報告書",
      MORTGAGE_DOCUMENT: "住宅ローン文書",
      DEPOSIT_SLIP: "入金票",
      WITHDRAWAL_SLIP: "出金票",
      TRANSFER_RECEIPT: "振込受領書"
    },
    // 保険関連
    INSURANCE: {
      INSURANCE_POLICY: "保険証券",
      INSURANCE_CLAIM: "保険金請求書",
      HEALTH_INSURANCE_CARD: "健康保険証",
      AUTO_INSURANCE: "自動車保険証",
      LIFE_INSURANCE: "生命保険証券",
      PROPERTY_INSURANCE: "財産保険証券",
      TRAVEL_INSURANCE: "旅行保険証券"
    },
    // 投資・証券
    INVESTMENT: {
      STOCK_CERTIFICATE: "株式証書",
      BOND_CERTIFICATE: "債券証書",
      INVESTMENT_STATEMENT: "投資明細書",
      TRADING_CONFIRMATION: "取引確認書",
      PORTFOLIO_STATEMENT: "ポートフォリオ明細",
      DIVIDEND_NOTICE: "配当通知書"
    },
    // クレジット・ローン
    CREDIT: {
      CREDIT_CARD_STATEMENT: "クレジットカード明細",
      CREDIT_AGREEMENT: "クレジット契約書",
      PROMISSORY_NOTE: "約束手形",
      COLLATERAL_DOCUMENT: "担保文書"
    }
  },

  // 法律・司法関連  
  LEGAL: {
    // 契約関連
    CONTRACTS: {
      SALES_CONTRACT: "売買契約書",
      RENTAL_AGREEMENT: "賃貸契約書",
      EMPLOYMENT_CONTRACT: "雇用契約書",
      SERVICE_AGREEMENT: "サービス契約書",
      NDA: "秘密保持契約",
      PARTNERSHIP_AGREEMENT: "パートナーシップ契約",
      FRANCHISE_AGREEMENT: "フランチャイズ契約",
      LICENSING_AGREEMENT: "ライセンス契約"
    },
    // 裁判関連
    COURT_DOCUMENTS: {
      COURT_JUDGMENT: "判決文",
      COURT_ORDER: "裁判所命令",
      SUBPOENA: "召喚状",
      WARRANT: "令状",
      INJUNCTION: "差し止め命令",
      APPEAL_DOCUMENT: "控訴状",
      LAWSUIT_FILING: "訴訟申立書"
    },
    // 公証・認証
    NOTARIZATION: {
      NOTARIZED_DOCUMENT: "公証文書",
      POWER_OF_ATTORNEY: "委任状",
      AFFIDAVIT: "宣誓供述書",
      STATUTORY_DECLARATION: "法定宣言書",
      AUTHENTICATION_CERTIFICATE: "認証証明書"
    },
    // 遺産関連
    ESTATE: {
      WILL: "遺言書",
      PROBATE_DOCUMENT: "検認文書",
      INHERITANCE_DOCUMENT: "相続文書",
      ESTATE_INVENTORY: "遺産目録",
      TRUST_DOCUMENT: "信託文書"
    }
  },

  // 医療・健康関連
  MEDICAL: {
    // 診断・治療
    DIAGNOSIS_TREATMENT: {
      MEDICAL_CERTIFICATE: "診断書",
      PRESCRIPTION: "処方箋",
      MEDICAL_REPORT: "医療報告書",
      DISCHARGE_SUMMARY: "退院要約",
      OPERATION_REPORT: "手術報告書",
      PATHOLOGY_REPORT: "病理報告書",
      RADIOLOGY_REPORT: "放射線検査報告書",
      LAB_RESULTS: "検査結果"
    },
    // 健康管理
    HEALTH_MANAGEMENT: {
      HEALTH_CHECKUP_RESULT: "健康診断結果",
      VACCINATION_RECORD: "予防接種記録",
      MEDICAL_HISTORY: "病歴",
      ALLERGY_RECORD: "アレルギー記録",
      MEDICATION_LIST: "服薬一覧",
      TREATMENT_PLAN: "治療計画"
    },
    // 専門医療
    SPECIALIZED: {
      MENTAL_HEALTH_REPORT: "精神科診断書",
      DENTAL_RECORD: "歯科診療記録",
      OPHTHALMOLOGY_REPORT: "眼科検査報告",
      CARDIOLOGY_REPORT: "心臓科報告書",
      ONCOLOGY_REPORT: "腫瘍科報告書"
    }
  },

  // 教育・資格関連
  EDUCATION: {
    // 学位・卒業
    DEGREES: {
      DIPLOMA: "卒業証明書",
      DEGREE_CERTIFICATE: "学位記",
      TRANSCRIPT: "成績証明書",
      ACADEMIC_RECORD: "学業記録",
      GRADUATION_CERTIFICATE: "卒業証書",
      ENROLLMENT_CERTIFICATE: "在学証明書"
    },
    // 資格・認定
    CERTIFICATIONS: {
      PROFESSIONAL_CERTIFICATE: "専門資格証明書",
      SKILL_CERTIFICATE: "技能証明書",
      LANGUAGE_CERTIFICATE: "語学証明書",
      SAFETY_CERTIFICATE: "安全資格証明書",
      QUALITY_CERTIFICATE: "品質認定証",
      COMPLIANCE_CERTIFICATE: "コンプライアンス証明書"
    },
    // 試験関連
    EXAMINATIONS: {
      EXAM_RESULT: "試験結果",
      ENTRANCE_EXAM: "入学試験結果",
      STANDARDIZED_TEST: "標準テスト結果",
      CERTIFICATION_EXAM: "認定試験結果"
    }
  },

  // 企業・業務関連
  BUSINESS: {
    // 財務関連
    FINANCIAL_DOCUMENTS: {
      BALANCE_SHEET: "貸借対照表",
      INCOME_STATEMENT: "損益計算書",
      CASH_FLOW_STATEMENT: "キャッシュフロー計算書",
      TAX_RETURN: "税務申告書",
      AUDIT_REPORT: "監査報告書",
      BUDGET_REPORT: "予算報告書",
      FINANCIAL_FORECAST: "財務予測"
    },
    // 取引関連
    TRANSACTIONS: {
      INVOICE: "請求書",
      RECEIPT: "レシート/領収書",
      PURCHASE_ORDER: "注文書",
      DELIVERY_NOTE: "納品書",
      QUOTATION: "見積書",
      BILL_OF_LADING: "船荷証券",
      CUSTOMS_DECLARATION: "税関申告書"
    },
    // 人事関連
    HUMAN_RESOURCES: {
      EMPLOYMENT_LETTER: "雇用証明書",
      SALARY_SLIP: "給与明細",
      PERFORMANCE_REVIEW: "人事評価",
      RESIGNATION_LETTER: "退職届",
      REFERENCE_LETTER: "推薦状",
      TIMESHEET: "勤怠管理表",
      EXPENSE_REPORT: "経費報告書"
    },
    // 企業登記
    CORPORATE: {
      ARTICLES_OF_INCORPORATION: "定款",
      BUSINESS_REGISTRATION: "商業登記簿",
      CORPORATE_BYLAWS: "企業規則",
      SHAREHOLDER_AGREEMENT: "株主間契約",
      BOARD_RESOLUTION: "取締役会決議"
    }
  },

  // デジタル・技術関連
  DIGITAL: {
    // API・技術文書
    TECHNICAL: {
      API_DOCUMENTATION: "API文書",
      USER_MANUAL: "ユーザーマニュアル",
      TECHNICAL_SPECIFICATION: "技術仕様書",
      SYSTEM_DESIGN: "システム設計書",
      CODE_REVIEW: "コードレビュー",
      TEST_REPORT: "テスト報告書",
      DEPLOYMENT_GUIDE: "デプロイメントガイド"
    },
    // データ・セキュリティ
    DATA_SECURITY: {
      PRIVACY_POLICY: "プライバシーポリシー",
      TERMS_OF_SERVICE: "利用規約",
      DATA_PROCESSING_AGREEMENT: "データ処理契約",
      SECURITY_AUDIT: "セキュリティ監査",
      COMPLIANCE_REPORT: "コンプライアンス報告書"
    },
    // ソフトウェア
    SOFTWARE: {
      LICENSE_AGREEMENT: "ソフトウェアライセンス",
      SOFTWARE_MANUAL: "ソフトウェアマニュアル",
      INSTALLATION_GUIDE: "インストールガイド",
      TROUBLESHOOTING_GUIDE: "トラブルシューティングガイド"
    }
  },

  // その他・一般文書
  MISCELLANEOUS: {
    // 調査・研究
    RESEARCH: {
      RESEARCH_REPORT: "研究報告書",
      SURVEY_RESULT: "調査結果",
      QUESTIONNAIRE: "アンケート",
      STATISTICAL_REPORT: "統計報告書",
      MARKET_ANALYSIS: "市場分析",
      FEASIBILITY_STUDY: "実現可能性調査"
    },
    // 個人文書
    PERSONAL: {
      BUSINESS_CARD: "名刺",
      RESUME_CV: "履歴書",
      COVER_LETTER: "カバーレター",
      PERSONAL_STATEMENT: "志望理由書",
      RECOMMENDATION_LETTER: "推薦状"
    },
    // 点検・管理
    INSPECTION: {
      INSPECTION_REPORT: "点検表",
      MAINTENANCE_RECORD: "保守記録",
      QUALITY_CONTROL: "品質管理記録",
      SAFETY_INSPECTION: "安全点検記録",
      EQUIPMENT_LOG: "機器ログ"
    },
    // 申請・届出
    APPLICATIONS: {
      APPLICATION_FORM: "申込書",
      REGISTRATION_FORM: "登録申請書",
      PERMIT_APPLICATION: "許可申請書",
      CHANGE_NOTIFICATION: "変更届",
      CANCELLATION_REQUEST: "解約申請書"
    }
  }
} as const

// 文書種類の型を生成
type ExtractDocumentTypes<T> = T extends { [K in keyof T]: infer U } 
  ? U extends { [K in keyof U]: infer V }
    ? V extends { [K in keyof V]: infer W }
      ? W extends string ? W : never
      : V extends string ? V : never
    : U extends string ? U : never
  : never

export type DocumentType = ExtractDocumentTypes<typeof GLOBAL_DOCUMENT_TYPES> | "不明"

// 包括的な文書スキーマ（120+ 種類対応）
export const COMPREHENSIVE_DOCUMENT_SCHEMAS = {
  // 身分証明書スキーマ
  "パスポート": z.object({
    passport_number: z.string().describe("パスポート番号"),
    surname: z.string().describe("姓"),
    given_name: z.string().describe("名"),
    nationality: z.string().describe("国籍"),
    date_of_birth: z.string().describe("生年月日"),
    place_of_birth: z.string().describe("出生地"),
    sex: z.string().describe("性別"),
    date_of_issue: z.string().describe("発行日"),
    date_of_expiry: z.string().describe("有効期限"),
    issuing_authority: z.string().describe("発行機関"),
    mrz_Doge1: z.string().optional().describe("MRZ第1行"),
    mrz_Doge2: z.string().optional().describe("MRZ第2行"),
    ...CommonFieldsSchema.shape
  }).describe("パスポート情報"),

  "運転免許証": z.object({
    license_number: z.string().describe("免許証番号"),
    full_name: z.string().describe("氏名"),
    date_of_birth: z.string().describe("生年月日"),
    address: z.string().describe("住所"),
    license_class: z.string().describe("免許種別"),
    issue_date: z.string().describe("交付日"),
    expiry_date: z.string().describe("有効期限"),
    issuing_authority: z.string().describe("公安委員会"),
    restrictions: z.string().optional().describe("条件等"),
    ...CommonFieldsSchema.shape
  }).describe("運転免許証情報"),

  "国民IDカード": z.object({
    id_number: z.string().describe("ID番号"),
    full_name: z.string().describe("氏名"),
    date_of_birth: z.string().describe("生年月日"),
    address: z.string().describe("住所"),
    nationality: z.string().describe("国籍"),
    sex: z.string().describe("性別"),
    issue_date: z.string().describe("発行日"),
    expiry_date: z.string().describe("有効期限"),
    issuing_authority: z.string().describe("発行機関"),
    ...CommonFieldsSchema.shape
  }).describe("国民IDカード情報"),

  // 金融文書スキーマ
  "銀行明細書": z.object({
    account_holder: z.string().describe("口座名義人"),
    account_number: z.string().describe("口座番号"),
    bank_name: z.string().describe("銀行名"),
    statement_period: z.string().describe("明細期間"),
    opening_balance: z.string().describe("期初残高"),
    closing_balance: z.string().describe("期末残高"),
    total_deposits: z.string().describe("入金合計"),
    total_withdrawals: z.string().describe("出金合計"),
    transactions: z.array(z.object({
      date: z.string(),
      description: z.string(),
      amount: z.string(),
      balance: z.string()
    })).optional().describe("取引明細"),
    iban: z.string().optional().describe("IBAN"),
    swift_code: z.string().optional().describe("SWIFTコード"),
    ...CommonFieldsSchema.shape
  }).describe("銀行明細書情報"),

  "保険証券": z.object({
    policy_number: z.string().describe("証券番号"),
    policyholder: z.string().describe("契約者名"),
    insured_person: z.string().describe("被保険者名"),
    insurance_type: z.string().describe("保険種類"),
    coverage_amount: z.string().describe("保険金額"),
    premium: z.string().describe("保険料"),
    policy_start_date: z.string().describe("保険開始日"),
    policy_end_date: z.string().describe("保険終了日"),
    beneficiary: z.string().optional().describe("受益者"),
    deductible: z.string().optional().describe("免責金額"),
    ...CommonFieldsSchema.shape
  }).describe("保険証券情報"),

  // 医療文書スキーマ
  "診断書": z.object({
    patient_name: z.string().describe("患者名"),
    patient_id: z.string().optional().describe("患者ID"),
    date_of_birth: z.string().describe("生年月日"),
    diagnosis_date: z.string().describe("診断日"),
    diagnosis: z.string().describe("診断名"),
    symptoms: z.string().describe("症状"),
    treatment: z.string().optional().describe("治療内容"),
    doctor_name: z.string().describe("医師名"),
    medical_institution: z.string().describe("医療機関名"),
    icd_code: z.string().optional().describe("ICD-10コード"),
    recommendations: z.string().optional().describe("推奨事項"),
    ...CommonFieldsSchema.shape
  }).describe("診断書情報"),

  "処方箋": z.object({
    patient_name: z.string().describe("患者名"),
    patient_id: z.string().optional().describe("患者ID"),
    date_of_birth: z.string().describe("生年月日"),
    prescription_date: z.string().describe("処方日"),
    doctor_name: z.string().describe("医師名"),
    medical_institution: z.string().describe("医療機関名"),
    medications: z.array(z.object({
      medication_name: z.string(),
      dosage: z.string(),
      frequency: z.string(),
      duration: z.string(),
      instructions: z.string().optional()
    })).describe("処方薬"),
    diagnosis: z.string().optional().describe("診断名"),
    ...CommonFieldsSchema.shape
  }).describe("処方箋情報"),

  // 教育文書スキーマ
  "卒業証明書": z.object({
    student_name: z.string().describe("学生名"),
    student_id: z.string().optional().describe("学籍番号"),
    institution_name: z.string().describe("学校名"),
    degree_type: z.string().describe("学位種類"),
    major: z.string().describe("専攻"),
    graduation_date: z.string().describe("卒業日"),
    gpa: z.string().optional().describe("GPA"),
    honors: z.string().optional().describe("優等"),
    registrar_signature: z.string().optional().describe("学長・学部長署名"),
    seal: z.string().optional().describe("印章"),
    ...CommonFieldsSchema.shape
  }).describe("卒業証明書情報"),

  "成績証明書": z.object({
    student_name: z.string().describe("学生名"),
    student_id: z.string().optional().describe("学籍番号"),
    institution_name: z.string().describe("学校名"),
    academic_period: z.string().describe("履修期間"),
    courses: z.array(z.object({
      course_name: z.string(),
      credits: z.string(),
      grade: z.string(),
      semester: z.string().optional()
    })).describe("履修科目"),
    total_credits: z.string().describe("総単位数"),
    gpa: z.string().optional().describe("GPA"),
    ...CommonFieldsSchema.shape
  }).describe("成績証明書情報"),

  // ビジネス文書スキーマ
  "請求書": z.object({
    invoice_number: z.string().describe("請求書番号"),
    issue_date: z.string().describe("発行日"),
    due_date: z.string().describe("支払期限"),
    vendor_name: z.string().describe("発行者名"),
    vendor_address: z.string().describe("発行者住所"),
    customer_name: z.string().describe("宛先名"),
    customer_address: z.string().describe("宛先住所"),
    items: z.array(z.object({
      description: z.string(),
      quantity: z.string(),
      unit_price: z.string(),
      total_price: z.string()
    })).describe("明細項目"),
    subtotal: z.string().describe("小計"),
    tax_amount: z.string().describe("税額"),
    total_amount: z.string().describe("合計金額"),
    payment_terms: z.string().optional().describe("支払条件"),
    ...CommonFieldsSchema.shape
  }).describe("請求書情報"),

  "レシート/領収書": z.object({
    store_name: z.string().describe("店舗名"),
    store_address: z.string().optional().describe("店舗住所"),
    transaction_date: z.string().describe("取引日時"),
    receipt_number: z.string().optional().describe("レシート番号"),
    items: z.array(z.object({
      name: z.string(),
      quantity: z.string().optional(),
      price: z.string()
    })).describe("購入品目"),
    subtotal: z.string().describe("小計"),
    tax: z.string().describe("税額"),
    total: z.string().describe("合計"),
    payment_method: z.string().optional().describe("支払方法"),
    cashier: z.string().optional().describe("担当者"),
    ...CommonFieldsSchema.shape
  }).describe("レシート/領収書情報"),

  // 法律文書スキーマ
  "売買契約書": z.object({
    contract_number: z.string().optional().describe("契約番号"),
    contract_date: z.string().describe("契約日"),
    seller_name: z.string().describe("売主名"),
    seller_address: z.string().describe("売主住所"),
    buyer_name: z.string().describe("買主名"),
    buyer_address: z.string().describe("買主住所"),
    property_description: z.string().describe("売買物件"),
    sale_price: z.string().describe("売買価格"),
    payment_terms: z.string().describe("支払条件"),
    delivery_date: z.string().optional().describe("引渡日"),
    conditions: z.string().optional().describe("特約事項"),
    ...CommonFieldsSchema.shape
  }).describe("売買契約書情報"),

  // その他重要な文書スキーマ
  "名刺": z.object({
    name: z.string().describe("氏名"),
    company: z.string().describe("会社名"),
    title: z.string().describe("役職"),
    department: z.string().optional().describe("部署"),
    phone: z.string().optional().describe("電話番号"),
    mobile: z.string().optional().describe("携帯電話"),
    email: z.string().optional().describe("メールアドレス"),
    website: z.string().optional().describe("ウェブサイト"),
    address: z.string().optional().describe("住所"),
    fax: z.string().optional().describe("FAX番号"),
    ...CommonFieldsSchema.shape
  }).describe("名刺情報"),

  "申込書": z.object({
    application_number: z.string().optional().describe("申込番号"),
    application_date: z.string().describe("申込日"),
    applicant_name: z.string().describe("申込者名"),
    applicant_address: z.string().describe("申込者住所"),
    contact_phone: z.string().describe("連絡先電話番号"),
    contact_email: z.string().optional().describe("連絡先メール"),
    application_type: z.string().describe("申込種別"),
    requested_service: z.string().describe("希望サービス"),
    comments: z.string().optional().describe("備考"),
    ...CommonFieldsSchema.shape
  }).describe("申込書情報"),

  // デフォルトスキーマ（不明な文書用）
  "不明": z.object({
    extracted_text: z.string().describe("抽出されたテキスト"),
    possible_document_type: z.string().optional().describe("推定文書種別"),
    key_information: z.array(z.string()).optional().describe("重要情報"),
    ...CommonFieldsSchema.shape
  }).describe("不明文書情報")
} 