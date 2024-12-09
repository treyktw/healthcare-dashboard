import { DataTable } from "@/components/table/data-table";
import StatCard from "@/components/stat-card";
import { columns } from "@/components/table/columns";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { getRecentAppointments } from "@/lib/actions/prisma.actions";

const AdminPage = async () => {
  const appointments = await getRecentAppointments();

  return (
    <div className="mx-auto my-3 flex max-w-7xl flex-col space-y-14 overflow-y-">
      <header className="sticky top-3 z-20 mx-3 flex items-center justify-between rounded-2xl bg-dark-200 px-[5%] py-5 shadow-lg xl:px-12">
        <Link href={"/"} className="cursor-pointer">
          <Image
            src="/assets/icons/logo-full.svg"
            alt="logo"
            height={32}
            width={162}
            className="h-8 w-fit"
          />
        </Link>

        <p className="text-16-semibold">Admin Dashboard</p>
      </header>

      <main className="flex flex-col items-center space-y-6 px-[5%] pb-12 xl:space-y-12 xl:px-12">
        <section className="w-full space-y-4">
          <h1 className="header">Welcome, Admin👋</h1>
          <p className="text-dark-700">
            Start the Day with Managing new{" "}
            <span className="text-teal-500">Appointments</span>
          </p>
        </section>

        <section className="flex w-full flex-col justify-between gap-5 sm:flex-row xl:gap-10">
          <StatCard
            type="appointments"
            count={appointments.scheduledCount}
            label="Scheduled Appointments"
            icon="/assets/icons/appointments.svg"
          />
          <StatCard
            type="pending"
            count={appointments.pendingCount}
            label="Pending Appointments"
            icon="/assets/icons/pending.svg"
          />
          <StatCard
            type="cancelled"
            count={appointments.cancelledCount}
            label="Cancelled Appointments"
            icon="/assets/icons/cancelled.svg"
          />
        </section>

        <DataTable columns={columns} data={appointments.documents} />
      </main>
    </div>
  );
};

export default AdminPage;
