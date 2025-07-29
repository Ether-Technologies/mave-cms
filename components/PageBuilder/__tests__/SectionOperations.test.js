// components/PageBuilder/__tests__/SectionOperations.test.js

/**
 * Test file for section duplicate and delete operations
 * This file contains test cases to verify the functionality works correctly
 */

// Mock data for testing
const mockPageData = {
    id: "test-page",
    title: "Test Page",
    body: [
        {
            _id: "section_1",
            title: "Section 1",
            sectionTitle: "Section 1",
            data: [
                {
                    _id: "component_1",
                    type: "text",
                    value: "Test component 1",
                },
            ],
        },
        {
            _id: "section_2",
            title: "Section 2",
            sectionTitle: "Section 2",
            data: [
                {
                    _id: "component_2",
                    type: "button",
                    value: "Test component 2",
                },
            ],
        },
    ],
};

// Test section duplication
const testSectionDuplicate = (pageData, sectionIndex) => {
    if (!pageData || !pageData.body) {
        throw new Error("No page data available");
    }

    if (sectionIndex < 0 || sectionIndex >= pageData.body.length) {
        throw new Error("Invalid section index");
    }

    const sectionToDuplicate = pageData.body[sectionIndex];
    const duplicatedSection = {
        ...sectionToDuplicate,
        _id: `section_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: `${sectionToDuplicate.title} (Copy)`,
        sectionTitle: `${sectionToDuplicate.sectionTitle} (Copy)`,
    };

    const updatedPageData = {
        ...pageData,
        body: [
            ...pageData.body.slice(0, sectionIndex + 1),
            duplicatedSection,
            ...pageData.body.slice(sectionIndex + 1),
        ],
    };

    return updatedPageData;
};

// Test section deletion
const testSectionDelete = (pageData, sectionIndex) => {
    if (!pageData || !pageData.body) {
        throw new Error("No page data available");
    }

    if (sectionIndex < 0 || sectionIndex >= pageData.body.length) {
        throw new Error("Invalid section index");
    }

    const updatedPageData = {
        ...pageData,
        body: pageData.body.filter((_, index) => index !== sectionIndex),
    };

    return updatedPageData;
};

// Test cases
describe("Section Operations", () => {
    test("should duplicate a section correctly", () => {
        const result = testSectionDuplicate(mockPageData, 0);

        expect(result.body).toHaveLength(3); // Original 2 + 1 duplicated
        expect(result.body[1].title).toBe("Section 1 (Copy)");
        expect(result.body[1]._id).not.toBe("section_1");
        expect(result.body[1].data).toEqual(mockPageData.body[0].data);
    });

    test("should delete a section correctly", () => {
        const result = testSectionDelete(mockPageData, 0);

        expect(result.body).toHaveLength(1);
        expect(result.body[0].title).toBe("Section 2");
    });

    test("should handle invalid section index for duplication", () => {
        expect(() => testSectionDuplicate(mockPageData, 5)).toThrow("Invalid section index");
    });

    test("should handle invalid section index for deletion", () => {
        expect(() => testSectionDelete(mockPageData, 5)).toThrow("Invalid section index");
    });

    test("should handle null page data", () => {
        expect(() => testSectionDuplicate(null, 0)).toThrow("No page data available");
        expect(() => testSectionDelete(null, 0)).toThrow("No page data available");
    });
});

export { testSectionDuplicate, testSectionDelete }; 