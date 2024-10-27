import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import api from '../services/api';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";


const AnalysisReport = () => {
  const [permissions, setPermissions] = useState({
    can_access_analysis_report: false,
    can_download: false,
  });

  const isJavaScriptEnabled = typeof window !== "undefined" && window.document;

  if (!isJavaScriptEnabled) {
    alert("Please enable JavaScript to view this document");
  }
  // const [isAdmin, setIsAdmin] = useState(false);

  const pdf_fileId = '1Q_H5GOf_vItuE-OqHaeLhvRfQ8tvchnf'; 
  const pdf_downloadUrl = `https://drive.google.com/uc?id=${pdf_fileId}&export=download`;

  const xlsx_fileId = '2PACX-1vRQcIJl_fvoKRR8Ke3EUP9psxIjj3Z7lyv6WmAaGd1E2uUpxuwLdiboeikVEx5ZVw';  
  const xlsx_downloadUrl = `https://docs.google.com/spreadsheets/d/1iXlrPlE3p4svjFvURwIbqfPMGm3iekT3/export?format=xlsx`;  
   
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const user_id = localStorage.getItem('id');
        if (token) {
          const response = await api.get(`/user_permissions/${user_id}`);
          // setIsAdmin(response.data.is_admin);
          setPermissions({
            can_access_budget_analysis: response.data.can_access_budget_analysis,
            can_access_accounts: response.data.can_access_accounts,
            can_access_analysis_report: response.data.can_access_analysis_report,
            can_download: response.data.can_download,
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">Analysis Report</h2>
      {/* <p>This page is accessible to users with the correct permission.</p> */}

      {/* Tabs for switching between Excel and PDF views */}
      <Tabs>
        <TabList>
        <Tab>Yearly Report</Tab>
        <Tab>Analysis Report</Tab>
        </TabList>


        {/* Tab for the PDF Report */}
        <TabPanel>
          <h3>Yearly- PDF Report</h3>

            {permissions.can_access_analysis_report ? (
           <div>
            <iframe 
                src={`Drewry.pdf`} 
                allow="autoplay" 
                width="100%" 
                height="500" 
                style={{
                    border: '1px solid #000', 
                    borderRadius: '3px', 
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)'
                }}>
            </iframe>

            {permissions.can_download && (
                <a
                    href={pdf_downloadUrl} // Set the download URL here
                    download
                    className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Download
                </a>
            )}
        </div>
             
          ) : (
            <p>Loading...</p>
          )}
        </TabPanel>

               {/* Tab for the Excel Template */}
               <TabPanel>
          <h3>Analysis - Excel Report</h3>

          {permissions.can_access_analysis_report ? (
           <div>
   
            <iframe 
              src={`https://docs.google.com/spreadsheets/d/e/${xlsx_fileId}/pubhtml?widget=true&headers=false`} // Use the loaded Excel data URL
              width="100%" 
              height="500" 
              style={{
                border: '1px solid #000', 
                borderRadius: '3px', 
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)'
              }}>
            </iframe>
     
            {permissions.can_download && (
                <a
                    href={xlsx_downloadUrl} // Set the download URL here
                    download
                    className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Download
                </a>
            )}
        </div>
             
   
          ) : (
            <p>Loading...</p>
          )}
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default AnalysisReport;
