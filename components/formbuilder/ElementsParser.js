// components/formbuilder/ElementsParser.jsx
import React, { useContext } from "react";
import { FormBuilderContext } from "../../src/context/FormBuilderContext";
import { Button, message } from "antd";
import instance from "../../axios";

// A simpler "DisplayField" w/o drag-and-drop
function DisplayField({ element, register, errors }) {
  const fieldName = element.label?.toLowerCase().replace(/\s+/g, '_') || `field_${element.updated_on}`;

  switch (element.element_type) {
    case "input":
      if (element.input_type === "radio") {
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {element.label}
              {element.required && <span className="text-gray-800 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {element.options?.map((opt, idx) => (
                <label key={idx} className="flex items-center">
                  <input
                    type="radio"
                    value={opt.value}
                    {...register(fieldName, { required: element.required })}
                    className="mr-2"
                  />
                  {opt.title}
                </label>
              ))}
            </div>
            {errors[fieldName] && (
              <p className="text-gray-800 text-sm mt-1">{errors[fieldName].message}</p>
            )}
          </div>
        );
      }
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {element.label}
            {element.required && <span className="text-gray-800 ml-1">*</span>}
          </label>
          <input
            type={element.input_type}
            placeholder={element.placeholder}
            {...register(fieldName, {
              required: element.required ? `${element.label} is required` : false
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          {errors[fieldName] && (
            <p className="text-gray-800 text-sm mt-1">{errors[fieldName].message}</p>
          )}
        </div>
      );
    case "textarea":
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {element.label}
            {element.required && <span className="text-gray-800 ml-1">*</span>}
          </label>
          <textarea
            rows={3}
            placeholder={element.placeholder}
            {...register(fieldName, {
              required: element.required ? `${element.label} is required` : false
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          {errors[fieldName] && (
            <p className="text-gray-800 text-sm mt-1">{errors[fieldName].message}</p>
          )}
        </div>
      );
    case "select":
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {element.label}
            {element.required && <span className="text-gray-800 ml-1">*</span>}
          </label>
          <select
            {...register(fieldName, {
              required: element.required ? `${element.label} is required` : false
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <option value="">{element.placeholder || "Select an option"}</option>
            {element.options?.map((opt, idx) => (
              <option key={idx} value={opt.value}>
                {opt.title}
              </option>
            ))}
          </select>
          {errors[fieldName] && (
            <p className="text-gray-800 text-sm mt-1">{errors[fieldName].message}</p>
          )}
        </div>
      );
    case "button":
      if (element.input_type === "submit") {
        return (
          <button
            type="submit"
            className="bg-gray-200 text-white px-6 py-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            {element.placeholder || element.label || "Submit"}
          </button>
        );
      }
      return (
        <button
          type="button"
          className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          {element.placeholder || element.label || "Button"}
        </button>
      );
    default:
      return null;
  }
}

export default function ElementsParser({ form, setDrawerVisible }) {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useContext(FormBuilderContext);

  const formId = form?.id;

  const onSubmit = async (values) => {
    const submissionData = {
      form_id: formId,
      form_data: values,
      submitted_at: new Date().toISOString()
    };

    try {
      const response = await instance.post(
        form?.attributes?.action_url,
        submissionData
      );
      if (response.status === 201 || response.status === 200) {
        message.success("Form submitted successfully!");
        reset();
        setDrawerVisible?.(false);
      } else {
        message.error("Error submitting form");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error("An error occurred while submitting the form.");
    }
  };

  const handleReset = () => reset();

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <form
        id={form?.attributes?.component_id}
        className={form?.attributes?.component_class}
        encType={form?.attributes?.enctype}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{form?.title}</h3>
          <div
            className="text-gray-700"
            dangerouslySetInnerHTML={{ __html: form?.description }}
          />
        </div>

        <div className="space-y-6">
          {/* Render form elements */}
          {form?.elements?.map((element, idx) => (
            <div key={element.updated_on || idx}>
              <DisplayField
                element={element}
                register={register}
                errors={errors}
              />
            </div>
          ))}
        </div>

        {Object.keys(errors).length > 0 && (
          <div className="mt-4 p-4 bg-gray-200 border border-gray-400 rounded-md">
            <p className="text-gray-800 text-sm font-medium">
              Please fix the validation errors above.
            </p>
          </div>
        )}

        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Reset
          </button>
          <button
            type="submit"
            className="bg-gray-200 text-white px-6 py-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Submit Form
          </button>
        </div>
      </form>
    </div>
  );
}
