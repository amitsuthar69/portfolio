import Link from "next/link";
import { postMetadata } from "../../types/index";

const PostPreview = (props: postMetadata) => {
  return (
    <div
      key={props.slug}
      className="px-2 py-1 transition ease-in-out rounded-lg hover:dark:bg-[#313131] hover:bg-primary-100 hover:-translate-y-1 cursor-pointer"
    >
      <Link href={`blog/${props.slug}`}>
        <h3>
          <span className="">
            {props.title}
          </span>
        </h3>
      </Link>
      <div className="flex flex-wrap justify-between">
        <span>
          {props.subtitle}
        </span>
        <span>
          {props.date}
        </span>
      </div>
    </div>
  );
};

export default PostPreview;
