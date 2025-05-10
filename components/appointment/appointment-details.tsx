"use client"

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { SmallCard } from "../small-card";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { FaVideo } from "react-icons/fa"; // Importer l'icône d'appel vidéo
import Link from "next/link"; // Pour gérer les redirections avec des liens

interface AppointmentDetailsProps {
  id: number | string;
  patient_id: string;
  appointment_date: Date;
  time: string;
  notes?: string;
}

export const AppointmentDetails = ({
  id,
  patient_id,
  appointment_date,
  time,
  notes,
}: AppointmentDetailsProps) => {
  const [videoCallUrl, setVideoCallUrl] = useState<string | null>(null);

  useEffect(() => {
    // Demander à l'API de créer une salle vidéo et récupérer l'URL
    const fetchVideoCallUrl = async () => {
      try {
        const response = await fetch("/api/video-call/create-video-call", {
          method: "POST",
          body: JSON.stringify({ appointmentId: id }),
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        if (data.videoCallUrl) {
          setVideoCallUrl(data.videoCallUrl);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du lien vidéo", error);
      }
    };

    fetchVideoCallUrl();
  }, [id]);

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Appointment Information</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex">
          <SmallCard label="Appointment #" value={`# ${id}`} />
          <SmallCard label="Date" value={format(appointment_date, "MMM d, yyyy")} />
          <SmallCard label="Time" value={time} />
          <a
             target="_blank"
             rel="noopener noreferrer"
             className="flex items-center gap-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            href="templates/index.html">
             <FaVideo size={20} />
             <span>Join Video Call</span>
            
           </a>
         
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium">Additional Notes</span>
            <p className="text-sm text-gray-500">{notes || "No notes"}</p>
          </div>

          
           
          
         
          
        </div>
      </CardContent>
    </Card>
  );
};
