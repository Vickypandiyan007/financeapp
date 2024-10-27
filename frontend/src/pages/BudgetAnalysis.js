import React, { useState, useEffect } from 'react';
import { getVesselTypes, getVesselSubtypes, filterInpuyts, filterReportData } from '../services/api';
import BudgetAnalysisTrend from './BudgetAnalysisTrend';
import BudgetAnalysisReport from './BudgetAnalysisReport';
import Slider from '@mui/material/Slider';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import BarChart from '../components/BarCharts';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box'; // Import Box from Material UI
import { ExpandMore, ExpandLess } from '@mui/icons-material';

const BudgetAnalysis = () => {
  const theme = useTheme();
  const [currentView, setCurrentView] = useState('report');
  const [vesselTypes, setVesselTypes] = useState(['BULK CARRIER']);
  const [vesselSubtypes, setVesselSubtypes] = useState(['HANDYSIZE']);
  const [categories, setCategories] = useState(['Select All']);
  const [subCategories, setSubCategories] = useState(['Select All']);
  const [vessels, setVessels] = useState(['Select All']);
  const [vesselAgeStart, setVesselAgeStart] = useState(0);
  const [vesselAgeEnd, setVesselAgeEnd] = useState(20);
  const [ageValue, setAgeValue] = useState([0, 20]);
  const [vesselsCount, setVesselsCount] = useState(0);
  const [vesselAgeData, setVesselAgeData] = useState({});
  const [selectedVesselType, setSelectedVesselType] = useState('BULK CARRIER');
  const [selectedVesselSubtype, setSelectedVesselSubtype] = useState(['HANDYSIZE']);
  const [selectedCategories, setSelectedCategories] = useState(['Select All']);
  const [selectedSubCategories, setSelectedSubCategories] = useState(['Select All']);
  const [selectedVessels, setSelectedVessels] = useState(['Select All']);
  const [budgetCatData, setBudgetCatData] = useState([]);
  const [budgetSubcatData, setBudgetSubcatData] = useState([]);
  const [nonBudgetCatData, setNonBudgetCatData] = useState([]);
  const [nonBudgetSubcatData, setNonBudgetSubcatData] = useState([]);
  const [eventSubcatData, setEventSubcatData] = useState([]);
  const [plotlyMonthlyQuartilesData, setPlotlyMonthlyQuartilesData] = useState([]);
  const [plotlyYearlyQuartilesData, setPlotlyYearlyQuartilesData] = useState([]);
  const [inputsCollapsed, setInputsCollapsed] = useState(true);

  function valuetext(value) {
    return `${value}`;
  }

  const handleAgeChange = (event, newValue) => {
    setVesselAgeStart(newValue[0]);
    setVesselAgeEnd(newValue[1]);
    setAgeValue(newValue);
  };

  const marks = [
    { value: 0, label: '0' },
    { value: 20, label: '20' },
  ];

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 100,
        width: 250,
      },
    },
  };

  function getStyles(name, values, theme) {
    return {
      fontWeight: values.includes(name)
        ? theme.typography.fontWeightMedium
        : theme.typography.fontWeightRegular,
    };
  }

  const categoriesHandleChange = (event) => {
    const { target: { value } } = event;
    setSelectedCategories(typeof value === 'string' ? value.split(',') : value);
    fetchFilterReportData();
  };

  const subTypesHandleChange = (event) => {
    const { target: { value } } = event;
    setSelectedVesselSubtype(typeof value === 'string' ? value.split(',') : value);
    fetchFilterReportData();
  };

  const subCategoriesHandleChange = (event) => {
    const { target: { value } } = event;
    setSelectedSubCategories(typeof value === 'string' ? value.split(',') : value);
    fetchFilterReportData();
  };

  const selectedVesselsHandleChange = (event) => {
    const { target: { value } } = event;
    setVessels(typeof value === 'string' ? value.split(',') : value);
    fetchFilterReportData();
  };

  useEffect(() => {
    fetchVesselTypesData();
    fetchVesselSubtypesData(selectedVesselType);
    fetchFilterReportData();
    fetchInputsData();
  }, []);

  const fetchVesselTypesData = async () => {
    try {
      const response = await getVesselTypes();
      setVesselTypes(response.data);
    } catch (error) {
      console.error('Error fetching vessel types:', error);
    }
  };

  const fetchVesselSubtypesData = async (vesselType) => {
    try {
      const response = await getVesselSubtypes(vesselType);
      setVesselSubtypes(response.data);
    } catch (error) {
      console.error('Error fetching vessel subtypes:', error);
    }
  };

  const fetchInputsData = async () => {
    try {
      const filterParams = {
        vessel_type: selectedVesselType,
        vessel_subtype: selectedVesselSubtype,
        vessel_age_start: vesselAgeStart,
        vessel_age_end: vesselAgeEnd,
        vessel_cat: categories,
        vessel_subcat: subCategories,
        selected_vessels_dropdown: selectedVessels,
      };
      const response = await filterInpuyts(filterParams);

      setCategories(response.data.vessel_cat_options);
      setSubCategories(response.data.vessel_subcat_options);
      setSelectedVessels(response.data.selected_vessels_option);
      setVesselsCount(response.data.vessels_selected_count);
      setVesselAgeData(response.data.age_count_data);
    } catch (error) {
      console.error('Error fetching report data:', error);
    }
  };

  const fetchFilterReportData = async () => {
    try {
      const filterParams = {
        vessel_type: selectedVesselType,
        vessel_subtype: selectedVesselSubtype,
        vessel_age_start: vesselAgeStart,
        vessel_age_end: vesselAgeEnd,
        vessel_cat: categories,
        vessel_subcat: subCategories,
        selected_vessels_dropdown: selectedVessels,
      };

      setBudgetCatData([]);
      setBudgetSubcatData([]);
      setNonBudgetCatData([]);
      setNonBudgetSubcatData([]);
      setEventSubcatData([]);

      const response = await filterReportData(filterParams);

      setBudgetCatData(response.data.budget_cat_data);
      setBudgetSubcatData(response.data.budget_subcat_data);
      setNonBudgetCatData(response.data.non_budget_cat_data);
      setNonBudgetSubcatData(response.data.nonbudget_subcat_data);
      setEventSubcatData(response.data.event_subcat_data);

      setPlotlyMonthlyQuartilesData(response.data.plotly_monthly_quartiles_data);
      setPlotlyYearlyQuartilesData(response.data.plotly_yearly_quartiles_data);
    } catch (error) {
      console.error('Error fetching report data:', error);
    }
  };

  const handleVesselTypeChange = (event) => {
    const _vesselType = event.target.value;
    setSelectedVesselType(_vesselType);
    fetchVesselSubtypesData(_vesselType);
  };

  const handleViewSwitch = (view) => {
    setCurrentView(view);
  };

  const toggleInputs = () => {
    setInputsCollapsed(!inputsCollapsed);
  };

  return (
    <div className="p-4 relative" style={{ backgroundColor: '#f0f4f8' }}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-900">Budget Analysis</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => handleViewSwitch('report')}
            className={`px-4 py-2 rounded-md ${currentView === 'report' ? 'bg-blue-900 text-white' : 'bg-gray-200'}`}
          >
            Report
          </button>
          <div className="h-6 w-px bg-gray-400"></div>
          <button
            onClick={() => handleViewSwitch('trend')}
            className={`px-4 py-2 rounded-md ${currentView === 'trend' ? 'bg-blue-900 text-white' : 'bg-gray-200'}`}
          >
            Trend
          </button>
        </div>
      </div>
      <p className="mt-4">Synergy Budget Analysis Tool Version 1.0</p>
      <hr className="my-6 border-gray-300" />

      <div onClick={toggleInputs} className="cursor-pointer flex items-center">
        <h3 className="text-xl font-bold">Filters</h3>
        {inputsCollapsed ? <ExpandMore /> : <ExpandLess />}
      </div>

      {!inputsCollapsed && (
          <Box sx={{
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: 2,
            padding: 2,
          }}>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <FormControl fullWidth size="small" sx={{ maxWidth: 250, marginBottom: 2 }}>
            <InputLabel>Vessel Type</InputLabel>
            <Select
              value={selectedVesselType}
              onChange={handleVesselTypeChange}
              input={<OutlinedInput label="Vessel Type" />}
              MenuProps={MenuProps}
            >
              {vesselTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small" sx={{ maxWidth: 250, marginBottom: 2 }}>
            <InputLabel>Vessel Subtype</InputLabel>
            <Select
              multiple
              value={selectedVesselSubtype}
              onChange={subTypesHandleChange}
              input={<OutlinedInput label="Vessel Subtype" />}
              MenuProps={MenuProps}
            >
              {vesselSubtypes.map((subtype) => (
                <MenuItem
                  key={subtype}
                  value={subtype}
                  style={getStyles(subtype, selectedVesselSubtype, theme)}
                >
                  {subtype}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small" sx={{ maxWidth: 250, marginBottom: 2 }}>
            <InputLabel>Categories</InputLabel>
            <Select
              multiple
              value={selectedCategories}
              onChange={categoriesHandleChange}
              input={<OutlinedInput label="Categories" />}
              MenuProps={MenuProps}
            >
              {categories.map((category) => (
                <MenuItem
                  key={category}
                  value={category}
                  style={getStyles(category, selectedCategories, theme)}
                >
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small" sx={{ maxWidth: 250, marginBottom: 2 }}>
            <InputLabel>Sub-Categories</InputLabel>
            <Select
              multiple
              value={selectedSubCategories}
              onChange={subCategoriesHandleChange}
              input={<OutlinedInput label="Sub-Categories" />}
              MenuProps={MenuProps}
            >
              {subCategories.map((subCategory) => (
                <MenuItem
                  key={subCategory}
                  value={subCategory}
                  style={getStyles(subCategory, selectedSubCategories, theme)}
                >
                  {subCategory}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small" sx={{ maxWidth: 250, marginBottom: 2 }}>
            <InputLabel>Vessels</InputLabel>
            <Select
              multiple
              value={selectedVessels}
              onChange={selectedVesselsHandleChange}
              input={<OutlinedInput label="Vessels" />}
              MenuProps={MenuProps}
            >
              {vessels.map((vessel) => (
                <MenuItem
                  key={vessel}
                  value={vessel}
                  style={getStyles(vessel, selectedVessels, theme)}
                >
                  {vessel}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <div>
            <Typography
              id="non-linear-slider"
              gutterBottom
              sx={{ color: 'gray', fontSize: '.8rem', marginBottom: '-5px' }}
            >
              Vessel Age
            </Typography>
            <Box sx={{ width: '90%', marginLeft: '5px' }}> {/* Adjust width as needed */}
              <Slider
                getAriaLabel={() => 'Age Range'}
                value={ageValue}
                onChange={handleAgeChange}
                valueLabelDisplay="auto"
                getAriaValueText={valuetext}
                marks={marks}
                min={0}
                max={20}
              />
            </Box>

          </div>
        </div>
        </Box>
      )}
  
      <hr className="my-6 border-gray-300" />
      <Box sx={{
        backgroundColor: 'white',
        borderRadius: 2,
        boxShadow: 2,
        padding: 2,
      }}>
        <h2 className="text-xl font-bold pb-5">Analysis</h2>
        <BarChart vesselAgeData={vesselAgeData} />
      </Box>
      {/* Horizontal Divider */}
      <hr className="my-6 border-gray-100" />

      <div className="mt-3">
        {currentView === 'report' && (
          <BudgetAnalysisReport
            budgetCatData={budgetCatData}
            budgetSubcatData={budgetSubcatData}
            nonBudgetCatData={nonBudgetCatData}
            nonBudgetSubcatData={nonBudgetSubcatData}
            eventSubcatData={eventSubcatData}
          />
        )}
        {currentView === 'trend' && (
          <BudgetAnalysisTrend
            plotlyMonthlyQuartilesData={plotlyMonthlyQuartilesData}
            plotlyYearlyQuartilesData={plotlyYearlyQuartilesData}
          />
        )}
      </div>
    
    </div>
  );
};

export default BudgetAnalysis;
