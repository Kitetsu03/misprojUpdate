import { AddMemberTab } from "../tabs/AddMemberTab.jsx";

export function AddNewMember({ onSuccess, setSubmitting }) {
  return (
    <>
      <div className="">
        {/* personal info */}
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">Add New Member</h1>
          <p className="text-gray-500 text-sm">
            Create a comprehensive profile for a new church member.
          </p>
        </header>
        <AddMemberTab onSuccess={onSuccess} setSubmitting={setSubmitting} />
      </div>
    </>
  );
}
