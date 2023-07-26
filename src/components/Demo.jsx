import React, { useState, useEffect } from "react";
// Icons
import { copy, linkIcon, loader, tick } from "../assets";
// Article Api Hook
import { useLazyGetSummaryQuery } from "../services/article";

const initialState = { url: "", summary: "" };

const Demo = () => {
  const [article, setArticle] = useState(initialState);
  const [allArticles, setAllArticles] = useState([]);
  const [copied, setCopied] = useState("");

  // RTK lazy query
  // getSummary() is the function which actually call to get the summary of article
  const [getSummary, { isFetching, error }] = useLazyGetSummaryQuery();

  // Load data from localStorage on mount
  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem("articles")
    );

    if (articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check first it exist in cached array or not!
    const existingArticle = allArticles.find(
      (item) => item.url === article.url
    );

    if (existingArticle) return setArticle(existingArticle);

    // "articleUrl" is the getSummary() function parameter in which we pass our current article.url as a argument|value which user write in the input field in the form.
    const { data } = await getSummary({ articleUrl: article.url });

    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };
      const updatedAllArticles = [newArticle, ...allArticles];

      // update state and local storage
      setArticle(newArticle);
      setAllArticles(updatedAllArticles);
      localStorage.setItem("articles", JSON.stringify(updatedAllArticles));
    }
  };

  // copy the url and toggle the icon for user feedback
  const handleCopy = (copyUrl) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section className="w-full max-w-xl mt-16">
      {/* Serach */}
      <div className="flex flex-col w-full gap-2">
        <form
          className="relative flex justify-center items-center"
          onSubmit={handleSubmit}
        >
          <img
            src={linkIcon}
            alt="link_icon"
            className="absolute left-0 ml-3 my-2 w-5"
          />

          <input
            type="url"
            required
            value={article.url}
            placeholder="Enter a URL"
            onChange={(e) => setArticle({ ...article, url: e.target.value })}
            className="url_input peer" // When you need to style an element based on the state of a sibling element, mark the sibling with the peer class, and use peer-* modifiers to style the target element
          />

          <button
            type="submit"
            className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700"
            disabled={isFetching}
          >
            {!isFetching ? (
              <p>↵</p>
            ) : (
              <img
                src={loader}
                alt="loader"
                className="w-5 h-5 object-contain"
              />
            )}
          </button>
        </form>

        {/* Browse URL History */}
        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
          {allArticles.map((item, i) => (
            <div
              key={`link-${i}`}
              className="link_card"
              onClick={() => setArticle(item)}
            >
              <div className="copy_btn" onClick={() => handleCopy(item.url)}>
                <img
                  src={copied === item.url ? tick : copy}
                  alt={copied === item.url ? "tick_icon" : "copy_icon"}
                  className="w-[40%] h-[40%] object-contain"
                />
              </div>
              {/* truncate : if text is long it show dots in place of it */}
              <p className="flex-1 font-satoshi font-medium text-sm text-blue-700 truncate">
                {item.url}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Display Result */}
      <div className="flex justify-center items-center my-10 max-w-full">
        {isFetching ? (
          <img src={loader} alt="loader" className="w-20 h-20 object-contain" />
        ) : error ? (
          <p className="font-inter font-bold text-black text-center">
            Well, that wasn't supposed to happen.....
            <br />
            <span className="font-satoshi font-normal text-gray-700">
              {error?.data?.error}
            </span>
          </p>
        ) : (
          article.summary && (
            <div className="flex flex-col gap-3">
              <h2 className="font-satoshi font-bold text-gray-600 text-xl">
                Article <span className="blue_gradient">Summary</span>
              </h2>
              <div className="summary_box">
                <p className="font-inter font-medium text-sm text-gray-700">
                  {article.summary}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Demo;
