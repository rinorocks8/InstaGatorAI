jest.mock("openai", () => {
  const mockGenerate = jest.fn(); // Prepare to capture this in the factory function scope
  class MockOpenAI {
    constructor() {
      (this as any).images = {
        generate: mockGenerate,
      };
    }
  }
  return {
    __esModule: true,
    default: MockOpenAI,
    mockGenerate, // Exporting this allows us to manipulate it directly in tests
  };
});
global.fetch = jest.fn();
const requestDalle = require("./index").default;

describe("requestDalle Tests", () => {
  beforeEach(() => {
    // Reset the mock before each test to clear previous configurations
    (global.fetch as jest.Mock).mockReset();

    const { mockGenerate } = require("openai");
    mockGenerate.mockResolvedValue({
      data: [{ url: "https://example.com/mocked_image_url.jpg" }],
    });
  });

  test("should generate image URL successfully", async () => {
    const mockReq = {
      body: {
        prompt: "Custom prompt here",
        name: "Custom name here",
      },
    };
    const mockRes: any = {
      status: jest.fn(() => mockRes),
      send: jest.fn(),
    };

    await requestDalle(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.send).toHaveBeenCalledWith({
      message: "https://example.com/mocked_image_url.jpg",
    });
  });

  test("should handle image generation failure", async () => {
    // Reset the mock for this specific test case to simulate a failure
    const { mockGenerate } = require("openai");
    mockGenerate.mockRejectedValue(new Error("Failed to generate image"));

    const mockReq = {
      body: {
        prompt: "Custom prompt here",
        name: "Custom name here",
      },
    };
    const mockRes: any = {
      status: jest.fn(() => mockRes),
      send: jest.fn(),
    };

    await requestDalle(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.send).toHaveBeenCalledWith({
      error: "Internal Server Error",
    });
  });
});
