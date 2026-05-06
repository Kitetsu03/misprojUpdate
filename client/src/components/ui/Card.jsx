import { motion } from "framer-motion";

function Card({ title, icon, value, desc, info }) {
  const cardSpring = { type: "spring", stiffness: 300, damping: 26 };
  const iconHover = { rotate: 12, scale: 1.05 };
  const cardAnim = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
  };
  return (
    <motion.div
      className="card p-5 h-full rounded-2xl text-green-950 sm:h-fit sm:min-h-48 flex flex-col"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.99 }}
      transition={cardSpring}
      initial={cardAnim.initial}
      animate={cardAnim.animate}
    >
      <div className="flex justify-between items-start">
        <h2 className="font-semibold text-2xl">{title}</h2>
        <motion.span whileHover={iconHover} transition={{ duration: 0.15 }}>
          {icon}
        </motion.span>
      </div>

      <div className="mt-3">
        <p className="text-sm">{info}</p>
      </div>

      <div className="mt-auto text-green-950">
        <h3 className="text-3xl">{value}</h3>
        <p className="text-sm">{desc}</p>
      </div>
    </motion.div>
  );
}

export default Card;
