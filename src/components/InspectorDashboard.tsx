'use client'

import { useState } from 'react';
import { ProblemReportingForm } from './ProblemReportingForm';

export function InspectorDashboard() {
  const [reports, setReports] = useState([]);

  const handleNewReport = (report) => {
    setReports([...reports, report]);
    // In a real application, you would also send this to your backend API
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Inspector Dashboard</h1>
      <ProblemReportingForm onSubmit={handleNewReport} />
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Reports</h2>
        {reports.map((report, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow mb-4">
            <h3 className="font-bold">{report.title}</h3>
            <p>{report.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}