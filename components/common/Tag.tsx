import clsx from "clsx";

const Tag = ({ tagString, className }: any) => {
  return (
    <div className={clsx(`px-1 rounded-sm bg-theme-500 ${className}`)}>
      {tagString}
    </div>
  );
};

export default Tag;
