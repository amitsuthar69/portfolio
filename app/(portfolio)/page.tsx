import { NextPage } from "next";
import SocialHome from "../../components/common/SocialHome";
import Pattern from "../../components/desing/Pattern";
import PageWrapper from "../(providers)/PageWrapper";
import Markdown from "markdown-to-jsx";
import getIntroMetadata from "../../libs/Metadata/getIntroMetadata";
import matter from "gray-matter";

const page: NextPage = () => {
  const intro = getIntroMetadata();
  const content = matter(intro.slug);

  return (
    <PageWrapper>
      <main>
        <div>
          <Pattern />
          <div className="flex flex-wrap justify-between pt-2">
            <h1>
              {intro.name}
            </h1>
            <SocialHome />
          </div>
          <h2 className="text-xl font-bold text-transparent max-w-max mb-7 md:text-2xl bg-clip-text bg-gradient-to-r from-primary-500 to-ternary-500 dark:text-transparent">
            {intro.title}
          </h2>
          <Markdown className="text-base prose lg:text-xl dark:prose-invert">
            {content.content}
          </Markdown>
        </div>
      </main>
    </PageWrapper>
  );
};

export default page;
