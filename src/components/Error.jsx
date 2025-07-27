import defaultErrorImage from "../assets/error.svg";

function Error({ code = "Error", message = "Something went wrong. Please try again later.", image = defaultErrorImage }) {
  return (
    <div className='flex flex-col items-center justify-center h-[90vh] text-center px-4'>
      

      <img src={image} alt='Error Illustration' className='w-full max-w-md ' />
      <h1 className='text-6xl md:text-8xl font-extrabold text-gray-800 mb-2'>{code}</h1>

      <p className='text-base md:text-lg text-gray-600 max-w-xl'>
        {message}
      </p>
    </div>
  );
}

export default Error;
