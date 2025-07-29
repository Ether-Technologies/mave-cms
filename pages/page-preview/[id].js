// pages/page-preview/[id].js

import React from "react";
import { useRouter } from "next/router";
import PagePreview from "../../components/PageBuilder/PagePreview";

const PagePreviewPage = () => {
    const router = useRouter();
    const { id } = router.query;

    // Ensure the page ID is available before rendering
    if (!id) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="mavecontainer">
                <PagePreview pageId={id} />
            </div>
        </>
    );
};

export default PagePreviewPage; 