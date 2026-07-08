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
opacity:0,
x:-50
}}

animate={{
opacity:1,
x:0
}}

transition={{
duration:1
}}

>


<h1>
Transforming Ideas Into Digital Solutions
</h1>


<p>
ODS Network creates modern websites,
web applications, and digital solutions
that help businesses grow in the digital world.
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
opacity:0,
x:50
}}

animate={{
opacity:1,
x:0
}}

transition={{
duration:1
}}

>
 <img
  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
  loading="lazy"
/>





</motion.div>



</section>

)

}


export default Hero;