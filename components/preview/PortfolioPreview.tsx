import Link from "next/link";
import { portfolioMetadata } from "../../types/index";
import { WrappedImage } from "../images/WrappedImage";

const PortfolioPreview = (props: portfolioMetadata) => {
  return (
    <div key={props.slug}>
      <div className="w-full my-4">
        <WrappedImage
          src={"/" + props.previewImg}
          alt="img"
          className="object-cover w-full rounded-md"
          parentStyle="w-full h-44 rounded-md"
          loading="lazy"
          placeholder="blur"
          blurDataURL="/blur.svg"
          fill
        />
      </div>
      <Link href={`portfolio/${props.slug}`}>
        <h3>
          <span className="hover:underline dark:hover:decoration-white hover:decoration-black decoration-dashed underline-offset-4">
            {props.title}
          </span>
        </h3>
      </Link>
      <div className="flex justify-between">
        <p>
          {props.subtitle}
        </p>
      </div>
    </div>
  );
};

export default PortfolioPreview;
