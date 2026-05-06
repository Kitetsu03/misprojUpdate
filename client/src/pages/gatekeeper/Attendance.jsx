import GatekeeperNav from "../../components/GatekeeperNav.jsx";
import { AttendanceTabs } from "../../components/ui/tabs/AttendanceTabs.jsx";
import { BlackButton } from "../../components/ui/buttons/BlackButton.jsx";
export function Attendance() {
  return (
    <>
      <div className="min-h-dvh grid grid-cols-[auto_1fr]">
        <GatekeeperNav />
        <main className="flex-1 p-6 space-y-2 font-secondary">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-5xl font-bold text-white">
                ATTENDANCE MANAGEMENT
              </h1>
              <p className="text-white/90 text-sm">
                Tracking attendance of church members and visitors.
              </p>
            </div>
            <BlackButton val={"+ Add Attendance"} />
          </div>
          <AttendanceTabs />
        </main>
      </div>
    </>
  );
}
