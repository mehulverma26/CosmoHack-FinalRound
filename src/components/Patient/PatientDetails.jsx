import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function PatientDetails({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    age: "",
    phone: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.age || !form.phone) {
      alert("Please fill all details");
      return;
    }

    localStorage.setItem("patientData", JSON.stringify(form));
    navigate("/home")
    setIsLoggedIn(true);
  };

  return (
    <main className="max-w-5xl mx-auto">
        <motion.section
        className="card p-10 mt-20 space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      ></motion.section>
        <section className="card p-10 max-w-xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold text-center">Patient Details</h2>
        <p className="text-center text-gray-500">
          Please enter your details to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="name"
            placeholder="Full Name"
            className="w-full p-3 border rounded-lg"
            onChange={handleChange}
          />

          <input
            name="age"
            type="number"
            placeholder="Age"
            className="w-full p-3 border rounded-lg"
            onChange={handleChange}
          />

          <input
            name="phone"
            placeholder="Phone Number"
            className="w-full p-3 border rounded-lg"
            onChange={handleChange}
          />

          <button type="submit" className="btn-primary w-full py-3 text-lg">
            Log In & Continue
          </button>
        </form>
      </section>
    </main>
  );
}

export default PatientDetails;
