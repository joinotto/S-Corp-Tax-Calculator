// IRS standard rates
export const SELF_EMPLOYMENT_TAX_RATE = 0.153;         // 15.3% = 12.4% SS + 2.9% Medicare
export const SE_TAXABLE_INCOME_MULTIPLIER = 0.9235;     // 92.35% of net income is subject to SE tax
export const S_CORP_SALARY_SE_TAX_RATE = 0.153;         // S-Corp salary subject to same FICA tax

export interface Fee {
  label: string;
  amount: number;
}

export const S_CORP_FEES: Fee[] = [
  { label: "Initial state registration cost to form an LLC / S-Corp (if not already formed)", amount: 250 },
  { label: "Registered Agent Fee (if required)", amount: 25 },
  { label: "Annual cost of administering a payroll", amount: 250 },
  { label: "Annual state LLC / S-Corp registration fees", amount: 175 },
  { label: "Estimated Local Business tax", amount: 100 },
];