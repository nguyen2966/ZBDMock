import videos from "../data/videos.json";

function randomItems(items, count) {
  return [...items]
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
}


export default function handler(req, res) {
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // Chỉ cho phép GET
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method Not Allowed"
    });
  }
  
  const selectedVideos = randomItems(videos, 10);

  const now = new Date();
  const expiresAt = new Date(now.getTime() + 60 * 60 * 1000);

  const feed = {
    feedKey: "for_you",

    generationId:
      `gen_${now.toISOString().replace(/\D/g, "").slice(0, 12)}`,

    rankingExperimentId: "exp_feed_ranking_v1",

    rankingVariantKey: "treatment_b",

    rankingConfigVersion: 3,

    generatedAt: now.toISOString(),

    expiresAt: expiresAt.toISOString(),

    items: selectedVideos.map((video, index) => ({
      position: index,
      serverScore: Number(
        (8 + Math.random() * 2).toFixed(2)
      ),
      video
    }))
  };

  res.status(200).json(feed);
}