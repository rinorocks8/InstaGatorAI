jest.mock("openai", () => {
  const mockCreate = jest.fn(); // Prepare to capture this in the factory function scope
  class MockOpenAI {
    constructor() {
      (this as any).chat = {
        completions: {
          create: mockCreate,
        },
      };
    }
  }
  return {
    __esModule: true,
    default: MockOpenAI,
    mockCreate, // Exporting this allows us to manipulate it directly in tests
  };
});
global.fetch = jest.fn();
const buildPrompt = require("./index").default;

describe("buildPrompt Tests", () => {
  beforeEach(() => {
    // Reset the mock before each test to clear previous configurations
    (global.fetch as jest.Mock).mockReset();

    const { mockCreate } = require("openai");
    mockCreate.mockReset();
    mockCreate
      .mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: "Mocked caption here",
            },
          },
        ],
      })
      .mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: "Mocked response here",
            },
          },
        ],
      });
  });

  test("buildPrompt No event", async () => {
    const mockReq = {
      body: {},
    };
    const mockRes: any = {
      status: jest.fn(() => mockRes),
      send: jest.fn(),
    };

    await buildPrompt(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.send).toHaveBeenCalledWith({
      error: "No event provided",
    });
  });

  test("buildPrompt with Event, fail dalle", async () => {
    (global.fetch as jest.Mock).mockImplementation(
      (input: RequestInfo | URL) => {
        const url = input instanceof URL ? input.href : input.toString();
        if (url === "http://localhost:3000/api/requestDalle") {
          return Promise.reject(new Error("Failed to fetch"));
        }
      }
    );

    const mockReq = {
      body: {
        sport: { title: "Football" },
        opponent: { title: "FSU", mascot: "Seminole" },
        time: "Today",
      },
    };
    const mockRes: any = {
      status: jest.fn(() => mockRes),
      send: jest.fn(),
    };

    await buildPrompt(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.send).toHaveBeenCalledWith({
      error: "Internal Server Error",
    });
  });

  test("buildPrompt with Event, mock dalle, fail post", async () => {
    (global.fetch as jest.Mock).mockImplementation(
      (input: RequestInfo | URL) => {
        const url = input instanceof URL ? input.href : input.toString();
        if (url === "http://localhost:3000/api/requestDalle") {
          return Promise.resolve(
            new Response(JSON.stringify({ message: "fakeDalleURL" }))
          );
        }
        if (url === "http://localhost:3000/api/postPhoto") {
          return Promise.reject(new Error("Failed to fetch"));
        }
      }
    );

    const mockReq = {
      body: {
        sport: { title: "Football" },
        opponent: { title: "FSU", mascot: "Seminole" },
        time: "Today",
      },
    };
    const mockRes: any = {
      status: jest.fn(() => mockRes),
      send: jest.fn(),
    };

    await buildPrompt(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.send).toHaveBeenCalledWith({
      error: "Internal Server Error",
    });
  });

  test("buildPrompt with Event, mock dalle, mock post", async () => {
    (global.fetch as jest.Mock).mockImplementation(
      (input: RequestInfo | URL) => {
        const url = input instanceof URL ? input.href : input.toString();
        if (url === "http://localhost:3000/api/requestDalle") {
          return Promise.resolve(
            new Response(JSON.stringify({ message: "fakeDalleURL" }))
          );
        }
        if (url === "http://localhost:3000/api/postPhoto") {
          return Promise.resolve(
            new Response(JSON.stringify({ message: "Success" }))
          );
        }
      }
    );

    const mockReq = {
      body: {
        sport: { title: "Football" },
        opponent: { title: "FSU", mascot: "Seminole" },
        time: "Today",
      },
    };
    const mockRes: any = {
      status: jest.fn(() => mockRes),
      send: jest.fn(),
    };

    await buildPrompt(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.send).toHaveBeenCalledWith({
      message: "Successfully posted to Instagram",
    });
  });
});
