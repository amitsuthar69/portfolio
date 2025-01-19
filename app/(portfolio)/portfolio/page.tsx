import PortfolioPreview from "../../../components/preview/PortfolioPreview";
import UnderLine from "../../../components/common/UnderLine";
import getPortfolioMetadata from "../../../libs/Metadata/getPortfolioMetadata";
import PageWrapper from "../../(providers)/PageWrapper";

const page = () => {
  const postMetadata = getPortfolioMetadata();

  const portfolioPreview = postMetadata.map((post) => (
    <PortfolioPreview {...post} key={post.slug} />
  ));

  return (
    <PageWrapper>
      <div>
        <div>
          <h1>Projects 👨‍💻</h1>
        </div>
        <UnderLine />
        <div className="grid gap-5 md:grid-cols-2">{portfolioPreview}</div>
      </div>
    </PageWrapper>
  );
};

export default page;
