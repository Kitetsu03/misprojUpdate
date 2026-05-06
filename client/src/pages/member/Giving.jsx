import { MembersNav } from "../../components/MembersNav";
import { FaHome } from "react-icons/fa";
import { MdPerson } from "react-icons/md";
import { FaWallet } from "react-icons/fa";
import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function Giving() {
  const navitem = [
    {
      id: 1,
      icon: <FaHome />,
      text: "Home ",
      path: "/member",
    },
    {
      id: 2,
      icon: <MdPerson />,
      text: "Profile",
      path: "/member/profile",
    },
    {
      id: 3,
      icon: <FaWallet />,
      text: "Giving",
      path: "/member/giving",
    },
  ];

  const data = {
    labels: ["Tithes", "Offerings", "Missions", "Pledges"],
    datasets: [
      {
        label: "Giving Amount (₱)",
        data: [750, 150, 100, 200],
        backgroundColor: ["#22c55e", "#9ca3af", "#6b7280", "#3b82f6"],
      },
    ],
  };

  const options = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <>
      <div className="min-h-screen pb-20">
        <div className="card w-full md:w-full pt-5">
          <div className="card-header">
            <div className="my-logo justify-center"></div>
            <h2 className="cursor-default text-center pb-2 text-[min(5vw,20px)] md:text-[min(5vw,30px)]"></h2>
            <hr className="p-1 border-white bg-white" />
          </div>
        </div>

        <main className="main-content px-5 space-y-5">
          <section className="welcome-section text-center p-4 ">
            <h1 className="welcome-title text-amber-50 font-extrabold text-3xl sm:text-5xl md:text-6xl p-4 font-secondary ">
              MY GIVING
            </h1>
            <p className="welcome-subtext text-xl">
              View your giving summary and fund allocation.
            </p>
          </section>

          <section className="cards-container flex gap-4">
            <section className="w-full flex justify-center px-5 py-5 ">
              <div className="border-2 w-full max-w-4xl bg-white rounded-2xl shadow-lg p-10">
                <h2 className="font-extrabold text-center font-secondary">
                  2025 GIVING SUMMARY
                </h2>

                <p className="text-5xl font-extrabold text-center mt-5">
                  ₱ 1,200.00
                </p>

                <p className="text-center text-gray-600 mt-2">
                  Total given this year
                </p>

                <hr className="my-10" />
                <h3 className="text-center font-extrabold text-lg mb-4 font-secondary ">
                  GIVING BREAKDOWN
                </h3>

                <div className="h-64">
                  <Bar data={data} options={options} />
                </div>
              </div>
            </section>
          </section>
        </main>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-complementary border-t shadow-md">
        <div className="max-w-4xl mx-auto flex bg-complementary">
          {navitem.map((item) => (
            <MembersNav
              key={item.id}
              icon={item.icon}
              title={item.text}
              to={item.path}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Giving;
