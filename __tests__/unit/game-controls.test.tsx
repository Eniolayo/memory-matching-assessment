import { render, screen, fireEvent } from "@testing-library/react"
import GameControls from "@/components/game-controls"

describe("GameControls Component", () => {
  const mockOnRestart = jest.fn()

  it("renders clicks counter correctly", () => {
    render(<GameControls clicks={42} bestScore={null} onRestart={mockOnRestart} />)

    expect(screen.getByText("Clicks")).toBeInTheDocument()
    expect(screen.getByText("42")).toBeInTheDocument()
  })

  it("does not render best score when null", () => {
    render(<GameControls clicks={10} bestScore={null} onRestart={mockOnRestart} />)

    expect(screen.queryByText("Best Score")).not.toBeInTheDocument()
  })

  it("renders best score when available", () => {
    render(<GameControls clicks={10} bestScore={8} onRestart={mockOnRestart} />)

    expect(screen.getByText("Best Score")).toBeInTheDocument()
    expect(screen.getByText("8")).toBeInTheDocument()
  })

  it("calls onRestart when restart button is clicked", () => {
    render(<GameControls clicks={10} bestScore={8} onRestart={mockOnRestart} />)

    fireEvent.click(screen.getByText("Restart Game"))
    expect(mockOnRestart).toHaveBeenCalledTimes(1)
  })
})

