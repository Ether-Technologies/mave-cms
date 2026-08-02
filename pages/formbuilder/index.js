// pages/formbuilder/index.js
import { useEffect, useRef, useState } from "react";
import MaveFormsShowcase from "./mave-forms-showcase";
import { FormBuilderProvider } from "../../src/context/FormBuilderContext";
import FormBuilderHeader from "../../components/formbuilder/FormBuilderHeader";
import { setPageTitle } from "../../global/constants/pageTitle";

export default function FormBuilder() {
  const [formCount, setFormCount] = useState(null);
  const refreshFormsRef = useRef(null);

  useEffect(() => {
    setPageTitle("Form Builder");
  }, []);

  const handleRefresh = () => {
    refreshFormsRef.current?.();
  };

  return (
    <FormBuilderProvider>
      <div className="mavecontainer bg-gray-50 rounded-xl pb-8">
        <FormBuilderHeader formCount={formCount} onRefresh={handleRefresh} />
        <MaveFormsShowcase
          onFormCountChange={setFormCount}
          refreshRef={refreshFormsRef}
        />
      </div>
    </FormBuilderProvider>
  );
}
