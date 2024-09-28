import React from "react";

const Navbar = () => {
  return (
    <>
    <div className="min-h-[20vh]">
      <nav className="bg-slate-800 text-white flex justify-center items-center">
        <div className="myContainer flex justify-between items-center px-4 py-6 h-16">
          <div className="logo text-xl md:text-2xl font-bold">
            <span className="text-green-800">&lt;</span>Secure
            <span className="text-green-600">IT/&gt;</span>
          </div>
          <ul>
            <li>
              <button className="flex font-bold justify-center items-center gap-2 cursor-pointer p-2 bg-green-800 text-white rounded-full hover:bg-green-700 text-md" onClick={()=>{window.location.reload()}}>
                <img
                  src="https://cdn-icons-png.flaticon.com/128/2805/2805355.png"
                  alt="reloadImage"
                  className="w-[24px] invert"
                />
                <span>Reload</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </div>
    </>
  );
};

export default Navbar;
