import { VelocityScroll } from "~/components/magicui/scroll-based-velocity";

function Banner() {
  return (
    <VelocityScroll
      text="Nex Gen Courier Service"
      default_velocity={2}
      className="text-center text-4xl font-bold tracking-[-0.02em] text-black drop-shadow-sm dark:text-white md:text-7xl md:leading-[5rem]"
    />
  );
}

export default Banner;
