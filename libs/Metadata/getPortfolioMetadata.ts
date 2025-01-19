import fs from "fs";
import matter from "gray-matter";
import { portfolioMetadata } from "../../types";

const getPortfolioMetadata = (): portfolioMetadata[] => {
  const folder = "content/portfolio";
  const files = fs.readdirSync(folder);
  const markdownPosts = files.filter(file => file.endsWith(".md"));
  const posts = markdownPosts.map(fileName => {
    const fileContent = fs.readFileSync(
      `content/portfolio/${fileName}`,
      "utf8"
    );
    const matterResult = matter(fileContent);
    return {
      title: matterResult.data.title,
      date: matterResult.data.date,
      subtitle: matterResult.data.subtitle,
      previewImg: matterResult.data.imgPreview,
      slug: fileName.replace(".md", "")
    };
  });
  return posts;
};

export default getPortfolioMetadata;
