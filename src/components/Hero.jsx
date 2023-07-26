import { logo } from "../assets";

const Hero = () => {
  return (
    <header className="w-full flex justify-center items-center flex-col">
      <nav className="flex justify-between items-center w-full mb-10 pt-3  ">
        <img src={logo} alt="sumz_logo" className="w-28 object-contain" />

        <button
          type="button"
          className="black_btn"
          onClick={() => window.open("https://github.com/abuhuraira3003")}
        >
          Github
        </button>
      </nav>

      {/* Heading */}
      <h1 className="head_text">
        Summarize Article with
        <br className="max-md:hidden" />
        <span className="orange_gradient"> openAI GPT-4</span>
      </h1>
      <h2 className="desc">
        Simplify your reading with Summize, an open-source article summarizer
        that transforms lengthy articles into clear and concise summaries
      </h2>
    </header>
  );
};

export default Hero;
