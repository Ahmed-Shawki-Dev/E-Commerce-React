import { Link, useLocation } from "react-router-dom";

interface IProps {
  statusCode?: number;
  title?: string;
}

const ErrorHandler = ({ statusCode = 500, title = "Server Error" }: IProps) => {
  const { pathname } = useLocation();

  return (
    <div className="fixed inset-0 flex w-full items-center justify-center p-5">
      <div className="text-center">
        <div className="bg-error/10 inline-flex rounded-full p-4">
          <div className="stroke-error bg-error/20 rounded-full p-4">
            <svg
              className="h-16 w-16"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 8H6.01M6 16H6.01M6 12H18C20.2091 12 22 10.2091 22 8C22 5.79086 20.2091 4 18 4H6C3.79086 4 2 5.79086 2 8C2 10.2091 3.79086 12 6 12ZM6 12C3.79086 12 2 13.7909 2 16C2 18.2091 3.79086 20 6 20H14"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M17 16L22 21M22 16L17 21"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </div>
        </div>
        <h2 className="mt-5 text-[36px] font-bold lg:text-[50px]">
          {statusCode} - {title}
        </h2>
        <p className="mt-5 lg:text-lg">
          Oops something went wrong. Try to refresh this page or <br /> feel
          free to contact us if the problem presists.
        </p>
        <div className="my-10 flex items-center justify-center space-x-4">
          <Link
            to={"/"}
            className="bg-primary text-surface hover:!text-surface inline-block rounded-md p-2"
            reloadDocument
          >
            Home
          </Link>
          <Link
            to={pathname}
            className="bg-primary text-surface hover:!text-surface inline-block rounded-md p-2"
            reloadDocument
          >
            Refresh
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorHandler;
