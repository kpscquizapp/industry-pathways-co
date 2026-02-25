import { useEffect, useState } from "react";
import Cookies from "js-cookie";

//custom hook for checking screenwidth
export const useScreenWidth = (): number => {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0,
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

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

const decodeJwt = (token: string): { exp?: number } | null => {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    // Replace URL-safe characters and add padding
    const base64 = part
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(part.length + ((4 - (part.length % 4)) % 4), "=");
    return JSON.parse(atob(base64));
  } catch (e) {
    console.error("JWT Decode error:", e);
    return null;
  }
};

// Returns expiry timestamp in ms
export const getTokenExpiry = (token: string): number => {
  const decoded = decodeJwt(token);
  if (!decoded || typeof decoded.exp !== "number") {
    throw new Error("Invalid token or no exp claim");
  }
  return decoded.exp * 1000;
};

export const isTokenExpired = (token: string | null) => {
  if (!token) return true;
  try {
    return getTokenExpiry(token) < Date.now();
  } catch {
    return true;
  }
};

export const handleDelete = async (id: string, queryDetails: any) => {
  try {
    const response = await queryDetails(id);
    if (response?.error) {
      alert("Failed to delete data");
    } else {
      alert("Data deleted successfully");
    }
  } catch (error) {
    alert("Failed to delete data");
  }
};
