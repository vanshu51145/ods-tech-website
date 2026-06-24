import "./Hero.css";
import { motion } from "framer-motion";


function Hero() {

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



<<<<<<< HEAD

=======
>>>>>>> 13c96ebf87c72708f2e6004bea570e5f4bc056a0
<div className="hero-buttons">


<button className="primary-btn">
Explore Services
</button>


<button className="secondary-btn">
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
<<<<<<< HEAD
 <img
  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
  alt="Developer"
/>
=======
>>>>>>> 13c96ebf87c72708f2e6004bea570e5f4bc056a0





</motion.div>



</section>

)

}


export default Hero;