import React from "react";
import { render } from "@testing-library/react";
import '@testing-library/jest-dom';
import { useNavigate } from "react-router-dom";
import Logout from "./Logout"; 
import LogoutButton from "./LogoutButton"; 

// Mocking useNavigate
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn()
}));

describe("Logout", () => {
  test("renders the logging out message and navigates to home after timeout", () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
    jest.useFakeTimers();

    const { getByText } = render(<Logout />);

    expect(getByText("Logging out...")).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();

    // Fast-forward time
    jest.advanceTimersByTime(2000);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/");

    jest.useRealTimers();  // Clean up and use the real timers
  });
});




