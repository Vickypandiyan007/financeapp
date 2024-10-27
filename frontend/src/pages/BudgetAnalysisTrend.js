import React from 'react';
import QuartilesLineChart from '../components/QuartilesLineChart';
import Box from '@mui/material/Box';

const BudgetAnalysisTrend = ({ plotlyMonthlyQuartilesData, plotlyYearlyQuartilesData }) => {
 
    return (
        <div>
            {/* <h2 className="text-2xl font-bold">Budget Analysis - Trend View</h2> */}
            <h2 className="text-1xl font-bold pb-5 pt-10">1. Monthly Trend - PER MONTH</h2>
            <div>
                {(plotlyMonthlyQuartilesData == []) ? (
                    <p className="text-red-500 pl-5">Data is Loading...</p>
                ) : (
                    <QuartilesLineChart data={plotlyMonthlyQuartilesData} />
                )}
            </div>
            <h2 className="text-1xl font-bold pb-5 pt-10">2. Yearly - PER MONTH</h2>
            <div>
                {(plotlyYearlyQuartilesData == []) ? (
                    <p className="text-red-500 pl-5">Data is Loading...</p>
                ) : (
                    <QuartilesLineChart data={plotlyYearlyQuartilesData} />
                )}
            </div>
        </div>
    );
};

export default BudgetAnalysisTrend;
