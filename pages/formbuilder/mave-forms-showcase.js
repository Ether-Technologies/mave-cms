// pages/formbuilder/mave-forms-showcase.js
import React, { useState } from "react";
import MaveFormsList from "../../components/formbuilder/MaveFormsList";

const MaveFormsShowcase = ({ onFormCountChange }) => {
  const [selectedFormId, setSelectedFormId] = useState(null);

  const handleSelectForm = (formId) => {
    setSelectedFormId(formId);
  };

  return (
    <div className="w-full">
      <MaveFormsList
        onSelectForm={handleSelectForm}
        selectedFormId={selectedFormId}
        onFormCountChange={onFormCountChange}
      />
    </div>
  );
};

export default MaveFormsShowcase;
