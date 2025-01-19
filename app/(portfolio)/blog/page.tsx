import PostPreview from "../../../components/preview/PostPreview";
import UnderLine from "../../../components/common/UnderLine";
import getPostMetadata from "../../../libs/Metadata/getPostMetadata";
import PageWrapper from "../../(providers)/PageWrapper";

const page = () => {
  const postMetadata = getPostMetadata();

  const postPreviews = postMetadata.map((post) => (
    <PostPreview {...post} key={post.slug} />
  ));

  return (
    <PageWrapper>
      <main className="flex flex-col gap-2">
        <h1>Blogs 📚</h1>
        <p className="text-base text-justify">
          All the blogs that I have written can be found here, mostly I'll try
          to put here all of my learnings and experiments or rather anything
          which seems cool to me
        </p>
        <UnderLine />
        <div className="flex flex-col gap-2">{postPreviews}</div>
      </main>
    </PageWrapper>
  );
};

export default page;
