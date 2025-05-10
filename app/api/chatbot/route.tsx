import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, SenderType } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDETuHowjpdzAd5wcsq7MreGcJN2TIpCRM";

// Fonction utilitaire pour normaliser les accents, majuscules, etc.
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Supprime accents
    .replace(/[^\w\s]/gi, "") // Supprime ponctuations spéciales
    .trim();
}

// Fonction pour aérer et formater la réponse
function formatReply(reply: string): string {
  // Ajouter un saut de ligne après chaque astérisque avant de supprimer les astérisques (gras/italique)
  return reply
    .replace(/\*/g, "\n*") // Ajouter un saut de ligne avant chaque astérisque
    .replace(/\*{1,2}([^\*]+)\*{1,2}/g, "$1") // Enlève le gras et l'italique (enlève les *)
    .replace(/\n/g, "\n\n") // Double les sauts de ligne
    .replace(/^\s*\*\s+/gm, "") // Enlève les puces dans les lignes (par exemple "* ")
    .replace(/([.!?])(\s+|$)/g, "$1\n\n") // Ajoute un saut de ligne après chaque point (ou point d'interrogation, ou point d'exclamation)
    .trim();
}



export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json({ error: "Message requis" }, { status: 400 });
    }

    let session = await prisma.chatSession.findFirst({
      where: {
        patient_id: userId,
        ended_at: null,
      },
    });

    if (!session) {
      session = await prisma.chatSession.create({
        data: {
          patient_id: userId,
        },
      });
    }

    await prisma.chatMessage.create({
      data: {
        session_id: session.id,
        sender: SenderType.PATIENT,
        message,
      },
    });

    // Prompt enrichi et intelligent
    const fullPrompt = `
Tu es un assistant médical intelligent et bienveillant.

Le patient a écrit : "${message}"

Objectifs :
Analyse les symptômes mentionnés.

Si les symptômes sont bénins ou peu clairs, pose des questions complémentaires ou donne des conseils simples (repos, hydratation, etc.).

Propose une consultation médicale seulement si c'est justifié, et précise dans ce cas la spécialité médicale adaptée (ex: dermatologie, cardiologie...).

Si aucun médecin n'est requis, réponds "aucune consultation nécessaire".

Réponds de manière claire et empathique.
    `;

    const geminiResponse = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: fullPrompt }],
          },
        ],
      }),
    });

    const data = await geminiResponse.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "Désolé, je n'ai pas compris.";

    // Liste de spécialités en version normalisée
    const specialties = [
      "cardiologie",
      "dermatologie",
      "gynecologie",
      "neurologie",
      "pneumologie",
      "pediatrie",
      "psychiatrie",
      "gastroenterologie",
      "orthopedie",
      "ophtalmologie",
      "urologie",
      "medecin generaliste",
    ];

    const normalizedReply = normalizeText(reply);

    const suggestedSpecialty = specialties.find((s) =>
      normalizedReply.includes(normalizeText(s))
    );

    let finalReply = reply;

    if (suggestedSpecialty) {
      // Obtenir le jour et l'heure actuels
      const now = new Date();
      const currentDay = now.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
      const currentHour = now.toTimeString().slice(0, 5); // format "HH:mm"

      // Recherche du médecin disponible avec les horaires dans working_days
      const doctor = await prisma.doctor.findFirst({
        where: {
          specialization: {
            equals: suggestedSpecialty,
            mode: "insensitive",
          },
        },
        
      });

      if (doctor) {
        const availableDays = doctor;

        finalReply += `
        
Souhaitez-vous consulter le Dr ${doctor.name}, spécialiste en ${doctor.specialization} ?

        `;
      } else {
        finalReply += `
        
Je n’ai pas trouvé de médecin disponible en ${suggestedSpecialty} pour le moment.
        `;
      }
    }

    // Appliquer le formatage automatique
    finalReply = formatReply(finalReply);

    await prisma.chatMessage.create({
      data: {
        session_id: session.id,
        sender: SenderType.BOT,
        message: finalReply,
      },
    });

    return NextResponse.json({ reply: finalReply });
  } catch (error) {
    console.error("Erreur API Chatbot:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
