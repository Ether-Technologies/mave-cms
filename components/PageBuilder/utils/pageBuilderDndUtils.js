// components/PageBuilder/utils/pageBuilderDndUtils.js

export const getSectionId = (section, index) =>
  section._id || `section-${index}`;

export const getComponentId = (component, sectionIndex, index) =>
  component._id || `component-${sectionIndex}-${index}`;

export const buildDndLookup = (body = []) => {
  const componentMap = new Map();
  const sectionIdToIndex = new Map();

  body.forEach((section, sectionIndex) => {
    const sectionId = String(getSectionId(section, sectionIndex));
    sectionIdToIndex.set(sectionId, sectionIndex);

    (section.data || []).forEach((component, index) => {
      componentMap.set(
        String(getComponentId(component, sectionIndex, index)),
        { sectionIndex, index, component }
      );
    });
  });

  return { componentMap, sectionIdToIndex };
};

export const findComponentLocation = (id, body) => {
  const lookup = buildDndLookup(body);
  return lookup.componentMap.get(String(id)) ?? null;
};

export const isSectionDragId = (id, body) => {
  const lookup = buildDndLookup(body);
  return lookup.sectionIdToIndex.has(String(id));
};

export const resolveDropSectionIndex = (overId, body) => {
  const overIdStr = String(overId);

  if (overIdStr.startsWith("section-drop-")) {
    return parseInt(overIdStr.replace("section-drop-", ""), 10);
  }

  const lookup = buildDndLookup(body);

  if (lookup.componentMap.has(overIdStr)) {
    return lookup.componentMap.get(overIdStr).sectionIndex;
  }

  if (lookup.sectionIdToIndex.has(overIdStr)) {
    return lookup.sectionIdToIndex.get(overIdStr);
  }

  return -1;
};
