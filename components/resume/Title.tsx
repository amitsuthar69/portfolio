const Title = ({ titleInfo }: any) => {
  return (
    <div className="pb-2 w-[100%]">
      <div className="text-center">
        <h1>
          {titleInfo.name}
        </h1>
      </div>
      <ul className="flex justify-center gap-4 md:gap-10">
        {titleInfo.links.map((link: any, i: number) =>
          <li
            key={i}
            className="text-lg font-bold text-primary-500 hover:underline dark:hover:decoration-theme-100 hover:decoration-theme-900 decoration-dashed underline-offset-4"
          >
            <a href={String(Object.values(link))} target="_blank">
              {Object.keys(link)}
            </a>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Title;
