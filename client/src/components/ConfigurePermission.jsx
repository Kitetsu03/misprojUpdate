function ConfigurePermission() {
  return (
    <>
      <div className="mt-6 p-4  rounded-lg bg-white">
        <h1 className="font-semibold mb-2">Permissions</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            "View Members",
            "Edit Members",
            "Delete Members",
            "View Financial Data",
            "Approve Transactions",
            "Manage LifeGroups",
            "Generate Reports",
            "System Settings",
          ].map((perm) => (
            <label key={perm} className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="w-4 h-4 accent-black" />
              {perm}
            </label>
          ))}
        </div>
      </div>
    </>
  );
}

export default ConfigurePermission;
