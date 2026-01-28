import { useEffect, useState } from "react";
import Cookies from "js-cookie";

//custom hook for checking screenwidth
export const useScreenWidth = (): number => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
};

//function for creating the antd select options with label and value
export const createSelectOption = (
  arr: any[],
  value: string,
  label: string,
) => {
  const newArr = arr?.map((item) => {
    return {
      value: item[value],
      label: item[label],
    };
  });
  return newArr;
};

export const getAuthHeaders = () => {
  try {
    // const userInfo = localStorage.getItem("userInfo");
    const userInfo = Cookies.get("userInfo");
    if (!userInfo) return {};
    // const token =
    //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YWQ4MmQ4OGU5MGRkMzBmMzFmNDU3NCIsIm5hbWUiOiJhYmhpc2hlazIiLCJlbWFpbCI6InRlc3QxQGdtYWlsLmNvbSIsInBob25lIjoiNjI4Mjk1MjYyMyIsImlhdCI6MTczOTQyNzM4MiwiZXhwIjoxNzM5NTEzNzgyfQ.xNkMHUAbnaQ6R4ms-QRebHL9Ys2eVe4ssAFd86IG1fc";

    const { token } = JSON.parse(userInfo);
    if (!token) return {};

    return { Authorization: `Bearer ${token}` };
  } catch (error) {
    console.error("Error parsing auth token:", error);
    return {};
  }
};

//comman function for checking the object is empty or not
export const isObjectEmpty = (obj: Record<string, any>): boolean => {
  return Object.keys(obj).length === 0;
};

export const isTokenExpired = (token: string | null) => {
  if (!token) return true;
  const decodedToken = JSON.parse(atob(token?.split(".")[1])); // decode the token
  // console.log(decodedToken,'decodedToken');
  const expirationTime = decodedToken.exp * 1000; // convert to milliseconds
  const currentTime = Date.now(); // get the current time in milliseconds
  return expirationTime < currentTime; // compare expiration time with current time
};

export const handleDelete = async (id: string, queryDetails: any) => {
  try {
    // console.log("Delete coach with id:", id);
    const response = await queryDetails(id);
    // alert(response.error)
    if (response?.error) {
      alert("Data deleted sucessfully");
    } else {
      alert("Data deleted sucessfully");
    }
  } catch (error) {
    alert("Failed to delete Data");
    // console.log(error, "delete error");
  }
};
