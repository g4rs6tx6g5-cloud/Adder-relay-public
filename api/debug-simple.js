export default async function handler(req, res) {
  return res.json({ works: true, message: "The relay route is LIVE" });
}