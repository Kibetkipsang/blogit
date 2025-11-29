import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, TrendingUp, Users, FileText, Star, Shield, Zap, Calendar, CheckCircle } from "lucide-react";
import { Button } from "../ui/button";
import api from "@/axios";
import { useState, useEffect } from "react";

type BlogType = {
  id: string;
  title: string;
  synopsis: string;
  featuredImageUrl: string;
  createdAt: string;
  category?: {
    name: string;
  };
};

type StatsType = {
  totalBlogs: number;
  totalUsers: number;
  totalCategories: number;
};

// Fixed fetch function - handle both response structures
const fetchFeaturedBlogs = async (): Promise<BlogType[]> => {
  try {
    const res = await api.get("/blogs");
    console.log("Featured blogs API response:", res.data); // Debug log
    
    // Handle different response structures
    if (res.data && Array.isArray(res.data.blogs)) {
      return res.data.blogs.slice(0, 3); // New structure with blogs array
    } else if (Array.isArray(res.data)) {
      return res.data.slice(0, 3); // Old structure (direct array)
    } else {
      console.error("Unexpected API response structure:", res.data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching featured blogs:", error);
    return [];
  }
};

const fetchStats = async (): Promise<StatsType> => {
  const res = await api.get("/stats");
  return res.data;
};

function Home() {
  const [stats, setStats] = useState<StatsType>({ totalBlogs: 0, totalUsers: 0, totalCategories: 0 });
  
  const { data: featuredBlogs, isLoading: blogsLoading, error: blogsError } = useQuery({
    queryKey: ["featured-blogs"],
    queryFn: fetchFeaturedBlogs,
  });

  // Debug logs to see what's happening
  useEffect(() => {
    console.log("Featured blogs data:", featuredBlogs);
    console.log("Blogs loading:", blogsLoading);
    console.log("Blogs error:", blogsError);
  }, [featuredBlogs, blogsLoading, blogsError]);

  // Animated counter for stats
  useEffect(() => {
    const targetStats = {
      totalBlogs: 1250,
      totalUsers: 8500,
      totalCategories: 15,
    };

    const duration = 2000;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);

    let frame = 0;
    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;

      setStats({
        totalBlogs: Math.floor(targetStats.totalBlogs * progress),
        totalUsers: Math.floor(targetStats.totalUsers * progress),
        totalCategories: Math.floor(targetStats.totalCategories * progress),
      });

      if (frame === totalFrames) clearInterval(counter);
    }, frameDuration);

    return () => clearInterval(counter);
  }, []);

  const features = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Lightning Fast",
      description: "Optimized performance with instant load times and seamless user experience",
      color: "from-red-500 to-red-600"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with 99.9% uptime guarantee and data protection",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "SEO Optimized",
      description: "Built-in SEO tools to help your content rank higher and reach more readers",
      color: "from-red-500 to-green-500"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Content Marketing Director",
      company: "TechGrowth Inc",
      content: "BlogIt transformed our content strategy. Our engagement increased by 300% in just 3 months!",
      avatar: "SJ"
    },
    {
      name: "Michael Chen",
      role: "Senior Editor",
      company: "Digital Pulse",
      content: "The analytics and user experience are unmatched. Our writers love the intuitive interface.",
      avatar: "MC"
    },
    {
      name: "Emily Rodriguez",
      role: "Blog Manager",
      company: "Creative Minds",
      content: "From setup to scaling, BlogIt made content management effortless. Highly recommended!",
      avatar: "ER"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/20">
              <Star className="h-4 w-4 text-green-400" />
              <span className="text-sm font-medium">Trusted by 8,500+ content creators</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-6xl font-bold mb-6 leading-tight">
              Where Great
              <span className="bg-gradient-to-r from-red-500 to-green-500 bg-clip-text text-transparent"> Stories </span>
              Live Forever
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              The ultimate platform for writers, thinkers, and storytellers. Create, share, and connect 
              with a global audience through powerful, SEO-optimized blogging.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                asChild 
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 text-lg h-auto rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                <Link to="/register" className="flex items-center gap-2">
                  Start Writing Free
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button 
                asChild
                variant="outline" 
                className="border-white text-black hover:bg-gray-200 hover:text-black px-8 py-3 text-lg h-auto rounded-lg font-semibold transition-all duration-300"
              >
                <Link to="/blogs" className="flex items-center gap-2">
                  Explore Blogs
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-green-400 mb-2">
                  {stats.totalBlogs}+
                </div>
                <div className="text-gray-400 font-medium">Published Blogs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-red-400 mb-2">
                  {stats.totalUsers}+
                </div>
                <div className="text-gray-400 font-medium">Active Writers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  {stats.totalCategories}+
                </div>
                <div className="text-gray-400 font-medium">Categories</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need to 
              <span className="bg-gradient-to-r from-red-500 to-green-500 bg-clip-text text-transparent"> Succeed</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to help you create, publish, and grow your audience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group p-8 rounded-2xl border border-gray-200 hover:border-transparent hover:shadow-2xl hover:scale-105 transition-all duration-300 bg-gradient-to-br from-white to-gray-50"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Blogs Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Featured 
              <span className="bg-gradient-to-r from-green-500 to-red-500 bg-clip-text text-transparent"> Content</span>
            </h2>
            <p className="text-xl text-gray-600">Discover trending articles from our community</p>
          </div>

          {blogsLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading featured blogs...</p>
            </div>
          ) : blogsError ? (
            <div className="text-center py-12">
              <p className="text-red-600">Failed to load featured blogs</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="mt-4 bg-green-600 hover:bg-green-700"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredBlogs && featuredBlogs.length > 0 ? (
                featuredBlogs.map((blog) => (
                  <div key={blog.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-xl transition-all duration-300">
                    {blog.featuredImageUrl && (
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={blog.featuredImageUrl} 
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      {/* Fixed category display */}
                      {blog.category && blog.category.name && (
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-3">
                          {blog.category.name}
                        </span>
                      )}
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {blog.synopsis}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </span>
                        <Link 
                          to={`/blogs/${blog.id}`}
                          className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1 transition-colors"
                        >
                          Read More
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No featured blogs available</p>
                  <Button asChild className="mt-4 bg-green-600 hover:bg-green-700">
                    <Link to="/blogs">Explore All Blogs</Link>
                  </Button>
                </div>
              )}
            </div>
          )}

          <div className="text-center mt-12">
            <Button asChild className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg rounded-lg">
              <Link to="/blogs" className="flex items-center gap-2">
                View All Blogs
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Loved by 
              <span className="bg-gradient-to-r from-red-500 to-green-500 bg-clip-text text-transparent"> Writers</span>
            </h2>
            <p className="text-xl text-gray-600">See what our community has to say</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 border border-gray-200 hover:border-green-300 transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                    <p className="text-green-600 text-sm font-medium">{testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
                <div className="flex text-yellow-400 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-black to-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Ready to Start Your
            <span className="bg-gradient-to-r from-red-500 to-green-500 bg-clip-text text-transparent"> Writing Journey</span>?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of writers who trust BlogIt to share their stories with the world. 
            No credit card required.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              asChild 
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 text-lg h-auto rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              <Link to="/register" className="flex items-center gap-2">
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button 
              asChild
              variant="outline" 
              className="border-white text-black hover:bg-gray-200 hover:text-black px-8 py-4 text-lg h-auto rounded-lg font-semibold transition-all duration-300"
            >
              <Link to="/blogs" className="flex items-center gap-2">
                Explore Platform
              </Link>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              Setup in 5 minutes
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              Free forever plan
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;