import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import CollapsibleTable from '../components/CollapsibleTable';
import React, { useState, useEffect } from 'react';
import { getUserPermissions } from '../services/api';
import Box from '@mui/material/Box';

const BudgetAnalysisReport = ({ budgetCatData, budgetSubcatData, eventSubcatData, nonBudgetSubcatData, nonBudgetCatData }) => {
 
  const [allow, setAllow] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0); // Track the selected tab index
 
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const user_id = localStorage.getItem('id');
        if (token) {
          const response = await getUserPermissions(user_id);
          setAllow(response.data.can_download);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div>
      
      {/* <h2 className="text-2xl font-bold pb-5">Budget Analysis - Report View</h2> */}
      <Tabs selectedIndex={selectedIndex} onSelect={index => setSelectedIndex(index)}>
        <TabList style={{ backgroundColor: 'white',boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)'}}>
          <Tab style={{ backgroundColor: selectedIndex === 0 ? '#041085' : 'white', color: selectedIndex === 0 ? 'white' : 'black',boxShadow: selectedIndex === 0 ? '0px 4px 10px rgba(0, 0, 0, 0.2)' : 'none' }}>
            Budget Categories
          </Tab>
          <Tab style={{ backgroundColor: selectedIndex === 1 ? '#041085' : 'white', color: selectedIndex === 1 ? 'white' : 'black',boxShadow: selectedIndex === 0 ? '0px 4px 10px rgba(0, 0, 0, 0.2)' : 'none' }}>
            Additional Categories
          </Tab>
          <Tab style={{ backgroundColor: selectedIndex === 2 ? '#041085' : 'white', color: selectedIndex === 2 ? 'white' : 'black',boxShadow: selectedIndex === 0 ? '0px 4px 10px rgba(0, 0, 0, 0.2)' : 'none' }}>
            Event Categories
          </Tab>
        </TabList>

        {/* Tab for the Excel Template */}
        <TabPanel>
        <Box sx={{
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: 2,
            padding: 2,
          }}>
          <h2 className="text-1xl font-bold pb-5 pt-2">Category level per month</h2>
          <div>
            {(budgetCatData.length === 0) ? (
              <p className="text-red-500 pl-5">Loading...</p>
            ) : (
              <CollapsibleTable data={budgetCatData} allow={allow}/>
            )}
          </div>
      {/* Horizontal Divider */}
      <hr className="my-6 border-gray-200" />
          <h2 className="text-1xl font-bold pb-5 pt-5">Sub-Category level per month</h2>
          <div>
            {(budgetSubcatData.length === 0) ? (
              <p className="text-red-500 pl-5">Loading...</p>
            ) : (
              <CollapsibleTable data={budgetSubcatData} allow={allow}/>
            )}
          </div>
          </Box>
        </TabPanel>

        <TabPanel>
        <Box sx={{
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: 2,
            padding: 2,
          }}>
          <h2 className="text-1xl font-bold pb-5 pt-5">Category level per month</h2>
          <div>
            {(nonBudgetCatData.length === 0) ? (
              <p className="text-red-500 pl-5">Loading...</p>
            ) : (
              <CollapsibleTable data={nonBudgetCatData} allow={allow} />
            )}
          </div>
      {/* Horizontal Divider */}
      <hr className="my-6 border-gray-200" />
          <h2 className="text-1xl font-bold pb-5 pt-5">Sub-Category level per month</h2>
          <div>
            {(nonBudgetSubcatData.length === 0) ? (
              <p className="text-red-500 pl-5">Loading...</p>
            ) : (
              <CollapsibleTable data={nonBudgetSubcatData} allow={allow}/>
            )}
          </div>
          </Box>
        </TabPanel>

        {/* Tab for the PDF Report */}
        <TabPanel>
        <Box sx={{
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: 2,
            padding: 2,
          }}>
          <h2 className="text-1xl font-bold pb-5 pt-5">Sub-Category level per month</h2>
          <div>
            {(eventSubcatData.length === 0) ? (
              <p className="text-red-500 pl-5">Loading...</p>
            ) : (
              <CollapsibleTable data={eventSubcatData} allow={allow}/>
            )}
          </div>
          </Box>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default BudgetAnalysisReport;
