import { SettingsTabs } from "../../components/ui/tabs/SettingsTabs.jsx";
import AdminNav from "../../components/AdminNav.jsx";

function Settings() {
  return (
    <>
      <div className="min-h-dvh grid grid-cols-[auto_1fr]">
        <AdminNav />
        <div className="body">
          <header className="p-5 font-secondary">
            <h1 className="text-2xl md:text-5xl text-white font-extrabold">
              SYSTEM SETTINGS AND CONFIGURATION
            </h1>
            <p className="pt-1 text-white">
              Configure church information, system preferences, and
              administrative settings.
            </p>
          </header>
          <SettingsTabs />
        </div>
      </div>
    </>
  );
}
export default Settings;
