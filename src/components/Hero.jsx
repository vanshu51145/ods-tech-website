import "./Hero.css";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  return (

    <section className="hero">


      <motion.div

        className="hero-content"

        initial={{
          opacity: 0,
          x: -50
        }}

        animate={{
          opacity: 1,
          x: 0
        }}

        transition={{
          duration: 1
        }}

      >


        <h1>
          Transforming Ideas Into Digital Solutions
        </h1>


        <p>
          ODS Network is a leading IT solutions 
          company providing Web Development, 
          Mobile Applications, Digital Marketing,
           UI/UX Design, Cloud Services, and 
           Software Development to help businesses 
           achieve digital success.
        </p>




        <div className="hero-buttons">


          <button
            className="primary-btn"
            onClick={() => navigate("/services")}
          >
            Explore Services
          </button>

          <button
            className="secondary-btn"
            onClick={() => navigate("/contact")}
          >
            Get In Touch
          </button>


        </div>


      </motion.div>




      <motion.div

        className="hero-image"

        initial={{
          opacity: 0,
          x: 50
        }}

        animate={{
          opacity: 1,
          x: 0
        }}

        transition={{
          duration: 1
        }}

      >
        <img
          src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"
          alt="ODS Network Web Development Services"
  fetchPriority="high"
        />





      </motion.div>



    </section>

  )

}


export default Hero;