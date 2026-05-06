export const membersGrowth = {
  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ],
  datasets: [
    {
      label: "Member Growth",
      data: [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56],
      fill: false,
      borderColor: "rgb(75, 192, 192)",
      tension: 0.1,
      hoverOffset: 4,
    },
  ],
};

export const categoryDistribution = {
  labels: ["MEN", "WOMEN", "YAN", "KKB", "CHILDREN"],
  datasets: [
    {
      label: "Category Distribution",
      data: [40, 40, 25, 15, 30],
      backgroundColor: ["#5AA3FF", "#000798", "#003F2E", "#16745A", "#00B0F0"],
      hoverOffset: 4,
      hoverBackgroundColor: ["#3D82FF", "#000680"],
    },
  ],
};
export const ageDemographics = {
  labels: ["MEN", "WOMEN", "YAN", "KKB", "CHILDREN"],
  datasets: [
    {
      label: "Age Distribution",
      data: [40, 40, 25, 15, 30],
      backgroundColor: ["#5AA3FF", "#000798", "#003F2E", "#16745A", "#00B0F0"],
      hoverOffset: 4,
      hoverBackgroundColor: ["#3D82FF", "#000680"],
    },
  ],
};

export const lifeGroupDemographics = {
  labels: ["MEN", "WOMEN", "YAN", "KKB", "CHILDREN"],
  datasets: [
    {
      label: "Age Distribution",
      data: [15, 15, 3, 24, 6],
      backgroundColor: ["#5AA3FF", "#000798", "#003F2E", "#16745A", "#00B0F0"],
      hoverOffset: 4,
      hoverBackgroundColor: ["#3D82FF", "#000680"],
    },
  ],
};

export const attendanceDemographics = {
  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ],
  datasets: [
    {
      label: "First-Timers",
      data: [10, 17, 32, 20, 41, 11, 21, 15, 57, 52, 92, 42],
      backgroundColor: ["#5AA3FF"],
      hoverOffset: 4,
      hoverBackgroundColor: ["#3D82FF", "#000680"],
    },
    {
      label: "Attendees",
      data: [42, 50, 35, 82, 15, 15, 53, 36, 80, 94, 52, 15],
      backgroundColor: ["#16745A"],
      hoverOffset: 4,
      hoverBackgroundColor: ["#3D82FF", "#000680"],
    },
  ],
};

export const tithesAndOfferings = {
  labels: ["QUARTER 1", "QUARTER 2", "QUARTER 3", "QUARTER 4"],
  datasets: [
    {
      label: "Tithes and Offerings",
      data: [15, 15, 3, 24, 6],
      backgroundColor: ["#5AA3FF", "#000798", "#003F2E", "#16745A", "#00B0F0"],
      hoverOffset: 4,
      hoverBackgroundColor: ["#3D82FF", "#000680"],
    },
  ],
};

export const expenses = {
  labels: ["QUARTER 1", "QUARTER 2", "QUARTER 3", "QUARTER 4"],
  datasets: [
    {
      label: "Expenses",
      data: [15, 15, 3, 24, 6],
      backgroundColor: ["#5AA3FF", "#000798", "#003F2E", "#16745A", "#00B0F0"],
      hoverOffset: 4,
      hoverBackgroundColor: ["#3D82FF", "#000680"],
    },
  ],
};

export const offeringVsExpenses = {
  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ],
  datasets: [
    {
      label: "Offerings",
      data: [10, 17, 32, 20, 41, 11, 21, 15, 57, 52, 92, 42],
      backgroundColor: ["#5AA3FF"],
      hoverOffset: 4,
      hoverBackgroundColor: ["#3D82FF", "#000680"],
    },
    {
      label: "Expenses",
      data: [42, 50, 35, 82, 15, 15, 53, 36, 80, 94, 52, 15],
      backgroundColor: ["#16745A"],
      hoverOffset: 4,
      hoverBackgroundColor: ["#3D82FF", "#000680"],
    },
  ],
};
