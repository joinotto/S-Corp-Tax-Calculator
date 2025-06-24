
import React, { useState, useMemo, useEffect, useCallback } from 'react';
// Removed: import { Header } from './components/Header';
import { Slider } from './components/Slider';
import { Tooltip } from './components/Tooltip';
import { InfoIcon } from './components/Icons';
import { S_CORP_FEES, SELF_EMPLOYMENT_TAX_RATE, SE_TAXABLE_INCOME_MULTIPLIER, S_CORP_SALARY_SE_TAX_RATE } from './constants';

const formatCurrency = (value: number): string => {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

const App: React.FC = () => {
  const [netIncome, setNetIncome] = useState(100000); // Default to example values
  const [salary, setSalary] = useState(18000); // Default to example values
  // Removed: const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const totalSCorpCosts = useMemo(() => S_CORP_FEES.reduce((sum, fee) => sum + fee.amount, 0), []);

  const solePropTax = useMemo(() => netIncome * SE_TAXABLE_INCOME_MULTIPLIER * SELF_EMPLOYMENT_TAX_RATE, [netIncome]);
  const sCorpTax = useMemo(() => salary * S_CORP_SALARY_SE_TAX_RATE, [salary]);
  const taxSavings = useMemo(() => {
    const rawSavings = solePropTax - sCorpTax;
    return rawSavings > 0 ? rawSavings : 0;
  }, [solePropTax, sCorpTax]);
  
  const netSavingsAmount = useMemo(() => {
    const rawNetSavings = taxSavings - totalSCorpCosts;
    return rawNetSavings; 
  }, [taxSavings, totalSCorpCosts]);

  useEffect(() => {
    if (salary > netIncome) {
      setSalary(netIncome > 0 ? netIncome : 0);
    }
  }, [netIncome, salary]);
  
  const handleNetIncomeChange = useCallback((value: number) => {
    setNetIncome(value < 0 ? 0 : value);
  }, []);

  const handleSalaryChange = useCallback((value: number) => {
    const newSalary = value < 0 ? 0 : value;
    setSalary(newSalary > netIncome ? (netIncome > 0 ? netIncome: 0) : newSalary);
  }, [netIncome]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-gray-800">
      {/* Removed: <Header isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} /> */}
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-white pt-12 pb-6 md:pt-16 md:pb-8 text-center"> {/* Reduced bottom padding */}
          <div className="container mx-auto px-6 max-w-4xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              S-Corp Tax Calculator
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Estimate your potential tax savings by converting to an S-Corporation.
              Adjust the sliders below to see how your net income and salary affect your savings.
            </p>
          </div>
        </section>

        {/* Calculator Form Section */}
        <section className="pt-6 pb-12 md:pt-8 md:pb-16"> {/* Reduced top padding */}
          <div className="container mx-auto px-4">
            <form onSubmit={(e) => e.preventDefault()} className="max-w-6xl mx-auto">
              <div className="flex flex-wrap -mx-3">
                {/* Left Column: Questions & Savings */}
                <div className="w-full lg:w-1/2 px-3 mb-6 lg:mb-0">
                  <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg h-full flex flex-col">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-1">
                        Calculate Your S-Corp Savings
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">Input your yearly net income and a reasonable salary you would pay yourself.</p>

                    {/* Net Income Slider */}
                    <div className="mb-8">
                      <label htmlFor="net-income" className="block text-sm font-medium text-gray-700 mb-4"> {/* Increased margin to mb-4 */}
                        A) What is your estimated yearly net income?
                      </label>
                      <Slider
                        id="net-income"
                        min={0}
                        max={500000}
                        step={1000}
                        value={netIncome}
                        onChange={handleNetIncomeChange}
                        formatLabel={formatCurrency}
                      />
                       <div className="flex justify-between text-xs text-gray-500 mt-2 px-1">
                        <span>{formatCurrency(0)}</span>
                        <span>{formatCurrency(250000)}</span>
                        <span>{formatCurrency(500000)}</span>
                      </div>
                    </div>

                    {/* Salary Slider */}
                    <div className="mb-8">
                      <label htmlFor="salary" className="flex items-center text-sm font-medium text-gray-700 mb-4"> {/* Increased margin to mb-4 */}
                        B) What is the salary you would pay yourself?
                        <Tooltip text="A reasonable salary is required by the IRS. This amount is subject to payroll taxes. It cannot exceed net income. 50% of net income is often used as a starting estimate, but consult a tax professional.">
                          <InfoIcon className="w-4 h-4 ml-1.5 text-blue-500 cursor-help" />
                        </Tooltip>
                      </label>
                      <Slider
                        id="salary"
                        min={0}
                        max={netIncome > 0 ? netIncome : 1000} 
                        step={500}
                        value={salary}
                        onChange={handleSalaryChange}
                        formatLabel={formatCurrency}
                      />
                       <div className="flex justify-between text-xs text-gray-500 mt-2 px-1">
                        <span>{formatCurrency(0)}</span>
                        <span>{formatCurrency(Math.max(0, netIncome / 2))}</span>
                        <span>{formatCurrency(Math.max(0, netIncome))}</span>
                      </div>
                    </div>
                    
                    <div className="mt-auto">
                        {/* Tax Comparison */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 py-4 border-t border-b border-gray-200">
                          <div>
                            <h3 className="text-xs font-medium text-center text-gray-500 mb-1 uppercase tracking-wider">Self-Employment Tax <br/> (Sole Proprietor)</h3>
                            <p className="text-2xl lg:text-3xl font-bold text-center text-orange-600">{formatCurrency(solePropTax)}</p>
                          </div>
                          <div>
                            <h3 className="text-xs font-medium text-center text-gray-500 mb-1 uppercase tracking-wider">Payroll Tax on Salary <br/> (S-Corp)</h3>
                            <p className="text-2xl lg:text-3xl font-bold text-center text-teal-600">{formatCurrency(sCorpTax)}</p>
                          </div>
                        </div>
                        
                        {/* Total Savings */}
                        <div className="text-center bg-green-50 p-4 rounded-lg">
                          <p className="text-sm text-green-700 mb-1">Potential Tax Savings (Before S-Corp Costs)</p>
                          <p className="text-4xl lg:text-5xl font-extrabold text-green-600">{formatCurrency(taxSavings)}</p>
                        </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: S-Corp Costs & Net Savings */}
                <div className="w-full lg:w-1/2 px-3">
                  <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg h-full flex flex-col">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-1">
                        Understand Your Net Savings
                    </h2>
                     <p className="text-sm text-gray-500 mb-6">See your estimated net savings after S-Corp administration costs.</p>
                    
                    <div className="mb-6 flex-grow">
                      <h3 className="text-sm font-medium text-gray-700 mb-2 uppercase tracking-wider">Estimated First-Year S-Corp Costs:</h3>
                      <ul className="space-y-2 text-sm">
                        {S_CORP_FEES.map((fee, index) => (
                          <li key={index} className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-b-0">
                            <span className="text-gray-600">{fee.label}</span>
                            <span className="font-semibold text-gray-700">{formatCurrency(fee.amount)}</span>
                          </li>
                        ))}
                         <li className="flex justify-between items-center font-semibold border-t-2 border-gray-300 pt-2.5 mt-2.5">
                            <span className="text-gray-800 text-base">Total Estimated S-Corp Costs</span>
                            <span className="text-base text-red-600">{formatCurrency(totalSCorpCosts)}</span>
                          </li>
                      </ul>
                    </div>
                    
                    <div className="text-center bg-blue-50 p-4 rounded-lg mt-auto">
                        <p className="text-sm text-blue-700 mb-1">Estimated Net Savings (After S-Corp Costs)</p>
                        <p className={`text-4xl lg:text-5xl font-extrabold ${netSavingsAmount >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                            {formatCurrency(netSavingsAmount)}
                        </p>
                         <p className="text-xs text-gray-500 mt-2">*This is an estimate. Consult with a tax professional for advice specific to your situation.</p>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
