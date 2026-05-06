import { infoCard } from "../../../data/cardsInfo.jsx";
import { ageCard } from "../../../data/cardsInfo.jsx";
import { attendanceCard } from "../../../data/cardsInfo.jsx";
import { lifeGroupCard } from "../../../data/cardsInfo.jsx";
import { financeCard } from "../../../data/cardsInfo.jsx";
import { ministryCard } from "../../../data/cardsInfo.jsx";
import { LineChart } from "../charts/LineChart.jsx";
import { BarLineChart } from "../charts/BarLineChart.jsx";
import { DoughnutChart } from "../charts/DoughnutChart.jsx";

import {
  categoryDistribution,
  ageDemographics,
  membersGrowth,
  attendanceDemographics,
  lifeGroupDemographics,
  tithesAndOfferings,
  expenses,
  offeringVsExpenses,
} from "../../../data/chartData.js";
import Card from "../Card.jsx";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useState } from "react";

export const ReportTabs = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }

  CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  return (
    <>
      <div className=" card w-full rounded-2xl mx-2">
        <Box sx={{ maxWidth: { xs: 510, sm: 1800 } }}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
            indicatorColor="primary"
            textColor="bg-black"
            sx={{
              width: "100%",
              "& .MuiTabs-flexContainer": {
                justifyContent: {
                  xs: "flex-start",
                  md: "center",
                },
              },
              "& .MuiTab-root": {
                minWidth: "unset",
                px: 2,
                flexShrink: 0,
                fontWeight: 700,
                fontSize: {
                  xs: "0.85rem",
                  sm: "0.95rem",
                  md: "1rem",
                  lg: "1.05rem",
                },
                whiteSpace: "nowrap",
              },
            }}
          >
            <Tab label="Overview" {...a11yProps(0)} />
            <Tab label="Demographics" {...a11yProps(1)} />
            <Tab label="Attendance" {...a11yProps(2)} />
            <Tab label="LifeGroups" {...a11yProps(3)} />
            <Tab label="Finance" {...a11yProps(4)} />
            <Tab label="Ministries" {...a11yProps(5)} />
            <Tab label="Saved Reports" {...a11yProps(6)} />
          </Tabs>
        </Box>
      </div>
      <CustomTabPanel value={value} index={0}>
        <div className="flex flex-col gap-2 p-2 md:grid md:grid-cols-4 md:grid-rows-1 md:gap-3 md:p-3 font-secondary">
          {infoCard.map((info) => (
            <Card
              key={info.id}
              title={info.title}
              icon={info.icon}
              info={info.info}
              value={info.value}
              desc={info.desc}
            />
          ))}
          {/* LineChart */}
          <LineChart
            title="MEMBERSHIP GROWTH"
            data={membersGrowth}
            description="Total and active members over the last 6 months"
          />
          {/* doughnut chart */}
          <DoughnutChart
            title="MEMBERSHIP DISTRIBUTION BY NETWORK"
            data={categoryDistribution}
            description="Total members by age or network"
          />
        </div>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-2 md:p-3 font-secondary">
          <div className="col-span-1 md:col-span-2">
            <BarLineChart
              title={"MEMBERSHIP DEMOGRAPHICS"}
              data={ageDemographics}
              description={
                "Detailed breakdown of member characteristics and trends."
              }
            />
          </div>
          <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-3">
            {ageCard.map((info) => (
              <Card
                key={info.id}
                title={info.title}
                icon={info.icon}
                info={info.info}
                value={info.value}
                desc={info.desc}
              />
            ))}
          </div>
        </div>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <div className="flex flex-col gap-2 p-2 md:grid md:grid-cols-4 md:grid-rows-1 md:gap-3 md:p-3 font-secondary">
          {attendanceCard.map((info) => (
            <Card
              key={info.id}
              title={info.title}
              icon={info.icon}
              info={info.info}
              value={info.value}
              desc={info.desc}
            />
          ))}
          <div className="col-span-1 md:col-span-4 flex justify-center items-center">
            <BarLineChart
              title="FIRST-TIMER AND ATTENDANCE"
              data={attendanceDemographics}
              description="Detailed breakdown of first-timer and attendance trends."
            />
          </div>
        </div>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <div className="flex flex-col gap-2 p-2 md:grid md:grid-cols-4 md:grid-rows-1 md:gap-3 md:p-3 font-secondary">
          {lifeGroupCard.map((info) => (
            <Card
              key={info.id}
              title={info.title}
              icon={info.icon}
              info={info.info}
              value={info.value}
              desc={info.desc}
            />
          ))}
          <BarLineChart
            title="LIFE GROUP MEMBERSHIP"
            data={lifeGroupDemographics}
            description="Detailed breakdown of member characteristics and trends."
          />
          <DoughnutChart
            title="LIFEGROUP MEMBERSHIP BY NETWORK"
            data={lifeGroupDemographics}
            description="Total members by age or network"
          />
        </div>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        <div className="flex flex-col gap-2 p-2 md:grid md:grid-cols-4 md:grid-rows-1 md:gap-3 md:p-3 font-secondary">
          {financeCard.map((info) => (
            <Card
              key={info.id}
              title={info.title}
              icon={info.icon}
              info={info.info}
              value={info.value}
              desc={info.desc}
            />
          ))}
          <BarLineChart
            title="TITHES AND OFFERINGS"
            data={tithesAndOfferings}
            description="Quarterly tithes and offerings trends per Quarter."
          />
          <BarLineChart
            title="EXPENSES"
            data={expenses}
            description="Church expenses breakdown per Quarter."
          />
          <div className="col-span-1 md:col-span-4 flex justify-center items-center">
            <BarLineChart
              title="OFFERINGS VS EXPENSES"
              data={offeringVsExpenses}
              description="Comparison of offerings and expenses."
            />
          </div>
        </div>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={5}>
        <div className="flex flex-col gap-2 p-2 md:grid md:grid-cols-4 md:grid-rows-1 md:gap-3 md:p-3 font-secondary">
          {ministryCard.map((info) => (
            <Card
              key={info.id}
              title={info.title}
              icon={info.icon}
              info={info.info}
              value={info.value}
              desc={info.desc}
            />
          ))}
        </div>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={6}>
        <div className="font-secondary">
          <div className="card p-5 rounded-xl shadow-md space-y-3 col-span-4">
            <h2 className="font-semibold text-lg p-2">Saved Reports</h2>
            <p className="px-2 text-sm text-gray-600">
              You have no saved reports. Create and save reports for quick
              access.
            </p>
          </div>
        </div>
      </CustomTabPanel>
    </>
  );
};
