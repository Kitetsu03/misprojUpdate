function RecentActivities() {
  return (
    <>
      <h2 className="text-2xl font-semibold">RECENT ACTIVITIES</h2>
      <p>Latest updates and notifications</p>
      <div className="card p-5 rounded-2xl shadow-md space-y-3">
        <ul className="space-y-4">
          <li>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">AN</span>
              </div>
              <div>
                <p className="font-medium">Announcement sent</p>
                <p className="text-sm text-gray-500">2 hours ago</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
}
export default RecentActivities;
