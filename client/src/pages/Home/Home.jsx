import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Mail,
  ArrowRight,
  Search,
} from "lucide-react";
import MealsByCategory from "@/components/meals/MealsByCategory";
import HowItWorks from "@/components/home/HowItWorks";
import MembershipBenefits from "@/components/home/MembershipBenefits";
import MembershipPackages from "@/components/home/MembershipPackages";

const slides = [
  {
    id: 1,
    title: "Delicious Meals at Your Doorstep",
    description:
      "Experience the finest hostel dining with our carefully curated meals",
    image:
      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: 2,
    title: "Fresh & Healthy Options",
    description:
      "Nutritious meals prepared with fresh ingredients for your well-being",
    image:
      "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: 3,
    title: "Community Dining Experience",
    description: "Join our community of food lovers and enjoy meals together",
    image:
      "https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/meals?search=${searchTerm}`);
    }
  };

  // Auto-advance slides
  useState(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="relative h-[calc(100vh-64px)] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative h-full"
          >
            <motion.div
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 10 }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
            >
              <div className="absolute inset-0 bg-black/50" />
            </motion.div>

            {/* Content */}
            <div className="relative h-full flex items-center justify-center">
              <div className="container mx-auto px-4 text-center text-white">
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl md:text-6xl font-bold mb-4"
                >
                  {slides[currentSlide].title}
                </motion.h1>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto"
                >
                  {slides[currentSlide].description}
                </motion.p>

                {/* Search Bar */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="max-w-md mx-auto"
                >
                  <form onSubmit={handleSearch} className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Search for meals..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-white/10 backdrop-blur-sm text-white placeholder:text-white/70 border-white/20"
                    />
                    <Button type="submit" className="px-8">
                      <Search className="h-5 w-5" />
                    </Button>
                  </form>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
        >
          <ChevronRight className="h-6 w-6" />
        </motion.button>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentSlide(index)}
              whileHover={{ scale: 1.2 }}
              className={`w-2 h-2 rounded-full transition-all ${
                currentSlide === index
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>

      {/* 2. Featured Meals Section */}
      <section className="py-24 bg-gray-50/50">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="container mx-auto px-4"
        >
          <motion.div
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">
              Featured Culinary Delights
            </h2>
            <p className="text-gray-600 text-lg">
              Discover our chef-curated selection of premium meals, crafted with
              the finest ingredients and exceptional culinary expertise.
            </p>
          </motion.div>
          <MealsByCategory category="featured" limit={4} />
        </motion.div>
      </section>

      {/* 3. How It Works Section */}
      <section className="py-24">
        <HowItWorks />
      </section>

      {/* 4. Membership Benefits Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50/50 to-white">
        <MembershipBenefits />
      </section>

      {/* 5. Special Promotions Section */}
      <section className="py-24">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="container mx-auto px-4"
        >
          <motion.div
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 text-gray-900">
              Exclusive Offers
            </h2>
            <p className="text-gray-700 text-lg">
              Take advantage of our limited-time premium offers designed for our
              valued members.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              variants={fadeInUp}
              className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 hover:border-primary/20 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative p-8 md:p-12">
                <div className="mb-8">
                  <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4">
                    Student Exclusive
                  </span>
                  <h3 className="text-3xl font-bold mb-4 text-gray-900">
                    Elite Student Package
                  </h3>
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-4xl font-bold text-primary">15%</span>
                    <span className="text-xl text-gray-600">OFF</span>
                  </div>
                  <p className="text-gray-700 text-lg mb-8">
                    Enjoy premium meal plans at student-friendly prices. Valid
                    student ID required. Experience luxury dining without
                    compromising your budget.
                  </p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center text-gray-700">
                      <svg
                        className="w-5 h-5 text-primary mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Access to all premium meals
                    </li>
                    <li className="flex items-center text-gray-700">
                      <svg
                        className="w-5 h-5 text-primary mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Priority seating
                    </li>
                    <li className="flex items-center text-gray-700">
                      <svg
                        className="w-5 h-5 text-primary mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Special event invitations
                    </li>
                  </ul>
                </div>
                <Button
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-white font-semibold"
                >
                  Claim Offer <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="group relative overflow-hidden rounded-2xl bg-gray-900 text-white"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative p-8 md:p-12">
                <div className="mb-8">
                  <span className="inline-block px-4 py-2 rounded-full bg-white/10 text-white font-semibold text-sm mb-4">
                    Corporate Package
                  </span>
                  <h3 className="text-3xl font-bold mb-4">
                    Business Excellence
                  </h3>
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-4xl font-bold text-white">20%</span>
                    <span className="text-xl text-gray-300">OFF</span>
                  </div>
                  <p className="text-gray-300 text-lg mb-8">
                    Premium group dining solution for businesses. Perfect for
                    team lunches, corporate events, and client meetings. Minimum
                    group size of 5.
                  </p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center text-gray-300">
                      <svg
                        className="w-5 h-5 text-white mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Dedicated corporate account manager
                    </li>
                    <li className="flex items-center text-gray-300">
                      <svg
                        className="w-5 h-5 text-white mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Customizable meal plans
                    </li>
                    <li className="flex items-center text-gray-300">
                      <svg
                        className="w-5 h-5 text-white mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Private dining areas
                    </li>
                  </ul>
                </div>
                <Button
                  size="lg"
                  className="w-full bg-white hover:bg-white/90 text-gray-900 font-semibold"
                >
                  Learn More <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* 6. Membership Packages Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50/50 to-white">
        <MembershipPackages />
      </section>

      {/* 7. Customer Reviews Section */}
      <section className="py-24">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="container mx-auto px-4"
        >
          <motion.div
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Member Testimonials</h2>
            <p className="text-gray-600 text-lg">
              Discover what our esteemed members have to say about their premium
              dining experience.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((review) => (
              <motion.div
                key={review}
                variants={fadeInUp}
                className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)] transition-shadow duration-300"
              >
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-700 text-lg mb-6 italic">
                  &ldquo;The culinary excellence and premium service at Hostel
                  Harmony have exceeded all my expectations. A truly exceptional
                  dining experience.&ldquo;
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-full mr-4 flex items-center justify-center text-white font-bold">
                    {["JD", "AR", "MS"][review - 1]}
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">
                      {
                        ["Jonathan Drake", "Alice Reynolds", "Michael Scott"][
                          review - 1
                        ]
                      }
                    </h4>
                    <p className="text-gray-600">
                      {
                        [
                          "Executive Member",
                          "Premium Diner",
                          "Corporate Member",
                        ][review - 1]
                      }
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 8. Latest Blog Posts Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50/50 to-white">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="container mx-auto px-4"
        >
          <motion.div
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Culinary Insights</h2>
            <p className="text-gray-600 text-lg">
              Explore our collection of expert articles on fine dining,
              nutrition, and lifestyle.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                image:
                  "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                title: "The Art of Fine Dining",
                description:
                  "Discover the secrets behind creating exceptional dining experiences...",
              },
              {
                image:
                  "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                title: "Nutrition for Modern Living",
                description:
                  "Learn about balanced nutrition that doesn't compromise on taste...",
              },
              {
                image:
                  "https://images.pexels.com/photos/1640775/pexels-photo-1640775.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                title: "Sustainable Gastronomy",
                description:
                  "Explore how we're making fine dining sustainable for the future...",
              },
            ].map((post, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)] transition-all duration-300 group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={post?.image}
                    alt={post?.title}
                    className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-8">
                  <h3 className="font-bold text-2xl mb-4 group-hover:text-primary transition-colors duration-300">
                    {post?.title}
                  </h3>
                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {post?.description}
                  </p>
                  <Button
                    variant="link"
                    className="p-0 font-semibold text-primary hover:text-primary/80"
                  >
                    Read Article <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 9. Newsletter Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover bg-center"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-black/70"></div>
            <div className="relative py-20 px-8 md:px-12">
              <div className="max-w-2xl mx-auto text-center text-white">
                <h2 className="text-4xl font-bold mb-6">
                  Join Our Culinary Journey
                </h2>
                <p className="text-gray-200 text-lg mb-8">
                  Subscribe to receive exclusive offers, gourmet recipes, and
                  insights from our master chefs.
                </p>
                <div className="flex flex-col md:flex-row gap-4 justify-center max-w-md mx-auto">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 md:w-72"
                  />
                  <Button
                    size="lg"
                    className="bg-white text-black hover:bg-white/90"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 10. App Download Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50/50 to-white">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="container mx-auto px-4"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <motion.div variants={fadeInUp} className="md:w-1/2">
              <h2 className="text-4xl font-bold mb-6">
                Experience Luxury On The Go
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                Download our premium mobile app to access exclusive features,
                manage your membership, and elevate your dining experience
                anytime, anywhere.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-black hover:bg-black/90 text-white"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/6/67/App_Store_%28iOS%29.svg"
                    alt="App Store"
                    className="w-6 h-6 mr-2"
                  />
                  App Store
                </Button>
                <Button
                  size="lg"
                  className="bg-black hover:bg-black/90 text-white"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Play_Arrow_logo.svg"
                    alt="Play Store"
                    className="w-6 h-6 mr-2"
                  />
                  Play Store
                </Button>
              </div>
            </motion.div>
            <motion.div variants={fadeInUp} className="md:w-1/2 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.12)]">
                <img
                  src="https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  alt="Mobile App"
                  className="w-full rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
