import { FaWhatsapp } from "react-icons/fa";
import "./WhatsAppWidget.css";

function WhatsAppWidget() {
  const phone = "+91 98013 51931"; // 
  const message = encodeURIComponent(
    "Hi ODS Network, I would like to inquire about your services."
  );

  return (
    <a
      href={`https://wa.me/${phone}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-widget"
    >
      <FaWhatsapp size={34} />
    </a>
  );
}

export default WhatsAppWidget;