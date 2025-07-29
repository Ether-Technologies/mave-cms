// components/doctoapi/MotherComponent/PageBuilder.js

import React, { useState } from "react";
import TextComponent from "../ElementComponents/TextComponent";
import ParagraphComponent from "../ElementComponents/ParagraphComponent";
import MediaComponent from "../ElementComponents/MediaComponent";
import MenuComponent from "../ElementComponents/MenuComponent";
import NavbarComponent from "../ElementComponents/NavbarComponent";
// SliderComponent removed - not needed for this system
import CardComponent from "../ElementComponents/CardComponent";
import FooterComponent from "../ElementComponents/FooterComponent";
import JsonPreview from "../PreviewComponents/JsonPreview";
import ConfirmButton from "../Confirmation/ConfirmButton";
import { v4 as uuidv4 } from "uuid";

const PageBuilder = ({ parsedYaml }) => {
  // const [sections, setSections] = useState([]);
  const [sections, setSections] = useState(parsedYaml.sections);

  // 1. Add a useEffect to log changes in sections
  useEffect(() => {
    console.log("Sections updated:", sections);
  }, [sections]);

  const handleElementData = (sectionIndex, elementData) => {
    setSections((prevSections) => {
      const updatedSections = [...prevSections];
      updatedSections[sectionIndex].data.push(elementData);
      console.log("handleElementData -> Updated Sections:", updatedSections);
      return updatedSections;
    });
  };

  const handleBuildPage = () => {
    const payload = {
      title: parsedYaml.title,
      slug: parsedYaml.slug,
      meta_title: parsedYaml.metadata.metaTitle,
      meta_description: parsedYaml.metadata.metaDescription,
      keywords: parsedYaml.metadata.keywords,
      sections,
    };
    // Here you can pass the payload to the ConfirmButton or handle submission
  };

  const handleDuplicateElement = (sectionIndex, element) => {
    console.log("handleDuplicateElement -> Current Sections:", sections);
    console.log("handleDuplicateElement -> Element to duplicate:", element);
    setSections((prevSections) => {
      const updatedSections = [...prevSections];
      const duplicatedElement = {
        ...element,
        _id: uuidv4(),
      };

      console.log(
        "handleDuplicateElement -> Duplicated element:",
        duplicatedElement
      );

      updatedSections[sectionIndex].data.push(duplicatedElement);
      return updatedSections;
    });
  };

  return (
    <div className="p-4">
      {/* {parsedYaml.sections?.map((section, sectionIndex) => ( */}
      {sections?.map((section, sectionIndex) => (
        <div key={section._id} className="mb-6">
          <h2 className="text-xl font-bold mb-2">{section.sectionTitle}</h2>
          {section.data?.map((element) => {
            switch (element.type) {
              case "title":
                return (
                  <TextComponent
                    key={element._id}
                    data={element}
                    onDataChange={(data) =>
                      handleElementData(sectionIndex, data)
                    }
                    onDuplicateElement={() =>
                      handleDuplicateElement(sectionIndex, element)
                    }
                  />
                );
              case "description":
                return (
                  <ParagraphComponent
                    key={element._id}
                    data={element}
                    onDataChange={(data) =>
                      handleElementData(sectionIndex, data)
                    }
                  />
                );
              case "media":
                return (
                  <MediaComponent
                    key={element._id}
                    data={element}
                    onDataChange={(data) =>
                      handleElementData(sectionIndex, data)
                    }
                  />
                );
              case "menu":
                return (
                  <MenuComponent
                    key={element._id}
                    data={element}
                    onDataChange={(data) =>
                      handleElementData(sectionIndex, data)
                    }
                  />
                );
              case "navbar":
                return (
                  <NavbarComponent
                    key={element._id}
                    data={element}
                    onDataChange={(data) =>
                      handleElementData(sectionIndex, data)
                    }
                  />
                );
              case "slider":
                // SliderComponent removed - not needed for this system
                return null;
              case "card":
                return (
                  <CardComponent
                    key={element._id}
                    data={element}
                    onDataChange={(data) =>
                      handleElementData(sectionIndex, data)
                    }
                  />
                );
              case "footer":
                return (
                  <FooterComponent
                    key={element._id}
                    data={element}
                    onDataChange={(data) =>
                      handleElementData(sectionIndex, data)
                    }
                  />
                );
              default:
                return null;
            }
          })}
        </div>
      ))}
      <JsonPreview sections={sections} />
      <ConfirmButton
        payload={
          {
            /* Construct your payload here */
          }
        }
      />
    </div>
  );
};

export default PageBuilder;
