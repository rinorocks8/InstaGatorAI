// Import dependencies
const postPhoto = require("./index").default; // Adjust the path according to your file structure
// Mock fetch globally
global.fetch = jest.fn();

describe("postPhoto Tests", () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  test("should handle successful media container creation and posting", async () => {
    // Mock fetch for creating media container and posting it
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ id: "test_media_id" }),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ success: true }),
      });

    const mockReq = {
      body: {
        caption: "Test Caption",
        imageURL: "http://example.com/image.jpg",
        name: "Test Post",
      },
    };
    const mockRes: any = {
      status: jest.fn(() => mockRes),
      send: jest.fn(),
    };

    await postPhoto(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.send).toHaveBeenCalledWith(
      expect.objectContaining({
        post_res: { success: true },
        image_url: "http://example.com/image.jpg",
      })
    );
  });

  test("should handle failure in creating media container", async () => {
    // Mock fetch to simulate a failure in creating the media container
    (global.fetch as jest.Mock).mockRejectedValue(
      new Error("Failed to create media container")
    );

    const mockReq = {
      body: {
        caption: "Test Caption",
        imageURL: "http://example.com/image.jpg",
        name: "Test Post",
      },
    };
    const mockRes: any = {
      status: jest.fn(() => mockRes),
      send: jest.fn(),
    };

    await postPhoto(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.send).toHaveBeenCalledWith({
      error: "Internal Server Error",
    });
  });

  test("should handle failure in posting media container", async () => {
    // Mock fetch to first resolve the media container creation, then reject the posting
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ id: "test_media_id" }),
      })
      .mockRejectedValue(new Error("Failed to post media container"));

    const mockReq = {
      body: {
        caption: "Test Caption",
        imageURL: "http://example.com/image.jpg",
        name: "Test Post",
      },
    };
    const mockRes: any = {
      status: jest.fn(() => mockRes),
      send: jest.fn(),
    };

    await postPhoto(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.send).toHaveBeenCalledWith({
      error: "Internal Server Error",
    });
  });
});
