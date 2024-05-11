import HomeIcon from "../../../../../public/builderIdeas/icon/HomeIcon";

export default function BreadCrump({}: {}) {
  return (
    <div className="font-inter hidden flex-wrap items-center gap-2 border-b pb-4 lg:flex">
      <div className="flex items-center gap-2">
        <HomeIcon />
        <h6 className="text-sm font-medium text-gray-700">Home</h6>
      </div>
      <div className="text-sm font-medium text-gray-600">/</div>
      <h6 className="text-sm font-medium text-gray-700">RetroPGF</h6>
      <div className="text-sm font-medium text-gray-600">/</div>
      <h6 className="text-sm font-medium text-gray-500">
        Explore Project Idea
      </h6>
    </div>
  );
}
