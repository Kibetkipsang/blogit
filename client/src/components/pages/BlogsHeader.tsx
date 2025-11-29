

function BlogArticleHeader() {


  return (
   <header className="fixed top-0 left-0 w-full bg-black border-b z-40 h-20">
  <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-full">
    
    <button
      onClick={() => window.history.back()}
      className="text-green-400 font-bold hover:text-red-600 text-md flex items-center gap-1"
    >
      ← Back
    </button>

    <h1 className="text-md font-bold tracking-tight text-green-400">
      BLOG-IT
    </h1>

    <button className="text-green-400 font-bold hover:text-red-600 text-md">⤴︎ Share</button>

  </div>
</header>

  );
}

export default BlogArticleHeader;
