import { MembersNav } from "../../components/MembersNav";
import { FaHome } from "react-icons/fa";
import { MdPerson } from "react-icons/md";
import { FaWallet } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { FaCamera } from "react-icons/fa";
import { HiOutlineInformationCircle } from "react-icons/hi2";
import { MdLocationPin } from "react-icons/md";
import { MdContactEmergency } from "react-icons/md";

function Profile() {
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

  return (
    <>
      <div className="min-h-screen pb-20 ">
        <div className="card w-full md:w-full pt-5">
          <div className="card-header">
            <div className="my-logo justify-center"></div>
            <h2 className="cursor-default text-center pb-2 text-[min(5vw,20px)] md:text-[min(5vw,30px)]"></h2>
            <hr className="p-1 border-white bg-white" />
          </div>
        </div>

        <main className="main-content px-5 space-y-5 sm:px-10 md:px-20 lg:px-40">
          <section className="welcome-section text-center p-4 ">
            <h1 className="welcome-title text-amber-50 font-extrabold text-3xl sm:text-5xl md:text-6xl p-4 font-secondary">
              MY PROFILE
            </h1>
            <p className="welcome-subtext text-xl">
              Update your information and family details.
            </p>
          </section>

          <section className="section-card bg-white w-full p-4 shadow rounded-xl border-2">
            <div className="max-w-xl bg-white rounded-2xl ">
              <h2 className="font-bold flex items-center gap-3">
                <FaUser />
                Profile Picture
              </h2>
              <div className="flex md:justify-center items-center mt-5">
                <div className="w-40 h-40 rounded-full bg-gray-300 shadow-md mr-5" />
                <div className="space-y-3">
                  <label className="cursor-pointer flex items-center gap-3 bg-gray-700 text-white px-10 py-5 rounded-xl hover:bg-gray-800 transition shadow-md">
                    <FaCamera />
                    Change Photo
                    <input
                      type="file"
                      className="hidden"
                      accept="image/png, image/jpeg"
                    />
                  </label>
                  <p className="text-sm text-gray-600">JPG or PNG, max 5MB</p>
                </div>
              </div>
            </div>
          </section>

          <section className="section-card bg-white w-full p-4 shadow rounded-xl border-2">
            <div className="flex justify-end mt-4">
              <EditButton />
            </div>
            <h2 className="font-bold flex items-center gap-3">
              <HiOutlineInformationCircle />
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-semibold">First Name</label>
                <input
                  type="text"
                  className="w-full mt-1 p-3 border border-gray-400 rounded-xl focus:ring-2 focus:ring-blue-300"
                />
              </div>

              <div>
                <label className="font-semibold">Last Name</label>
                <input
                  type="text"
                  className="w-full mt-1 p-3 border border-gray-400 rounded-xl focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="font-semibold">Email Address</label>
              <input
                type="email"
                className="w-full mt-1 p-3 border border-gray-400 rounded-xl focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div className="mt-6">
              <label className="font-semibold">Phone Number</label>
              <div className="flex gap-3">
                <select className="w-32 mt-1 p-3 border border-gray-400 rounded-xl focus:ring-2 focus:ring-blue-300">
                  <option value="+1">+1 (US/CA)</option>
                  <option value="+44">+44 (UK)</option>
                  <option value="+63">+63 (PH)</option>
                  <option value="+91">+91 (IN)</option>
                  <option value="+60">+60 (MY)</option>
                  <option value="+62">+62 (ID)</option>
                  <option value="+65">+65 (SG)</option>
                  <option value="+66">+66 (TH)</option>
                  <option value="+84">+84 (VN)</option>
                  <option value="+81">+81 (JP)</option>
                  <option value="+86">+86 (CN)</option>
                  <option value="+82">+82 (KR)</option>
                  <option value="+61">+61 (AU)</option>
                  <option value="+64">+64 (NZ)</option>
                  <option value="+27">+27 (ZA)</option>
                </select>
                <input
                  type="text"
                  placeholder="9123456789"
                  className="flex-1 mt-1 p-3 border border-gray-400 rounded-xl focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="font-semibold">Birth Date</label>
              <input
                type="date"
                className="w-full mt-1 p-3 border border-gray-400 rounded-xl focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </section>

          <section className="section-card bg-white w-full p-4 shadow rounded-xl border-2">
            <div className="flex justify-end mt-4">
              <EditButton />
            </div>
            <h2 className="font-bold flex items-center gap-3">
              <MdLocationPin />
              Address Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div>
                <label className="font-semibold">City / Municipality</label>
                <input
                  type="text"
                  className="w-full mt-1 p-3 border border-gray-400 rounded-xl focus:ring-2 focus:ring-blue-300"
                />
              </div>

              <div>
                <label className="font-semibold">Province</label>
                <input
                  type="text"
                  className="w-full mt-1 p-3 border border-gray-400 rounded-xl focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="font-semibold">Barangay</label>
              <input
                type="email"
                className="w-full mt-1 p-3 border border-gray-400 rounded-xl focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div className="mt-6">
              <label className="font-semibold">
                House No. / Street / Sitio / Purok
              </label>
              <input
                type="email"
                className="w-full mt-1 p-3 border border-gray-400 rounded-xl focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div className="mt-6">
              <label className="font-semibold">ZIP / Postal Code</label>
              <input
                type="text"
                className="w-full mt-1 p-3 border border-gray-400 rounded-xl focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </section>

          <section className="section-card bg-white w-full p-4 shadow rounded-xl border-2">
            <div className="flex justify-end mt-4">
              <EditButton />
            </div>
            <h2 className="font-bold flex items-center gap-3">
              <MdContactEmergency />
              Emergency Contact
            </h2>

            <div>
              <label className="font-semibold">Contact Name</label>
              <input
                type="text"
                className="w-full mt-1 p-3 border border-gray-400 rounded-xl focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div>
                <label className="font-semibold">Relationship</label>
                <select className="w-full mt-1 p-3 border border-gray-400 rounded-xl focus:ring-2 focus:ring-blue-300">
                  <option value="">Select relationship</option>
                  <option value="spouse">Spouse</option>
                  <option value="parent">Parent</option>
                  <option value="sibling">Sibling</option>
                  <option value="child">Child</option>
                  <option value="grandparent">Grandparent</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="font-semibold">Phone Number</label>
                <div className="flex gap-3">
                  <select className="w-32 mt-1 p-3 border border-gray-400 rounded-xl focus:ring-2 focus:ring-blue-300">
                    <option value="+1">+1 (US/CA)</option>
                    <option value="+44">+44 (UK)</option>
                    <option value="+63">+63 (PH)</option>
                    <option value="+91">+91 (IN)</option>
                    <option value="+60">+60 (MY)</option>
                    <option value="+62">+62 (ID)</option>
                    <option value="+65">+65 (SG)</option>
                    <option value="+66">+66 (TH)</option>
                    <option value="+84">+84 (VN)</option>
                    <option value="+81">+81 (JP)</option>
                    <option value="+86">+86 (CN)</option>
                    <option value="+82">+82 (KR)</option>
                    <option value="+61">+61 (AU)</option>
                    <option value="+64">+64 (NZ)</option>
                    <option value="+27">+27 (ZA)</option>
                  </select>
                  <input
                    type="text"
                    placeholder="9123456789"
                    className="flex-1 mt-1 p-3 border border-gray-400 rounded-xl focus:ring-2 focus:ring-blue-300"
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="flex justify-center">
            <button className="btn flex items-center gap-3 px-20 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition">
              Save Changes
            </button>
          </div>
        </main>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-complementary border-t shadow-md">
        <div className="max-w-4xl mx-auto bg-complementary flex">
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

export default Profile;
