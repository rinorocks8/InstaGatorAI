// Mock necessary imports and modules
global.fetch = jest.fn();
const getSchedule = require("./index").default; // Adjust the path according to your file structure

describe("Florida Gators Schedule Posting Tests", () => {
  // Mock the fetch function globally before each test
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  // Test for handling no events available
  test("should handle no events available", async () => {
    // Mock getFloridaGatorsSchedule to return an empty list
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve({ events: [] }),
    });

    const mockReq = {}; // Simulate an empty request object
    const mockRes: any = {
      status: jest.fn(() => mockRes),
      send: jest.fn(),
    };

    await getSchedule(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.send).toHaveBeenCalledWith({
      message: "All events were processed.",
      posted_events: [],
      failed_events: [],
    });
  });

  // Test for successfully posting all events
  test("should successfully post all events", async () => {
    (global.fetch as jest.Mock).mockImplementation(
      (input: RequestInfo | URL) => {
        const url = input.toString().split("?")[0];
        if (
          url === "https://floridagators.com/services/responsive-calendar.ashx"
        ) {
          return Promise.resolve(
            new Response(
              JSON.stringify([
                {
                  date: "2024-04-05T00:00:00",
                  events: [
                    {
                      id: 26584,
                      date: "2024-04-05T13:00:00",
                      time: "1 p.m.",
                      conference: false,
                      location: "Gainesville, FL",
                      location_indicator: "H",
                      show_at_vs: true,
                      at_vs: "vs",
                      status: "A",
                      noplay_text: null,
                      type: "P",
                      promotion: null,
                      is_a_doubleheader: false,
                      sport: {
                        id: 0,
                        title: "Gymnastics",
                        abbreviation: "GYM",
                        shortname: "gymnastics",
                        short_display: "Gymnastics",
                        global_sport_shortname: "wgym",
                      },
                      opponent: {
                        id: 132,
                        title: "University of Utah",
                        prefix: "#5",
                        website: "http://www.utahutes.com/",
                        location: "Salt Lake City, UT",
                        conference: false,
                        mascot: "Utes",
                        image: {
                          filename: "UtahUtesLogo.png",
                          path: "/images/logos",
                          title: "University of Utah Logo",
                          alt: "University of Utah Athletics logo",
                        },
                      },
                      media: {
                        tv: null,
                        radio: null,
                        video: {
                          css_class: null,
                          title: "Live Video",
                          url: "https://www.espn.com/watch/player/_/id/c85cc1e2-5174-4338-a1f6-67baddb1e281",
                          label: null,
                        },
                        audio: null,
                        stats: {
                          css_class: null,
                          title: "Live Stats",
                          url: "https://stats.statbroadcast.com/broadcast/?id=524814",
                          label: null,
                        },
                        tickets: {
                          css_class: null,
                          title: "Tickets",
                          url: "https://am.ticketmaster.com/gators/buy?id=NjU5 ",
                          label:
                            "Tickets: University of Utah on April 5 1 p.m.",
                        },
                        preview: null,
                        gamefiles: null,
                        custom_display_fields: [],
                      },
                      result: null,
                      facility: {
                        id: 2,
                        title: "Exactech Arena at Stephen C. O'Connell Center",
                        url: "",
                      },
                      tournament: {
                        id: 761,
                        title: "NCAA Gainesville Regional",
                        website: null,
                      },
                      gamelinks: null,
                    },
                    {
                      id: 26585,
                      date: "2024-04-05T13:00:00",
                      time: "1 p.m.",
                      conference: false,
                      location: "Gainesville, FL",
                      location_indicator: "H",
                      show_at_vs: true,
                      at_vs: "vs",
                      status: "A",
                      noplay_text: null,
                      type: "P",
                      promotion: null,
                      is_a_doubleheader: false,
                      sport: {
                        id: 0,
                        title: "Gymnastics",
                        abbreviation: "GYM",
                        shortname: "gymnastics",
                        short_display: "Gymnastics",
                        global_sport_shortname: "wgym",
                      },
                      opponent: {
                        id: 82,
                        title: "Michigan State University",
                        prefix: "#10",
                        website: "http://msuspartans.com/",
                        location: "East Lansing, MI",
                        conference: false,
                        mascot: "Spartans",
                        image: {
                          filename: "Michigan-State.png",
                          path: "/images/logos",
                          title: "Michigan State University Logo",
                          alt: "Michigan State University Logo",
                        },
                      },
                      media: {
                        tv: null,
                        radio: null,
                        video: {
                          css_class: null,
                          title: "Live Video",
                          url: "https://www.espn.com/watch/player/_/id/c85cc1e2-5174-4338-a1f6-67baddb1e281",
                          label: null,
                        },
                        audio: null,
                        stats: {
                          css_class: null,
                          title: "Live Stats",
                          url: "https://stats.statbroadcast.com/broadcast/?id=524814",
                          label: null,
                        },
                        tickets: {
                          css_class: null,
                          title: "Tickets",
                          url: "https://am.ticketmaster.com/gators/buy?id=NjU5 ",
                          label:
                            "Tickets: Michigan State University on April 5 1 p.m.",
                        },
                        preview: null,
                        gamefiles: null,
                        custom_display_fields: [],
                      },
                      result: null,
                      facility: {
                        id: 2,
                        title: "Exactech Arena at Stephen C. O'Connell Center",
                        url: "",
                      },
                      tournament: {
                        id: 761,
                        title: "NCAA Gainesville Regional",
                        website: null,
                      },
                      gamelinks: null,
                    },
                  ],
                },
              ])
            )
          );
        }
        if (url === "http://localhost:3000/api/buildPrompt") {
          return Promise.resolve(
            new Response(JSON.stringify({ message: "Success" }))
          );
        }
      }
    );

    const mockReq = {};
    const mockRes: any = {
      status: jest.fn(() => mockRes),
      send: jest.fn(),
    };

    await getSchedule(mockReq, mockRes);

    // Ensure fetch was called for each event
    expect(global.fetch).toHaveBeenCalledTimes(3); // 1 for getting the schedule, 2 for the events
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.send).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "All events were processed.",
        posted_events: expect.any(Array),
        failed_events: expect.arrayContaining([]),
      })
    );
  });

  // Test for handling some events failing to post
  test("should handle some events failing to post", async () => {
    (global.fetch as jest.Mock).mockImplementation(
      (input: RequestInfo | URL) => {
        const url = input.toString().split("?")[0];
        if (
          url === "https://floridagators.com/services/responsive-calendar.ashx"
        ) {
          return Promise.resolve(
            new Response(
              JSON.stringify([
                {
                  date: "2024-04-05T00:00:00",
                  events: [
                    {
                      id: 26584,
                      date: "2024-04-05T13:00:00",
                      time: "1 p.m.",
                      conference: false,
                      location: "Gainesville, FL",
                      location_indicator: "H",
                      show_at_vs: true,
                      at_vs: "vs",
                      status: "A",
                      noplay_text: null,
                      type: "P",
                      promotion: null,
                      is_a_doubleheader: false,
                      sport: {
                        id: 0,
                        title: "Gymnastics",
                        abbreviation: "GYM",
                        shortname: "gymnastics",
                        short_display: "Gymnastics",
                        global_sport_shortname: "wgym",
                      },
                      opponent: {
                        id: 132,
                        title: "University of Utah",
                        prefix: "#5",
                        website: "http://www.utahutes.com/",
                        location: "Salt Lake City, UT",
                        conference: false,
                        mascot: "Utes",
                        image: {
                          filename: "UtahUtesLogo.png",
                          path: "/images/logos",
                          title: "University of Utah Logo",
                          alt: "University of Utah Athletics logo",
                        },
                      },
                      media: {
                        tv: null,
                        radio: null,
                        video: {
                          css_class: null,
                          title: "Live Video",
                          url: "https://www.espn.com/watch/player/_/id/c85cc1e2-5174-4338-a1f6-67baddb1e281",
                          label: null,
                        },
                        audio: null,
                        stats: {
                          css_class: null,
                          title: "Live Stats",
                          url: "https://stats.statbroadcast.com/broadcast/?id=524814",
                          label: null,
                        },
                        tickets: {
                          css_class: null,
                          title: "Tickets",
                          url: "https://am.ticketmaster.com/gators/buy?id=NjU5 ",
                          label:
                            "Tickets: University of Utah on April 5 1 p.m.",
                        },
                        preview: null,
                        gamefiles: null,
                        custom_display_fields: [],
                      },
                      result: null,
                      facility: {
                        id: 2,
                        title: "Exactech Arena at Stephen C. O'Connell Center",
                        url: "",
                      },
                      tournament: {
                        id: 761,
                        title: "NCAA Gainesville Regional",
                        website: null,
                      },
                      gamelinks: null,
                    },
                    {
                      id: 26585,
                      date: "2024-04-05T13:00:00",
                      time: "1 p.m.",
                      conference: false,
                      location: "Gainesville, FL",
                      location_indicator: "H",
                      show_at_vs: true,
                      at_vs: "vs",
                      status: "A",
                      noplay_text: null,
                      type: "P",
                      promotion: null,
                      is_a_doubleheader: false,
                      sport: {
                        id: 0,
                        title: "Gymnastics",
                        abbreviation: "GYM",
                        shortname: "gymnastics",
                        short_display: "Gymnastics",
                        global_sport_shortname: "wgym",
                      },
                      opponent: {
                        id: 82,
                        title: "Michigan State University",
                        prefix: "#10",
                        website: "http://msuspartans.com/",
                        location: "East Lansing, MI",
                        conference: false,
                        mascot: "Spartans",
                        image: {
                          filename: "Michigan-State.png",
                          path: "/images/logos",
                          title: "Michigan State University Logo",
                          alt: "Michigan State University Logo",
                        },
                      },
                      media: {
                        tv: null,
                        radio: null,
                        video: {
                          css_class: null,
                          title: "Live Video",
                          url: "https://www.espn.com/watch/player/_/id/c85cc1e2-5174-4338-a1f6-67baddb1e281",
                          label: null,
                        },
                        audio: null,
                        stats: {
                          css_class: null,
                          title: "Live Stats",
                          url: "https://stats.statbroadcast.com/broadcast/?id=524814",
                          label: null,
                        },
                        tickets: {
                          css_class: null,
                          title: "Tickets",
                          url: "https://am.ticketmaster.com/gators/buy?id=NjU5 ",
                          label:
                            "Tickets: Michigan State University on April 5 1 p.m.",
                        },
                        preview: null,
                        gamefiles: null,
                        custom_display_fields: [],
                      },
                      result: null,
                      facility: {
                        id: 2,
                        title: "Exactech Arena at Stephen C. O'Connell Center",
                        url: "",
                      },
                      tournament: {
                        id: 761,
                        title: "NCAA Gainesville Regional",
                        website: null,
                      },
                      gamelinks: null,
                    },
                  ],
                },
              ])
            )
          );
        }
        if (url === "http://localhost:3000/api/buildPrompt") {
          return Promise.resolve(
            new Response(JSON.stringify({ message: "Success" }))
          );
        }
      }
    );

    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(
        JSON.stringify([
          {
            date: "2024-04-05T00:00:00",
            events: [
              {
                id: 26584,
                date: "2024-04-05T13:00:00",
                time: "1 p.m.",
                conference: false,
                location: "Gainesville, FL",
                location_indicator: "H",
                show_at_vs: true,
                at_vs: "vs",
                status: "A",
                noplay_text: null,
                type: "P",
                promotion: null,
                is_a_doubleheader: false,
                sport: {
                  id: 0,
                  title: "Gymnastics",
                  abbreviation: "GYM",
                  shortname: "gymnastics",
                  short_display: "Gymnastics",
                  global_sport_shortname: "wgym",
                },
                opponent: {
                  id: 132,
                  title: "University of Utah",
                  prefix: "#5",
                  website: "http://www.utahutes.com/",
                  location: "Salt Lake City, UT",
                  conference: false,
                  mascot: "Utes",
                  image: {
                    filename: "UtahUtesLogo.png",
                    path: "/images/logos",
                    title: "University of Utah Logo",
                    alt: "University of Utah Athletics logo",
                  },
                },
                media: {
                  tv: null,
                  radio: null,
                  video: {
                    css_class: null,
                    title: "Live Video",
                    url: "https://www.espn.com/watch/player/_/id/c85cc1e2-5174-4338-a1f6-67baddb1e281",
                    label: null,
                  },
                  audio: null,
                  stats: {
                    css_class: null,
                    title: "Live Stats",
                    url: "https://stats.statbroadcast.com/broadcast/?id=524814",
                    label: null,
                  },
                  tickets: {
                    css_class: null,
                    title: "Tickets",
                    url: "https://am.ticketmaster.com/gators/buy?id=NjU5 ",
                    label: "Tickets: University of Utah on April 5 1 p.m.",
                  },
                  preview: null,
                  gamefiles: null,
                  custom_display_fields: [],
                },
                result: null,
                facility: {
                  id: 2,
                  title: "Exactech Arena at Stephen C. O'Connell Center",
                  url: "",
                },
                tournament: {
                  id: 761,
                  title: "NCAA Gainesville Regional",
                  website: null,
                },
                gamelinks: null,
              },
              {
                id: 26585,
                date: "2024-04-05T13:00:00",
                time: "1 p.m.",
                conference: false,
                location: "Gainesville, FL",
                location_indicator: "H",
                show_at_vs: true,
                at_vs: "vs",
                status: "A",
                noplay_text: null,
                type: "P",
                promotion: null,
                is_a_doubleheader: false,
                sport: {
                  id: 0,
                  title: "Gymnastics",
                  abbreviation: "GYM",
                  shortname: "gymnastics",
                  short_display: "Gymnastics",
                  global_sport_shortname: "wgym",
                },
                opponent: {
                  id: 82,
                  title: "Michigan State University",
                  prefix: "#10",
                  website: "http://msuspartans.com/",
                  location: "East Lansing, MI",
                  conference: false,
                  mascot: "Spartans",
                  image: {
                    filename: "Michigan-State.png",
                    path: "/images/logos",
                    title: "Michigan State University Logo",
                    alt: "Michigan State University Logo",
                  },
                },
                media: {
                  tv: null,
                  radio: null,
                  video: {
                    css_class: null,
                    title: "Live Video",
                    url: "https://www.espn.com/watch/player/_/id/c85cc1e2-5174-4338-a1f6-67baddb1e281",
                    label: null,
                  },
                  audio: null,
                  stats: {
                    css_class: null,
                    title: "Live Stats",
                    url: "https://stats.statbroadcast.com/broadcast/?id=524814",
                    label: null,
                  },
                  tickets: {
                    css_class: null,
                    title: "Tickets",
                    url: "https://am.ticketmaster.com/gators/buy?id=NjU5 ",
                    label:
                      "Tickets: Michigan State University on April 5 1 p.m.",
                  },
                  preview: null,
                  gamefiles: null,
                  custom_display_fields: [],
                },
                result: null,
                facility: {
                  id: 2,
                  title: "Exactech Arena at Stephen C. O'Connell Center",
                  url: "",
                },
                tournament: {
                  id: 761,
                  title: "NCAA Gainesville Regional",
                  website: null,
                },
                gamelinks: null,
              },
            ],
          },
        ])
      )
    );

    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true }); // First post succeeds
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Failed to fetch")
    );

    const mockReq = {};
    const mockRes: any = {
      status: jest.fn(() => mockRes),
      send: jest.fn(),
    };

    await getSchedule(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.send).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "All events were processed.",
        posted_events: expect.any(Array),
        failed_events: expect.any(Array),
      })
    );
    expect(mockRes.send.mock.calls[0][0].posted_events).toHaveLength(1);
    expect(mockRes.send.mock.calls[0][0].failed_events).toHaveLength(1);
  });

  test("should handle failure in fetching the schedule", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Failed to fetch schedule")
    );

    const mockReq = {};
    const mockRes: any = {
      status: jest.fn(() => mockRes),
      send: jest.fn(),
    };

    await getSchedule(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.send).toHaveBeenCalledWith({
      error: "Internal Server Error",
    });
  });
});
