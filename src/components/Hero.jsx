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





</motion.div>



</section>

)

}


export default Hero;