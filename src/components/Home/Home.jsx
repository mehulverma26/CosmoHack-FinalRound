import React from 'react'
import {ClipboardCheck, ShieldCheck, UserCheck} from "lucide-react";

function Home() {
  return (
    <>
    <main className="max-w-5xl mx-auto">
      <section className="card p-10 max-w-xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold text-center">Patient Details</h2>
        <p className="text-center text-gray-500">
          Please enter your details to continue
        </p>
        <form id="patient-form" className="space-y-5">
          {/* Name */}
          <div>
            <label className="block mb-1 font-medium">Full Name</label>
            <input
              type="text"
              id="patient-name"
              className="w-full p-3 border rounded-lg"
              placeholder="Enter your name"
              required=""
            />
          </div>
          {/* Age */}
          <div>
            <label className="block mb-1 font-medium">Age</label>
            <input
              type="number"
              id="patient-age"
              className="w-full p-3 border rounded-lg"
              placeholder="Enter your age"
              min={1}
              required=""
            />
          </div>
          {/* Phone */}
          <div>
            <label className="block mb-1 font-medium">Phone Number</label>
            <input
              type="tel"
              id="patient-phone"
              className="w-full p-3 border rounded-lg"
              placeholder="Enter phone number"
              pattern="[0-9]{10}"
              required=""
            />
          </div>
          {/* Button */}
          <button
            type="button"
            onclick="savePatientDetails()"
            className="btn-primary w-full py-3 text-lg"
          >
            Log In &amp; Continue
          </button>
        </form>
      </section>
      <section className="card p-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          Your Mental Health Matters 💚
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          MindCare helps you assess your mental well-being using the PHQ-9 clinical
          questionnaire and guides you towards professional support.
        </p>
        <div className="flex justify-center gap-4">
          <a href="/assessment" className="btn-primary px-8 py-3">
            {" "}
            Start Assessment{" "}
          </a>
          <a href="/dashboard" className="btn-secondary px-6 py-3">
            {" "}
            View Dashboard{" "}
          </a>
        </div>
      </section>
      <section className="grid md:grid-cols-3 gap-6 mt-10">
        <div className="card p-6 text-center">
          <ClipboardCheck className="mx-auto mb-2" />
          <h3 className="font-semibold mb-1">Clinically Valid</h3>
          <p className="text-sm text-gray-500">
            Based on PHQ-9 standard assessment
          </p>
        </div>
        <div className="card p-6 text-center">
          <ShieldCheck className="mx-auto mb-2" />
          <h3 className="font-semibold mb-1">Confidential</h3>
          <p className="text-sm text-gray-500">
            Your data stays private &amp; secure
          </p>
        </div>
        <div className="card p-6 text-center">
          <UserCheck className="mx-auto mb-2" />
          <h3 className="font-semibold mb-1">Guided Support</h3>
          <p className="text-sm text-gray-500">Get help based on your results</p>
        </div>
      </section>
    </main>
    </>
  )
}

export default Home;