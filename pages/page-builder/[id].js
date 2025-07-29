// pages/page-builder/[id].js

import React from "react";
import { useRouter } from "next/router";
import PageBuilder from "../../components/PageBuilder/PageBuilder";

const PageBuilderPage = () => {
  const router = useRouter();
  const { id, edit } = router.query;

  // Ensure the page ID is available before rendering
  if (!id) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="mavecontainer">
        <PageBuilder pageId={id} editMode={edit === 'true'} />
      </div>
    </>
  );
};

export default PageBuilderPage;
