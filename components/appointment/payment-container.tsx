import db from "@/lib/db";
import { Table } from "../tables/table";
import { Payment } from "@prisma/client";
import { format } from "date-fns";
import { ViewAction } from "../action-options";
import { checkRole } from "@/utils/roles";
import { ActionDialog } from "../action-dialog";

const columns = [
  {
    header: "No",
    key: "id",
  },
  {
    header: "Bill Date",
    key: "bill_date",
    className: "",
  },
  {
    header: "Payment Date",
    key: "pay_date",
    className: "hidden md:table-cell",
  },
  {
    header: "Total",
    key: "total",
    className: "",
  },
  {
    header: "Discount",
    key: "discount",
    className: "hidden xl:table-cell",
  },
  {
    header: "Payable",
    key: "payable",
    className: "hidden xl:table-cell",
  },
  {
    header: "Paid",
    key: "payable",
    className: "hidden xl:table-cell",
  },
  {
    header: "Actions",
    key: "action",
  },
];

export const PaymentsContainer = async ({
  patientId,
}: {
  patientId: string;
}) => {
  const data = await db.payment.findMany({
    where: { patient_id: patientId },
  });

  if (!data) return null;
  const isAdmin = await checkRole("ADMIN");

  const renderRow = (item: Payment) => {
    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-slate-50"
      >
        <td className="flex items-center gap-2 md:gap-4 py-2 xl:py-4">
          #{item?.id}
        </td>

        <td className="lowercase">{format(item?.bill_date, "MMM d, yyyy")}</td>
        <td className="hidden  items-center py-2  md:table-cell">
          {format(item?.payment_date, "MMM d, yyyy")}
        </td>
        <td className="">{item?.total_amount.toFixed(2)}</td>
        <td className="hidden xl:table-cell">{item?.discount.toFixed(2)}</td>
        <td className="hidden xl:table-cell">
          {(item?.total_amount - item?.discount).toFixed(2)}
        </td>
        <td className="hidden xl:table-cell">{item?.amount_paid.toFixed(2)}</td>

        <td className="">
          <div className="flex items-center">
            <ViewAction
              href={`/record/appointments/${item?.appointment_id}?cat=bills`}
            />
            {isAdmin && (
              <ActionDialog
                type="delete"
                deleteType="payment"
                id={item?.id.toString()}
              />
            )}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-white rounded-xl p-2 md:p-4 2xl:p-6">
      <div className="flex items-center justify-between">
        <div className="hidden lg:flex items-center gap-1">
          <p className="text-2xl font-semibold">{data?.length ?? 0}</p>
          <span className="text-gray-600 text-sm xl:text-base">
            total records
          </span>
        </div>
      </div>

      <Table columns={columns} renderRow={renderRow} data={data} />
    </div>
  );
};
