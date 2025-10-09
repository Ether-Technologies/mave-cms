// pages/formbuilder/mave-forms-showcase.js
import React, { useState } from "react";
import MaveFormsList from "../../components/formbuilder/MaveFormsList";
import { FormBuilderProvider } from "../../src/context/FormBuilderContext";

const MaveFormsShowcase = () => {
  const [selectedFormId, setSelectedFormId] = useState(null);

  const handleSelectForm = (formId) => {
    setSelectedFormId(formId);
  };

  return (
    <FormBuilderProvider>
      <div className="w-full">
        <MaveFormsList
          onSelectForm={handleSelectForm}
          selectedFormId={selectedFormId}
        />
      </div>
    </FormBuilderProvider>
  );
};

export default MaveFormsShowcase;
