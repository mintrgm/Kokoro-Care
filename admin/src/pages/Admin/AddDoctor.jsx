import React, { useState } from "react"; 
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance"; 

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState(1);
  const [fees, setFees] = useState("");
  const [speciality, setSpeciality] = useState("General physician");
  const [about, setAbout] = useState("");
  const [degree, setDegree] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!docImg) {
      return toast.error("Please upload doctor image");
    }

    const formData = new FormData();
    formData.append("image", docImg);
    formData.append("email", email);
    formData.append("name", name);
    formData.append("password", password);
    formData.append("experience", experience);
    formData.append("fees", Number(fees));
    formData.append("speciality", speciality);
    formData.append("about", about);
    formData.append("degree", degree);
    formData.append(
      "address",
      JSON.stringify({ line1: address1, line2: address2 })
    );

    try {
      const { data } = await axiosInstance.post(
        "/api/admin/add-doctor",
        formData,
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        toast.success(data.message);
        setDocImg(null);
        setEmail("");
        setName("");
        setPassword("");
        setExperience(1);
        setFees("");
        setSpeciality("General physician");
        setAbout("");
        setDegree("");
        setAddress1("");
        setAddress2("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      if (error.response?.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  };

  return (
    <form className="m-5 w-full" onSubmit={onSubmitHandler}>
      <p className="mb-3 text-lg font-audiowide text-[#F8FBFF] font-bold">Add Doctor</p>

      <div className="bg-[#090A0A] p-8 border border-white rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
        <div className="flex items-center gap-4 mb-8">
          <label htmlFor="doc_img">
            <img
              className="w-14 h-14 bg-gray-900 border border-white cursor-pointer rounded-full object-cover transition-transform hover:scale-105"
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              alt="uploaded image"
            />
          </label>
          <input type="file" id="doc_img" hidden onChange={(e) => setDocImg(e.target.files[0])} />
          <p className="text-white">Upload doctor<br />picture</p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-10">
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-white font-semibold">Doctor Name</p>
              <input
                className="border border-white rounded px-3 py-2 bg-[#090A0A] text-white font-electrolize"
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-white font-semibold">Doctor Email</p>
              <input
                className="border border-white rounded px-3 py-2 bg-[#090A0A] text-white font-electrolize"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-white font-semibold">Doctor Password</p>
              <input
                className="border border-white rounded px-3 py-2 bg-[#090A0A] text-white font-electrolize"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-white font-semibold">Doctor Experience</p>
              <select
                className="border border-white rounded px-3 py-2 bg-[#090A0A] text-white font-electrolize"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                required
              >
                {[...Array(10).keys()].map(i => (
                  <option key={i+1} value={i+1}>{i+1} Year{i>0?'s':''}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-white font-semibold">Fees</p>
              <input
                className="border border-white rounded px-3 py-2 bg-[#090A0A] text-white font-electrolize"
                type="number"
                placeholder="Doctor fees"
                value={fees}
                onChange={(e) => setFees(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-white font-semibold">Speciality</p>
              <select
                className="border border-white rounded px-3 py-2 bg-[#090A0A] text-white font-electrolize"
                value={speciality}
                onChange={(e) => setSpeciality(e.target.value)}
              >
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-white font-semibold">Education</p>
              <input
                className="border border-white rounded px-3 py-2 bg-[#090A0A] text-white font-electrolize"
                type="text"
                placeholder="Education"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-white font-semibold">Address</p>
              <input
                className="border border-white rounded px-3 py-2 bg-[#090A0A] text-white font-electrolize"
                type="text"
                placeholder="Address 1"
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
                required
              />
              <input
                className="border border-white rounded px-3 py-2 bg-[#090A0A] text-white font-electrolize"
                type="text"
                placeholder="Address 2"
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-white font-semibold mb-2">About Doctor</p>
          <textarea
            className="w-full px-4 pt-2 border border-white rounded bg-[#090A0A] text-white font-electrolize"
            rows={5}
            placeholder="write about doctor"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="mt-4 bg-[#052F5F] hover:bg-[#031f3b] text-white text-sm px-10 py-3 rounded-full font-semibold transition-all"
        >
          Add Doctor
        </button>
      </div>
    </form>
  );
};

export default AddDoctor;

