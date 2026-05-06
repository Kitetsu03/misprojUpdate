import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
export function LineChart({ title, data, description }) {
  const [resize, setResize] = useState(0);

  useEffect(() => {
    const handleResize = () => setResize((r) => r + 1);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className="card p-5 col-span-2 row-span-1 rounded-2xl h-72 sm:h-80 md:h-96 flex flex-col justify-start items-start w-full">
      <div className="w-full h-full max-w-4xl max-h-96 flex flex-col gap-2">
        <h2 className="font-semibold text-2xl">{title}</h2>
        <p>{description}</p>
        <div className="w-full h-[180px] sm:h-[220px] md:h-64 lg:h-80">
          <Line
            key={resize}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
            data={data}
          />
        </div>
      </div>
    </div>
  );
}
