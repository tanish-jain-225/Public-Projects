// Imports 
import React, { useEffect } from "react";
import { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Manager component
const Manager = () => {
  const ref = useRef();
  const passwordRef = useRef();
  const [form, setform] = useState({ site: "", username: "", password: "" });
  const [passwordArray, setpasswordArray] = useState([]);
  const port = 3000;
  const serverType = "http"

  const getPasswords = async () => {
    let req = await fetch(`${serverType}://localhost:${port}/`);
    let passwords = await req.json();
    setpasswordArray(passwords);
  };

  useEffect(() => {
    getPasswords();
  }, []);

  const showPassword = () => {
    if (ref.current.src.includes("icons/eye-cross.png")) {
      ref.current.src = "icons/show.png";
      passwordRef.current.type = "password";
    } else {
      ref.current.src = "icons/eye-cross.png";
      passwordRef.current.type = "text";
    }
  };

  const savePassword = async () => {
    if (form.site.length > 0 && form.username.length > 0 && form.password.length > 0) {
      const newPassword = { ...form, id: uuidv4() };
      setpasswordArray([...passwordArray, newPassword]);

      await fetch(`${serverType}://localhost:${port}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPassword),
      });

      setform({ site: "", username: "", password: "" });
      toast("Password Saved!", {
        position: "top-right",
        autoClose: "4000",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else {
      toast("Error: Data Not Saved!", {
        position: "top-right",
        autoClose: "4000",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  const editPassword = async (id) => {
    const passwordToEdit = passwordArray.find((item) => item.id === id);
    setform(passwordToEdit);
    setpasswordArray(passwordArray.filter((item) => item.id !== id));
    await fetch(`${serverType}://localhost:${port}/`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  };

  const deletePassword = async (id) => {
    let c = confirm("Do You Really Want To Delete?");
    if (c === true) {
      setpasswordArray(passwordArray.filter((item) => item.id !== id));

      await fetch(`${serverType}://localhost:${port}/`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      toast("Password Deleted!", {
        position: "top-right",
        autoClose: "4000",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    toast("Copied to clipboard!", {
      position: "top-right",
      autoClose: "4000",
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="md:myContainer min-h-[70vh] flex flex-col p-2 custom-container">
        <h1 className="text-2xl font-bold text-center">
          <span className="text-green-800">&lt;</span>Secure
          <span className="text-green-600">IT/&gt;</span>
        </h1>
        <p className="text-green-800 text-xl text-center font-bold">
          Web Password Manager
        </p>
        <div className="text-black flex flex-col p-4 gap-4 items-center justify-center w-[100%]">
          <input
            className="rounded-full border border-green-500 w-full py-2 px-4"
            type="text"
            id="site"
            name="site"
            value={form.site}
            onChange={handleChange}
            placeholder="Enter Website URL"
          />

          <input
            className="rounded-full border border-green-500 w-full py-2 px-4"
            type="text"
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Enter Username"
          />
          <div className="relative w-full">
            <input
              className="rounded-full border border-green-500 w-full py-2 px-4"
              type="password"
              id="password"
              name="password"
              ref={passwordRef}
              value={form.password}
              onChange={handleChange}
              placeholder="Enter Password"
            />
            <span
              className="absolute right-0 top-0 cursor-pointer"
              onClick={showPassword}
            >
              <img
                ref={ref}
                src="/icons/show.png"
                alt="show"
                className="m-2 w-[28px]"
              />
            </span>
          </div>
          <button
            onClick={savePassword}
            className="flex justify-center items-center gap-2 bg-green-500 rounded-full px-4 py-2 w-fit hover:bg-green-400 border border-green-600 text-md"
          >
            <lord-icon
              src="https://cdn.lordicon.com/jgnvfzqg.json"
              trigger="hover"
            ></lord-icon>
            Save
          </button>
        </div>
        <div className="passwords w-full p-[2px]">
          <h2 className="font-bold text-xl py-4 text-center">
            Your Passwords
          </h2>
          {passwordArray.length === 0 && (
            <div className="text-center py-2">"No Passwords To Show"</div>
          )}
          {passwordArray.length !== 0 && (
            <table className="w-full">
              <thead className="bg-green-800 text-white w-full">
                <tr className="w-full">
                  <th className="p-[4px]">Site</th>
                  <th className="p-[4px]">Username</th>
                  <th className="p-[4px]">Password</th>
                  <th className="p-[4px]">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-green-200 w-full">
                {passwordArray.map((item, index) => {
                  return (
                    <tr key={index} className="border-2 border-white w-full">
                      <td className="p-[4px]">
                        <div
                          className="flex items-center justify-center gap-[4px] cursor-pointer"
                          onClick={() => {
                            copyText(item.site);
                          }}
                        >
                          <span className="w-[50px] overflow-auto">
                            {item.site}
                          </span>
                          <lord-icon
                            src="https://cdn.lordicon.com/depeqmsz.json"
                            trigger="hover"
                            style={{ width: "18px", cursor: "pointer" }}
                          ></lord-icon>
                        </div>
                      </td>
                      <td className="p-[4px]">
                        <div
                          className="flex items-center justify-center gap-[4px] cursor-pointer"
                          onClick={() => {
                            copyText(item.username);
                          }}
                        >
                          <span className="w-[50px] overflow-auto">
                            {item.username}
                          </span>
                          <lord-icon
                            src="https://cdn.lordicon.com/depeqmsz.json"
                            trigger="hover"
                            style={{ width: "18px", cursor: "pointer" }}
                          ></lord-icon>
                        </div>
                      </td>
                      <td className="p-[4px]">
                        <div
                          className="flex items-center justify-center gap-[4px] cursor-pointer"
                          onClick={() => {
                            copyText(item.password);
                          }}
                        >
                          <span className="w-[50px] overflow-auto">
                            {"*".repeat(item.password.length)}
                          </span>
                          <lord-icon
                            src="https://cdn.lordicon.com/depeqmsz.json"
                            trigger="hover"
                            style={{ width: "18px", cursor: "pointer" }}
                          ></lord-icon>
                        </div>
                      </td>
                      <td className="p-[4px]">
                        <div className="flex items-center justify-center gap-[4px] cursor-pointer mx-auto">
                          <span
                            onClick={() => {
                              editPassword(item.id); // Fixed this line
                            }}
                          >
                            <lord-icon
                              src="https://cdn.lordicon.com/dafdkyyt.json"
                              trigger="hover"
                              style={{ width: "18px", cursor: "pointer" }}
                            ></lord-icon>
                          </span>
                          <span
                            onClick={() => {
                              deletePassword(item.id); // Fixed this line
                            }}
                          >
                            <lord-icon
                              src="https://cdn.lordicon.com/skkahier.json"
                              trigger="hover"
                              style={{ width: "18px", cursor: "pointer" }}
                            ></lord-icon>
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default Manager;
