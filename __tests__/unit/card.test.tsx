"use client";

import { render, screen, fireEvent } from "@testing-library/react";
import Card from "@/components/card";
import { describe, it, expect } from "@jest/globals";

describe("Card Component", () => {
  const mockCard = {
    id: 1,
    pairId: 2,
    imageUrl: "https://picsum.photos/200?random=123",
  };

  const mockOnClick = jest.fn();

  it("renders correctly when not flipped", () => {
    render(
      <Card
        card={mockCard}
        isFlipped={false}
        isMatched={false}
        onClick={mockOnClick}
      />
    );

    // Should show question mark when not flipped
    expect(screen.getByText("?")).toBeInTheDocument();

    // Should not load the image when not flipped
    expect(
      screen.queryByAltText(`Card ${mockCard.id}`)
    ).not.toBeInTheDocument();
  });

  it("renders correctly when flipped", () => {
    render(
      <Card
        card={mockCard}
        isFlipped={true}
        isMatched={false}
        onClick={mockOnClick}
      />
    );

    // Should still have the question mark element (but it will be hidden by CSS)
    expect(screen.getByText("?")).toBeInTheDocument();

    // Should load the image when flipped
    expect(screen.getByAltText(`Card ${mockCard.id}`)).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    render(
      <Card
        card={mockCard}
        isFlipped={false}
        isMatched={false}
        onClick={mockOnClick}
      />
    );

    fireEvent.click(screen.getByRole("button"));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("applies matched styling when card is matched", () => {
    render(
      <Card
        card={mockCard}
        isFlipped={true}
        isMatched={true}
        onClick={mockOnClick}
      />
    );

    const cardElement = screen.getByRole("button");
    expect(cardElement).toHaveClass("scale-95");
    expect(cardElement).toHaveClass("opacity-80");
  });
});
