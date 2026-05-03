import express, { Request, Response } from "express";
import { getReply } from "./claude";
import { addTurn, markSeen } from "./conversations";
import { sendMessage, markRead } from "./whatsapp";

const app = express();
app.use(express.json());

// ── Webhook verification (Meta setup) ────────────────────────────────────────
app.get("/webhook", (req: Request, res: Response) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    console.log("Webhook verified");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// ── Incoming messages ─────────────────────────────────────────────────────────
app.post("/webhook", async (req: Request, res: Response) => {
  // Always ACK immediately — Meta requires 200 within 20s
  res.sendStatus(200);

  const body = req.body;
  if (body?.object !== "whatsapp_business_account") return;

  for (const entry of body.entry ?? []) {
    for (const change of entry.changes ?? []) {
      const value = change.value;
      if (change.field !== "messages") continue;

      const phoneNumberId: string = value?.metadata?.phone_number_id;

      for (const msg of value?.messages ?? []) {
        // Only handle text messages; skip status updates
        if (msg.type !== "text") continue;

        const messageId: string = msg.id;
        const from: string = msg.from; // sender's phone number
        const text: string = msg.text?.body?.trim();

        if (!text || !markSeen(messageId)) continue;

        // Mark as read (shows double blue tick)
        markRead(messageId, phoneNumberId).catch(() => null);

        console.log(`[${from}] ${text}`);

        try {
          const reply = await getReply(from, text);
          await sendMessage(from, reply);
          addTurn(from, text, reply);
          console.log(`[${from}] → ${reply.slice(0, 80)}...`);
        } catch (err) {
          console.error(`Error handling message from ${from}:`, err);
          await sendMessage(
            from,
            "Hey, something went wrong on our end. Let me connect you with our team directly."
          ).catch(() => null);
        }
      }
    }
  }
});

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => console.log(`RnB WhatsApp agent listening on :${PORT}`));
