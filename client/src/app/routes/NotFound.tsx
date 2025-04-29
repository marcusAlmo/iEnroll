import Image from "../../assets/404.png";

const NotFound = () => {
  return (
    <div className="full-screen flex flex-col justify-center items-center gap-y-2">
      <div className="md:mt-24 mt-48">
        <h1 className="text-center lg:text-9xl text-8xl font-bold text-accent">404</h1>
        <p className="text-center font-semibold text-primary text-base lg:text-2xl">OOPSIES ... page not found</p>
      </div>
      <div className="mb-0 mt-auto">
        <img src={Image} alt="Student thinking" className="md:w-72 w-48" />
      </div>
    </div>
  )
}

export default NotFound;