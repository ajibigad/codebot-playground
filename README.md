# Simple Browser Calculator

A simple, clean browser-based calculator application that performs basic arithmetic operations.

## Features

- Basic arithmetic operations: addition, subtraction, multiplication, and division
- Decimal number support
- Clear and backspace functionality
- Error handling for division by zero
- Clean, modern user interface
- Fun confetti animation that triggers at random intervals (10-60 seconds) during inactivity
- Countdown timer showing when next confetti will appear
- Fully tested with Jest

## Getting Started

### Prerequisites

- Node.js and npm installed on your system

### Installation

1. Clone or download this repository
2. Install dependencies:
```bash
npm install
```

### Running the Application

Start the local development server:
```bash
npm run serve
```

This will start a live-server on port 8080 and automatically open the calculator in your default browser.

Alternatively, you can simply open `index.html` directly in any web browser.

## Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Generate coverage report:
```bash
npm run test:coverage
```

## Project Structure

```
.
├── index.html          # Main HTML file
├── style.css           # Styling
├── script.js           # Calculator logic
├── script.test.js      # Jest tests
├── package.json        # Dependencies and scripts
├── jest.config.js      # Jest configuration
├── favicon.svg         # Calculator favicon
├── .gitignore          # Git ignore rules
├── CLAUDE.md           # Claude Code instructions
└── README.md           # Project documentation
```

## Usage

- Click number buttons (0-9) to input numbers
- Click operation buttons (+, -, ×, ÷) to perform calculations
- Click "=" to see the result
- Click "C" to clear the display
- Click "⌫" to delete the last character
- Watch the countdown timer at the top to see when the next confetti celebration will trigger
- Any button click resets the confetti timer to a new random interval

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript
- Jest (for testing)
- live-server (for development)
- canvas-confetti (for animations)

## License

ISC

