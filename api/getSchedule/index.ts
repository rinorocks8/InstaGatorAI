import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const all_events = await getFloridaGatorsSchedule();

  // All events for the day
  const postPromises = all_events[0].events.map((event: any) => {
    console.log(
      `Triggering Post for University of Florida ${event.sport.title} game vs ${event.opponent.title}`
    );

    return fetch("http://localhost:3000/api/buildPrompt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    });
  });

  const postRes = await Promise.allSettled(postPromises);

  const successfulEvents: string[] = [];
  const failedEvents: string[] = [];

  postRes.forEach((result, index) => {
    const eventDescription = `University of Florida ${all_events[0].events[index].sport.title} game vs ${all_events[0].events[index].opponent.title}`;
    if (result.status === "fulfilled") {
      successfulEvents.push(eventDescription);
    } else {
      failedEvents.push(eventDescription);
    }
  });

  return res.status(200).send({
    message: "All events were processed.",
    posted_events: successfulEvents,
    failed_events: failedEvents,
  });
}

async function getFloridaGatorsSchedule() {
  const baseUrl = "https://floridagators.com/services/responsive-calendar.ashx";
  const queryParams = {
    type: "events",
    sport: "0",
    location: "all",
    date: getFormattedDate(),
  };
  const encodedParams = Object.entries(queryParams)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");

  const url = `${baseUrl}?${encodedParams}`;
  const response = await fetch(url);
  const all_events = await response.json();
  return all_events;
}

function getFormattedDate() {
  const now = new Date();

  const month = (now.getMonth() + 1).toString();
  const day = now.getDate().toString();
  const year = now.getFullYear();

  return `${month}/${day}/${year} 12:00:00 AM`;
}
