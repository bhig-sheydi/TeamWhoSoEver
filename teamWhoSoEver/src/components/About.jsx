import React, { useState, useEffect } from "react";

// Replace with your actual t-shirt images
import tshirt1 from "../assets/hoodie.png";
import tshirt2 from "../assets/ahood.png";
import tshirt3 from "../assets/tee.png";

function About() {
  const slides = [tshirt1, tshirt2, tshirt3];
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-rotate every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black text-gray-900 dark:text-white px-6 py-16">
      <div className="max-w-6xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-green-500">
            Faith. Boldness. Identity.
          </h2>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Team Whosoever isn’t just a brand — it’s a movement for believers who
            want to boldly wear their faith, stand apart, and make a statement
            without saying a word.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Slideshow with shadow */}
          <div className="flex justify-center relative">
            <div className="rounded-lg overflow-hidden shadow-2xl">
              <img
                src={slides[currentSlide]}
                alt={`T-shirt ${currentSlide + 1}`}
                className="w-full h-auto block"
              />
              {/* Shadow at the bottom */}
              <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-green-500 text-white p-3 rounded-lg">✝️</div>
              <div>
                <h3 className="text-xl font-semibold text-green-500">
                  Bold Faith Statements
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Each design is created to empower believers to live their faith
                  openly and proudly, transforming clothing into a declaration
                  of belief.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-green-500 text-white p-3 rounded-lg">🦁</div>
              <div>
                <h3 className="text-xl font-semibold text-green-500">
                  Courageous Living
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Wearing Team Whosoever reminds you and others that faith
                  requires boldness, conviction, and purpose in every step of
                  life.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-green-500 text-white p-3 rounded-lg">🌟</div>
              <div>
                <h3 className="text-xl font-semibold text-green-500">
                  Community & Belonging
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Join a growing family of believers who embrace faith, fashion,
                  and identity — a community where you are celebrated for
                  standing apart.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-green-500">
            Walk Boldly in Your Faith
          </h3>
          <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mt-2">
            Every piece of Team Whosoever is more than clothing — it’s a reminder
            of purpose, a conversation starter, and a symbol of unwavering belief.
            Stand out, stand firm, and live your faith daily.
          </p>
          <button className="mt-6 bg-gradient-to-r from-green-500 to-lime-400 text-black px-8 py-3 rounded-2xl font-bold hover:opacity-90 transition-transform transform hover:scale-105 shadow-xl">
            Shop the Collection
          </button>
        </div>
      </div>
    </section>
  );
}

export default About;
