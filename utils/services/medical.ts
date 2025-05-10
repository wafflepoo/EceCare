import db from "@/lib/db";
import { format } from "date-fns";

export const getVitalSignData = async (id: string) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const data = await db.vitalSigns.findMany({
    where: {
      patient_id: id,
      created_at: {
        gte: sevenDaysAgo,
      },
    },
    select: {
      created_at: true,
      systolic: true,
      diastolic: true,
      heartRate: true,
    },
    orderBy: {
      created_at: "asc",
    },
  });
  // 56 - 60
  const formatVitals = data?.map((record) => ({
    label: format(new Date(record.created_at), "MMM d"),
    systolic: record.systolic,
    diastolic: record.diastolic,
  }));

  const formattedData = data.map((record) => {
    const heartRates = record.heartRate
      .split("-")
      .map((rate) => parseInt(rate.trim()));

    return {
      label: format(new Date(record.created_at), "MMM d"),
      value1: heartRates[0],
      value2: heartRates[1],
    };
  });

  const totalSystolic = data?.reduce((sum, acc) => sum + acc.systolic, 0);
  const totalDiastolic = data?.reduce((sum, acc) => sum + acc.diastolic, 0);

  const totalValue1 = formattedData?.reduce((sum, acc) => sum + acc.value1, 0);
  const totalValue2 = formattedData?.reduce((sum, acc) => sum + acc.value2, 0);

  const count = data?.length;

  const averageSystolic = totalSystolic / count;
  const averageDiastolic = totalDiastolic / count;

  const averageValue1 = totalValue1 / count;
  const averageValue2 = totalValue2 / count;

  const average = `${averageSystolic.toFixed(2)}/${averageDiastolic.toFixed(
    2
  )} mg/dL`;
  const averageHeartRate = `${averageValue1.toFixed(2)}-${averageValue2.toFixed(
    2
  )} bpm`;

  return {
    data: formatVitals,
    average,
    heartRateData: formattedData,
    averageHeartRate,
  };
};
