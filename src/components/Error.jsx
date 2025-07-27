import defaultErrorImage from "../assets/error.svg";

function Error({ code = "Error", message = "Something went wrong. Please try again later.", image = defaultErrorImage }) {
  return (
    <div className='flex flex-col items-center justify-center h-[90vh] text-center px-4'>
      <h1 className='text-6xl md:text-8xl font-extrabold text-gray-800'>{code}</h1>

      <img src={image} alt='Error Illustration' className='w-full max-w-md relative' />

      <p className='text-base md:text-lg text-gray-600 max-w-xl'>
        {message}
      </p>
    </div>
  );
}

export default Error;
