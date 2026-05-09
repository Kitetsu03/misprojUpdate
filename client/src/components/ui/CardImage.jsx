import { useState } from "react";

function CardImage({ title, image, description }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Card */}
      <div
        className="card p-2 sm:p-3 rounded-2xl cursor-pointer bg-white h-full flex flex-col text-center font-secondary"
        onClick={() => image && setOpen(true)}
      >
        {/* Title */}
        <h2 className="font-semibold mb-2 text-sm sm:text-lg text-center font-secondary">
          {title}
        </h2>

        {/* Image */}
        {image && (
          <div className="bg-gray-100 rounded-xl overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-40 sm:h-60 md:h-72 object-cover rounded-xl"
            />
          </div>
        )}

        {/* Description */}
        {description && (
          <p className="text-xs sm:text-sm text-gray-500 mt-2 text-center font-secondary px-1">
            {description}
          </p>
        )}
      </div>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-2 sm:p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-[95%] sm:max-w-3xl p-3 sm:p-4 font-secondary"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={image}
              alt={title}
              className="w-full max-h-[55vh] sm:max-h-[70vh] object-contain rounded-xl"
            />

            <div className="mt-3 sm:mt-4 text-center">
              <h2 className="text-lg sm:text-xl font-bold font-secondary">
                {title}
              </h2>

              {description && (
                <p className="text-sm sm:text-base text-gray-600 mt-2 font-secondary">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CardImage;
