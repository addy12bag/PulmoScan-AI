import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";
import React from "react";

beforeEach(() => {
  // Prevent jsdom errors from window.close in the UI
  window.close = jest.fn();
});

test("renders header and CTA", () => {
  render(<App />);

  expect(screen.getByText(/PulmoScan AI Console/i)).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /Analyze sample/i })
  ).toBeInTheDocument();
});

test("guards against missing patient info", () => {
  render(<App />);

  fireEvent.click(screen.getByRole("button", { name: /Analyze sample/i }));

  expect(
    screen.getByText(/Please complete patient name, age, and gender/i)
  ).toBeInTheDocument();
});
