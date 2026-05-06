import GatekeeperNav from "../../components/GatekeeperNav.jsx";
import { FinanceTab } from "../../components/ui/tabs/FinanceTab.jsx";
import { BlackButton } from "../../components/ui/buttons/BlackButton.jsx";
export function Finance() {
  return (
    <>
      <div className="min-h-dvh grid grid-cols-[auto_1fr]">
        <GatekeeperNav />
        <main className="flex-1 p-6 space-y-2 font-secondary">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-5xl font-bold text-white">
                FINANCIAL MANAGEMENT
              </h1>
              <p className="text-white/90 text-sm">
                Tithes, Offerings, and Expenses Tracker
              </p>
            </div>
            <BlackButton val={"+ Add Offering | Expenses"} />
          </div>
          <FinanceTab />
        </main>
      </div>
    </>
  );
}
