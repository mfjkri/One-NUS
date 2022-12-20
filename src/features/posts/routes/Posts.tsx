import { useState } from "react";

import { SpinnerWithBackground } from "components/Elements";
import { ContentLayout } from "components/Layout";
import { PagePaginator, PageSortBy } from "components/Pagination";

import { useAuth } from "lib/auth";
import { POSTS_PER_PAGE } from "config";

import { PostsList } from "../components/PostsList";
import { usePosts } from "../api/getPosts";
import { SortTypes } from "../types";

export const Posts = () => {
  const { user } = useAuth();

  // TODO Add pageNumber and filterTag selectors
  const [pageNumber, setPageNumber] = useState(1);
  // eslint-disable-next-line
  const [perPage, setPerPage] = useState(POSTS_PER_PAGE);
  const [sortBy, setSortBy] = useState(SortTypes[SortTypes.ByNew]);
  // eslint-disable-next-line
  const [filterTag, setFilterTag] = useState("-");

  const postsQuery = usePosts({
    data: {
      perPage: perPage,
      pageNumber: pageNumber,
      sortBy: sortBy,
      filterTag: filterTag,
    },
  });

  if (!user) return null;

  if (postsQuery.isLoading) {
    return <SpinnerWithBackground size="lg" />;
  }

  if (!postsQuery.data) return null;

  return (
    <ContentLayout title="">
      <div className="float-right">
        <PageSortBy
          sortOptions={[
            [SortTypes[SortTypes.byHot], "hot", "Sort by replies count"],
            [SortTypes[SortTypes.ByNew], "new", "Sort by creation date"],
            [
              SortTypes[SortTypes.byRecent],
              "recent",
              "Sort by lastest replies",
            ],
          ]}
          activeSortOption={sortBy}
          setSortOption={(sortOption: string) => {
            setSortBy(sortOption);
            setPageNumber(1);
          }}
        />
      </div>
      <div className="mt-3 clear-both">
        <PostsList posts={postsQuery.data.posts} user={user} />
        <div className="mt-5">
          <PagePaginator
            pageNumber={pageNumber}
            maxPageNumber={Math.ceil(postsQuery.data.postsCount / perPage)}
            goToPage={setPageNumber}
          />
        </div>
      </div>
    </ContentLayout>
  );
};
