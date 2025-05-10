import db from "@/lib/db";
import { calculateDiscount } from "@/utils";
import { checkRole } from "@/utils/roles";
import { ReceiptText } from "lucide-react";
import { Table } from "../tables/table";
import { PatientBills } from "@prisma/client";
import { format } from "date-fns";
import { ActionDialog } from "../action-dialog";
import { Separator } from "../ui/separator";
import { AddBills } from "../dialogs/add-bills";
import { GenerateFinalBills } from "./generate-final-bill";

const columns = [
  {
    header: "No",
    key: "no",
    className: "hidden md:table-cell",
  },
  {
    header: "Service",
    key: "service",
  },
  {
    header: "Date",
    key: "date",
    className: "",
  },
  {
    header: "Quantity",
    key: "qnty",
    className: "hidden md:table-cell",
  },
  {
    header: "Unit Price",
    key: "price",
    className: "hidden md:table-cell",
  },
  {
    header: "Total Cost",
    key: "total",
    className: "",
  },
  {
    header: "Action",
    key: "action",
    className: "hidden xl:table-cell",
  },
];

interface ExtendedBillProps extends PatientBills {
  service: {
    service_name: string;
    id: number;
  };
}

export const BillsContainer = async ({ id }: { id: string }) => {
  const [data, servicesData] = await Promise.all([
    db.payment.findFirst({
      where: { appointment_id: Number(id) },
      include: {
        bills: {
          include: {
            service: { select: { service_name: true, id: true } },
          },
          orderBy: { created_at: "asc" },
        },
      },
    }),
    db.services.findMany(),
  ]);

  let totalBills = 0;

  const billData = data?.bills || [];
  const discount = data
    ? calculateDiscount({
        amount: data?.total_amount,
        discount: data?.discount,
      })
    : null;

  if (billData) {
    totalBills = billData.reduce((sum, acc) => sum + acc.total_cost, 0);
  }

  const renderRow = (item: ExtendedBillProps) => {
    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-slate-50"
      >
        <td className="hidden md:table-cell py-2 xl:py-6"># {item?.id}</td>

        <td className="items-center py-2">{item?.service?.service_name}</td>

        <td className="">{format(item?.service_date, "MMM d, yyyy")}</td>

        <td className="hidden items-center py-2  md:table-cell">
          {item?.quantity}
        </td>
        <td className="hidden lg:table-cell">{item?.unit_cost.toFixed(2)}</td>
        <td>{item?.total_cost.toFixed(2)}</td>

        <td className="hidden xl:table-cell">
          <ActionDialog
            type="delete"
            id={item?.id.toString()}
            deleteType="bill"
          />
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-white rounded-xl p-2 2xl:p-4">
      <div className="w-full flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div className="">
          <h1 className="font-semibold text-xl">Patient Bills</h1>
          <div className="hidden lg:flex items-center gap-1">
            <ReceiptText size={20} className="text-gray-500" />
            <p className="text-2xl font-semibold">{billData?.length}</p>
            <span className="text-gray-600 text-sm xl:text-base">
              total records
            </span>
          </div>
        </div>

        {((await checkRole("ADMIN")) || (await checkRole("DOCTOR"))) && (
          <div className="flex items-center mt-5 justify-end">
            {servicesData && servicesData.length > 0 ? (
              <AddBills id={data?.id} appId={id} servicesData={servicesData} />
            ) : (
              <p>No services available</p>
            )}

            <GenerateFinalBills id={data?.id} total_bill={totalBills} />
          </div>
        )}
      </div>

      <Table columns={columns} renderRow={renderRow} data={billData!} />

      <Separator />

      <div className="flex flex-wrap lg:flex-nowrap items-center justify-between md:text-center py-2 space-y-6">
        <div className="w-[120px]">
          <span className="text-gray-500">Total Bill</span>
          <p className="text-xl font-semibold">
            {(data?.total_amount || totalBills).toFixed(2)}
          </p>
        </div>
        <div className="w-[120px]">
          <span className="text-gray-500">Discount</span>
          <p className="text-xl font-semibold text-yellow-600">
            {(data?.discount || 0.0).toFixed(2)}{" "}
            <span className="text-sm text-gray-600">
              {" "}
              ({discount?.discountPercentage?.toFixed(2) || "0.0"}%)
            </span>
          </p>
        </div>
        <div className="w-[120px]">
          <span className="text-gray-500">Payable</span>
          <p className="text-xl font-semibold ">
            {(discount?.finalAmount || 0.0).toFixed(2)}
          </p>
        </div>
        <div className="w-[120px]">
          <span className="text-gray-500">Amount Paid</span>
          <p className="text-xl font-semibold text-emerald-600">
            {(data?.amount_paid || 0.0).toFixed(2)}
          </p>
        </div>
        <div className="w-[120px]">
          <span className="text-gray-500">Unpaid Amount</span>
          <p className="text-xl font-semibold text-red-600">
            {(discount?.finalAmount! - data?.amount_paid! || 0.0).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};
