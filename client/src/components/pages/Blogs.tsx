import BlogCard from "./BlogCard";

function Blogs(){
    return(
        <div className="min-h-screen bg-gray-100 p-8 flex flex-col gap-6 mt-24">
            <BlogCard
                blogId="1"
                title="Sample Blog Title"
                synopsis="This is a brief synopsis of the blog post."
                featuredImageUrl="https://via.placeholder.com/400x200"
                authorName="John Doe"
                createdAt="2024-01-01"
            />
        </div>
    )
}

export default Blogs;