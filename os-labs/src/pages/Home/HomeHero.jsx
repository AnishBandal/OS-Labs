const HomeHero = () => {
    return (
      <section className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 md:p-12 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Operating System Algorithm Visualizer</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Interactive visualizations of disk scheduling algorithms to help you understand how operating systems work
          </p>
          <div className="flex justify-center">
            <a 
              href="/disk-scheduling" 
              className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg shadow-lg transition-all duration-300 hover:scale-105"
            >
              Get Started
            </a>
          </div>
        </div>
      </section>
    );
  };
  
  export default HomeHero;