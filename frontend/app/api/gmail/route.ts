import { NextResponse } from "next/server";

export async function GET() {
  const emails = [
    {
      subject: "Amazon Order Delivered",
      category: "Shopping",
    },
    {
      subject: "Meeting Tomorrow",
      category: "Work",
    },
    {
      subject: "50% OFF Sale",
      category: "Promotions",
    },
  ];

  return NextResponse.json(emails);
}