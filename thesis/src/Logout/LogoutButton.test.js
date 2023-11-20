import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("LogoutButton", () => {
  it("navigates to /logout when clicked", () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    const { getByText } = render(<LogoutButton />);

    const logoutButton = getByText("Logout");
    fireEvent.click(logoutButton);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/logout");
  });
});
